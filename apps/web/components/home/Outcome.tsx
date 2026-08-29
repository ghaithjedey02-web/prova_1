import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHead } from '@/components/ui/SectionHead';
import { outcome } from '@/content/site';

export function Outcome() {
  return (
    <section className="border-b border-rule py-[var(--space-section)]">
      <Container wide>
        <SectionHead num="06" label={outcome.label} headline={outcome.headline}>
          <p className="text-[var(--text-body)] leading-relaxed text-ink-2">{outcome.body}</p>
        </SectionHead>

        <div className="mt-[var(--space-block)] grid gap-px border border-rule bg-rule md:grid-cols-2">
          {outcome.metrics.map((m, i) => (
            <Reveal key={m.k} delay={i * 90} className="bg-surface p-8 md:p-10">
              <p className="label">{m.k}</p>
              <p className="mt-6 flex flex-wrap items-baseline gap-4 font-display text-[length:var(--text-display-m)] leading-none">
                <span className="text-muted line-through decoration-1 decoration-rule-strong">{m.before}</span>
                <span aria-hidden className="font-mono text-[var(--text-lead)] text-rule-strong">→</span>
                <span className="text-accent">{m.after}</span>
              </p>
              <p className="mt-5 text-[var(--text-small)] text-muted">{m.note}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={180}>
          <p className="mt-7 max-w-[62ch] border-l-2 border-amber pl-5 text-[var(--text-small)] leading-relaxed text-muted">
            {outcome.caveat}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
