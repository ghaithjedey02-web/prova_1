import { Chapter } from '@/components/ui/Chapter';
import { Container } from '@/components/ui/Container';
import { Counter } from '@/components/ui/Counter';
import { Reveal } from '@/components/ui/Reveal';
import { chapters } from '@/content/site';

const c = chapters.proof;

/**
 * Chapter 08 — measure.
 *
 * No testimonials and no client logos, because there are none. What can be
 * counted honestly is the demonstration running on this site, so that is what
 * is counted — including the one that reads zero, which is the point.
 */
export function Proof() {
  return (
    <section className="relative py-[var(--space-section)]">
      <Container>
        <Chapter n={c.n} label={c.label} headline={c.headline} lead={c.body} />

        <dl className="mt-[var(--space-block)] grid gap-px border border-rule bg-rule/70 sm:grid-cols-2 lg:grid-cols-4">
          {c.metrics.map((m, i) => {
            const zero = m.v === 0;
            return (
              <Reveal key={m.k} delay={i * 70} className="bg-surface/92 backdrop-blur-md">
                <div className="scan h-full p-8">
                  <dd
                    className={`font-display text-[length:var(--text-display-l)] font-semibold leading-none ${
                      zero ? 'text-amber' : 'text-ink'
                    }`}
                  >
                    <Counter to={m.v} suffix={m.suffix} />
                  </dd>
                  <dt className="mt-6 border-t border-rule pt-5 text-[var(--text-small)] leading-relaxed text-muted">
                    {m.k}
                  </dt>
                </div>
              </Reveal>
            );
          })}
        </dl>

        <Reveal delay={140}>
          <p className="mt-10 max-w-[66ch] border-l-2 border-rule-strong pl-6 text-[var(--text-body)] leading-relaxed text-ink-2">
            {c.caveat}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
