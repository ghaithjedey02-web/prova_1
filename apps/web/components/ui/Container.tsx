import type { ReactNode } from 'react';

/** The single horizontal measure for the whole site. */
export function Container({
  children,
  className = '',
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`mx-auto w-full px-[var(--gutter)] ${wide ? 'max-w-[104rem]' : 'max-w-[78rem]'} ${className}`}
    >
      {children}
    </div>
  );
}
