import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHead } from '@/components/ui/SectionHead';
import { approach } from '@/content/site';

export function Approach() {
  return (
    <section className="border-b border-rule py-[var(--space-section)]">
      <Container wide>
        <SectionHead num="02" label={approach.label} headline={approach.headline} />

        <ol className="mt-[var(--space-block)] grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
          {approach.steps.map((s, i) => (
            <Reveal as="li" key={s.k} delay={i * 80} className="border-t border-rule-strong pt-6">
              <p className="label tnum text-accent">{s.k}</p>
              <h3 className="mt-4 font-display text-[length:var(--text-display-s)] leading-tight text-ink">{s.t}</h3>
              <p className="mt-3.5 text-[var(--text-small)] leading-relaxed text-muted">{s.d}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
