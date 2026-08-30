import { Chapter } from '@/components/ui/Chapter';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { chapters } from '@/content/site';

const c = chapters.layer;

/**
 * Chapter 03. Where DOLMIR physically sits.
 *
 * The diagram is the argument: mailbox on one side, gestionale on the other,
 * and a lit strip between them. Everything the company sells lives in that gap,
 * and saying so visually removes the "are you replacing our ERP" objection
 * before it is asked.
 */
export function Layer() {
  return (
    <section className="relative overflow-hidden border-b border-rule py-[var(--space-section)]">
      <div aria-hidden className="pointer-events-none absolute inset-0 sheet-fine opacity-40" />

      <Container className="relative">
        <Chapter n={c.n} label={c.label} headline={c.headline} lead={c.body} />

        {/* ---------------------------------------------------- the sandwich */}
        <Reveal delay={140}>
          <div className="mt-[var(--space-block)] grid items-stretch gap-px border border-rule bg-rule md:grid-cols-[1fr_1.5fr_1fr]">
            <Side title="Da dove arriva" items={['Casella condivisa', 'Allegati', 'Portali clienti']} />

            <div className="relative overflow-hidden bg-void p-8 text-center">
              <div aria-hidden className="pointer-events-none absolute inset-0 pool" />
              <div className="relative">
                <p className="label text-accent">Strato DOLMIR</p>
                <p className="mt-4 font-display text-[length:var(--text-display-s)] font-semibold tracking-[-0.02em] text-ink">
                  I trenta metri che nessuno ha informatizzato
                </p>
                <div aria-hidden className="mx-auto mt-6 flex max-w-[22rem] items-center gap-1.5">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <span
                      key={i}
                      className="h-4 flex-1 bg-accent"
                      style={{ opacity: 0.14 + Math.sin(i / 2) * 0.1 + (i % 4 === 0 ? 0.5 : 0) }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <Side title="Dove finisce" items={['Gestionale esistente', 'Documenti', 'Persone']} align="right" />
          </div>
        </Reveal>

        {/* ------------------------------------------------------- six verbs */}
        <ol className="mt-[var(--space-block)] grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
          {c.steps.map((s, i) => (
            <Reveal key={s.k} as="li" delay={i * 55} className="bg-surface">
              <div className="flex h-full flex-col p-7">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[var(--text-label)] tnum text-faint">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-mono text-[var(--text-micro)] font-medium uppercase tracking-[0.2em] text-accent">
                    {s.k}
                  </h3>
                </div>
                <p className="mt-4 text-[var(--text-small)] leading-relaxed text-muted">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}

function Side({ title, items, align = 'left' }: { title: string; items: string[]; align?: 'left' | 'right' }) {
  return (
    <div className={`bg-surface p-8 ${align === 'right' ? 'md:text-right' : ''}`}>
      <p className="label">{title}</p>
      <ul className="mt-5 flex flex-col gap-2.5">
        {items.map((i) => (
          <li key={i} className="text-[var(--text-small)] text-ink-2">{i}</li>
        ))}
      </ul>
    </div>
  );
}
