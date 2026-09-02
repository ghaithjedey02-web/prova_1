import type { ReactNode } from 'react';

/**
 * A quiet stage for the Core.
 *
 * The hero already tells the whole story in motion, so the console does not
 * need a second explainer playing behind its microphone — it needs presence.
 * One radial light, a fine drafting grid, and the Core alone in the middle
 * like an instrument on a bench. Nothing here competes with the conversation
 * underneath it.
 */
export function CoreStage({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex aspect-[5/4] items-center justify-center overflow-hidden border border-rule-strong bg-void sm:aspect-[16/9] lg:aspect-[21/9]">
      <div aria-hidden className="sheet-fine absolute inset-0 opacity-30" />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_45%_60%_at_50%_50%,rgb(69_199_222/0.14)_0%,transparent_70%)]"
      />
      <div aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-accent-line to-transparent opacity-60" />
      <div className="relative">{children}</div>
    </div>
  );
}
