import { speak, ttsConfigured } from '@dolmir/ai-core/tts';

/**
 * The console's voice.
 *
 * Browser → this route → a neural TTS provider → MP3 back. The provider key
 * lives in the server environment and never reaches the client; the browser
 * only ever sees audio bytes.
 *
 * 503 when no provider is configured is a normal answer, not a failure: the
 * client falls back to browser synthesis and says nothing about it. What it
 * must never do is pretend the browser voice is the product voice.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_CHARS = 900;
const RATE_LIMIT = 40;
const RATE_WINDOW_MS = 60_000;

const buckets = new Map<string, { n: number; t: number }>();

function limited(ip: string): boolean {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now - b.t > RATE_WINDOW_MS) { buckets.set(ip, { n: 1, t: now }); return false; }
  b.n += 1;
  return b.n > RATE_LIMIT;
}

export async function POST(req: Request) {
  if (!ttsConfigured()) {
    return new Response(JSON.stringify({ error: 'unconfigured' }), {
      status: 503,
      headers: { 'content-type': 'application/json' },
    });
  }

  const ip = (req.headers.get('x-forwarded-for') ?? 'local').split(',')[0]!.trim();
  if (limited(ip)) {
    return new Response(JSON.stringify({ error: 'rate_limited' }), {
      status: 429,
      headers: { 'content-type': 'application/json' },
    });
  }

  let text: string;
  try {
    const body = (await req.json()) as { text?: unknown };
    text = typeof body.text === 'string' ? body.text.slice(0, MAX_CHARS).trim() : '';
  } catch {
    return new Response(JSON.stringify({ error: 'bad_request' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }
  if (!text) {
    return new Response(JSON.stringify({ error: 'bad_request' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    const out = await speak(text, req.signal);
    return new Response(out.body as BodyInit, {
      headers: {
        'content-type': out.contentType,
        'cache-control': 'no-store',
      },
    });
  } catch {
    // The client falls back to the browser voice rather than going silent.
    return new Response(JSON.stringify({ error: 'upstream' }), {
      status: 502,
      headers: { 'content-type': 'application/json' },
    });
  }
}
