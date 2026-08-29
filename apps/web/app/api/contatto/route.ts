import { NextResponse } from 'next/server';

/**
 * Contact endpoint — intentionally not yet wired to a mail provider.
 *
 * It returns an honest 501 rather than a fake success, so the form can never
 * silently swallow a lead. Before launch, three things need doing here:
 *   1. Add RESEND_API_KEY (or equivalent) and send the message.
 *   2. Add rate limiting and a spam check on this route.
 *   3. Decide retention: what we keep, for how long, stated in the privacy page.
 *
 * See docs/website/phase-2-architecture-proposal.md §12.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ message: 'Richiesta non valida.' }, { status: 400 });
  }

  const { azienda, nome, email, processo, consenso } = body as Record<string, unknown>;
  if (!azienda || !nome || !email || !processo || !consenso) {
    return NextResponse.json({ message: 'Compilate tutti i campi obbligatori.' }, { status: 400 });
  }

  return NextResponse.json(
    {
      message:
        'Il modulo non è ancora collegato. Scrivete a info@dolmir.com — vi rispondiamo direttamente.',
    },
    { status: 501 },
  );
}
