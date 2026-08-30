import type { ReactNode } from 'react';

/** The single horizontal measure for the whole site. */
export function Container({
  children,
  className = '',
  size = 'wide',
}: {
  children: ReactNode;
  className?: string;
  size?: 'wide' | 'read' | 'narrow';
}) {
  const max =
    size === 'wide' ? 'max-w-[var(--max)]' : size === 'read' ? 'max-w-[var(--max-read)]' : 'max-w-[58rem]';
  return <div className={`mx-auto w-full px-[var(--gutter)] ${max} ${className}`}>{children}</div>;
}
