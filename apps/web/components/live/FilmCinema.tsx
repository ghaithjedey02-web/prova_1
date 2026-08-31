'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { film as t } from '@/content/site';
import { Film } from './Film';

/**
 * The flagship film — real industrial footage, DOLMIR's system layer on top.
 *
 * Five realistic scenes (generated with Higgsfield Cinema Studio: the Italian
 * machine-shop office under paper and phone calls, the technical drawing
 * being read, two sources disagreeing across two screens, the manager and
 * the amber light of a decision, the shop running clean) tell one concrete
 * story: CAOS → COMPRENSIONE → VERIFICA → DECISIONE UMANA → AZIONE.
 *
 * The system graphics are deliberately NOT generated: extracted fields,
 * CONFLITTO RILEVATO with its evidence, the human gate and the action log
 * render as DOM overlays in brand typography — crisp, Italian, and telling
 * the product story even with the sound off (there is no sound). Amber
 * appears exactly once: at the human decision.
 *
 * Sources: the repo's /film/dolmir-film.mp4 when committed, then the hosted
 * master; if neither plays, the procedural WebGL film takes over. Reduced
 * motion never autoplays and falls back to the WebGL film's storyboard.
 */

const SOURCES = [
  '/film/dolmir-film.mp4',
  'https://d2ol7oe51mr4n9.cloudfront.net/user_3IWNhA6wnS80L9kj7n6EaO07HtE/d49b9409-3acd-412c-a6ec-7d926331c831.mp4',
] as const;

interface Cap {
  at: number;
  code: string;
  line: string;
  amber?: boolean;
  overlay?: 'fields' | 'conflict' | 'gate' | 'action';
}

/** Caption timing on the produced cut: 8 shots, 2.6s per chapter step. */
const CAPS: readonly Cap[] = [
  { at: 0,    code: 'INPUT',           line: 'Email, ordini, fatture, segnali: ognuno per conto suo.' },
  { at: 2.6,  code: 'ANALISI',         line: 'DOLMIR li raccoglie in un solo flusso.' },
  { at: 5.2,  code: 'DATI',            line: 'E li trasforma in dati, con la fonte attaccata.', overlay: 'fields' },
  { at: 7.8,  code: 'VERIFICA',        line: 'Ogni dato viene confrontato con le altre fonti.' },
  { at: 10.4, code: 'CONFLITTI',       line: 'Quando qualcosa non torna, non tira a indovinare.', overlay: 'conflict', amber: true },
  { at: 13.0, code: 'DECISIONE UMANA', line: 'Il sistema si ferma: la decisione è vostra.', overlay: 'gate', amber: true },
  { at: 15.6, code: 'AZIONE',          line: 'Approvato: il flusso riparte, ordinato e scritto nel registro.', overlay: 'action' },
  { at: 18.2, code: 'DOLMIR',          line: 'Il caos è diventato un sistema.' },
];

const FIELDS = [
  ['CLIENTE', 'Officine Rossi S.r.l.'],
  ['CODICE', 'PF-2205'],
  ['QUANTITÀ', '40 pz'],
  ['CONSEGNA', '12/09'],
] as const;

type Mode = 'poster' | 'playing' | 'done' | 'fallback';

export function FilmCinema({
  children,
  endStyle = 'center',
}: {
  /** Rendered centred over the stage — the interactive DOLMIR Core. */
  children?: React.ReactNode;
  endStyle?: 'center' | 'bar';
} = {}) {
  const video = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<Mode>('poster');
  const [srcIdx, setSrcIdx] = useState(0);
  const [cap, setCap] = useState(0);
  const [approved, setApproved] = useState(false);
  const [reduce, setReduce] = useState<boolean | null>(null);

  const host = useRef<HTMLDivElement>(null);
  const modeRef = useRef<Mode>('poster');
  modeRef.current = mode;

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  /* The film starts by itself when the section enters the viewport (muted),
     and stands down when the visitor scrolls far away. No play button needed
     for the experience; RIVEDI remains for a second pass. */
  useEffect(() => {
    if (reduce !== false) return;
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      const v = video.current;
      if (!v) return;
      if (e?.isIntersecting) {
        if (modeRef.current === 'poster') {
          setMode('playing');
          setCap(0);
          v.currentTime = 0;
          void v.play().catch(() => setMode('fallback'));
        } else if (modeRef.current === 'playing' && v.paused) {
          void v.play().catch(() => { /* stays paused */ });
        }
      } else if (modeRef.current === 'playing' && !v.paused) {
        v.pause();
      }
    }, { threshold: 0.45 });
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  /* The gate "presses" APPROVA midway through the decision scene. */
  useEffect(() => {
    if (mode !== 'playing' || CAPS[cap]!.overlay !== 'gate') { setApproved(false); return; }
    const id = setTimeout(() => setApproved(true), 2300);
    return () => clearTimeout(id);
  }, [cap, mode]);

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

  if (reduce !== false || mode === 'fallback') {
    /* No playable film (reduced motion, blocked network): the Core alone on
       a quiet stage — never a dead player, never two competing posters. */
    return children ? (
      <div className="relative flex aspect-video items-center justify-center overflow-hidden border border-rule bg-void">
        <div className="pool absolute inset-0 opacity-40" aria-hidden />
        <div className="sheet-fine absolute inset-0 opacity-30" aria-hidden />
        {children}
      </div>
    ) : <Film />;
  }

  const c = CAPS[cap]!;

  return (
    <div ref={host} data-inspect="FilmCinema · il film prodotto">
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
              <p key={`${cap}-${mode}`} className={`settle telemetry ${mode === 'done' ? 'text-accent' : c.amber ? 'text-amber' : 'text-accent'}`}>
                {mode === 'done' ? 'FINE' : c.code}
              </p>
              <div className="flex items-center gap-1">
                {CAPS.map((s, i) => (
                  <button key={s.code} type="button" aria-label={`Capitolo: ${s.code}`} onClick={() => seek(i)} className="group/seg -my-1.5 py-1.5">
                    <span className={`block h-0.5 w-4 transition-colors sm:w-6 ${
                      mode === 'done' || i < cap ? 'bg-accent' : i === cap ? (s.amber ? 'bg-amber' : 'bg-accent/50') : 'bg-rule-strong group-hover/seg:bg-muted'
                    }`} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------ the system layer, our type */}
          {mode === 'playing' && c.overlay === 'fields' && (
            <div key="fields" className="absolute left-4 top-14 z-10 flex flex-col gap-1.5 sm:left-6" aria-hidden>
              {FIELDS.map(([k, v], i) => (
                <div
                  key={k}
                  className="settle flex items-baseline gap-2 border border-accent/40 bg-void/75 px-2.5 py-1 backdrop-blur-sm"
                  style={{ animationDelay: `${300 + i * 550}ms`, animationFillMode: 'backwards' }}
                >
                  <span className="font-mono text-[0.625rem] tracking-[0.14em] text-muted">{k}</span>
                  <span className="font-mono text-[0.6875rem] tracking-[0.06em] text-ink">{v}</span>
                </div>
              ))}
            </div>
          )}

          {mode === 'playing' && c.overlay === 'conflict' && (
            <div key="conflict" className="absolute left-4 top-14 z-10 max-w-[80%] sm:left-6" aria-hidden>
              <div className="settle border border-amber/60 bg-void/80 px-3 py-2 backdrop-blur-sm" style={{ animationDelay: '700ms', animationFillMode: 'backwards' }}>
                <p className="font-mono text-[0.6875rem] tracking-[0.16em] text-amber">◆ CONFLITTO RILEVATO</p>
                <p className="mt-1 font-mono text-[0.625rem] leading-relaxed tracking-[0.06em] text-ink-2">
                  QUANTITÀ · email: 40 pz ↔ allegato PDF: 60 pz
                </p>
                <p className="mt-0.5 font-mono text-[0.625rem] tracking-[0.1em] text-muted">IL SISTEMA NON INDOVINA</p>
              </div>
            </div>
          )}

          {mode === 'playing' && c.overlay === 'gate' && (
            <div key="gate" className="absolute left-4 top-14 z-10 sm:left-6" aria-hidden>
              <div className="settle border border-amber/60 bg-void/80 px-3 py-2 backdrop-blur-sm" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}>
                <p className="font-mono text-[0.6875rem] tracking-[0.16em] text-amber">DECISIONE UMANA RICHIESTA</p>
                <div className="mt-2 flex gap-1.5">
                  <span className={`border px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.16em] transition-all duration-300 ${
                    approved ? 'border-accent bg-accent text-ground' : 'border-accent/60 text-accent'
                  }`}>
                    APPROVA
                  </span>
                  <span className={`border border-rule-strong px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.16em] text-muted transition-opacity duration-300 ${approved ? 'opacity-40' : ''}`}>
                    RIFIUTA
                  </span>
                </div>
              </div>
            </div>
          )}

          {mode === 'playing' && c.overlay === 'action' && (
            <div key="action" className="absolute left-4 top-14 z-10 sm:left-6" aria-hidden>
              <div className="settle border border-good/50 bg-void/80 px-3 py-2 backdrop-blur-sm" style={{ animationDelay: '600ms', animationFillMode: 'backwards' }}>
                <p className="font-mono text-[0.6875rem] tracking-[0.16em] text-good">✓ AZIONE ESEGUITA</p>
                <p className="mt-1 font-mono text-[0.625rem] tracking-[0.1em] text-muted">ORDINE INSERITO · REGISTRO AGGIORNATO</p>
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
              <span className="telemetry text-faint">21 secondi · senza audio · dentro il sistema</span>
            </button>
          )}

          {/* ending: the identity moment is ours, not generated */}
          {mode === 'done' && endStyle === 'bar' && (
            <div className="absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-center justify-center gap-2.5 bg-gradient-to-t from-void/90 to-transparent px-4 pb-4 pt-10">
              <p className="w-full text-center text-[0.875rem] text-ink-2">Sistemi software intelligenti per aziende industriali.</p>
              <a href="/#prova" className="border border-accent bg-accent/10 px-4 py-2 font-mono text-[0.6875rem] tracking-[0.18em] text-accent transition-colors hover:bg-accent hover:text-ground">PROVA DOLMIR</a>
              <button type="button" onClick={play} className="px-3 py-2 font-mono text-[0.6875rem] tracking-[0.18em] text-muted transition-colors hover:text-ink">{t.replay}</button>
            </div>
          )}
          {mode === 'done' && endStyle === 'center' && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-void/85 p-4 backdrop-blur-[2px]">
              <div className="settle w-full max-w-[28rem] text-center">
                <p className="font-display text-2xl font-semibold tracking-[0.28em] text-ink">DOLMIR</p>
                <p className="mt-3 text-[0.9375rem] leading-snug text-ink-2">
                  Sistemi software intelligenti per aziende industriali.
                </p>
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

          {/* the Core — the film's protagonist, and the microphone */}
          {children && (
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center [&>*]:pointer-events-auto">
              {children}
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
      <p className="telemetry mt-2.5 text-faint">Film DOLMIR · ambienti girati (Higgsfield Cinema Studio) + grafica di sistema reale · dati di esempio · senza audio.</p>
    </div>
  );
}
