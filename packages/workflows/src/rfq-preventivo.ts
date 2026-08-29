import type { WorkflowDefinition } from './types.js';

/**
 * Configuration 01 — RFQ intake → preventivo, for Lombard machining shops.
 *
 * The samples deliberately include the awkward cases. A demonstration where
 * everything succeeds is not credible to someone who has watched software fail,
 * and the refusal case is the strongest trust moment we have.
 */
export const rfqPreventivo: WorkflowDefinition = {
  id: 'rfq-preventivo',
  name: 'Richiesta di offerta → preventivo',
  sector: 'Lavorazioni meccaniche conto terzi',
  summary:
    'Le richieste arrivano via email con allegati tecnici. Il sistema le legge, estrae i dati, recupera le offerte storiche comparabili e prepara una bozza — che una persona approva prima dell’invio.',

  stages: [
    { id: 'intake', label: 'Ricezione', description: 'L’email arriva nella casella commerciale insieme a tutto il resto.', kind: 'intake', durationMs: 420 },
    { id: 'classify', label: 'Classificazione', description: 'È una richiesta di offerta, un ordine, o altro? Filtro deterministico, nessun costo.', kind: 'machine', durationMs: 380 },
    { id: 'extract', label: 'Estrazione', description: 'Dati commerciali e tecnici estratti dal testo e dagli allegati, con un livello di confidenza per ogni campo.', kind: 'machine', durationMs: 900 },
    { id: 'validate', label: 'Validazione', description: 'I campi sotto la soglia di confidenza vengono messi da parte per una verifica umana.', kind: 'check', durationMs: 520 },
    { id: 'triage', label: 'Fattibilità', description: 'La richiesta rientra nella capacità dichiarata dell’officina? Quantità, materiale, trattamenti.', kind: 'check', durationMs: 480 },
    { id: 'history', label: 'Storico', description: 'Ricerca di offerte comparabili già fatte: stesso codice, stesso cliente, descrizione simile.', kind: 'machine', durationMs: 700 },
    { id: 'draft', label: 'Bozza', description: 'Preparazione dell’offerta in italiano, con la motivazione del prezzo proposto.', kind: 'machine', durationMs: 640 },
    { id: 'approval', label: 'Controllo umano', description: 'Il preventivista rivede, corregge e approva. Niente parte senza questo passaggio.', kind: 'human', durationMs: 0 },
  ],

  fields: [
    { key: 'customerCompany', label: 'Cliente', type: 'string', confidenceFloor: 0.7, critical: true },
    { key: 'contactName', label: 'Referente', type: 'string', confidenceFloor: 0.5 },
    { key: 'partDescription', label: 'Particolare', type: 'string', confidenceFloor: 0.6, critical: true },
    { key: 'partNumber', label: 'Codice', type: 'string', confidenceFloor: 0.75 },
    { key: 'quantity', label: 'Quantità', type: 'number', confidenceFloor: 0.8, critical: true },
    { key: 'material', label: 'Materiale', type: 'string', confidenceFloor: 0.75, critical: true },
    { key: 'tolerance', label: 'Tolleranze', type: 'string', confidenceFloor: 0.5 },
    { key: 'surfaceTreatment', label: 'Trattamento', type: 'string', confidenceFloor: 0.6 },
    { key: 'deliveryDeadline', label: 'Consegna', type: 'string', confidenceFloor: 0.5 },
    { key: 'drawingReference', label: 'Disegno', type: 'string', confidenceFloor: 0.6 },
  ],

  samples: [
    {
      id: 'RFQ-2026-0412',
      label: 'Richiesta completa, cliente storico',
      note: 'Il caso favorevole: dati completi e un’offerta comparabile nello storico.',
      demonstrates: 'clean',
      from: 'm.brambilla@tecnoflex-lecco.example',
      subject: 'Richiesta di offerta - flangia tornita cod. FL-2280',
      body: `Buongiorno,

Da: Tecnoflex Lecco S.r.l.

Vi chiediamo cortesemente un preventivo per la produzione del seguente particolare.

Descrizione: flangia tornita con foratura periferica
Codice: FL-2280
Quantita: 250
Materiale: acciaio C40
Tolleranze: H7 sui fori, +/- 0,05 mm sul diametro esterno
Trattamento: zincatura bianca

Consegna: entro il 30 ottobre 2026

In allegato il disegno aggiornato rev. C.

Restiamo in attesa di un Vostro riscontro.

Cordiali saluti,
Marco Brambilla
Ufficio Acquisti`,
      attachments: [
        { filename: 'DIS-FL-2280-revC.pdf', sizeBytes: 284000 },
        { filename: 'FL-2280.step', sizeBytes: 1840000 },
      ],
    },
    {
      id: 'RFQ-2026-0413',
      label: 'Particolare noto, cliente diverso',
      note: 'Trova un riferimento nello storico, ma di un altro cliente — e lo segnala.',
      demonstrates: 'cross-reference',
      from: 'acquisti@valvenord.example',
      subject: 'RdO - staffe in acciaio inox',
      body: `Spett.le Officina,

Da: Valve Nord S.p.A.

siamo interessati a ricevere quotazione per staffe di supporto in lamiera piegata.

Particolare: staffa di supporto piegata
Q.ta: 1200 pezzi
Materiale: inox AISI 304
Consegna: 6 settimane

Si tratta di una fornitura ricorrente, come da ordine precedente.

Grazie,
Laura Fontana`,
      attachments: [{ filename: 'staffa-SUP-118.dwg', sizeBytes: 512000 }],
    },
    {
      id: 'RFQ-2026-0414',
      label: 'Richiesta incompleta',
      note: 'Il caso importante: il sistema si ferma e dice cosa manca, invece di inventare.',
      demonstrates: 'refusal',
      from: 'info@microcomp.example',
      subject: 'preventivo urgente',
      body: `Salve,

ci servirebbe un preventivo per delle boccole.

Quantita: 4

Grazie
G. Rossi`,
      attachments: [],
    },
    {
      id: 'ORD-2026-0331',
      label: "Conferma d'ordine",
      note: 'Non è una richiesta di offerta. Viene instradata, non quotata.',
      demonstrates: 'not-applicable',
      from: 'ordini@tecnoflex-lecco.example',
      subject: "Conferma d'ordine n. 4471/2026",
      body: `Buongiorno,

Con la presente confermiamo l'ordine n. 4471/2026 relativo alla Vostra offerta OFF-2026-118.

Cordiali saluti,
Tecnoflex Lecco S.r.l.`,
      attachments: [{ filename: 'ODA-4471.pdf', sizeBytes: 92000 }],
    },
    {
      id: 'SPAM-2026-8891',
      label: 'Email commerciale',
      note: 'Filtrata prima di qualsiasi elaborazione, quindi a costo zero.',
      demonstrates: 'filtered',
      from: 'marketing@leadgen-pro.example',
      subject: 'Posizionamento sui motori di ricerca garantito per la tua azienda',
      body: `Ciao,

vuoi piu clienti? Il nostro servizio di posizionamento sui motori di ricerca ti garantisce la prima pagina.

Webinar gratuito giovedi.

Per disiscriverti clicca qui.`,
      attachments: [],
    },
  ],

  copy: {
    inputTitle: 'Email in arrivo',
    outputTitle: 'Bozza di offerta',
    approvalLabel: 'Approva e invia',
    approvalHint: 'Nessuna offerta lascia l’azienda senza questo passaggio.',
  },
};
