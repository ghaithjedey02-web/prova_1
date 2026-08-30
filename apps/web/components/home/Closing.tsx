import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { closing as c, cta } from '@/content/site';

/** The close. One action, and exactly what to bring to it. */
export function Closing() {
  return (
    <section className="relative overflow-hidden py-[var(--space-section)]">
      <div aria-hidden className="pointer-events-none absolute inset-0 pool" />
      <Container className="relative">
        <div className="grid gap-[var(--space-block)] lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <Reveal>
              <p className="chapter">{c.label}</p>
            </Reveal>
            <Reveal delay={70}>
              <h2 className="display mt-8 max-w-[16ch] text-[length:var(--text-display-xl)]">{c.headline}</h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="lead mt-9">{c.body}</p>
            </Reveal>
            <Reveal delay={210}>
              <div className="mt-11 flex flex-wrap gap-3">
                <Button href={cta.primary.href} size="lg" arrow>{cta.primary.label}</Button>
                <Button href={cta.secondary.href} variant="secondary" size="lg">{cta.secondary.label}</Button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={180}>
            <div className="plate p-8">
              <p className="label">Cosa serve al primo incontro</p>
              <ul className="mt-6 flex flex-col">
                {c.bring.map((b, i) => (
                  <li key={b} className="flex gap-4 border-t border-rule py-4 first:border-t-0 first:pt-0">
                    <span className="font-mono text-[var(--text-label)] tnum text-accent">{String(i + 1).padStart(2, '0')}</span>
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
