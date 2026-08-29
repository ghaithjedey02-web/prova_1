import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { cta, hero } from '@/content/site';

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-rule">
      <div aria-hidden className="sheet pointer-events-none absolute inset-0" />

      <Container wide className="relative">
        <div className="pt-[clamp(4rem,11vw,9rem)] pb-[clamp(3rem,6vw,5rem)]">
          <Reveal>
            <p className="label">{hero.eyebrow}</p>
          </Reveal>

          <Reveal delay={90}>
            <h1 className="display mt-8 max-w-[17ch] text-[length:var(--text-display-xl)]">
              Il lavoro che <em className="italic">non si vede</em> è quello che costa di più.
            </h1>
          </Reveal>

          <Reveal delay={180}>
            <p className="lead mt-12 md:mt-14">{hero.lead}</p>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-11 flex flex-wrap items-center gap-3">
              <Button href={cta.primary.href} arrow>{cta.primary.label}</Button>
              <Button href={cta.secondary.href} variant="secondary">{cta.secondary.label}</Button>
            </div>
          </Reveal>
        </div>

        {/* Title block: three operating principles, not invented statistics.
            This is the honest replacement for a "trusted by" logo strip. */}
        <Reveal delay={340}>
          <dl className="grid border-t border-rule-strong md:grid-cols-3">
            {hero.principles.map((p, i) => (
              <div
                key={p.k}
                className={`py-8 md:py-9 ${i < 2 ? 'border-b border-rule md:border-b-0 md:border-r' : ''} ${i > 0 ? 'md:pl-8' : ''} ${i < 2 ? 'md:pr-8' : ''}`}
              >
                <dt className="flex items-baseline gap-3">
                  <span className="label tnum">{p.k}</span>
                  <span className="text-[var(--text-body)] font-medium text-ink">{p.t}</span>
                </dt>
                <dd className="mt-2.5 max-w-[38ch] text-[var(--text-small)] leading-relaxed text-muted">{p.d}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
