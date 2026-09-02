import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { closing as c, cta } from '@/content/site';

/** Chapter 08 — the close. One action, and exactly what to bring to it. */
export function Closing() {
  return (
    <section className="relative py-[var(--space-section)]" aria-labelledby="closing-heading">
      <Container>
        <div className="grid gap-[var(--space-block)] lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <Reveal><p className="chapter"><span className="tnum text-accent">08</span><span>{c.label}</span></p></Reveal>
            <Reveal delay={70}>
              <h2 id="closing-heading" className="display mt-8 max-w-[16ch] text-[length:var(--text-display-xl)]">{c.headline}</h2>
            </Reveal>
            <Reveal delay={140}><p className="lead mt-8">{c.body}</p></Reveal>
            <Reveal delay={210}>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button href={cta.contact.href} size="lg" arrow>Portateci un processo</Button>
                <Button href={cta.secondary.href} variant="secondary" size="lg">{cta.secondary.label}</Button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={180}>
            <div className="frame p-6 sm:p-7">
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted">Cosa serve al primo incontro</p>
              <ul className="mt-5 flex flex-col">
                {c.bring.map((b, i) => (
                  <li key={b} className="row">
                    <span className="tnum font-mono text-[0.6875rem] text-accent">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-[length:var(--text-small)] leading-snug text-ink-2">{b}</span>
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
