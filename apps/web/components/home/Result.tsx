import { Chapter } from '@/components/ui/Chapter';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { chapters } from '@/content/site';

const c = chapters.result;

/**
 * Chapter 07. Two measures, deliberately without percentages.
 *
 * The caveat under the numbers is not small print — it is the section's real
 * argument, so it is set at reading size and given its own rule.
 */
export function Result() {
  return (
    <section className="border-b border-rule py-[var(--space-section)]">
      <Container>
        <Chapter n={c.n} label={c.label} headline={c.headline} lead={c.body} />

        <div className="mt-[var(--space-block)] grid gap-px border border-rule bg-rule md:grid-cols-2">
          {c.metrics.map((m, i) => (
            <Reveal key={m.k} delay={i * 90} className="bg-surface">
              <div className="p-8 sm:p-10">
                <p className="label">{m.k}</p>
                <div className="mt-8 flex flex-wrap items-baseline gap-x-5 gap-y-2">
                  <span className="font-display text-[length:var(--text-display-m)] font-semibold text-faint line-through decoration-1">
                    {m.before}
                  </span>
                  <span aria-hidden className="font-mono text-[var(--text-body)] text-accent">→</span>
                  <span className="font-display text-[length:var(--text-display-l)] font-semibold tracking-[-0.03em] text-ink">
                    {m.after}
                  </span>
                </div>
                <p className="mt-6 border-t border-rule pt-5 text-[var(--text-small)] text-muted">{m.note}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={140}>
          <p className="mt-10 max-w-[64ch] border-l-2 border-rule-strong pl-6 text-[var(--text-body)] leading-relaxed text-ink-2">
            {c.caveat}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
