import { Chapter } from '@/components/ui/Chapter';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { chapters } from '@/content/site';

const c = chapters.cost;

/** Chapter 02. What the noise costs, in four named consequences. */
export function Cost() {
  return (
    <section className="border-b border-rule py-[var(--space-section)]">
      <Container>
        <div className="grid gap-[var(--space-block)] lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <Chapter n={c.n} label={c.label} headline={c.headline} />

          <div className="lg:pt-[6.5rem]">
            {c.body.map((p, i) => (
              <Reveal key={p} delay={80 + i * 70}>
                <p className={`text-[var(--text-lead)] leading-relaxed text-ink-2 ${i > 0 ? 'mt-6' : ''}`}>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <ol className="mt-[var(--space-block)] stack-rules border-t border-rule">
          {c.costs.map((item, i) => (
            <Reveal key={item.t} as="li" delay={i * 60}>
              <div className="group grid gap-3 py-8 md:grid-cols-[4rem_1fr_1.15fr] md:items-baseline md:gap-8">
                <span className="font-mono text-[var(--text-label)] tnum text-faint transition-colors group-hover:text-accent">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="subhead text-[length:var(--text-display-s)] text-ink">{item.t}</h3>
                <p className="text-[var(--text-small)] leading-relaxed text-muted">{item.d}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
