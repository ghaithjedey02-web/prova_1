'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { detectTier, type Tier } from '@/lib/capability';
import { usePalette } from '@/lib/palette';
import { ForgeStatic } from './ForgeStatic';

const ForgeScene = dynamic(() => import('./ForgeScene'), { ssr: false });
const ForgeCanvas2D = dynamic(() => import('./ForgeCanvas2D'), { ssr: false });

/**
 * Fidelity ladder for the hero object.
 *
 *   three  → lit metal render          (desktop, WebGL, enough cores)
 *   canvas → live orthographic CAD view (phones, weak GPUs)
 *   static → dimensioned drawing        (reduced motion, no JS, first paint)
 *
 * Two rules the whole thing exists to satisfy: nobody ever sees a broken frame,
 * and the 3D never loads until it is actually on screen.
 */
export function Forge({ className = '' }: { className?: string }) {
  const [tier, setTier] = useState<Tier | null>(null);
  const [visible, setVisible] = useState(false);
  const palette = usePalette();
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTier(detectTier());
  }, []);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setVisible(Boolean(e?.isIntersecting)),
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const showStatic = tier === null || tier === 'static' || !palette;

  return (
    <div ref={host} className={`relative ${className}`}>
      {showStatic ? (
        <ForgeStatic className="absolute inset-0 h-full w-full" />
      ) : !visible ? (
        <ForgeStatic className="absolute inset-0 h-full w-full opacity-40" />
      ) : tier === 'three' ? (
        <ForgeScene palette={palette!} />
      ) : (
        <ForgeCanvas2D palette={palette!} />
      )}
    </div>
  );
}
