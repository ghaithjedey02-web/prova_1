/**
 * The part.
 *
 * DOLMIR's hero object is not an abstract shape: it is FL-2280, the turned
 * flange that arrives in the first sample email of the live demonstration.
 * The same dimensions drive the 3D render, the 2D canvas drawing and the static
 * SVG, so a visitor who drops from WebGL to a phone fallback is still looking
 * at the same component, drawn three ways — render, CAD view, drawing.
 *
 * Units are millimetres, exactly as they would be on the drawing. Each renderer
 * scales them into its own space.
 */
export const PART = {
  code: 'FL-2280',
  revision: 'C',
  name: 'Flangia tornita, foratura periferica',
  material: 'Acciaio C40',
  treatment: 'Zincatura bianca',

  outerDiameter: 180,
  innerDiameter: 62,
  boltCircle: 138,
  holeDiameter: 13,
  holeCount: 6,
  thickness: 18,
  hubDiameter: 96,
  hubHeight: 12,
} as const;

/** Callouts drawn beside the part. Values are the ones on the drawing. */
export const CALLOUTS = [
  { id: 'od', label: 'Ø180 h9' },
  { id: 'bore', label: 'Ø62 H7' },
  { id: 'bcd', label: 'Ø138 BCD' },
  { id: 'hole', label: '6 × Ø13' },
  { id: 'thk', label: '18 ±0,05' },
] as const;

/** Positions of the peripheral holes on the bolt circle, in radians. */
export function holeAngles(): number[] {
  return Array.from({ length: PART.holeCount }, (_, i) => (i / PART.holeCount) * Math.PI * 2);
}
