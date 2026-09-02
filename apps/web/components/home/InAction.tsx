'use client';

import { useEffect, useRef, useState } from 'react';
import { Actions, Check, Chip, Decision, Field, Frame, Mail } from '@/components/product/primitives';
import { Chapter } from '@/components/ui/Chapter';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { inAction as c, scenario as sc } from '@/content/site';

/**
 * Chapter 03 — the intelligence layer, seen from inside.
 *
 * Three surfaces of the real interface — the inbox, what was read, what was
 * verified — and six steps that walk through them. The steps advance on
 * their own; a visitor who clicks one takes the wheel for a while. Every
 * state shown is the scenario's actual state at that step: the discrepancy
 * exists in the data, the decision buttons are the product's.
 */
const HOLD_MS = 3600;
const MANUAL_MS = 14000;

export function InAction() {
  const [step, setStep] = useState(0);
  const manual = useRef(0);
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(!!e?.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || !inView) return;
    const id = window.setInterval(() => {
      if (Date.now() - manual.current < MANUAL_MS) return;
      setStep((s) => (s + 1) % c.steps.length);
    }, HOLD_MS);
    return () => window.clearInterval(id);
  }, [reduce, inView]);

  const pick = (i: number) => { manual.current = Date.now(); setStep(i); };
  const s = c.steps[step]!;
  const fieldsOn = step >= 1;
  const checksOn = step >= 2;
  const conflict = step >= 3;
  const decision = step >= 4;
  const decided = step >= 5;

  return (
    <section ref={ref} id="in-azione" className="relative scroll-mt-[var(--nav-h)] py-[var(--space-section)]" aria-labelledby="inazione-heading">
      <Container>
        <Chapter n={c.n} label={c.label} headline={c.headline} lead={c.body} id="inazione-heading" />

        <div className="mt-[var(--space-block)] grid gap-6 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] lg:gap-10">
          {/* the six steps — a list on wide screens, a scrolling rail on phones */}
          <Reveal className="min-w-0">
            <div className="-mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] pb-2 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0" role="tablist" aria-label="Passi">
              {c.steps.map((st, i) => {
                const on = i === step;
                return (
                  <div key={st.k} className="flex-none lg:flex-auto">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={on}
                      onClick={() => pick(i)}
                      className={`group flex min-h-11 w-full items-start gap-3 rounded-[4px] border px-3 py-2.5 text-left transition-colors lg:rounded-none lg:border-x-0 lg:border-t-0 lg:border-b lg:border-rule lg:px-0 lg:py-4 ${
                        on ? 'border-accent-line bg-accent-soft/30 lg:bg-transparent' : 'border-rule-strong lg:border-rule'
                      }`}
                    >
                      <span className={`tnum mt-0.5 font-mono text-[0.6875rem] ${on ? (st.amber ? 'text-amber' : 'text-accent') : 'text-faint'}`}>{String(i + 1).padStart(2, '0')}</span>
                      <span className="min-w-0">
                        <span className={`block text-[0.9375rem] font-medium ${on ? 'text-ink' : 'text-ink-2'}`}>{st.k}</span>
                        <span className={`hidden text-[0.875rem] leading-snug text-muted lg:block ${on ? 'lg:mt-1' : 'lg:hidden'}`}>{st.t}</span>
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
            <p key={s.k} className="settle mt-4 text-[0.9375rem] leading-relaxed text-ink-2 lg:hidden">{s.t}</p>
          </Reveal>

          {/* the interface */}
          <Reveal delay={120} className="min-w-0">
            <div className="grid gap-3 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <Frame title={c.panes.inbox} status={<Chip tone={step === 0 ? 'info' : 'neutral'} pulse={step === 0 && !reduce}>{sc.inbox.length} messaggi</Chip>} bodyClassName="flex flex-col gap-2 p-3">
                {sc.inbox.map((m) => (
                  <Mail key={m.subject + m.time} from={m.from} subject={m.subject} time={m.time} active={'active' in m && !!m.active && step >= 0} />
                ))}
                {decided && (
                  <div className="settle mt-1 rounded-[4px] border border-rule bg-surface/60 p-3">
                    <p className="mb-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-faint">Azioni</p>
                    <Actions items={sc.actions} done={3} />
                  </div>
                )}
              </Frame>

              <div className="flex flex-col gap-3">
                <Frame
                  title={c.panes.fields}
                  status={fieldsOn ? <Chip tone={conflict ? 'amber' : checksOn ? 'good' : 'info'}>{conflict ? '1 conflitto' : checksOn ? 'verificato' : '5 campi'}</Chip> : <Chip tone="neutral">in attesa</Chip>}
                  bodyClassName="px-3 py-1"
                >
                  {sc.fields.map((f, i) => (
                    <Field
                      key={f.label}
                      label={f.label}
                      value={f.value}
                      source={f.source}
                      state={!fieldsOn ? 'pending' : i === 2 && conflict ? 'conflict' : checksOn && i < 2 ? 'verified' : 'read'}
                    />
                  ))}
                </Frame>

                <Frame
                  title={c.panes.checks}
                  status={checksOn ? <Chip tone={conflict ? 'amber' : 'good'} pulse={step === 3 && !reduce}>{conflict ? 'conflitto rilevato' : 'in corso'}</Chip> : <Chip tone="neutral">in attesa</Chip>}
                  bodyClassName="px-3 py-1"
                >
                  {sc.checks.map((ck) => (
                    <Check
                      key={ck.what}
                      what={ck.what}
                      against={ck.against}
                      state={!checksOn ? 'pending' : ck.state === 'conflict' ? (conflict ? 'conflict' : 'pending') : 'ok'}
                      note={'note' in ck ? ck.note : undefined}
                    />
                  ))}
                  {decision && (
                    <div className="settle py-3">
                      <Decision question={sc.decision.question} detail={sc.decision.detail} decided={decided ? sc.decidedLabel : null} compact />
                    </div>
                  )}
                </Frame>
              </div>
            </div>
            <p className="mt-3 text-[length:var(--text-micro)] text-faint">{sc.disclaimer}</p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
