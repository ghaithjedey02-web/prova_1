'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Chapter } from '@/components/ui/Chapter';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { emit, setActivity } from '@/lib/system-bus';
import { simulator } from '@/content/site';

/**
 * PROVA DOLMIR — the visitor runs the system themselves.
 *
 * Six sectors, six realistic inputs, one architecture. The visitor picks a
 * scenario, presses AVVIA, and watches the eight stages execute with the
 * telemetry exposed — entities found, fields extracted with confidence,
 * cross-checks against company data, and outcomes that genuinely differ:
 * manufacturing sails through at 96,8%, distribution surfaces two stock
 * warnings, sales lands at 71,2% and the system hands over instead of
 * inventing a budget. Then the gate: nothing proceeds until the visitor
 * approves — or rejects, and sees that rejection is a first-class outcome.
 *
 * After the run, the same work is shown done by hand — seven manual steps
 * with illustrative minutes — collapsing into the four-node DOLMIR path,
 * and the differentiator is stated as two chains: what a generic assistant
 * does, and what an operational system does.
 *
 * Everything is local state in the browser and labelled as simulation.
 * There are no external calls to fake, and none are faked. The real engine
 * runs in chapter 05; this section is the same architecture, breadth-first.
 */

type Phase = 'idle' | 'running' | 'gate' | 'approved' | 'rejected';

const STAGE_ACTIVITY = [
  'listening', 'listening', 'analyzing', 'understanding',
  'verifying', 'analyzing', 'verifying', 'processing',
] as const;

const STAGE_MS = 560;

interface LogLine { id: number; t: string; text: string; tone?: 'amber' }

/**
 * The live system map: DOLMIR between the systems a company already has.
 * Nodes light as the run actually consults them — INPUT while reading, the
 * core while thinking, ERP/CRM/archive during the cross-checks, the person at
 * the gate, the action only after approval. Nothing here is decoration: it is
 * the run's footprint across the company, in eleven small nodes.
 */
function SystemMap({ stage, phase }: { stage: number; phase: Phase }) {
  const on = (k: string, at: readonly number[]) => {
    if (phase === 'gate') return k === 'persona';
    if (phase === 'approved') return k === 'azione' || k === 'persona';
    if (phase === 'rejected') return k === 'persona';
    if (phase !== 'running') return false;
    return at.includes(stage);
  };
  return (
    <svg viewBox="0 0 300 34" className="h-[26px] w-auto max-w-full" aria-hidden>
      {simulator.map.map((n, i) => {
        const x = 12 + i * 46;
        const active = on(n.k, n.at);
        const isPerson = n.k === 'persona';
        return (
          <g key={n.k}>
            {i > 0 && (
              <line
                x1={x - 40} y1={12} x2={x - 6} y2={12}
                stroke={active ? 'var(--c-accent)' : 'var(--c-rule-strong)'}
                strokeWidth="1"
                opacity={active ? 0.9 : 0.6}
              />
            )}
            <rect
              x={x - 3.5} y={8.5} width={7} height={7}
              fill={active ? (isPerson ? 'var(--c-amber)' : 'var(--c-accent)') : 'var(--c-ground)'}
              stroke={active ? (isPerson ? 'var(--c-amber)' : 'var(--c-accent)') : 'var(--c-rule-strong)'}
              strokeWidth="1"
            >
              {active && phase === 'running' && (
                <animate attributeName="opacity" values="1;0.45;1" dur="1.1s" repeatCount="indefinite" />
              )}
            </rect>
            <text
              x={x} y={30} textAnchor="middle"
              fontFamily="var(--font-mono)" fontSize="6.5" letterSpacing="0.08em"
              fill={active ? (isPerson ? 'var(--c-amber)' : 'var(--c-accent)') : 'var(--c-faint)'}
            >
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function Simulator() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [stage, setStage] = useState(-1);
  const [log, setLog] = useState<LogLine[]>([]);
  const [fieldsShown, setFieldsShown] = useState(0);
  const [conf, setConf] = useState(0);
  const [compare, setCompare] = useState(false);
  /* The gate can be renegotiated: MODIFICA lets the visitor change one
     parameter and watch the decision re-run. The override replaces the
     scenario's stock gate until the next run. */
  const [modifying, setModifying] = useState(false);
  const [override, setOverride] = useState<{ conf: number; note: string; tone: string } | null>(null);
  const [genericView, setGenericView] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const seq = useRef(0);
  const logBox = useRef<HTMLDivElement>(null);

  const sc = simulator.scenarios[scenarioIdx]!;

  const clear = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => () => { clear(); setActivity('idle'); }, [clear]);

  /* Arriving via the nav's "Prova DOLMIR" anchor: sections above this one grow
     after hydration (the pinned experiences replace their short static
     variants), so the browser's anchor scroll lands where the section used to
     be. Once the layout has settled, if the target is clearly not on screen,
     correct the landing — and never fight a visitor who has already scrolled. */
  useEffect(() => {
    if (window.location.hash !== '#prova') return;
    const id = setTimeout(() => {
      const el = document.getElementById('prova');
      if (!el) return;
      if (Math.abs(el.getBoundingClientRect().top) > window.innerHeight * 0.6) {
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    }, 650);
    return () => clearTimeout(id);
  }, []);

  /* Newest telemetry stays in view without hijacking page scroll. */
  useEffect(() => {
    const el = logBox.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log]);

  const reset = useCallback((idx: number) => {
    clear();
    setScenarioIdx(idx);
    setPhase('idle');
    setStage(-1);
    setLog([]);
    setFieldsShown(0);
    setConf(0);
    setCompare(false);
    setModifying(false);
    setOverride(null);
    setActivity('idle');
  }, [clear]);

  const pushLog = useCallback((text: string, tone?: 'amber') => {
    seq.current += 1;
    const now = new Date();
    const t = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    setLog((l) => [...l.slice(-30), { id: seq.current, t, text, tone }]);
  }, []);

  const finish = useCallback(() => {
    setStage(simulator.stages.length - 1);
    setFieldsShown(sc.fields.length);
    setConf(sc.confidence);
    setPhase('gate');
    setActivity('holding');
    emit('SIM.HOLD', `${sc.label} · attesa di approvazione`, 'amber');
  }, [sc]);

  const run = useCallback(() => {
    clear();
    setPhase('running');
    setStage(-1);
    setLog([]);
    setFieldsShown(0);
    setConf(0);
    setCompare(false);
    setModifying(false);
    setOverride(null);
    emit('SIM.START', `scenario: ${sc.label}`, 'accent');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Reduced motion: the run is instantaneous, the outcome identical.
      sc.telemetry.forEach(([, text, tone]) => pushLog(text as string, tone as 'amber' | undefined));
      finish();
      return;
    }

    simulator.stages.forEach((_, i) => {
      timers.current.push(setTimeout(() => {
        setStage(i);
        setActivity(STAGE_ACTIVITY[i] ?? 'processing');
        sc.telemetry
          .filter(([si]) => si === i)
          .forEach(([, text, tone]) => pushLog(text as string, tone as 'amber' | undefined));
        if (i === 3) {
          sc.fields.forEach((_, fi) => {
            timers.current.push(setTimeout(() => setFieldsShown(fi + 1), 140 + fi * 150));
          });
        }
        if (i === 6) {
          // The confidence figure counts up to its value rather than appearing:
          // a measurement being taken, not a badge.
          const target = sc.confidence;
          const t0 = performance.now();
          const tick = () => {
            const k = Math.min(1, (performance.now() - t0) / 700);
            setConf(Math.round(target * (1 - Math.pow(1 - k, 3)) * 10) / 10);
            if (k < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      }, 300 + i * STAGE_MS));
    });

    timers.current.push(setTimeout(finish, 300 + simulator.stages.length * STAGE_MS + 250));
  }, [clear, sc, pushLog, finish]);

  function approve() {
    setPhase('approved');
    setActivity('ready');
    setCompare(true);
    emit('SIM.APPROVED', `${sc.label} · azioni eseguite`, 'good');
    timers.current.push(setTimeout(() => setActivity('idle'), 2400));
  }

  function reject() {
    setPhase('rejected');
    setActivity('idle');
    emit('SIM.REJECTED', `${sc.label} · bozza tornata alla persona`, 'amber');
  }

  /* One resolved gate object, whether stock or renegotiated. */
  const gate = override ?? { conf: sc.confidence, note: sc.gateNote, tone: sc.gateTone as string };
  const gateHead =
    gate.tone === 'ready' ? 'PRONTO PER L’APPROVAZIONE'
    : gate.tone === 'blocked' ? 'IL SISTEMA NON INDOVINA'
    : gate.tone === 'complete' ? 'CAMPI DA COMPLETARE'
    : 'AVVISI DA RIVEDERE';
  const gateColor = gate.tone === 'ready' ? 'text-good' : gate.tone === 'blocked' ? 'text-bad' : 'text-amber';
  const gateFrame = gate.tone === 'blocked' ? 'border-bad/40 bg-bad-soft' : 'border-amber/40 bg-amber-soft';
  const totalManual = simulator.manual.reduce((a, m) => a + m.m, 0);

  /* The completion summary counts what actually happened to the fields —
     including the point the visitor resolved through MODIFICA, if any. */
  const stockVerified = sc.fields.filter((f) => !('state' in f)).length;
  const verified = stockVerified + (override ? 1 : 0);
  const toReview = sc.fields.length - verified;

  /* One system-state word for the whole frame. */
  const sysState =
    phase === 'idle' ? simulator.sysStates.idle
    : phase === 'running' ? (simulator.sysStates.running[Math.max(0, stage)] ?? 'ANALISI')
    : phase === 'gate' ? simulator.sysStates.gate
    : phase === 'approved' ? simulator.sysStates.approved
    : simulator.sysStates.rejected;

  /* MODIFICA: apply one parameter and watch the decision re-run. */
  function applyOption(opt: { k: string; label: string; conf: number; note: string; tone: string }) {
    setModifying(false);
    pushLog(`parametro aggiornato: ${opt.label}`);
    pushLog('rivalutazione: validazione · confronto · confidenza');
    setOverride({ conf: opt.conf, note: opt.note, tone: opt.tone });
    emit('SIM.MODIFY', `parametro: ${opt.label}`, 'accent');
    const from = conf;
    const t0 = performance.now();
    const tick = () => {
      const k = Math.min(1, (performance.now() - t0) / 600);
      setConf(Math.round((from + (opt.conf - from) * (1 - Math.pow(1 - k, 3))) * 10) / 10);
      if (k < 1) requestAnimationFrame(tick);
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setConf(opt.conf);
    else requestAnimationFrame(tick);
  }

  return (
    <section
      id="prova"
      className="relative scroll-mt-[var(--nav-h)] py-[var(--space-section)]"
      aria-labelledby="simulator-heading"
      data-inspect="Simulator · sei settori, simulazione locale"
    >
      <Container>
        <Chapter n={simulator.n} label={simulator.label} headline={simulator.headline} lead={simulator.body} />

        <Reveal delay={120}>
          <div className="glass-solid mt-[var(--space-block)]">
            {/* ------------------------------------------------ scenario rail */}
            <div role="tablist" aria-label="Scenari" className="flex overflow-x-auto border-b border-rule">
              {simulator.scenarios.map((it, i) => (
                <button
                  key={it.k}
                  type="button"
                  role="tab"
                  aria-selected={i === scenarioIdx}
                  onClick={() => reset(i)}
                  className={`relative flex-none px-4 py-3.5 telemetry transition-colors duration-[var(--duration-fast)] sm:px-5 ${
                    i === scenarioIdx ? 'text-ink' : 'text-muted hover:text-ink-2'
                  }`}
                >
                  <span
                    aria-hidden
                    className={`absolute inset-x-0 bottom-0 h-0.5 bg-accent transition-transform duration-[var(--duration-base)] ease-[var(--ease-mech)] ${
                      i === scenarioIdx ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                  <span className={`mr-2 ${i === scenarioIdx ? 'text-accent' : 'text-faint'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {it.label}
                </button>
              ))}
            </div>

            <div className="grid lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
              {/* ------------------------------------------------- the input */}
              <div className="border-b border-rule p-5 sm:p-7 lg:border-b-0 lg:border-r">
                <div className="flex items-center justify-between gap-3">
                  <p className="telemetry text-faint">{sc.docKind} · IN ARRIVO</p>
                  <span className="telemetry text-faint">{simulator.disclaimer.split('.')[0]}.</span>
                </div>
                <div key={sc.k} className="settle mt-4 border border-rule bg-surface/70 p-5">
                  <p className="font-mono text-[0.8125rem] text-ink">{sc.docTitle}</p>
                  <div className="mt-3 space-y-1 border-b border-rule pb-3">
                    {sc.docMeta.map((m) => (
                      <p key={m} className="telemetry text-muted">{m}</p>
                    ))}
                  </div>
                  <div className="mt-4 space-y-1.5">
                    {sc.docLines.map((l) => (
                      <p key={l} className="text-[0.8125rem] leading-relaxed text-ink-2">{l}</p>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={phase === 'running' ? undefined : run}
                    disabled={phase === 'running'}
                    className={`border px-6 py-3 font-mono text-[0.75rem] tracking-[0.14em] transition-colors duration-[var(--duration-fast)] ${
                      phase === 'running'
                        ? 'cursor-default border-rule text-faint'
                        : 'border-accent bg-accent-soft text-accent hover:bg-accent hover:text-ground'
                    }`}
                  >
                    {phase === 'idle' ? '▸ AVVIA PROCESSO' : phase === 'running' ? 'IN ESECUZIONE…' : '↻ RIPETI'}
                  </button>
                  {phase !== 'idle' && phase !== 'running' && (
                    <p className="telemetry text-faint">Simulazione locale · nessuna chiamata esterna</p>
                  )}
                </div>

                {/* ---------------------------------------- extracted fields */}
                {fieldsShown > 0 && (
                  <dl className="mt-6 border-t border-rule pt-5">
                    <p className="telemetry mb-3 text-faint">CAMPI ESTRATTI · CON CONFIDENZA</p>
                    {sc.fields.slice(0, fieldsShown).map((f) => {
                      const st = ('state' in f ? f.state : 'ok') as string;
                      const vColor =
                        st === 'ok' ? 'text-ink-2' : st === 'warn' ? 'text-amber' : 'text-bad';
                      return (
                        <div key={f.k} className="settle grid grid-cols-[7rem_minmax(0,1fr)_3rem] items-baseline gap-2 border-b border-rule/60 py-2">
                          <dt className="telemetry text-[0.625rem] text-faint">{f.k}</dt>
                          <dd className={`font-mono text-[0.75rem] ${vColor}`}>
                            {st === 'conflict' || st === 'missing' ? '⚠ ' : ''}{f.v}
                          </dd>
                          <dd className={`text-right font-mono text-[0.6875rem] tnum ${
                            st === 'ok' ? (f.conf < 0.92 ? 'text-muted' : 'text-good') : st === 'warn' ? 'text-amber' : 'text-bad'
                          }`}>
                            {f.conf.toFixed(2)}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                )}
              </div>

              {/* ---------------------------------------------- the machine */}
              <div className="flex flex-col p-5 sm:p-7">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-4">
                  <p className="telemetry text-faint">
                    STATO{' '}
                    <span
                      className={`ml-1 ${
                        phase === 'gate' ? 'text-amber' : phase === 'approved' ? 'text-good' : phase === 'running' ? 'text-accent' : 'text-muted'
                      }`}
                    >
                      {sysState}
                    </span>
                  </p>
                  <SystemMap stage={stage} phase={phase} />
                </div>
                <ol className="grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                  {simulator.stages.map((st, i) => (
                    <li
                      key={st}
                      className={`flex items-center gap-2 py-1 font-mono text-[0.625rem] tracking-[0.12em] transition-colors duration-[var(--duration-fast)] ${
                        i < stage ? 'text-muted' : i === stage ? 'text-accent' : 'text-faint/70'
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`block size-1.5 flex-none ${
                          i < stage ? 'bg-muted' : i === stage ? 'animate-pulse bg-accent' : 'bg-rule-strong'
                        }`}
                      />
                      {st}
                    </li>
                  ))}
                </ol>

                {/* telemetry log */}
                <div
                  ref={logBox}
                  aria-live="polite"
                  className="mt-4 h-[11rem] overflow-y-auto border border-rule bg-void/60 p-3.5 font-mono text-[0.6875rem] leading-[1.7]"
                >
                  {log.length === 0 ? (
                    <p className="text-faint">— telemetria del processo · premere AVVIA —</p>
                  ) : (
                    log.map((l) => (
                      <p key={l.id} className="settle">
                        <span className="text-faint">{l.t}</span>{' '}
                        <span className={l.tone === 'amber' ? 'text-amber' : 'text-muted'}>{l.text}</span>
                      </p>
                    ))
                  )}
                </div>

                {/* confidence + gate */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-4">
                  <p className="telemetry text-faint">
                    CONFIDENZA{' '}
                    <span className={`tnum text-[0.9rem] ${conf === 0 ? 'text-faint' : conf < 80 ? 'text-amber' : 'text-accent'}`}>
                      {conf === 0 ? '—' : `${conf.toFixed(1).replace('.', ',')}%`}
                    </span>
                  </p>
                  {phase === 'gate' && (
                    <p className="telemetry text-amber">■ PROCESSO SOSPESO · SERVE UNA PERSONA</p>
                  )}
                </div>

                {phase === 'gate' && (
                  <div className={`settle mt-4 border p-5 ${gateFrame}`}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className={`telemetry ${gateColor}`}>{gateHead}</p>
                      <p className="telemetry text-faint">DECISIONE PRONTA · SERVE UNA PERSONA</p>
                    </div>
                    <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-2">{gate.note}</p>

                    <p className="telemetry mt-4 text-faint">AZIONE PROPOSTA</p>
                    <ul className="mt-1.5 space-y-1">
                      {sc.actions.slice(0, 3).map((a) => (
                        <li key={a} className="font-mono text-[0.6875rem] text-muted">→ {a}</li>
                      ))}
                    </ul>

                    {!modifying ? (
                      <div className="mt-5 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={approve}
                          className="border border-accent bg-accent px-6 py-2.5 font-mono text-[0.75rem] tracking-[0.14em] text-ground transition-opacity hover:opacity-85"
                        >
                          APPROVA
                        </button>
                        <button
                          type="button"
                          onClick={reject}
                          className="border border-rule-strong px-6 py-2.5 font-mono text-[0.75rem] tracking-[0.14em] text-muted transition-colors hover:border-amber hover:text-amber"
                        >
                          RIFIUTA
                        </button>
                        {'modify' in sc && !override && (
                          <button
                            type="button"
                            onClick={() => setModifying(true)}
                            className="border border-rule-strong px-6 py-2.5 font-mono text-[0.75rem] tracking-[0.14em] text-muted transition-colors hover:border-accent hover:text-accent"
                          >
                            MODIFICA
                          </button>
                        )}
                      </div>
                    ) : (
                      'modify' in sc && (
                        <div className="settle mt-5 border-t border-rule pt-4">
                          <p className="telemetry text-ink">{sc.modify.label}</p>
                          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                            {sc.modify.options.map((o) => (
                              <button
                                key={o.k}
                                type="button"
                                onClick={() => applyOption(o)}
                                className="flex-1 border border-rule bg-void/60 px-4 py-3 text-left font-mono text-[0.6875rem] text-ink-2 transition-colors hover:border-accent hover:text-accent"
                              >
                                {o.label}
                              </button>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => setModifying(false)}
                            className="telemetry mt-3 text-faint underline decoration-rule-strong underline-offset-4 hover:text-muted"
                          >
                            annulla
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}

                {phase === 'approved' && (
                  <div className="settle mt-4 border border-rule bg-surface/70 p-5">
                    <p className="telemetry text-good">■ PROCESSO COMPLETATO</p>

                    <dl className="mt-4 grid grid-cols-2 gap-px border border-rule bg-rule/60 sm:grid-cols-4">
                      {[
                        ['INPUT', '1'],
                        ['CAMPI ESTRATTI', String(sc.fields.length)],
                        ['VERIFICATI', String(verified)],
                        ['DA REVISIONARE', String(toReview)],
                      ].map(([k, v]) => (
                        <div key={k} className="bg-surface/90 px-3 py-3">
                          <dt className="telemetry text-[0.5625rem] text-faint">{k}</dt>
                          <dd className={`mt-1 font-mono text-[1.05rem] tnum ${k === 'DA REVISIONARE' && v !== '0' ? 'text-amber' : 'text-ink'}`}>{v}</dd>
                        </div>
                      ))}
                    </dl>

                    <ul className="mt-4 space-y-2">
                      {sc.actions.map((a, i) => (
                        <li key={a} className="flex items-baseline gap-3 font-mono text-[0.75rem] text-ink-2">
                          <span className="telemetry text-faint">{String(i + 1).padStart(2, '0')}</span>
                          {a}
                        </li>
                      ))}
                    </ul>
                    <p className="telemetry mt-4 border-t border-rule pt-3 text-faint">
                      Ogni azione è registrata: chi ha approvato, quando, su quali dati.
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-rule pt-4">
                      <p className="text-[0.8125rem] text-ink-2">Questo è ciò che costruiamo.</p>
                      <a
                        href="/contatto"
                        className="border border-accent bg-accent-soft px-5 py-2.5 font-mono text-[0.6875rem] tracking-[0.14em] text-accent transition-colors hover:bg-accent hover:text-ground"
                      >
                        PORTA UN PROCESSO REALE →
                      </a>
                    </div>
                  </div>
                )}

                {phase === 'rejected' && (
                  <div className="settle mt-4 border border-rule bg-surface/70 p-5">
                    <p className="telemetry text-amber">■ RIFIUTATO · NESSUNA AZIONE ESEGUITA</p>
                    <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted">
                      La bozza torna alla persona con la motivazione. È il comportamento voluto:
                      niente parte senza approvazione, e il rifiuto è un esito normale, non un errore.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ------------------------------------------- the before / after */}
            <div className="border-t border-rule p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                  <p className="telemetry text-faint">LO STESSO LAVORO, SENZA IL SISTEMA</p>
                  <p className="telemetry hidden text-faint sm:block" aria-label="Valori illustrativi">
                    {simulator.bottleneck.map(([k, v]) => `${k} ${v}`).join(' · ')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCompare((c) => !c)}
                  aria-pressed={compare}
                  className="telemetry border border-rule px-4 py-2 text-muted transition-colors hover:border-accent/60 hover:text-ink"
                >
                  {compare ? '◂ MOSTRA IL PERCORSO MANUALE' : 'TRASFORMA ▸'}
                </button>
              </div>

              <div className="relative mt-5 min-h-[7.5rem]">
                {/* Before: the manual zigzag. After: it physically collapses
                    into the four-node DOLMIR path — the argument, animated. */}
                <ol
                  aria-hidden={compare}
                  className={`flex flex-wrap items-stretch gap-2 transition-all duration-[var(--duration-scene)] ease-[var(--ease-mech)] ${
                    compare ? 'pointer-events-none absolute inset-0 -translate-y-3 opacity-0 blur-[4px]' : 'opacity-100'
                  }`}
                >
                  {simulator.manual.map((m, i) => (
                    <li key={m.t} className="flex items-center gap-2">
                      <span
                        className="border border-rule bg-surface/60 px-3 py-2 text-center font-mono text-[0.6875rem] leading-tight text-muted"
                        style={{ transform: `translateY(${(i % 2) * 10 - 5}px)` }}
                      >
                        {m.t}
                        <span className="mt-0.5 block text-[0.625rem] text-amber">~{m.m} min</span>
                      </span>
                      {i < simulator.manual.length - 1 && <span aria-hidden className="text-faint">→</span>}
                    </li>
                  ))}
                  <li className="flex items-center pl-2 font-mono text-[0.6875rem] text-amber">
                    ≈ {totalManual} min per pratica*
                  </li>
                </ol>

                <ol
                  aria-hidden={!compare}
                  className={`flex flex-wrap items-center gap-2 transition-all duration-[var(--duration-scene)] ease-[var(--ease-mech)] ${
                    compare ? 'opacity-100' : 'pointer-events-none absolute inset-0 translate-y-3 opacity-0 blur-[4px]'
                  }`}
                >
                  {simulator.withDolmir.map((step, i) => (
                    <li key={step} className="flex items-center gap-2">
                      <span
                        className={`border px-4 py-2.5 font-mono text-[0.6875rem] tracking-[0.12em] ${
                          i === 2 ? 'border-amber/60 text-amber' : 'border-accent/60 text-accent'
                        }`}
                      >
                        {step}
                      </span>
                      {i < simulator.withDolmir.length - 1 && <span aria-hidden className="wire block h-px w-8" />}
                    </li>
                  ))}
                  <li className="flex items-center pl-2 font-mono text-[0.6875rem] text-accent">
                    secondi di macchina + una decisione umana
                  </li>
                </ol>
              </div>
              <p className="telemetry mt-3 text-faint">* {simulator.disclaimer}</p>
            </div>

            {/* --------------------------------------------- differentiator */}
            <div className="border-t border-rule p-5 sm:p-7">
              {/* On a phone the two architectures alternate under one switch;
                  side by side they would both be unreadably small. */}
              <div className="mb-4 flex gap-2 lg:hidden" role="tablist" aria-label="Confronto architetture">
                {(['ASSISTENTE GENERICO', 'DOLMIR'] as const).map((t, i) => (
                  <button
                    key={t}
                    type="button"
                    role="tab"
                    aria-selected={genericView === (i === 0)}
                    onClick={() => setGenericView(i === 0)}
                    className={`flex-1 border px-3 py-2.5 telemetry transition-colors ${
                      genericView === (i === 0) ? 'border-accent text-accent' : 'border-rule text-muted'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
                <div className={genericView ? '' : 'hidden lg:block'}>
                  <p className="telemetry text-faint">UN ASSISTENTE GENERICO</p>
                  <div className="mt-3 flex items-center gap-2">
                    {simulator.generic.map((g, i) => (
                      <span key={g} className="flex items-center gap-2">
                        <span className="border border-rule px-3.5 py-2 font-mono text-[0.6875rem] tracking-[0.12em] text-muted">{g}</span>
                        {i < simulator.generic.length - 1 && <span aria-hidden className="text-faint">→</span>}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={genericView ? 'hidden lg:block' : ''}>
                  <p className="telemetry text-faint">DOLMIR</p>
                  <div className="mt-3 flex flex-wrap items-center gap-y-2">
                    {simulator.dolmirChain.map((g, i) => (
                      <span key={g} className="flex items-center">
                        <span className={`border px-2.5 py-2 font-mono text-[0.625rem] tracking-[0.1em] ${
                          g === 'PERSONA' ? 'border-amber/60 text-amber' : 'border-accent/40 text-accent'
                        }`}>{g}</span>
                        {i < simulator.dolmirChain.length - 1 && <span aria-hidden className="wire mx-1 block h-px w-3.5 flex-none" />}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-5 max-w-[68ch] text-[0.8125rem] leading-relaxed text-muted">{simulator.differentiatorNote}</p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
