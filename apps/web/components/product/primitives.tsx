import type { ReactNode } from 'react';

/**
 * The product primitives.
 *
 * Every chapter of the site shows a believable piece of DOLMIR — an inbox
 * row, an extracted field with its source, a verification line, a conflict, a
 * decision, an action list. They are drawn here once, with the same tokens as
 * the live console, so a frame on the homepage and the real interface read as
 * one object. Nothing in this file knows about animation: a frame renders a
 * state, and the scene that drives it decides which state.
 */

/* ---------------------------------------------------------------- states */

export type Tone = 'neutral' | 'info' | 'good' | 'amber';

const chipTone: Record<Tone, string> = {
  neutral: 'border-rule-strong text-ink-2',
  info: 'border-accent-line text-accent',
  good: 'border-good/40 text-good',
  amber: 'border-amber-line text-amber',
};

const dotTone: Record<Tone, string> = {
  neutral: 'bg-rule-bright',
  info: 'bg-accent',
  good: 'bg-good',
  amber: 'bg-amber',
};

/** VERIFICATO · CONFLITTO RILEVATO · DECISIONE RICHIESTA · NON DETERMINATO */
export function Chip({ tone = 'neutral', children, pulse = false }: { tone?: Tone; children: ReactNode; pulse?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-[3px] border px-2 py-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] ${chipTone[tone]}`}>
      <span aria-hidden className={`block size-1.5 rounded-full ${dotTone[tone]} ${pulse ? 'animate-pulse' : ''}`} />
      {children}
    </span>
  );
}

/* ----------------------------------------------------------------- frame */

/** A window of the product: title, optional status, body. */
export function Frame({
  title,
  status,
  children,
  className = '',
  bodyClassName = '',
}: {
  title: ReactNode;
  status?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div className={`frame overflow-hidden ${className}`}>
      <div className="frame-head">
        <p className="min-w-0 truncate font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted">{title}</p>
        {status && <div className="flex-none">{status}</div>}
      </div>
      <div className={`frame-body ${bodyClassName}`}>{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ mail */

/** An incoming email as it lands in a shared inbox. */
export function Mail({
  from,
  subject,
  time,
  excerpt,
  attachment,
  active = false,
}: {
  from: string;
  subject: string;
  time: string;
  excerpt?: string;
  attachment?: string;
  active?: boolean;
}) {
  return (
    <div className={`rounded-[4px] border px-3.5 py-3 transition-colors duration-[var(--duration-base)] ${active ? 'border-accent-line bg-accent-soft/40' : 'border-rule bg-surface/60'}`}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="truncate text-[0.875rem] font-medium text-ink">{from}</p>
        <p className="font-mono text-[0.6875rem] text-faint">{time}</p>
      </div>
      <p className="mt-0.5 truncate text-[0.875rem] text-ink-2">{subject}</p>
      {excerpt && <p className="mt-1 line-clamp-2 text-[0.8125rem] leading-snug text-muted">{excerpt}</p>}
      {attachment && (
        <p className="mt-2 inline-flex items-center gap-1.5 rounded-[3px] border border-rule-strong px-2 py-0.5 font-mono text-[0.6875rem] text-ink-2">
          <span aria-hidden className="block size-2 border border-rule-bright" />
          {attachment}
        </p>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- fields */

export type FieldState = 'pending' | 'read' | 'verified' | 'conflict' | 'unknown';

/**
 * One extracted field: label, value, where it came from, and its state.
 * `pending` renders an empty slot so a scene can fill fields one by one.
 */
export function Field({
  label,
  value,
  source,
  state = 'read',
}: {
  label: string;
  value?: string;
  source?: string;
  state?: FieldState;
}) {
  const tone: Tone = state === 'verified' ? 'good' : state === 'conflict' || state === 'unknown' ? 'amber' : state === 'read' ? 'info' : 'neutral';
  return (
    <div className="row">
      <p className="w-[5.5rem] flex-none font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-muted sm:w-[6.5rem]">{label}</p>
      <div className="min-w-0 flex-1">
        {state === 'pending' ? (
          <span aria-hidden className="block h-3 w-2/3 rounded-sm bg-rule/70" />
        ) : (
          <p className={`truncate text-[0.875rem] ${state === 'unknown' ? 'italic text-amber' : 'text-ink'}`}>{value}</p>
        )}
        {source && state !== 'pending' && <p className="truncate font-mono text-[0.6875rem] text-faint">{source}</p>}
      </div>
      <span aria-hidden className={`block size-1.5 flex-none rounded-full ${state === 'pending' ? 'bg-rule' : dotTone[tone]}`} />
    </div>
  );
}

/* ----------------------------------------------------------- verification */

export type CheckState = 'pending' | 'ok' | 'conflict';

/** One verification line: what was checked, against which system, result. */
export function Check({ what, against, state, note }: { what: string; against: string; state: CheckState; note?: string }) {
  return (
    <div className="row items-start">
      <span
        aria-hidden
        className={`mt-[0.45rem] block size-1.5 flex-none rounded-full ${state === 'ok' ? 'bg-good' : state === 'conflict' ? 'bg-amber' : 'bg-rule'}`}
      />
      <div className="min-w-0 flex-1">
        <p className={`text-[0.875rem] ${state === 'pending' ? 'text-muted' : 'text-ink'}`}>{what}</p>
        <p className="font-mono text-[0.6875rem] text-faint">{against}</p>
        {note && state === 'conflict' && <p className="mt-1 text-[0.8125rem] leading-snug text-amber">{note}</p>}
      </div>
      <span className={`flex-none font-mono text-[0.6875rem] uppercase tracking-[0.12em] ${state === 'ok' ? 'text-good' : state === 'conflict' ? 'text-amber' : 'text-faint'}`}>
        {state === 'ok' ? 'ok' : state === 'conflict' ? 'conflitto' : '…'}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------- decision */

/** The moment a person is asked. Buttons are real buttons when `onDecide` exists. */
export function Decision({
  question,
  detail,
  decided,
  onDecide,
  compact = false,
}: {
  question: string;
  detail?: string;
  decided?: string | null;
  onDecide?: (choice: 'APPROVA' | 'REVISIONA') => void;
  compact?: boolean;
}) {
  return (
    <div className="rounded-[6px] border border-amber/70 bg-amber-soft/40">
      <p className="flex items-center gap-2 border-b border-amber/30 px-3 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-amber">
        <span aria-hidden className="block size-1.5 bg-amber" />
        Decisione richiesta
      </p>
      <div className={compact ? 'px-3 py-2.5' : 'px-3.5 py-3'}>
        <p className="text-[0.9375rem] font-medium leading-snug text-ink">{question}</p>
        {detail && <p className="mt-1 text-[0.8125rem] leading-snug text-muted">{detail}</p>}
        {decided ? (
          <p className="mt-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-good">✓ {decided} · decisione registrata</p>
        ) : (
          <div className="mt-2.5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onDecide ? () => onDecide('APPROVA') : undefined}
              tabIndex={onDecide ? 0 : -1}
              aria-hidden={!onDecide}
              className="min-h-9 rounded-[4px] bg-accent px-3.5 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-accent-ink transition-opacity hover:opacity-90"
            >
              Approva
            </button>
            <button
              type="button"
              onClick={onDecide ? () => onDecide('REVISIONA') : undefined}
              tabIndex={onDecide ? 0 : -1}
              aria-hidden={!onDecide}
              className="min-h-9 rounded-[4px] border border-amber/70 px-3.5 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-amber transition-colors hover:bg-amber/10"
            >
              Revisiona
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- actions */

/** What happened after the person said yes. */
export function Actions({ items, done = 0 }: { items: readonly string[]; done?: number }) {
  return (
    <ul className="flex flex-col">
      {items.map((it, i) => {
        const on = i < done;
        return (
          <li key={it} className={`row text-[0.875rem] transition-colors duration-[var(--duration-base)] ${on ? 'text-ink' : 'text-faint'}`}>
            <span className={`flex-none font-mono text-[0.75rem] ${on ? 'text-good' : 'text-rule-bright'}`}>{on ? '✓' : '○'}</span>
            {it}
          </li>
        );
      })}
    </ul>
  );
}
