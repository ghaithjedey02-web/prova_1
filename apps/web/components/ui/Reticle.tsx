'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * The pointer, as an instrument.
 *
 * A 12px crosshair that grows into a bracketed square over anything
 * interactive. Deliberately not a large circle chasing the cursor with lag:
 * this tracks exactly, reads as a targeting reticle, and disappears entirely on
 * touch devices and under reduced motion.
 */
export function Reticle() {
  const dot = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches) return;
    setOn(true);
    document.documentElement.classList.add('cursor-host');

    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    function onMove(e: PointerEvent) {
      x = e.clientX; y = e.clientY;
      const t = e.target as HTMLElement | null;
      setActive(Boolean(t?.closest('a, button, input, textarea, select, [role="button"]')));
      if (!raf) raf = requestAnimationFrame(apply);
    }
    function apply() {
      raf = 0;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('cursor-host');
    };
  }, []);

  if (!on) return null;

  return (
    <div ref={dot} className="reticle" aria-hidden>
      <div
        className={`relative -translate-x-1/2 -translate-y-1/2 transition-all duration-[var(--duration-fast)] ease-[var(--ease-mech-out)] ${
          active ? 'size-7' : 'size-3'
        }`}
      >
        {active ? (
          <>
            <span className="absolute left-0 top-0 size-2 border-l border-t border-white" />
            <span className="absolute right-0 top-0 size-2 border-r border-t border-white" />
            <span className="absolute bottom-0 left-0 size-2 border-b border-l border-white" />
            <span className="absolute bottom-0 right-0 size-2 border-b border-r border-white" />
          </>
        ) : (
          <>
            <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white" />
            <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-white" />
          </>
        )}
      </div>
    </div>
  );
}
