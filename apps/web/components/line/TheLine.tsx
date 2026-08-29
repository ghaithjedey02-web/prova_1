'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { detectTier, type Tier } from '@/lib/capability';
import { LineStatic } from './LineStatic';
import { stationFromProgress, stations } from './stations';

const LineScene = dynamic(() => import('./LineScene'), { ssr: false });
const LineCanvas2D = dynamic(() => import('./LineCanvas2D'), { ssr: false });

type Palette = { ink: string; accent: string; amber: string; muted: string; rule: string };

function readPalette(): Palette {
  const s = getComputedStyle(document.documentElement);
  const v = (n: string, fallback: string) => s.getPropertyValue(n).trim() || fallback;
  return {
    ink: v('--c-ink', '#0E1113'),
    accent: v('--c-accent', '#14495C'),
    amber: v('--c-amber', '#94551A'),
    muted: v('--c-muted', '#5E6866'),
    rule: v('--c-rule-strong', '#A9B2AF'),
  };
}

export function TheLine() {
  const [tier, setTier] = useState<Tier | null>(null);
  const [palette, setPalette] = useState<Palette | null>(null);
  const [active, setActive] = useState(0);

  const wrapRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);

  useEffect(() => {
    setTier(detectTier());
    setPalette(readPalette());

    // The scene reads its colours from the design tokens, so a theme change
    // has to re-read them — otherwise the 3D keeps the old palette.
    const mo = new MutationObserver(() => setPalette(readPalette()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onScheme = () => setPalette(readPalette());
    mq.addEventListener('change', onScheme);
    return () => { mo.disconnect(); mq.removeEventListener('change', onScheme); };
  }, []);

  useEffect(() => {
    if (!tier || tier === 'static') return;
    let ticking = false;

    function update() {
      ticking = false;
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;
      const p = Math.min(1, Math.max(0, -rect.top / total));
      progress.current = p;
      const { index } = stationFromProgress(p);
      setActive((prev) => (prev === index ? prev : index));
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [tier]);

  const head = (
    <header className="max-w-[52ch]">
      <p className="label flex items-center gap-3">
        <span className="tnum text-accent">03</span>
        <span>Il percorso</span>
      </p>
      <h2 className="headline mt-6 text-[length:var(--text-display-m)]">
        Una richiesta, dall’arrivo all’approvazione.
      </h2>
      <p className="lead mt-9">
        Lo stesso percorso che un documento compie dentro i sistemi che consegniamo.
        Al quarto passaggio si ferma, e aspetta una persona.
      </p>
    </header>
  );

  // Reduced motion, or unknown capability before hydration: the static diagram.
  if (tier === null || tier === 'static') {
    return (
      <section className="border-b border-rule py-[var(--space-section)]">
        <Container wide>
          {head}
          <div className="mt-[var(--space-block)]">
            <LineStatic />
          </div>
        </Container>
      </section>
    );
  }

  const station = stations[active] ?? stations[0]!;

  return (
    <section className="border-b border-rule" aria-labelledby="line-heading">
      <Container wide>
        <div className="pt-[var(--space-section)]" id="line-heading">{head}</div>
      </Container>

      <div ref={wrapRef} className="relative h-[340vh] md:h-[420vh]">
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
          <Container wide className="relative">
            <div className="relative h-[46svh] md:h-[52svh]">
              {palette && (tier === 'three'
                ? <LineScene progress={progress} palette={palette} />
                : <LineCanvas2D progress={progress} palette={palette} />)}
            </div>

            {/* Caption. aria-live so a screen-reader user following the scroll
                still receives the narrative rather than silence. */}
            <div className="mt-10 grid gap-8 md:grid-cols-[auto_1fr] md:items-start">
              <ol className="flex gap-2 md:flex-col md:gap-1.5" aria-hidden>
                {stations.map((s, i) => (
                  <li
                    key={s.k}
                    className={`font-mono text-[var(--text-label)] tracking-[0.14em] transition-colors duration-[var(--duration-base)] ${
                      i === active ? 'text-accent' : 'text-rule-strong'
                    }`}
                  >
                    {s.k}
                    <span className={`ml-2 hidden md:inline ${i === active ? 'text-ink' : 'text-rule-strong'}`}>
                      {s.t}
                    </span>
                  </li>
                ))}
              </ol>

              <div aria-live="polite" className="min-h-[6.5rem] max-w-[54ch]">
                <p className="label tnum">{station.k} · {station.t}</p>
                <p className="mt-3 text-[var(--text-lead)] leading-snug text-ink">{station.d}</p>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
