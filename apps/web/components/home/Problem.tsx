import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHead } from '@/components/ui/SectionHead';
import { problem } from '@/content/site';

export function Problem() {
  return (
    <section className="border-b border-rule py-[var(--space-section)]">
      <Container wide>
        <SectionHead num="01" label={problem.label} headline={problem.headline}>
          <div className="flex flex-col gap-5">
            {problem.body.map((p) => (
              <p key={p.slice(0, 24)} className="text-[var(--text-body)] leading-relaxed text-ink-2">{p}</p>
            ))}
          </div>
        </SectionHead>

        <ul className="mt-[var(--space-block)] grid gap-px border border-rule bg-rule sm:grid-cols-2">
          {problem.costs.map((c, i) => (
            <Reveal as="li" key={c.t} delay={i * 70} className="bg-surface p-8 md:p-10">
              <h3 className="font-display text-[length:var(--text-display-s)] leading-tight text-ink">{c.t}</h3>
              <p className="mt-3.5 max-w-[42ch] text-[var(--text-small)] leading-relaxed text-muted">{c.d}</p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
