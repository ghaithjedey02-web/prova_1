/**
 * Every visible string on the site.
 *
 * It lives here and not inside components for two reasons: copy is what we
 * iterate on most and it should never require touching layout to change a
 * sentence, and a second language becomes a parallel object rather than a
 * rewrite.
 *
 * Voice rules, enforced in review:
 *  - Never "rivoluzionare", "potenza dell'AI", "soluzioni innovative",
 *    "portare nel futuro". If a sentence would fit any AI company, rewrite it.
 *  - Name the work, not the technology. The reader cares about preventivi and
 *    ore perse, not about models.
 *  - Never a number we have not measured or sourced. Sourced numbers carry
 *    their source in the text.
 *  - Every section must answer: perché dovrebbe interessarmi?
 */

export const site = {
  name: 'DOLMIR',
  domain: 'dolmir.com',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dolmir.com',
  tagline: 'Sistemi digitali e AI per le imprese',
  description:
    'DOLMIR costruisce sistemi digitali su misura: software, automazioni AI, integrazioni e interfacce che collegano il lavoro disperso di un’azienda in un processo unico — con una persona che approva.',
  locale: 'it_IT',
  email: 'info@dolmir.com',
  region: 'Lombardia',
} as const;

export const nav = [
  { href: '/soluzioni', label: 'Sistemi' },
  { href: '/#prova', label: 'Prova DOLMIR' },
  { href: '/dimostrazione', label: 'Caso reale' },
  { href: '/metodo', label: 'Metodo' },
  { href: '/studio', label: 'Studio' },
] as const;

/** The footer lists every page, including the ones the top bar leaves out. */
export const footerNav = [
  { href: '/soluzioni', label: 'Sistemi' },
  { href: '/dimostrazione', label: 'Caso reale' },
  { href: '/affidabilita', label: 'Affidabilità' },
  { href: '/metodo', label: 'Metodo' },
  { href: '/studio', label: 'Studio' },
] as const;

export const cta = {
  primary: { label: 'Parliamone', href: '/contatto' },
  secondary: { label: 'Vedi la dimostrazione', href: '/dimostrazione' },
} as const;

/* =========================================================== home === hero ===*/

export const hero = {
  sysId: 'SYS.ID 00482',
  eyebrow: 'AI · Software · Infrastruttura digitale',
  /* The awakening. Micro-signals appear across the whole viewport — the kinds
     of events a running DOLMIR system actually produces — a few wires draw
     between them, and the statement lands once the system is visibly alive.
     Positions are viewport percentages; `wire` marks the signals the hairlines
     connect, in order. */
  signals: [
    { x: 8,  y: 16, t: 'IN.EMAIL',   wire: 1 },
    { x: 26, y: 9,  t: 'NODE 04' },
    { x: 47, y: 14, t: 'CTX BUILD',  wire: 2 },
    { x: 68, y: 8,  t: 'SYNC OK' },
    { x: 88, y: 15, t: 'ERP LINK',   wire: 3 },
    { x: 90, y: 38, t: 'QUEUE 3' },
    { x: 76, y: 30, t: 'EXTRACT',    wire: 4 },
    { x: 89, y: 62, t: 'CONF 0.97',  wire: 5 },
    { x: 66, y: 74, t: 'ROUTE' },
    { x: 82, y: 86, t: 'HUMAN GATE', wire: 6 },
    { x: 12, y: 78, t: 'LAT 412MS' },
    { x: 30, y: 88, t: 'REC WRITE' },
    { x: 9,  y: 47, t: 'IN.PDF',     wire: 0 },
    { x: 55, y: 46, t: 'CORE',       wire: 7 },
  ] as readonly { x: number; y: number; t: string; wire?: number }[],
  line1: 'L’intelligenza',
  line2: 'che fa funzionare',
  line3: 'le aziende.',
  lead:
    'DOLMIR costruisce infrastruttura digitale intelligente: software su misura, AI che capisce email e documenti, integrazioni fra i sistemi che avete già. Un livello di intelligenza sopra la vostra azienda — con una persona che approva.',
  telemetry: [
    ['CANALI', '7 collegati'],
    ['LATENZA', '< 900 ms'],
    ['CONFIDENZA', 'dichiarata per campo'],
    ['DECISIONE', 'umana'],
  ] as const,
  scroll: 'Entra nel sistema',
} as const;

/* ==================================== home === the intelligence core ========*/

export const intelligence = {
  n: '01',
  label: 'Intelligenza',
  headline: 'Dentro il sistema che costruiamo.',
  body:
    'Questa non è un’illustrazione: è la forma di ogni sistema DOLMIR. Informazioni non strutturate entrano da sinistra, il nucleo le capisce, e a destra escono azioni pronte. In mezzo, sempre, una persona che decide.',
  /* What flows in and what comes out. Sector-agnostic on purpose: this is the
     shape of the system, not one vertical's version of it. */
  inputs: [
    { k: 'EMAIL',     d: 'richieste, ordini, allegati' },
    { k: 'DOCUMENTI', d: 'PDF, disegni, contratti' },
    { k: 'CRM',       d: 'clienti, trattative' },
    { k: 'ERP',       d: 'anagrafiche, commesse' },
    { k: 'ORDINI',    d: 'conferme, righe, eccezioni' },
    { k: 'RICHIESTE', d: 'dal sito, dal telefono' },
  ],
  outputs: [
    { k: 'PREVENTIVO',  d: 'bozza con motivazione' },
    { k: 'REPORT',      d: 'strutturato, tracciabile' },
    { k: 'TASK',        d: 'assegnato a chi decide' },
    { k: 'CRM',         d: 'aggiornato senza ricopiare' },
    { k: 'NOTIFICA',    d: 'solo quando serve' },
    { k: 'DECISIONE',   d: 'preparata per una persona' },
  ],
  /* The core's internal states, cycled while the section is on screen. The
     confidence figure is an example value and is labelled as such in the UI. */
  states: [
    'INPUT RILEVATO',
    'DOCUMENTO RICEVUTO',
    'ENTITÀ IDENTIFICATE',
    'CONTESTO COSTRUITO',
    'DATI ESTRATTI',
    'CONFIDENZA 97,4%',
    'WORKFLOW GENERATO',
    'REVISIONE UMANA RICHIESTA',
    'AZIONE PRONTA',
  ],
  disclaimer: 'Flusso dimostrativo con dati di esempio.',
} as const;

/* ==================================== home === what DOLMIR builds ===========*/

export const capabilities = {
  n: '03',
  label: 'Cosa costruiamo',
  headline: 'Sei famiglie di sistemi. Un’architettura.',
  body:
    'Ogni sistema che costruiamo è una combinazione di queste sei famiglie. Il contenuto cambia da azienda ad azienda — manifattura, logistica, distribuzione, servizi — l’architettura no.',
  items: [
    {
      k: 'automazione',
      label: 'Automazione',
      claim: 'Il lavoro ripetitivo diventa un flusso con un cancello umano.',
      builds: ['Automazione preventivi', 'Gestione ordini in ingresso', 'Instradamento richieste', 'Flussi di approvazione'],
      diagram: 'chain',
    },
    {
      k: 'ai',
      label: 'AI',
      claim: 'Documenti, email e testi diventano campi con evidenza e confidenza.',
      builds: ['Lettura documenti', 'Assistente email', 'Estrazione dati da PDF', 'Classificazione automatica'],
      diagram: 'extract',
    },
    {
      k: 'dati',
      label: 'Dati',
      claim: 'Informazioni che vivono in posti diversi diventano una fonte sola.',
      builds: ['Integrazione fra gestionali', 'Riconciliazione anagrafiche', 'Archivio cercabile per contenuto', 'Sincronizzazione CRM ↔ ERP'],
      diagram: 'merge',
    },
    {
      k: 'operazioni',
      label: 'Operazioni',
      claim: 'I processi interni prendono stati, code e responsabili espliciti.',
      builds: ['Cruscotti operativi', 'Code di lavorazione', 'Tracciamento pratiche', 'Indicatori di processo'],
      diagram: 'board',
    },
    {
      k: 'software',
      label: 'Software',
      claim: 'Applicazioni costruite sulla forma reale del vostro processo.',
      builds: ['Interfacce su misura', 'Portali clienti', 'Strumenti interni', 'Sistemi di conoscenza aziendale'],
      diagram: 'app',
    },
    {
      k: 'intelligenza',
      label: 'Intelligenza',
      claim: 'Un livello che ragiona sopra gli strumenti che avete già.',
      builds: ['Agenti con supervisione', 'Confronto con lo storico', 'Suggerimenti motivati', 'Analisi delle richieste'],
      diagram: 'layer',
    },
  ],
} as const;

/* ======================================== home === the simulator ============*/

export const simulator = {
  n: '07',
  label: 'Prova DOLMIR',
  headline: 'Consegnate un problema. Guardate cosa succede.',
  body:
    'Accesso temporaneo alla stessa architettura che installiamo: scegliete una situazione reale, avviatela e decidete voi, al cancello. Tutto gira nel vostro browser — nessuna chiamata esterna, nessun dato reale. Il motore vero è nel capitolo 05; qui vedete la stessa forma su sette casi.',
  /* The one word the whole frame keys on, per phase. */
  sysStates: {
    idle: 'IN ATTESA',
    running: ['SCANSIONE', 'SCANSIONE', 'ANALISI', 'ESTRAZIONE', 'VALIDAZIONE', 'CONNESSIONE', 'MISURAZIONE', 'DECISIONE'],
    gate: 'CANCELLO UMANO',
    approved: 'COMPLETATO',
    rejected: 'FERMATO',
  },
  /* The systems the run visibly touches, and when. */
  map: [
    { k: 'input',   label: 'INPUT',   at: [0, 1] },
    { k: 'core',    label: 'DOLMIR',  at: [2, 3, 6, 7] },
    { k: 'erp',     label: 'ERP',     at: [4, 5] },
    { k: 'crm',     label: 'CRM',     at: [5] },
    { k: 'archivio',label: 'ARCHIVIO',at: [5] },
    { k: 'persona', label: 'PERSONA', at: [] },
    { k: 'azione',  label: 'AZIONE',  at: [] },
  ],
  /* Where the manual version of this work leaks, illustrative and labelled. */
  bottleneck: [
    ['PASSAGGI', '7'],
    ['PERSONE', '2'],
    ['SISTEMI', '4'],
    ['PUNTI DI ERRORE', '3'],
  ],
  stages: [
    'INPUT RICEVUTO',
    'LETTURA',
    'COMPRENSIONE',
    'ESTRAZIONE',
    'VALIDAZIONE',
    'CONFRONTO',
    'CONFIDENZA',
    'DECISIONE',
  ],
  /* The same work, done by hand. Minutes are illustrative and labelled so. */
  manual: [
    { t: 'Apertura e lettura', m: 4 },
    { t: 'Ricerca dati nei sistemi', m: 6 },
    { t: 'Copia in Excel', m: 3 },
    { t: 'Inserimento nel gestionale', m: 5 },
    { t: 'Controllo incrociato', m: 4 },
    { t: 'Email interna di verifica', m: 3 },
    { t: 'Risposta', m: 3 },
  ],
  withDolmir: ['INPUT', 'SISTEMA', 'PERSONA CHE APPROVA', 'AZIONE'],
  /* The differentiator, stated as two chains rather than as an attack. */
  generic: ['DOMANDA', 'RISPOSTA'],
  dolmirChain: ['INPUT', 'COMPRENSIONE', 'DATI AZIENDALI', 'REGOLE', 'CONFIDENZA', 'PERSONA', 'AZIONE', 'REGISTRO'],
  differentiatorNote:
    'Un assistente generico genera risposte. DOLMIR collega l’intelligenza alle operazioni: ogni passaggio è verificato, tracciato, e si ferma davanti a una persona.',
  disclaimer: 'Simulazione con dati di esempio. I tempi indicati sono illustrativi, non misurati presso un cliente.',
  scenarios: [
    {
      k: 'manifattura',
      label: 'Manifattura',
      docKind: 'EMAIL',
      docTitle: 'Conferma d’ordine in arrivo',
      docMeta: ['DA · acquisti@cliente-a.example', 'OGGETTO · Conferma ordine 2026/184'],
      docLines: [
        'Buongiorno, confermiamo l’ordine come da vostra offerta:',
        '· 120 pz — supporto lavorato cod. SL-4410',
        '· 60 pz — piastra forata cod. PF-2205',
        '· 30 pz — boccola cod. BC-118',
        'Consegna richiesta: entro il 20 novembre 2026.',
      ],
      telemetry: [
        [0, 'canale: email · 1 messaggio'],
        [1, 'formato riconosciuto: conferma d’ordine'],
        [2, '3 entità trovate: cliente, offerta, consegna'],
        [3, '3 righe estratte · codici agganciati alle anagrafiche'],
        [4, 'unità e quantità coerenti con l’offerta'],
        [5, 'record trovato nel gestionale: offerta 2026/184'],
        [6, 'confidenza 96,8% · nessuna ambiguità'],
        [7, 'righe pronte per la scrittura · attesa persona'],
      ],
      fields: [
        { k: 'Cliente', v: 'Cliente A', conf: 0.99 },
        { k: 'Offerta di origine', v: '2026/184', conf: 0.98, src: 'vostra offerta' },
        { k: 'Righe ordine', v: '3 · SL-4410, PF-2205, BC-118', conf: 0.97, src: 'SL-4410' },
        { k: 'Consegna', v: '20-11-2026', conf: 0.95, src: '20 novembre 2026' },
      ],
      confidence: 96.8,
      gateTone: 'ready',
      gateNote: 'Tutto verificato. Le righe non vengono scritte nel gestionale finché una persona non approva.',
      actions: ['3 righe scritte nel gestionale', 'Conferma preparata per il cliente', 'Commessa collegata all’offerta 2026/184'],
      manualMinutes: 24,
    },
    {
      k: 'logistica',
      label: 'Logistica',
      docKind: 'PDF',
      docTitle: 'Richiesta di trasporto',
      docMeta: ['DOCUMENTO · richiesta_ritiro.pdf', 'PAGINE · 1'],
      docLines: [
        'Richiesta ritiro merce:',
        'Ritiro: Bergamo — magazzino 2, dalle 8:00 alle 12:00',
        'Consegna: Bologna Interporto, blocco 5.4',
        'Colli: 6 bancali EPAL · Peso: 2.840 kg',
        'Data richiesta: 4 settembre 2026.',
      ],
      telemetry: [
        [0, 'canale: PDF · 1 pagina'],
        [1, 'formato riconosciuto: richiesta di ritiro'],
        [2, '4 entità trovate: origine, destinazione, colli, data'],
        [3, '5 campi estratti con evidenza'],
        [4, 'peso e colli coerenti · finestra oraria valida'],
        [5, 'tratta trovata nello storico: BG → BO'],
        [6, 'confidenza 94,1% · nessuna ambiguità'],
        [7, 'ordine di trasporto preparato · attesa persona'],
      ],
      fields: [
        { k: 'Ritiro', v: 'Bergamo · mag. 2 · 8–12', conf: 0.96, src: 'Bergamo — magazzino 2' },
        { k: 'Consegna', v: 'Bologna Interporto 5.4', conf: 0.95, src: 'Bologna Interporto' },
        { k: 'Colli / peso', v: '6 EPAL · 2.840 kg', conf: 0.97, src: '6 bancali EPAL' },
        { k: 'Data', v: '04-09-2026', conf: 0.93, src: '4 settembre 2026' },
      ],
      confidence: 94.1,
      gateTone: 'ready',
      gateNote: 'Ordine di trasporto pronto, con la tratta proposta dallo storico. Parte solo dopo l’approvazione.',
      actions: ['Ordine di trasporto creato', 'Slot di ritiro proposto al vettore', 'Cliente aggiornato sullo stato'],
      manualMinutes: 19,
    },
    {
      k: 'distribuzione',
      label: 'Distribuzione',
      docKind: 'ORDINE',
      docTitle: 'Ordine cliente a listino',
      docMeta: ['CANALE · portale ordini', 'RIGHE · 12'],
      docLines: [
        'Ordine da rivenditore autorizzato:',
        '12 righe a listino, sconto contrattuale 8%.',
        'Richiesta consegna unica entro fine mese.',
        'Note: urgente per 2 referenze.',
      ],
      telemetry: [
        [0, 'canale: portale · ordine strutturato'],
        [1, 'listino identificato: rivenditori 2026'],
        [2, '12 righe riconosciute · sconto contrattuale 8%'],
        [3, '12 righe estratte · 12 codici validati'],
        [4, 'prezzi coerenti con il listino'],
        [5, 'giacenze verificate: 2 righe sotto scorta', 'amber'],
        [6, 'confidenza 88,3% · 2 avvisi da rivedere', 'amber'],
        [7, 'proposta pronta con avvisi in evidenza · attesa persona'],
      ],
      fields: [
        { k: 'Righe ordine', v: '12 · tutte a listino', conf: 0.97, src: '12 righe a listino' },
        { k: 'Sconto', v: '8% contrattuale', conf: 0.98, src: 'sconto contrattuale 8%' },
        { k: 'Disponibilità', v: '10 righe pronte', conf: 0.99 },
        { k: 'Sotto scorta', v: '2 righe · riordino 6 gg', conf: 0.91, state: 'warn' },
      ],
      confidence: 88.3,
      gateTone: 'attention',
      gateNote: 'Due righe sono sotto scorta: il sistema propone consegna parziale o slittamento, ma la scelta è vostra.',
      modify: {
        label: 'Come gestire le 2 righe sotto scorta?',
        options: [
          { k: 'parziale', label: 'Consegna parziale subito', conf: 96.1, note: 'Dieci righe partono ora; le due mancanti seguono al riordino. Il cliente riceve entrambe le date.', tone: 'ready' },
          { k: 'slittamento', label: 'Consegna unica, slittata', conf: 94.8, note: 'Tutte le righe partono insieme fra 6 giorni. La conferma indica la nuova data unica.', tone: 'ready' },
        ],
      },
      actions: ['Ordine confermato per 10 righe', 'Proposta al cliente per le 2 righe mancanti', 'Riordino suggerito a magazzino'],
      manualMinutes: 28,
    },
    {
      k: 'vendite',
      label: 'Vendite',
      docKind: 'RICHIESTA',
      docTitle: 'Richiesta commerciale dal sito',
      docMeta: ['CANALE · modulo sito', 'CAMPI · 4 compilati'],
      docLines: [
        '«Stiamo valutando un sistema per gestire le richieste',
        'dei clienti che oggi trattiamo via email. Vorremmo',
        'capire tempi e modalità. Possibilmente entro l’autunno.»',
        'Azienda: — · Budget: non indicato',
      ],
      telemetry: [
        [0, 'canale: sito · modulo contatto'],
        [1, 'testo libero · 42 parole'],
        [2, '2 entità trovate: esigenza, orizzonte temporale'],
        [3, '3 campi estratti · 2 campi assenti', 'amber'],
        [4, 'azienda non identificabile dal testo', 'amber'],
        [5, 'nessuna trattativa precedente nel CRM'],
        [6, 'confidenza 71,2% · ambiguità rilevata', 'amber'],
        [7, 'bozza preparata con campi da completare · serve una persona', 'amber'],
      ],
      fields: [
        { k: 'Esigenza', v: 'gestione richieste email', conf: 0.9, src: 'gestire le richieste' },
        { k: 'Orizzonte', v: 'entro l’autunno', conf: 0.82, src: 'entro l’autunno' },
        { k: 'Azienda', v: 'NON DETERMINATO', conf: 0.31, state: 'missing', src: 'Azienda: —' },
        { k: 'Budget', v: 'NON DETERMINATO', conf: 0.22, state: 'missing', src: 'Budget: non indicato' },
      ],
      confidence: 71.2,
      gateTone: 'complete',
      gateNote: 'Sotto soglia: il sistema non inventa l’azienda né il budget. Prepara la bozza e passa la mano, indicando cosa manca.',
      actions: ['Task CRM creato con i campi mancanti', 'Bozza di risposta pronta da completare', 'Richiesta instradata al commerciale'],
      manualMinutes: 14,
    },
    {
      k: 'amministrazione',
      label: 'Amministrazione',
      docKind: 'FATTURA',
      docTitle: 'Fattura fornitore in ingresso',
      docMeta: ['DOCUMENTO · fattura 771/2026', 'FORMATO · PDF'],
      docLines: [
        'Fattura n. 771/2026',
        'Imponibile: € 4.320,00 · IVA 22%: € 950,40',
        'Totale: € 5.270,40 · Scadenza: 30 gg d.f.',
        'Riferimento: vostro ordine 2026/091.',
      ],
      telemetry: [
        [0, 'canale: PEC · 1 allegato'],
        [1, 'formato riconosciuto: fattura fornitore'],
        [2, '4 entità trovate: numero, importi, scadenza, ordine'],
        [3, '5 campi estratti con evidenza'],
        [4, 'partita IVA e totali verificati'],
        [5, 'ordine 2026/091 trovato · scostamento +2,4%', 'amber'],
        [6, 'confidenza 90,6% · 1 scostamento da approvare', 'amber'],
        [7, 'registrazione preparata con nota · attesa persona'],
      ],
      fields: [
        { k: 'Numero', v: '771/2026', conf: 0.99, src: '771/2026' },
        { k: 'Totale', v: '€ 5.270,40', conf: 0.98, src: '€ 5.270,40' },
        { k: 'Scadenza', v: '30 gg d.f.', conf: 0.96, src: '30 gg d.f.' },
        { k: 'Vs ordine', v: '2026/091 · +2,4%', conf: 0.94, state: 'warn', src: 'ordine 2026/091' },
      ],
      confidence: 90.6,
      gateTone: 'attention',
      gateNote: 'La fattura supera l’ordine del 2,4%. Il sistema lo dice prima della registrazione, non dopo.',
      actions: ['Registrazione preparata con lo scostamento in nota', 'Scadenza inserita nello scadenzario', 'Richiesta di verifica al referente acquisti'],
      manualMinutes: 16,
    },
    {
      k: 'conflitti',
      label: 'Caso difficile',
      docKind: 'ORDINE',
      docTitle: 'Ordine con conflitti',
      docMeta: ['CANALE · email + allegato', 'RIGHE · 4'],
      docLines: [
        'Ordine da «Meccanica Rossi» — in anagrafica esiste',
        'solo «Officine Rossi S.r.l.». Righe:',
        '· 80 pz cod. SL-441 (esistono SL-4410 e SL-4415)',
        '· 40 pz PF-2205 — ma l’allegato ne indica 60',
        'Consegna richiesta: 12 settembre. Capacità: dal 19.',
      ],
      telemetry: [
        [0, 'canale: email · 1 allegato'],
        [1, 'formato riconosciuto: ordine'],
        [2, 'cliente «Meccanica Rossi»: 1 corrispondenza parziale', 'amber'],
        [3, 'cod. SL-441: AMBIGUITÀ · 2 candidati', 'amber'],
        [4, 'quantità PF-2205: CONTRADDIZIONE email ↔ allegato', 'amber'],
        [5, 'consegna 12/09: in conflitto con la capacità (dal 19)', 'amber'],
        [6, 'confidenza 58,4% · sotto soglia', 'amber'],
        [7, 'il sistema non indovina · 4 punti da decidere', 'amber'],
      ],
      fields: [
        { k: 'Cliente', v: '«Meccanica Rossi» ≈ Officine Rossi S.r.l.', conf: 0.55, state: 'warn', src: '«Meccanica Rossi»' },
        { k: 'Codice', v: 'SL-441 · AMBIGUO (SL-4410 / SL-4415)', conf: 0.5, state: 'conflict', src: 'SL-441 ' },
        { k: 'Quantità PF-2205', v: '40 ↔ 60 · CONTRADDIZIONE', conf: 0.44, state: 'conflict', src: 'l’allegato ne indica 60' },
        { k: 'Consegna', v: '12/09 · NON COMPATIBILE', conf: 0.38, state: 'conflict', src: '12 settembre' },
      ],
      confidence: 58.4,
      gateTone: 'blocked',
      gateNote: 'DOLMIR non indovina. Quattro punti sono ambigui o contraddittori: il sistema li elenca con l’evidenza e chiede una decisione — oppure prepara le domande da fare al cliente.',
      actions: ['Richiesta di conferma preparata per il cliente, un punto per riga', 'Bozza d’ordine sospesa, non scritta nel gestionale', 'Pratica assegnata con l’evidenza allegata'],
      manualMinutes: 35,
      modify: {
        label: 'Risolvete un punto: quale codice intendeva il cliente?',
        options: [
          { k: 'sl4410', label: 'SL-4410 · supporto lavorato', conf: 71.9, note: 'Un’ambiguità risolta. Restano la quantità contraddittoria e la data non compatibile: la richiesta di conferma ora contiene 3 punti, non 4.', tone: 'attention' },
          { k: 'sl4415', label: 'SL-4415 · supporto rinforzato', conf: 71.2, note: 'Un’ambiguità risolta. Restano la quantità contraddittoria e la data non compatibile: la richiesta di conferma ora contiene 3 punti, non 4.', tone: 'attention' },
        ],
      },
    },
    {
      k: 'servizi',
      label: 'Servizi',
      docKind: 'PRATICA',
      docTitle: 'Richiesta di intervento',
      docMeta: ['CANALE · email cliente', 'CONTRATTO · attivo'],
      docLines: [
        '«Dalla scorsa notte il sistema di etichettatura della',
        'linea 2 si blocca a intermittenza. Riusciamo a lavorare',
        'ma a capacità ridotta. Potete intervenire?»',
      ],
      telemetry: [
        [0, 'canale: email · cliente con contratto'],
        [1, 'testo libero · segnalazione tecnica'],
        [2, '3 entità trovate: impianto, sintomo, urgenza'],
        [3, '4 campi estratti · impianto agganciato al contratto'],
        [4, 'copertura contrattuale verificata'],
        [5, '2 interventi simili trovati nello storico'],
        [6, 'confidenza 95,5% · priorità alta proposta'],
        [7, 'ticket instradato con SLA · attesa persona'],
      ],
      fields: [
        { k: 'Impianto', v: 'etichettatura · linea 2', conf: 0.97, src: 'etichettatura' },
        { k: 'Sintomo', v: 'blocco intermittente', conf: 0.95, src: 'si blocca a intermittenza' },
        { k: 'Urgenza', v: 'alta · capacità ridotta', conf: 0.93, src: 'capacità ridotta' },
        { k: 'Contratto', v: 'attivo · SLA 8h', conf: 0.99 },
      ],
      confidence: 95.5,
      gateTone: 'ready',
      gateNote: 'Ticket pronto, con priorità e storico allegati. L’assegnazione al tecnico resta una scelta umana.',
      actions: ['Ticket creato con SLA 8h', 'Storico interventi allegato', 'Cliente informato della presa in carico'],
      manualMinutes: 12,
    },
  ],
} as const;

/* ================================================== home === the story ========*/

export const chapters = {
  automation: {
    n: '06',
    label: 'Automazione',
    headline: 'Il flusso, dall’ingresso alla firma.',
    body:
      'Ogni processo che costruiamo ha la stessa forma: entra qualcosa, il sistema lo capisce, verifica di poterlo trattare, prepara il risultato e si ferma davanti a una persona. Quello che cambia da azienda ad azienda è il contenuto, non l’architettura.',
  },

  software: {
    n: '08',
    label: 'Software',
    headline: 'Non solo automazioni. Interfacce.',
    body:
      'Quando un processo diventa sistema serve anche un posto dove guardarlo. Costruiamo l’applicazione: elenchi, ricerca, stati, approvazioni, documenti collegati, indicatori. Su misura del vostro processo, non un gestionale generico da adattare.',
    app: {
      title: 'DOLMIR · Operativo',
      nav: ['Panoramica', 'Richieste', 'Documenti', 'Clienti', 'Flussi', 'Impostazioni'],
      stats: [
        { k: 'In coda', v: 12, tone: 'ink' },
        { k: 'Elaborate oggi', v: 47, tone: 'accent' },
        { k: 'In attesa di persona', v: 3, tone: 'amber' },
        { k: 'Completate', v: 219, tone: 'good' },
      ],
      rows: [
        { id: 'RIC-4471', c: 'Cliente A', s: 'Bozza pronta', tone: 'good', conf: 0.94, t: '08:41' },
        { id: 'RIC-4472', c: 'Cliente B', s: 'Campi da verificare', tone: 'amber', conf: 0.61, t: '08:44' },
        { id: 'RIC-4473', c: 'Cliente C', s: 'Serve stima tecnica', tone: 'amber', conf: 0.22, t: '08:52' },
        { id: 'RIC-4474', c: 'Cliente D', s: 'Instradata', tone: 'neutral', conf: 0.88, t: '09:03' },
        { id: 'RIC-4475', c: 'Cliente E', s: 'Bozza pronta', tone: 'good', conf: 0.91, t: '09:11' },
      ],
      disclaimer: 'Interfaccia dimostrativa con dati di esempio.',
    },
  },

  human: {
    n: '09',
    label: 'Controllo',
    headline: 'Il sistema si ferma prima di decidere.',
    body:
      'È la parte che ci interessa di più. Un modello linguistico ha sempre una risposta fluente disponibile: il comportamento “non lo so” va costruito contro il modello, con soglie, evidenze e cancelli espliciti. Quando la confidenza non basta, il processo si interrompe e passa a una persona.',
    chain: [
      { k: 'NON SO', d: 'Nessun precedente comparabile, un campo sotto soglia, un documento illeggibile.' },
      { k: 'FERMA', d: 'Non viene prodotto un valore plausibile. Non viene prodotto niente.' },
      { k: 'PERSONA', d: 'La pratica viene assegnata con indicato cosa manca e perché.' },
      { k: 'DECIDE', d: 'Una persona completa, corregge e approva. Poi il flusso riprende.' },
    ],
    quote: 'REQUIRES_TECHNICAL_ESTIMATE',
    quoteNote:
      'È una riga vera del motore che gira su questo sito. Quando compare, il sistema ha deciso di non rispondere. Non è un guasto: è la funzione più importante che abbiamo scritto.',
  },
} as const;




/* ====================================================== home === closing ======*/

export const closing = {
  label: 'Il passo successivo',
  headline: 'Il prossimo sistema potrebbe essere il vostro.',
  body:
    'Venticinque minuti, sei domande sul vostro processo, nessuna presentazione. Alla fine sapremo entrambi se ha senso continuare — e se non ha senso, lo diremo noi.',
  bring: [
    'Quante richieste ricevete in una settimana',
    'Chi prepara le offerte, e quanto tempo serve',
    'Quanto passa fra la richiesta e la risposta',
    'Dove si ferma il processo, oggi',
  ],
} as const;

/* ================================================= page === soluzioni =========*/

export const soluzioni = {
  title: 'Sistemi',
  headline: 'Sette processi, non sette servizi.',
  lead:
    'Non vendiamo “siti”, “AI” e “automazione” come voci separate di un listino. Ogni voce qui sotto è un processo aziendale che esiste già nella vostra azienda e che oggi costa ore. Si parte da uno.',
  items: [
    {
      k: '01',
      t: 'Presenza digitale industriale',
      lead: 'La porta d’ingresso che qualifica l’azienda in trenta secondi.',
      d: 'Capacità produttive, macchine, materiali, tolleranze, settori serviti, documentazione tecnica. Costruita perché un ufficio acquisti capisca se siete il fornitore giusto senza dovervi telefonare.',
      out: 'Sito tecnico, ingresso richieste strutturato, documenti scaricabili.',
    },
    {
      k: '02',
      t: 'Preventivi e richieste di offerta',
      lead: 'Il processo che abbiamo costruito per primo, e quello che conosciamo meglio.',
      d: 'Le richieste in entrata vengono lette, classificate, estratte campo per campo con un livello di confidenza, confrontate con lo storico e trasformate in una bozza. Quando i dati non bastano, il sistema si ferma.',
      out: 'Bozza di offerta, coda di verifica, tracciabilità completa.',
    },
    {
      k: '03',
      t: 'Ufficio AI',
      lead: 'La casella condivisa che si organizza da sola.',
      d: 'Classificazione e instradamento di tutto ciò che arriva: richieste, ordini, documenti, comunicazioni. Con priorità dichiarata e un elenco di cose da decidere invece di una lista di email da aprire.',
      out: 'Posta smistata, priorità, notifiche solo quando servono.',
    },
    {
      k: '04',
      t: 'Intelligenza documentale',
      lead: 'I documenti tecnici smettono di essere allegati.',
      d: 'Ordini, conferme, certificati materiale, schede tecniche, capitolati: letti, collegati alla commessa giusta e resi cercabili. Con il riferimento esatto da cui ogni dato è stato estratto.',
      out: 'Archivio collegato alle commesse, ricerca sui contenuti.',
    },
    {
      k: '05',
      t: 'Automazione dei flussi',
      lead: 'I passaggi meccanici fra un sistema e l’altro.',
      d: 'Il tratto che oggi qualcuno copre a mano: dal messaggio al gestionale, dal gestionale al documento, dal documento alla notifica. Costruito sopra quello che avete già, non al posto suo.',
      out: 'Integrazioni con il gestionale esistente, registro delle operazioni.',
    },
    {
      k: '06',
      t: 'Visibilità sulla gestione',
      lead: 'I numeri che prima non esistevano.',
      d: 'Volume delle richieste, tempo di risposta, offerte aperte, conversione, colli di bottiglia. Misurati dal processo stesso, non ricostruiti a posteriori con un foglio Excel.',
      out: 'Indicatori aggiornati, storico, esportazione.',
    },
    {
      k: '07',
      t: 'Integrazioni',
      lead: 'Il gestionale resta dov’è.',
      d: 'Ci colleghiamo a quello che usate. Se un sistema non è integrabile in modo affidabile, lo diciamo prima di firmare invece di scoprirlo in corso d’opera.',
      out: 'Connettori, esportazioni, o inserimento assistito dove non c’è API.',
    },
  ],
  note:
    'Un processo alla volta. Il secondo si affronta quando il primo è in produzione e misurato.',
} as const;

/* ================================================ page === affidabilità =======*/

export const affidabilita = {
  title: 'Affidabilità',
  headline: 'Cosa succede quando il sistema non sa.',
  lead:
    'Ogni fornitore di AI vi mostrerà cosa succede quando funziona. Questa pagina mostra l’altro caso, che è quello che decide se uno strumento resta in uso o viene abbandonato.',
  chain: [
    { k: 'NON SO', t: 'Il sistema riconosce il limite', d: 'Nessun precedente comparabile, un campo sotto soglia, un documento illeggibile.' },
    { k: 'FERMA', t: 'Il processo si interrompe', d: 'Non viene prodotto un valore plausibile. Non viene prodotto niente.' },
    { k: 'PERSONA', t: 'La pratica viene assegnata', d: 'Con indicato cosa manca e perché, non con un messaggio di errore generico.' },
    { k: 'DECIDE', t: 'La decisione torna umana', d: 'Il preventivista completa, corregge, approva. Il sistema impara il caso, non lo dimentica.' },
  ],
  principle: {
    headline: 'DOLMIR non costruisce certezze tecniche che non ha.',
    body:
      'Un modello linguistico non ha un modo nativo di dire “non lo so”: la risposta più fluente è sempre disponibile. Quel comportamento va costruito contro il modello, con soglie, evidenze e cancelli espliciti. È la parte del lavoro che nessuno vede in una demo e che determina tutto il resto.',
  },
  guarantees: {
    label: 'Quello che non facciamo',
    headline: 'I limiti, dichiarati prima di firmare.',
    body:
      'Un fornitore che dice di poter fare tutto è un fornitore di cui diffidare. Questi limiti sono nel contratto, non in una nota a piè di pagina.',
    items: [
      { t: 'Non decidiamo i prezzi al posto vostro', d: 'Il sistema propone una base motivata. La decisione commerciale resta vostra.' },
      { t: 'Non leggiamo i disegni per calcolare i tempi macchina', d: 'È un problema difficile e non lo promettiamo. Automatizziamo la parte che si può automatizzare bene.' },
      { t: 'Non inviamo niente ai vostri clienti', d: 'Il sistema prepara una bozza. L’invio resta un gesto umano.' },
      { t: 'Non sostituiamo il vostro gestionale', d: 'Ci integriamo con quello che avete. Se non è integrabile, lo diciamo prima.' },
      { t: 'Non usiamo i vostri dati per altro', d: 'I disegni dei vostri clienti sono proprietà intellettuale dei vostri clienti. Non addestriamo nulla, non li condividiamo, non li riutilizziamo.' },
      { t: 'Non promettiamo agevolazioni fiscali', d: 'Un progetto software di norma non accede da solo agli incentivi sui beni strumentali. Chi ve lo promette non ha letto i requisiti.' },
    ],
  },
  security: {
    label: 'Dati e sicurezza',
    headline: 'Principi, non certificazioni che non abbiamo.',
    body:
      'DOLMIR è una realtà giovane e non dichiara certificazioni che non possiede. Dichiara come lavora con i dati, e lo mette per iscritto nel contratto.',
    items: [
      { t: 'Minimizzazione', d: 'Trattiamo solo i dati necessari al processo concordato. Nessuna raccolta preventiva “nel caso servisse”.' },
      { t: 'Isolamento per cliente', d: 'Logica di prezzo e storico offerte di un’azienda non vengono mai messi in comune con altri clienti.' },
      { t: 'Fornitori dichiarati', d: 'Ogni fornitore tecnologico coinvolto è nominato nel contratto come responsabile del trattamento, con diritto di obiezione.' },
      { t: 'Residenza dei dati', d: 'L’architettura consente elaborazione in area europea e, dove necessario, esecuzione su infrastruttura del cliente.' },
      { t: 'Supervisione umana', d: 'Nessuna decisione automatica sul cliente finale. Questo tiene il sistema fuori dalle categorie ad alto rischio del regolamento europeo sull’AI.' },
      { t: 'Registro delle operazioni', d: 'Ogni elaborazione è tracciata e verificabile a posteriori.' },
    ],
  },
} as const;

/* ==================================================== page === metodo =========*/

export const metodo = {
  title: 'Metodo',
  headline: 'Dal primo incontro al sistema in produzione.',
  lead:
    'Un progetto AI fallisce quasi sempre allo stesso modo: si sceglie la tecnologia prima di aver capito il processo. Il metodo è costruito per rendere quell’errore difficile da commettere.',
  phases: [
    { k: '01', t: 'Osservare', d: 'Una conversazione diagnostica di venticinque minuti. Sei domande sul processo, nessuna presentazione. Alla fine sappiamo entrambi se ha senso continuare.', out: 'Una valutazione onesta, anche negativa.' },
    { k: '02', t: 'Mappare', d: 'Ricostruiamo il processo com’è oggi: chi fa cosa, con quali strumenti, dove si ferma. Interviste brevi con chi lo esegue davvero, non con chi lo racconta.', out: 'Il processo attuale, documentato.' },
    { k: '03', t: 'Misurare', d: 'Analizziamo casi reali recenti — volume, tempi, canali, esiti. È il passaggio che trasforma le impressioni in numeri.', out: 'La linea di partenza, sui vostri dati.' },
    { k: '04', t: 'Progettare', d: 'Definiamo cosa viene automatizzato, cosa resta umano e quali controlli servono. Il perimetro viene scritto: cosa è incluso e soprattutto cosa non lo è.', out: 'Specifica tecnica e proposta a prezzo fisso.' },
    { k: '05', t: 'Validare', d: 'Prima dell’implementazione completa verifichiamo l’accuratezza sui vostri documenti storici. Se non raggiunge la soglia concordata, non si procede.', out: 'Accuratezza misurata, non dichiarata.' },
    { k: '06', t: 'Implementare', d: 'Costruzione, integrazione con i sistemi esistenti, formazione delle persone che lo useranno, trenta giorni di assistenza rafforzata.', out: 'Sistema in produzione.' },
    { k: '07', t: 'Migliorare', d: 'L’accuratezza si degrada quando cambiano i documenti in ingresso o i mercati. Revisione periodica e taratura continua.', out: 'Accuratezza mantenuta nel tempo.' },
  ],
  engagement: {
    label: 'Impegno',
    headline: 'Si comincia da una cosa piccola.',
    body:
      'Il primo passo è un rilievo di processo a prezzo fisso, concordato prima di iniziare e interamente scomputato se si prosegue con l’implementazione. Serve a produrre i numeri su cui decidere — compreso, se è il caso, il numero che dice di non procedere.',
    note: 'Il costo di un’implementazione dipende dal perimetro e viene definito alla fine del rilievo, mai prima.',
  },
  handover: {
    label: 'Consegna',
    headline: 'Quello che resta a voi.',
    items: [
      { t: 'Il codice', d: 'Il repository è vostro. Un altro sviluppatore deve poter riprendere il lavoro senza di noi.' },
      { t: 'La documentazione', d: 'Come funziona, dove si tocca, cosa succede quando qualcosa cambia.' },
      { t: 'La misurazione', d: 'Gli indicatori restano accesi, così potete verificare il risultato senza doverci credere sulla parola.' },
    ],
  },
} as const;

/* ==================================================== page === studio =========*/

export const studio = {
  title: 'Studio',
  headline: 'Perché DOLMIR esiste.',
  lead:
    'Le aziende manifatturiere italiane non hanno un problema di entusiasmo verso l’intelligenza artificiale. Hanno un problema di competenze interne per applicarla a qualcosa che conti davvero.',
  sections: [
    {
      t: 'Il divario reale',
      body: [
        'Secondo Istat, nel 2025 il 15,7% delle PMI italiane utilizzava almeno una tecnologia di intelligenza artificiale, contro il 7,7% dell’anno precedente. Il Nord-Ovest guida con il 19,3%.',
        'L’ostacolo dichiarato più di frequente non è il costo e non è la diffidenza: è la mancanza di competenze interne, indicata dal 58,6% delle imprese. Non serve convincere nessuno del valore. Serve qualcuno che faccia il lavoro.',
      ],
    },
    {
      t: 'Cosa abbiamo osservato',
      body: [
        'La maggior parte dei progetti AI nelle PMI parte dallo strumento e cerca un problema da risolvere. È il verso sbagliato, e produce automazioni che funzionano in demo e che nessuno usa dopo tre settimane.',
        'I processi che valgono hanno tre caratteristiche: si ripetono con alta frequenza, occupano persone qualificate, e hanno un costo visibile quando vanno male. Sono meno affascinanti di un assistente conversazionale. Sono anche gli unici che ripagano.',
      ],
    },
    {
      t: 'In cosa crediamo',
      body: [
        'Che un sistema che dice “non lo so” valga più di uno che ha sempre una risposta. Che il perimetro scritto prima valga più di una promessa ampia. Che il cliente debba poter licenziare il fornitore senza perdere il sistema.',
        'Preferiamo dire di no a un progetto che non regge piuttosto che venderlo e consegnarlo male. In un settore dove le aziende si conoscono tutte, è anche la scelta commercialmente più sensata.',
      ],
    },
    {
      t: 'Dove lavoriamo',
      body: [
        'Lombardia, e in particolare l’area fra Brescia, Bergamo, Lecco, Varese, Monza-Brianza e Milano. È il distretto meccatronico più denso d’Europa: 33.800 unità locali e 460.000 addetti, secondo Assolombarda.',
        'Ci concentriamo su aziende fra i 10 e gli 80 addetti, dove chi sente il problema e chi decide sono la stessa persona.',
      ],
    },
  ],
  refuse: {
    label: 'Cosa rifiutiamo',
    items: [
      'Progetti dove non ci lasciano misurare il processo prima.',
      'Automazioni senza un passaggio di approvazione umana.',
      'Promesse di percentuali di risparmio prima del rilievo.',
      'Lock-in tecnico usato come strumento commerciale.',
      'Riuso dei dati di un cliente per servirne un altro.',
    ],
  },
  honesty: {
    t: 'Una nota di trasparenza',
    body:
      'DOLMIR è una realtà nuova. Non pubblichiamo loghi di clienti, testimonianze o casi studio perché non ne abbiamo ancora, e inventarli sarebbe il modo più rapido per perdere la sola cosa che conta in questo mestiere. Quello che potete valutare adesso è il metodo, la dimostrazione che gira davvero su questo sito, e la conversazione.',
  },
} as const;

/* ================================================== page === contatto =========*/

export const contatto = {
  title: 'Contatto',
  headline: 'Cosa volete far funzionare meglio?',
  lead:
    'La prima conversazione è diagnostica, non commerciale. Venticinque minuti sul processo che vi costa di più. Alla fine sapremo entrambi se ha senso continuare — e se non ha senso, lo diremo.',
  what: [
    'Cosa entra ogni giorno, e da quali canali',
    'Chi lo lavora oggi, e quanto tempo serve',
    'Quali sistemi dovrebbero parlarsi e non si parlano',
    'Dove si ferma il processo, e cosa costa quando si ferma',
  ],
  /* The intake: the form opens by asking what should work better, the way a
     system asks for its input before its parameters. */
  areas: [
    { k: 'processo',    label: 'Un processo',           d: 'Richieste, ordini, preventivi, pratiche: qualcosa che entra e va lavorato.' },
    { k: 'documenti',   label: 'Email e documenti',      d: 'Caselle condivise, PDF, allegati che qualcuno oggi legge e ricopia.' },
    { k: 'dati',        label: 'Dati e integrazioni',    d: 'Sistemi che non si parlano: gestionale, CRM, fogli, archivi.' },
    { k: 'automazione', label: 'Un’automazione',         d: 'Un lavoro ripetitivo che merita un flusso con un controllo umano.' },
    { k: 'software',    label: 'Un software su misura',  d: 'Un’interfaccia costruita sulla forma reale del vostro lavoro.' },
    { k: 'esplorare',   label: 'Non lo so ancora',       d: 'Va benissimo: la prima conversazione serve esattamente a questo.' },
  ],
  formNote:
    'Se preferite, descrivete un caso reale successo di recente — una richiesta, un documento, un passaggio che si è inceppato. È il modo più rapido per capire se possiamo esservi utili.',
  privacy:
    'I dati inviati vengono usati esclusivamente per rispondervi. Nessuna newsletter, nessuna condivisione con terzi.',
} as const;

/* ============================================== page === dimostrazione ========*/

export const demoCopy = {
  title: 'Dimostrazione',
  headline: 'Lo stesso motore che consegniamo, con dati di esempio.',
  lead:
    'Non è un video e non è una registrazione. Classificazione, estrazione, soglie di confidenza, verifica di fattibilità, ricerca nello storico e generazione della bozza vengono eseguite qui, nel vostro browser, dallo stesso codice che installiamo presso i clienti.',
  disclaimer: 'Dimostrazione con dati di esempio. Aziende, documenti e prezzi non sono reali.',
  cases: [
    { id: 'RFQ-2026-0412', code: 'CASO 01', t: 'Bozza automatica', d: 'Dati completi, un precedente comparabile nello storico. Il caso favorevole.' },
    { id: 'RFQ-2026-0413', code: 'CASO 02', t: 'Riferimento incrociato', d: 'Trova un precedente, ma di un altro cliente — e lo dichiara invece di usarlo in silenzio.' },
    { id: 'RFQ-2026-0414', code: 'CASO 03', t: 'Serve stima tecnica', d: 'Dati insufficienti. Il sistema non propone un prezzo. Il caso più importante di questa pagina.' },
    { id: 'ORD-2026-0331', code: 'CASO 04', t: 'Non è una richiesta', d: 'Una conferma d’ordine. Viene instradata, non quotata.' },
    { id: 'SPAM-2026-8891', code: 'CASO 05', t: 'Filtrata a costo zero', d: 'Email commerciale. Scartata prima di qualsiasi elaborazione.' },
  ],
  technical: {
    headline: 'Perché gira nel browser.',
    body:
      'In produzione l’estrazione usa un modello linguistico. Qui gira una versione deterministica dello stesso motore, così la dimostrazione funziona in una sala riunioni senza rete e senza costi — e produce esattamente lo stesso comportamento nei casi che contano, compreso il rifiuto.',
  },
} as const;

/* ===================================================== legal shared ===========*/

export const legalNote =
  'Questo testo è predisposto ma non ancora verificato da un legale. Prima della pubblicazione del dominio definitivo verrà sottoposto a revisione.';
