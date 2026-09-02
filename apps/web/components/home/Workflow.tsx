'use client';

import { useState } from 'react';
import { Chapter } from '@/components/ui/Chapter';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { workflow as c } from '@/content/site';

/**
 * Chapter 04 — the loop, and the visitor's own process drawn onto it.
 *
 * Eight stations, always the same: INPUT → COMPRENDE → ESTRAE → VERIFICA →
 * COLLEGA → CONFLITTO → DECISIONE UMANA → AZIONE. Picking a process fills the
 * chain with that process's words; the shape never changes, which is the
 * argument. Every line is a capability description — no invented outcome,
 * no invented minutes.
 */
export function Workflow() {
  const [active, setActive] = useState(0);
  const it = c.items[active]!;
  const text = [it.input, c.fixed.comprende, c.fixed.estrae, it.verifica, it.collega, it.conflitto, it.persona, it.azione];

  return (
    <section className="band relative py-[var(--space-section)]" aria-labelledby="workflow-heading">
      <Container>
        <Chapter n={c.n} label={c.label} headline={c.headline} lead={c.body} id="workflow-heading" />

        <Reveal delay={80}>
          <div className="mt-[var(--space-block)] -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0" role="tablist" aria-label="Processi aziendali">
            {c.items.map((item, i) => {
              const on = i === active;
              return (
                <button
                  key={item.k}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(i)}
                  className={`min-h-10 flex-none whitespace-nowrap rounded-[4px] border px-3.5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] transition-colors duration-[var(--duration-fast)] ${
                    on ? 'border-accent bg-accent-soft text-accent' : 'border-border-ui text-ink-2 hover:border-accent/70 hover:text-ink'
                  }`}
                >
                  {item.k}
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={140}>
          <ol className="mt-6 grid gap-px overflow-hidden rounded-[var(--radius-frame)] border border-rule-strong bg-rule sm:grid-cols-2 lg:grid-cols-4">
            {c.stations.map((st, i) => {
              const human = i === c.human;
              const conflict = i === c.human - 1;
              const tone = human ? 'text-amber' : conflict ? 'text-amber' : i === 0 || i === 7 ? 'text-muted' : 'text-accent';
              return (
                <li key={st} className="relative bg-raised p-5">
                  <div className="flex items-center gap-2.5">
                    <span className={`tnum font-mono text-[0.6875rem] ${tone}`}>{String(i + 1).padStart(2, '0')}</span>
                    <span className={`font-mono text-[0.6875rem] uppercase tracking-[0.14em] ${tone}`}>{st}</span>
                    {i < c.stations.length - 1 && <span aria-hidden className="ml-auto text-faint">→</span>}
                  </div>
                  <p key={`${active}-${i}`} className={`settle mt-3 text-[0.9375rem] leading-snug ${human ? 'font-medium text-ink' : 'text-ink-2'}`}>{text[i]}</p>
                  {human && <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-amber">Solo quando serve · mai saltata</p>}
                </li>
              );
            })}
          </ol>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-5 max-w-[70ch] text-[length:var(--text-small)] text-muted">
            {c.note}{' '}
            <a href="/contatto" className="-my-2 inline-block py-2 text-ink underline decoration-rule-bright underline-offset-4 transition-colors hover:text-accent hover:decoration-accent">
              Parliamone →
            </a>
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
