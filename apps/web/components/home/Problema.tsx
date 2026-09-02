import { Chapter } from '@/components/ui/Chapter';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { problema as c } from '@/content/site';

/**
 * Chapter 01 — the problem, recognised before it is read.
 *
 * The eight fragments used to be eight mono labels: EMAIL, PDF, EXCEL. A
 * taxonomy. Now they are the things themselves — an inbox row, a PDF chip
 * with a folded corner, three spreadsheet cells, a chat bubble, a call log, a
 * gestionale row, a document stack, a sticky note — all about the same order,
 * all disagreeing slightly, scattered the way they land on a desk. A visitor
 * does not decode this; they wince. That wince is the section's job.
 *
 * Then the turn, and the three things we do NOT replace or change.
 */

type Frag = (typeof c.fragments)[number];

function Artifact({ f }: { f: Frag }) {
  const base = 'text-[length:var(--text-micro)] leading-snug';
  switch (f.kind) {
    case 'email':
      return (
        <div className={`flex w-[19rem] max-w-full items-start gap-3 border border-rule-strong bg-surface px-3.5 py-2.5 ${base}`}>
          <span aria-hidden className="mt-0.5 block size-6 flex-none rounded-full bg-elevated" />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-3">
              <span className="truncate font-medium text-ink">{f.a}</span>
              <span className="font-mono text-[0.7rem] text-faint">{f.c}</span>
            </div>
            <p className="truncate text-ink-2">{f.b}</p>
          </div>
        </div>
      );
    case 'pdf':
      return (
        <div className={`relative w-[13.5rem] max-w-full border border-rule-strong bg-surface px-3.5 py-2.5 pr-6 ${base}`}>
          <span aria-hidden className="absolute right-0 top-0 size-4 border-b border-l border-rule-strong bg-ground" />
          <p className="truncate font-mono text-[0.72rem] text-ink">{f.a}</p>
          <p className="mt-0.5 text-ink-2">{f.b}</p>
        </div>
      );
    case 'excel':
      return (
        <div className={`grid w-[13rem] max-w-full grid-cols-[1.3fr_0.7fr_1fr] border border-rule-strong bg-surface font-mono text-[0.72rem] ${base}`}>
          <span className="border-r border-rule px-2.5 py-2 text-ink">{f.a}</span>
          <span className="border-r border-rule px-2.5 py-2 text-right text-amber">{f.b}</span>
          <span className="px-2.5 py-2 text-ink-2">{f.c}</span>
        </div>
      );
    case 'whatsapp':
      return (
        <div className={`w-[14rem] max-w-full rounded-2xl rounded-bl-sm border border-good/40 bg-good-soft px-3.5 py-2.5 ${base}`}>
          <p className="text-[0.72rem] font-medium text-good">{f.a}</p>
          <p className="text-ink">{f.b}</p>
        </div>
      );
    case 'telefono':
      return (
        <div className={`flex w-[16rem] max-w-full items-center gap-3 border border-rule-strong bg-surface px-3.5 py-2.5 ${base}`}>
          <span aria-hidden className="block size-2 flex-none rounded-full bg-accent" />
          <div className="min-w-0">
            <p className="font-mono text-[0.72rem] text-muted">{f.a}</p>
            <p className="truncate italic text-ink-2">{f.b}</p>
          </div>
        </div>
      );
    case 'gestionale':
      return (
        <div className={`flex w-[20rem] max-w-full items-center gap-4 border-y border-rule-strong bg-surface px-3.5 py-2.5 font-mono text-[0.72rem] ${base}`}>
          <span className="whitespace-nowrap text-ink">{f.a}</span>
          <span className="whitespace-nowrap border border-accent-line px-1.5 py-0.5 text-[0.62rem] tracking-[0.1em] text-accent">{f.b}</span>
          <span className="ml-auto truncate text-muted">{f.c}</span>
        </div>
      );
    case 'documenti':
      return (
        <div className="relative w-[14rem] max-w-full">
          <span aria-hidden className="absolute -right-1.5 -top-1.5 h-full w-full border border-rule bg-ground" />
          <div className={`relative border border-rule-strong bg-surface px-3.5 py-2.5 ${base}`}>
            <p className="truncate font-mono text-[0.72rem] text-ink">{f.a}</p>
            <p className="text-muted">{f.b}</p>
          </div>
        </div>
      );
    default:
      return (
        <div className={`w-[11rem] max-w-full rotate-[-1.5deg] bg-amber px-3.5 py-3 text-ground ${base}`}>
          <p className="font-medium">{f.a}</p>
          <p className="opacity-80">{f.b}</p>
        </div>
      );
  }
}

export function Problema() {
  return (
    <section className="relative py-[var(--space-section)]" aria-labelledby="problema-heading">
      <Container>
        <Chapter n={c.n} label={c.label} headline={c.headline} lead={c.body} id="problema-heading" size="l" />

        {/* the desk: one order, eight places, none of them agreeing */}
        <Reveal delay={120}>
          <ul className="mt-[var(--space-block)] flex flex-wrap items-start gap-x-4 gap-y-5">
            {c.fragments.map((f, i) => (
              <li
                key={f.kind}
                className="min-w-0 max-w-full transition-transform duration-[var(--duration-slow)] ease-[var(--ease-mech-out)] hover:!rotate-0 hover:!translate-y-0"
                style={{ transform: `translateY(${(i % 3) * 6 - 6}px) rotate(${((i % 5) - 2) * 0.7}deg)` }}
              >
                <Artifact f={f} />
              </li>
            ))}
            <li className="flex w-full items-center gap-3 pt-4 text-[length:var(--text-small)] text-muted">
              <span aria-hidden className="block h-px w-8 bg-rule-bright" />
              e in mezzo, una persona che ricopia
            </li>
          </ul>
        </Reveal>

        {/* the turn */}
        <Reveal delay={160}>
          <p className="chapter mt-20"><span className="text-accent">{c.turn}</span></p>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-7 max-w-[26ch] font-display text-[length:var(--text-display-m)] font-semibold leading-[1.12] text-ink">
            {c.what}
          </p>
        </Reveal>

        {/* the three objections, closed before they are raised */}
        <div className="mt-12 grid gap-px border border-rule-strong bg-rule sm:grid-cols-3">
          {c.nots.map((n, i) => (
            <Reveal key={n.t} delay={240 + i * 70} className="bg-surface/80">
              <div className="h-full p-6 sm:p-7">
                <p className="text-[length:var(--text-body)] font-medium text-ink">{n.t}</p>
                <p className="mt-3 text-[length:var(--text-small)] leading-relaxed text-ink-2">{n.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
