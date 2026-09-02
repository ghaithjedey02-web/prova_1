'use client';

import { useEffect, useState } from 'react';
import { Actions, Check, Chip, Decision, Field, Mail } from '@/components/product/primitives';
import { hero, scenario as sc } from '@/content/site';

/**
 * The stage — the product, full width, right under the headline.
 *
 * Three surfaces of the real interface side by side: what arrives, what
 * DOLMIR makes of it, what comes out. One request walks across them: it
 * lands in the inbox, is read field by field, checked against the systems
 * the company already has, stops at a discrepancy for a person, and — only
 * after their yes — becomes actions. A dot travels the rail each time the
 * information moves to the next surface, so the causality is drawn, not
 * narrated.
 *
 * Wide screens show the three panes together. Below lg they stack, and the
 * pane the story is on opens while the others fold to their header — the
 * same story recomposed for a phone, not shrunk to fit it.
 *
 * Wall-clock timing (a background tab never desyncs), starting on the frame
 * the server rendered so the first paint and the first client frame agree.
 * Under reduced motion the stage holds its most informative frame.
 */

const B = [0, 2.4, 5.6, 8.8, 13.0, 16.6] as const;
const LOOP = 18.4;

type Pane = 'inbox' | 'dolmir' | 'outcome';

interface Snap {
  beat: number;
  pane: Pane;
  fields: number;
  checks: number;
  conflict: boolean;
  decision: boolean;
  decided: boolean;
  actions: number;
}

function at(t: number): Snap {
  const s = t % LOOP;
  const beat = s < B[1] ? 0 : s < B[2] ? 1 : s < B[3] ? 2 : s < B[4] ? 3 : 4;
  const pane: Pane = beat === 0 ? 'inbox' : beat <= 2 ? 'dolmir' : 'outcome';
  const fields = beat === 0 ? 0 : beat === 1 ? Math.min(5, 1 + Math.floor((s - B[1]) / 0.55)) : 5;
  const checks = beat < 2 ? 0 : beat === 2 ? Math.min(3, 1 + Math.floor((s - B[2]) / 0.85)) : 3;
  const conflict = beat === 2 ? s - B[2] > 2.3 : beat > 2;
  const decision = beat >= 3;
  const decided = beat === 4 || (beat === 3 && s - B[3] > 3.4);
  const actions = beat < 4 ? 0 : Math.min(3, 1 + Math.floor((s - B[4]) / 0.55));
  return { beat, pane, fields, checks, conflict, decision, decided, actions };
}

const STILL: Snap = { beat: 3, pane: 'outcome', fields: 5, checks: 3, conflict: true, decision: true, decided: false, actions: 0 };

export function HeroStage() {
  const [snap, setSnap] = useState<Snap>(STILL);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setLive(true);
    let raf = 0;
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
  const amber = !!b.amber || (snap.beat === 2 && snap.conflict);
  const on = (p: Pane) => snap.pane === p;

  const paneHead = (p: Pane, label: string, status: React.ReactNode) => (
    <div className={`relative flex items-center justify-between gap-3 border-b border-rule px-3.5 py-2.5 transition-colors duration-500 sm:px-4 ${on(p) ? 'bg-surface/70' : ''}`}>
      <span aria-hidden className={`absolute inset-x-0 top-0 h-0.5 transition-opacity duration-500 ${on(p) ? 'opacity-100' : 'opacity-0'} ${amber && p === 'outcome' ? 'bg-amber' : 'bg-accent'}`} />
      <p className={`font-mono text-[0.6875rem] uppercase tracking-[0.14em] transition-colors duration-500 ${on(p) ? 'text-ink' : 'text-muted'}`}>{label}</p>
      {status}
    </div>
  );

  return (
    <div className="frame overflow-hidden">
      {/* the rail: one line across the whole stage; a dot travels it when the story moves on */}
      <div className="flow-rail relative h-px w-full bg-rule">
        {live && <span key={snap.beat} className={`flow-dot ${amber ? 'amber' : ''}`} aria-hidden />}
      </div>

      <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.25fr)_minmax(0,1fr)] lg:divide-x lg:divide-rule">
        {/* ---------------------------------------------------------- inbox */}
        <section aria-label={hero.panes.inbox} className="min-w-0">
          {paneHead('inbox', hero.panes.inbox, <Chip tone={snap.beat === 0 ? 'info' : 'neutral'} pulse={live && snap.beat === 0}>{sc.inbox.length} messaggi</Chip>)}
          <div className={`${on('inbox') ? 'block' : 'hidden'} flex-col gap-2 p-3 lg:flex lg:min-h-[26rem]`}>
            {sc.inbox.map((m) => (
              <Mail key={m.subject + m.time} from={m.from} subject={m.subject} time={m.time} active={'active' in m && !!m.active && snap.beat >= 1} excerpt={'active' in m ? sc.mail.excerpt : undefined} attachment={'active' in m ? sc.mail.attachment : undefined} />
            ))}
          </div>
        </section>

        {/* --------------------------------------------------------- dolmir */}
        <section aria-label={hero.panes.dolmir} className="min-w-0">
          {paneHead('dolmir', hero.panes.dolmir, snap.fields === 0 ? <Chip tone="neutral">in attesa</Chip> : snap.conflict ? <Chip tone="amber">1 conflitto</Chip> : snap.checks > 0 ? <Chip tone="info" pulse={live && snap.beat === 2}>verifica</Chip> : <Chip tone="info" pulse={live && snap.beat === 1}>lettura</Chip>)}
          <div className={`${on('dolmir') ? 'block' : 'hidden'} p-3 lg:block lg:min-h-[26rem] sm:p-4`}>
            <p className="mb-1 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-faint">Lettura</p>
            {sc.fields.map((f, i) => (
              <Field key={f.label} label={f.label} value={f.value} source={f.source} state={i >= snap.fields ? 'pending' : i === 2 && snap.conflict ? 'conflict' : snap.checks > 0 && i < 2 ? 'verified' : 'read'} />
            ))}
            <p className="mb-1 mt-4 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-faint">Verifica</p>
            {sc.checks.map((c, i) => (
              <Check key={c.what} what={c.what} against={c.against} state={i >= snap.checks ? 'pending' : c.state === 'conflict' ? (snap.conflict ? 'conflict' : 'pending') : 'ok'} note={'note' in c ? c.note : undefined} />
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------- outcome */}
        <section aria-label={hero.panes.outcome} className="min-w-0">
          {paneHead('outcome', hero.panes.outcome, snap.beat === 4 ? <Chip tone="good">approvato</Chip> : snap.decision ? <Chip tone="amber" pulse={live && !snap.decided}>decisione richiesta</Chip> : <Chip tone="neutral">in attesa</Chip>)}
          <div className={`${on('outcome') ? 'block' : 'hidden'} p-3 lg:block lg:min-h-[26rem] sm:p-4`}>
            {snap.decision && (
              <div className="settle mb-4">
                <Decision question={sc.decision.question} detail={sc.decision.detail} decided={snap.decided ? sc.decidedLabel : null} />
              </div>
            )}
            <p className="mb-1 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-faint">{snap.beat >= 4 ? 'Azioni' : 'Azioni previste · dopo il sì'}</p>
            <Actions items={sc.actions} done={snap.actions} />
            {!snap.decision && (
              <p className="mt-4 max-w-[30ch] text-[0.8125rem] leading-relaxed text-muted">Niente parte da qui finché la richiesta non è stata letta, verificata e — se serve — decisa da una persona.</p>
            )}
          </div>
        </section>
      </div>

      {/* the story line: five beats, the current one lit */}
      <div className="flex flex-col gap-2 border-t border-rule px-3.5 py-3 sm:flex-row sm:items-center sm:gap-5 sm:px-4">
        <ol className="flex flex-wrap gap-x-4 gap-y-1" aria-label="Fasi">
          {hero.beats.map((x, i) => {
            const cur = i === snap.beat;
            return (
              <li key={x.k} className={`font-mono text-[0.6875rem] uppercase tracking-[0.14em] transition-colors duration-300 ${cur ? (x.amber ? 'text-amber' : 'text-accent') : i < snap.beat ? 'text-muted' : 'text-faint'}`}>
                {x.k}
              </li>
            );
          })}
        </ol>
        <p key={b.k} className="settle min-w-0 text-[0.875rem] leading-snug text-ink-2 sm:ml-auto sm:max-w-[48ch] sm:text-right">{b.t}</p>
      </div>
    </div>
  );
}
