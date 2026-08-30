/**
 * The six states of the DOLMIR system, and the scroll positions at which the
 * scene enters each one.
 *
 * The homepage is not a stack of sections with a background behind it: it is one
 * continuous machine that changes state as the visitor moves through it. These
 * are the states, shared by the WebGL scene, the 2D fallback and the readout in
 * the corner, so all three always say the same thing.
 */
export interface Stage {
  /** Page progress at which this stage begins. */
  at: number;
  code: string;
  label: string;
  /** Single line shown in the system readout. */
  note: string;
}

export const STAGES: readonly Stage[] = [
  { at: 0.00, code: 'SYS.INIT',   label: 'Sistema',      note: 'Nucleo attivo · in attesa di input' },
  { at: 0.13, code: 'INPUT',      label: 'Ingresso',     note: 'Frammenti in arrivo da canali non strutturati' },
  { at: 0.30, code: 'PARSE',      label: 'Comprensione', note: 'Classificazione ed estrazione in corso' },
  { at: 0.46, code: 'INFER',      label: 'Intelligenza', note: 'Confronto con lo storico · confidenza dichiarata' },
  { at: 0.62, code: 'EXEC',       label: 'Esecuzione',   note: 'Flusso in esecuzione sui sistemi collegati' },
  { at: 0.78, code: 'HOLD',       label: 'Controllo',    note: 'Processo sospeso · attesa di approvazione umana' },
  { at: 0.91, code: 'OUTPUT',     label: 'Risultato',    note: 'Documento strutturato · tracciabile' },
] as const;

/** Continuous 0..1 position inside the stage sequence, for the 3D scene. */
export function stagePosition(p: number): number {
  const n = STAGES.length - 1;
  for (let i = 0; i < n; i++) {
    const a = STAGES[i]!.at;
    const b = STAGES[i + 1]!.at;
    if (p < b) return i + (p - a) / (b - a);
  }
  return n;
}
