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
  { href: '/soluzioni', label: 'Soluzioni' },
  { href: '/dimostrazione', label: 'Dimostrazione' },
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
  eyebrow: 'Sistemi digitali · Automazione AI · Integrazioni',
  /* The boot sequence. Six lines, ~1.6s, then the system hands over to the
     headline. Each line is a real stage of what DOLMIR builds, not set dressing. */
  boot: [
    { t: 'AVVIO SISTEMA', v: 'DOLMIR CORE' },
    { t: 'CANALI IN INGRESSO', v: 'EMAIL · PDF · ERP · API' },
    { t: 'MOTORE DI ESTRAZIONE', v: 'ONLINE' },
    { t: 'SOGLIE DI CONFIDENZA', v: 'ATTIVE' },
    { t: 'CONTROLLO UMANO', v: 'RICHIESTO' },
    { t: 'SISTEMA', v: 'PRONTO' },
  ],
  line1: 'Il lavoro si disperde.',
  line2: 'Noi lo rendiamo',
  line3: 'un sistema.',
  lead:
    'Email, documenti, fogli, gestionali che non si parlano. Costruiamo il sistema che tiene insieme tutto questo: software su misura, automazioni che capiscono i documenti, integrazioni. Con una persona che approva.',
  telemetry: [
    ['CANALI', '7 collegati'],
    ['LATENZA', '< 900 ms'],
    ['CONFIDENZA', 'dichiarata per campo'],
    ['DECISIONE', 'umana'],
  ] as const,
  scroll: 'Entra nel sistema',
} as const;

/* ================================================== home === the story ========*/

export const chapters = {
  fragmentation: {
    n: '01',
    label: 'Frammentazione',
    headline: 'L’azienda funziona. Il sistema no.',
    body:
      'Il lavoro esiste già ed è ordinato nella testa delle persone. Quello che manca è il posto dove vive. Sta in undici strumenti che non si parlano, e ogni passaggio fra uno e l’altro lo fa qualcuno a mano.',
    nodes: [
      { k: 'Email', d: 'Richieste, ordini, allegati' },
      { k: 'PDF', d: 'Documenti da rileggere ogni volta' },
      { k: 'Excel', d: 'La verità parallela al gestionale' },
      { k: 'Gestionale', d: 'Aggiornato a mano, in ritardo' },
      { k: 'Drive', d: 'File senza un nome condiviso' },
      { k: 'Messaggi', d: 'Decisioni prese fuori dai sistemi' },
      { k: 'Telefonate', d: 'Che non lasciano traccia' },
      { k: 'Persone', d: 'Che tengono insieme il resto' },
    ],
    kicker:
      'Nessuno di questi strumenti è sbagliato. Il problema è che fra l’uno e l’altro c’è sempre una persona che ricopia.',
  },

  layer: {
    n: '02',
    label: 'Lo strato',
    headline: 'Costruiamo il livello che manca in mezzo.',
    body:
      'Non sostituiamo quello che avete. Copriamo il tratto che nessuno ha mai informatizzato — quello fra “è arrivata una cosa” e “il dato è nel sistema” — perché è irregolare, e finora l’unico modo di percorrerlo era a mano.',
    verbs: [
      { k: 'LEGGE', d: 'Testo, allegati, documenti, moduli. Anche quando il formato cambia ogni volta.' },
      { k: 'CAPISCE', d: 'Riconosce di cosa si tratta prima di elaborare qualsiasi cosa.' },
      { k: 'ESTRAE', d: 'Campo per campo, con la frase esatta del documento da cui viene ogni dato.' },
      { k: 'VERIFICA', d: 'Dichiara quanto è sicuro. Sotto soglia, non procede.' },
      { k: 'COLLEGA', d: 'Scrive nei sistemi che usate già, senza chiedervi di cambiarli.' },
      { k: 'CONSEGNA', d: 'Un risultato strutturato, con la motivazione di ogni valore.' },
    ],
  },

  intelligence: {
    n: '03',
    label: 'Intelligenza',
    headline: 'Un nucleo che legge, confronta e dichiara.',
    body:
      'Al centro c’è un motore che riceve tutto ciò che entra, lo classifica, ne estrae i dati e li confronta con quello che l’azienda ha già fatto. Non è un assistente conversazionale: è un componente di processo, con soglie e confini scritti.',
    inputs: ['Email', 'Documenti', 'Gestionale', 'CRM', 'File', 'Ordini', 'Fogli'],
    outputs: ['Decisione', 'Flusso', 'Bozza', 'Aggiornamento', 'Segnalazione'],
    core: 'DOLMIR CORE',
    metrics: [
      { k: 'Campi estratti per documento', v: 10 },
      { k: 'Confidenza dichiarata', v: 100, suffix: '%' },
      { k: 'Decisioni prese senza una persona', v: 0 },
    ],
    note: 'Valori della configurazione dimostrativa presente su questo sito.',
  },

  automation: {
    n: '04',
    label: 'Automazione',
    headline: 'Il flusso, dall’ingresso alla firma.',
    body:
      'Ogni processo che costruiamo ha la stessa forma: entra qualcosa, il sistema lo capisce, verifica di poterlo trattare, prepara il risultato e si ferma davanti a una persona. Quello che cambia da azienda ad azienda è il contenuto, non l’architettura.',
  },

  software: {
    n: '05',
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

  integrations: {
    n: '06',
    label: 'Integrazioni',
    headline: 'Ci colleghiamo a quello che c’è già.',
    body:
      'Un sistema che chiede di abbandonare gli strumenti esistenti non viene adottato. Il nostro strato si innesta su quello che l’azienda usa oggi, e dove non esiste un’interfaccia programmabile lo diciamo prima di firmare.',
    groups: [
      { k: 'Posta e file', items: ['Google Workspace', 'Microsoft 365', 'Drive', 'SharePoint'] },
      { k: 'Gestione', items: ['Gestionali ERP', 'CRM', 'Fatturazione', 'Magazzino'] },
      { k: 'Dati', items: ['Database', 'API REST', 'Webhook', 'Esportazioni'] },
      { k: 'Superfici', items: ['Sito', 'Portale clienti', 'Moduli', 'Applicazioni interne'] },
    ],
    caveat: 'Dove un sistema non è integrabile in modo affidabile, il perimetro lo dichiara prima dell’inizio.',
  },

  human: {
    n: '07',
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

  proof: {
    n: '08',
    label: 'Misura',
    headline: 'Quello che diventa misurabile.',
    body:
      'Quando il lavoro passa da un processo invece che da una casella, per la prima volta esistono i numeri. Non pubblichiamo percentuali di clienti che non abbiamo: questi sono i contatori della configurazione dimostrativa che gira su questo sito.',
    metrics: [
      { k: 'Documenti elaborati nella dimostrazione', v: 5, suffix: '' },
      { k: 'Campi estratti con confidenza dichiarata', v: 10, suffix: '' },
      { k: 'Casi in cui il sistema rifiuta di rispondere', v: 1, suffix: '' },
      { k: 'Decisioni prese senza una persona', v: 0, suffix: '' },
    ],
    caveat:
      'I valori di un progetto reale si misurano durante il rilievo, sui vostri dati. Prima di quel momento non esiste un numero onesto da dichiarare, e chi ve ne dichiara uno lo sta inventando.',
  },
} as const;




/* ====================================================== home === closing ======*/

export const closing = {
  label: 'Il passo successivo',
  headline: 'Vediamo cosa può diventare la vostra azienda.',
  body:
    'La prima conversazione dura venticinque minuti ed è diagnostica, non commerciale. Sei domande sul vostro processo, nessuna presentazione. Alla fine sapremo entrambi se ha senso continuare — e se non ha senso, lo diremo noi.',
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
  headline: 'Parliamo del vostro processo.',
  lead:
    'La prima conversazione è diagnostica, non commerciale. Venticinque minuti, sei domande. Alla fine sapremo entrambi se ha senso continuare — e se non ha senso, lo diremo.',
  what: [
    'Quante richieste ricevete e attraverso quali canali',
    'Chi prepara le offerte e quanto tempo serve',
    'Quanto passa fra la richiesta e la risposta',
    'Dove si ferma il processo, oggi',
  ],
  formNote:
    'Se preferite, descrivete una richiesta reale ricevuta di recente. È il modo più rapido per capire se possiamo esservi utili.',
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
