'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Chapter } from '@/components/ui/Chapter';
import { emit, setActivity } from '@/lib/system-bus';
import { parla as c } from '@/content/site';

/**
 * PARLA CON DOLMIR — the console of the system, live.
 *
 * The browser talks to /api/parla; the server runs a real model over the
 * simulated demo company and returns the answer WITH the tool calls it made,
 * which render here as the evidence layer (DATI CONSULTATI). Real AI,
 * simulated company data — and the interface says exactly that.
 *
 * Voice input is Web Speech (it-IT) where the browser offers it; replies are
 * spoken with speechSynthesis behind a VOCE toggle. Every failure mode has
 * words: mic denied, silence, rate limit, model unavailable. If the server
 * has no model configured (503), the console degrades to its deterministic
 * answer set and labels itself accordingly — it never fakes the live mode.
 */

type Intent = (typeof c.intents)[number];
interface Evidence { tool: string; label: string; data: unknown }
interface Line { who: 'you' | 'dolmir'; text: string; tone?: string; fx?: string; link?: { t: string; href: string }; evidence?: Evidence[] }
type MicState = 'idle' | 'listening' | 'unsupported';
type Mode = 'unknown' | 'live' | 'degraded';

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

/** Compact, readable preview of one tool result for the evidence layer. */
function preview(data: unknown): string[] {
  const row = Array.isArray(data) ? data[0] : data;
  if (!row || typeof row !== 'object') return [];
  const out: string[] = [];
  for (const [k, v] of Object.entries(row as Record<string, unknown>)) {
    if (out.length >= 4) break;
    if (v == null || typeof v === 'object') continue;
    out.push(`${k}: ${String(v).slice(0, 60)}`);
  }
  return out;
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
  const [mode, setMode] = useState<Mode>('unknown');

  const recRef = useRef<{ stop: () => void } | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const spinRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<Line[]>([]);
  linesRef.current = lines;

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const SR = window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown };
    if (!(SR.SpeechRecognition ?? SR.webkitSpeechRecognition)) setMic('unsupported');
  }, []);

  useEffect(() => () => {
    timers.current.forEach(clearTimeout);
    if (spinRef.current) clearInterval(spinRef.current);
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

  /* Pipeline choreography while the model works. */
  const startSpin = useCallback(() => {
    setStageTone('accent');
    if (reduce) { setStage(2); return; }
    let i = 0;
    setStage(0);
    spinRef.current = setInterval(() => {
      i = (i + 1) % 4; // cycle INPUT→ANALISI→DATI→VERIFICA while waiting
      setStage(i);
      setActivity(i >= 2 ? 'verifying' : 'analyzing');
    }, 700);
  }, [reduce]);

  const stopSpin = useCallback((finalStage: number | null, tone: 'accent' | 'amber' | 'good') => {
    if (spinRef.current) { clearInterval(spinRef.current); spinRef.current = null; }
    setStageTone(tone);
    setStage(finalStage);
    timers.current.push(setTimeout(() => { setStage(null); setActivity('idle'); }, 2600));
  }, []);

  /* ----------------------------------------------- degraded (no live model) */
  const answerDegraded = useCallback((clean: string) => {
    const intent = matchIntent(clean);
    const seq: readonly number[] = intent?.seq ?? [0];
    const tone = (intent?.tone ?? 'accent') as 'accent' | 'amber' | 'good';
    setStageTone(tone);
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
      setBusy(false);
      timers.current.push(setTimeout(() => { setStage(null); setActivity('idle'); }, 2600));
    }, seq.length * stepMs + (reduce ? 0 : 240)));
  }, [reduce, speak]);

  /* ------------------------------------------------------------- live mode */
  const answer = useCallback(async (text: string) => {
    if (busy) return;
    const clean = text.trim();
    if (!clean) return;
    setNote(null);
    setBusy(true);
    setLines((l) => [...l, { who: 'you', text: clean }]);
    setActivity('listening');

    if (mode === 'degraded') { answerDegraded(clean); return; }

    startSpin();
    const history = [...linesRef.current, { who: 'you', text: clean } as Line]
      .filter((l) => l.text)
      .slice(-10)
      .map((l) => ({ role: l.who === 'you' ? 'user' : 'assistant', content: l.text }));

    try {
      const res = await fetch('/api/parla', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      if (res.status === 503) {
        setMode('degraded');
        setNote(c.degradedNote);
        emit('CONSOLE.MODE', 'modello live non configurato · modalità ridotta', 'amber');
        answerDegraded(clean);
        return;
      }
      if (res.status === 429) {
        stopSpin(null, 'amber');
        setLines((l) => [...l, { who: 'dolmir', text: c.busyNote, tone: 'amber' }]);
        setBusy(false);
        return;
      }
      if (!res.ok) throw new Error(String(res.status));

      const data = (await res.json()) as { text: string; evidence?: Evidence[] };
      const evidence = Array.isArray(data.evidence) ? data.evidence : [];
      const amber = /approvazion|persona|umana|fermo|cancello/i.test(data.text);
      setMode('live');
      stopSpin(5, amber ? 'amber' : 'good');
      setLines((l) => [...l, { who: 'dolmir', text: data.text, tone: amber ? 'amber' : 'accent', evidence }]);
      speak(data.text);
      emit('CONSOLE.REPLY', `AI live · ${evidence.length} strumenti consultati`, 'accent');
      setBusy(false);
    } catch {
      stopSpin(null, 'amber');
      setLines((l) => [...l, { who: 'dolmir', text: c.offlineNote, tone: 'amber' }]);
      setBusy(false);
    }
  }, [busy, mode, answerDegraded, startSpin, stopSpin, speak]);

  /* --------------------------------------------------------------- voice */
  const listen = useCallback(() => {
    if (mic === 'listening') { recRef.current?.stop(); return; }
    interface SpeechRecognitionLike {
      lang: string; interimResults: boolean; maxAlternatives: number;
      onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
      onerror: ((e: { error: string }) => void) | null;
      onend: (() => void) | null;
      start: () => void; stop: () => void;
    }
    const W = window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike };
    const Ctor = W.SpeechRecognition ?? W.webkitSpeechRecognition;
    if (!Ctor) { setMic('unsupported'); setNote(c.errors.unsupported); return; }
    try {
      const rec = new Ctor();
      rec.lang = 'it-IT';
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onresult = (e) => {
        const t = e.results[0]?.[0]?.transcript ?? '';
        if (t) void answer(t);
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
  const suggestions: readonly string[] = mode === 'degraded' ? c.intents.map((i) => i.ask) : c.starters;

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
              <p className={`telemetry flex items-center gap-2 ${mode === 'degraded' ? 'text-amber' : 'text-good'}`}>
                <span aria-hidden className={`block size-1.5 rounded-full ${mode === 'degraded' ? 'bg-amber' : 'bg-good'} ${reduce ? '' : 'animate-pulse'}`} />
                {mode === 'degraded' ? 'MODALITÀ RIDOTTA' : c.online}
              </p>
            </div>

            {/* transcript */}
            <div ref={logRef} className="max-h-[26rem] min-h-[10rem] overflow-y-auto px-4 py-5 sm:px-6" aria-live="polite">
              {lines.length === 0 && <p className="text-[1.05rem] text-ink">{c.prompt}</p>}
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
                        <p className="mt-1 max-w-[58ch] whitespace-pre-line text-[0.9375rem] leading-relaxed text-ink">{l.text}</p>
                        {l.evidence && l.evidence.length > 0 && (
                          <div className="mt-3 border border-rule/70 bg-void/50">
                            <p className="telemetry border-b border-rule/60 px-3 py-1.5 text-faint">{c.evidenceLabel}</p>
                            <ul className="divide-y divide-rule/50">
                              {l.evidence.map((e, k) => (
                                <li key={k} className="px-3 py-2">
                                  <p className="font-mono text-[0.6875rem] tracking-[0.1em] text-accent">{e.label}</p>
                                  {preview(e.data).length > 0 && (
                                    <p className="mt-0.5 font-mono text-[0.65rem] leading-relaxed text-muted">
                                      {preview(e.data).join(' · ')}
                                    </p>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
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
                {busy && mode !== 'degraded' && (
                  <li>
                    <p className="telemetry text-accent">DOLMIR</p>
                    <p className={`mt-1 font-mono text-[0.75rem] tracking-[0.14em] text-muted ${reduce ? '' : 'animate-pulse'}`}>
                      {c.thinking}
                    </p>
                  </li>
                )}
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
                        ? stageTone === 'amber' && i >= 4 ? 'text-amber' : stageTone === 'good' && i === 5 ? 'text-good' : 'text-accent'
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
              onSubmit={(e) => { e.preventDefault(); void answer(input); setInput(''); }}
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

          {/* starter questions — the visitor should never wonder what to say */}
          <div className="mt-5">
            <p className="telemetry text-faint">{c.suggestLabel}</p>
            <ul className="mt-2.5 flex flex-wrap gap-2">
              {suggestions.map((q) => (
                <li key={q}>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void answer(q)}
                    className="border border-rule bg-surface/70 px-3 py-1.5 text-[0.8125rem] text-ink-2 transition-colors enabled:hover:border-accent/60 enabled:hover:text-ink disabled:opacity-50"
                  >
                    {q}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <p className="telemetry mt-4 text-faint">
            {mode === 'degraded' ? c.disclaimerDegraded : c.disclaimer}
          </p>
        </div>
      </Container>
    </section>
  );
}
