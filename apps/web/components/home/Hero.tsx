'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Decode } from '@/components/ui/Decode';
import { Magnetic } from '@/components/ui/Magnetic';
import { cta, hero } from '@/content/site';

/**
 * The awakening.
 *
 * The screen starts almost empty. Over ~1.6 seconds, fourteen micro-signals
 * appear across the whole viewport — real events of a running DOLMIR system,
 * not set dressing — hairlines draw between a subset of them, and only once
 * the system is visibly alive does the statement land. The signals then step
 * back to a faint constellation behind the words.
 *
 * The first message is deliberately the vision, not a vertical: which industry
 * this is for is the job of the case section, not of the first five seconds.
 *
 * Under reduced motion everything is present from the first frame at its final
 * opacity; nothing a visitor needs is ever hidden behind an animation.
 */

type Phase = 'dark' | 'waking' | 'wired' | 'handed';

export function Hero() {
  const [step, setStep] = useState(-1);
  const [phase, setPhase] = useState<Phase>('dark');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStep(hero.signals.length);
      setPhase('handed');
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    setPhase('waking');
    hero.signals.forEach((_, i) => {
      timers.push(setTimeout(() => setStep(i), 90 + i * 105));
    });
    const t1 = 90 + hero.signals.length * 105;
    timers.push(setTimeout(() => setPhase('wired'), t1));
    timers.push(setTimeout(() => setPhase('handed'), t1 + 520));
    return () => timers.forEach(clearTimeout);
  }, []);

  const handed = phase === 'handed';
  const wired = phase === 'wired' || handed;

  /* The hairlines connect the signals marked `wire`, in order. */
  const wirePts = hero.signals
    .map((s, i) => ({ ...s, i }))
    .filter((s) => s.wire !== undefined)
    .sort((a, b) => (a.wire! - b.wire!));

  return (
    <section className="relative min-h-[100svh]">
      {/* ------------------------------------------------- the constellation */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-[1200ms] ${
          handed ? 'opacity-[0.34]' : 'opacity-100'
        }`}
      >
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {wirePts.slice(0, -1).map((a, j) => {
            const b = wirePts[j + 1]!;
            return (
              <line
                key={j}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke="var(--c-accent)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                opacity={wired ? 0.22 : 0}
                style={{
                  transition: `opacity 600ms ease ${j * 90}ms`,
                }}
              />
            );
          })}
        </svg>
        {hero.signals.map((sig, i) => (
          <span
            key={sig.t}
            className={`telemetry absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap transition-all duration-[var(--duration-base)] ease-[var(--ease-mech-out)] ${
              // Edge signals need the whole viewport; on a phone they would
              // clip or crowd the headline, so only the safe middle band shows.
              sig.x < 14 || sig.x > 86 ? 'hidden sm:inline' : ''
            } ${
              i <= step ? 'opacity-100 blur-0' : 'opacity-0 blur-[3px]'
            } ${sig.wire !== undefined ? 'text-accent' : 'text-muted'}`}
            style={{ left: `${sig.x}%`, top: `${sig.y}%` }}
          >
            <span className="mr-2 inline-block size-1 bg-current align-middle" />
            {sig.t}
          </span>
        ))}
      </div>

      <Container className="relative flex min-h-[calc(100svh-var(--nav-h))] flex-col justify-end pb-7 pt-[clamp(1.5rem,4vh,3rem)]">
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
          className={`mt-10 transition-opacity duration-[var(--duration-scene)] ${handed ? 'opacity-100' : 'opacity-0'}`}
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
          <p className="telemetry mt-4 flex items-center justify-between gap-3 text-faint">
            <span className="flex items-center gap-3">
              <span aria-hidden className="block h-6 w-px bg-gradient-to-b from-transparent to-rule-bright" />
              {hero.scroll}
            </span>
            <Uptime />
          </p>
        </div>
      </Container>
    </section>
  );
}


/**
 * A second hand for the system. One line of live telemetry — session uptime,
 * ticking once a second — so the machine is demonstrably running rather than
 * painted. Frozen under reduced motion, and decorative to screen readers.
 */
function Uptime() {
  const [t, setT] = useState(0);
  const frozen = useRef(false);
  useEffect(() => {
    frozen.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (frozen.current) return;
    const id = setInterval(() => setT((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(t / 60)).padStart(2, '0');
  const ss = String(t % 60).padStart(2, '0');
  return (
    <span aria-hidden className="tnum hidden sm:inline">
      SESSIONE T+{mm}:{ss}
    </span>
  );
}
