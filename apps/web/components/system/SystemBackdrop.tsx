'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { detectTier, type Tier } from '@/lib/capability';
import { usePalette } from '@/lib/palette';
import { usePageProgress } from '@/lib/scroll';
import { STAGES, stagePosition } from './stages';
import { SystemStatic } from './SystemStatic';

const SystemScene = dynamic(() => import('./SystemScene'), { ssr: false });
const SystemCanvas2D = dynamic(() => import('./SystemCanvas2D'), { ssr: false });

/**
 * The machine the page is built on top of.
 *
 * One fixed layer behind every section, driven by one scroll scalar, so the
 * visitor is moving *through* a system rather than past a series of pictures.
 * Three fidelity tiers, one narrative:
 *
 *   three  → the full WebGL system
 *   canvas → the same six states in 2D
 *   static → a schematic, no motion at all
 *
 * WebGL never loads on the lower tiers: the import is dynamic and the tier is
 * decided before it is reached.
 */
export function SystemBackdrop() {
  const pathname = usePathname();
  // The full machine runs on the homepage, which is the cinematic entry point.
  // Every other route keeps the same universe at lower cost: same grid, same
  // light, the schematic instead of the live system. A contact form does not
  // need a GPU context.
  const full = pathname === '/';
  const [tier, setTier] = useState<Tier | null>(null);
  const palette = usePalette();
  const { progress } = usePageProgress();

  useEffect(() => { setTier(detectTier()); }, []);

  // The machine is at full strength for the opening frame and then recedes to
  // atmosphere. Content always wins over the background: a beautiful scene that
  // makes a paragraph hard to read is a failed scene.
  const layer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const p = progress.current ?? 0;
      const o = p < 0.04 ? 1 : Math.max(0.42, 1 - (p - 0.04) * 6);
      if (layer.current) layer.current.style.opacity = String(o);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progress]);

  const ready = tier !== null && palette !== null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Depth: a cold pool above, a floor below, so the scene never floats in
          a flat void. Painted in CSS because it costs nothing. */}
      <div className="absolute inset-0 sheet-fine opacity-25" />
      <div className="absolute inset-0 pool" />

      <div ref={layer} className="absolute inset-0 transition-none">
        {full && ready && tier === 'three' && <SystemScene palette={palette!} progress={progress} />}
        {full && ready && tier === 'canvas' && <SystemCanvas2D palette={palette!} progress={progress} />}
      </div>
      {(!full || !ready || tier === 'static') && (
        <div className="absolute inset-0 grid place-items-center opacity-[0.18]">
          <SystemStatic className="h-[min(70vh,42rem)] w-auto" />
        </div>
      )}

      {/* Vignette. Keeps the type legible over the brightest part of the core
          without dimming the whole scene. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_58%_46%_at_50%_50%,transparent_0%,var(--c-ground)_82%)] opacity-70" />
    </div>
  );
}

/** The readout in the corner: which state the machine is in, right now. */
export function SystemReadout() {
  const [i, setI] = useState(0);
  // Hidden at the very top: the hero already says SYS.INIT, and a chip that
  // repeats it competes with the opening frame. It comes online as you enter.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    function update() {
      ticking = false;
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const p = total > 0 ? window.scrollY / total : 0;
      const idx = Math.round(stagePosition(p));
      setI((prev) => (prev === idx ? prev : Math.min(STAGES.length - 1, Math.max(0, idx))));
      setVisible(p > 0.045);
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const stage = STAGES[i]!;
  const holding = stage.code === 'HOLD';

  return (
    <aside
      className={`pointer-events-none fixed bottom-5 right-[var(--gutter)] z-30 hidden transition-opacity duration-[var(--duration-base)] lg:block ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-live="polite"
      aria-label="Stato del sistema"
    >
      <div className="glass flex items-center gap-3 px-3.5 py-2.5">
        <span
          className={`block size-1.5 shrink-0 ${holding ? 'bg-amber' : 'bg-accent'} ${holding ? '' : 'pulse'}`}
        />
        <span className={`telemetry ${holding ? 'text-amber' : 'text-accent'}`}>{stage.code}</span>
        <span aria-hidden className="block h-3 w-px bg-rule-strong" />
        <span className="telemetry normal-case tracking-[0.08em] text-muted">{stage.note}</span>
      </div>
    </aside>
  );
}
