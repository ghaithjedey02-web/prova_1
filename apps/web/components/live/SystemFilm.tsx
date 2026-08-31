'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { setActivity, type Activity } from '@/lib/system-bus';
import { film } from '@/content/site';

/**
 * The thirty-second film, built as code.
 *
 * Eight scenes — chaos, input, understanding, connection, intelligence, the
 * human gate, action, result — rendered with the same primitives as the rest
 * of the site, so the film IS the product's visual language rather than a
 * video about it. It narrates itself through captions (sound off by design),
 * drives the 3D machine behind the page through the system bus, restarts on
 * demand, and under reduced motion becomes a storyboard: all eight scenes
 * laid out as stills, nothing lost.
 *
 * It also doubles as master footage: /scene/film renders it chrome-free for
 * screen recording (9:16, 16:9 and 1:1 crops per docs/brand/AD-SCENES.md).
 * When a produced MP4 exists one day, it replaces this component in place —
 * the slot contract is documented in docs/video/DOLMIR-FILM.md.
 */

const SCENE_ACTIVITY: readonly Activity[] = [
  'idle', 'listening', 'analyzing', 'verifying', 'processing', 'holding', 'ready', 'idle',
];

type Mode = 'poster' | 'playing' | 'done';

export function SystemFilm({ autoStart = false }: { autoStart?: boolean }) {
  const [mode, setMode] = useState<Mode>('poster');
  const [scene, setScene] = useState(0);
  const [reduce, setReduce] = useState<boolean | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const clear = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);
  useEffect(() => () => { clear(); setActivity('idle'); }, [clear]);

  const play = useCallback(() => {
    clear();
    setMode('playing');
    setScene(0);
    setActivity(SCENE_ACTIVITY[0]!);
    let t = 0;
    film.scenes.forEach((s, i) => {
      if (i > 0) {
        timers.current.push(setTimeout(() => {
          setScene(i);
          setActivity(SCENE_ACTIVITY[i] ?? 'idle');
        }, t));
      }
      t += s.ms;
    });
    timers.current.push(setTimeout(() => { setMode('done'); setActivity('idle'); }, t));
  }, [clear]);

  useEffect(() => {
    if (autoStart && reduce === false) play();
  }, [autoStart, reduce, play]);

  /* ---------------------------------------------- reduced motion: storyboard */
  if (reduce !== false) {
    return (
      <div className="grid gap-px border border-rule bg-rule/60 sm:grid-cols-2 lg:grid-cols-4" data-inspect="SystemFilm · storyboard">
        {film.scenes.map((s, i) => (
          <figure key={s.code} className="bg-surface/85 p-5">
            <figcaption className="telemetry text-accent">{s.code}</figcaption>
            <div className="my-4 flex h-16 items-center justify-center border border-rule/60 bg-void/50">
              <SceneArt i={i} still />
            </div>
            <p className="text-[0.8125rem] leading-snug text-ink-2">{s.caption}</p>
          </figure>
        ))}
        <p className="telemetry col-span-full bg-surface/85 px-5 py-3 text-faint">{film.disclaimer}</p>
      </div>
    );
  }

  const sc = film.scenes[scene]!;

  return (
    <div className="relative overflow-hidden border border-rule bg-void" data-inspect="SystemFilm · il film di sistema">
      <div className="sheet-fine absolute inset-0 opacity-40" aria-hidden />

      {/* ------------------------------------------------------------ poster */}
      {mode === 'poster' && (
        <button
          type="button"
          onClick={play}
          className="group relative flex aspect-video w-full flex-col items-center justify-center gap-4 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          <span className="flex size-16 items-center justify-center border border-accent text-accent transition-colors duration-[var(--duration-fast)] group-hover:bg-accent group-hover:text-ground">
            <span aria-hidden className="ml-1 block border-y-[9px] border-l-[14px] border-y-transparent border-l-current" />
          </span>
          <span className="font-mono text-[0.8125rem] tracking-[0.22em] text-ink">{film.poster}</span>
          <span className="telemetry text-faint">{film.posterSub}</span>
        </button>
      )}

      {/* -------------------------------------------------------------- film */}
      {mode !== 'poster' && (
        <div className="relative flex aspect-video w-full flex-col">
          {/* scene rail */}
          <div className="flex items-center justify-between gap-3 border-b border-rule/60 px-4 py-2.5 sm:px-6">
            <p key={sc.code} className="settle telemetry text-accent">{mode === 'done' ? 'FINE' : sc.code}</p>
            <div className="flex items-center gap-1" aria-hidden>
              {film.scenes.map((s, i) => (
                <span
                  key={s.code}
                  className={`block h-0.5 w-4 sm:w-6 ${i < scene || mode === 'done' ? 'bg-accent' : i === scene ? 'bg-accent/50' : 'bg-rule-strong'}`}
                />
              ))}
            </div>
          </div>

          {/* stage */}
          <div className="relative min-h-0 flex-1">
            {mode === 'done' ? (
              <div className="settle flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="font-display text-[1rem] font-semibold tracking-[0.3em] text-ink">DOLMIR</p>
                <p className="max-w-[26ch] font-display text-[clamp(1.1rem,2.6vw,1.7rem)] font-semibold leading-snug text-ink">
                  {film.closing}
                </p>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                  <a href="/#prova" className="border border-accent bg-accent px-5 py-2.5 font-mono text-[0.6875rem] tracking-[0.14em] text-ground transition-opacity hover:opacity-85">
                    PROVA DOLMIR
                  </a>
                  <a href="/contatto" className="border border-rule-strong px-5 py-2.5 font-mono text-[0.6875rem] tracking-[0.14em] text-muted transition-colors hover:border-accent hover:text-accent">
                    PORTACI UN PROCESSO
                  </a>
                  <button type="button" onClick={play} className="telemetry text-faint underline decoration-rule-strong underline-offset-4 hover:text-muted">
                    {film.replay}
                  </button>
                </div>
              </div>
            ) : (
              <div key={scene} className="settle absolute inset-0">
                <SceneArt i={scene} />
              </div>
            )}
          </div>

          {/* caption = the voice-over */}
          {mode !== 'done' && (
            <p
              key={`c-${scene}`}
              aria-live="polite"
              className="settle border-t border-rule/60 px-4 py-3 text-center font-display text-[clamp(0.9rem,2vw,1.15rem)] font-medium text-ink sm:px-6 sm:py-4"
            >
              {sc.caption}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------- the scenes --*/

/** One scene's picture. `still` renders a miniature for the storyboard. */
function SceneArt({ i, still = false }: { i: number; still?: boolean }) {
  const mini = still ? 'scale-[0.55]' : '';

  if (i === 0) {
    // Chaos: the tools, scattered and adrift.
    return (
      <div className={`flex h-full w-full flex-wrap content-center items-center justify-center gap-2 p-6 ${mini}`}>
        {film.chaos.map((c, j) => (
          <span
            key={c}
            className="border border-rule bg-surface/70 px-2.5 py-1.5 font-mono text-[0.625rem] text-muted"
            style={{
              transform: `translateY(${((j * 7) % 22) - 11}px) rotate(${((j % 5) - 2) * 2}deg)`,
              animation: still ? undefined : `dolmir-drift 3.2s ease-in-out ${j * 0.13}s infinite alternate`,
            }}
          >
            {c}
          </span>
        ))}
      </div>
    );
  }
  if (i === 1) {
    // Input: one email, captured and scanned.
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className={`scan w-[min(24rem,88%)] border border-accent/50 bg-surface/80 p-4 ${mini}`}>
          <p className="telemetry text-faint">DA · {film.emailFrom}</p>
          <p className="mt-1.5 font-mono text-[0.75rem] text-ink">{film.emailSubject}</p>
          <div className="mt-3 space-y-1.5" aria-hidden>
            <div className="h-px w-4/5 bg-rule-bright" />
            <div className="h-px w-3/5 bg-rule-bright" />
            <div className="h-px w-2/3 bg-rule-bright" />
          </div>
        </div>
      </div>
    );
  }
  if (i === 2) {
    // Understanding: the document becomes fields.
    return (
      <div className={`flex h-full items-center justify-center gap-4 p-6 sm:gap-8 ${mini}`}>
        <div className="hidden w-32 border border-rule bg-surface/60 p-3 opacity-60 sm:block" aria-hidden>
          <div className="space-y-1.5">
            <div className="h-px w-full bg-rule-bright" />
            <div className="h-px w-3/4 bg-rule-bright" />
            <div className="h-px w-5/6 bg-rule-bright" />
          </div>
        </div>
        <span aria-hidden className="wire hidden h-px w-10 sm:block" />
        <dl className="space-y-2">
          {film.fields.map(([k, v, conf], j) => (
            <div
              key={k}
              className="flex items-baseline gap-3 border border-rule bg-surface/80 px-3 py-1.5"
              style={{ animation: still ? undefined : `dolmir-settle 0.4s var(--ease-mech-out) ${0.3 + j * 0.55}s both` }}
            >
              <dt className="telemetry w-20 text-[0.5625rem] text-faint">{k}</dt>
              <dd className="font-mono text-[0.75rem] text-ink">{v}</dd>
              <dd className="ml-auto font-mono text-[0.625rem] tnum text-good">{conf}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }
  if (i === 3) {
    // Connection: the run's footprint across the systems.
    return (
      <div className={`flex h-full items-center justify-center p-6 ${mini}`}>
        <div className="flex flex-wrap items-center justify-center gap-y-3">
          {film.systems.map((sName, j) => (
            <span key={sName} className="flex items-center">
              <span
                className={`border px-3 py-2 font-mono text-[0.6875rem] tracking-[0.12em] ${
                  sName === 'DOLMIR' ? 'border-accent bg-accent-soft text-accent' : 'border-rule-strong text-ink-2'
                }`}
                style={{ animation: still ? undefined : `dolmir-settle 0.4s var(--ease-mech-out) ${j * 0.5}s both` }}
              >
                {sName}
              </span>
              {j < film.systems.length - 1 && <span aria-hidden className="wire mx-1.5 block h-px w-6 sm:w-9" />}
            </span>
          ))}
        </div>
      </div>
    );
  }
  if (i === 4) {
    // Intelligence: the measurement.
    return (
      <div className={`flex h-full flex-col items-center justify-center gap-4 p-6 ${mini}`}>
        <div className="relative flex size-24 items-center justify-center" aria-hidden>
          <span className="absolute inset-0 animate-pulse border border-accent/40" style={{ transform: 'rotate(45deg)' }} />
          <span className="absolute inset-2 border border-accent/70" style={{ transform: 'rotate(45deg)' }} />
          <span className="font-mono text-[0.9rem] tnum text-accent">{film.confidence}</span>
        </div>
        <div className="flex gap-2">
          {film.intel.map((c) => (
            <span key={c} className="border border-rule px-2.5 py-1 font-mono text-[0.5625rem] tracking-[0.12em] text-muted">{c}</span>
          ))}
        </div>
      </div>
    );
  }
  if (i === 5) {
    // The gate: everything pauses, amber.
    return (
      <div className={`flex h-full items-center justify-center p-6 ${mini}`}>
        <div className="w-[min(24rem,92%)] border border-amber/50 bg-amber-soft p-5 text-center">
          <p className="telemetry text-amber">■ REVISIONE UMANA</p>
          <p className="mt-2 text-[0.8125rem] text-ink-2">{film.gateLine}</p>
          <div className="mt-4 flex justify-center gap-2" aria-hidden>
            <span className="border border-accent bg-accent px-4 py-1.5 font-mono text-[0.625rem] tracking-[0.14em] text-ground">APPROVA</span>
            <span className="border border-rule-strong px-4 py-1.5 font-mono text-[0.625rem] tracking-[0.14em] text-muted">MODIFICA</span>
            <span className="border border-rule-strong px-4 py-1.5 font-mono text-[0.625rem] tracking-[0.14em] text-muted">RIFIUTA</span>
          </div>
        </div>
      </div>
    );
  }
  if (i === 6) {
    // Action: executed and recorded.
    return (
      <div className={`flex h-full items-center justify-center p-6 ${mini}`}>
        <ul className="space-y-2">
          {film.actions.map((a, j) => (
            <li
              key={a}
              className="flex items-center gap-3 font-mono text-[0.75rem] text-ink-2"
              style={{ animation: still ? undefined : `dolmir-settle 0.35s var(--ease-mech-out) ${j * 0.5}s both` }}
            >
              <span className="text-good">■</span>
              {a}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  // Result: the chaos, composed into one flow.
  return (
    <div className={`flex h-full flex-col items-center justify-center gap-5 p-6 ${mini}`}>
      <div className="flex items-center">
        {['INPUT', 'DOLMIR', 'PERSONA', 'AZIONE'].map((sName, j) => (
          <span key={sName} className="flex items-center">
            <span
              className={`border px-3 py-2 font-mono text-[0.6875rem] tracking-[0.14em] ${
                sName === 'PERSONA' ? 'border-amber/60 text-amber' : 'border-accent/60 text-accent'
              }`}
            >
              {sName}
            </span>
            {j < 3 && <span aria-hidden className="wire mx-1.5 block h-px w-6 sm:w-10" />}
          </span>
        ))}
      </div>
      <p className="telemetry text-faint">{film.disclaimer}</p>
    </div>
  );
}
