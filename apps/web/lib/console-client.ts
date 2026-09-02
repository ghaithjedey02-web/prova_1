'use client';

import { useCallback, useRef, useState } from 'react';

/**
 * The client half of PARLA CON DOLMIR.
 *
 * It reads the server's event stream and turns it into the console's state:
 * which stage the system is in, what it has consulted so far, the answer as it
 * is written, the human gate, and NON DETERMINATO. Nothing here is simulated —
 * every state change arrives from the server as it actually happens, which is
 * the whole point: the visitor is watching the system work, not a progress
 * animation.
 *
 * Honest failure modes, all visible in the interface: `degraded` when the
 * server has no working model (503, or a configuration error reported by the
 * stream) — the console shows its offline state and offers a person; and
 * `failure` when a turn could not be completed for a transient reason.
 */

export interface Evidence { tool: string; label: string; summary: string; data: unknown }
export interface GateOption { label: string; detail?: string }
export interface Gate { question: string; options: GateOption[]; stake?: string }
export interface Unknown { question: string; missing: string[] }

export type Stage = 'ANALISI' | 'DATI' | 'VERIFICA' | 'DECISIONE' | 'RISPOSTA';
export const STAGES: readonly Stage[] = ['ANALISI', 'DATI', 'VERIFICA', 'DECISIONE', 'RISPOSTA'];

export interface Turn {
  id: number;
  who: 'you' | 'dolmir';
  /** What the transcript shows. */
  text: string;
  /** What the model receives, when it differs from what is shown (gate choices). */
  send?: string;
  evidence?: Evidence[];
  gate?: Gate;
  unknown?: Unknown;
  /** Which choice the visitor made at the gate, once they have. */
  decided?: string;
  tone?: 'accent' | 'amber';
  /** Still streaming: the caret belongs on this line. */
  live?: boolean;
}

/**
 * `rate`: this visitor is sending too fast. `overloaded`: Anthropic is busy or
 * slow right now — worth a retry in a moment. `offline`: the stream broke or
 * the server could not be reached. A configuration failure (key rejected,
 * model unavailable, no credit) is not a Failure at all: it becomes the
 * console's offline state, because nobody can get an answer until an operator
 * acts, and the visitor should be offered a person instead of a retry.
 */
export type Failure = 'rate' | 'offline' | 'overloaded' | null;

const CONFIGURATION_REASONS = new Set(['auth', 'model', 'billing', 'request']);
const TRANSIENT_OVERLOAD = new Set(['overloaded', 'timeout', 'rate']);

export interface ConsoleApi {
  turns: Turn[];
  stage: Stage | null;
  /** Stages already passed this turn, for the trail. */
  passed: Stage[];
  busy: boolean;
  degraded: boolean;
  failure: Failure;
  /** `display` is what the transcript shows when it differs from the instruction sent. */
  ask: (text: string, opts?: { display?: string }) => Promise<void>;
  decide: (turnId: number, choice: string) => void;
  reset: () => void;
  /**
   * Set when the server has no model. The question is already in the
   * transcript by then, so the handler must add only the answer.
   */
  onDegraded: (fn: (q: string) => void) => void;
}

export function useConsole({ onReply }: { onReply?: (text: string) => void } = {}): ConsoleApi {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [stage, setStage] = useState<Stage | null>(null);
  const [passed, setPassed] = useState<Stage[]>([]);
  const [busy, setBusy] = useState(false);
  const [degraded, setDegraded] = useState(false);
  const [failure, setFailure] = useState<Failure>(null);

  const seq = useRef(0);
  const turnsRef = useRef<Turn[]>([]);
  turnsRef.current = turns;
  const degradedFn = useRef<((q: string) => void) | null>(null);
  const replyRef = useRef(onReply);
  replyRef.current = onReply;

  const onDegraded = useCallback((fn: (q: string) => void) => { degradedFn.current = fn; }, []);
  const reset = useCallback(() => { setTurns([]); setStage(null); setPassed([]); setFailure(null); }, []);

  const ask = useCallback(async (text: string, opts?: { display?: string }) => {
    const clean = text.trim();
    if (!clean || busy) return;

    setFailure(null);
    setBusy(true);
    setPassed([]);
    setStage(null);

    const youId = ++seq.current;
    const you: Turn = { id: youId, who: 'you', text: opts?.display ?? clean, send: clean };
    setTurns((t) => [...t, you]);

    /* The model sees the conversation, not the interface: evidence, gates and
       decisions are already reflected in the text of each turn. */
    const history = [...turnsRef.current, you]
      .map((t) => ({ role: t.who === 'you' ? 'user' : 'assistant', content: (t.send ?? t.text).trim() }))
      .filter((m) => m.content)
      .slice(-14);

    let res: Response;
    try {
      res = await fetch('/api/parla', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
    } catch {
      setBusy(false);
      setStage(null);
      setFailure('offline');
      return;
    }

    if (res.status === 503) {
      // No model behind the field. Take the question back out of the
      // transcript rather than leaving it hanging without an answer, and let
      // the console show one honest state instead.
      setTurns((t) => t.filter((x) => x.id !== youId));
      setDegraded(true);
      setBusy(false);
      setStage(null);
      degradedFn.current?.(clean);
      return;
    }
    if (res.status === 429) {
      setBusy(false);
      setStage(null);
      setFailure('rate');
      return;
    }
    if (!res.ok || !res.body) {
      setBusy(false);
      setStage(null);
      setFailure('offline');
      return;
    }

    setDegraded(false);
    const replyId = ++seq.current;
    setTurns((t) => [...t, { id: replyId, who: 'dolmir', text: '', evidence: [], live: true }]);

    const patch = (fn: (t: Turn) => Turn) =>
      setTurns((list) => list.map((t) => (t.id === replyId ? fn(t) : t)));

    const markStage = (s: Stage) => {
      setStage(s);
      setPassed((p) => (p.includes(s) ? p : [...p, s]));
    };

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let full = '';
    let errored: string | null = null;

    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split('\n\n');
        buffer = chunks.pop() ?? '';
        for (const chunk of chunks) {
          const line = chunk.trim();
          if (!line.startsWith('data:')) continue;
          let e: Record<string, unknown>;
          try { e = JSON.parse(line.slice(5).trim()); } catch { continue; }

          switch (e['type']) {
            case 'stage':
              markStage(e['stage'] as Stage);
              break;
            case 'evidence':
              patch((t) => ({ ...t, evidence: [...(t.evidence ?? []), e['evidence'] as Evidence] }));
              break;
            case 'delta':
              full += String(e['text'] ?? '');
              patch((t) => ({ ...t, text: full }));
              break;
            case 'gate':
              patch((t) => ({
                ...t,
                tone: 'amber',
                gate: { question: String(e['question'] ?? ''), options: (e['options'] ?? []) as GateOption[], stake: e['stake'] as string | undefined },
              }));
              break;
            case 'unknown':
              patch((t) => ({
                ...t,
                tone: 'amber',
                unknown: { question: String(e['question'] ?? ''), missing: (e['missing'] ?? []) as string[] },
              }));
              break;
            case 'done':
              full = String(e['text'] ?? full);
              patch((t) => ({ ...t, text: full, live: false }));
              break;
            case 'error':
              errored = String(e['reason'] ?? 'unknown');
              break;
            default:
              break;
          }
        }
      }
    } catch {
      errored ??= 'network';
    }

    if (errored && CONFIGURATION_REASONS.has(errored)) {
      // This deployment cannot answer anyone. Take the exchange back out of
      // the transcript and show the one honest state, exactly as for a 503.
      setTurns((t) => t.filter((x) => x.id !== youId && x.id !== replyId));
      setDegraded(true);
      setBusy(false);
      setStage(null);
      degradedFn.current?.(clean);
      return;
    }

    if (errored && !full.trim()) {
      // Nothing was said: drop the empty answer, keep the question so it can
      // be asked again, and say what happened.
      setTurns((t) => t.filter((x) => x.id !== replyId));
      setFailure(errored === 'rate' ? 'rate' : TRANSIENT_OVERLOAD.has(errored) ? 'overloaded' : 'offline');
      setBusy(false);
      setStage(null);
      return;
    }
    if (errored) setFailure('offline');   // the answer was cut short; keep what arrived

    patch((t) => ({ ...t, live: false }));
    setBusy(false);
    // The trail stays lit for a moment so the last stage is readable.
    window.setTimeout(() => setStage(null), 2400);
    if (full.trim()) replyRef.current?.(full.trim());
  }, [busy]);

  /**
   * The gate is a real conversational move: the visitor's choice goes back to
   * the model as their instruction, and the model continues from it.
   */
  const decide = useCallback((turnId: number, choice: string) => {
    setTurns((list) => list.map((t) => (t.id === turnId ? { ...t, decided: choice } : t)));
    const t = turnsRef.current.find((x) => x.id === turnId);
    const q = t?.gate?.question ?? '';
    const said =
      choice === 'RIFIUTA'
        ? `Rifiuto: non procedere.${q ? ` Decisione: ${q}` : ''} Dimmi cosa resta fermo e perché è un esito corretto.`
        : choice === 'MODIFICA'
          ? `Voglio modificare prima di approvare.${q ? ` Decisione: ${q}` : ''} Spiegami cosa posso cambiare e quali dati servirebbero.`
          : `Approvo.${q ? ` Decisione: ${q}` : ''} Dimmi esattamente cosa faresti come prossimo passo, senza eseguire nulla.`;
    /* The transcript shows the decision; the model receives the instruction. */
    void ask(said, { display: `${choice} — decisione presa da una persona.` });
  }, [ask]);

  return { turns, stage, passed, busy, degraded, failure, ask, decide, reset, onDegraded };
}
