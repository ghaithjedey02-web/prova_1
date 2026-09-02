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
  tagline: 'Il lavoro della vostra azienda, connesso',
  description:
    'DOLMIR è il livello intelligente sopra i sistemi della vostra azienda: legge email, documenti e gestionali, verifica i dati, rileva i conflitti e prepara le azioni — con una persona che decide dove serve giudizio.',
  locale: 'it_IT',
  email: 'info@dolmir.com',
  region: 'Lombardia',
  /**
   * Legal identifiers. NOT INVENTED — see docs/DA-COMPLETARE.md.
   * A P.IVA printed on every page of an Italian company's website is a legal
   * statement, not a design placeholder, so until the real one exists this
   * says exactly that.
   */
  legalName: 'DOLMIR',
  vat: 'in registrazione',
} as const;

/**
 * Four destinations, in the order a stranger needs them: what we do, how it
 * works, proof, and the thing they can try right now. Everything else —
 * Studio, Affidabilità, the legal pages — lives in the footer, where people
 * look for it when they already care.
 */
export const nav = [
  { href: '/soluzioni', label: 'Soluzioni' },
  { href: '/metodo', label: 'Metodo' },
  { href: '/dimostrazione', label: 'Dimostrazione' },
  { href: '/affidabilita', label: 'Affidabilità' },
  { href: '/studio', label: 'Studio' },
  { href: '/contatto', label: 'Contatto' },
] as const;

/** The footer carries what the four-item top bar leaves out. */
export const footerNav = [
  { href: '/soluzioni', label: 'Soluzioni' },
  { href: '/#contesto', label: 'Il contesto' },
  { href: '/#parla', label: 'Parla con DOLMIR' },
  { href: '/dimostrazione', label: 'Dimostrazione' },
] as const;

export const legalNav = [
  { href: '/legale/privacy', label: 'Privacy Policy' },
  { href: '/legale/cookie', label: 'Cookie Policy' },
  { href: '/legale/termini', label: 'Termini e condizioni' },
] as const;

export const cta = {
  primary: { label: 'Parla con DOLMIR', href: '/#parla' },
  secondary: { label: 'Vedi la dimostrazione', href: '/dimostrazione' },
  contact: { label: 'Parliamone', href: '/contatto' },
} as const;

/**
 * The seven words of the DOLMIR pipeline — the one sentence the whole site
 * keeps repeating until a visitor who never reads a paragraph still knows it:
 * hero strip, scroll spine, film chapters, console stages. The human decision
 * is the only amber word, everywhere.
 */
export const pipeline = {
  words: ['INPUT', 'ANALISI', 'DATI', 'VERIFICA', 'CONFLITTI', 'DECISIONE UMANA', 'AZIONE'],
  human: 5,
} as const;

/* =========================================================== home === hero ===*/

export const hero = {
  eyebrow: 'Il livello intelligente sopra i sistemi della vostra azienda',
  headline: 'Il lavoro della vostra azienda, finalmente connesso.',
  lead:
    'Email, documenti e gestionali vengono letti, verificati e trasformati in azioni. Quando serve un giudizio, decide una persona.',
  /** The four verbs under the lead. The last is amber: that one is ours. */
  ribbon: ['Legge', 'Verifica', 'Prepara', 'Si ferma quando serve una persona'],
  /* The three surfaces of the stage: what arrives, what DOLMIR does, what comes out. */
  panes: { inbox: 'Posta commerciale', dolmir: 'DOLMIR', outcome: 'Esito' },
  /* The captions of the hero scene, one per beat. DOM, never canvas. */
  beats: ([
    { k: 'ARRIVA', t: 'Una richiesta arriva, in mezzo a tutto il resto.' },
    { k: 'LEGGE', t: 'DOLMIR capisce di cosa si tratta ed estrae i dati, ognuno con la sua fonte.' },
    { k: 'VERIFICA', t: 'Li confronta con anagrafica, listini e le richieste precedenti.' },
    { k: 'SI FERMA', t: 'Qualcosa non torna. Non decide il software: decide una persona.', amber: true },
    { k: 'AGISCE', t: 'Approvato: CRM aggiornato, offerta preparata, commerciale avvisato.' },
  ] as readonly { k: string; t: string; amber?: boolean }[]),
} as const;

/**
 * The one operational story every product frame on the site draws: a request
 * for quotation from the demo company's oldest customer, with a quantity that
 * disagrees with the previous request. The same record exists in the console's
 * tools (get_requests), so a visitor who asks about it gets the same facts.
 * All of it is simulated and says so.
 */
export const scenario = {
  mail: {
    from: 'Officine Rossi S.r.l.',
    subject: 'Richiesta di offerta — 2.000 pz SL-4410',
    time: '09:12',
    excerpt: 'Buongiorno, vi chiediamo un’offerta per 2.000 staffe SL-4410 come da disegno allegato, consegna entro il 30/09. Cordiali saluti, Meccanica Rossi.',
    attachment: 'Disegno_SL-4410_rev3.pdf',
  },
  inbox: [
    { from: 'Fonderia Bianchi S.p.A.', subject: 'Conferma d’ordine n. 4471/2026', time: '08:41' },
    { from: 'Officine Rossi S.r.l.', subject: 'Richiesta di offerta — 2.000 pz SL-4410', time: '09:12', active: true },
    { from: 'newsletter@forniture-online', subject: 'Offerta del mese: utensili -20%', time: '09:15' },
  ],
  fields: [
    { label: 'Cliente', value: 'Officine Rossi S.r.l.', source: 'firma «Meccanica Rossi» ≈ anagrafica C-01' },
    { label: 'Prodotto', value: 'SL-4410 · staffa laser', source: 'oggetto + allegato' },
    { label: 'Quantità', value: '2.000 pz', source: 'corpo email' },
    { label: 'Scadenza', value: '30/09/2026', source: 'corpo email' },
    { label: 'Priorità', value: 'Alta · cliente storico', source: 'regola: cliente C-01' },
  ],
  checks: [
    { what: 'Cliente in anagrafica', against: 'gestionale · C-01 Officine Rossi S.r.l.', state: 'ok' },
    { what: 'Codice e listino', against: 'listino 2026 · SL-4410 attivo', state: 'ok' },
    { what: 'Richiesta precedente', against: 'PRV-2198 · giugno 2026 · 1.200 pz', state: 'conflict', note: 'Quantità diversa dall’ultima richiesta: 2.000 oggi, 1.200 a giugno.' },
  ],
  decision: {
    question: 'Confermare la nuova quantità?',
    detail: '2.000 pezzi contro i 1.200 dell’ultima richiesta. Un errore di battitura o un ordine più grande: lo sa il commerciale, non il software.',
  },
  decidedLabel: 'Approva · decisione presa da una persona (simulata)',
  actions: ['CRM aggiornato', 'Offerta preparata', 'Commerciale notificato'],
  disclaimer: 'Scenario dimostrativo: azienda, documenti e importi sono simulati.',
} as const;

/* ============================================ home === the problem ==========*/

export const problema = {
  n: '01',
  label: 'Il problema',
  headline: 'Il lavoro non è nel gestionale.',
  body:
    'È nella casella email, negli allegati, nei fogli Excel, nelle telefonate. L’informazione esiste già — è solo frammentata. E a tenerla insieme, oggi, sono le persone: a mano, ricopiandola da un posto all’altro.',
  /* Not labels — the things themselves, drawn as what they are, so the
     reader recognises a Tuesday rather than decoding a taxonomy. Same demo
     entities as the rest of the site. */
  fragments: ([
    { kind: 'email',      a: 'Officine Rossi', b: 'Conferma ordine — 80 pz SL-441, consegna 12/09', c: '08:41' },
    { kind: 'pdf',        a: 'Allegato_ordine_184.pdf', b: 'PF-2205 · q.tà 60' },
    { kind: 'excel',      a: 'PF-2205', b: '40', c: '12/09' },
    { kind: 'whatsapp',   a: 'Marco', b: 'confermi 40 pezzi o 60?' },
    { kind: 'telefono',   a: 'Chiamata · 4 min', b: '«la quantità è da rivedere»' },
    { kind: 'gestionale', a: 'ORD-10482', b: 'IN LAVORAZIONE', c: 'Officine Rossi S.r.l.' },
    { kind: 'documenti',  a: 'Disegno_SL-441_rev3.pdf', b: '+ 2 allegati' },
    { kind: 'persone',    a: 'chiedere a Marco', b: 'prima di inserire' },
  ] as readonly { kind: string; a: string; b: string; c?: string }[]),
  where: { email: 'Email', pdf: 'Allegato', excel: 'Foglio Excel', whatsapp: 'WhatsApp', telefono: 'Telefonata', gestionale: 'Gestionale', documenti: 'Cartella condivisa', persone: 'Promemoria' },
  turn: 'Qui entra DOLMIR.',
  what:
    'Costruiamo il sistema che manca: fra il lavoro delle persone e il software che avete già.',
  nots: [
    {
      t: 'Non sostituiamo il gestionale.',
      d: 'Ci innestiamo sopra: leggiamo e scriviamo nei sistemi che usate già, senza migrazioni.',
    },
    {
      t: 'Non sostituiamo le persone.',
      d: 'Togliamo il ricopiare. Le decisioni che richiedono giudizio restano umane, per costruzione.',
    },
    {
      t: 'Non vi chiediamo di cambiare come lavorate.',
      d: 'Le email restano email, il gestionale resta il vostro. Cambia solo chi fa il lavoro di raccordo.',
    },
  ],
} as const;

/* ============================================ home === the system film ======*/

export const fiducia = {
  label: 'Perché fidarsi',
  items: [
    { t: 'Nessuna migrazione', d: 'Lavoriamo sopra i sistemi che avete: non si butta via niente.' },
    { t: 'Dati verificati alla fonte', d: 'Ogni valore estratto viene confrontato con il documento e con i vostri sistemi.' },
    { t: 'Confidenza dichiarata', d: 'Il sistema dice quanto è sicuro, campo per campo. Mai una certezza finta.' },
    { t: 'Tracciabilità completa', d: 'Cosa ha letto, cosa ha verificato, chi ha deciso: tutto resta scritto nel registro.' },
    { t: 'Una persona nel circuito', d: 'Le decisioni che richiedono giudizio passano sempre da qualcuno con nome e cognome.' },
    { t: 'Nessuna azione autonoma dove serve giudizio', d: 'Il sistema prepara ed aspetta. Il sì lo date voi.' },
  ],
} as const;

/* ==================================== home === the intelligence core ========*/

/* ==================================== home === parla con DOLMIR =============*/

export const parla = {
  n: '05',
  label: 'Parla con DOLMIR',
  headline: 'Fategli una domanda. Il sistema risponde.',
  body:
    'Un modello AI reale, collegato a un’azienda dimostrativa con dati simulati. Chiedetegli quello che chiedereste al vostro ufficio — a voce o per iscritto: risponde con i dati, vi mostra cosa ha consultato, e si ferma dove serve una persona.',
  online: 'SYSTEM ONLINE',
  prompt: 'Chiedetemi qualcosa sull’azienda dimostrativa. Rispondo con i dati che consulto davanti a voi.',
  promptSub: 'Parlate o scrivete, in italiano. La conversazione ha memoria.',
  micLabel: 'PARLA',
  micListening: 'VI ASCOLTO',
  micStop: 'FERMA',
  inputPlaceholder: 'Scrivete la vostra domanda…',
  send: 'INVIA',
  voiceOn: 'VOCE ON',
  voiceOff: 'VOCE OFF',
  interrupt: 'INTERROMPI',
  /* The five states the server actually reports while it works. */
  stages: ['ANALISI', 'DATI', 'VERIFICA', 'DECISIONE', 'RISPOSTA'],
  stageHint: {
    ANALISI: 'Sto capendo la domanda',
    DATI: 'Sto leggendo i dati aziendali',
    VERIFICA: 'Sto incrociando le fonti',
    DECISIONE: 'Serve una persona',
    RISPOSTA: 'Sto rispondendo',
  },
  systemPanel: 'Cosa sta facendo',
  consultedLabel: 'DATI CONSULTATI',
  nothingYet: 'In attesa di una domanda.',
  panelDegraded: 'Nessuno strumento da consultare: il modello non è collegato qui.',
  gateTitle: 'DECISIONE UMANA',
  gateLead: 'Ho trovato più possibilità. Non scelgo al posto vostro.',
  gateStake: 'SE SI SBAGLIA',
  gateApprove: 'APPROVA',
  gateModify: 'MODIFICA',
  gateReject: 'RIFIUTA',
  gateDecided: 'DECISIONE REGISTRATA',
  unknownTitle: 'NON DETERMINATO',
  unknownLead: 'I dati non bastano per rispondere con certezza. Non tiro a indovinare.',
  unknownMissing: 'COSA MANCHEREBBE',
  suggestLabel: 'PROVATE A CHIEDERE',
  conflicts: [
    'CLIENTE · «Meccanica Rossi» ≈ Officine Rossi S.r.l.',
    'CODICE · SL-441 → 2 candidati',
    'QUANTITÀ · PF-2205: 40 ↔ 60',
    'CONSEGNA · 12/09 · capacità dal 19/09',
    'CONFIDENZA · 58,4% · sotto soglia',
  ],
  errors: {
    denied: 'Microfono non autorizzato — nessun problema: potete scrivere qui sotto.',
    noSpeech: 'Non ho sentito nulla. Riprovate, oppure scrivete.',
    network: 'Il riconoscimento vocale non risponde. La tastiera funziona sempre.',
    unsupported: 'Questo browser non supporta la voce — scrivete pure.',
  },
  /* Not an FAQ: five real openings, each one exercising a different part of
     the system — retrieval, cross-checking, the human gate, the limits, the
     honesty about what this demo is. */
  starters: [
    { t: 'Cosa puoi fare per la mia azienda?', k: 'Il sistema, in parole sue' },
    { t: 'Quali ordini sono in ritardo?', k: 'Legge il gestionale' },
    { t: 'Qual è l’ultima richiesta di Officine Rossi?', k: 'Trova il conflitto' },
    { t: 'Perché l’ordine 10482 è fermo?', k: 'Incrocia le fonti' },
    { t: 'Cosa faresti al posto mio su quell’ordine?', k: 'Si ferma e chiede' },
    { t: 'Cosa fai quando non sei sicuro?', k: 'Dichiara i limiti' },
  ] as const,
  evidenceLabel: 'DATI CONSULTATI',
  thinking: 'INTERROGO I SISTEMI…',
  /* No model configured: one honest state, never a rehearsed conversation. */
  offlineState: 'Modello non attivo su questo ambiente',
  voiceHint: 'Toccate il nucleo e parlate, oppure scrivete.',
  voiceHintNoMic: 'Scrivete la vostra domanda.',
  offlineBody:
    'La console parla con un modello AI reale, e su questo ambiente quel modello non è collegato. Preferiamo dirvelo piuttosto che rispondervi con frasi preparate: un sistema che recita non è il sistema che costruiamo. Scriveteci e ve lo facciamo vedere mentre lavora sui vostri processi.',
  offlineCta: 'PARLIAMONE →',
  offlinePlaceholder: 'Console non attiva su questo ambiente',
  busyNote: 'Troppe richieste ravvicinate — riprovate fra qualche secondo.',
  overloadedNote: 'Il modello è momentaneamente sovraccarico. Riprovate fra qualche secondo: la domanda è rimasta qui sopra.',
  offlineNote: 'Il sistema non risponde in questo momento. Riprovate, oppure scrivete a info@dolmir.com.',
  disclaimer: 'Demo live · AI reale · dati aziendali simulati · nessun dato di clienti veri.',
  contextNote: 'Potete fare domande di seguito: «e per i preventivi?» o «quale è ancora in ritardo?» — DOLMIR ricorda di cosa state parlando.',
} as const;

/* ==================================== home === what DOLMIR builds ===========*/

/* ======================================== home === the simulator ============*/

/* ================================================== home === the story ========*/

/* ====================================================== home === closing ======*/

export const closing = {
  label: 'Il passo successivo',
  headline: 'Il prossimo processo potrebbe essere il vostro.',
  body:
    'Venticinque minuti, sei domande sul vostro processo, nessuna presentazione. Ci mostrate dove entrano le richieste, dove vengono ricopiati i dati, dove qualcuno deve controllare e dove il processo si blocca. Alla fine sapremo entrambi se ha senso continuare — e se non ha senso, lo diremo noi.',
  bring: [
    'Quante richieste ricevete in una settimana',
    'Chi prepara le offerte, e quanto tempo serve',
    'Quanto passa fra la richiesta e la risposta',
    'Dove si ferma il processo, oggi',
  ],
} as const;

/* ================================================= page === soluzioni =========*/

export const soluzioni = {
  title: 'Soluzioni',
  headline: 'Sette processi, una sola forma.',
  lead:
    'Non vendiamo “siti”, “AI” e “automazione” come voci separate di un listino. Ogni voce qui sotto è un processo che esiste già nella vostra azienda e che oggi costa ore. Sotto ciascuno, la stessa catena: entra qualcosa, viene letto e verificato, una persona decide, il sistema agisce. Si parte da uno.',
  /* Every item carries the frame it produces: the input, three read fields
     with their state, the decision when there is one, the action. Data is
     the demo company's, declared as simulated. */
  items: ([
    {
      t: 'Preventivi e richieste di offerta',
      lead: 'Il processo che abbiamo costruito per primo, e quello che conosciamo meglio.',
      d: 'Le richieste in entrata vengono lette, classificate, estratte campo per campo con un livello di confidenza, confrontate con lo storico e trasformate in una bozza. Quando i dati non bastano, il sistema si ferma.',
      out: 'Bozza di offerta, coda di verifica, tracciabilità completa.',
      frame: {
        title: 'Richieste di offerta',
        input: { from: 'Officine Rossi S.r.l.', subject: 'Richiesta di offerta — 2.000 pz SL-4410', time: '09:12' },
        fields: [
          { label: 'Cliente', value: 'Officine Rossi S.r.l.', source: 'alias «Meccanica Rossi» · anagrafica C-01', state: 'verified' },
          { label: 'Codice', value: 'SL-4410 · staffa laser', source: 'oggetto + disegno allegato', state: 'verified' },
          { label: 'Quantità', value: '2.000 pz', source: 'PRV-2198: 1.200 pz', state: 'conflict' },
        ],
        decision: 'Confermare la nuova quantità?',
        actions: ['Bozza PRV-2206 preparata', 'In attesa di approvazione'],
        status: { k: 'decisione richiesta', tone: 'amber' },
      },
    },
    {
      t: 'Posta e richieste in arrivo',
      lead: 'La casella condivisa che si organizza da sola.',
      d: 'Classificazione e instradamento di tutto ciò che arriva: richieste, ordini, documenti, comunicazioni. Con priorità dichiarata e un elenco di cose da decidere invece di una lista di email da aprire.',
      out: 'Posta smistata, priorità, notifiche solo quando servono.',
      frame: {
        title: 'Posta commerciale',
        input: { from: 'Fonderia Bianchi S.p.A.', subject: 'Conferma d’ordine n. 4471/2026', time: '08:41' },
        fields: [
          { label: 'Tipo', value: 'Conferma d’ordine', source: 'classificazione · non è una richiesta di offerta', state: 'verified' },
          { label: 'Priorità', value: 'Normale · consegna a 30 gg', source: 'regola: data richiesta', state: 'verified' },
          { label: 'Assegnata', value: 'Ufficio ordini', source: 'instradamento per tipo', state: 'read' },
        ],
        actions: ['Instradata al flusso ordini', 'Nessuna notifica superflua'],
        status: { k: 'instradata', tone: 'good' },
      },
    },
    {
      t: 'Documenti tecnici',
      lead: 'I documenti smettono di essere allegati.',
      d: 'Ordini, conferme, certificati materiale, schede tecniche, capitolati: letti, collegati alla commessa giusta e resi cercabili. Con il riferimento esatto da cui ogni dato è stato estratto.',
      out: 'Archivio collegato alle commesse, ricerca sui contenuti.',
      frame: {
        title: 'Documenti',
        input: { from: 'Certificato_3.1_colata_2041B.pdf', subject: 'Certificato di collaudo materiale · 2 pagine', time: '10:05' },
        fields: [
          { label: 'Materiale', value: 'Acciaio C40', source: 'pag. 1, tabella analisi', state: 'verified' },
          { label: 'Colata', value: '2041-B', source: 'pag. 1, intestazione', state: 'verified' },
          { label: 'Commessa', value: 'ORD-10482', source: 'collegata per codice e fornitore', state: 'read' },
        ],
        actions: ['Archiviato sulla commessa', 'Cercabile per contenuto'],
        status: { k: 'collegato', tone: 'good' },
      },
    },
    {
      t: 'Ordini e flussi fra i sistemi',
      lead: 'I passaggi meccanici fra un sistema e l’altro.',
      d: 'Il tratto che oggi qualcuno copre a mano: dal messaggio al gestionale, dal gestionale al documento, dal documento alla notifica. Costruito sopra quello che avete già, non al posto suo.',
      out: 'Integrazioni con il gestionale esistente, registro delle operazioni.',
      frame: {
        title: 'Ordini',
        input: { from: 'Officine Rossi S.r.l.', subject: 'Conferma ordine — 80 pz SL-441, consegna 12/09', time: '08:41' },
        fields: [
          { label: 'Articolo', value: 'PF-2205', source: 'allegato PDF · riga 3', state: 'verified' },
          { label: 'Quantità', value: '40 pz', source: 'email: 40 · PDF: 60', state: 'conflict' },
          { label: 'Consegna', value: '12/09', source: 'capacità disponibile dal 19/09', state: 'conflict' },
        ],
        decision: 'Quale quantità vale, e si conferma il 19/09?',
        actions: ['Ordine pronto per il gestionale', 'Risposta al cliente preparata'],
        status: { k: 'decisione richiesta', tone: 'amber' },
      },
    },
    {
      t: 'Visibilità sulla gestione',
      lead: 'Le anomalie, non le tabelle.',
      d: 'Volume delle richieste, tempo di risposta, offerte aperte, colli di bottiglia. Misurati dal processo stesso, non ricostruiti a posteriori con un foglio Excel. Il sistema segnala ciò che non torna, invece di produrre un report da leggere.',
      out: 'Indicatori aggiornati, storico, esportazione.',
      frame: {
        title: 'Settimana 36 · dati di esempio',
        input: { from: 'Dai sistemi collegati', subject: 'Gestionale · CRM · posta commerciale', time: 'lun 08:00' },
        fields: [
          { label: 'Offerte', value: '2 senza risposta da oltre 5 giorni', source: 'CRM · PRV-2201, PRV-2205', state: 'conflict' },
          { label: 'Consegne', value: '1 ordine a rischio', source: 'gestionale · ORD-10482', state: 'conflict' },
          { label: 'Richieste', value: 'Tutte lette e assegnate', source: 'posta commerciale', state: 'verified' },
        ],
        actions: ['Segnalato a chi decide', 'Storico aggiornato'],
        status: { k: '2 anomalie', tone: 'amber' },
      },
    },
    {
      t: 'Integrazioni',
      lead: 'Il gestionale resta dov’è.',
      d: 'Ci colleghiamo a quello che usate. Se un sistema non è integrabile in modo affidabile, lo diciamo prima di firmare invece di scoprirlo in corso d’opera.',
      out: 'Connettori, esportazioni, o inserimento assistito dove non c’è API.',
      frame: {
        title: 'Sistemi collegati',
        input: { from: 'Mappa delle integrazioni', subject: 'Cosa il sistema legge e dove scrive', time: '' },
        fields: [
          { label: 'Gestionale', value: 'Collegato · lettura e scrittura', source: 'ordini, anagrafiche, giacenze', state: 'verified' },
          { label: 'CRM', value: 'Collegato · lettura e scrittura', source: 'clienti, offerte, attività', state: 'verified' },
          { label: 'Portale', value: 'Nessuna API · inserimento assistito', source: 'dichiarato prima di firmare', state: 'unknown' },
        ],
        actions: ['Registro di ogni operazione', 'Nessuna migrazione'],
        status: { k: '2 di 3 con API', tone: 'info' },
      },
    },
    {
      t: 'Presenza digitale industriale',
      lead: 'La porta d’ingresso che qualifica l’azienda in trenta secondi.',
      d: 'Capacità produttive, macchine, materiali, tolleranze, settori serviti, documentazione tecnica. Costruita perché un ufficio acquisti capisca se siete il fornitore giusto senza dovervi telefonare — e perché ogni richiesta entri già strutturata nel flusso.',
      out: 'Sito tecnico, ingresso richieste strutturato, documenti scaricabili.',
      frame: {
        title: 'Richiesta dal sito',
        input: { from: 'Modulo tecnico', subject: 'Tornitura · acciaio C40 · 250 pz · disegno allegato', time: '11:20' },
        fields: [
          { label: 'Lavorazione', value: 'Tornitura con foratura', source: 'campo strutturato', state: 'verified' },
          { label: 'Materiale', value: 'Acciaio C40', source: 'campo strutturato', state: 'verified' },
          { label: 'Disegno', value: 'FL-2280_rev2.pdf', source: 'allegato · letto', state: 'read' },
        ],
        actions: ['Entra già nel flusso preventivi', 'Nessun campo da ricopiare'],
        status: { k: 'strutturata', tone: 'good' },
      },
    },
  ] as readonly {
    t: string; lead: string; d: string; out: string;
    frame: {
      title: string;
      input: { from: string; subject: string; time: string };
      fields: readonly { label: string; value: string; source: string; state: 'read' | 'verified' | 'conflict' | 'unknown' }[];
      decision?: string;
      actions: readonly string[];
      status: { k: string; tone: 'info' | 'good' | 'amber' | 'neutral' };
    };
  }[]),
  disclaimer: 'Interfacce dimostrative sull’azienda di esempio: dati simulati.',
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
  /* Step 2 of the intake: the sector, so the guided analysis speaks their
     language. Optional — skipping it never blocks the form. */
  settori: ['Manifattura', 'Logistica', 'Distribuzione', 'Commercio', 'Servizi', 'Altro'],
  /* The guided analysis: per area, what DOLMIR would typically look at first.
     Deliberately rule-based and labelled as such — the honest version of an
     "AI analysis", coherent with a system that does not guess. */
  analisiLabel: 'ANALISI GUIDATA · BASATA SU REGOLE, NON SU UN MODELLO',
  analisiNote:
    'Questa è la mappa di partenza tipica per quest’area. La valutazione vera — sui vostri numeri e sui vostri sistemi — la facciamo insieme in venticinque minuti.',
  opportunita: {
    processo:    ['Lettura e instradamento automatico di ciò che entra', 'Estrazione dei dati con evidenza e confidenza', 'Coda di lavorazione con stati e responsabili', 'Approvazione umana prima di ogni azione'],
    documenti:   ['Lettura di PDF e allegati con evidenza per campo', 'Collegamento automatico alla pratica giusta', 'Archivio cercabile per contenuto', 'Verifica incrociata con il gestionale'],
    dati:        ['Sincronizzazione fra gestionale, CRM e fogli', 'Riconciliazione delle anagrafiche doppie', 'Una fonte sola per le informazioni che contano', 'Indicatori aggiornati senza raccolte manuali'],
    automazione: ['Mappa del flusso attuale, passaggio per passaggio', 'Automazione dei passaggi ripetitivi', 'Cancello umano sui punti che richiedono giudizio', 'Registro di ogni azione eseguita'],
    software:    ['Interfaccia costruita sul vostro processo reale', 'Code, stati, approvazioni e ricerca', 'Integrazione con i sistemi che usate già', 'Indicatori visibili senza chiedere report'],
    esplorare:   ['Mappa di dove entra il lavoro oggi', 'Individuazione dei passaggi ricopiati a mano', 'Stima di cosa conviene automatizzare per primo', 'Nessun impegno: se non ha senso, lo diciamo'],
  } as Record<string, readonly string[]>,
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


/* ============================================ home === the context (03) =====*/

export const contesto = {
  n: '03',
  label: 'Il contesto',
  headline: 'Ogni dato arriva con la sua storia.',
  body:
    'Una richiesta non è mai sola: ha un cliente, un’offerta precedente, un ordine in corso, un disegno, una persona che ha scritto su WhatsApp. DOLMIR collega i record fra i sistemi che avete già, e il conflitto salta fuori da solo.',
  center: { id: 'C-01', t: 'Officine Rossi S.r.l.', sub: 'Cliente · alias «Meccanica Rossi» · gestionale + CRM' },
  nodes: ([
    { k: 'rfq', id: 'RFQ-2026-0521', kind: 'Richiesta di offerta', t: '2.000 pz SL-4410 · consegna 30/09', state: 'conflict', src: 'posta commerciale · 09:12', d: 'La richiesta letta nell’hero. In verifica: la quantità non coincide con l’ultima offerta dello stesso codice.' },
    { k: 'prv', id: 'PRV-2198', kind: 'Offerta precedente', t: '1.200 pz SL-4410 · giugno 2026', state: 'verified', src: 'CRM · inviata', d: 'L’ultima offerta per lo stesso codice. È il riferimento con cui la nuova quantità viene confrontata.' },
    { k: 'ord', id: 'ORD-10482', kind: 'Ordine in corso', t: 'PF-2205 · in lavorazione', state: 'conflict', src: 'gestionale', d: 'Un altro fronte aperto con lo stesso cliente: email e allegato dicono quantità diverse (40 ↔ 60).' },
    { k: 'doc', id: 'Disegno_SL-4410_rev3.pdf', kind: 'Documento', t: 'Allegato alla richiesta · rev. 3', state: 'verified', src: 'allegato email', d: 'Il disegno da cui il sistema ha letto il codice. Ogni campo estratto tiene attaccata la pagina da cui viene.' },
    { k: 'who', id: 'Marco', kind: 'Referente', t: '«confermi 40 pezzi o 60?»', state: 'read', src: 'WhatsApp · ieri', d: 'La persona che ha scritto. Il messaggio è collegato all’ordine a cui si riferisce, non perso in una chat.' },
  ] as readonly { k: string; id: string; kind: string; t: string; state: 'read' | 'verified' | 'conflict'; src: string; d: string }[]),
  relation: { a: 'rfq', b: 'prv', label: 'quantità diversa · 2.000 ↔ 1.200' },
  hint: 'Toccate un record per vedere cosa ne sa il sistema.',
  disclaimer: 'Relazioni sull’azienda dimostrativa: dati simulati.',
} as const;

/* ============================================ home === the workflow (04) ====*/

export const workflow = {
  n: '04',
  label: 'Il flusso',
  headline: 'Otto passi. Sempre gli stessi, per qualunque processo.',
  body:
    'Quello che cambia da azienda ad azienda è il contenuto, non la forma. Scegliete un processo e guardate la stessa catena riempirsi con le vostre parole.',
  stations: ['INPUT', 'COMPRENDE', 'ESTRAE', 'VERIFICA', 'COLLEGA', 'CONFLITTO', 'DECISIONE UMANA', 'AZIONE'],
  human: 6,
  items: [
    { k: 'PREVENTIVI', input: 'Richiesta d’offerta via email, con allegato tecnico', verifica: 'Anagrafica, listini, offerte passate comparabili', collega: 'Cliente, codice articolo, ultima offerta', conflitto: 'Quantità o codice diversi dal precedente', persona: 'Approva il prezzo prima che l’offerta parta', azione: 'Offerta pronta e registrata' },
    { k: 'ORDINI', input: 'Conferma d’ordine — email, PDF, portale', verifica: 'Codici articolo, quantità, capacità, date di consegna', collega: 'Cliente, offerta di origine, disponibilità', conflitto: 'Email e allegato non coincidono', persona: 'Decide sui conflitti fra le fonti', azione: 'Ordine inserito nel gestionale' },
    { k: 'FATTURE', input: 'Fattura passiva in PDF', verifica: 'Ordine di riferimento, DDT, importi e scadenze', collega: 'Fornitore, ordine, bolla', conflitto: 'Importo diverso dall’ordine', persona: 'Approva le eccezioni e le differenze', azione: 'Registrazione preparata' },
    { k: 'RICHIESTE CLIENTI', input: 'Email, moduli dal sito, PEC', verifica: 'Storico del cliente, stato di ordini e consegne', collega: 'Cliente, pratica aperta, responsabile', conflitto: 'Promessa fatta e stato reale non coincidono', persona: 'Rivede i casi delicati prima della risposta', azione: 'Risposta preparata, con i dati giusti' },
    { k: 'DOCUMENTI', input: 'PDF, scansioni, allegati sparsi', verifica: 'Campi estratti, ognuno con la fonte attaccata', collega: 'Pratica, cliente, versione del documento', conflitto: 'Due versioni dello stesso documento', persona: 'Valida i campi sotto soglia di confidenza', azione: 'Archivio ordinato e interrogabile' },
    { k: 'APPROVAZIONI', input: 'Richieste interne: acquisti, ferie, spese', verifica: 'Regole e soglie che definite voi', collega: 'Richiedente, centro di costo, budget', conflitto: 'Fuori soglia o fuori regola', persona: 'Firma dove la regola non basta', azione: 'Esito eseguito e tracciato' },
    { k: 'REPORT', input: 'Dati dai sistemi già collegati', verifica: 'Coerenza fra le fonti, anomalie segnalate', collega: 'Reparto, periodo, indicatore', conflitto: 'Due sistemi dicono numeri diversi', persona: 'Legge le anomalie, non le tabelle', azione: 'Report ricorrente, pronto' },
    { k: 'ASSISTENZA', input: 'Ticket, email, segnalazioni telefoniche trascritte', verifica: 'Contratto, garanzia, storico interventi', collega: 'Cliente, macchina, intervento precedente', conflitto: 'Garanzia scaduta ma richiesta in garanzia', persona: 'Gestisce i casi mai visti prima', azione: 'Risposta e intervento pianificato' },
  ],
  fixed: {
    comprende: 'Riconosce di cosa si tratta e a quale processo appartiene',
    estrae: 'Estrae i dati, ognuno con la sua fonte',
  },
  note: 'Il vostro processo non è in elenco? È comunque fatto di questi otto passi. Portatecelo.',
} as const;

/* ============================================ home === the case (06) =======*/

export const caso = {
  n: '06',
  label: 'Un caso operativo',
  headline: 'Una richiesta di offerta, dall’email al preventivo.',
  body:
    'Lo stesso caso dello scenario qui sopra, seguito passo per passo come succede in azienda: cosa fa il sistema, dove si ferma, cosa resta nelle mani di una persona.',
  steps: ([
    { k: 'Richiesta in arrivo', t: 'Officine Rossi chiede 2.000 staffe SL-4410 con consegna al 30/09. Email più disegno allegato, nella casella commerciale.', frame: 'mail' },
    { k: 'Estrazione', t: 'Cinque campi, ognuno con la fonte: il cliente riconosciuto dall’alias «Meccanica Rossi», il codice dal disegno, quantità e scadenza dal testo.', frame: 'fields' },
    { k: 'Storico', t: 'Il sistema cerca le offerte precedenti dello stesso cliente e dello stesso codice: trova PRV-2198, giugno 2026, 1.200 pezzi.', frame: 'checks' },
    { k: 'Discrepanza', t: 'Quantità diversa dall’ultima richiesta. Non è un errore del sistema: è un fatto da chiarire, e il sistema lo dichiara.', frame: 'checks', amber: true },
    { k: 'Decisione umana', t: 'Il commerciale vede la richiesta, il precedente e la differenza. Approva la nuova quantità o la rimanda al cliente.', frame: 'decision', amber: true },
    { k: 'Preventivo', t: 'Con la quantità confermata, DOLMIR prepara la bozza di offerta: prezzo dal listino, motivazione, consegna richiesta.', frame: 'quote' },
    { k: 'Sistemi aggiornati', t: 'CRM, offerta e commerciale allineati in un passaggio. Ogni azione resta nel registro, con chi l’ha approvata.', frame: 'actions' },
  ] as readonly { k: string; t: string; frame: 'mail' | 'fields' | 'checks' | 'decision' | 'quote' | 'actions'; amber?: boolean }[]),
  quote: {
    id: 'PRV-2206 · bozza',
    lines: [['SL-4410 · staffa laser', '2.000 pz'], ['Prezzo unitario', 'da listino 2026'], ['Consegna richiesta', '30/09/2026'], ['Riferimento', 'PRV-2198 (1.200 pz)']],
    status: 'In attesa di approvazione',
  },
  before: {
    title: 'OGGI, A MANO',
    steps: ['Qualcuno apre l’email', 'Legge il disegno allegato', 'Cerca il cliente nel gestionale', 'Cerca l’ultima offerta', 'Ricopia i dati in Excel', 'Chiede conferma al commerciale', 'Scrive il preventivo'],
    stats: [['PASSAGGI', '7'], ['PERSONE', '2'], ['SISTEMI', '4'], ['PUNTI DI ERRORE', '3']],
  },
  disclaimer: 'Esempio illustrativo sul caso dimostrativo. Passaggi e conteggi descrivono lo scenario demo, non una misura presso un cliente.',
  cta: { t: 'Il motore vero, con i suoi casi →', href: '/dimostrazione' },
} as const;

/* ============================================ home === control (07) ========*/

export const controllo = {
  n: '07',
  label: 'Controllo',
  headline: 'Il sistema si ferma prima di decidere.',
  body:
    'Un modello AI può sempre generare una risposta. DOLMIR è costruito per sapere quando non deve: soglie, evidenze e cancelli espliciti. Cinque stati, sempre visibili, dicono in ogni momento quanto il sistema è sicuro e chi ha l’ultima parola.',
  states: [
    { k: 'VERIFICATO', tone: 'good', t: 'Il dato coincide con il documento e con i vostri sistemi. Può procedere.', ex: 'Cliente · C-01 Officine Rossi S.r.l. · anagrafica' },
    { k: 'CONFLITTO RILEVATO', tone: 'amber', t: 'Due fonti dicono cose diverse. Il sistema lo mostra, non sceglie.', ex: 'Quantità · 2.000 (email) ↔ 1.200 (PRV-2198)' },
    { k: 'DECISIONE RICHIESTA', tone: 'amber', t: 'Un bivio vero. Le opzioni sono già pronte, con la loro evidenza.', ex: 'Confermare la nuova quantità? · Approva / Revisiona' },
    { k: 'NON DETERMINATO', tone: 'amber', t: 'I dati non bastano. Nessun valore plausibile viene inventato.', ex: 'Prezzo · manca il materiale · serve stima tecnica' },
    { k: 'APPROVAZIONE UMANA', tone: 'amber', t: 'Niente parte senza un sì con nome e cognome. Poi il flusso riprende.', ex: 'Approvata da M. Rossi · 09:31 · registrata' },
  ],
  quote: 'REQUIRES_TECHNICAL_ESTIMATE',
  quoteNote:
    'È una riga vera del motore che gira su questo sito. Quando compare, il sistema ha deciso di non rispondere. Non è un guasto: è la funzione più importante che abbiamo scritto.',
} as const;
