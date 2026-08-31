'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { setActivity, type Activity } from '@/lib/system-bus';
import { usePalette } from '@/lib/palette';
import { film } from '@/content/site';
import { T } from './film-timeline';

const FilmScene = dynamic(() => import('./FilmScene'), { ssr: false });

/**
 * The DOLMIR film — one continuous 25-second WebGL take.
 *
 * This component owns the clock and the story; FilmScene owns the matter.
 * `timeRef` advances only while the film is playing and stops dead at the
 * human gate: the pause is real, the particle world freezes amber, and the
 * film cannot end until a person presses a button. RIFIUTA is a legitimate
 * ending — the system stopping is the product working.
 *
 * The DOM layers on top of the canvas carry only what WebGL cannot: readable
 * words. Stray signal labels in the chaos, phrases physically becoming fields,
 * the constellation names, the gate, the ledger. Captions narrate below —
 * the film is silent by design.
 *
 * Under reduced motion (or without WebGL) it becomes a storyboard: all seven
 * chapters as stills, nothing lost. /scene/film renders it chrome-free for
 * ad capture — chapter timestamps live in docs/brand/AD-SCENES.md.
 */

type Mode = 'poster' | 'playing' | 'done' | 'rejected';
type Decision = 'approve' | 'modify' | null;

/* Chapter index from the film clock. Chapters 4 (gate) and 5 (action) share
   t=17.5 — the gate is a held moment, not a duration: it shows while the
   clock is stopped, and the action takes over the instant a person approves. */
function chapterAt(t: number, held: boolean, decided: boolean): number {
  if (t < T.beam) return 0;
  if (t < T.grid) return 1;
  if (t < T.map) return 2;
  if (t < T.gate) return 3;
  if (held || !decided) return 4;
  if (t < T.result) return 5;
  return 6;
}

const CHAPTER_ACTIVITY: readonly Activity[] = [
  'idle', 'listening', 'analyzing', 'processing', 'holding', 'processing', 'ready',
];

export function Film({ autoStart = false }: { autoStart?: boolean }) {
  const palette = usePalette();
  const [stage, setStage] = useState<'full' | 'board' | null>(null);
  const [mode, setMode] = useState<Mode>('poster');
  const [chapter, setChapter] = useState(0);
  const [hold, setHold] = useState(false);
  const [decision, setDecision] = useState<Decision>(null);

  const timeRef = useRef(0);
  const gateHoldRef = useRef(false);
  const decidedRef = useRef(false);

  /* The film needs motion and WebGL; a phone gets the full take (440 instanced
     boxes are light), only reduced motion or a GL-less device gets the board. */
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let gl = false;
    try {
      const c = document.createElement('canvas');
      gl = Boolean(c.getContext('webgl2') ?? c.getContext('webgl'));
    } catch { /* no GL */ }
    setStage(reduce || !gl ? 'board' : 'full');
  }, []);

  useEffect(() => () => { setActivity('idle'); }, []);

  useEffect(() => {
    if (mode === 'playing') setActivity(CHAPTER_ACTIVITY[chapter] ?? 'idle');
    else if (mode === 'done') setActivity('ready');
    else if (mode === 'rejected') setActivity('holding');
  }, [mode, chapter]);

  /* ------------------------------------------------------------- the clock */
  useEffect(() => {
    if (mode !== 'playing' || stage !== 'full') return;
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      /* The clock follows wall time so the film lasts 25s even on a device
         rendering few frames; a long gap (hidden tab) reads as a pause. */
      let dt = (now - last) / 1000;
      if (dt > 0.5) dt = 0;
      last = now;
      if (!gateHoldRef.current) {
        let t = timeRef.current + dt;
        if (!decidedRef.current && t >= T.gate) {
          t = T.gate;
          gateHoldRef.current = true;
          setHold(true);
        }
        timeRef.current = t;
        if (t >= T.end) { setMode('done'); return; }
      }
      const c = chapterAt(timeRef.current, gateHoldRef.current, decidedRef.current);
      setChapter((prev) => (prev === c ? prev : c));
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [mode, stage]);

  const play = useCallback(() => {
    timeRef.current = 0;
    gateHoldRef.current = false;
    decidedRef.current = false;
    setDecision(null);
    setHold(false);
    setChapter(0);
    setMode('playing');
  }, []);

  useEffect(() => {
    if (autoStart && stage === 'full') play();
  }, [autoStart, stage, play]);

  const decide = useCallback((d: 'approve' | 'modify' | 'reject') => {
    if (d === 'reject') {
      /* The world stays frozen amber under the card: stopping IS the ending. */
      setMode('rejected');
      return;
    }
    decidedRef.current = true;
    gateHoldRef.current = false;
    setDecision(d);
    setHold(false);
    timeRef.current = T.gate + 0.02;
    setChapter(5);
  }, []);

  /* Seeking through the rail. Landing past the gate counts as an approval —
     the film never shows the action without a decision on the record. */
  const seek = useCallback((i: number) => {
    const at = film.chapters[i]!.at;
    decidedRef.current = i >= 5;
    if (i >= 5 && decision === null) setDecision('approve');
    if (i < 5) setDecision(null);
    gateHoldRef.current = i === 4;
    setHold(i === 4);
    timeRef.current = i === 5 ? at + 0.02 : at;
    setChapter(i);
    setMode('playing');
  }, [decision]);

  /* -------------------------------------------- reduced motion: storyboard */
  if (stage === 'board') {
    return (
      <div className="grid gap-px border border-rule bg-rule/60 sm:grid-cols-2 lg:grid-cols-4" data-inspect="Film · storyboard">
        {film.chapters.map((c, i) => (
          <figure key={c.code} className="bg-surface/85 p-5">
            <figcaption className="telemetry text-accent">{c.code}</figcaption>
            <div className="my-4 flex h-16 items-center justify-center border border-rule/60 bg-void/50">
              <Still i={i} />
            </div>
            <p className="text-[0.8125rem] leading-snug text-ink-2">{c.caption}</p>
          </figure>
        ))}
        <figure className="bg-surface/85 p-5">
          <figcaption className="telemetry text-amber">ALTERNATIVA</figcaption>
          <div className="my-4 flex h-16 items-center justify-center border border-rule/60 bg-void/50">
            <span className="flex gap-1.5" aria-hidden>
              <span className="block h-5 w-1 bg-amber" /><span className="block h-5 w-1 bg-amber" />
            </span>
          </div>
          <p className="text-[0.8125rem] leading-snug text-ink-2">{film.rejectLine}</p>
        </figure>
        <p className="telemetry col-span-full bg-surface/85 px-5 py-3 text-faint">{film.disclaimer}</p>
      </div>
    );
  }

  const cur = film.chapters[chapter]!;
  const running = mode === 'playing' || mode === 'done' || mode === 'rejected';

  return (
    <div data-inspect="Film · un unico piano sequenza">
      <div className="relative overflow-hidden border border-rule bg-void">
        <div className="sheet-fine absolute inset-0 opacity-30" aria-hidden />

        {/* ---------------------------------------------------------- poster */}
        {mode === 'poster' && (
          <button
            type="button"
            onClick={play}
            className="group relative flex aspect-[4/5] w-full flex-col items-center justify-center gap-4 sm:aspect-video focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            <span className="pool absolute inset-0 opacity-50" aria-hidden />
            <span className="relative flex size-16 items-center justify-center border border-accent text-accent transition-colors duration-[var(--duration-fast)] group-hover:bg-accent group-hover:text-ground">
              <span aria-hidden className="ml-1 block border-y-[9px] border-l-[14px] border-y-transparent border-l-current" />
            </span>
            <span className="relative font-mono text-[0.8125rem] tracking-[0.22em] text-ink">{film.poster}</span>
            <span className="relative telemetry text-faint">{film.posterSub}</span>
          </button>
        )}

        {/* ------------------------------------------------------------ film */}
        {running && (
          <div className="relative flex aspect-[4/5] w-full flex-col sm:aspect-video">
            {/* chapter rail — clickable: the film is also an instrument */}
            <div className="relative z-20 flex items-center justify-between gap-3 border-b border-rule/60 px-4 py-2.5 sm:px-6">
              <p key={`${cur.code}-${mode}`} className={`settle telemetry ${mode === 'rejected' ? 'text-amber' : chapter === 4 ? 'text-amber' : 'text-accent'}`}>
                {mode === 'done' ? 'FINE' : mode === 'rejected' ? 'FERMATO' : cur.code}
              </p>
              <div className="flex items-center gap-1">
                {film.chapters.map((c, i) => (
                  <button
                    key={c.code + i}
                    type="button"
                    aria-label={`Capitolo: ${c.code}`}
                    onClick={() => seek(i)}
                    className="group/seg -my-1.5 py-1.5"
                  >
                    <span
                      className={`block h-0.5 w-3.5 transition-colors sm:w-6 ${
                        mode === 'done' || i < chapter ? 'bg-accent'
                        : i === chapter ? (chapter === 4 ? 'bg-amber' : 'bg-accent/50')
                        : 'bg-rule-strong group-hover/seg:bg-muted'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* the stage: one WebGL take, DOM words above it */}
            <div className="relative flex-1">
              {palette && (
                <div className="absolute inset-0" aria-hidden>
                  <FilmScene time={timeRef} gateHold={gateHoldRef} palette={palette} />
                </div>
              )}

              {/* CH 01 — the stray signals of a normal week */}
              {mode === 'playing' && chapter === 0 && (
                <div className="absolute inset-0" aria-hidden>
                  {film.signals.map((s, i) => (
                    <span
                      key={s.t}
                      className="settle telemetry absolute -translate-x-1/2 text-muted"
                      style={{ left: `${s.x}%`, top: `${s.y}%`, animationDelay: `${i * 260}ms`, animationFillMode: 'backwards' }}
                    >
                      {s.t}
                    </span>
                  ))}
                </div>
              )}

              {/* CH 02 — the reading line */}
              {mode === 'playing' && chapter === 1 && (
                <div className="absolute inset-0" aria-hidden>
                  <span className="settle telemetry absolute left-1/2 top-[24%] -translate-x-1/2 text-accent">LETTURA IN CORSO</span>
                  <span className="settle telemetry absolute left-1/2 top-[71%] -translate-x-1/2 text-faint" style={{ animationDelay: '500ms', animationFillMode: 'backwards' }}>
                    5 DOCUMENTI · 8 SEGNALI · 1 FLUSSO
                  </span>
                </div>
              )}

              {/* CH 03 — phrases physically becoming fields */}
              {mode === 'playing' && chapter === 2 && (
                <div className="absolute inset-x-[6%] top-1/2 flex -translate-y-1/2 flex-col gap-2.5 sm:inset-x-[14%]" aria-hidden>
                  {film.morphs.map((m, i) => (
                    <div
                      key={m.k}
                      className="settle glass flex flex-wrap items-baseline gap-x-3 gap-y-1 px-3.5 py-2"
                      style={{ animationDelay: `${i * 650}ms`, animationFillMode: 'backwards', marginLeft: `${i * 6}%` }}
                    >
                      <span className="text-[0.75rem] italic text-faint line-through decoration-rule-strong">{m.raw}</span>
                      <span className="telemetry text-faint">→</span>
                      <span className="telemetry text-muted">{m.k}</span>
                      <span className="font-mono text-[0.8125rem] text-ink">{m.v}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* CH 04 — the constellation gets its names */}
              {mode === 'playing' && chapter === 3 && (
                <div className="absolute inset-0" aria-hidden>
                  {film.nodes.map((n, i) => (
                    <span
                      key={n.t}
                      className="settle telemetry absolute -translate-x-1/2 -translate-y-1/2 border border-rule/70 bg-ground/70 px-2 py-1 text-ink-2"
                      style={{ left: `${n.x}%`, top: `${n.y}%`, animationDelay: `${i * 320}ms`, animationFillMode: 'backwards' }}
                    >
                      {n.t}
                    </span>
                  ))}
                  <span className="settle telemetry absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-accent" style={{ animationDelay: '2000ms', animationFillMode: 'backwards' }}>
                    DOLMIR
                  </span>
                </div>
              )}

              {/* CH 05 — the gate: the world is frozen, a person decides */}
              {mode === 'playing' && chapter === 4 && (
                <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
                  <div className="settle glass-solid w-full max-w-[24rem] border-amber/40 p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <p className="telemetry text-amber">{film.gateTitle}</p>
                      <p className="telemetry text-muted">{film.confidence}</p>
                    </div>
                    <dl className="mt-4 space-y-1.5 border-y border-rule/60 py-3">
                      {film.morphs.map((m) => (
                        <div key={m.k} className="flex items-baseline justify-between gap-4">
                          <dt className="telemetry text-faint">{m.k}</dt>
                          <dd className="font-mono text-[0.8125rem] text-ink">{m.v}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-3 text-[0.8125rem] leading-snug text-ink-2">{film.gateLine}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => decide('approve')}
                        className="border border-accent bg-accent/10 px-4 py-2 font-mono text-[0.6875rem] tracking-[0.18em] text-accent transition-colors hover:bg-accent hover:text-ground"
                      >
                        APPROVA
                      </button>
                      <button
                        type="button"
                        onClick={() => decide('modify')}
                        className="border border-rule-strong px-4 py-2 font-mono text-[0.6875rem] tracking-[0.18em] text-ink-2 transition-colors hover:border-muted"
                      >
                        MODIFICA
                      </button>
                      <button
                        type="button"
                        onClick={() => decide('reject')}
                        className="border border-rule-strong px-4 py-2 font-mono text-[0.6875rem] tracking-[0.18em] text-muted transition-colors hover:border-bad hover:text-bad"
                      >
                        RIFIUTA
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* CH 06 — the action, on the record */}
              {mode === 'playing' && chapter === 5 && (
                <div className="absolute inset-0" aria-hidden>
                  <span className="settle telemetry absolute left-1/2 top-[20%] -translate-x-1/2 text-good">
                    {decision === 'modify' ? 'ESITO · APPROVATO CON MODIFICA' : 'ESITO · APPROVATO'}
                  </span>
                  <div className="absolute inset-x-[7%] top-[64%] flex justify-between">
                    {film.flow.map((f, i) => (
                      <span key={f} className="settle telemetry text-muted" style={{ animationDelay: `${i * 220}ms`, animationFillMode: 'backwards' }}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CH 07 — the ledger of the run */}
              {mode === 'playing' && chapter === 6 && (
                <div className="absolute inset-0 flex items-center justify-center p-4" aria-hidden>
                  <dl className="settle grid grid-cols-2 gap-px border border-rule/70 bg-rule/50 sm:grid-cols-5">
                    {film.stats.map(([k, v], i) => (
                      <div key={k} className={`bg-ground/80 px-4 py-3 ${i === 4 ? 'col-span-2 sm:col-span-1' : ''}`}>
                        <dt className="telemetry text-faint">{k}</dt>
                        <dd className="mt-1 font-mono text-[0.9375rem] text-ink">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* the two endings */}
              {mode === 'done' && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-void/85 p-4 backdrop-blur-[2px]">
                  <div className="settle w-full max-w-[26rem] text-center">
                    <p className="font-display text-2xl font-semibold tracking-[0.28em] text-ink">DOLMIR</p>
                    <p className="mt-3 text-[0.9375rem] leading-snug text-ink-2">{film.closing}</p>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                      <a href="/#prova" className="border border-accent bg-accent/10 px-4 py-2 font-mono text-[0.6875rem] tracking-[0.18em] text-accent transition-colors hover:bg-accent hover:text-ground">
                        PROVA DOLMIR
                      </a>
                      <a href="/contatto" className="border border-rule-strong px-4 py-2 font-mono text-[0.6875rem] tracking-[0.18em] text-ink-2 transition-colors hover:border-muted">
                        PORTATECI UN PROCESSO
                      </a>
                      <button type="button" onClick={play} className="px-3 py-2 font-mono text-[0.6875rem] tracking-[0.18em] text-muted transition-colors hover:text-ink">
                        {film.replay}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {mode === 'rejected' && (
                <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
                  <div className="settle glass-solid w-full max-w-[24rem] border-amber/40 p-5 text-center sm:p-6">
                    <p className="telemetry text-amber">NESSUNA AZIONE</p>
                    <p className="mt-3 text-[0.9375rem] leading-snug text-ink-2">{film.rejectLine}</p>
                    <button type="button" onClick={play} className="mt-5 border border-rule-strong px-4 py-2 font-mono text-[0.6875rem] tracking-[0.18em] text-ink-2 transition-colors hover:border-muted">
                      {film.replay}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* caption bar — the film's voice, sound off by design */}
            <div className="relative z-20 border-t border-rule/60 px-4 py-3 sm:px-6">
              <p key={`${chapter}-${mode}`} className="settle mx-auto max-w-[46rem] text-center text-[0.8125rem] leading-snug text-ink-2 sm:text-[0.875rem]">
                {mode === 'rejected' ? film.rejectLine : mode === 'done' ? film.endCaption : cur.caption}
              </p>
            </div>
          </div>
        )}
      </div>
      <p className="telemetry mt-2.5 text-faint">{film.disclaimer}</p>
    </div>
  );
}

/* Minimal stills for the storyboard tier — the film's shapes, frozen. */
function Still({ i }: { i: number }) {
  if (i === 0) return (
    <span className="relative block size-8" aria-hidden>
      {[[2, 4], [20, 0], [10, 18], [24, 20], [0, 24]].map(([x, y]) => (
        <span key={`${x}-${y}`} className="absolute size-1 bg-muted" style={{ left: x, top: y }} />
      ))}
    </span>
  );
  if (i === 1) return <span aria-hidden className="block h-px w-12 bg-accent" />;
  if (i === 2) return (
    <span aria-hidden className="grid grid-cols-4 gap-1">
      {Array.from({ length: 8 }).map((_, k) => <span key={k} className="size-1 bg-accent/70" />)}
    </span>
  );
  if (i === 3) return (
    <span className="relative block size-9" aria-hidden>
      <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 border border-accent" />
      {[[14, 0], [28, 14], [14, 28], [0, 14]].map(([x, y]) => (
        <span key={`${x}-${y}`} className="absolute size-1 bg-muted" style={{ left: x, top: y }} />
      ))}
    </span>
  );
  if (i === 4) return (
    <span className="flex gap-1.5" aria-hidden>
      <span className="block h-5 w-1 bg-amber" /><span className="block h-5 w-1 bg-amber" />
    </span>
  );
  if (i === 5) return <span aria-hidden className="block border-y-[7px] border-l-[11px] border-y-transparent border-l-accent" />;
  return <span aria-hidden className="block size-3 border border-good bg-good/20" />;
}
