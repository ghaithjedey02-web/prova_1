import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHead } from '@/components/ui/SectionHead';
import { control } from '@/content/site';

export function Control() {
  return (
    <section className="border-b border-rule bg-surface py-[var(--space-section)]">
      <Container wide>
        <div className="grid gap-[var(--space-block)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <SectionHead num="05" label={control.label} headline={control.headline}>
            <p className="text-[var(--text-body)] leading-relaxed text-ink-2">{control.body}</p>
          </SectionHead>

          <ul className="flex flex-col self-center">
            {control.points.map((p, i) => (
              <Reveal as="li" key={p.t} delay={i * 90} className="border-t border-rule-strong py-7 last:border-b">
                <h3 className="text-[var(--text-body)] font-medium text-ink">{p.t}</h3>
                <p className="mt-2 max-w-[46ch] text-[var(--text-small)] leading-relaxed text-muted">{p.d}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
