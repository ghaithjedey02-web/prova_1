'use client';

import { useCallback, useEffect, useState } from 'react';
import { pipeline } from '@/content/site';

/**
 * The spine — the pipeline written down the right edge of the homepage.
 *
 * Each chapter of the page carries a `data-spine` index; as the visitor
 * scrolls, the word for the chapter under the viewport centre lights up.
 * Scrolling the page IS reading the pipeline: a visitor who skims without
 * reading a single paragraph still leaves knowing INPUT → … → DECISIONE
 * UMANA → AZIONE, with amber exactly where a person decides.
 *
 * Words are clickable and jump to their chapter. Vertical writing keeps the
 * rail inside the free margin from 1280px up; on ultrawide screens it steps
 * inboard of the instrumentation rail. Hidden over the hero and the footer —
 * the spine belongs to the story, not to the whole viewport.
 */
export function Spine() {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-spine]'));
    if (els.length === 0) return;
    let raf = 0;
    const compute = () => {
      raf = 0;
      const cy = window.innerHeight * 0.5;
      let cur: number | null = null;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.top <= cy && r.bottom >= cy) { cur = Number(el.dataset.spine); break; }
        if (r.top > cy) break; // document order: nothing further can contain cy
      }
      setActive((prev) => (prev === cur ? prev : cur));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(compute); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const jump = useCallback((i: number) => {
    const el = document.querySelector<HTMLElement>(`[data-spine="${i}"]`);
    el?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
  }, []);

  return (
    <nav
      aria-label="Il percorso DOLMIR"
      className={`fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center transition-opacity duration-[var(--duration-base)] min-[1280px]:flex min-[1900px]:right-[4.25rem] ${
        active === null ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      data-inspect="Spine · la pipeline lungo lo scroll"
    >
      {pipeline.words.map((w, i) => (
        <span key={w} className="flex flex-col items-center">
          {i > 0 && <span aria-hidden className="my-2 block h-4 w-px bg-rule-strong" />}
          <button
            type="button"
            onClick={() => jump(i)}
            tabIndex={active === null ? -1 : 0}
            className={`telemetry whitespace-nowrap py-0.5 transition-colors duration-300 [writing-mode:vertical-rl] hover:text-ink ${
              active === i
                ? i === pipeline.human ? 'text-amber' : 'text-accent'
                : active !== null && i < active ? 'text-muted' : 'text-faint'
            }`}
          >
            {w}
          </button>
        </span>
      ))}
    </nav>
  );
}
