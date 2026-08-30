import { Chapter } from '@/components/ui/Chapter';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { chapters } from '@/content/site';

const c = chapters.layer;

/** Chapter 02. Where DOLMIR physically sits, and the six verbs it performs there. */
export function Layer() {
  return (
    <section className="relative py-[var(--space-section)]">
      <Container>
        <Chapter n={c.n} label={c.label} headline={c.headline} lead={c.body} />

        <Reveal delay={140}>
          <div className="mt-[var(--space-block)] grid items-stretch gap-px border border-rule bg-rule/70 md:grid-cols-[1fr_1.4fr_1fr]">
            <Side title="Da dove arriva" items={['Canali non strutturati', 'Documenti', 'Persone']} />
            <div className="relative overflow-hidden bg-void/92 p-8 text-center backdrop-blur-md">
              <div aria-hidden className="pointer-events-none absolute inset-0 pool" />
              <div className="relative">
                <p className="telemetry text-accent">Strato DOLMIR</p>
                <p className="mt-4 font-display text-[length:var(--text-display-s)] font-semibold tracking-[-0.02em] text-ink">
                  Il livello che nessuno ha mai costruito
                </p>
                <div aria-hidden className="mx-auto mt-7 flex max-w-[24rem] items-end gap-1">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <span
                      key={i}
                      className="flex-1 bg-accent"
                      style={{ height: `${6 + Math.abs(Math.sin(i / 3)) * 22}px`, opacity: 0.15 + (i % 5 === 0 ? 0.55 : 0.1) }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <Side title="Dove finisce" items={['Sistemi esistenti', 'Documenti strutturati', 'Decisioni']} align="right" />
          </div>
        </Reveal>

        <ol className="mt-[var(--space-block)] grid gap-px border border-rule bg-rule/70 sm:grid-cols-2 lg:grid-cols-3">
          {c.verbs.map((v, i) => (
            <Reveal key={v.k} as="li" delay={i * 50} className="bg-surface/92 backdrop-blur-md">
              <div className="flex h-full flex-col p-7">
                <div className="flex items-baseline gap-3">
                  <span className="telemetry text-faint">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-mono text-[var(--text-micro)] font-medium uppercase tracking-[0.2em] text-accent">{v.k}</h3>
                </div>
                <p className="mt-4 text-[var(--text-small)] leading-relaxed text-muted">{v.d}</p>
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
    <div className={`bg-surface/70 p-8 backdrop-blur-sm ${align === 'right' ? 'md:text-right' : ''}`}>
      <p className="telemetry">{title}</p>
      <ul className="mt-5 flex flex-col gap-2.5">
        {items.map((i) => (
          <li key={i} className="text-[var(--text-small)] text-ink-2">{i}</li>
        ))}
      </ul>
    </div>
  );
}
