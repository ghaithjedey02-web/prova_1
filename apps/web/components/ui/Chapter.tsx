import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

/**
 * The opening of an act.
 *
 * Every major section of the site starts the same way — index, label, headline,
 * optional lead — so the page reads as a numbered document rather than a stack
 * of unrelated marketing blocks.
 */
export function Chapter({
  n,
  label,
  headline,
  lead,
  size = 'm',
  align = 'left',
  className = '',
  children,
}: {
  n?: string;
  label: string;
  headline: ReactNode;
  lead?: ReactNode;
  size?: 'm' | 'l';
  align?: 'left' | 'center';
  className?: string;
  children?: ReactNode;
}) {
  const h = size === 'l' ? 'text-[length:var(--text-display-l)]' : 'text-[length:var(--text-display-m)]';
  return (
    <header className={`${align === 'center' ? 'mx-auto text-center' : ''} ${className}`}>
      <Reveal>
        <p className="chapter">
          {n && <span className="tnum text-accent">{n}</span>}
          <span>{label}</span>
        </p>
      </Reveal>
      <Reveal delay={70}>
        <h2 className={`headline mt-7 max-w-[19ch] ${h} ${align === 'center' ? 'mx-auto' : ''}`}>{headline}</h2>
      </Reveal>
      {lead && (
        <>
          <Reveal delay={110}>
            <div
              className={`mt-8 h-px w-full max-w-[16rem] bg-gradient-to-r from-accent to-transparent ${
                align === 'center' ? 'mx-auto' : ''
              }`}
            />
          </Reveal>
          <Reveal delay={160}>
            <p className={`lead mt-7 ${align === 'center' ? 'mx-auto' : ''}`}>{lead}</p>
          </Reveal>
        </>
      )}
      {children}
    </header>
  );
}
