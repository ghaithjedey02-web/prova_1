'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Decode } from '@/components/ui/Decode';
import { Magnetic } from '@/components/ui/Magnetic';
import { cta, hero } from '@/content/site';

/**
 * The opening.
 *
 * The visitor does not arrive at a page with a picture on it — they arrive at a
 * machine that is starting up. Six boot lines resolve in about 1.6 seconds,
 * each naming a real stage of what DOLMIR builds, and the identity emerges out
 * of that sequence rather than being placed on top of it.
 *
 * Under reduced motion the sequence is skipped entirely and the headline is
 * present from the first frame; nothing is ever hidden behind an animation that
 * a visitor cannot see.
 */
export function Hero() {
  const [step, setStep] = useState(-1);
  const [handed, setHanded] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStep(hero.boot.length);
      setHanded(true);
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    hero.boot.forEach((_, i) => {
      timers.push(setTimeout(() => setStep(i), 140 + i * 195));
    });
    timers.push(setTimeout(() => setHanded(true), 140 + hero.boot.length * 195 + 120));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section className="relative min-h-[100svh]">
      <Container className="relative flex min-h-[calc(100svh-var(--nav-h))] flex-col justify-between pt-[clamp(1.5rem,4vh,3rem)] pb-7">
        {/* -------------------------------------------------------- boot log */}
        <ol
          className={`hidden w-fit transition-opacity duration-[var(--duration-slow)] lg:block ${
            handed ? 'opacity-0' : 'opacity-100'
          }`}
          aria-hidden={handed}
        >
          {hero.boot.map((b, i) => (
            <li
              key={b.t}
              className={`flex items-baseline gap-4 py-0.5 transition-opacity duration-[var(--duration-base)] ${
                i <= step ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <span className="telemetry w-[3.2rem] text-faint">{String(i + 1).padStart(2, '0')}</span>
              <span className="telemetry text-muted">{b.t}</span>
              <span aria-hidden className="block h-px w-8 bg-rule-strong" />
              <span className="telemetry text-accent">{i <= step ? b.v : ''}</span>
            </li>
          ))}
        </ol>

        {/* -------------------------------------------------------- headline */}
        <div
          className={`max-w-[34rem] transition-all duration-[var(--duration-scene)] ease-[var(--ease-mech-out)] lg:max-w-[46rem] ${
            handed ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-4 opacity-0 blur-[6px]'
          }`}
        >
          <p className="telemetry mb-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-muted">
            <span className="text-accent">{hero.sysId}</span>
            <span aria-hidden className="block h-px w-6 bg-rule-strong" />
            <span className="hidden sm:inline">{hero.eyebrow}</span>
          </p>

          <h1 className="display max-w-[15ch] text-[length:var(--text-hero)]">
            <span className="block text-ink">{hero.line1}</span>
            <span className="block text-muted">{hero.line2}</span>
            <span className="block text-ink">{hero.line3}</span>
          </h1>

          <p className="lead mt-8 max-w-[52ch]">{hero.lead}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Button href={cta.primary.href} arrow className="sm:px-8 sm:py-4.5 sm:text-[var(--text-body)]">
                {cta.primary.label}
              </Button>
            </Magnetic>
            <Magnetic>
              <Button href={cta.secondary.href} variant="secondary" className="sm:px-8 sm:py-4.5 sm:text-[var(--text-body)]">
                Vedi il sistema
              </Button>
            </Magnetic>
          </div>
        </div>

        {/* ------------------------------------------------------ telemetry */}
        <div
          className={`transition-opacity duration-[var(--duration-scene)] ${handed ? 'opacity-100' : 'opacity-0'}`}
        >
          <dl className="grid grid-cols-2 gap-px border-t border-rule bg-rule/60 sm:grid-cols-4">
            {hero.telemetry.map(([k, v]) => (
              <div key={k} className="bg-ground/40 px-1 py-4 backdrop-blur-sm sm:px-0">
                <dt className="telemetry text-faint">{k}</dt>
                <dd className="mt-1.5 font-mono text-[var(--text-micro)] text-ink-2">
                  <Decode text={v} speed={18} />
                </dd>
              </div>
            ))}
          </dl>
          <p className="telemetry mt-4 flex items-center gap-3 text-faint">
            <span aria-hidden className="block h-6 w-px bg-gradient-to-b from-transparent to-rule-bright" />
            {hero.scroll}
          </p>
        </div>
      </Container>
    </section>
  );
}
