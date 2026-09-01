'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MockProvider } from '@dolmir/ai-core/providers/mock';
import { RfqPipeline, type ProcessedRfq } from '@dolmir/rfq-engine';
import { rfqPreventivo } from '@dolmir/workflows';
import { Chapter } from '@/components/ui/Chapter';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { demoHistory, demoShop } from '@/lib/demo-data';
import { emit, setActivity } from '@/lib/system-bus';

/**
 * The homepage runs the product.
 *
 * This is not a mock-up of a dashboard and not a video: it instantiates the same
 * `RfqPipeline` that ships to clients, against the same MockProvider that makes
 * the demonstration deterministic and free, and renders whatever the engine
 * actually returns — including the case where it refuses to produce a price.
 *
 * Two consequences worth stating, because they are the reason it exists:
 *   1. The refusal cannot be faked or removed from the marketing side. If the
 *      engine's behaviour changed, this section would change with it.
 *   2. It drives the intelligence core in the background through the system bus,
 *      so starting the demo visibly makes the machine work.
 *
 * The pacing is presentational — the engine finishes in milliseconds — and the
 * human approval gate is a real stop, not a delay.
 */

type Phase = 'idle' | 'running' | 'awaiting' | 'approved';

const STEPS = [
  { k: 'READ',      label: 'Lettura',      detail: 'Mittente, oggetto, corpo, allegati.' },
  { k: 'CLASSIFY',  label: 'Classificazione', detail: 'Richiesta, ordine, o altro?' },
  { k: 'EXTRACT',   label: 'Estrazione',   detail: 'Campo per campo, con l’evidenza.' },
  { k: 'VERIFY',    label: 'Validazione',  detail: 'Soglie di confidenza applicate.' },
  { k: 'MATCH',     label: 'Confronto',    detail: 'Ricerca nelle offerte passate.' },
  { k: 'PREPARE',   label: 'Preparazione', detail: 'Bozza in italiano, con motivazione.' },
] as const;

export function FlowDemo() {
  const sample = rfqPreventivo.samples[0]!;
  const [phase, setPhase] = useState<Phase>('idle');
  const [step, setStep] = useState(-1);
  const [result, setResult] = useState<ProcessedRfq | null>(null);
  const [fields, setFields] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const host = useRef<HTMLDivElement>(null);

  const pipeline = useMemo(
    () => new RfqPipeline({ provider: new MockProvider(), shop: demoShop, history: demoHistory }),
    [],
  );

  const clear = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => () => { clear(); setActivity('idle'); }, [clear]);

  const run = useCallback(async () => {
    clear();
    setPhase('running');
    setStep(-1);
    setFields(0);
    setResult(null);
    setActivity('listening');
    emit('INPUT_RECEIVED', `${sample.id} · ${sample.attachments.length} allegati`, 'accent');

    const processed = await pipeline.process({
      id: sample.id,
      receivedAt: new Date().toISOString(),
      from: sample.from,
      subject: sample.subject,
      body: sample.body,
      attachments: sample.attachments,
    });

    const activities = ['listening', 'analyzing', 'understanding', 'verifying', 'processing', 'processing'] as const;
    STEPS.forEach((s, i) => {
      timers.current.push(setTimeout(() => {
        setStep(i);
        setActivity(activities[i]!);
        emit(s.k, s.detail);
        if (i === 2) {
          // Extraction reveals one field at a time so the visitor sees the
          // structure being built rather than appearing.
          rfqPreventivo.fields.forEach((_, fi) => {
            timers.current.push(setTimeout(() => setFields(fi + 1), fi * 110));
          });
        }
      }, 420 + i * 620));
    });

    timers.current.push(setTimeout(() => {
      setResult(processed);
      setPhase('awaiting');
      setActivity('holding');
      emit('HUMAN_REQUIRED', 'Processo sospeso · attesa di approvazione', 'amber');
    }, 420 + STEPS.length * 620 + 300));
  }, [clear, pipeline, sample]);

  function approve() {
    setPhase('approved');
    setActivity('ready');
    emit('APPROVED', 'Approvata da una persona · bozza pronta all’invio', 'good');
    timers.current.push(setTimeout(() => setActivity('idle'), 2600));
  }

  function reset() {
    clear();
    setPhase('idle');
    setStep(-1);
    setFields(0);
    setResult(null);
    setActivity('idle');
  }

  const extracted = result?.extracted as unknown as
    | Record<string, { value: unknown; confidence: number }>
    | undefined;
  const draft = result?.draft;

  return (
    <section className="relative py-[var(--space-section)]">
      <Container>
        <Chapter
          n="06"
          label="Il flusso, dal vivo"
          headline="Premete avvia. Il motore è quello vero."
          lead="Questa non è un’animazione registrata: qui sotto gira lo stesso codice che installiamo presso i clienti, su un’email di esempio. Osservate cosa succede — e soprattutto dove si ferma."
        />

        <Reveal delay={140}>
          <div ref={host} className="glass-solid mt-[var(--space-block)] overflow-hidden">
            {/* --------------------------------------------------- head bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule px-5 py-4">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className={`block size-1.5 ${
                    phase === 'awaiting' ? 'bg-amber pulse' : phase === 'running' ? 'bg-accent pulse' : 'bg-rule-bright'
                  }`}
                />
                <p className="telemetry text-ink">DOLMIR · MOTORE RFQ</p>
              </div>
              {phase === 'idle' ? (
                <button
                  type="button"
                  onClick={() => void run()}
                  className="bg-accent px-6 py-2.5 telemetry text-accent-ink transition-colors hover:bg-accent-hover"
                >
                  Avvia il flusso
                </button>
              ) : (
                <button
                  type="button"
                  onClick={reset}
                  className="border border-rule px-6 py-2.5 telemetry text-muted transition-colors hover:border-rule-strong hover:text-ink"
                >
                  Ripeti
                </button>
              )}
            </div>

            <div className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              {/* ------------------------------------------------- the email */}
              <div className="border-b border-rule p-5 lg:border-b-0 lg:border-r sm:p-7">
                <p className="telemetry text-muted">In arrivo</p>
                <dl className="mt-5 grid grid-cols-[4.5rem_1fr] gap-x-4 gap-y-2 border-b border-rule pb-5 font-mono text-[length:var(--text-label)]">
                  <dt className="text-muted">DA</dt>
                  <dd className="break-all text-ink-2">{sample.from}</dd>
                  <dt className="text-muted">OGGETTO</dt>
                  <dd className="text-ink-2">{sample.subject}</dd>
                </dl>
                <pre className="mt-5 font-sans text-[length:var(--text-small)] leading-relaxed whitespace-pre-wrap text-ink-2">
                  {sample.body}
                </pre>
                <ul className="mt-5 flex flex-wrap gap-2 border-t border-rule pt-5">
                  {sample.attachments.map((a) => (
                    <li key={a.filename} className="flex items-center gap-2 border border-rule px-2.5 py-1.5 telemetry text-muted">
                      <span aria-hidden>▤</span>
                      {a.filename}
                    </li>
                  ))}
                </ul>
              </div>

              {/* ------------------------------------------------ the engine */}
              <div className="min-w-0">
                <ol className="stack-rules">
                  {STEPS.map((s, i) => {
                    const done = step >= i;
                    const active = step === i && phase === 'running';
                    return (
                      <li key={s.k} className="flex items-start gap-4 px-5 py-3.5 sm:px-7">
                        <span
                          aria-hidden
                          className={`mt-1.5 block size-1.5 shrink-0 transition-colors duration-[var(--duration-base)] ${
                            done ? 'bg-accent' : 'bg-rule'
                          } ${active ? 'pulse' : ''}`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline gap-x-4">
                            <span className={`telemetry ${done ? 'text-accent' : 'text-faint'}`}>{s.k}</span>
                            <span className={`text-[length:var(--text-small)] ${done ? 'text-ink' : 'text-faint'}`}>
                              {s.label}
                            </span>
                          </div>
                          {done && i === 2 && (
                            <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                              {rfqPreventivo.fields.slice(0, fields).map((f) => {
                                const cell = extracted?.[f.key];
                                return (
                                  <li key={f.key} className="settle flex items-baseline justify-between gap-3 border-b border-rule/60 pb-1">
                                    <span className="telemetry truncate text-muted">{f.label}</span>
                                    <span className="truncate font-mono text-[length:var(--text-label)] text-ink-2">
                                      {cell && cell.value !== null ? String(cell.value) : '· · ·'}
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>

                {/* ------------------------------------------ the human gate */}
                {phase === 'awaiting' && draft && (
                  <div className="settle border-t border-amber-line bg-amber-soft/40 px-5 py-6 sm:px-7">
                    <p className="flex items-center gap-3 telemetry text-amber">
                      <span aria-hidden className="block size-1.5 bg-amber pulse" />
                      Approvazione richiesta
                    </p>
                    <p className="mt-4 font-display text-[length:var(--text-display-s)] font-semibold text-ink">
                      {draft.suggestedUnitPriceEur !== null
                        ? `€ ${draft.suggestedUnitPriceEur.toFixed(2)} /pz · totale € ${draft.suggestedTotalEur!.toFixed(2)}`
                        : 'Nessun prezzo proposto'}
                    </p>
                    <p className="mt-3 max-w-[52ch] text-[length:var(--text-small)] leading-relaxed text-ink-2">
                      {draft.priceRationale[0]}
                    </p>
                    <button
                      type="button"
                      onClick={approve}
                      className="mt-6 bg-accent px-7 py-3 text-[length:var(--text-small)] font-medium text-accent-ink transition-colors hover:bg-accent-hover"
                    >
                      Approva
                    </button>
                  </div>
                )}

                {phase === 'approved' && (
                  <div className="settle border-t border-rule px-5 py-6 sm:px-7">
                    <p className="flex items-center gap-3 telemetry text-good">
                      <span aria-hidden>✓</span> Risposta pronta
                    </p>
                    <p className="mt-4 max-w-[54ch] text-[length:var(--text-small)] leading-relaxed text-ink-2">
                      La bozza è stata approvata da una persona ed è pronta all’invio. Il sistema ha preparato;
                      la decisione è rimasta umana — e questo passaggio non è disattivabile.
                    </p>
                  </div>
                )}

                {phase === 'idle' && (
                  <div className="px-5 pb-6 sm:px-7">
                    {/* The place the result will land, drawn before it exists:
                        an instrument with an empty dial reads as ready, where
                        an empty black panel reads as broken. */}
                    <div className="mt-2 border border-dashed border-rule p-5">
                      <div className="flex items-center justify-between gap-3">
                        <p className="telemetry text-faint">RISULTATO</p>
                        <p className="telemetry text-faint">— IN ATTESA DI ESECUZIONE</p>
                      </div>
                      <div aria-hidden className="mt-4 space-y-2.5">
                        <div className="h-px w-3/4 bg-rule" />
                        <div className="h-px w-1/2 bg-rule" />
                        <div className="h-px w-2/3 bg-rule" />
                      </div>
                    </div>
                    <p className="mt-4 text-[length:var(--text-micro)] text-muted">
                      Dati di esempio. L’azienda e i documenti citati non sono reali.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
