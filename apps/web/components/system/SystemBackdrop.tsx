'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { detectTier, type Tier } from '@/lib/capability';
import { usePalette } from '@/lib/palette';
import { usePageProgress } from '@/lib/scroll';
import { backdropBoost } from '@/lib/system-bus';
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
  const railStage = useRef<HTMLParagraphElement>(null);
  const railPct = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const p = progress.current ?? 0;
      if (railPct.current) railPct.current.textContent = `POSIZIONE ${String(Math.round(p * 100)).padStart(3, '0')} / 100`;
      if (railStage.current) {
        let st = STAGES[0]!;
        for (const g of STAGES) if (p >= g.at) st = g;
        railStage.current.textContent = `${st.code} · ${st.label.toUpperCase()}`;
      }
      // Atmosphere, not protagonist. The hero now carries its own scene — the
      // documents, the core, the amber stop — so the machine behind the page
      // stays faint everywhere and never competes with a thing that means
      // something.
      const base = p < 0.04 ? 0.22 : Math.max(0.28, 0.42 - (p - 0.04) * 2);
      // The intelligence section asks for the machine back at full strength.
      const o = Math.max(base, 0.94 * backdropBoost());
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

      {/* Ultrawide rails. On displays wider than the content measure, the
          outer margins carry live instrumentation instead of dead space:
          identity on the left, page position and current system stage on the
          right, both written by the same rAF loop that drives the opacity. */}
      <div className="absolute inset-y-0 left-0 hidden w-14 items-center justify-center border-r border-rule/50 min-[1900px]:flex">
        <p className="telemetry rotate-180 whitespace-nowrap text-faint [writing-mode:vertical-rl]">
          DOLMIR · SYS.ID 00482 · INFRASTRUTTURA DIGITALE INTELLIGENTE
        </p>
      </div>
      <div className="absolute inset-y-0 right-0 hidden w-14 flex-col items-center justify-between py-24 min-[1900px]:flex">
        <p ref={railStage} className="telemetry rotate-180 whitespace-nowrap text-muted [writing-mode:vertical-rl]" />
        <p className="telemetry text-faint [writing-mode:vertical-rl] rotate-180">
          <span ref={railPct} className="tnum" />
        </p>
      </div>
    </div>
  );
}
