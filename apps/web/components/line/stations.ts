/**
 * The Line — one request travelling through the system.
 *
 * This is the product's architecture made spatial. Station 05 is the reason the
 * whole piece exists: the line physically stops and waits for a person. Pausing
 * a cinematic animation to wait for a human being is the most on-message thing
 * this site can do, and it is the moment everything else is built around.
 */
export type StationKind = 'arrive' | 'read' | 'extract' | 'decide' | 'gate' | 'result';

export interface Station {
  k: string;
  t: string;
  d: string;
  kind: StationKind;
}

export const stations: Station[] = [
  {
    k: '01',
    t: 'Arrivo',
    d: 'Una richiesta entra. Testo libero, allegati, un formato diverso ogni volta. Nessuna struttura.',
    kind: 'arrive',
  },
  {
    k: '02',
    t: 'Lettura',
    d: 'Mittente, oggetto, corpo, allegati. Il sistema riconosce di cosa si tratta prima di elaborare qualsiasi cosa.',
    kind: 'read',
  },
  {
    k: '03',
    t: 'Estrazione',
    d: 'Materiale, quantità, tolleranze, tempi. Ogni campo con la frase esatta del documento da cui viene.',
    kind: 'extract',
  },
  {
    k: '04',
    t: 'Decisione',
    d: 'Confidenza sotto soglia, nessun precedente comparabile, richiesta fuori capacità: il sistema dichiara cosa non sa.',
    kind: 'decide',
  },
  {
    k: '05',
    t: 'Controllo umano',
    d: 'Qui il processo si ferma e aspetta. Una persona verifica, corregge, approva. Niente prosegue senza questo passaggio.',
    kind: 'gate',
  },
  {
    k: '06',
    t: 'Risultato',
    d: 'Un documento strutturato, con la motivazione di ogni valore proposto e la traccia di chi ha approvato.',
    kind: 'result',
  },
];

/**
 * Maps 0..1 scroll progress onto the six stations, with a deliberate dwell at
 * the human gate: the visitor should feel the pause, not scroll past it.
 */
export function stationFromProgress(p: number): { index: number; local: number } {
  const weights = [1, 1, 1.1, 1.1, 2, 1.2];
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
