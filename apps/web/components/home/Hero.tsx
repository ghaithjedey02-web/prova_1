'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Magnetic } from '@/components/ui/Magnetic';
import { cta, hero, pipeline } from '@/content/site';

/**
 * The first ten seconds.
 *
 * One sentence a business owner recognises as their own problem, one sentence
 * saying what we do about it, two ways forward, and the whole product written
 * out in seven words. Nothing else.
 *
 * It used to open with fourteen technical labels drifting across the viewport
 * — CTX BUILD, QUEUE 3, CONF 0.97 — and a strip of statistics underneath.
 * Both had to go. The labels overlapped the lead paragraph and spoke a
 * language the reader does not owe us the effort of learning; the statistics
 * ("7 canali collegati", "latenza < 900 ms") were measured on nothing. What
 * replaces them is four things that are true of every system we build.
 *
 * The system itself is still present — the fixed 3D core behind the page —
 * which is the right amount of machinery for a first impression: visible,
 * quiet, and not asking to be read.
 *
 * Under reduced motion everything is at its final position on the first
 * frame; nothing a visitor needs is ever behind an animation.
 */
export function Hero() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReady(true);
      return;
    }
    const id = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(id);
  }, []);

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center">
      <Container className="relative py-[clamp(3rem,10vh,6rem)]">
        <div
          className={`max-w-[34rem] transition-all duration-[var(--duration-scene)] ease-[var(--ease-mech-out)] lg:max-w-[46rem] ${
            ready ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-4 opacity-0 blur-[6px]'
          }`}
        >
          <p className="telemetry mb-7 text-accent">{hero.eyebrow}</p>

          <h1 className="display max-w-[15ch] text-[length:var(--text-hero)]">
            <span className="block text-ink">{hero.line1}</span>
            <span className="block text-ink-2">{hero.line2}</span>
            <span className="block text-ink">{hero.line3}</span>
          </h1>

          <p className="lead mt-8 max-w-[52ch] text-ink-2">{hero.lead}</p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Button href="/#parla" arrow className="sm:px-8 sm:py-4.5 sm:text-[length:var(--text-body)]">
                Parla con DOLMIR
              </Button>
            </Magnetic>
            <Magnetic>
              <Button
                href={cta.primary.href}
                variant="secondary"
                className="sm:px-8 sm:py-4.5 sm:text-[length:var(--text-body)]"
              >
                Portateci un processo
              </Button>
            </Magnetic>
          </div>

          {/* The whole product in seven words — the line the page then walks
              through, chapter by chapter. Amber only where a person decides. */}
          {/* The rules are hidden where the line wraps: a dash orphaned at the
              start of a new row reads as a typo, not as a connector. */}
          <p className="telemetry mt-9 flex flex-wrap items-center gap-x-3 gap-y-2 sm:gap-x-2.5">
            {pipeline.words.map((w, i) => (
              <span key={w} className="flex items-center gap-x-2.5">
                {i > 0 && <span aria-hidden className="hidden h-px w-3 bg-rule-bright sm:block" />}
                <span className={i === pipeline.human ? 'text-amber' : 'text-muted'}>{w}</span>
              </span>
            ))}
          </p>
        </div>

        {/* Four things that are true of every system we build. */}
        <div
          className={`mt-14 transition-opacity delay-200 duration-[var(--duration-scene)] ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <dl className="grid gap-px border-t border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
            {hero.principles.map(([k, v]) => (
              <div key={k} className="bg-ground/70 px-1 py-5 backdrop-blur-sm sm:px-5 lg:px-6">
                <dt className="telemetry text-accent">{k}</dt>
                <dd className="mt-2 max-w-[30ch] text-[length:var(--text-small)] leading-snug text-ink-2">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
