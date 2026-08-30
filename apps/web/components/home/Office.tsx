import { Chapter } from '@/components/ui/Chapter';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { office as o } from '@/content/site';

const toneText = {
  ink: 'text-ink',
  good: 'text-good',
  accent: 'text-accent',
  amber: 'text-amber',
  neutral: 'text-ink-2',
  muted: 'text-faint',
} as const;

const tagStyle = {
  accent: 'border-accent-line text-accent',
  amber: 'border-amber-line text-amber',
  neutral: 'border-rule-strong text-ink-2',
  muted: 'border-rule text-faint',
} as const;

/**
 * Chapter 09. The shared mailbox at 08:04.
 *
 * Presented as an instrument readout rather than a product screenshot: fixed
 * rows, monospaced timestamps, one verdict per line. Every company and address
 * uses an .example domain and the panel says so, because a fabricated customer
 * name on a trust-led site would undo the whole argument.
 */
export function Office() {
  return (
    <section className="relative overflow-hidden border-b border-rule bg-void py-[var(--space-section)]">
      <div aria-hidden className="pointer-events-none absolute inset-0 sheet-fine opacity-30" />
      <Container className="relative">
        <Chapter n={o.n} label={o.label} headline={o.headline} lead={o.body} />

        <Reveal delay={140}>
          <div className="panel mt-[var(--space-block)]">
            {/* -------------------------------------------------------- head */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule px-5 py-4 sm:px-7">
              <div className="flex items-center gap-3">
                <span aria-hidden className="block size-1.5 bg-accent pulse" />
                <p className="font-mono text-[var(--text-label)] uppercase tracking-[0.2em] text-muted">
                  Casella commerciale
                </p>
              </div>
              <p className="font-mono text-[var(--text-micro)] tnum text-ink">{o.clock}</p>
            </div>

            {/* ------------------------------------------------------- stats */}
            <dl className="grid gap-px border-b border-rule bg-rule sm:grid-cols-4">
              {o.stats.map((s) => (
                <div key={s.k} className="bg-surface px-5 py-6 sm:px-7">
                  <dd className={`font-display text-[length:var(--text-display-m)] font-semibold tnum ${toneText[s.tone as keyof typeof toneText]}`}>
                    {s.v}
                  </dd>
                  <dt className="mt-2 text-[var(--text-micro)] leading-snug text-muted">{s.k}</dt>
                </div>
              ))}
            </dl>

            {/* -------------------------------------------------------- rows */}
            <ul className="stack-rules">
              {o.rows.map((r) => (
                <li key={r.t} className="grid gap-x-5 gap-y-2 px-5 py-5 sm:grid-cols-[4rem_1fr_9rem] sm:items-start sm:px-7">
                  <span className="font-mono text-[var(--text-label)] tnum text-muted">{r.t}</span>
                  <div className="min-w-0">
                    <p className="truncate text-[var(--text-small)] text-ink">{r.s}</p>
                    <p className="mt-1 truncate font-mono text-[var(--text-label)] text-muted">{r.from}</p>
                    <p className="mt-2 text-[var(--text-micro)] leading-snug text-muted">{r.note}</p>
                  </div>
                  <span
                    className={`inline-flex w-fit items-center border px-2.5 py-1 font-mono text-[var(--text-label)] uppercase tracking-[0.16em] sm:justify-self-end ${
                      tagStyle[r.tone as keyof typeof tagStyle]
                    }`}
                  >
                    {r.tag}
                  </span>
                </li>
              ))}
            </ul>

            <p className="border-t border-rule px-5 py-4 font-mono text-[var(--text-label)] tracking-[0.1em] text-muted sm:px-7">
              {o.disclaimer}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
