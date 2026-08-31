# PARLA CON DOLMIR — architettura della console

La console non è un chatbot sul sito: è il prodotto, in versione pubblica.
Un modello reale, con strumenti reali, su un'azienda **dimostrativa** con dati
simulati — e ogni passo del suo lavoro è visibile mentre accade.

## Il percorso di una domanda

```
VISITATORE  (voce o tastiera)
   │
   ▼
BROWSER     components/live/Parla.tsx
            lib/console-client.ts   → legge lo stream di eventi
            lib/voice.ts            → riconoscimento, sintesi, livello microfono
   │  POST /api/parla  { messages: [...] }        (nessuna chiave, mai)
   ▼
SERVER      apps/web/app/api/parla/route.ts       runtime nodejs, force-dynamic
            · 503 se non c'è modello configurato   → console in MODALITÀ RIDOTTA
            · 429 oltre 12 richieste/minuto/IP
            · storia limitata a 16 turni, 600 caratteri per messaggio
   ▼
MODELLO     packages/ai-core/src/providers/anthropic-console.ts
            streamConsole(): ciclo tool-use manuale, streaming
   ▼
STRUMENTI   packages/ai-core/src/demo-company.ts
            get_orders · get_order · get_delayed_orders · get_customer ·
            get_quotation · get_invoice · get_conflicts ·
            get_production_status · search_documents
            request_human_decision · declare_not_determined
   ▼
RISPOSTA    verificata, con l'evidenza attaccata → torna al visitatore
```

## Gli eventi (SSE)

Il server manda `data: {json}\n\n` per ogni passo, appena accade:

| evento | significato nell'interfaccia |
|---|---|
| `stage` | ANALISI → DATI → VERIFICA → DECISIONE → RISPOSTA si accendono |
| `evidence` | «3 ordini consultati» compare nel pannello, con il dettaglio |
| `delta` | la risposta si scrive, parola per parola |
| `gate` | il cancello umano: domanda, opzioni, APPROVA / MODIFICA / RIFIUTA |
| `unknown` | NON DETERMINATO, con l'elenco di cosa manca |
| `done` | testo finale consolidato |

Niente è simulato: se il pannello mostra VERIFICA, il modello ha davvero
chiamato un secondo strumento. Un'animazione di attesa mostrerebbe la stessa
cosa in una stanza vuota — questo no.

## I due strumenti che parlano del sistema stesso

`request_human_decision` e `declare_not_determined` non restituiscono dati:
sono il modo in cui il modello dice qualcosa **su di sé** in una forma che
l'interfaccia rende come stato invece che come prosa.

- **Cancello umano** — il modello trova un bivio vero (dati in conflitto, o
  un'azione che impegna l'azienda), elenca le alternative con la loro
  evidenza e si ferma. La scelta della persona rientra nella conversazione
  come istruzione: il modello riprende **da lì**.
- **NON DETERMINATO** — i dati non bastano. Il modello lo dichiara ed elenca
  cosa mancherebbe. Una risposta fluente inventata è l'errore più grave che
  possa commettere, e lo dice il prompt di sistema.

Sono strumenti, non copy: «il sistema si ferma prima di decidere» e «il
sistema dice quando non sa» non sono promesse scritte nella pagina, sono
l'unica strada che il modello ha per esprimerle.

## Sicurezza

- La chiave vive in `ANTHROPIC_API_KEY` sul server. Non esiste percorso dal
  browser alla chiave: il client parla solo con `/api/parla`.
- Il modello può raggiungere **solo** gli strumenti dell'azienda demo. Non
  c'è connessione a sistemi reali di nessun cliente.
- Rate limit per IP, storia e lunghezza dei messaggi limitate, `AbortSignal`
  legato alla richiesta (chi interrompe ferma anche il modello).
- Solo `packages/ai-core/src/providers/` può importare l'SDK del fornitore:
  il bundle del browser non contiene nulla del vendor.

## Voce

- **Riconoscimento**: Web Speech `it-IT`, continuo, con risultati parziali —
  quello che dite compare mentre lo dite.
- **Barge-in**: parlare interrompe la sintesi a metà frase.
- **Livello reale**: un `AnalyserNode` sul microfono guida l'anello del
  Nucleo. In una stanza silenziosa l'anello resta fermo: è una misura.
- **Sintesi**: la migliore voce italiana installata (neurale > Google >
  locali con nome), e il testo viene riscritto prima di essere letto —
  `lib/speech-text.ts`, testato — perché «ORD-10482» letto lettera per
  lettera è la cosa che fa suonare un sistema come una macchina.

Limite noto e dichiarato: la sintesi resta quella del browser. Una voce
neurale di livello prodotto richiede un provider TTS server-side (chiave e
costo per carattere): l'architettura è pronta ad accoglierlo — la sintesi è
isolata in `lib/voice.ts` — ma non è stata aggiunta senza una decisione sul
fornitore.

## Modalità ridotta

Senza chiave configurata la rotta risponde 503 e la console:
1. mostra **MODALITÀ RIDOTTA** in testata,
2. risponde da un piccolo insieme dichiarato di risposte,
3. scrive «Demo dimostrativa · risposte predefinite · dati di esempio».

Non finge mai di essere il modello live. Per attivarlo: `ANTHROPIC_API_KEY`
fra le variabili d'ambiente del progetto Vercel (opzionale
`DOLMIR_CONSOLE_MODEL`).

## Test

- `packages/ai-core/test/console-tools.test.ts` — contratto degli strumenti,
  evidenza leggibile, i due strumenti di autocoscienza, nessun accesso fuori
  dall'azienda demo.
- `packages/ai-core/test/demo-company.test.ts` — il dataset risponde il vero.
- `apps/web/test/speech-text.test.ts` — la riscrittura per la voce.
- QA browser: streaming, stadi, evidenza, cancello (APPROVA/MODIFICA/RIFIUTA
  con ripresa della conversazione), NON DETERMINATO, tastiera, modalità
  ridotta, 320 → 3440 px, reduced motion.
