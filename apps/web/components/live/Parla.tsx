'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Chip } from '@/components/product/primitives';
import { Container } from '@/components/ui/Container';
import { Chapter } from '@/components/ui/Chapter';
import { STAGES, useConsole, type Evidence, type Stage, type Turn } from '@/lib/console-client';
import { useVoice } from '@/lib/voice';
import { DolmirCore, type CoreState } from './DolmirCore';
import { parla as c } from '@/content/site';

/**
 * PARLA CON DOLMIR — the product itself, not a chat box on a marketing page.
 *
 * The visitor speaks or types; a real model runs server-side over the
 * simulated company with tool access; and every step of that work is streamed
 * back and shown as it happens: which stage the system is in, what it
 * consulted ("3 ordini consultati"), the answer as it is written, and — the
 * two moments that are the whole argument — the human gate and NON
 * DETERMINATO, both of which the model can only reach by calling a tool.
 *
 * One instrument, drawn with the same frame as every product surface on the
 * site. The Core — the microphone — sits in the frame's head as a control,
 * not on a stage of its own: the conversation is the centre, the instrument
 * shows its state beside it. On a wide screen the system's own panel sits on
 * the right; on a phone the evidence stays with each answer.
 *
 * Nothing here is simulated, and nothing is rehearsed. If the server has no
 * model configured, the console says so plainly and offers a person — it does
 * not fall back to a set of canned answers.
 */

/** Up to four scalar fields of a record, for the evidence detail line. */
function preview(data: unknown): string[] {
  const row = Array.isArray(data) ? data[0] : data;
  if (!row || typeof row !== 'object') return [];
  const out: string[] = [];
  for (const [k, v] of Object.entries(row as Record<string, unknown>)) {
    if (out.length >= 4) break;
    if (v == null || typeof v === 'object') continue;
    out.push(`${k}: ${String(v).slice(0, 48)}`);
  }
  return out;
}

export function Parla() {
  const [input, setInput] = useState('');
  const [note, setNote] = useState<string | null>(null);
  const [reduce, setReduce] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [started, setStarted] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches); }, []);

  const console_ = useConsole({ onReply: (t) => voice.speak(t) });
  const { turns, stage, passed, busy, failure } = console_;

  const voice = useVoice({
    enabled: voiceOn,
    onFinal: (text) => { setInput(''); void submit(text); },
    onError: (kind) => setNote(c.errors[kind]),
  });

  /* No model, no theatre: the console says so once and offers a person. */
  const [offline, setOffline] = useState(false);
  const onNoModel = useCallback(() => setOffline(true), []);
  const { onDegraded } = console_;
  useEffect(() => { onDegraded(onNoModel); }, [onDegraded, onNoModel]);

  const submit = useCallback(async (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    setNote(null);
    setStarted(true);
    if (offline) return;
    await console_.ask(clean);
  }, [offline, console_]);

  useEffect(() => {
    if (failure) setNote(failure === 'rate' ? c.busyNote : failure === 'overloaded' ? c.overloadedNote : c.offlineNote);
  }, [failure]);

  /* Keep the newest line in view while an answer streams in. */
  const all = turns;
  const lastText = all[all.length - 1]?.text ?? '';
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [all.length, lastText, voice.interim]);

  const coreState: CoreState =
    voice.mic === 'listening' ? 'listening'
    : voice.speaking ? 'speaking'
    : stage === 'DECISIONE' ? 'amber'
    : busy ? 'thinking'
    : 'idle';

  const evidenceCount = useMemo(() => all.reduce((n, t) => n + (t.evidence?.length ?? 0), 0), [all]);

  const statusLine =
    voice.mic === 'listening' ? c.micListening
    : voice.speaking ? 'STO PARLANDO'
    : stage ? c.stageHint[stage]
    : offline ? c.offlineState
    : c.online;
  const statusTone = offline || stage === 'DECISIONE' ? 'amber' : busy || voice.mic === 'listening' ? 'info' : 'good';

  return (
    <section className="relative scroll-mt-[var(--nav-h)] py-[var(--space-section)]" id="parla" aria-labelledby="parla-heading">
      <Container>
        <Chapter n={c.n} label={c.label} headline={c.headline} lead={c.body} id="parla-heading" />

        <div className="frame mt-[var(--space-block)] overflow-hidden">
          {/* head: the instrument, its identity, and what it is doing right now */}
          <div className="flex items-center gap-3 border-b border-rule px-3 py-2.5 sm:gap-4 sm:px-4">
            <DolmirCore
              state={coreState}
              level={voice.level}
              onActivate={voice.supported ? voice.listen : undefined}
              label={voice.mic === 'listening' ? c.micStop : c.micLabel}
              className="size-12 flex-none sm:size-14"
            />
            <div className="min-w-0 flex-1">
              <p className="whitespace-nowrap font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink">DOLMIR · console</p>
              <p className="hidden truncate text-[0.8125rem] text-muted sm:block">{voice.supported ? c.voiceHint : c.voiceHintNoMic}</p>
            </div>
            <div className="flex-none">
              <Chip tone={statusTone} pulse={!reduce && !offline && (busy || voice.mic === 'listening')}>{statusLine}</Chip>
            </div>
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_19rem] xl:grid-cols-[minmax(0,1fr)_21rem]">
            {/* the conversation */}
            <div className="min-w-0 lg:border-r lg:border-rule">
              <div ref={logRef} className="max-h-[26rem] min-h-[14rem] overflow-y-auto px-4 py-5 sm:px-6 lg:max-h-[30rem]" aria-live="polite">
                {offline ? (
                  <div className="py-1">
                    <Chip tone="amber">{c.offlineState}</Chip>
                    <p className="mt-3 max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink-2">{c.offlineBody}</p>
                    <a href="/contatto" className="mt-4 inline-flex min-h-10 items-center rounded-[4px] border border-accent px-4 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-accent transition-colors hover:bg-accent hover:text-ground">
                      {c.offlineCta}
                    </a>
                  </div>
                ) : all.length === 0 && !voice.interim ? (
                  <div className="py-1">
                    <p className="max-w-[42ch] text-[1.0625rem] leading-relaxed text-ink sm:text-[1.125rem]">{c.prompt}</p>
                    <p className="mt-3 text-[length:var(--text-small)] text-muted">{c.promptSub}</p>
                  </div>
                ) : null}

                <ol className="space-y-6">
                  {all.map((t) => (
                    <li key={t.id} className={reduce ? '' : 'settle'}>
                      {t.who === 'you' ? (
                        <div>
                          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-faint">Voi</p>
                          <p className="mt-1 text-[0.9375rem] text-ink-2">{t.text}</p>
                        </div>
                      ) : (
                        <Answer turn={t} reduce={reduce} onDecide={console_.decide} />
                      )}
                    </li>
                  ))}
                </ol>

                {voice.interim && (
                  <p className="mt-5 max-w-[46ch] border-l-2 border-accent/60 pl-3 text-[0.9375rem] italic text-muted">
                    {voice.interim}<span aria-hidden className="ml-0.5 not-italic text-accent">▌</span>
                  </p>
                )}

                {busy && !all.some((t) => t.live && t.text) && (
                  <p className={`mt-5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted ${reduce ? '' : 'animate-pulse'}`}>{c.thinking}</p>
                )}
              </div>

              {/* input row */}
              <form className="flex items-stretch gap-2 border-t border-rule p-3 sm:p-4" onSubmit={(e) => { e.preventDefault(); const v = input; setInput(''); void submit(v); }}>
                {voice.supported && (
                  <button
                    type="button"
                    onClick={voice.listen}
                    aria-label={voice.mic === 'listening' ? c.micStop : c.micLabel}
                    className={`flex min-h-11 min-w-[2.75rem] items-center justify-center gap-2 rounded-[4px] border px-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] transition-colors ${
                      voice.mic === 'listening' ? 'border-accent bg-accent text-ground' : 'border-accent/70 text-accent hover:bg-accent/10'
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className={voice.mic === 'listening' && !reduce ? 'animate-pulse' : ''}>
                      <rect x="5" y="1" width="4" height="7" rx="2" fill="currentColor" />
                      <path d="M3 6v1a4 4 0 0 0 8 0V6M7 11v2" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
                    </svg>
                    <span className="hidden sm:inline">{voice.mic === 'listening' ? c.micStop : c.micLabel}</span>
                  </button>
                )}
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={offline ? c.offlinePlaceholder : c.inputPlaceholder}
                  disabled={offline}
                  aria-label="Scrivi a DOLMIR"
                  enterKeyHint="send"
                  className="min-h-11 min-w-0 flex-1 rounded-[4px] border border-border-ui bg-void/60 px-3.5 text-[1rem] text-ink placeholder:text-faint focus:border-accent/60 focus:outline-none sm:text-[0.9375rem]"
                />
                <button
                  type="submit"
                  disabled={busy || offline || !input.trim()}
                  className="min-h-11 rounded-[4px] border border-border-ui px-3.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink transition-colors enabled:hover:border-accent enabled:hover:text-accent disabled:opacity-40 sm:px-4"
                >
                  {c.send}
                </button>
              </form>
            </div>

            <SystemPanel stage={stage} passed={passed} evidence={all.flatMap((t) => t.evidence ?? [])} count={evidenceCount} reduce={reduce} degraded={offline} />
          </div>

          {/* voice controls + honesty line */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-rule px-4 py-2.5 sm:px-6">
            <p className="text-[length:var(--text-micro)] text-muted">{offline ? c.offlineState : c.disclaimer}</p>
            <div className="flex items-center gap-2">
              {voice.speaking && (
                <button type="button" onClick={voice.shutUp} className="min-h-9 rounded-[4px] border border-amber/60 px-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-amber transition-colors hover:bg-amber/10">
                  {c.interrupt}
                </button>
              )}
              <button
                type="button"
                onClick={() => { setVoiceOn((v) => { if (v) voice.shutUp(); return !v; }); }}
                aria-pressed={voiceOn}
                className={`min-h-9 rounded-[4px] border px-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] transition-colors ${voiceOn ? 'border-border-ui text-ink' : 'border-rule-strong text-muted'}`}
              >
                {voiceOn ? c.voiceOn : c.voiceOff}
              </button>
            </div>
          </div>
        </div>

        {note && <p className="mt-3 text-[0.8125rem] text-amber">{note}</p>}

        {/* the invitations */}
        {!offline && (
          <div className={`mt-5 transition-opacity duration-500 ${started ? 'opacity-70' : 'opacity-100'}`}>
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted">{c.suggestLabel}</p>
            <ul className="mt-2.5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {c.starters.map((s) => (
                <li key={s.t}>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void submit(s.t)}
                    className="group h-full w-full rounded-[4px] border border-rule-strong bg-surface/60 px-3.5 py-3 text-left transition-colors enabled:hover:border-accent/60 enabled:hover:bg-surface disabled:opacity-50"
                  >
                    <span className="block text-[0.875rem] leading-snug text-ink-2 group-hover:text-ink">{s.t}</span>
                    <span className="mt-1.5 block text-[length:var(--text-micro)] text-muted">{s.k}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-3 max-w-[62ch] text-[length:var(--text-small)] leading-snug text-muted">{c.contextNote}</p>
          </div>
        )}
      </Container>
    </section>
  );
}

/* ========================================================== one answer === */

function Answer({ turn, reduce, onDecide }: { turn: Turn; reduce: boolean; onDecide: (id: number, choice: string) => void }) {
  const amber = turn.tone === 'amber';
  return (
    <div>
      <p className={`font-mono text-[0.6875rem] uppercase tracking-[0.14em] ${amber ? 'text-amber' : 'text-accent'}`}>DOLMIR</p>

      {turn.text && (
        <p className="mt-1.5 max-w-[58ch] whitespace-pre-line text-[length:var(--text-body)] leading-relaxed text-ink">
          {turn.text}
          {turn.live && <span aria-hidden className="ml-0.5 text-accent">▌</span>}
        </p>
      )}

      {/* NON DETERMINATO — the system saying it does not know, on purpose. */}
      {turn.unknown && (
        <div className="mt-3 rounded-[6px] border border-amber/50 bg-amber-soft/40">
          <p className="flex items-center gap-2 border-b border-amber/30 px-3 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-amber">
            <span aria-hidden className="block size-1.5 bg-amber" />
            {c.unknownTitle}
          </p>
          <div className="px-3 py-2.5">
            <p className="text-[0.875rem] leading-relaxed text-ink-2">{turn.unknown.question || c.unknownLead}</p>
            {turn.unknown.missing.length > 0 && (
              <>
                <p className="mt-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-faint">{c.unknownMissing}</p>
                <ul className="mt-1.5 space-y-1">
                  {turn.unknown.missing.map((m) => (
                    <li key={m} className="flex gap-2 text-[0.8125rem] leading-snug text-muted">
                      <span aria-hidden className="mt-[0.45em] block h-px w-2.5 flex-none bg-amber/70" />
                      {m}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}

      {/* THE HUMAN GATE — the strongest moment in the experience. */}
      {turn.gate && (
        <div className={`mt-3 rounded-[6px] border-2 border-amber/70 bg-amber-soft/40 ${reduce ? '' : 'settle'}`}>
          <p className="flex items-center gap-2 border-b border-amber/40 bg-amber/10 px-3 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-amber">
            <span aria-hidden className={`block size-1.5 bg-amber ${reduce ? '' : 'animate-pulse'}`} />
            {c.gateTitle}
          </p>
          <div className="px-3 py-3 sm:px-4">
            <p className="max-w-[46ch] text-[0.9375rem] font-medium leading-snug text-ink">{turn.gate.question}</p>
            <p className="mt-1 text-[0.8125rem] text-muted">{c.gateLead}</p>

            <ul className="mt-3 grid gap-px overflow-hidden rounded-[4px] bg-amber/20 sm:grid-cols-2">
              {turn.gate.options.map((o, i) => (
                <li key={o.label} className="bg-void/60 p-3">
                  <p className="flex items-baseline gap-2 text-[0.875rem] font-medium text-ink">
                    <span className="tnum font-mono text-[0.6875rem] text-amber">{String(i + 1).padStart(2, '0')}</span>
                    {o.label}
                  </p>
                  {o.detail && <p className="mt-1 text-[0.8125rem] leading-snug text-muted">{o.detail}</p>}
                </li>
              ))}
            </ul>

            {turn.gate.stake && (
              <p className="mt-3 text-[0.8125rem] text-muted">
                <span className="mr-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-faint">{c.gateStake}</span>
                {turn.gate.stake}
              </p>
            )}

            {turn.decided ? (
              <p className="mt-3 flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-good">
                <span aria-hidden>✓</span> {c.gateDecided} · {turn.decided}
              </p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={() => onDecide(turn.id, c.gateApprove)} className="min-h-10 rounded-[4px] border border-accent bg-accent px-4 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ground transition-opacity hover:opacity-90">
                  {c.gateApprove}
                </button>
                <button type="button" onClick={() => onDecide(turn.id, c.gateModify)} className="min-h-10 rounded-[4px] border border-amber/70 px-4 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-amber transition-colors hover:bg-amber/10">
                  {c.gateModify}
                </button>
                <button type="button" onClick={() => onDecide(turn.id, c.gateReject)} className="min-h-10 rounded-[4px] border border-rule-strong px-4 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-muted transition-colors hover:border-muted hover:text-ink-2">
                  {c.gateReject}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Evidence stays with its answer on phones, where there is no side panel. */}
      {turn.evidence && turn.evidence.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5 lg:hidden">
          {turn.evidence.map((e, i) => (
            <li key={`${e.tool}-${i}`} className="rounded-[3px] border border-rule bg-void/60 px-2.5 py-1 font-mono text-[0.6875rem] tracking-[0.06em] text-muted">
              {e.summary}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ================================================== the system, watching === */

function SystemPanel({ stage, passed, evidence, count, reduce, degraded }: { stage: Stage | null; passed: Stage[]; evidence: Evidence[]; count: number; reduce: boolean; degraded: boolean }) {
  const recent = evidence.slice(-6);
  return (
    <aside className="hidden min-w-0 flex-col bg-surface/40 lg:flex" aria-label={c.systemPanel}>
      <p className="border-b border-rule px-4 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-2">{c.systemPanel}</p>

      <ol className="border-b border-rule px-4 py-3">
        {STAGES.map((s) => {
          const active = stage === s;
          const done = !active && passed.includes(s);
          const amber = s === 'DECISIONE';
          return (
            <li key={s} className="flex items-center gap-2.5 py-1">
              <span aria-hidden className={`block size-1.5 flex-none rounded-full transition-colors duration-300 ${active ? (amber ? 'bg-amber' : 'bg-accent') : done ? 'bg-muted' : 'bg-rule-strong'} ${active && !reduce ? 'animate-pulse' : ''}`} />
              <span className={`font-mono text-[0.6875rem] uppercase tracking-[0.14em] transition-colors duration-300 ${active ? (amber ? 'text-amber' : 'text-accent') : done ? 'text-muted' : 'text-faint'}`}>{s}</span>
              {active && <span className="truncate text-[0.75rem] text-muted">{c.stageHint[s]}</span>}
            </li>
          );
        })}
      </ol>

      <div className="min-h-0 flex-1 px-4 py-3">
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-faint">
          {c.consultedLabel}
          {count > 0 && <span className="ml-2 text-accent">{count}</span>}
        </p>
        {recent.length === 0 ? (
          <p className="mt-2 text-[0.8125rem] leading-snug text-faint">{degraded ? c.panelDegraded : c.nothingYet}</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {recent.map((e, i) => (
              <li key={`${e.tool}-${i}`} className={reduce ? '' : 'settle'}>
                <p className="text-[0.8125rem] leading-snug text-ink-2">{e.summary}</p>
                {preview(e.data).length > 0 && <p className="mt-0.5 truncate font-mono text-[0.6875rem] text-faint">{preview(e.data).join(' · ')}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
