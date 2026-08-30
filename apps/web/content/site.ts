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
  tagline: 'Infrastruttura AI per aziende industriali',
  description:
    'DOLMIR costruisce l’infrastruttura digitale e AI delle aziende manifatturiere italiane: richieste di offerta, documenti e flussi di ufficio tecnico diventano processi strutturati, con una persona che approva.',
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
  eyebrow: 'Infrastruttura digitale e AI · PMI industriali · Lombardia',
  line1: 'Il lavoro industriale',
  line2: 'non dovrebbe',
  line3: 'perdersi nelle email.',
  lead:
    'Ogni richiesta che entra in azienda è lavoro potenziale. Oggi entra come testo libero, PDF e disegni, e diventa ore di ufficio tecnico. DOLMIR costruisce lo strato che la trasforma in un processo — con una persona che decide, sempre.',
  specimen: {
    label: 'Particolare in esame',
    lines: [
      ['Codice', 'FL-2280 · rev. C'],
      ['Materiale', 'Acciaio C40'],
      ['Origine', 'Allegato email, 06:41'],
      ['Stato', 'Estratto · in attesa di approvazione'],
    ] as const,
  },
  scroll: 'Scorri',
} as const;

/* ================================================== home === the story ========*/

export const chapters = {
  noise: {
    n: '01',
    label: 'Il rumore',
    headline: 'Il lavoro arriva da dodici parti diverse.',
    body:
      'In un’azienda manifatturiera il lavoro non entra da un sistema. Entra da una casella di posta condivisa, da un PDF, da un allegato senza nome, da un messaggio la sera, da una telefonata che qualcuno annota su un foglio. L’informazione c’è. La struttura no.',
    channels: [
      { k: 'Email', d: 'Testo libero, ogni cliente scrive in modo diverso.' },
      { k: 'PDF', d: 'Ordini e specifiche, spesso scansionati.' },
      { k: 'Disegni', d: 'DWG, STEP, o una foto del foglio.' },
      { k: 'Excel', d: 'Distinte inviate come allegato.' },
      { k: 'Messaggi', d: 'Richieste urgenti fuori orario.' },
      { k: 'Telefonate', d: 'Annotate a mano, se va bene.' },
    ],
    kicker:
      'Nessuno di questi canali è sbagliato. Il problema è che finiscono tutti nella stessa persona.',
  },

  cost: {
    n: '02',
    label: 'Il costo',
    headline: 'È lavoro qualificato, ripetitivo e invisibile.',
    body: [
      'Leggere la richiesta. Capire cosa serve davvero. Cercare cosa era stato quotato l’ultima volta. Ricopiare i dati nel gestionale. Scrivere l’offerta. Ricontrollare.',
      'Non compare in nessun report, non ha un centro di costo, e quando la persona che lo fa è occupata il processo si ferma. È il collo di bottiglia meno documentato dell’azienda.',
    ],
    costs: [
      { t: 'Il tempo di risposta', d: 'Nel conto terzi il cliente sceglie spesso chi risponde per primo. Un’offerta in ritardo non è un’offerta lenta: è un ordine perso.' },
      { t: 'La memoria dell’azienda', d: 'La logica di prezzo vive nella testa di due o tre persone. Non è scritta, non è trasferibile, e va in ferie ad agosto.' },
      { t: 'Gli errori di trascrizione', d: 'Un materiale sbagliato, una quantità copiata male, una revisione vecchia. Costano più del tempo che avrebbero fatto risparmiare.' },
      { t: 'La capacità che non si libera', d: 'Ogni ora spesa a ricopiare dati è un’ora non spesa su un lavoro più redditizio.' },
    ],
  },

  layer: {
    n: '03',
    label: 'Lo strato',
    headline: 'DOLMIR sta fra la casella di posta e il gestionale.',
    body:
      'Non sostituiamo niente. Copriamo i trenta metri che nessuno ha mai informatizzato, perché sono irregolari: il tratto fra “è arrivata una richiesta” e “il dato è nel sistema”. Il gestionale resta dov’è, l’officina resta com’è, le persone restano al loro posto — con meno trascrizione da fare.',
    steps: [
      { k: 'LEGGE', d: 'Mittente, oggetto, corpo, allegati. Anche quando il formato cambia ogni volta.' },
      { k: 'CAPISCE', d: 'Riconosce di cosa si tratta prima di elaborare: richiesta, ordine, altro.' },
      { k: 'ESTRAE', d: 'Materiale, quantità, tolleranze, trattamenti, tempi. Con la frase esatta da cui viene ogni dato.' },
      { k: 'VERIFICA', d: 'Dichiara quanto è sicuro di ogni campo. Sotto soglia, non procede.' },
      { k: 'CONFRONTA', d: 'Cerca nelle offerte passate quelle davvero comparabili.' },
      { k: 'PREPARA', d: 'Una bozza in italiano, con la motivazione di ogni valore proposto.' },
    ],
  },

  decision: {
    n: '05',
    label: 'La decisione',
    headline: 'Il sistema sa cosa non sa.',
    body:
      'Questa è la differenza fra uno strumento che viene usato per anni e uno che viene abbandonato dopo tre settimane. Un modello linguistico, lasciato a sé stesso, produce sempre una risposta plausibile. In un preventivo, plausibile è la cosa più pericolosa che esista.',
    verdicts: [
      { code: 'AUTO', t: 'Bozza pronta', d: 'Dati completi, precedenti comparabili trovati. La bozza è pronta per un’approvazione rapida.', tone: 'good' },
      { code: 'REVIEW', t: 'Campi da verificare', d: 'Qualcosa è sotto la soglia di confidenza. I campi incerti vengono evidenziati, non indovinati.', tone: 'amber' },
      { code: 'STIMA', t: 'Serve stima tecnica', d: 'Nessun precedente regge il confronto. Il sistema non propone un prezzo e passa la pratica al preventivista.', tone: 'amber' },
      { code: 'NO-BID', t: 'Fuori capacità', d: 'La richiesta non rientra nelle lavorazioni dichiarate. Viene segnalata subito, non dopo due giorni.', tone: 'bad' },
    ],
    quote: 'REQUIRES_TECHNICAL_ESTIMATE',
    quoteNote:
      'È una riga vera del motore. Quando compare, il sistema ha deciso di non rispondere. Non è un guasto: è la funzione più importante che abbiamo scritto.',
  },

  human: {
    n: '06',
    label: 'La persona',
    headline: 'Niente lascia l’azienda senza che qualcuno lo abbia guardato.',
    body:
      'Il sistema prepara, una persona approva. Non è una limitazione tecnica che toglieremo in una versione futura: è il perimetro. Tiene il processo fuori dalle categorie ad alto rischio del regolamento europeo sull’AI, e soprattutto tiene la responsabilità commerciale dove deve stare.',
    points: [
      { t: 'Confidenza dichiarata', d: 'Ogni dato estratto porta con sé quanto il sistema è sicuro e la frase esatta del documento da cui viene.' },
      { t: 'Il dubbio è un risultato valido', d: 'Quando non c’è una base solida il sistema lo dice e si ferma.' },
      { t: 'Tracciabilità completa', d: 'Cosa è stato letto, cosa è stato proposto, chi ha approvato. Verificabile a posteriori.' },
    ],
  },

  result: {
    n: '07',
    label: 'Il risultato',
    headline: 'Due numeri che il titolare ha già in testa.',
    body:
      'Non pubblichiamo percentuali di miglioramento prima di aver misurato. Ma i numeri su cui si lavora sono due, e non serve un consulente per capirli: quanto tempo passa fra la richiesta e la risposta, e quante richieste si riescono a evadere in una settimana.',
    metrics: [
      { k: 'Tempo di risposta', before: 'giorni', after: 'ore', note: 'Il dato che il cliente finale percepisce.' },
      { k: 'Richieste evase', before: 'quelle che si riescono', after: 'tutte', note: 'La capacità che si libera.' },
    ],
    caveat:
      'Il valore di partenza si misura durante il rilievo, sui vostri dati. Prima di quel momento non esiste un numero onesto da dichiarare, e chi ve ne dichiara uno lo sta inventando.',
  },
} as const;

/* ============================================== home === digital presence =====*/

export const presence = {
  n: '08',
  label: 'Presenza digitale',
  headline: 'Quello che l’azienda è, e quello che Google mostra.',
  body:
    'C’è un’asimmetria che si vede in tutta la manifattura italiana: officine con macchine da centinaia di migliaia di euro, certificazioni, competenze costruite in trent’anni — e un indirizzo web che comunica meno di un biglietto da visita. Non è un problema estetico. È un problema di richieste che non arrivano.',
  real: {
    label: 'Quello che l’azienda è',
    items: [
      'Centro di lavoro a 5 assi, tornitura fino a Ø400',
      'Tolleranze in H7 su serie da 1.000 pezzi',
      'Trent’anni di commesse in automotive e idraulica',
      'Certificazione di sistema, controllo dimensionale interno',
      'Un ufficio tecnico che legge disegni difficili',
    ],
  },
  shown: {
    label: 'Quello che si vede online',
    items: [
      'Nome, indirizzo, numero di telefono',
      'Una scheda su un portale di categoria',
      'Tre foto del capannone del 2014',
      'Nessuna indicazione di cosa si può chiedere',
      'Nessun modo di mandare un disegno',
    ],
  },
  kicker:
    'Un buyer che cerca un fornitore per una lavorazione specifica non trova niente da valutare. Passa oltre. Questo non si vede in nessun report, perché la richiesta che non arriva non lascia traccia.',
  build: {
    label: 'Cosa costruiamo',
    headline: 'Un front office industriale, non un sito vetrina.',
    body:
      'Lo stesso strato che struttura le richieste in entrata serve anche a far arrivare quelle giuste. Le due cose sono lo stesso progetto: una porta d’ingresso che dice esattamente cosa l’azienda sa fare, e un processo che raccoglie quello che entra.',
    items: [
      { t: 'Capacità produttive', d: 'Macchine, dimensioni massime, tolleranze, materiali lavorati. In modo che un buyer possa qualificarvi in trenta secondi.' },
      { t: 'Settori e referenze', d: 'Dove avete già lavorato, con che tipo di componenti. Senza inventare nomi che non potete pubblicare.' },
      { t: 'Documentazione tecnica', d: 'Certificazioni, schede materiali, procedure di controllo, scaricabili.' },
      { t: 'Ingresso richieste strutturato', d: 'Un modulo che raccoglie quantità, materiale, tolleranze e disegno — e che alimenta direttamente il processo di preventivazione.' },
    ],
  },
} as const;

/* ==================================================== home === ai office ======*/

export const office = {
  n: '09',
  label: 'Ufficio AI',
  headline: 'La mattina, prima che qualcuno apra la posta.',
  body:
    'Lo stesso strato applicato all’intera casella condivisa: ogni messaggio letto, classificato, instradato e messo in coda con una priorità. Chi arriva alle otto non trova quarantadue email da smistare, ma un elenco di cose da decidere.',
  clock: '08:04',
  stats: [
    { v: '14', k: 'Messaggi ricevuti', tone: 'ink' },
    { v: '9', k: 'Elaborati senza intervento', tone: 'good' },
    { v: '3', k: 'Richieste di offerta', tone: 'accent' },
    { v: '1', k: 'Richiede una persona', tone: 'amber' },
  ],
  rows: [
    { t: '06:41', from: 'acquisti@tecnoflex-lecco.example', s: 'Richiesta di offerta — flangia FL-2280', tag: 'RFQ', tone: 'accent', note: 'Bozza pronta · precedente OFF-2026-118' },
    { t: '07:02', from: 'ordini@valvenord.example', s: 'Conferma d’ordine 4471/2026', tag: 'ORDINE', tone: 'neutral', note: 'Instradato all’amministrazione' },
    { t: '07:18', from: 'info@microcomp.example', s: 'preventivo urgente', tag: 'STIMA', tone: 'amber', note: 'Dati insufficienti · assegnato al preventivista' },
    { t: '07:35', from: 'marketing@leadgen-pro.example', s: 'Posizionamento garantito sui motori di ricerca', tag: 'SCARTATO', tone: 'muted', note: 'Filtrato prima di qualsiasi elaborazione' },
    { t: '07:52', from: 'qualita@idrotecnica.example', s: 'Certificati materiale lotto 8841', tag: 'DOCUMENTO', tone: 'neutral', note: 'Archiviato e collegato alla commessa' },
  ],
  disclaimer: 'Schermata con dati di esempio. Nessuna delle aziende indicate è reale.',
} as const;

/* ======================================== home === management intelligence ====*/

export const intelligence = {
  n: '10',
  label: 'Visibilità',
  headline: 'Quello che il titolare non ha mai avuto sotto controllo.',
  body:
    'Quando le richieste passano da un processo invece che da una casella, diventano misurabili per la prima volta. Non è una dashboard in più: è la prima volta che esistono i numeri.',
  panels: [
    { k: 'Richieste ricevute', v: '112', sub: 'ultimi 30 giorni', bar: 0.82 },
    { k: 'Tempo medio di risposta', v: '5h 20m', sub: 'da 2 giorni e mezzo', bar: 0.31 },
    { k: 'Offerte aperte', v: '38', sub: 'in attesa di risposta cliente', bar: 0.55 },
    { k: 'In attesa di stima tecnica', v: '6', sub: 'assegnate a una persona', bar: 0.18 },
  ],
  series: [42, 51, 38, 66, 59, 74, 61, 88, 79, 92, 84, 112],
  disclaimer: 'Dati di esempio, a scopo illustrativo. I valori reali si misurano durante il rilievo.',
} as const;

/* ====================================================== home === closing ======*/

export const closing = {
  label: 'Il passo successivo',
  headline: 'Portateci un processo, non un’idea.',
  body:
    'La prima conversazione dura venticinque minuti ed è diagnostica, non commerciale. Sei domande sul vostro processo. Alla fine sapremo entrambi se ha senso continuare — e se non ha senso, lo diremo noi.',
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
