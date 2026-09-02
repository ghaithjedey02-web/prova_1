'use client';

import { useEffect, useState } from 'react';

/** The design tokens, read once, so every renderer shares one palette. */
export interface Palette {
  ink: string;
  accent: string;
  amber: string;
  violet: string;
  muted: string;
  rule: string;
  steel: string;
  /** The page ground, for canvas fills that must read as "paper on the dark". */
  ground: string;
}

function read(): Palette {
  const s = getComputedStyle(document.documentElement);
  const v = (n: string, f: string) => s.getPropertyValue(n).trim() || f;
  return {
    ink: v('--c-ink', '#F2F4F5'),
    accent: v('--c-accent', '#45C7DE'),
    amber: v('--c-amber', '#E3A551'),
    violet: v('--c-violet', '#9B8CFF'),
    muted: v('--c-muted', '#7B858A'),
    rule: v('--c-rule-strong', '#2E353B'),
    steel: v('--c-steel-hi', '#6F7A80'),
    ground: v('--c-ground', '#08090B'),
  };
}

/**
 * DOLMIR has one skin. This reads the live tokens once on mount so canvas and
 * WebGL draw in exactly the colours the DOM uses — there is no theme to watch.
 */
export function usePalette() {
  const [palette, setPalette] = useState<Palette | null>(null);
  useEffect(() => { setPalette(read()); }, []);
  return palette;
}
