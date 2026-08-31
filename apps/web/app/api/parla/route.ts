import { NextResponse } from 'next/server';
import { consoleConfigured, runConsole, type ConsoleTurn } from '@dolmir/ai-core/console';

/**
 * PARLA CON DOLMIR — the server side.
 *
 * Browser → this route → Anthropic (tool loop over the simulated company)
 * → back. Credentials live in ANTHROPIC_API_KEY on the server; nothing
 * secret ever reaches the client. Without a key the route answers 503 and
 * the console falls back to its scripted mode, saying so.
 *
 * The guards are deliberately blunt for a public demo: bounded history,
 * bounded message length, and a small per-IP rate bucket (per instance —
 * enough to stop a loop, not a substitute for an edge WAF).
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_TURNS = 12;
const MAX_CHARS = 600;
const RATE_LIMIT = 10;           // requests
const RATE_WINDOW_MS = 60_000;   // per minute per IP

const buckets = new Map<string, { n: number; t: number }>();

function limited(ip: string): boolean {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now - b.t > RATE_WINDOW_MS) {
    buckets.set(ip, { n: 1, t: now });
    return false;
  }
  b.n += 1;
  return b.n > RATE_LIMIT;
}

export async function POST(req: Request) {
  if (!consoleConfigured()) {
    return NextResponse.json({ error: 'unconfigured' }, { status: 503 });
  }

  const ip = (req.headers.get('x-forwarded-for') ?? 'local').split(',')[0]!.trim();
  if (limited(ip)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  let body: { messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  const raw = Array.isArray(body.messages) ? body.messages : [];
  const history: ConsoleTurn[] = [];
  for (const m of raw.slice(-MAX_TURNS)) {
    if (!m || typeof m !== 'object') continue;
    const role = (m as { role?: unknown }).role;
    const content = (m as { content?: unknown }).content;
    if ((role === 'user' || role === 'assistant') && typeof content === 'string' && content.trim()) {
      history.push({ role, content: content.slice(0, MAX_CHARS) });
    }
  }
  if (!history.length || history[history.length - 1]!.role !== 'user') {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  try {
    const reply = await runConsole(history);
    return NextResponse.json(reply);
  } catch {
    return NextResponse.json({ error: 'upstream' }, { status: 502 });
  }
}
