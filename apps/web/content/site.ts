/**
 * All visible copy, in one place.
 *
 * Two reasons it lives here rather than inside components:
 *  1. Copy is the thing we will iterate on most, and it should not require
 *     touching layout code to change a sentence.
 *  2. It makes a second language additive — a parallel object, not a rewrite.
 *
 * Voice rules, enforced by review:
 *  - Never "rivoluzionare", "potenza dell'AI", "portare nel futuro".
 *  - Name the work, not the technology. The buyer cares about preventivi,
 *    not about models.
 *  - Never claim a number we have not measured at a client.
 */

export const site = {
  name: 'DOLMIR',
  domain: 'dolmir.com',
  url: 'https://dolmir.com',
  tagline: 'Ingegneria di processi con AI',
  description:
    'DOLMIR progetta sistemi AI per i processi ripetitivi delle aziende manifatturiere in Lombardia. Misuriamo il processo, lo riprogettiamo e lo consegniamo con il controllo umano al centro.',
  locale: 'it_IT',
  email: 'info@dolmir.com',
} as const;

export const nav = [
  { href: '/metodo', label: 'Metodo' },
  { href: '/dimostrazione', label: 'Dimostrazione' },
  { href: '/studio', label: 'Studio' },
  { href: '/contatto', label: 'Contatto' },
] as const;

export const cta = {
  primary: { label: 'Mostrateci un processo', href: '/contatto' },
  secondary: { label: 'Vedi la dimostrazione', href: '/dimostrazione' },
} as const;

/* ------------------------------------------------------------------ home --- */

export const hero = {
  eyebrow: 'Ingegneria di processi con AI · Lombardia',
  headline: 'Il lavoro che non si vede è quello che costa di più.',
  lead:
    'Richieste di offerta lette e ricopiate a mano. Documenti che passano da una casella all’altra. Dati inseriti due volte. DOLMIR misura questi processi, li riprogetta e li consegna come sistemi che una persona continua a controllare.',
  principles: [
    { k: '01', t: 'Prima misuriamo', d: 'Nessun processo viene automatizzato prima di essere misurato sui vostri numeri reali.' },
    { k: '02', t: 'L’ultima parola è umana', d: 'Il sistema prepara. Una persona verifica e approva. Sempre.' },
    { k: '03', t: 'Il gestionale resta dov’è', d: 'Lavoriamo accanto ai sistemi che già usate. Non li sostituiamo.' },
  ],
} as const;

export const problem = {
  label: 'Il problema',
  headline: 'Non è un problema di software. È un problema di ore.',
  body: [
    'In un’azienda manifatturiera da trenta persone, il lavoro più costoso non è quello in officina. È quello che una o due persone fanno davanti a una casella di posta: leggere una richiesta, capire cosa serve, cercare cosa era stato quotato l’ultima volta, ricopiare i dati, scrivere l’offerta.',
    'È un lavoro qualificato, ripetitivo e invisibile. Non compare in nessun report. Non ha un centro di costo. E quando la persona che lo fa è occupata, o in ferie, si ferma.',
  ],
  costs: [
    { t: 'Il tempo di risposta', d: 'Nel conto terzi il cliente sceglie spesso chi risponde per primo. Un’offerta in ritardo non è un’offerta lenta: è un ordine perso.' },
    { t: 'La memoria dell’azienda', d: 'La logica di prezzo vive nella testa di poche persone. Non è scritta da nessuna parte, e non è trasferibile.' },
    { t: 'Gli errori di trascrizione', d: 'Un materiale sbagliato, una quantità copiata male, una revisione vecchia. Costano più del tempo che avrebbero fatto risparmiare.' },
    { t: 'La capacità che non si libera', d: 'Ogni ora spesa a ricopiare dati è un’ora non spesa a seguire un cliente o a valutare un lavoro più redditizio.' },
  ],
} as const;

export const approach = {
  label: 'Cosa facciamo',
  headline: 'Un processo alla volta, scelto perché è quello che costa.',
  steps: [
    {
      k: '01',
      t: 'Individuiamo il processo',
      d: 'Non partiamo dalla tecnologia. Partiamo dalle attività che si ripetono ogni settimana, che occupano persone qualificate e che hanno un costo misurabile quando vanno male.',
    },
    {
      k: '02',
      t: 'Lo misuriamo sui vostri dati',
      d: 'Quante richieste arrivano davvero. Quanto tempo serve per ciascuna. Dove si ferma. Analizziamo casi reali vostri, non medie di settore.',
    },
    {
      k: '03',
      t: 'Progettiamo il sistema',
      d: 'Estrazione dei dati, controlli di affidabilità, recupero dello storico, preparazione dell’output. Ogni passaggio è verificabile e ogni decisione è tracciata.',
    },
    {
      k: '04',
      t: 'Consegniamo con il controllo',
      d: 'Il sistema prepara, una persona approva. Installiamo anche la misurazione, così potete verificare il risultato senza doverci credere sulla parola.',
    },
  ],
} as const;

export const control = {
  label: 'Il principio',
  headline: 'Il sistema prepara. La persona decide.',
  body:
    'Un preventivo sbagliato costa denaro vero. Per questo nessun output lascia l’azienda senza che qualcuno lo abbia guardato. Non è una limitazione tecnica: è il motivo per cui uno strumento del genere viene usato ogni giorno invece di essere abbandonato dopo due settimane.',
  points: [
    { t: 'Confidenza dichiarata', d: 'Ogni dato estratto porta con sé quanto il sistema è sicuro, e la frase esatta del documento da cui viene.' },
    { t: 'Il dubbio è un risultato valido', d: 'Quando non c’è una base solida, il sistema lo dice e si ferma. Non produce un numero plausibile.' },
    { t: 'Tracciabilità completa', d: 'Ogni passaggio è registrato: cosa è stato letto, cosa è stato proposto, chi ha approvato.' },
  ],
} as const;

export const outcome = {
  label: 'Il risultato',
  headline: 'Due numeri che l’azienda già conosce.',
  body:
    'Non promettiamo percentuali prima di aver misurato. Ma i numeri su cui lavoriamo sono due, e sono numeri che un titolare ha già in testa: quanto tempo passa fra la richiesta e la risposta, e quante richieste si riescono a evadere in una settimana.',
  metrics: [
    { k: 'Tempo di risposta', before: 'giorni', after: 'ore', note: 'Il dato che il cliente finale percepisce.' },
    { k: 'Richieste evase', before: 'quelle che si riescono', after: 'tutte', note: 'La capacità che si libera.' },
  ],
  caveat:
    'Il valore di partenza si misura durante l’audit, sui vostri dati. Prima di quel momento non esiste un numero onesto da dichiarare.',
} as const;

export const trust = {
  label: 'Responsabilità',
  headline: 'Quello che non facciamo.',
  body:
    'Un fornitore che dice di poter fare tutto è un fornitore di cui diffidare. Questi sono i limiti che ci diamo, e li dichiariamo prima di firmare.',
  items: [
    { t: 'Non decidiamo i prezzi al posto vostro', d: 'Il sistema propone una base motivata. La decisione commerciale resta vostra.' },
    { t: 'Non leggiamo i disegni per calcolare i tempi macchina', d: 'È un problema difficile e non lo promettiamo. Automatizziamo la parte che si può automatizzare bene.' },
    { t: 'Non inviamo niente ai vostri clienti', d: 'Il sistema prepara una bozza. L’invio è un gesto umano.' },
    { t: 'Non sostituiamo il vostro gestionale', d: 'Ci integriamo con quello che avete. Se non è integrabile, lo diciamo prima.' },
    { t: 'Non usiamo i vostri dati per altro', d: 'I disegni dei vostri clienti sono proprietà intellettuale dei vostri clienti. Non addestriamo nulla, non li condividiamo, non li riutilizziamo.' },
    { t: 'Non promettiamo agevolazioni fiscali', d: 'Un progetto software di norma non accede da solo a Transizione 5.0. Chi ve lo promette non ha letto i requisiti.' },
  ],
} as const;

export const security = {
  label: 'Dati e sicurezza',
  headline: 'Principi, non certificazioni che non abbiamo.',
  body:
    'DOLMIR è una realtà giovane e non dichiara certificazioni che non possiede. Dichiara invece come lavora con i dati, e lo mette per iscritto nel contratto.',
  items: [
    { t: 'Minimizzazione', d: 'Trattiamo solo i dati necessari al processo concordato. Niente raccolta preventiva “nel caso servisse”.' },
    { t: 'Isolamento per cliente', d: 'La logica di prezzo e lo storico offerte di un’azienda non vengono mai messi in comune con altri clienti.' },
    { t: 'Fornitori dichiarati', d: 'Ogni fornitore tecnologico coinvolto è nominato nel contratto come responsabile del trattamento, con diritto di obiezione.' },
    { t: 'Residenza dei dati', d: 'L’architettura consente elaborazione in area europea e, dove necessario, l’esecuzione su infrastruttura del cliente.' },
    { t: 'Supervisione umana', d: 'Nessuna decisione automatica sul cliente finale. Questo tiene il sistema fuori dalle categorie ad alto rischio del regolamento europeo sull’AI.' },
    { t: 'Registro delle operazioni', d: 'Ogni elaborazione è tracciata e verificabile a posteriori.' },
  ],
} as const;

/* ---------------------------------------------------------------- metodo --- */

export const metodo = {
  title: 'Metodo',
  headline: 'Come lavoriamo, dal primo incontro al sistema in produzione.',
  lead:
    'Un progetto AI fallisce quasi sempre per lo stesso motivo: viene scelta la tecnologia prima di avere capito il processo. Il nostro metodo è costruito per rendere quell’errore difficile da commettere.',
  phases: [
    { k: '01', t: 'Capire', d: 'Una conversazione diagnostica di venticinque minuti. Sei domande sul processo, nessuna presentazione. Alla fine sappiamo entrambi se ha senso continuare.', out: 'Una valutazione onesta, anche negativa.' },
    { k: '02', t: 'Mappare', d: 'Ricostruiamo il processo com’è oggi: chi fa cosa, con quali strumenti, dove si ferma. Interviste brevi con le persone che lo eseguono davvero.', out: 'Il processo attuale, documentato.' },
    { k: '03', t: 'Misurare', d: 'Analizziamo casi reali recenti — volume, tempi, canali, esiti. È il passaggio che trasforma le impressioni in numeri.', out: 'La linea di partenza, sui vostri dati.' },
    { k: '04', t: 'Progettare', d: 'Definiamo quali passaggi vengono automatizzati, quali restano umani e quali controlli servono. Il perimetro viene scritto: cosa è incluso e, soprattutto, cosa non lo è.', out: 'Specifica tecnica e proposta a prezzo fisso.' },
    { k: '05', t: 'Validare', d: 'Prima dell’implementazione completa verifichiamo l’accuratezza sui vostri documenti storici. Se non raggiunge la soglia concordata, non si procede.', out: 'Accuratezza misurata, non dichiarata.' },
    { k: '06', t: 'Implementare', d: 'Costruzione, integrazione con i sistemi esistenti, formazione delle persone che lo useranno, trenta giorni di assistenza rafforzata.', out: 'Sistema in produzione.' },
    { k: '07', t: 'Ottimizzare', d: 'L’accuratezza si degrada quando cambiano i documenti in ingresso o i mercati. Revisione mensile e taratura continua.', out: 'Accuratezza mantenuta nel tempo.' },
  ],
  engagement: {
    label: 'Impegno',
    headline: 'Si comincia da una cosa piccola.',
    body:
      'Il primo passo è un Audit di Processo: dieci giorni lavorativi, prezzo fisso di 2.900 €, interamente scomputato se si prosegue con l’implementazione. Serve a produrre i numeri su cui decidere — compreso, se è il caso, il numero che dice di non procedere.',
    note: 'Il costo di un’implementazione dipende dal perimetro e viene definito alla fine dell’audit, non prima.',
  },
} as const;

/* ---------------------------------------------------------------- studio --- */

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
        'Ma l’ostacolo dichiarato più frequentemente non è il costo e non è la diffidenza: è la mancanza di competenze interne, indicata dal 58,6% delle imprese. Non serve convincere nessuno del valore. Serve qualcuno che faccia il lavoro.',
      ],
    },
    {
      t: 'Cosa abbiamo osservato',
      body: [
        'La maggior parte dei progetti AI nelle PMI parte dallo strumento e cerca un problema da risolvere. È il verso sbagliato. Il risultato sono automazioni che funzionano in demo e che nessuno usa dopo tre settimane.',
        'I processi che valgono davvero hanno tre caratteristiche: si ripetono con alta frequenza, occupano persone qualificate, e hanno un costo visibile quando vanno male. Sono meno affascinanti di un assistente conversazionale. Sono anche gli unici che ripagano.',
      ],
    },
    {
      t: 'Come lavoriamo',
      body: [
        'Un processo alla volta. Misurato prima, progettato dopo. Con una persona che approva ogni risultato che esce dall’azienda.',
        'Preferiamo dire di no a un progetto che non regge, piuttosto che venderlo e consegnarlo male. In un settore dove le aziende si conoscono tutte, è anche la scelta commercialmente più sensata.',
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
  honesty: {
    t: 'Una nota di trasparenza',
    body:
      'DOLMIR è una realtà nuova. Non pubblichiamo loghi di clienti, testimonianze o casi studio perché non ne abbiamo ancora — e inventarli sarebbe il modo più rapido per perdere la sola cosa che conta in questo mestiere. Quello che potete valutare adesso è il metodo, la dimostrazione qui accanto, e la conversazione.',
  },
} as const;

/* -------------------------------------------------------------- contatto --- */

export const contatto = {
  title: 'Contatto',
  headline: 'Parliamo del vostro processo.',
  lead:
    'La prima conversazione è diagnostica, non commerciale. Venticinque minuti, sei domande sul vostro processo di preventivazione. Alla fine sapremo entrambi se ha senso continuare — e se non ha senso, lo diremo.',
  what: [
    'Quante richieste ricevete e attraverso quali canali',
    'Chi prepara le offerte e quanto tempo serve',
    'Quanto passa fra la richiesta e la risposta',
    'Dove si ferma il processo, oggi',
  ],
  formNote:
    'Se preferite, allegate o descrivete una richiesta reale ricevuta di recente. È il modo più rapido per capire se possiamo esservi utili.',
  privacy:
    'I dati inviati vengono usati esclusivamente per rispondervi. Nessuna newsletter, nessuna condivisione con terzi.',
} as const;

/* ----------------------------------------------------------------- demo --- */

export const demoCopy = {
  title: 'Dimostrazione',
  headline: 'Cinque email arrivate in una mattina.',
  lead:
    'Questa è la stessa logica che gira nei sistemi che consegniamo, con dati di esempio. Scegliete un’email e osservate cosa succede — compreso il caso in cui il sistema si rifiuta di proporre un prezzo.',
  disclaimer: 'Dimostrazione con dati di esempio. Aziende e documenti non sono reali.',
} as const;
