'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Chapter } from '@/components/ui/Chapter';
import { emit, setActivity } from '@/lib/system-bus';
import { parla as c } from '@/content/site';

/**
 * PARLA CON DOLMIR — the console of the system, not a chatbot widget.
 *
 * The visitor asks — by voice (Web Speech API, where the browser offers it)
 * or by keyboard — and DOLMIR answers in its own register while the pipeline
 * stages light up under the words: INPUT → ANALISI → DATI → VERIFICA →
 * DECISIONE → AZIONE. Questions about the difficult case answer with the
 * demo's real numbers and surface the actual conflict list.
 *
 * The honesty rule is structural: this public console runs a deterministic
 * set of answers — no model, no API keys in the page, no pretending. Asked
 * whether it is "real AI", it says exactly what it is. The full labelling
 * lives in the copy, not in a footnote.
 *
 * Voice degrades gracefully: no SpeechRecognition → the mic hides and the
 * keyboard carries everything; denied mic, silence, or network errors get
 * plain-language messages, never a broken UI. Replies are spoken with
 * speechSynthesis when the visitor keeps VOICE ON.
 */

type Intent = (typeof c.intents)[number];
interface Line { who: 'you' | 'dolmir'; text: string; tone?: string; fx?: string; link?: { t: string; href: string } }

type MicState = 'idle' | 'listening' | 'unsupported' | 'hidden';

function normalize(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}

function matchIntent(text: string): Intent | null {
  const t = normalize(text);
  let best: Intent | null = null;
  let bestScore = 0;
  for (const it of c.intents) {
    let score = 0;
    for (const m of it.match) {
      const mm = normalize(m);
      if (t.includes(mm)) score += mm.length;
    }
    if (score > bestScore) { bestScore = score; best = it; }
  }
  return bestScore >= 4 ? best : null;
}

export function Parla() {
  const [lines, setLines] = useState<Line[]>([]);
  const [stage, setStage] = useState<number | null>(null);
  const [stageTone, setStageTone] = useState<'accent' | 'amber' | 'good'>('accent');
  const [busy, setBusy] = useState(false);
  const [mic, setMic] = useState<MicState>('idle');
  const [voiceOn, setVoiceOn] = useState(true);
  const [note, setNote] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [reduce, setReduce] = useState(false);

  const recRef = useRef<{ stop: () => void } | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const logRef = useRef<HTMLDivElement>(null);
  const hasSR = useRef(false);

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const SR = (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown });
    hasSR.current = Boolean(SR.SpeechRecognition ?? SR.webkitSpeechRecognition);
    if (!hasSR.current) setMic('unsupported');
  }, []);

  useEffect(() => () => {
    timers.current.forEach(clearTimeout);
    try { window.speechSynthesis?.cancel(); } catch { /* no synth */ }
    setActivity('idle');
  }, []);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: reduce ? 'auto' : 'smooth' });
  }, [lines, reduce]);

  const speak = useCallback((text: string) => {
    if (!voiceOn) return;
    try {
      const synth = window.speechSynthesis;
      if (!synth) return;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'it-IT';
      u.rate = 1.02;
      synth.speak(u);
    } catch { /* voice output is a bonus, never a requirement */ }
  }, [voiceOn]);

  /* ------------------------------------------------------ answer pipeline */
  const answer = useCallback((text: string) => {
    if (busy) return;
    const clean = text.trim();
    if (!clean) return;
    setNote(null);
    setBusy(true);
    setLines((l) => [...l, { who: 'you', text: clean }]);
    setActivity('listening');

    const intent = matchIntent(clean);
    const seq: readonly number[] = intent?.seq ?? [0];
    const tone = (intent?.tone ?? 'accent') as 'accent' | 'amber' | 'good';
    setStageTone(tone);

    // The stages light in order, then the reply lands; reduced motion skips
    // the choreography and answers immediately.
    const stepMs = reduce ? 0 : 520;
    seq.forEach((s, i) => {
      timers.current.push(setTimeout(() => {
        setStage(s);
        setActivity(s === 4 ? (tone === 'amber' ? 'holding' : 'verifying') : s === 5 ? 'ready' : s >= 3 ? 'verifying' : 'analyzing');
      }, i * stepMs));
    });
    timers.current.push(setTimeout(() => {
      const reply: Line = intent
        ? { who: 'dolmir', text: intent.reply, tone, fx: 'fx' in intent ? (intent as { fx?: string }).fx : undefined, link: 'link' in intent ? (intent as { link?: { t: string; href: string } }).link : undefined }
        : { who: 'dolmir', text: c.fallback, tone: 'accent' };
      setLines((l) => [...l, reply]);
      speak(reply.text);
      if (intent?.tone === 'amber') emit('GATE.HOLD', 'console · punto che richiede giudizio', 'amber');
      else emit('CONSOLE.REPLY', intent ? `intent: ${intent.id}` : 'fuori set · risposta onesta', 'accent');
      setBusy(false);
      timers.current.push(setTimeout(() => { setStage(null); setActivity('idle'); }, 2600));
    }, seq.length * stepMs + (reduce ? 0 : 240)));
  }, [busy, reduce, speak]);

  /* --------------------------------------------------------------- voice */
  const listen = useCallback(() => {
    if (mic === 'listening') { recRef.current?.stop(); return; }
    const W = window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike };
    interface SpeechRecognitionLike {
      lang: string; interimResults: boolean; maxAlternatives: number;
      onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
      onerror: ((e: { error: string }) => void) | null;
      onend: (() => void) | null;
      start: () => void; stop: () => void;
    }
    const Ctor = W.SpeechRecognition ?? W.webkitSpeechRecognition;
    if (!Ctor) { setMic('unsupported'); setNote(c.errors.unsupported); return; }
    try {
      const rec = new Ctor();
      rec.lang = 'it-IT';
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onresult = (e) => {
        const t = e.results[0]?.[0]?.transcript ?? '';
        if (t) answer(t);
        else setNote(c.errors.noSpeech);
      };
      rec.onerror = (e) => {
        setMic('idle');
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') setNote(c.errors.denied);
        else if (e.error === 'no-speech') setNote(c.errors.noSpeech);
        else setNote(c.errors.network);
      };
      rec.onend = () => setMic('idle');
      recRef.current = rec;
      setNote(null);
      setMic('listening');
      setActivity('listening');
      rec.start();
    } catch {
      setMic('unsupported');
      setNote(c.errors.unsupported);
    }
  }, [mic, answer]);

  /* ------------------------------------------------------------- render */
  const toneText = (t?: string) => (t === 'amber' ? 'text-amber' : t === 'good' ? 'text-good' : 'text-accent');

  return (
    <section
      className="relative py-[var(--space-section)]"
      id="parla"
      aria-labelledby="parla-heading"
      data-inspect="Parla · la console del sistema"
    >
      <Container>
        <Chapter n={c.n} label={c.label} headline={c.headline} lead={c.body} />

        <div className="mt-[var(--space-block)] max-w-[52rem]">
          <div className="glass-solid relative border-rule">
            {/* console header */}
            <div className="flex items-center justify-between gap-3 border-b border-rule/70 px-4 py-3 sm:px-6">
              <p className="telemetry text-ink">DOLMIR INTELLIGENCE</p>
              <p className="telemetry flex items-center gap-2 text-good">
                <span aria-hidden className={`block size-1.5 rounded-full bg-good ${reduce ? '' : 'animate-pulse'}`} />
                {c.online}
              </p>
            </div>

            {/* transcript */}
            <div ref={logRef} className="max-h-[24rem] min-h-[10rem] overflow-y-auto px-4 py-5 sm:px-6" aria-live="polite">
              {lines.length === 0 && (
                <p className="text-[1.05rem] text-ink">{c.prompt}</p>
              )}
              <ol className="space-y-5">
                {lines.map((l, i) => (
                  <li key={i} className={reduce ? '' : 'settle'}>
                    {l.who === 'you' ? (
                      <div>
                        <p className="telemetry text-faint">VOI</p>
                        <p className="mt-1 text-[0.9375rem] text-ink-2">{l.text}</p>
                      </div>
                    ) : (
                      <div>
                        <p className={`telemetry ${toneText(l.tone)}`}>DOLMIR</p>
                        <p className="mt-1 max-w-[58ch] text-[0.9375rem] leading-relaxed text-ink">{l.text}</p>
                        {l.fx === 'conflicts' && (
                          <ul className="mt-3 flex flex-wrap gap-1.5">
                            {c.conflicts.map((k) => (
                              <li key={k} className="border border-amber/40 bg-amber-soft/60 px-2.5 py-1 font-mono text-[0.6875rem] tracking-[0.08em] text-amber">
                                {k}
                              </li>
                            ))}
                          </ul>
                        )}
                        {l.link && (
                          <a href={l.link.href} className="mt-3 inline-block border border-accent/60 px-3 py-1.5 font-mono text-[0.6875rem] tracking-[0.16em] text-accent transition-colors hover:bg-accent hover:text-ground">
                            {l.link.t}
                          </a>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </div>

            {/* pipeline stages — the system visibly working */}
            <div className="flex items-center gap-1 overflow-x-auto border-t border-rule/70 px-4 py-2.5 sm:px-6" aria-hidden>
              {c.stages.map((s, i) => (
                <span key={s} className="flex items-center gap-1">
                  {i > 0 && <span className="mx-1 block h-px w-3 bg-rule-strong sm:w-5" />}
                  <span
                    className={`whitespace-nowrap font-mono text-[0.625rem] tracking-[0.14em] transition-colors duration-300 ${
                      stage === i
                        ? stageTone === 'amber' && i === 4 ? 'text-amber' : stageTone === 'good' && i === 5 ? 'text-good' : 'text-accent'
                        : stage !== null && i < stage ? 'text-muted' : 'text-faint'
                    }`}
                  >
                    {s}
                  </span>
                </span>
              ))}
            </div>

            {/* input row */}
            <form
              className="flex items-stretch gap-2 border-t border-rule/70 p-3 sm:p-4"
              onSubmit={(e) => { e.preventDefault(); answer(input); setInput(''); }}
            >
              {mic !== 'unsupported' && (
                <button
                  type="button"
                  onClick={listen}
                  aria-label={mic === 'listening' ? 'Interrompi ascolto' : c.micLabel}
                  className={`flex min-w-[3.25rem] items-center justify-center gap-2 border px-3 font-mono text-[0.6875rem] tracking-[0.14em] transition-colors sm:min-w-0 sm:px-4 ${
                    mic === 'listening'
                      ? 'border-accent bg-accent text-ground'
                      : 'border-accent/70 text-accent hover:bg-accent/10'
                  }`}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className={mic === 'listening' && !reduce ? 'animate-pulse' : ''}>
                    <rect x="5" y="1" width="4" height="7" rx="2" fill="currentColor" />
                    <path d="M3 6v1a4 4 0 0 0 8 0V6M7 11v2" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
                  </svg>
                  <span className="hidden sm:inline">{mic === 'listening' ? c.micListening : c.micLabel}</span>
                </button>
              )}
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={c.inputPlaceholder}
                aria-label="Scrivi a DOLMIR"
                className="min-w-0 flex-1 border border-rule bg-void/60 px-3.5 py-2.5 text-[0.9375rem] text-ink placeholder:text-faint focus:border-accent/60 focus:outline-none"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="border border-rule-strong px-3.5 font-mono text-[0.6875rem] tracking-[0.16em] text-ink-2 transition-colors enabled:hover:border-accent enabled:hover:text-accent disabled:opacity-40 sm:px-4"
              >
                {c.send}
              </button>
              <button
                type="button"
                onClick={() => { setVoiceOn((v) => { if (v) { try { window.speechSynthesis?.cancel(); } catch { /* off */ } } return !v; }); }}
                aria-pressed={voiceOn}
                className={`hidden border px-3 font-mono text-[0.625rem] tracking-[0.14em] transition-colors sm:block ${
                  voiceOn ? 'border-rule-strong text-ink-2' : 'border-rule text-faint'
                }`}
              >
                {voiceOn ? c.voiceOn : c.voiceOff}
              </button>
            </form>
          </div>

          {note && <p className="mt-3 text-[0.8125rem] text-amber">{note}</p>}
          {mic === 'unsupported' && !note && (
            <p className="mt-3 text-[0.8125rem] text-muted">{c.errors.unsupported}</p>
          )}

          {/* suggested questions — the visitor should never wonder what to say */}
          <div className="mt-5">
            <p className="telemetry text-faint">{c.suggestLabel}</p>
            <ul className="mt-2.5 flex flex-wrap gap-2">
              {c.intents.map((it) => (
                <li key={it.id}>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => answer(it.ask)}
                    className="border border-rule bg-surface/70 px-3 py-1.5 text-[0.8125rem] text-ink-2 transition-colors enabled:hover:border-accent/60 enabled:hover:text-ink disabled:opacity-50"
                  >
                    {it.ask}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <p className="telemetry mt-4 text-faint">{c.disclaimer}</p>
        </div>
      </Container>
    </section>
  );
}
