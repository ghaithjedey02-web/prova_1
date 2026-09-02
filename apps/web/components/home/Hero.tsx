'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Magnetic } from '@/components/ui/Magnetic';
import { cta, hero } from '@/content/site';
import { HeroScene } from './HeroScene';

/**
 * The first ten seconds, redesigned around one idea: show it, then say it.
 *
 * The right half of the viewport is the product happening — documents
 * arriving in disorder, flowing through the core, leaving as verified rows,
 * one of them stopping in amber for a person. The left half is three lines
 * in plain words that describe exactly what the eye is already watching.
 * A visitor who never reads the lead still leaves knowing the shape:
 * mess in, understanding, a stop, action.
 *
 * What is gone: the abstract polyhedron (it said "technology" and nothing
 * else), the strip of spec-sheet principles, and the seven mono words. What
 * replaced the strip is four verbs in the reading typeface, the last in amber.
 *
 * On phones the scene sits above the words in a 4:3 band; the story is the
 * same, the composition stacks. Under reduced motion the scene renders its
 * composed mid-story frame and stays.
 */
export function Hero() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setReady(true); return; }
    const id = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(id);
  }, []);

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      {/* the scene: full-bleed on the right at lg, a band on top below it */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-[var(--nav-h)] h-[50svh] transition-opacity duration-[1400ms] lg:inset-y-0 lg:left-[44%] lg:right-0 lg:h-auto lg:top-0 ${
          ready ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_60%_50%,transparent_35%,var(--c-ground)_100%)] lg:bg-[linear-gradient(90deg,var(--c-ground)_0%,transparent_18%,transparent_88%,var(--c-ground)_100%)]" />
        <div className="absolute inset-0 -z-10">
          <HeroScene />
        </div>
      </div>

      <Container className="relative flex min-h-[100svh] flex-col justify-end pb-12 pt-[calc(50svh+3rem)] lg:justify-center lg:pb-0 lg:pt-0">
        <div
          className={`max-w-[38rem] transition-all duration-[var(--duration-scene)] ease-[var(--ease-mech-out)] lg:max-w-[42%] ${
            ready ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-4 opacity-0 blur-[6px]'
          }`}
        >
          <p className="mb-6 text-[length:var(--text-small)] font-medium text-accent">{hero.eyebrow}</p>

          <h1 className="display text-[length:var(--text-display-xl)]">
            <span className="block text-ink">{hero.line1}</span>
            <span className="block text-ink-2">{hero.line2}</span>
            <span className="block text-ink">{hero.line3}</span>
          </h1>

          <p className="lead mt-7 max-w-[46ch] text-ink-2">{hero.lead}</p>

          {/* four verbs — the product, in the reading face, no machine voice */}
          <p className="mt-7 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[length:var(--text-small)]">
            {hero.ribbon.map((v, i) => (
              <span key={v} className="flex items-baseline gap-x-3">
                {i > 0 && <span aria-hidden className="text-faint">·</span>}
                <span className={i === hero.ribbon.length - 1 ? 'font-medium text-amber' : 'text-ink'}>{v}</span>
              </span>
            ))}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Button href="/#parla" arrow className="sm:px-8 sm:py-4.5 sm:text-[length:var(--text-body)]">
                Parla con DOLMIR
              </Button>
            </Magnetic>
            <Magnetic>
              <Button href={cta.primary.href} variant="secondary" className="sm:px-8 sm:py-4.5 sm:text-[length:var(--text-body)]">
                Portateci un processo
              </Button>
            </Magnetic>
          </div>
        </div>
      </Container>
    </section>
  );
}
