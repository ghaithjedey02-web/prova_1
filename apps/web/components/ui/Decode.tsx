'use client';

import { useEffect, useRef, useState } from 'react';

const GLYPHS = '01/\\|<>{}[]#+*=—·ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * A value resolving.
 *
 * Text arrives as noise and settles into its final characters left to right —
 * the way a readout looks when a system has just finished computing it. Used
 * only where something is genuinely being reported (a state, a code, a
 * headline), never as decoration on ordinary prose.
 *
 * Reduced motion gets the finished string immediately, and the accessible name
 * is always the real text: screen readers never hear the noise.
 */
export function Decode({
  text,
  delay = 0,
  speed = 26,
  className = '',
  as: Tag = 'span',
}: {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  as?: 'span' | 'p' | 'div';
}) {
  const [shown, setShown] = useState(text);
  const ref = useRef<HTMLElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || done.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let timer: ReturnType<typeof setTimeout>;
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting || done.current) return;
      done.current = true;
      io.disconnect();
      setShown('');
      timer = setTimeout(() => {
        const start = performance.now();
        const total = text.length * speed;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / total);
          const settled = Math.floor(t * text.length);
          let out = text.slice(0, settled);
          for (let i = settled; i < text.length; i++) {
            out += text[i] === ' ' ? ' ' : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
          setShown(out);
          if (t < 1) raf = requestAnimationFrame(tick);
          else setShown(text);
        };
        raf = requestAnimationFrame(tick);
      }, delay);
    }, { threshold: 0.4 });

    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); clearTimeout(timer); };
  }, [text, delay, speed]);

  return (
    <Tag ref={ref as never} className={className}>
      <span aria-hidden>{shown}</span>
      <span className="sr-only">{text}</span>
    </Tag>
  );
}
