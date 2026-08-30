'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Chapter } from '@/components/ui/Chapter';
import { Container } from '@/components/ui/Container';
import { Counter } from '@/components/ui/Counter';
import { Reveal } from '@/components/ui/Reveal';
import { emit, setActivity } from '@/lib/system-bus';

/**
 * "Mostrami dove perdi tempo."
 *
 * The visitor names the part of their week that hurts and the system runs a
 * visible analysis on it, then assembles the workflow it would build. It is the
 * closest thing on the site to a sales conversation, except the visitor drives
 * it and nobody has to be persuaded of anything.
 *
 * THE NUMBERS ARE SIMULATED AND SAID TO BE. They are plausible shapes for a
 * mid-sized company, not results measured at a client — DOLMIR has none to
 * publish yet, and a fabricated case study would cost more than it buys. Every
 * panel carries the label, and the copy repeats it.
 */

interface Scenario {
  k: string;
  label: string;
  headline: string;
  /** The funnel, from raw volume down to what actually needs a person. */
  funnel: { v: number; k: string }[];
  workflow: string[];
  keeps: string;
}

const SCENARIOS: Scenario[] = [
  {
    k: 'email',
    label: 'Email',
    headline: 'La casella condivisa è il vero gestionale.',
    funnel: [
      { v: 147, k: 'email ricevute in una settimana' },
      { v: 42, k: 'richieste operative' },
      { v: 18, k: 'inserimenti manuali in un altro sistema' },
      { v: 11, k: 'controlli ripetuti' },
      { v: 6, k: 'decisioni che servono davvero una persona' },
    ],
    workflow: ['Ricezione', 'Classificazione', 'Estrazione', 'Instradamento', 'Approvazione', 'Archiviazione'],
    keeps: 'Le sei decisioni restano vostre. Le altre 136 righe smettono di passare da una persona.',
  },
  {
    k: 'preventivi',
    label: 'Preventivi',
    headline: 'Il collo di bottiglia è a monte, non in produzione.',
    funnel: [
      { v: 34, k: 'richieste di offerta in una settimana' },
      { v: 27, k: 'con dati sufficienti per essere lavorate' },
      { v: 21, k: 'con un precedente comparabile nello storico' },
      { v: 9, k: 'che oggi si evadono in tempo utile' },
      { v: 4, k: 'che richiedono una stima tecnica vera' },
    ],
    workflow: ['Lettura', 'Estrazione', 'Confidenza', 'Confronto storico', 'Bozza', 'Approvazione'],
    keeps: 'Le quattro stime tecniche restano al preventivista. Le altre arrivano già preparate.',
  },
  {
    k: 'documenti',
    label: 'Documenti',
    headline: 'Gli allegati non sono archivio: sono dati non letti.',
    funnel: [
      { v: 210, k: 'documenti ricevuti in un mese' },
      { v: 96, k: 'contenenti dati che servono altrove' },
      { v: 61, k: 'ricopiati a mano in un sistema' },
      { v: 24, k: 'ricercati almeno una volta e non trovati' },
      { v: 3, k: 'errori di trascrizione rilevati' },
    ],
    workflow: ['Acquisizione', 'Riconoscimento', 'Estrazione', 'Collegamento a commessa', 'Verifica', 'Indice'],
    keeps: 'Ogni dato estratto porta con sé la frase esatta del documento da cui viene.',
  },
  {
    k: 'ordini',
    label: 'Ordini',
    headline: 'Fra la conferma e il gestionale c’è sempre una persona.',
    funnel: [
      { v: 88, k: 'ordini ricevuti in un mese' },
      { v: 88, k: 'inseriti manualmente' },
      { v: 31, k: 'con almeno una correzione successiva' },
      { v: 12, k: 'con una richiesta di chiarimento al cliente' },
      { v: 2, k: 'consegnati in ritardo per un errore di inserimento' },
    ],
    workflow: ['Ricezione', 'Riconoscimento', 'Estrazione righe', 'Controllo anagrafiche', 'Scrittura', 'Conferma'],
    keeps: 'L’inserimento sparisce. La verifica delle eccezioni resta.',
  },
  {
    k: 'approvazioni',
    label: 'Approvazioni',
    headline: 'La decisione è rapida. Trovare il contesto no.',
    funnel: [
      { v: 54, k: 'approvazioni richieste in un mese' },
      { v: 54, k: 'che richiedono di cercare documenti sparsi' },
      { v: 19, k: 'ferme più di due giorni' },
      { v: 7, k: 'sollecitate almeno una volta' },
      { v: 54, k: 'decisioni che restano umane' },
    ],
    workflow: ['Innesco', 'Raccolta contesto', 'Verifica', 'Notifica', 'Decisione', 'Registro'],
    keeps: 'Nessuna approvazione viene automatizzata. Cambia solo quanto costa arrivarci.',
  },
];

type Phase = 'idle' | 'scanning' | 'done';

export function FrictionScan() {
  const [picked, setPicked] = useState<Scenario | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [rows, setRows] = useState(0);
  const [flow, setFlow] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => () => { clear(); setActivity('idle'); }, [clear]);

  function choose(s: Scenario) {
    clear();
    setPicked(s);
    setPhase('scanning');
    setRows(0);
    setFlow(0);
    setActivity('analyzing');
    emit('SCAN_START', `Analisi simulata · ${s.label.toLowerCase()}`, 'accent');

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setRows(s.funnel.length);
      setFlow(s.workflow.length);
      setPhase('done');
      setActivity('ready');
      return;
    }

    s.funnel.forEach((_, i) => {
      timers.current.push(setTimeout(() => setRows(i + 1), 320 + i * 420));
    });
    const afterFunnel = 320 + s.funnel.length * 420;
    timers.current.push(setTimeout(() => setActivity('processing'), afterFunnel));
    s.workflow.forEach((_, i) => {
      timers.current.push(setTimeout(() => setFlow(i + 1), afterFunnel + 200 + i * 240));
    });
    timers.current.push(setTimeout(() => {
      setPhase('done');
      setActivity('ready');
      emit('SCAN_DONE', `Flusso proposto · ${s.workflow.length} passaggi`, 'good');
      timers.current.push(setTimeout(() => setActivity('idle'), 2400));
    }, afterFunnel + 200 + s.workflow.length * 240));
  }

  const max = picked ? Math.max(...picked.funnel.map((f) => f.v)) : 1;

  return (
    <section className="relative py-[var(--space-section)]" data-inspect="FrictionScan · simulazione">
      <Container>
        <Chapter
          n="04"
          label="Analisi"
          headline="Mostrateci dove perdete tempo."
          lead="Scegliete l’area che nella vostra settimana pesa di più. Il sistema esegue un’analisi simulata e propone il flusso che costruirebbe. I numeri sono di simulazione, non risultati misurati presso un cliente."
        />

        <Reveal delay={140}>
          <div className="glass-solid mt-[var(--space-block)]">
            {/* ---------------------------------------------------- choices */}
            <ul className="grid gap-px border-b border-rule bg-rule/70 sm:grid-cols-3 lg:grid-cols-5">
              {SCENARIOS.map((s) => {
                const on = picked?.k === s.k;
                return (
                  <li key={s.k} className="bg-surface/92">
                    <button
                      type="button"
                      onClick={() => choose(s)}
                      aria-pressed={on}
                      className={`group relative flex w-full items-center justify-between gap-3 px-5 py-5 text-left transition-colors duration-[var(--duration-fast)] ${
                        on ? 'bg-accent-soft text-accent' : 'text-ink-2 hover:bg-raised hover:text-ink'
                      }`}
                    >
                      <span className="text-[var(--text-small)] font-medium">{s.label}</span>
                      <span
                        aria-hidden
                        className={`telemetry transition-opacity ${on ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'}`}
                      >
                        →
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* ---------------------------------------------------- results */}
            {!picked ? (
              <div className="px-5 py-16 text-center sm:px-8">
                <p className="telemetry text-faint">In attesa di una selezione</p>
                <p className="mx-auto mt-5 max-w-[44ch] text-[var(--text-lead)] leading-snug text-muted">
                  Scegliete un’area qui sopra. L’analisi parte subito.
                </p>
              </div>
            ) : (
              <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
                {/* funnel */}
                <div className="border-b border-rule p-5 sm:p-8 lg:border-b-0 lg:border-r">
                  <p className="flex items-center gap-3 telemetry text-accent">
                    <span aria-hidden className={`block size-1.5 bg-accent ${phase === 'scanning' ? 'pulse' : ''}`} />
                    Analisi simulata · {picked.label}
                  </p>
                  <h3 className="headline mt-5 max-w-[22ch] text-[length:var(--text-display-s)] text-ink">
                    {picked.headline}
                  </h3>

                  <ol className="mt-8 flex flex-col gap-4">
                    {picked.funnel.map((f, i) => {
                      const on = i < rows;
                      return (
                        <li key={f.k} className={`transition-opacity duration-[var(--duration-base)] ${on ? 'opacity-100' : 'opacity-25'}`}>
                          <div className="flex items-baseline justify-between gap-4">
                            <span className="font-display text-[length:var(--text-display-s)] font-semibold tnum text-ink">
                              {on ? <Counter to={f.v} duration={700} /> : '—'}
                            </span>
                            <span className="text-right text-[var(--text-micro)] leading-snug text-muted">{f.k}</span>
                          </div>
                          <div aria-hidden className="mt-2 h-px w-full bg-rule">
                            <div
                              className="h-full bg-accent transition-[width] duration-[var(--duration-slow)] ease-[var(--ease-mech-out)]"
                              style={{ width: on ? `${(f.v / max) * 100}%` : '0%' }}
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>

                {/* the workflow assembling itself */}
                <div className="p-5 sm:p-8">
                  <p className="telemetry text-muted">Flusso che costruiremmo</p>
                  <ol className="mt-7 flex flex-col">
                    {picked.workflow.map((w, i) => {
                      const on = i < flow;
                      const last = i === picked.workflow.length - 1;
                      const human = w === 'Approvazione' || w === 'Decisione';
                      return (
                        <li key={w} className="relative flex items-start gap-4 pb-6 last:pb-0">
                          {!last && (
                            <span
                              aria-hidden
                              className={`absolute left-[3px] top-4 h-full w-px origin-top transition-transform duration-[var(--duration-base)] ${
                                on ? 'scale-y-100 bg-accent' : 'scale-y-0 bg-rule'
                              }`}
                            />
                          )}
                          <span
                            aria-hidden
                            className={`relative mt-1.5 block size-[7px] shrink-0 transition-colors duration-[var(--duration-base)] ${
                              on ? (human ? 'bg-amber' : 'bg-accent') : 'bg-rule'
                            }`}
                          />
                          <span
                            className={`text-[var(--text-small)] transition-colors duration-[var(--duration-base)] ${
                              on ? (human ? 'text-amber' : 'text-ink') : 'text-faint'
                            }`}
                          >
                            {w}
                            {human && on && <span className="ml-3 telemetry text-amber">umano</span>}
                          </span>
                        </li>
                      );
                    })}
                  </ol>

                  {phase === 'done' && (
                    <p className="settle mt-8 border-t border-rule pt-6 text-[var(--text-small)] leading-relaxed text-ink-2">
                      {picked.keeps}
                    </p>
                  )}
                </div>
              </div>
            )}

            <p className="border-t border-rule px-5 py-4 telemetry normal-case tracking-[0.08em] text-muted sm:px-8">
              Simulazione a scopo dimostrativo. I valori reali si misurano durante il rilievo, sui vostri dati.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
