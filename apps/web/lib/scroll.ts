'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * One scalar drives the whole experience.
 *
 * Every scroll-reactive thing on the homepage — the 3D system, the stage
 * readout, the section chrome — reads the same 0..1 page progress, written once
 * per frame from a single rAF-throttled listener. That is what keeps the visual
 * and the narrative from ever disagreeing, and it means adding another reactive
 * element costs no extra scroll handler.
 */
export function usePageProgress() {
  const progress = useRef(0);
  const velocity = useRef(0);

  useEffect(() => {
    let ticking = false;
    let last = 0;
    let lastT = performance.now();

    function update() {
      ticking = false;
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
      const now = performance.now();
      const dt = Math.max(16, now - lastT);
      velocity.current = ((p - last) / dt) * 1000;
      last = p;
      lastT = now;
      progress.current = p;
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
  }, []);

  return { progress, velocity };
}

/**
 * Reports which system stage a section is in, for chrome that needs to re-render
 * (readouts, labels) rather than animate. Deliberately state, not a ref: it
 * changes six times over a whole page, not sixty times a second.
 */
export function useStage(stages: readonly { at: number }[]) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let ticking = false;
    function update() {
      ticking = false;
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const p = total > 0 ? window.scrollY / total : 0;
      let next = 0;
      for (let i = 0; i < stages.length; i++) if (p >= stages[i]!.at) next = i;
      setIndex((prev) => (prev === next ? prev : next));
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
  }, [stages]);

  return index;
}
