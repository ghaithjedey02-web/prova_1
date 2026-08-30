'use client';

import { useEffect, useState } from 'react';

/**
 * Reads the live design tokens so canvas and WebGL draw in the same colours as
 * the DOM. Without this the 3D keeps its old palette when the theme changes,
 * which is the single most obvious tell that a scene was bolted on.
 */
export interface Palette {
  ink: string;
  accent: string;
  amber: string;
  muted: string;
  rule: string;
  steel: string;
}

function read(): { palette: Palette; dark: boolean } {
  const s = getComputedStyle(document.documentElement);
  const v = (n: string, f: string) => s.getPropertyValue(n).trim() || f;
  const explicit = document.documentElement.getAttribute('data-theme');
  const dark = explicit ? explicit === 'dark' : true;
  return {
    dark,
    palette: {
      ink: v('--c-ink', '#F2F4F5'),
      accent: v('--c-accent', '#45C7DE'),
      amber: v('--c-amber', '#E3A551'),
      muted: v('--c-muted', '#7B858A'),
      rule: v('--c-rule-strong', '#2E353B'),
      steel: v('--c-steel-hi', '#6F7A80'),
    },
  };
}

export function usePalette() {
  const [state, setState] = useState<{ palette: Palette | null; dark: boolean }>({
    palette: null,
    dark: true,
  });

  useEffect(() => {
    setState(read());
    const mo = new MutationObserver(() => setState(read()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => mo.disconnect();
  }, []);

  return state;
}
