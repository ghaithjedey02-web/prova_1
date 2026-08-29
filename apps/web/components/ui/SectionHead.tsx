import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

/**
 * The one section header used everywhere.
 * A numbered rail plus a display headline — the numbering encodes reading
 * order in a narrative page, which is information rather than decoration.
 */
export function SectionHead({
  num,
  label,
  headline,
  children,
}: {
  num?: string;
  label: string;
  headline: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="max-w-[52ch]">
      <Reveal>
        <p className="label flex items-center gap-3">
          {num && <span className="tnum text-accent">{num}</span>}
          <span>{label}</span>
        </p>
      </Reveal>
      <Reveal delay={80}>
        <h2 className="headline mt-6 text-[length:var(--text-display-m)]">{headline}</h2>
      </Reveal>
      {children && <Reveal delay={150}><div className="mt-7">{children}</div></Reveal>}
    </header>
  );
}
