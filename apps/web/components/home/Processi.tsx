'use client';

import { useState } from 'react';
import { Chapter } from '@/components/ui/Chapter';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { processi as c } from '@/content/site';

/**
 * "Adesso immaginate il vostro." — the visitor points at their own process.
 *
 * Eight processes every company recognises. Picking one redraws the same
 * five-station flow — INPUT → DOLMIR → VERIFICA → DECISIONE → AZIONE — with
 * that process's concrete words: what actually arrives, what actually gets
 * checked, where the person actually decides. The shape never changes, which
 * IS the argument: DOLMIR is one architecture applied to their bottleneck,
 * not eight different products.
 *
 * Every line is a capability description. No invented outcomes, no invented
 * minutes — that discipline belongs to the whole site, and a section whose
 * purpose is "picture this in your company" is exactly where breaking it
 * would do the most damage.
 */
export function Processi() {
  const [active, setActive] = useState(0);
  const it = c.items[active]!;

  const stations = [
    { label: c.flowLabels[0]!, text: it.input, tone: 'plain' as const },
    { label: c.flowLabels[1]!, text: 'Legge, estrae, struttura — ogni dato con la sua fonte', tone: 'accent' as const },
    { label: c.flowLabels[2]!, text: it.verifica, tone: 'accent' as const },
    { label: c.flowLabels[3]!, text: it.persona, tone: 'amber' as const },
    { label: c.flowLabels[4]!, text: it.azione, tone: 'plain' as const },
  ];

  return (
    <section className="relative py-[var(--space-section)]" aria-labelledby="processi-heading">
      <Container>
        <Chapter n={c.n} label={c.label} headline={c.headline} lead={c.body} id="processi-heading" />

        {/* the processes — pick yours */}
        <Reveal delay={100}>
          <div className="mt-[var(--space-block)] flex flex-wrap gap-2" role="tablist" aria-label="Processi aziendali">
            {c.items.map((item, i) => {
              const on = i === active;
              return (
                <button
                  key={item.k}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(i)}
                  className={`border px-3.5 py-2 font-mono text-[length:var(--text-label)] tracking-[0.1em] transition-colors duration-[var(--duration-fast)] ${
                    on
                      ? 'border-accent bg-accent-soft text-accent'
                      : 'border-border-ui text-ink-2 hover:border-accent/70 hover:text-ink'
                  }`}
                >
                  {item.k}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* the same shape, in their words */}
        <Reveal delay={160}>
          <div className="mt-6 border border-rule-strong bg-surface/70">
            <ol className="grid md:grid-cols-5 md:gap-px md:bg-rule">
              {stations.map((s, i) => (
                <li key={s.label} className="relative bg-surface/95 p-5 md:p-5 lg:p-6">
                  {/* connector on mobile: a vertical descent, not five islands */}
                  {i > 0 && <span aria-hidden className="absolute -top-px left-5 h-px w-6 bg-rule-bright md:hidden" />}
                  <p
                    className={`font-mono text-[length:var(--text-label)] tracking-[0.12em] ${
                      s.tone === 'amber' ? 'text-amber' : s.tone === 'accent' ? 'text-accent' : 'text-muted'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')} · {s.label}
                  </p>
                  <p key={`${active}-${i}`} className="settle mt-2.5 text-[length:var(--text-small)] leading-snug text-ink-2">
                    {s.text}
                  </p>
                  {s.tone === 'amber' && (
                    <p className="mt-2 font-mono text-[length:var(--text-label)] tracking-[0.1em] text-amber">
                      SOLO QUANDO SERVE
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        <Reveal delay={220}>
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
