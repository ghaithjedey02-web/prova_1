import type { ReactNode } from 'react';

/** An instrument panel: titled frame with a hairline head and a scroll body. */
export function Pane({
  title,
  meta,
  children,
  className = '',
  bodyClassName = '',
}: {
  title: string;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={`panel flex min-h-0 flex-col ${className}`}>
      <header className="flex items-center justify-between gap-3 border-b border-rule px-5 py-3.5">
        <h3 className="label">{title}</h3>
        {meta}
      </header>
      {/* overscroll-contain stops a scrolled pane from chaining into the page. */}
      <div className={`min-h-0 flex-1 overflow-auto overscroll-contain ${bodyClassName}`}>{children}</div>
    </section>
  );
}

/** Confidence as a measured bar, not a badge. Zero reads as an empty gauge. */
export function Confidence({ value, floor }: { value: number; floor?: number }) {
  const pct = Math.round(value * 100);
  const low = floor !== undefined && value < floor;
  const tone = value === 0 ? 'bg-rule-strong' : low ? 'bg-amber' : 'bg-accent';
  return (
    <span className="flex items-center gap-2.5" title={`Confidenza ${pct}%`}>
      <span className="relative block h-1 w-12 overflow-hidden bg-rule/70">
        <span className={`block h-full ${tone}`} style={{ width: `${Math.max(pct, 2)}%` }} />
      </span>
      <span className={`font-mono text-[length:var(--text-label)] tnum ${low ? 'text-amber' : 'text-muted'}`}>{pct}%</span>
    </span>
  );
}

const toneMap = {
  neutral: 'border-rule-strong text-ink-2',
  accent: 'border-accent-line text-accent',
  amber: 'border-amber-line text-amber',
  good: 'border-good/40 text-good',
  bad: 'border-bad/40 text-bad',
} as const;

export function Tag({ children, tone = 'neutral' }: { children: ReactNode; tone?: keyof typeof toneMap }) {
  return (
    <span
      className={`inline-flex items-center border px-2.5 py-1 font-mono text-[length:var(--text-label)] uppercase tracking-[0.16em] ${toneMap[tone]}`}
    >
      {children}
    </span>
  );
}

/** The verdict band. The single most important pixel area of the demo. */
export function Verdict({
  code,
  title,
  body,
  tone,
}: {
  code: string;
  title: string;
  body: string;
  tone: 'good' | 'amber' | 'neutral';
}) {
  const skin =
    tone === 'good'
      ? 'border-good/40 bg-good-soft/50'
      : tone === 'amber'
        ? 'border-amber-line bg-amber-soft/60'
        : 'border-rule bg-surface';
  const text = tone === 'good' ? 'text-good' : tone === 'amber' ? 'text-amber' : 'text-ink-2';
  const dot = tone === 'good' ? 'bg-good' : tone === 'amber' ? 'bg-amber' : 'bg-rule-strong';

  return (
    <div className={`border ${skin}`}>
      <div className="flex items-center gap-3 border-b border-inherit px-5 py-3">
        <span aria-hidden className={`block size-1.5 ${dot}`} />
        <p className={`font-mono text-[length:var(--text-label)] uppercase tracking-[0.2em] ${text}`}>{code}</p>
      </div>
      <div className="px-5 py-6">
        <p className={`font-display text-[length:var(--text-display-s)] font-semibold tracking-[-0.02em] ${text}`}>{title}</p>
        <p className="mt-3 max-w-[54ch] text-[length:var(--text-small)] leading-relaxed text-ink-2">{body}</p>
      </div>
    </div>
  );
}
