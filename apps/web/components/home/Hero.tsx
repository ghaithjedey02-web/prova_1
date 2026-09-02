'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { cta, hero, scenario } from '@/content/site';
import { HeroProduct } from './HeroProduct';

/**
 * The first screen: say it in one sentence, show it in one frame.
 *
 * Left, the claim a business owner understands without knowing what AI is.
 * Right, the product doing exactly that — a request read, verified, stopped
 * at a discrepancy, decided by a person, turned into actions. On phones the
 * frame follows the words; on wide screens they sit side by side and the
 * frame is what the eye lands on.
 */
export function Hero() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(id);
  }, []);

  return (
    <section className="relative overflow-hidden pt-[calc(var(--nav-h)+clamp(2rem,6vw,5rem))] pb-[clamp(3rem,7vw,6rem)]">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 pool opacity-70" />
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14 xl:gap-20">
          <div
            className={`max-w-[38rem] transition-all duration-[var(--duration-scene)] ease-[var(--ease-mech-out)] ${
              ready ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
            }`}
          >
            <p className="mb-6 text-[length:var(--text-small)] font-medium text-accent">{hero.eyebrow}</p>
            <h1 className="display text-[length:var(--text-display-xl)] text-ink">{hero.headline}</h1>
            <p className="lead mt-7 max-w-[44ch]">{hero.lead}</p>

            <p className="mt-7 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[length:var(--text-small)]">
              {hero.ribbon.map((v, i) => (
                <span key={v} className="flex items-baseline gap-x-3">
                  {i > 0 && <span aria-hidden className="text-faint">·</span>}
                  <span className={i === hero.ribbon.length - 1 ? 'font-medium text-amber' : 'text-ink'}>{v}</span>
                </span>
              ))}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button href={cta.primary.href} size="lg" arrow>{cta.primary.label}</Button>
              <Button href={cta.secondary.href} variant="secondary" size="lg">{cta.secondary.label}</Button>
            </div>
          </div>

          <div
            className={`min-w-0 transition-all delay-150 duration-[var(--duration-scene)] ease-[var(--ease-mech-out)] ${
              ready ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <HeroProduct />
            <p className="mt-3 text-[length:var(--text-micro)] text-faint">{scenario.disclaimer}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
