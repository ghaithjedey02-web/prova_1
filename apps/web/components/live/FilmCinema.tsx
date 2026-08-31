'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { film as t } from '@/content/site';
import { Film } from './Film';

/**
 * The flagship film — produced footage, DOLMIR words.
 *
 * Five cinematic shots (generated with Higgsfield Cinema Studio and cut with
 * crossfades into one 22.6-second take) carry the story: paper chaos on
 * steel → the page dissolving into structured light → checks travelling
 * machined channels → the amber button and the human hand → every stream
 * settling into one calm line. The typography stays ours: Italian captions
 * and the chapter rail are DOM, in brand fonts, on top of the footage —
 * generated material for atmosphere, real UI for words.
 *
 * Sources resolve in order: the repo's own /film/dolmir-film.mp4 when the
 * asset has been committed, then the Higgsfield-hosted master. If neither
 * plays (offline, asset gone, reduced-data), the component hands over to
 * the procedural WebGL film — the site never shows a dead player. Reduced
 * motion never autoplays and falls back to the WebGL film's storyboard.
 */

const SOURCES = [
  '/film/dolmir-film.mp4',
  'https://d2ol7oe51mr4n9.cloudfront.net/user_3IWNhA6wnS80L9kj7n6EaO07HtE/9ca3cb5a-aec5-4344-afc4-6ea5b86553eb.mp4',
] as const;

/** Caption timing on the produced cut (crossfades at 4.4s intervals). */
const CAPS = [
  { at: 0,    code: 'IL CAOS',         line: 'Il lavoro di un’azienda non vive in un solo software.' },
  { at: 4.4,  code: 'COMPRENSIONE',    line: 'DOLMIR lo legge. Le parole diventano dati.' },
  { at: 8.8,  code: 'VERIFICA',        line: 'E li controlla sui sistemi che avete già.' },
  { at: 13.2, code: 'REVISIONE UMANA', line: 'Poi si ferma. Perché la decisione è vostra.', amber: true },
  { at: 17.6, code: 'AZIONE',          line: 'Approvato: il sistema agisce, e lo scrive nel registro.' },
] as const;

type Mode = 'poster' | 'playing' | 'done' | 'fallback';

export function FilmCinema() {
  const video = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<Mode>('poster');
  const [srcIdx, setSrcIdx] = useState(0);
  const [cap, setCap] = useState(0);
  const [reduce, setReduce] = useState<boolean | null>(null);

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const onError = useCallback(() => {
    if (srcIdx < SOURCES.length - 1) setSrcIdx((i) => i + 1);
    else setMode('fallback');
  }, [srcIdx]);

  const play = useCallback(() => {
    setMode('playing');
    setCap(0);
    const v = video.current;
    if (v) {
      v.currentTime = 0;
      void v.play().catch(() => setMode('fallback'));
    }
  }, []);

  const onTime = useCallback(() => {
    const ct = video.current?.currentTime ?? 0;
    let i = 0;
    for (let k = 0; k < CAPS.length; k++) if (ct >= CAPS[k]!.at) i = k;
    setCap((prev) => (prev === i ? prev : i));
  }, []);

  const seek = useCallback((i: number) => {
    const v = video.current;
    if (!v) return;
    v.currentTime = CAPS[i]!.at + 0.05;
    setCap(i);
    if (mode !== 'playing') { setMode('playing'); void v.play().catch(() => setMode('fallback')); }
  }, [mode]);

  /* Reduced motion, or a player that cannot play: the procedural film. */
  if (reduce !== false || mode === 'fallback') return <Film />;

  const c = CAPS[cap]!;

  return (
    <div data-inspect="FilmCinema · il film prodotto">
      <div className="relative overflow-hidden border border-rule bg-void">
        <div className="relative aspect-video w-full">
          <video
            ref={video}
            src={SOURCES[srcIdx]}
            muted
            playsInline
            preload="metadata"
            onError={onError}
            onTimeUpdate={onTime}
            onEnded={() => setMode('done')}
            className="absolute inset-0 h-full w-full object-cover"
            aria-label="Il film DOLMIR: dal caos all’azione"
          />

          {/* chapter rail */}
          {mode !== 'poster' && (
            <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-3 bg-gradient-to-b from-void/80 to-transparent px-4 py-2.5 sm:px-6">
              <p key={`${cap}-${mode}`} className={`settle telemetry ${mode === 'done' ? 'text-accent' : 'amber' in c && c.amber ? 'text-amber' : 'text-accent'}`}>
                {mode === 'done' ? 'FINE' : c.code}
              </p>
              <div className="flex items-center gap-1">
                {CAPS.map((s, i) => (
                  <button key={s.code} type="button" aria-label={`Capitolo: ${s.code}`} onClick={() => seek(i)} className="group/seg -my-1.5 py-1.5">
                    <span className={`block h-0.5 w-4 transition-colors sm:w-6 ${
                      mode === 'done' || i < cap ? 'bg-accent' : i === cap ? ('amber' in s && s.amber ? 'bg-amber' : 'bg-accent/50') : 'bg-rule-strong group-hover/seg:bg-muted'
                    }`} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* poster */}
          {mode === 'poster' && (
            <button
              type="button"
              onClick={play}
              className="group absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-void/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              <span className="flex size-16 items-center justify-center border border-accent text-accent transition-colors duration-[var(--duration-fast)] group-hover:bg-accent group-hover:text-ground">
                <span aria-hidden className="ml-1 block border-y-[9px] border-l-[14px] border-y-transparent border-l-current" />
              </span>
              <span className="font-mono text-[0.8125rem] tracking-[0.22em] text-ink">{t.poster}</span>
              <span className="telemetry text-faint">23 secondi · senza audio · girato + sistema</span>
            </button>
          )}

          {/* ending: the identity moment is ours, not generated */}
          {mode === 'done' && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-void/85 p-4 backdrop-blur-[2px]">
              <div className="settle w-full max-w-[26rem] text-center">
                <p className="font-display text-2xl font-semibold tracking-[0.28em] text-ink">DOLMIR</p>
                <p className="mt-3 text-[0.9375rem] leading-snug text-ink-2">{t.closing}</p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                  <a href="/#prova" className="border border-accent bg-accent/10 px-4 py-2 font-mono text-[0.6875rem] tracking-[0.18em] text-accent transition-colors hover:bg-accent hover:text-ground">
                    PROVA DOLMIR
                  </a>
                  <a href="/#parla" className="border border-rule-strong px-4 py-2 font-mono text-[0.6875rem] tracking-[0.18em] text-ink-2 transition-colors hover:border-muted">
                    PARLA CON DOLMIR
                  </a>
                  <button type="button" onClick={play} className="px-3 py-2 font-mono text-[0.6875rem] tracking-[0.18em] text-muted transition-colors hover:text-ink">
                    {t.replay}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* caption bar */}
          {mode === 'playing' && (
            <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-void/85 to-transparent px-4 pb-3 pt-8 sm:px-6">
              <p key={cap} className="settle mx-auto max-w-[46rem] text-center text-[0.8125rem] leading-snug text-ink sm:text-[0.9375rem]">
                {c.line}
              </p>
            </div>
          )}
        </div>
      </div>
      <p className="telemetry mt-2.5 text-faint">Film DOLMIR · girato generativo (Higgsfield Cinema Studio) + sistema reale · senza audio.</p>
    </div>
  );
}
