'use client';

/**
 * Chooses the fidelity tier for The Line.
 *
 * The rule the brief set is that no visitor should ever meet a broken or
 * unusable experience. So this is deliberately conservative: anything we cannot
 * positively confirm falls back a tier. A phone that renders the 2D version
 * beautifully is a better outcome than a phone that renders 3D at 12fps.
 */
export type Tier = 'three' | 'canvas' | 'static';

export function detectTier(): Tier {
  if (typeof window === 'undefined') return 'static';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'static';

  // Coarse pointer + narrow viewport: a phone. The 2D tier reads better there
  // anyway, because a small canvas cannot carry a spatial scene.
  const narrow = window.matchMedia('(max-width: 860px)').matches;
  if (narrow) return 'canvas';

  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (typeof mem === 'number' && mem < 4) return 'canvas';
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return 'canvas';

  if (!hasWebGL()) return 'canvas';
  return 'three';
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}
