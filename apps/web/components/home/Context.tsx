'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Chip } from '@/components/product/primitives';
import { Chapter } from '@/components/ui/Chapter';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { contesto as c } from '@/content/site';

/**
 * Chapter 03 — the context: records, and the relationships between them.
 *
 * The step every description calls "connects" and no illustration shows.
 * The customer sits in the middle; around it the request, the previous
 * quotation, the open order, the drawing and the person who wrote — each a
 * real record from the demo company, each linked with a hairline drawn
 * between the actual boxes after layout. The relationship that matters is
 * amber and labelled: the new request and the previous quotation disagree on
 * quantity. Tap a record to read what the system knows about it.
 *
 * Wide screens draw the graph; phones read it as a list with a spine, the
 * customer first, the amber relation carried as a chip on the two records.
 */

type Line = { x1: number; y1: number; x2: number; y2: number; amber?: boolean };

const tone = (s: 'read' | 'verified' | 'conflict') => (s === 'conflict' ? 'amber' : s === 'verified' ? 'good' : 'info');
const stateLabel = (s: 'read' | 'verified' | 'conflict') => (s === 'conflict' ? 'conflitto' : s === 'verified' ? 'verificato' : 'letto');

export function Context() {
  const [focus, setFocus] = useState<string>(c.relation.a);
  const box = useRef<HTMLDivElement>(null);
  const nodes = useRef(new Map<string, HTMLElement>());
  const [lines, setLines] = useState<Line[]>([]);
  const [label, setLabel] = useState<{ x: number; y: number } | null>(null);

  const measure = useCallback(() => {
    const root = box.current;
    if (!root) return;
    const R = root.getBoundingClientRect();
    const center = (k: string) => { const el = nodes.current.get(k); if (!el) return null; const b = el.getBoundingClientRect(); return { x: b.left - R.left + b.width / 2, y: b.top - R.top + b.height / 2, w: b.width, h: b.height }; };
    const hub = center('hub');
    if (!hub) return;
    const out: Line[] = [];
    for (const n of c.nodes) {
      const p = center(n.k);
      if (p) out.push({ x1: hub.x, y1: hub.y, x2: p.x, y2: p.y });
    }
    const a = center(c.relation.a), b = center(c.relation.b);
    if (a && b) { out.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, amber: true }); setLabel({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }); }
    setLines(out);
  }, []);

  useLayoutEffect(() => { measure(); }, [measure]);
  useEffect(() => {
    const ro = new ResizeObserver(() => measure());
    if (box.current) ro.observe(box.current);
    return () => ro.disconnect();
  }, [measure]);

  const reg = (k: string) => (el: HTMLElement | null) => { if (el) nodes.current.set(k, el); else nodes.current.delete(k); };
  const focused = focus === 'hub' ? null : c.nodes.find((n) => n.k === focus) ?? null;

  const Card = ({ k, id, kind, t, state, src, graph = false }: { k: string; id: string; kind: string; t: string; state: 'read' | 'verified' | 'conflict'; src: string; graph?: boolean }) => {
    const on = focus === k;
    const rel = k === c.relation.a || k === c.relation.b;
    return (
      <button
        type="button"
        ref={graph ? reg(k) : undefined}
        onClick={() => setFocus(k)}
        aria-pressed={on}
        className={`relative z-10 w-full rounded-[6px] border bg-raised px-3.5 py-3 text-left transition-colors duration-[var(--duration-base)] ${on ? 'border-accent' : rel ? 'border-amber/50 hover:border-amber' : 'border-rule-strong hover:border-rule-bright'}`}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted">{kind}</p>
          <Chip tone={tone(state)}>{stateLabel(state)}</Chip>
        </div>
        <p className="mt-1.5 truncate font-mono text-[0.8125rem] text-ink">{id}</p>
        <p className="mt-0.5 truncate text-[0.875rem] text-ink-2">{t}</p>
        <p className="mt-1 truncate font-mono text-[0.6875rem] text-faint">{src}</p>
      </button>
    );
  };

  const Hub = ({ graph = false }: { graph?: boolean }) => (
    <div
      ref={graph ? reg('hub') : undefined}
      onClick={() => setFocus('hub')}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFocus('hub'); } }}
      aria-pressed={focus === 'hub'}
      className={`relative z-10 rounded-[8px] border-2 bg-surface px-4 py-4 text-left transition-colors ${focus === 'hub' ? 'border-accent' : 'border-accent-line'}`}
    >
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-accent">Cliente · {c.center.id}</p>
      <p className="mt-1.5 font-display text-[1.15rem] font-semibold tracking-[-0.01em] text-ink">{c.center.t}</p>
      <p className="mt-1 text-[0.8125rem] leading-snug text-muted">{c.center.sub}</p>
    </div>
  );

  const [n0, n1, n2, n3, n4] = c.nodes;

  return (
    <section id="contesto" className="relative scroll-mt-[var(--nav-h)] py-[var(--space-section)]" aria-labelledby="contesto-heading">
      <Container>
        <Chapter n={c.n} label={c.label} headline={c.headline} lead={c.body} id="contesto-heading" />

        <Reveal delay={100} className="min-w-0">
          {/* wide: the graph */}
          <div ref={box} className="relative mt-[var(--space-block)] hidden lg:block">
            <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
              {lines.map((l, i) => (
                <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.amber ? 'var(--c-amber)' : 'var(--c-rule-bright)'} strokeWidth={l.amber ? 1.5 : 1} strokeDasharray={l.amber ? '4 4' : undefined} />
              ))}
            </svg>
            {label && (
              <span className="absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-[4px] bg-ground px-1.5 py-1" style={{ left: label.x, top: label.y }}>
                <Chip tone="amber">{c.relation.label}</Chip>
              </span>
            )}
            <div className="grid grid-cols-3 gap-x-16 gap-y-10 xl:gap-x-24">
              <div className="self-end"><Card {...n0!} graph /></div>
              <div />
              <div className="self-end"><Card {...n1!} graph /></div>
              <div className="self-center"><Card {...n2!} graph /></div>
              <div className="self-center"><Hub graph /></div>
              <div className="self-center"><Card {...n3!} graph /></div>
              <div />
              <div className="self-start"><Card {...n4!} graph /></div>
              <div />
            </div>
          </div>

          {/* narrow: the list with a spine */}
          <div className="mt-[var(--space-block)] lg:hidden">
            <Hub />
            <ol className="ml-4 mt-3 flex flex-col gap-3 border-l border-rule-bright pl-4">
              {c.nodes.map((n) => (
                <li key={n.k} className="relative">
                  <span aria-hidden className="absolute -left-4 top-1/2 h-px w-4 bg-rule-bright" />
                  <Card {...n} />
                </li>
              ))}
            </ol>
            <p className="mt-3 inline-flex"><Chip tone="amber">{c.relation.label}</Chip></p>
          </div>
        </Reveal>

        {/* what the system knows about the selected record */}
        <Reveal delay={160}>
          <div key={focus} className="settle mt-6 grid gap-3 rounded-[6px] border border-rule bg-surface/60 px-4 py-4 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-6">
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-accent">{focused ? focused.id : c.center.id}</p>
            <p className="text-[0.9375rem] leading-relaxed text-ink-2">{focused ? focused.d : `${c.center.t}: un cliente, tutti i suoi record. Ordini, offerte, documenti e conversazioni collegati fra gestionale, CRM e posta — senza ricopiare niente.`}</p>
          </div>
          <p className="mt-3 text-[length:var(--text-micro)] text-faint">{c.hint} · {c.disclaimer}</p>
        </Reveal>
      </Container>
    </section>
  );
}
