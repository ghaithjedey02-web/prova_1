'use client';

import { useState } from 'react';
import { Actions, Check, Chip, Decision, Field, Frame, Mail } from '@/components/product/primitives';
import { Chapter } from '@/components/ui/Chapter';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { caso as c, scenario as sc } from '@/content/site';

/**
 * Chapter 06 — the case, step by step.
 *
 * The same request as the hero, followed the way it happens in a company:
 * seven steps, each one with the piece of interface it produces. The person
 * appears exactly once — at the discrepancy — and the section ends with what
 * the same work looks like by hand today. Every count is illustrative and
 * declared.
 */
export function CaseStudy() {
  const [step, setStep] = useState(0);
  const s = c.steps[step]!;

  return (
    <section className="relative py-[var(--space-section)]" aria-labelledby="caso-heading">
      <Container>
        <Chapter n={c.n} label={c.label} headline={c.headline} lead={c.body} id="caso-heading" />

        <div className="mt-[var(--space-block)] grid gap-6 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,1fr)] lg:gap-10">
          <Reveal className="min-w-0">
            <div className="-mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] pb-2 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0" role="tablist" aria-label="Passi del caso">
              {c.steps.map((st, i) => {
                const on = i === step;
                return (
                  <div key={st.k} className="flex-none lg:flex-auto">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={on}
                      onClick={() => setStep(i)}
                      className={`flex min-h-11 w-full items-start gap-3 rounded-[4px] border px-3 py-2.5 text-left transition-colors lg:rounded-none lg:border-x-0 lg:border-t-0 lg:border-b lg:border-rule lg:px-0 lg:py-4 ${
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

          <Reveal delay={120} className="min-w-0">
            <div key={s.frame + step} className="settle">
              {s.frame === 'mail' && (
                <Frame title="Posta commerciale" status={<Chip tone="info">richiesta di offerta</Chip>} bodyClassName="p-3">
                  <Mail from={sc.mail.from} subject={sc.mail.subject} time={sc.mail.time} excerpt={sc.mail.excerpt} attachment={sc.mail.attachment} active />
                </Frame>
              )}
              {s.frame === 'fields' && (
                <Frame title="Lettura" status={<Chip tone="info">5 campi · 5 fonti</Chip>} bodyClassName="px-3 py-1">
                  {sc.fields.map((f) => <Field key={f.label} label={f.label} value={f.value} source={f.source} state="read" />)}
                </Frame>
              )}
              {s.frame === 'checks' && (
                <Frame title="Verifica" status={step >= 3 ? <Chip tone="amber">conflitto rilevato</Chip> : <Chip tone="info">storico</Chip>} bodyClassName="px-3 py-1">
                  {sc.checks.map((ck) => (
                    <Check key={ck.what} what={ck.what} against={ck.against} state={ck.state === 'conflict' ? (step >= 3 ? 'conflict' : 'pending') : 'ok'} note={'note' in ck ? ck.note : undefined} />
                  ))}
                </Frame>
              )}
              {s.frame === 'decision' && (
                <Frame title="Decisione" status={<Chip tone="amber" pulse>serve una persona</Chip>} bodyClassName="p-3">
                  <Decision question={sc.decision.question} detail={sc.decision.detail} decided={null} />
                  <p className="mt-3 text-[0.8125rem] text-muted">Nell’interfaccia vera i pulsanti sono attivi. Qui il caso prosegue come se il commerciale avesse approvato.</p>
                </Frame>
              )}
              {s.frame === 'quote' && (
                <Frame title={c.quote.id} status={<Chip tone="amber">{c.quote.status}</Chip>} bodyClassName="px-3 py-1">
                  {c.quote.lines.map(([k, v]) => (
                    <div key={k} className="row">
                      <p className="flex-1 text-[0.875rem] text-ink-2">{k}</p>
                      <p className="font-mono text-[0.8125rem] text-ink">{v}</p>
                    </div>
                  ))}
                  <p className="py-3 text-[0.8125rem] leading-snug text-muted">Prezzo e testo dell’offerta: preparati dal sistema, firmati da una persona. Il preventivo non parte da solo.</p>
                </Frame>
              )}
              {s.frame === 'actions' && (
                <Frame title="Registro" status={<Chip tone="good">completato</Chip>} bodyClassName="px-3 py-1">
                  <Actions items={sc.actions} done={3} />
                  <p className="py-3 font-mono text-[0.6875rem] text-faint">09:31 · approvato da M. Rossi · PRV-2206 inviata · CRM C-01 aggiornato</p>
                </Frame>
              )}
            </div>
            <p className="mt-3 text-[length:var(--text-micro)] text-faint">{sc.disclaimer}</p>
          </Reveal>
        </div>

        {/* today, by hand */}
        <Reveal delay={160}>
          <div className="mt-10 grid gap-4 rounded-[var(--radius-frame)] border border-rule-strong bg-surface/60 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10">
            <div>
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted">{c.before.title}</p>
              <ol className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
                {c.before.steps.map((st, i) => (
                  <li key={st} className="flex items-baseline gap-2 text-[0.875rem] text-ink-2">
                    <span className="tnum font-mono text-[0.6875rem] text-faint">{String(i + 1).padStart(2, '0')}</span>
                    {st}
                  </li>
                ))}
              </ol>
            </div>
            <dl className="grid grid-cols-4 gap-px overflow-hidden rounded-[4px] border border-rule bg-rule">
              {c.before.stats.map(([k, v]) => (
                <div key={k} className="bg-surface px-3 py-2.5 text-center">
                  <dt className="font-mono text-[0.6875rem] tracking-[0.06em] text-muted">{k}</dt>
                  <dd className="tnum mt-0.5 font-display text-[1.1rem] font-semibold text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-[62ch] text-[length:var(--text-micro)] leading-snug text-muted">{c.disclaimer}</p>
            <a href={c.cta.href} className="inline-block whitespace-nowrap py-2 text-[length:var(--text-small)] text-ink underline decoration-rule-bright underline-offset-4 transition-colors hover:text-accent hover:decoration-accent">
              {c.cta.t}
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
