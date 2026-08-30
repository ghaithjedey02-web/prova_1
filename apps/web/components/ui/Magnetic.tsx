'use client';

import { useRef, type ReactNode } from 'react';

/**
 * Draws its child a little toward the pointer.
 *
 * Kept to a maximum of 6px: enough that a control feels responsive to
 * proximity, not enough to become a toy. Disabled entirely on coarse pointers
 * and under reduced motion.
 */
export function Magnetic({ children, strength = 6, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  function onMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    el.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`;
  }

  function reset() {
    const el = ref.current;
    if (el) el.style.transform = '';
  }

  return (
    <span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`inline-block transition-transform duration-[var(--duration-base)] ease-[var(--ease-mech-out)] ${className}`}
    >
      {children}
    </span>
  );
}
