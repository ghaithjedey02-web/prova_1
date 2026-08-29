import type { Hypothesis } from './types.js';

export interface SeedCompany {
  name: string; city: string; province: string; website: string;
  sub: string; services: string[]; notes: string; src: string;
}

/**
 * Builds the per-company hypothesis required by the research protocol.
 *
 * This is NOT a template with the company name substituted in. The output
 * differs by the company's actual declared service mix, because those signals
 * genuinely imply different operating realities:
 *
 *   - "prototipi / piccole serie"  → highest quote-to-revenue ratio in the sector
 *   - "grandi serie / automatica"  → reorders dominate; quoting matters less
 *   - many technologies declared   → quoting requires cross-department input
 *   - "su disegno"                 → every enquiry is bespoke by definition
 *   - multi-province coverage      → higher inbound volume from more sources
 *
 * A generic note ("AI could improve efficiency") is worse than no note: it
 * signals to the prospect that we did not look at them specifically, which is
 * exactly the accusation that kills cold outreach in this market.
 */
export function buildHypothesis(c: SeedCompany): Hypothesis {
  const text = `${c.sub} ${c.services.join(' ')} ${c.notes}`.toLowerCase();

  const isPrototype = /prototip|piccole serie|campion|su misura|su disegno/.test(text);
  const isHighVolume = /grandi serie|grande serie|automatica|minuteria/.test(text);
  const isMultiTech = c.services.length >= 4;
  const isLargePart = /tonnellate|grandi dimensioni|superleghe|ingranaggi/.test(text);
  const isMultiProvince = /(milano|brescia|bergamo|monza|varese|como|verona).*(e|,).*(milano|brescia|bergamo|monza|varese|como|verona)/.test(c.notes.toLowerCase());
  const isCarpentry = /carpenteria|lamiera|taglio laser|stampaggio/.test(text);
  const isHistoric = /\b(19[0-7]\d)\b|sessant|75 anni|65 anni|50 anni|storica/.test(c.notes.toLowerCase());

  // --- 2. Where the repetitive workflow probably sits ---
  let workflow: string;
  if (isPrototype) {
    workflow = 'Preventivazione su commessa: lavorando prototipi e piccole serie, ogni richiesta è quasi certamente un preventivo nuovo, senza possibilità di riusare un listino.';
  } else if (isHighVolume && !isPrototype) {
    workflow = 'Gestione riordini e revisione listini: con produzione di serie, il volume si concentra su ordini ricorrenti e aggiornamenti prezzo più che su preventivi nuovi.';
  } else if (isCarpentry) {
    workflow = 'Preventivazione da disegno cliente: nella carpenteria conto terzi la richiesta arriva tipicamente come disegno o file di taglio da valutare caso per caso.';
  } else {
    workflow = 'Preventivazione conto terzi: la richiesta di offerta arriva via email con allegati tecnici e va valutata manualmente.';
  }

  // --- 3. Why it is economically interesting ---
  const rationale: string[] = [];
  if (isLargePart) {
    rationale.push('Il valore unitario dei pezzi dichiarati è alto: una singola offerta persa o non evasa pesa molto più della media del settore.');
  }
  if (isMultiTech) {
    rationale.push(`Con ${c.services.length} tecnologie dichiarate, la preventivazione richiede probabilmente il coinvolgimento di più reparti, il che allunga i tempi di risposta.`);
  }
  if (isMultiProvince) {
    rationale.push('Il bacino commerciale dichiarato copre più province: il flusso di richieste in ingresso è verosimilmente superiore alla media locale.');
  }
  if (isPrototype) {
    rationale.push('Il rapporto preventivi/ordini è strutturalmente sfavorevole nel prototipale: si quota molto più di quanto si vende, quindi il costo del preventivo incide direttamente sul margine.');
  }
  if (isHistoric) {
    rationale.push('Azienda storica: la logica di prezzo è probabilmente conoscenza tacita di poche persone, con un rischio di continuità che è anche una leva di vendita.');
  }
  if (rationale.length === 0) {
    rationale.push('Il tempo di risposta a una richiesta di offerta incide direttamente sulla probabilità di acquisire l’ordine nel conto terzi.');
  }

  // --- 4. What we would propose ---
  const solution = isHighVolume && !isPrototype
    ? 'Automazione dell’inserimento ordini ricorrenti e dell’aggiornamento listini, con validazione umana prima della conferma.'
    : 'Preventivo Rapido: lettura automatica delle richieste in arrivo via email, estrazione dei dati tecnici e commerciali, recupero delle offerte storiche comparabili e generazione di una bozza di offerta che il preventivista approva prima dell’invio.';

  // --- 5. Evidence (only what a source actually said) ---
  const evidence: string[] = [`Descrizione pubblica: ${c.sub}.`];
  if (c.services.length) evidence.push(`Servizi dichiarati sul sito: ${c.services.join(', ')}.`);
  if (c.notes) evidence.push(c.notes);
  evidence.push(`Fonte: ${c.src}`);

  // --- 6. What must be verified before we assert anything ---
  const verify = [
    'Quante richieste di offerta ricevono a settimana, e attraverso quali canali.',
    'Chi prepara materialmente i preventivi e quanto tempo impiega per ciascuno.',
    'Quanto tempo passa mediamente fra l’arrivo della richiesta e l’invio dell’offerta.',
    'Se e dove viene conservato lo storico delle offerte, e se è consultabile.',
    'Quale gestionale/ERP usano e se espone un’interfaccia di integrazione.',
    'Se tracciano il tasso di acquisizione delle offerte.',
  ];
  if (isHighVolume) verify.push('Qual è la quota di fatturato da riordini rispetto a nuove richieste — determina se il caso d’uso giusto è il preventivo o l’ordine.');
  if (isMultiTech) verify.push('Se la preventivazione richiede il passaggio fra reparti diversi e dove si accumula l’attesa.');

  // --- 7 & 8 ---
  const whoToContact = 'Titolare o responsabile commerciale/ufficio tecnico. Da identificare: nessun nominativo verificato allo stato attuale.';

  const doNotClaim = [
    'NON affermare di sapere quanti preventivi fanno, quanto tempo impiegano o quanto personale hanno: non è verificato.',
    'NON affermare che hanno un problema. Abbiamo un’ipotesi basata sulla loro descrizione pubblica, non una constatazione.',
    'NON citare numeri di ROI specifici prima dell’Audit di Processo.',
    'NON menzionare Transizione 5.0 come se il progetto fosse automaticamente agevolabile.',
  ];
  if (c.website === 'Unknown') doNotClaim.push('NON affermare di aver visitato il loro sito: non è stato possibile aprirlo.');

  return {
    whatTheyDo: `${c.name} si presenta come ${c.sub.toLowerCase()}${c.city !== 'Unknown' ? ` con sede a ${c.city}` : ''}${c.province !== 'Unknown' ? ` (${c.province})` : ''}. Servizi dichiarati: ${c.services.join(', ') || 'non specificati'}.`,
    suspectedWorkflow: workflow,
    economicRationale: rationale.join(' '),
    proposedSolution: solution,
    supportingEvidence: evidence,
    toVerifyInDiscovery: verify,
    whoToContact,
    doNotClaim,
    // Never CONFIRMED: we have not spoken to them. The label is the honesty check.
    label: 'EVIDENCE-BASED HYPOTHESIS',
  };
}
