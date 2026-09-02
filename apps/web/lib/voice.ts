'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { sentences, speakable } from './speech-text';

/**
 * The voice layer of the console.
 *
 * Three things the previous version did not do, and which decide whether
 * talking to DOLMIR feels like a product or like a browser toy:
 *
 *   1. BARGE-IN. The visitor can talk over the answer. Starting to listen
 *      cancels synthesis mid-sentence, the way a person stops when you
 *      interrupt them.
 *   2. MEASURED LEVEL. A Web Audio analyser on the real microphone stream
 *      drives the Core's ring. In a silent room the ring stays quiet — the
 *      feedback is a measurement, not decoration.
 *   3. SPEAKABLE TEXT. Record codes and abbreviations are rewritten before
 *      synthesis ("ORD-10482" → "ordine 10 4 8 2", "€" → "euro", bullets
 *      into pauses), so the reply is spoken like a sentence instead of being
 *      spelled out like a serial number.
 *
 * Recognition is Web Speech (it-IT) — the only engine available in-browser
 * with no key and no upload.
 *
 * SYNTHESIS asks the server first. `/api/voce` returns neural Italian audio
 * from whichever provider is configured; the browser only ever receives MP3
 * bytes, never a key. When no provider is configured the route answers 503
 * and we fall back to `speechSynthesis`, reading sentence by sentence so it
 * at least breathes. The fallback is never presented as the product voice.
 *
 * Everything degrades to silence without breaking the console: the keyboard
 * always works.
 */

export { speakable };

export type MicState = 'idle' | 'listening' | 'unsupported';

interface RecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal?: boolean }> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  onspeechend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type RecCtor = new () => RecognitionLike;

function recognitionCtor(): RecCtor | null {
  if (typeof window === 'undefined') return null;
  const W = window as unknown as { SpeechRecognition?: RecCtor; webkitSpeechRecognition?: RecCtor };
  return W.SpeechRecognition ?? W.webkitSpeechRecognition ?? null;
}

export interface VoiceApi {
  mic: MicState;
  speaking: boolean;
  /** What the microphone is hearing right now, before the sentence closes. */
  interim: string;
  /** Live amplitude 0..1, for the Core. */
  level: React.RefObject<number>;
  listen: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
  shutUp: () => void;
  supported: boolean;
}

export function useVoice({
  onFinal,
  onError,
  enabled,
}: {
  onFinal: (text: string) => void;
  onError: (kind: 'denied' | 'noSpeech' | 'network' | 'unsupported') => void;
  /** Whether replies should be spoken. */
  enabled: boolean;
}): VoiceApi {
  const [mic, setMic] = useState<MicState>('idle');
  const [speaking, setSpeaking] = useState(false);
  const [interim, setInterim] = useState('');
  const level = useRef(0);

  const recRef = useRef<RecognitionLike | null>(null);
  const audioRef = useRef<{ ctx: AudioContext; stream: MediaStream; raf: number } | null>(null);
  const finalRef = useRef(onFinal);
  finalRef.current = onFinal;
  const errRef = useRef(onError);
  errRef.current = onError;
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  useEffect(() => {
    if (!recognitionCtor()) setMic('unsupported');
    try { window.speechSynthesis?.getVoices(); } catch { /* no synth here */ }
  }, []);

  const audioEl = useRef<HTMLAudioElement | null>(null);
  const speakSeq = useRef(0);

  const stopAudio = useCallback(() => {
    const a = audioEl.current;
    if (a) {
      a.pause();
      if (a.src.startsWith('blob:')) URL.revokeObjectURL(a.src);
      audioEl.current = null;
    }
  }, []);

  const shutUpAll = useCallback(() => {
    speakSeq.current += 1;              // invalidates any in-flight request
    stopAudio();
    try { window.speechSynthesis?.cancel(); } catch { /* nothing to stop */ }
    setSpeaking(false);
  }, [stopAudio]);

  /* -------------------------------------------------- microphone amplitude */
  const stopMeter = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    cancelAnimationFrame(a.raf);
    a.stream.getTracks().forEach((t) => t.stop());
    void a.ctx.close().catch(() => { /* already closed */ });
    audioRef.current = null;
    level.current = 0;
  }, []);

  const startMeter = useCallback(async () => {
    if (audioRef.current || typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) { stream.getTracks().forEach((t) => t.stop()); return; }
      const ctx = new Ctor();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      src.connect(analyser);
      const buf = new Uint8Array(analyser.frequencyBinCount);
      const entry = { ctx, stream, raf: 0 };
      const tick = () => {
        analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (const v of buf) { const d = (v - 128) / 128; sum += d * d; }
        // RMS, lifted into a range where normal speech reads as ~0.5-1.
        level.current = Math.min(1, Math.sqrt(sum / buf.length) * 6);
        entry.raf = requestAnimationFrame(tick);
      };
      entry.raf = requestAnimationFrame(tick);
      audioRef.current = entry;
    } catch {
      /* Permission for the analyser is a bonus; recognition asks separately. */
    }
  }, []);

  /* --------------------------------------------------------- recognition */
  const stopListening = useCallback(() => {
    try { recRef.current?.stop(); } catch { /* already stopped */ }
    recRef.current = null;
    stopMeter();
    setInterim('');
    setMic((m) => (m === 'unsupported' ? m : 'idle'));
  }, [stopMeter]);

  const listen = useCallback(() => {
    if (mic === 'listening') { stopListening(); return; }
    const Ctor = recognitionCtor();
    if (!Ctor) { setMic('unsupported'); errRef.current('unsupported'); return; }

    // Barge-in: the visitor speaking always wins over the system speaking —
    // server audio and browser synthesis alike.
    shutUpAll();

    try {
      const rec = new Ctor();
      rec.lang = 'it-IT';
      rec.continuous = true;
      rec.interimResults = true;
      rec.maxAlternatives = 1;

      let settled = false;
      rec.onresult = (e) => {
        let done = '';
        let live = '';
        for (let i = 0; i < e.results.length; i++) {
          const r = e.results[i];
          const t = r?.[0]?.transcript ?? '';
          if (r?.isFinal) done += t;
          else live += t;
        }
        setInterim((done + ' ' + live).trim());
        if (done.trim() && !settled) {
          settled = true;
          setInterim('');
          stopListening();
          finalRef.current(done.trim());
        }
      };
      rec.onerror = (e) => {
        stopListening();
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') errRef.current('denied');
        else if (e.error === 'no-speech') errRef.current('noSpeech');
        else if (e.error !== 'aborted') errRef.current('network');
      };
      rec.onend = () => {
        recRef.current = null;
        stopMeter();
        setMic((m) => (m === 'unsupported' ? m : 'idle'));
      };
      rec.onspeechend = null;
      recRef.current = rec;
      setMic('listening');
      rec.start();
      void startMeter();
    } catch {
      setMic('unsupported');
      errRef.current('unsupported');
    }
  }, [mic, shutUpAll, startMeter, stopListening, stopMeter]);

  /* ---------------------------------------------------------- synthesis */
  /** The fallback: the browser voice, at least reading one sentence at a time. */
  const speakLocally = useCallback((text: string, token: number) => {
    try {
      const synth = window.speechSynthesis;
      if (!synth) return;
      synth.cancel();
      const it = synth.getVoices().filter((v) => v.lang?.toLowerCase().startsWith('it'));
      const best =
        it.find((v) => /neural|natural|online|premium|enhanced/i.test(v.name)) ??
        it.find((v) => /google/i.test(v.name)) ??
        it.find((v) => /alice|elsa|luca|federica|paola/i.test(v.name)) ??
        it[0];
      const parts = sentences(speakable(text));
      if (!parts.length) return;
      setSpeaking(true);
      parts.forEach((part, i) => {
        const u = new SpeechSynthesisUtterance(part);
        u.lang = 'it-IT';
        if (best) u.voice = best;
        u.rate = 1.0;
        u.pitch = 0.98;
        if (i === parts.length - 1) {
          u.onend = () => { if (speakSeq.current === token) setSpeaking(false); };
          u.onerror = () => { if (speakSeq.current === token) setSpeaking(false); };
        }
        synth.speak(u);
      });
    } catch { /* voice output is a bonus, never a requirement */ }
  }, []);

  /* Once the server has said it has no voice provider (503), stop asking: the
     answer will not change until a deploy, and every retry is a red line in
     the browser console for nothing. */
  const serverVoice = useRef(true);

  const speak = useCallback((text: string) => {
    if (!enabledRef.current || !text.trim()) return;
    const token = ++speakSeq.current;
    stopAudio();
    try { window.speechSynthesis?.cancel(); } catch { /* nothing to stop */ }

    if (!serverVoice.current) { speakLocally(text, token); return; }

    void (async () => {
      try {
        const res = await fetch('/api/voce', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ text: speakable(text) }),
        });
        if (res.status === 503) serverVoice.current = false;
        if (speakSeq.current !== token) return;          // interrupted while waiting
        if (!res.ok) { speakLocally(text, token); return; }
        const blob = await res.blob();
        if (speakSeq.current !== token) return;
        const el = new Audio(URL.createObjectURL(blob));
        audioEl.current = el;
        el.onplay = () => { if (speakSeq.current === token) setSpeaking(true); };
        el.onended = () => { if (speakSeq.current === token) { setSpeaking(false); stopAudio(); } };
        el.onerror = () => { if (speakSeq.current === token) speakLocally(text, token); };
        await el.play().catch(() => { if (speakSeq.current === token) speakLocally(text, token); });
      } catch {
        if (speakSeq.current === token) speakLocally(text, token);
      }
    })();
  }, [speakLocally, stopAudio]);

  useEffect(() => () => { stopListening(); shutUpAll(); }, [stopListening, shutUpAll]);

  return {
    mic, speaking, interim, level,
    listen, stopListening, speak, shutUp: shutUpAll,
    supported: mic !== 'unsupported',
  };
}
