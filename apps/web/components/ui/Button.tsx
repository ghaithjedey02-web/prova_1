import Link from 'next/link';
import type { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

const base =
  'group inline-flex min-h-11 items-center justify-center gap-3 rounded-[4px] font-medium select-none ' +
  'transition-[background-color,border-color,color,box-shadow,transform] duration-[var(--duration-fast)] ' +
  'ease-[var(--ease-mech)] active:translate-y-px';

const sizes = {
  md: 'px-6 py-3 text-[length:var(--text-small)]',
  lg: 'px-7 py-3.5 text-[length:var(--text-body)] sm:px-8',
} as const;

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-accent-ink hover:bg-accent-hover',
  secondary: 'border border-border-ui text-ink hover:border-accent hover:text-accent',
  ghost: 'text-ink-2 hover:text-accent',
};

export function Button({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  arrow = false,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: keyof typeof sizes;
  className?: string;
  arrow?: boolean;
}) {
  return (
    <Link href={href} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
      {arrow && (
        <span
          aria-hidden
          className="font-mono text-[0.9em] leading-none transition-transform duration-[var(--duration-fast)] group-hover:translate-x-1"
        >
          →
        </span>
      )}
    </Link>
  );
}
