'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { usePalette } from '@/lib/palette';
import { chapters } from '@/content/site';
import { LineStatic } from './LineStatic';
import { stationFromProgress, stations } from './stations';

const LineCanvas = dynamic(() => import('./LineCanvas'), { ssr: false });

/**
 * Scroll-driven journey of one request through the system.
 *
 * The section is tall; inside it a viewport-height stage is pinned. Scroll
 * position becomes a single 0..1 scalar which drives both the canvas and the
 * caption, so the visual and the words can never disagree.
 */
export function TheLine() {
  const [active, setActive] = useState(0);
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const palette = usePalette();

  const wrap = useRef<HTMLDivElement>(null);
  const progress = useRef(0);

  useEffect(() => {
    setEnabled(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let ticking = false;

    function update() {
      ticking = false;
      const el = wrap.current;
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
  }, [enabled]);

  const c = chapters.automation;
  const head = (
    <header className="max-w-[54ch]">
      <p className="chapter"><span className="tnum text-accent">{c.n}</span><span>{c.label}</span></p>
      <h2 className="headline mt-7 text-[length:var(--text-display-m)]">{c.headline}</h2>
      <div className="mt-8 h-px w-full max-w-[16rem] bg-gradient-to-r from-accent to-transparent" />
      <p className="lead mt-7">{c.body}</p>
    </header>
  );

  if (enabled === null || enabled === false || !palette) {
    return (
      <section className="relative py-[var(--space-section)]" data-inspect="TheLine · percorso di una richiesta">
        <Container>
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
    <section className="relative" aria-labelledby="line-heading" data-inspect="TheLine · percorso di una richiesta">
      <Container>
        <div className="pt-[var(--space-section)]" id="line-heading">{head}</div>
      </Container>

      <div ref={wrap} className="relative h-[420vh] md:h-[520vh]">
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0 sheet-fine opacity-30" />

          <Container className="relative">
            <div className="relative h-[38svh] md:h-[42svh]">
              <LineCanvas progress={progress} palette={palette} />
            </div>

            <div className="mt-10 grid gap-8 md:grid-cols-[13rem_1fr] md:items-start">
              <ol className="flex flex-wrap gap-x-4 gap-y-1.5 md:flex-col md:gap-1" aria-hidden>
                {stations.map((s, i) => (
                  <li
                    key={s.k}
                    className={`whitespace-nowrap font-mono text-[var(--text-label)] tracking-[0.16em] transition-colors duration-[var(--duration-base)] ${
                      i === active ? 'text-accent' : i < active ? 'text-muted' : 'text-rule-strong'
                    }`}
                  >
                    {s.k}
                    <span className={`ml-2.5 hidden md:inline ${i === active ? 'text-ink' : ''}`}>{s.t}</span>
                  </li>
                ))}
              </ol>

              <div aria-live="polite" className="min-h-[7.5rem] max-w-[56ch]">
                <p className={`label tnum ${station.kind === 'gate' ? 'text-amber' : ''}`}>
                  {station.k} · {station.t}
                </p>
                <p className="mt-3.5 text-[length:var(--text-display-s)] leading-snug text-ink">{station.d}</p>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
