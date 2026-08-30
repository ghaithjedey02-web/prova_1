'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MockProvider } from '@dolmir/ai-core/providers/mock';
import { RfqPipeline, type ProcessedRfq } from '@dolmir/rfq-engine';
import type { WorkflowDefinition, WorkflowSample } from '@dolmir/workflows';
import { demoHistory, demoShop } from '@/lib/demo-data';
import { demoCopy } from '@/content/site';
import { Confidence, Pane, Tag, Verdict } from './parts';

/**
 * The workflow player.
 *
 * TWO THINGS THAT MATTER ABOUT THIS COMPONENT, AND HAVE SURVIVED THE REDESIGN:
 *
 * 1. It runs the real engine. `RfqPipeline` is the same code that ships to
 *    clients — classification, extraction, confidence gating, triage,
 *    comparable retrieval, draft generation. Nothing here is scripted output,
 *    which is why the refusal case cannot be faked and cannot be removed.
 *    The MockProvider makes it deterministic and free, so the demo works in a
 *    meeting room with no wifi.
 *
 * 2. It is workflow-agnostic. Everything it renders comes from the
 *    `WorkflowDefinition` it is handed. Demonstrating a different process is a
 *    data change, not a rewrite of this file.
 *
 * The pacing is presentational: the engine finishes in milliseconds and we
 * reveal its real result stage by stage so a person can follow what happened.
 */

type Phase = 'idle' | 'running' | 'awaiting-approval' | 'approved';

export function WorkflowPlayer({ workflow }: { workflow: WorkflowDefinition }) {
  const [sample, setSample] = useState<WorkflowSample>(workflow.samples[0]!);
  const [phase, setPhase] = useState<Phase>('idle');
  const [stageIndex, setStageIndex] = useState(-1);
  const [result, setResult] = useState<ProcessedRfq | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const pipeline = useMemo(
    () => new RfqPipeline({ provider: new MockProvider(), shop: demoShop, history: demoHistory }),
    [],
  );

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const run = useCallback(
    async (s: WorkflowSample) => {
      clearTimers();
      setPhase('running');
      setStageIndex(-1);
      setResult(null);

      const processed = await pipeline.process({
        id: s.id,
        receivedAt: new Date().toISOString(),
        from: s.from,
        subject: s.subject,
        body: s.body,
        attachments: s.attachments,
      });

      // Emails that are not applicable stop early — the pipeline genuinely does
      // not run extraction on them, and the demo must not pretend otherwise.
      const notApplicable = processed.classification !== 'RFQ';
      const stages = notApplicable ? workflow.stages.slice(0, 2) : workflow.stages;

      let t = 0;
      stages.forEach((stage, i) => {
        t += stage.durationMs;
        timers.current.push(
          setTimeout(() => {
            setStageIndex(i);
            if (i === stages.length - 1) {
              setResult(processed);
              setPhase(notApplicable ? 'approved' : 'awaiting-approval');
            }
          }, t),
        );
      });
    },
    [clearTimers, pipeline, workflow.stages],
  );

  const pick = useCallback(
    (s: WorkflowSample) => {
      setSample(s);
      setPhase('idle');
      setStageIndex(-1);
      setResult(null);
      clearTimers();
    },
    [clearTimers],
  );

  const notApplicable = result !== null && result.classification !== 'RFQ';
  const activeStages = notApplicable ? workflow.stages.slice(0, 2) : workflow.stages;
  const caseMeta = demoCopy.cases.find((c) => c.id === sample.id);

  return (
    <div className="flex flex-col gap-6">
      {/* ------------------------------------------------------ case selector */}
      <div>
        <p className="label mb-4">Scegli un caso</p>
        <ul className="grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-5">
          {workflow.samples.map((s) => {
            const on = s.id === sample.id;
            const meta = demoCopy.cases.find((c) => c.id === s.id);
            return (
              <li key={s.id} className="bg-surface">
                <button
                  type="button"
                  onClick={() => pick(s)}
                  aria-pressed={on}
                  className={`group relative flex h-full w-full flex-col items-start gap-2 p-5 text-left transition-colors duration-[var(--duration-fast)] ${
                    on ? 'bg-accent-soft' : 'hover:bg-raised'
                  }`}
                >
                  <span
                    aria-hidden
                    className={`absolute inset-x-0 top-0 h-px origin-left bg-accent transition-transform duration-[var(--duration-base)] ${
                      on ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                  <span className={`font-mono text-[var(--text-label)] uppercase tracking-[0.18em] ${on ? 'text-accent' : 'text-muted'}`}>
                    {meta?.code ?? s.id}
                  </span>
                  <span className={`text-[var(--text-small)] font-medium leading-snug ${on ? 'text-ink' : 'text-ink-2'}`}>
                    {meta?.t ?? s.label}
                  </span>
                  <span className="text-[var(--text-micro)] leading-snug text-muted">{meta?.d ?? s.note}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* -------------------------------------------------------------- panes */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <Pane
          title={workflow.copy.inputTitle}
          meta={<span className="font-mono text-[var(--text-label)] text-muted">{sample.id}</span>}
          className="max-h-[34rem] lg:sticky lg:top-[calc(var(--nav-h)+1.5rem)]"
        >
          <div className="p-5">
            <dl className="mb-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 border-b border-rule pb-5 font-mono text-[var(--text-label)]">
              <dt className="text-muted">DA</dt>
              <dd className="break-all text-ink-2">{sample.from}</dd>
              <dt className="text-muted">OGGETTO</dt>
              <dd className="text-ink-2">{sample.subject}</dd>
            </dl>
            <pre className="font-sans text-[var(--text-small)] leading-relaxed whitespace-pre-wrap text-ink-2">
              {sample.body}
            </pre>
            {sample.attachments.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2 border-t border-rule pt-5">
                {sample.attachments.map((a) => (
                  <li
                    key={a.filename}
                    className="flex items-center gap-2 border border-rule px-2.5 py-1.5 font-mono text-[var(--text-label)] text-muted"
                  >
                    <span aria-hidden>▤</span>
                    {a.filename}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Pane>

        <div className="flex flex-col gap-6">
          <Pane
            title="Elaborazione"
            meta={
              phase === 'idle' ? (
                <button
                  type="button"
                  onClick={() => void run(sample)}
                  className="bg-accent px-4 py-1.5 font-mono text-[var(--text-label)] uppercase tracking-[0.16em] text-accent-ink transition-colors hover:bg-accent-hover"
                >
                  Avvia
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => pick(sample)}
                  className="border border-rule px-4 py-1.5 font-mono text-[var(--text-label)] uppercase tracking-[0.16em] text-muted transition-colors hover:border-rule-strong hover:text-ink"
                >
                  Ripeti
                </button>
              )
            }
          >
            <ol className="stack-rules">
              {activeStages.map((stage, i) => {
                const done = stageIndex >= i;
                const current = stageIndex === i - 1 && phase === 'running';
                const isHuman = stage.kind === 'human';
                return (
                  <li key={stage.id} className="flex items-start gap-4 px-5 py-3.5">
                    <span
                      aria-hidden
                      className={`mt-2 block size-1.5 shrink-0 transition-colors duration-[var(--duration-base)] ${
                        done ? (isHuman ? 'bg-amber' : 'bg-accent') : current ? 'bg-rule-bright' : 'bg-rule'
                      } ${current ? 'pulse' : ''}`}
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-[var(--text-small)] transition-colors duration-[var(--duration-base)] ${
                          done ? 'text-ink' : 'text-muted'
                        }`}
                      >
                        {stage.label}
                        {isHuman && done && <span className="ml-3"><Tag tone="amber">Attesa</Tag></span>}
                      </p>
                      {done && (
                        <p className="mt-1.5 text-[var(--text-micro)] leading-relaxed text-muted">{stage.description}</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
            {phase === 'idle' && (
              <p className="border-t border-rule px-5 py-4 text-[var(--text-micro)] text-muted">
                Premi <span className="font-mono text-ink-2">Avvia</span> per eseguire il processo su questo caso.
                {caseMeta ? ` ${caseMeta.d}` : ''}
              </p>
            )}
          </Pane>

          {result && <Extracted result={result} workflow={workflow} />}
        </div>
      </div>

      {result && (
        <Outcome result={result} workflow={workflow} phase={phase} onApprove={() => setPhase('approved')} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------- */

function Extracted({ result, workflow }: { result: ProcessedRfq; workflow: WorkflowDefinition }) {
  if (!result.extracted) {
    return (
      <Verdict
        code={`CLASSIFICATO · ${result.classification}`}
        title="Non è una richiesta di offerta."
        body={`Viene instradata al processo corretto senza alcuna elaborazione, quindi senza alcun costo. Confidenza ${Math.round(
          result.classificationConfidence * 100,
        )}% · costo € ${result.costEur.toFixed(4)}.`}
        tone="neutral"
      />
    );
  }

  const extracted = result.extracted as unknown as Record<
    string,
    { value: unknown; confidence: number; evidence: string }
  >;

  return (
    <Pane
      title="Dati estratti"
      meta={
        result.reviewQueue.length > 0 ? (
          <Tag tone="amber">{result.reviewQueue.length} da verificare</Tag>
        ) : (
          <Tag tone="good">Completi</Tag>
        )
      }
    >
      <dl className="stack-rules">
        {workflow.fields.map((f) => {
          const cell = extracted[f.key];
          const missing = !cell || cell.value === null || cell.value === undefined;
          const low = !missing && cell.confidence < f.confidenceFloor;
          return (
            <div key={f.key} className="grid grid-cols-[7.5rem_1fr_auto] items-center gap-4 px-5 py-3">
              <dt className="label truncate">{f.label}</dt>
              <dd
                className={`truncate text-[var(--text-small)] ${
                  missing ? 'text-muted italic' : low ? 'text-amber' : 'text-ink'
                }`}
                title={cell?.evidence || undefined}
              >
                {missing ? 'non trovato' : String(cell.value)}
              </dd>
              <dd>
                <Confidence value={cell?.confidence ?? 0} floor={f.confidenceFloor} />
              </dd>
            </div>
          );
        })}
      </dl>
    </Pane>
  );
}

function Outcome({
  result,
  workflow,
  phase,
  onApprove,
}: {
  result: ProcessedRfq;
  workflow: WorkflowDefinition;
  phase: Phase;
  onApprove: () => void;
}) {
  const draft = result.draft;
  if (!draft) return null;

  const priced = draft.suggestedUnitPriceEur !== null;

  return (
    <div className="panel">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-rule px-5 py-3.5">
        <h3 className="label">{workflow.copy.outputTitle}</h3>
        {priced ? <Tag tone="good">Bozza pronta</Tag> : <Tag tone="amber">Serve stima tecnica</Tag>}
      </header>

      <div className="grid gap-px bg-rule lg:grid-cols-[1.05fr_1fr]">
        <div className="bg-surface p-6 sm:p-8">
          {priced ? (
            <p className="font-display text-[length:var(--text-display-m)] font-semibold tnum text-ink">
              € {draft.suggestedUnitPriceEur!.toFixed(2)}
              <span className="ml-2 font-sans text-[var(--text-small)] font-normal text-muted">/pz</span>
              <span className="ml-4 font-sans text-[var(--text-small)] font-normal text-muted">
                totale € {draft.suggestedTotalEur!.toFixed(2)}
              </span>
            </p>
          ) : (
            <>
              <p className="font-mono text-[var(--text-label)] uppercase tracking-[0.2em] text-amber">
                priceBasis · {draft.priceBasis}
              </p>
              <p className="mt-4 font-display text-[length:var(--text-display-m)] font-semibold leading-tight tracking-[-0.02em] text-amber">
                Nessun prezzo proposto.
              </p>
            </>
          )}

          <ul className="mt-6 flex flex-col gap-2.5">
            {draft.priceRationale.map((r) => (
              <li key={r} className="flex gap-3 text-[var(--text-small)] leading-relaxed text-muted">
                <span aria-hidden className="mt-2 block size-1 shrink-0 bg-rule-bright" />
                {r}
              </li>
            ))}
          </ul>

          {result.triage && (
            <p className="mt-6 border-t border-rule pt-5 text-[var(--text-small)] text-muted">
              <span className="label mr-2">Fattibilità</span>
              {result.triage.reasons[0]}
            </p>
          )}
        </div>

        <div className="bg-void p-6 sm:p-8">
          <p className="label mb-4">Bozza in italiano</p>
          <pre className="max-h-72 overflow-auto font-sans text-[var(--text-micro)] leading-relaxed whitespace-pre-wrap text-ink-2">
            {draft.draftBodyIt}
          </pre>
        </div>
      </div>

      {/* The approval gate — the whole positioning, made operable. */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-rule px-5 py-5 sm:px-8">
        <p className="max-w-[46ch] text-[var(--text-small)] text-muted">{workflow.copy.approvalHint}</p>
        {phase === 'approved' ? (
          <p className="flex items-center gap-2.5 text-[var(--text-small)] text-good">
            <span aria-hidden>✓</span> {priced ? 'Approvata da una persona' : 'Assegnata a una persona'}
          </p>
        ) : (
          <button
            type="button"
            onClick={onApprove}
            className="bg-accent px-6 py-3 text-[var(--text-small)] font-medium text-accent-ink transition-colors duration-[var(--duration-fast)] hover:bg-accent-hover"
          >
            {/* Without a price there is nothing to send — the honest action is to
                route it to the person who can price it. */}
            {priced ? workflow.copy.approvalLabel : 'Assegna al preventivista'}
          </button>
        )}
      </div>
    </div>
  );
}
