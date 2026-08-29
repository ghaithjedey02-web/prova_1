import Link from 'next/link';
import type { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

const base =
  'inline-flex items-center justify-center gap-2.5 rounded-sm font-medium ' +
  'transition-[background-color,border-color,color,transform] duration-[var(--duration-fast)] ' +
  'ease-[var(--ease-mech)] active:translate-y-px select-none';

const sizes = 'px-6 py-3.5 text-[var(--text-small)]';

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-accent-ink hover:bg-accent-hover',
  secondary: 'border border-rule-strong text-ink hover:border-accent hover:text-accent',
  ghost: 'text-ink-2 hover:text-accent',
};

export function Button({
  href,
  children,
  variant = 'primary',
  className = '',
  arrow = false,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  arrow?: boolean;
}) {
  return (
    <Link href={href} className={`${base} ${sizes} ${variants[variant]} ${className}`}>
      {children}
      {arrow && (
        <span aria-hidden className="font-mono text-[0.9em] leading-none">→</span>
      )}
    </Link>
  );
}
