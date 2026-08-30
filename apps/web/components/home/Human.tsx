import { Chapter } from '@/components/ui/Chapter';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { chapters } from '@/content/site';

const c = chapters.human;

/** Chapter 06. The approval gate, stated as a boundary rather than a feature. */
export function Human() {
  return (
    <section className="relative overflow-hidden border-b border-rule bg-void py-[var(--space-section)]">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-line to-transparent" />
      <Container>
        <div className="grid gap-[var(--space-block)] lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <Chapter n={c.n} label={c.label} headline={c.headline} lead={c.body} size="l" />

          <ol className="stack-rules border-y border-rule lg:mt-4">
            {c.points.map((p, i) => (
              <Reveal key={p.t} as="li" delay={i * 70}>
                <div className="py-7">
                  <h3 className="flex items-baseline gap-3 text-[var(--text-body)] font-medium text-ink">
                    <span className="font-mono text-[var(--text-label)] tnum text-accent">{String(i + 1).padStart(2, '0')}</span>
                    {p.t}
                  </h3>
                  <p className="mt-2.5 pl-8 text-[var(--text-small)] leading-relaxed text-muted">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
