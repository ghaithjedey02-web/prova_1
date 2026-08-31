import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Magnetic } from '@/components/ui/Magnetic';
import { Reveal } from '@/components/ui/Reveal';
import { closing as c, cta } from '@/content/site';

/** The close. One action, and exactly what to bring to it. */
export function Closing() {
  return (
    <section className="relative py-[var(--space-section)]">
      <Container>
        <div className="grid gap-[var(--space-block)] lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <Reveal>
              <p className="chapter">{c.label}</p>
            </Reveal>
            <Reveal delay={70}>
              <h2 className="display mt-8 max-w-[15ch] text-[length:var(--text-display-xl)]">{c.headline}</h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="lead mt-9">{c.body}</p>
            </Reveal>
            <Reveal delay={210}>
              <div className="mt-11 flex flex-wrap gap-3">
                <Magnetic><Button href={cta.primary.href} size="lg" arrow>Portateci un processo</Button></Magnetic>
                <Magnetic><Button href={cta.secondary.href} variant="secondary" size="lg">{cta.secondary.label}</Button></Magnetic>
              </div>
            </Reveal>
          </div>

          <Reveal delay={180}>
            <div className="glass bracket p-8">
              <p className="telemetry">Cosa serve al primo incontro</p>
              <ul className="mt-6 flex flex-col">
                {c.bring.map((b, i) => (
                  <li key={b} className="flex gap-4 border-t border-rule py-4 first:border-t-0 first:pt-0">
                    <span className="telemetry text-accent">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-[var(--text-small)] leading-snug text-ink-2">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
