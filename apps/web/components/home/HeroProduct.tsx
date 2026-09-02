'use client';

import { useEffect, useState } from 'react';
import { Actions, Check, Chip, Decision, Field, Frame, Mail } from '@/components/product/primitives';
import { hero, scenario as sc } from '@/content/site';

/**
 * The hero's product: one frame, one request, the whole loop.
 *
 * A request for quotation lands, is read field by field, is checked against
 * the systems the company already has, hits a discrepancy, stops for a
 * person, and — only after their yes — becomes actions. It is drawn with the
 * same primitives as the live console, so the first thing a visitor sees is
 * the product, not a picture of it.
 *
 * The clock is wall time, so a background tab or a slow frame never desyncs
 * captions from state. Under reduced motion the scene renders its most
 * informative frame — the discrepancy and the decision — and stays.
 */

/* beat boundaries in seconds; the loop restarts after the last */
const B = [0, 2.2, 5.2, 8.2, 12.2, 15.6] as const;
const LOOP = 17.4;

interface Snap {
  beat: number;      // 0..4
  fields: number;    // how many fields have been read
  checks: number;    // how many checks have run
  conflict: boolean;
  decision: boolean;
  decided: boolean;
  actions: number;
}

function at(t: number): Snap {
  const s = t % LOOP;
  const beat = s < B[1] ? 0 : s < B[2] ? 1 : s < B[3] ? 2 : s < B[4] ? 3 : 4;
  const fields = beat === 0 ? 0 : beat === 1 ? Math.min(5, 1 + Math.floor((s - B[1]) / 0.5)) : 5;
  const checks = beat < 2 ? 0 : beat === 2 ? Math.min(3, 1 + Math.floor((s - B[2]) / 0.8)) : 3;
  const conflict = beat === 2 ? s - B[2] > 2.2 : beat > 2;
  const decision = beat >= 3;
  const decided = beat === 4 || (beat === 3 && s - B[3] > 3.2);
  const actions = beat < 4 ? 0 : Math.min(3, 1 + Math.floor((s - B[4]) / 0.55));
  return { beat, fields, checks, conflict, decision, decided, actions };
}

const STILL: Snap = { beat: 3, fields: 5, checks: 3, conflict: true, decision: true, decided: false, actions: 0 };

export function HeroProduct() {
  const [snap, setSnap] = useState<Snap>(STILL);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setLive(true);
    let raf = 0;
    /* Start at the decision beat: it is the frame the server already
       rendered, so hydration changes nothing on screen and the largest paint
       is the first one. The story then runs on to the actions and loops back
       to the arrival. */
    const t0 = performance.now() / 1000 - B[3];
    let last = '';
    const tick = () => {
      if (!document.hidden) {
        const s = at(performance.now() / 1000 - t0);
        const key = JSON.stringify(s);
        if (key !== last) { last = key; setSnap(s); }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const b = hero.beats[snap.beat]!;
  const status =
    snap.beat === 0 ? <Chip tone="info" pulse={live}>in arrivo</Chip>
    : snap.beat === 1 ? <Chip tone="info" pulse={live}>lettura</Chip>
    : snap.beat === 2 && !snap.conflict ? <Chip tone="info" pulse={live}>verifica</Chip>
    : snap.beat === 4 ? <Chip tone="good">approvato</Chip>
    : <Chip tone="amber" pulse={live && !snap.decided}>decisione richiesta</Chip>;

  return (
    <div className="relative">
      <Frame title={<>DOLMIR · <span className="text-ink-2">Posta commerciale</span></>} status={status} bodyClassName="grid gap-3 p-3 sm:grid-cols-[1fr_1.35fr] sm:p-4">
        {/* the request */}
        <div className="min-w-0">
          <p className="mb-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-faint">In arrivo</p>
          <Mail
            from={sc.mail.from}
            subject={sc.mail.subject}
            time={sc.mail.time}
            excerpt={sc.mail.excerpt}
            attachment={sc.mail.attachment}
            active={snap.beat >= 1}
          />
          {snap.checks >= 3 && (
            <div className="settle mt-3 hidden sm:block">
              <p className="mb-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-faint">Storico · stesso cliente</p>
              <div className="rounded-[4px] border border-rule bg-surface/60 px-3.5 py-2.5">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-mono text-[0.8125rem] text-ink">PRV-2198</p>
                  <p className="font-mono text-[0.6875rem] text-faint">giugno 2026</p>
                </div>
                <p className="mt-0.5 text-[0.8125rem] text-ink-2">SL-4410 · <span className={snap.conflict ? 'text-amber' : ''}>1.200 pz</span> · inviato</p>
              </div>
            </div>
          )}
          {snap.beat >= 4 && (
            <div className="settle mt-3">
              <p className="mb-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-faint">Azioni</p>
              <Actions items={sc.actions} done={snap.actions} />
            </div>
          )}
        </div>

        {/* what the system made of it */}
        <div className="min-w-0">
          <p className="mb-1 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-faint">Lettura</p>
          <div>
            {sc.fields.map((f, i) => (
              <Field
                key={f.label}
                label={f.label}
                value={f.value}
                source={f.source}
                state={i >= snap.fields ? 'pending' : snap.checks > 0 && i === 0 ? 'verified' : i === 2 && snap.conflict ? 'conflict' : 'read'}
              />
            ))}
          </div>

          {snap.checks > 0 && (
            <div className="settle mt-3">
              <p className="mb-1 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-faint">Verifica</p>
              {sc.checks.slice(0, snap.checks).map((c) => (
                <Check
                  key={c.what}
                  what={c.what}
                  against={c.against}
                  state={c.state === 'conflict' ? (snap.conflict ? 'conflict' : 'pending') : 'ok'}
                  note={'note' in c ? c.note : undefined}
                />
              ))}
            </div>
          )}

          {snap.decision && (
            <div className="settle mt-3">
              <Decision question={sc.decision.question} detail={sc.decision.detail} decided={snap.decided ? sc.decidedLabel : null} compact />
            </div>
          )}
        </div>
      </Frame>

      {/* the caption: what is happening, in one line */}
      <div className="mt-3 flex items-start gap-3">
        <div className="flex gap-1 pt-1.5" aria-hidden>
          {hero.beats.map((x, i) => (
            <span key={x.k} className={`block h-1 w-5 rounded-full transition-colors duration-300 ${i === snap.beat ? (b.amber ? 'bg-amber' : 'bg-accent') : i < snap.beat ? 'bg-muted' : 'bg-rule-strong'}`} />
          ))}
        </div>
        <p key={b.k} className="settle min-w-0 text-[0.875rem] leading-snug text-ink-2">
          <span className={`mr-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] ${b.amber ? 'text-amber' : 'text-accent'}`}>{b.k}</span>
          {b.t}
        </p>
      </div>
    </div>
  );
}
