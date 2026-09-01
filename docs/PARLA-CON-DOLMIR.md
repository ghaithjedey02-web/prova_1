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

### La voce, adesso

La sintesi del browser non è più il piano: è la rete di sicurezza.

```
console → POST /api/voce → provider TTS neurale → MP3 → <audio>
                        ↘ 503 (nessun provider) → speechSynthesis del browser
```

`packages/ai-core/src/providers/tts.ts` sceglie il provider da quale chiave
esiste: **ElevenLabs** (`eleven_multilingual_v2`, italiano) se
`ELEVENLABS_API_KEY` è presente, altrimenti **OpenAI**
(`gpt-4o-mini-tts`) con `OPENAI_API_KEY`. Il browser riceve solo byte audio:
la chiave non lo raggiunge mai.

Il fallback del browser oggi legge **frase per frase** invece che in un
fiato solo, così almeno respira. E la riscrittura del testo è stata corretta:
prima sillabava i codici («o-r-d-e uno zero quattro…»), che è l'altro modo di
suonare come una macchina. Adesso il record viene nominato e il numero resta
un numero — «ordine 10482».

## Quando il modello non è collegato

Senza chiave configurata la rotta risponde 503 e la console mostra **uno
stato onesto**: «MODELLO NON ATTIVO SU QUESTO AMBIENTE», una spiegazione, e
il collegamento a una persona. Il campo di scrittura si disattiva e le
domande di esempio spariscono.

**Non esiste più un insieme di risposte preconfezionate.** C'era, e faceva
esattamente il danno che doveva evitare: chi provava la console incontrava
otto risposte recitate e ne concludeva — correttamente — che dietro non
c'era intelligenza. Una console che sa rispondere a otto domande preparate
*è* un albero decisionale, per quanto ben vestito. Meglio dire che il
modello non è collegato.

### Come si attiva

Una sola variabile d'ambiente sul progetto Vercel:

| variabile | effetto |
|---|---|
| `ANTHROPIC_API_KEY` | **accende la conversazione**: modello reale, strumenti, streaming |
| `DOLMIR_CONSOLE_MODEL` | opzionale, per fissare il modello |
| `ELEVENLABS_API_KEY` | voce neurale italiana (consigliata) |
| `OPENAI_API_KEY` | voce alternativa, se ElevenLabs non c'è |

Senza la prima, tutto il resto del capitolo è inerte: è la chiave che
trasforma la console da pagina a prodotto.

## Il prompt di sistema è parte del prodotto

La prima versione si comportava da guardiano: deviava i saluti, rifiutava
tutto ciò che leggeva come «fuori tema» e usava la parola *demo* come scusa
per non rispondere. Non era un limite del modello — era scritto nel prompt.

Oggi il prompt concede esplicitamente:
- rispondere a un saluto **come una persona**, senza trasformarlo in un
  disclaimer;
- ragionare **con la propria competenza** su processi, automazione, AI,
  produzione, amministrazione — senza strumenti, perché quello è mestiere,
  non un dato dell'azienda demo;
- vietato dire «sono solo una demo» come scusa.

E mantiene i vincoli veri: ogni fatto dell'azienda dimostrativa da uno
strumento, il cancello umano, NON DETERMINATO, nessuna promessa commerciale.

`packages/ai-core/test/console-prompt.test.ts` blocca la regressione: se
qualcuno rimettesse la regola del «fuori tema», il test fallisce.

## Test

- `packages/ai-core/test/console-tools.test.ts` — contratto degli strumenti,
  evidenza leggibile, i due strumenti di autocoscienza, nessun accesso fuori
  dall'azienda demo.
- `packages/ai-core/test/demo-company.test.ts` — il dataset risponde il vero.
- `apps/web/test/speech-text.test.ts` — la riscrittura per la voce.
- QA browser: streaming, stadi, evidenza, cancello (APPROVA/MODIFICA/RIFIUTA
  con ripresa della conversazione), NON DETERMINATO, tastiera, modalità
  ridotta, 320 → 3440 px, reduced motion.
