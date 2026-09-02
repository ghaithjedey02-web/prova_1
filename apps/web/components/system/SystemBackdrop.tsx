/**
 * The ground the page sits on.
 *
 * One fixed layer: a fine drafting grid, a cold pool of light at the top, a
 * vignette that keeps type legible. Painted in CSS, costs nothing, never
 * competes with a product frame. The WebGL machine that used to live here is
 * gone — the product is the illustration now, and it is drawn in the DOM.
 */
export function SystemBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 sheet-fine opacity-20" />
      <div className="absolute inset-0 pool" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_58%_46%_at_50%_50%,transparent_0%,var(--c-ground)_82%)] opacity-60" />
    </div>
  );
}
