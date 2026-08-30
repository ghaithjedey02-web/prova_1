'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * A measured value counting up when it enters view.
 *
 * Not a growth-hacking flourish: these numbers are all labelled demonstration
 * data, and the count is what makes it legible that they are being *reported by
 * a system* rather than typeset by a designer.
 */
export function Counter({
  to,
  decimals = 0,
  suffix = '',
  prefix = '',
  duration = 1100,
  className = '',
}: {
  to: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || done.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(to);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting || done.current) return;
      done.current = true;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        // Decelerating, never bouncing: an instrument settling on a reading.
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(to * eased);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, duration]);

  return (
    <span ref={ref} className={`tnum ${className}`}>
      {prefix}
      {value.toLocaleString('it-IT', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}
