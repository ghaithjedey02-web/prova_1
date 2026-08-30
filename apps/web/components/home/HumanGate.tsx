import { Chapter } from '@/components/ui/Chapter';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { chapters } from '@/content/site';

const c = chapters.human;

/**
 * Chapter 07 — the gate.
 *
 * The one section allowed to break the accent colour: everything here is amber,
 * because amber on this site means the system is not sure. The literal engine
 * constant is set as a specimen at display size — it is the strongest single
 * claim DOLMIR makes, and it is in the code rather than in the copy.
 */
export function HumanGate() {
  return (
    <section className="relative py-[var(--space-section)]">
      <Container>
        <Chapter n={c.n} label={c.label} headline={c.headline} lead={c.body} />

        <ol className="mt-[var(--space-block)] grid gap-px border border-rule bg-rule/70 lg:grid-cols-4">
          {c.chain.map((step, i) => (
            <Reveal key={step.k} as="li" delay={i * 90} className="bg-surface/92 backdrop-blur-md">
              <div className="relative flex h-full flex-col p-8">
                <span
                  aria-hidden
                  className="absolute right-0 top-1/2 hidden h-px w-8 translate-x-1/2 bg-amber lg:block"
                  style={{ opacity: i === c.chain.length - 1 ? 0 : 1 }}
                />
                <p className="font-mono text-[length:var(--text-display-s)] font-medium tracking-[0.02em] text-amber">
                  {step.k}
                </p>
                <p className="mt-5 text-[var(--text-small)] leading-relaxed text-muted">{step.d}</p>
                <span className="mt-auto pt-8 telemetry text-faint">{String(i + 1).padStart(2, '0')}</span>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={140}>
          <figure className="mt-[var(--space-block)] border border-amber-line bg-amber-soft/50 backdrop-blur-md">
            <div className="flex items-center gap-3 border-b border-amber-line px-6 py-3">
              <span aria-hidden className="block size-1.5 bg-amber pulse" />
              <figcaption className="telemetry text-amber">
                packages/rfq-engine/src/stages/draft.ts
              </figcaption>
            </div>
            <div className="px-6 py-9 sm:px-10 sm:py-11">
              <code className="block font-mono text-[clamp(1rem,3vw,1.85rem)] leading-tight tracking-[-0.01em] text-amber">
                priceBasis: <span className="text-ink">&apos;{c.quote}&apos;</span>
              </code>
              <p className="mt-6 max-w-[58ch] text-[var(--text-small)] leading-relaxed text-ink-2">{c.quoteNote}</p>
            </div>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
