'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MockProvider } from '@dolmir/ai-core/providers/mock';
import { RfqPipeline, type ProcessedRfq } from '@dolmir/rfq-engine';
import type { WorkflowDefinition, WorkflowSample } from '@dolmir/workflows';
import { demoHistory, demoShop } from '@/lib/demo-data';
import { Confidence, Pane, Tag } from './parts';

/**
 * The workflow player.
 *
 * TWO THINGS THAT MATTER ABOUT THIS COMPONENT:
 *
 * 1. It runs the real engine. `RfqPipeline` is the same code that ships to
 *    clients — classification, extraction, confidence gating, triage,
 *    comparable retrieval, draft generation. Nothing here is scripted output.
 *    The MockProvider makes it deterministic and free, which is why the demo
 *    works offline in a meeting room with no wifi.
 *
 * 2. It is workflow-agnostic. Everything it renders comes from the
 *    `WorkflowDefinition` it is handed. Changing the demonstrated workflow is a
 *    data change, not a rewrite of this file.
 *
 * The pacing is presentational: the engine finishes in milliseconds, and we
 * reveal its real result stage by stage so a human can follow what happened.
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

  function pick(s: WorkflowSample) {
    setSample(s);
    setPhase('idle');
    setStageIndex(-1);
    setResult(null);
    clearTimers();
  }

  const notApplicable = result !== null && result.classification !== 'RFQ';
  const activeStages = notApplicable ? workflow.stages.slice(0, 2) : workflow.stages;

  return (
    <div className="flex flex-col gap-5">
      {/* --- sample selector ------------------------------------------------ */}
      <div>
        <p className="label mb-3">Scegli un’email</p>
        <div className="flex flex-wrap gap-2">
          {workflow.samples.map((s) => {
            const on = s.id === sample.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => pick(s)}
                aria-pressed={on}
                className={`rounded-sm border px-3.5 py-2.5 text-left text-[var(--text-micro)] transition-colors duration-[var(--duration-fast)] ${
                  on
                    ? 'border-accent bg-accent-soft text-accent'
                    : 'border-rule text-ink-2 hover:border-rule-strong hover:text-ink'
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
        <p className="mt-3 max-w-[62ch] text-[var(--text-small)] text-muted">{sample.note}</p>
      </div>

      {/* --- the three panes ------------------------------------------------ */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <Pane
          title={workflow.copy.inputTitle}
          meta={<span className="font-mono text-[var(--text-label)] text-muted">{sample.id}</span>}
          className="max-h-[32rem] lg:sticky lg:top-[calc(var(--nav-h)+1.25rem)]"
        >
          <div className="p-4">
            <dl className="mb-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 border-b border-rule pb-4 font-mono text-[var(--text-label)]">
              <dt className="text-muted">DA</dt>
              <dd className="break-all text-ink-2">{sample.from}</dd>
              <dt className="text-muted">OGGETTO</dt>
              <dd className="text-ink-2">{sample.subject}</dd>
            </dl>
            <pre className="font-sans text-[var(--text-small)] leading-relaxed whitespace-pre-wrap text-ink-2">
              {sample.body}
            </pre>
            {sample.attachments.length === 0 && <div className="h-1" />}
            {sample.attachments.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2 border-t border-rule pt-4">
                {sample.attachments.map((a) => (
                  <li key={a.filename} className="flex items-center gap-2 rounded-xs border border-rule px-2 py-1 font-mono text-[var(--text-label)] text-muted">
                    <span aria-hidden>▤</span>
                    {a.filename}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Pane>

        <div className="flex flex-col gap-5">
          <Pane
            title="Elaborazione"
            meta={
              phase === 'idle' ? (
                <button
                  type="button"
                  onClick={() => void run(sample)}
                  className="rounded-sm bg-accent px-3.5 py-1.5 font-mono text-[var(--text-label)] tracking-[0.1em] uppercase text-accent-ink transition-colors hover:bg-accent-hover"
                >
                  Avvia
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => pick(sample)}
                  className="rounded-sm border border-rule px-3.5 py-1.5 font-mono text-[var(--text-label)] tracking-[0.1em] uppercase text-muted transition-colors hover:text-ink"
                >
                  Ripeti
                </button>
              )
            }
          >
            <ol className="divide-y divide-rule">
              {activeStages.map((stage, i) => {
                const done = stageIndex >= i;
                const current = stageIndex === i - 1 && phase === 'running';
                const isHuman = stage.kind === 'human';
                return (
                  <li key={stage.id} className="flex items-start gap-3 px-4 py-3">
                    <span
                      aria-hidden
                      className={`mt-1.5 block size-1.5 shrink-0 rounded-full transition-colors duration-[var(--duration-base)] ${
                        done ? (isHuman ? 'bg-amber' : 'bg-accent') : current ? 'bg-rule-strong' : 'bg-rule'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-[var(--text-small)] transition-colors duration-[var(--duration-base)] ${
                          done ? 'text-ink' : 'text-muted'
                        }`}
                      >
                        {stage.label}
                        {isHuman && done && (
                          <span className="ml-2"><Tag tone="amber">Attesa</Tag></span>
                        )}
                      </p>
                      {done && (
                        <p className="mt-1 text-[var(--text-micro)] leading-relaxed text-muted">{stage.description}</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
            {phase === 'idle' && (
              <p className="border-t border-rule px-4 py-3 text-[var(--text-micro)] text-muted">
                Premi <span className="font-mono">Avvia</span> per eseguire il processo su questa email.
              </p>
            )}
          </Pane>

          {result && <Extracted result={result} workflow={workflow} />}
        </div>
      </div>

      {result && <Outcome result={result} workflow={workflow} phase={phase} onApprove={() => setPhase('approved')} />}
    </div>
  );
}

/* ------------------------------------------------------------------------- */

function Extracted({ result, workflow }: { result: ProcessedRfq; workflow: WorkflowDefinition }) {
  if (!result.extracted) {
    return (
      <Pane title="Esito classificazione">
        <div className="p-4">
          <Tag tone="neutral">{result.classification}</Tag>
          <p className="mt-3 text-[var(--text-small)] leading-relaxed text-ink-2">
            Non è una richiesta di offerta. Viene instradata al processo corretto senza
            alcuna elaborazione — quindi senza alcun costo.
          </p>
          <p className="mt-2 font-mono text-[var(--text-label)] text-muted">
            Confidenza {Math.round(result.classificationConfidence * 100)}% · costo €{result.costEur.toFixed(4)}
          </p>
        </div>
      </Pane>
    );
  }

  const extracted = result.extracted as unknown as Record<string, { value: unknown; confidence: number; evidence: string }>;

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
      <dl className="divide-y divide-rule">
        {workflow.fields.map((f) => {
          const cell = extracted[f.key];
          const missing = !cell || cell.value === null || cell.value === undefined;
          const low = !missing && cell.confidence < f.confidenceFloor;
          return (
            <div key={f.key} className="grid grid-cols-[8.5rem_1fr_auto] items-center gap-3 px-4 py-2.5">
              <dt className="label truncate">{f.label}</dt>
              <dd className={`truncate text-[var(--text-small)] ${missing ? 'text-muted italic' : low ? 'text-amber' : 'text-ink'}`}>
                {missing ? 'non trovato' : String(cell.value)}
              </dd>
              <dd><Confidence value={cell?.confidence ?? 0} /></dd>
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
    <Pane
      title={workflow.copy.outputTitle}
      meta={priced ? <Tag tone="good">Bozza pronta</Tag> : <Tag tone="amber">Serve stima tecnica</Tag>}
    >
      <div className="grid gap-px bg-rule lg:grid-cols-[1.1fr_1fr]">
        <div className="bg-surface p-5">
          {priced ? (
            <p className="font-display text-[length:var(--text-display-s)] text-ink tnum">
              € {draft.suggestedUnitPriceEur!.toFixed(2)}
              <span className="ml-2 font-sans text-[var(--text-small)] text-muted">/pz</span>
              <span className="ml-3 font-sans text-[var(--text-small)] text-muted">
                totale € {draft.suggestedTotalEur!.toFixed(2)}
              </span>
            </p>
          ) : (
            <p className="font-display text-[length:var(--text-display-s)] leading-tight text-amber">
              Nessun prezzo proposto.
            </p>
          )}

          <ul className="mt-4 flex flex-col gap-2">
            {draft.priceRationale.map((r) => (
              <li key={r} className="text-[var(--text-small)] leading-relaxed text-muted">{r}</li>
            ))}
          </ul>

          {result.triage && (
            <p className="mt-4 border-t border-rule pt-4 text-[var(--text-small)] text-muted">
              <span className="label mr-2">Fattibilità</span>
              {result.triage.reasons[0]}
            </p>
          )}
        </div>

        <div className="bg-surface p-5">
          <p className="label mb-3">Bozza in italiano</p>
          <pre className="max-h-64 overflow-auto font-sans text-[var(--text-micro)] leading-relaxed whitespace-pre-wrap text-ink-2">
            {draft.draftBodyIt}
          </pre>
        </div>
      </div>

      {/* The approval gate — the whole positioning, made operable. */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-rule bg-raised px-5 py-4">
        <p className="max-w-[46ch] text-[var(--text-small)] text-muted">{workflow.copy.approvalHint}</p>
        {phase === 'approved' ? (
          <p className="flex items-center gap-2 text-[var(--text-small)] text-good">
            <span aria-hidden>✓</span> {priced ? 'Approvata da una persona' : 'Assegnata a una persona'}
          </p>
        ) : (
          <button
            type="button"
            onClick={onApprove}
            className="rounded-sm bg-accent px-5 py-2.5 text-[var(--text-small)] font-medium text-accent-ink transition-colors duration-[var(--duration-fast)] hover:bg-accent-hover"
          >
            {/* Without a price there is nothing to send — the honest action is
                to route it to the person who can price it. */}
            {priced ? workflow.copy.approvalLabel : 'Assegna al preventivista'}
          </button>
        )}
      </div>
    </Pane>
  );
}
