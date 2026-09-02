import { Chapter } from '@/components/ui/Chapter';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { problema as c } from '@/content/site';

/**
 * Chapter 02 — the problem, recognised before it is read.
 *
 * Eight places one order lives today — an inbox row, a PDF, three cells of a
 * spreadsheet, a chat message, a call, a row in the management system, a
 * shared folder, a reminder — each drawn as the thing it is, flat and
 * precise, with the place it lives written above it. The same order, eight
 * fragments, none of them agreeing. Then the turn, and the three things we
 * do NOT replace.
 */

type Frag = (typeof c.fragments)[number];

function Body({ f }: { f: Frag }) {
  switch (f.kind) {
    case 'email':
      return (
        <div className="flex items-start gap-3">
          <span aria-hidden className="mt-0.5 block size-6 flex-none rounded-full bg-elevated" />
          <div className="min-w-0">
            <div className="flex items-baseline justify-between gap-3"><span className="truncate font-medium text-ink">{f.a}</span><span className="font-mono text-[0.6875rem] text-muted">{f.c}</span></div>
            <p className="truncate text-ink-2">{f.b}</p>
          </div>
        </div>
      );
    case 'pdf':
      return (
        <div className="relative pr-5">
          <span aria-hidden className="absolute right-0 top-0 size-3.5 border-b border-l border-rule-strong bg-ground" />
          <p className="truncate font-mono text-[0.75rem] text-ink">{f.a}</p>
          <p className="mt-0.5 text-ink-2">{f.b}</p>
        </div>
      );
    case 'excel':
      return (
        <div className="grid grid-cols-[1.3fr_0.7fr_1fr] overflow-hidden rounded-[3px] border border-rule font-mono text-[0.75rem]">
          <span className="border-r border-rule px-2.5 py-1.5 text-ink">{f.a}</span>
          <span className="border-r border-rule px-2.5 py-1.5 text-right text-amber">{f.b}</span>
          <span className="px-2.5 py-1.5 text-ink-2">{f.c}</span>
        </div>
      );
    case 'whatsapp':
      return (
        <div className="max-w-[16rem] rounded-2xl rounded-bl-sm border border-good/40 bg-good-soft px-3.5 py-2.5">
          <p className="text-[0.75rem] font-medium text-good">{f.a}</p>
          <p className="text-ink">{f.b}</p>
        </div>
      );
    case 'telefono':
      return (
        <div className="flex items-center gap-3">
          <span aria-hidden className="block size-2 flex-none rounded-full bg-accent" />
          <div className="min-w-0"><p className="font-mono text-[0.75rem] text-muted">{f.a}</p><p className="truncate italic text-ink-2">{f.b}</p></div>
        </div>
      );
    case 'gestionale':
      return (
        <div className="flex items-center gap-3 font-mono text-[0.75rem]">
          <span className="whitespace-nowrap text-ink">{f.a}</span>
          <span className="whitespace-nowrap rounded-[3px] border border-accent-line px-1.5 py-0.5 text-[0.6875rem] tracking-[0.1em] text-accent">{f.b}</span>
          <span className="ml-auto truncate text-muted">{f.c}</span>
        </div>
      );
    case 'documenti':
      return (
        <div><p className="truncate font-mono text-[0.75rem] text-ink">{f.a}</p><p className="text-muted">{f.b}</p></div>
      );
    default:
      return (
        <div className="border-l-2 border-amber pl-3"><p className="font-medium text-ink">{f.a}</p><p className="text-muted">{f.b}</p></div>
      );
  }
}

export function Problema() {
  return (
    <section className="band relative py-[var(--space-section)]" aria-labelledby="problema-heading">
      <Container>
        <Chapter n={c.n} label={c.label} headline={c.headline} lead={c.body} id="problema-heading" size="l" />

        <Reveal delay={100}>
          <ul className="mt-[var(--space-block)] grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {c.fragments.map((f) => (
              <li key={f.kind} className="min-w-0 rounded-[6px] border border-rule-strong bg-raised text-[length:var(--text-micro)] leading-snug">
                <p className="border-b border-rule px-3.5 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-faint">{c.where[f.kind as keyof typeof c.where]}</p>
                <div className="px-3.5 py-3"><Body f={f} /></div>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex items-center gap-3 text-[length:var(--text-small)] text-muted">
            <span aria-hidden className="block h-px w-8 bg-rule-bright" />
            Lo stesso ordine, otto posti. E in mezzo, una persona che ricopia.
          </p>
        </Reveal>

        <Reveal delay={160}>
          <p className="chapter mt-16"><span className="text-accent">{c.turn}</span></p>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-6 max-w-[26ch] font-display text-[length:var(--text-display-m)] font-semibold leading-[1.12] text-ink">{c.what}</p>
        </Reveal>

        <div className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-frame)] border border-rule-strong bg-rule sm:grid-cols-3">
          {c.nots.map((n, i) => (
            <Reveal key={n.t} delay={240 + i * 70} className="bg-raised">
              <div className="h-full p-5 sm:p-6">
                <p className="text-[length:var(--text-body)] font-medium text-ink">{n.t}</p>
                <p className="mt-2.5 text-[length:var(--text-small)] leading-relaxed text-ink-2">{n.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
