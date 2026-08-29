import type { ReactNode } from 'react';

export function Pane({
  title,
  meta,
  children,
  className = '',
}: {
  title: string;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`flex min-h-0 flex-col border border-rule bg-surface ${className}`}>
      <header className="flex items-center justify-between gap-3 border-b border-rule px-4 py-3">
        <h3 className="label">{title}</h3>
        {meta}
      </header>
      {/* `overscroll-contain` stops a scrolled pane from chaining into the page,
          which on a trackpad feels like the page jumping. */}
      <div className="min-h-0 flex-1 overflow-auto overscroll-contain">{children}</div>
    </section>
  );
}

export function Confidence({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const tone = value === 0 ? 'bg-rule-strong' : value < 0.7 ? 'bg-amber' : 'bg-accent';
  return (
    <span className="flex items-center gap-2" title={`Confidenza ${pct}%`}>
      <span className="block h-1 w-10 overflow-hidden rounded-xs bg-rule">
        <span className={`block h-full ${tone}`} style={{ width: `${Math.max(pct, 2)}%` }} />
      </span>
      <span className="font-mono text-[var(--text-label)] tnum text-muted">{pct}%</span>
    </span>
  );
}

const toneMap = {
  neutral: 'bg-rule text-ink-2',
  accent: 'bg-accent-soft text-accent',
  amber: 'bg-amber-soft text-amber',
  good: 'bg-good-soft text-good',
  bad: 'bg-bad-soft text-bad',
} as const;

export function Tag({ children, tone = 'neutral' }: { children: ReactNode; tone?: keyof typeof toneMap }) {
  return (
    <span className={`inline-flex items-center rounded-xs px-2 py-1 font-mono text-[var(--text-label)] tracking-[0.1em] uppercase ${toneMap[tone]}`}>
      {children}
    </span>
  );
}
