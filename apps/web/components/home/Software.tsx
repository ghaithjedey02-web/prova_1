'use client';

import { useEffect, useRef, useState } from 'react';
import { Chapter } from '@/components/ui/Chapter';
import { Container } from '@/components/ui/Container';
import { Counter } from '@/components/ui/Counter';
import { Reveal } from '@/components/ui/Reveal';
import { chapters } from '@/content/site';

const c = chapters.software;
const app = c.app;

const toneText = {
  ink: 'text-ink', accent: 'text-accent', amber: 'text-amber', good: 'text-good', neutral: 'text-ink-2',
} as const;

const toneChip = {
  good: 'border-good/40 text-good',
  amber: 'border-amber-line text-amber',
  neutral: 'border-rule-strong text-ink-2',
} as const;

/**
 * Chapter 05 — the product.
 *
 * The strongest argument that DOLMIR builds software is a piece of software.
 * This is a real interface: rows arrive one at a time when the panel comes into
 * view, the queue counter decrements as they land, confidence is drawn as a
 * measured bar, and the row the system refuses to price is the one that stays
 * amber. Everything is labelled demonstration data, twice.
 */
export function Software() {
  const host = useRef<HTMLDivElement>(null);
  const [landed, setLanded] = useState(0);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLanded(app.rows.length);
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      app.rows.forEach((_, i) => timers.push(setTimeout(() => setLanded(i + 1), 260 + i * 320)));
    }, { threshold: 0.25 });
    io.observe(el);
    return () => { io.disconnect(); timers.forEach(clearTimeout); };
  }, []);

  return (
    <section className="relative py-[var(--space-section)]" data-inspect="Software · interfaccia dimostrativa">
      <Container>
        <Chapter n={c.n} label={c.label} headline={c.headline} lead={c.body} />

        <Reveal delay={140}>
          <div ref={host} className="glass-solid mt-[var(--space-block)] overflow-hidden">
            {/* ------------------------------------------------------ chrome */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule px-5 py-3.5">
              <div className="flex items-center gap-3">
                <span aria-hidden className="flex gap-1.5">
                  <span className="block size-1.5 bg-rule-bright" />
                  <span className="block size-1.5 bg-rule-bright" />
                  <span className="block size-1.5 bg-accent" />
                </span>
                <p className="telemetry text-ink">{app.title}</p>
              </div>
              <p className="telemetry text-muted">
                <Counter to={landed} /> / {app.rows.length} elaborate
              </p>
            </div>

            <div className="grid lg:grid-cols-[11rem_1fr]">
              {/* ---------------------------------------------------- nav */}
              <nav aria-label="Navigazione dell’applicazione dimostrativa" className="hidden border-r border-rule p-4 lg:block">
                <ul className="flex flex-col gap-1">
                  {app.nav.map((n, i) => (
                    <li key={n}>
                      <span
                        className={`block px-3 py-2 text-[var(--text-micro)] ${
                          i === 1 ? 'bg-accent-soft text-accent' : 'text-muted'
                        }`}
                      >
                        {n}
                      </span>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="min-w-0">
                {/* -------------------------------------------------- stats */}
                <dl className="grid grid-cols-2 gap-px border-b border-rule bg-rule/70 sm:grid-cols-4">
                  {app.stats.map((s) => (
                    <div key={s.k} className="bg-surface/60 px-5 py-5">
                      <dd className={`font-display text-[length:var(--text-display-s)] font-semibold ${toneText[s.tone as keyof typeof toneText]}`}>
                        <Counter to={s.v} />
                      </dd>
                      <dt className="mt-1 text-[var(--text-micro)] leading-snug text-muted">{s.k}</dt>
                    </div>
                  ))}
                </dl>

                {/* --------------------------------------------------- rows */}
                <ul className="stack-rules">
                  {app.rows.map((r, i) => {
                    const on = i < landed;
                    return (
                      <li
                        key={r.id}
                        className={`grid grid-cols-[5.5rem_1fr] items-center gap-x-4 gap-y-2 px-5 py-4 transition-all duration-[var(--duration-base)] ease-[var(--ease-mech-out)] sm:grid-cols-[5.5rem_1fr_7rem_9rem] ${
                          on ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                        }`}
                      >
                        <span className="telemetry text-muted">{r.id}</span>
                        <span className="truncate text-[var(--text-small)] text-ink">{r.c}</span>
                        <span className="hidden items-center gap-2 sm:flex">
                          <span className="block h-1 w-full max-w-[3.5rem] bg-rule/70">
                            <span
                              className={`block h-full transition-[width] duration-[var(--duration-slow)] ${
                                r.conf < 0.7 ? 'bg-amber' : 'bg-accent'
                              }`}
                              style={{ width: on ? `${Math.max(r.conf * 100, 3)}%` : '0%' }}
                            />
                          </span>
                          <span className={`telemetry ${r.conf < 0.7 ? 'text-amber' : 'text-muted'}`}>
                            {Math.round(r.conf * 100)}%
                          </span>
                        </span>
                        <span
                          className={`inline-flex w-fit items-center border px-2.5 py-1 telemetry sm:justify-self-end ${
                            toneChip[r.tone as keyof typeof toneChip]
                          }`}
                        >
                          {r.s}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <p className="telemetry border-t border-rule px-5 py-3.5 normal-case tracking-[0.08em] text-muted">
                  {app.disclaimer}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
