import { NextResponse } from 'next/server';

/**
 * Contact endpoint.
 *
 * Validates the intake, drops obvious spam, and hands the message to a mail
 * provider when one is configured. Without a provider it answers an honest
 * 501 with the address to write to — it never pretends a lead was delivered.
 *
 * Provider: Resend, through its plain HTTPS API, so no SDK enters the bundle.
 *   RESEND_API_KEY   — the server credential (never reaches the browser)
 *   CONTACT_TO       — where messages go (default info@dolmir.com)
 *   CONTACT_FROM     — a sender on a domain verified in Resend
 *                      (default "DOLMIR <contatto@dolmir.com>")
 *
 * Guards: bounded field lengths, a honeypot field, and a small per-IP bucket.
 * Retention: nothing is stored here; the email is the record.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60_000;
const buckets = new Map<string, { n: number; t: number }>();

function limited(ip: string): boolean {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now - b.t > RATE_WINDOW_MS) { buckets.set(ip, { n: 1, t: now }); return false; }
  b.n += 1;
  return b.n > RATE_LIMIT;
}

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const escape = (s: string) => s.replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]!);

export function contactConfigured(): boolean {
  return Boolean(process.env['RESEND_API_KEY']?.trim());
}

export async function POST(request: Request) {
  const ip = (request.headers.get('x-forwarded-for') ?? 'local').split(',')[0]!.trim();
  if (limited(ip)) return NextResponse.json({ message: 'Troppi invii ravvicinati. Riprovate fra qualche minuto.' }, { status: 429 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ message: 'Richiesta non valida.' }, { status: 400 });
  }
  const b = body as Record<string, unknown>;

  // Honeypot: a field no person sees. Bots fill it; we say thanks and drop it.
  if (str(b['sito'], 200)) return NextResponse.json({ ok: true });

  const azienda = str(b['azienda'], 160);
  const nome = str(b['nome'], 120);
  const email = str(b['email'], 200);
  const telefono = str(b['telefono'], 60);
  const processo = str(b['processo'], 4000);
  const area = str(b['area'], 40);
  const settore = str(b['settore'], 40);
  const consenso = b['consenso'] === 'on' || b['consenso'] === true || b['consenso'] === 'true';

  if (!azienda || !nome || !email || !processo || !consenso) {
    return NextResponse.json({ message: 'Compilate tutti i campi obbligatori.' }, { status: 400 });
  }
  if (!EMAIL.test(email)) {
    return NextResponse.json({ message: 'L’indirizzo email non sembra valido.' }, { status: 400 });
  }

  const key = process.env['RESEND_API_KEY']?.trim();
  if (!key) {
    return NextResponse.json(
      { message: 'Il modulo non è ancora collegato. Scrivete a info@dolmir.com — vi rispondiamo direttamente.' },
      { status: 501 },
    );
  }

  const to = process.env['CONTACT_TO']?.trim() || 'info@dolmir.com';
  const from = process.env['CONTACT_FROM']?.trim() || 'DOLMIR <contatto@dolmir.com>';
  const lines = [
    ['Azienda', azienda], ['Nome', nome], ['Email', email], ['Telefono', telefono || '—'],
    ['Area', area || '—'], ['Settore', settore || '—'],
  ];
  const html =
    `<p>Nuova richiesta dal sito dolmir.com.</p><table>` +
    lines.map(([k, v]) => `<tr><td><b>${k}</b></td><td>${escape(v!)}</td></tr>`).join('') +
    `</table><p><b>Processo</b></p><p>${escape(processo).replace(/\n/g, '<br>')}</p>`;
  const text = lines.map(([k, v]) => `${k}: ${v}`).join('\n') + `\n\nProcesso:\n${processo}`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from, to: [to], reply_to: email, subject: `Contatto dal sito — ${azienda}`, html, text }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      console.error(`[contatto] provider ${res.status}: ${(await res.text()).slice(0, 300)}`);
      return NextResponse.json({ message: 'Invio non riuscito. Scrivete a info@dolmir.com.' }, { status: 502 });
    }
  } catch (err) {
    console.error(`[contatto] provider unreachable: ${err instanceof Error ? err.message : String(err)}`);
    return NextResponse.json({ message: 'Invio non riuscito. Scrivete a info@dolmir.com.' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
