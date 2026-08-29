/**
 * "The Line" — one request travelling through the system.
 *
 * The concept has a job, not just a look: it is the product's architecture made
 * spatial. Station 4 is the reason the whole piece exists — the line physically
 * stops and waits for a person. Pausing an animation to wait for a human is the
 * most on-message thing this section can do.
 *
 * The same five stations drive all three fidelity tiers, so the story never
 * changes with the hardware — only its resolution does.
 */
export interface Station {
  k: string;
  t: string;
  d: string;
  kind: 'chaos' | 'order' | 'flag' | 'gate' | 'result';
}

export const stations: Station[] = [
  {
    k: '01',
    t: 'Arrivo',
    d: 'Una richiesta entra: testo libero, allegati, formati diversi ogni volta. Nessuna struttura.',
    kind: 'chaos',
  },
  {
    k: '02',
    t: 'Estrazione',
    d: 'I dati che contano vengono riconosciuti e messi in ordine: cliente, quantità, materiale, tempi.',
    kind: 'order',
  },
  {
    k: '03',
    t: 'Validazione',
    d: 'Il sistema dichiara di cosa non è sicuro. I campi sotto soglia vengono messi da parte, non indovinati.',
    kind: 'flag',
  },
  {
    k: '04',
    t: 'Controllo umano',
    d: 'Qui il processo si ferma. Una persona verifica, corregge e approva. Niente prosegue senza questo passaggio.',
    kind: 'gate',
  },
  {
    k: '05',
    t: 'Risultato',
    d: 'Un documento strutturato, pronto, con la motivazione di ogni valore proposto.',
    kind: 'result',
  },
];

/**
 * Maps 0..1 scroll progress onto the five stations, with a deliberate dwell at
 * the human-approval gate: the visitor should feel the pause, not scroll past it.
 */
export function stationFromProgress(p: number): { index: number; local: number } {
  // Segment weights — station 4 gets roughly double the scroll distance.
  const weights = [1, 1, 1, 1.9, 1];
  const total = weights.reduce((a, b) => a + b, 0);
  let acc = 0;
  for (let i = 0; i < weights.length; i++) {
    const w = weights[i]! / total;
    if (p < acc + w || i === weights.length - 1) {
      return { index: i, local: Math.min(1, Math.max(0, (p - acc) / w)) };
    }
    acc += w;
  }
  return { index: 0, local: 0 };
}
