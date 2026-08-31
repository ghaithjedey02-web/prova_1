import { consoleConfigured, streamConsole, type ConsoleEvent, type ConsoleTurn } from '@dolmir/ai-core/console';

/**
 * PARLA CON DOLMIR — the server side.
 *
 * Browser → this route → Anthropic (tool loop over the simulated company) →
 * back as Server-Sent Events, so the interface can show each step the moment
 * it happens instead of waiting for a finished paragraph. Credentials live in
 * ANTHROPIC_API_KEY on the server; nothing secret ever reaches the client, and
 * the model can only reach the demo-company tools — there is no path from this
 * route to a real customer system.
 *
 * Without a key the route answers 503 and the console falls back to its
 * scripted mode, saying so in the interface.
 *
 * The guards are deliberately blunt for a public demo: bounded history,
 * bounded message length, a small per-IP rate bucket (per instance — enough to
 * stop a loop, not a substitute for an edge WAF), and an abort signal so a
 * visitor who interrupts also stops the model.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_TURNS = 16;
const MAX_CHARS = 600;
const RATE_LIMIT = 12;           // requests
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

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export async function POST(req: Request) {
  if (!consoleConfigured()) return json({ error: 'unconfigured' }, 503);

  const ip = (req.headers.get('x-forwarded-for') ?? 'local').split(',')[0]!.trim();
  if (limited(ip)) return json({ error: 'rate_limited' }, 429);

  let body: { messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'bad_request' }, 400);
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
    return json({ error: 'bad_request' }, 400);
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let open = true;
      const send = (e: ConsoleEvent) => {
        if (!open) return;
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(e)}\n\n`));
        } catch {
          open = false;
        }
      };
      try {
        await streamConsole(history, send, req.signal);
      } catch {
        send({ type: 'delta', text: '' });
        if (open) controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error' })}\n\n`));
      } finally {
        open = false;
        try { controller.close(); } catch { /* already closed by the client */ }
      }
    },
  });

  return new Response(stream, {
    headers: {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-cache, no-transform',
      connection: 'keep-alive',
      'x-accel-buffering': 'no',
    },
  });
}
