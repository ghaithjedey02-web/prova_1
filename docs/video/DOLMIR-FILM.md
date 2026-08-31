# DOLMIR — Film di introduzione (45–60s)
## Pacchetto di produzione completo

> Stato: PRONTO PER LA PRODUZIONE — non generato automaticamente.
> Valutazione Higgsfield (31-08-2026): account Pro attivo, 543 crediti.
> Nessun workflow disponibile corrisponde al registro richiesto: i flussi
> talking-head sono esplicitamente in stile UGC/creator (il registro che il
> brief vieta), e il flusso "faceless" esclude presentatori in camera.
> Generare comunque avrebbe prodotto esattamente il "video da AI influencer"
> da evitare. Due strade concrete più sotto, in "Come produrlo".

---

## Concetto

Un film da azienda tecnologica, non uno spot. Voce calma, ritmo lento,
tagli netti. Il presentatore parla come un consulente che spiega una cosa
vera, non come un venditore. Le immagini di sistema NON sono stock né
generate: sono catture reali del sito DOLMIR — il core, la trasformazione,
il simulatore — che è già il miglior filmato di sistema che possediamo.

**Durata:** 50s ± 5s · **Formati:** 16:9 master (sito, YouTube), ritagli
9:16 e 1:1 per social · **Lingua:** italiano · **Sottotitoli:** bruciati,
bianchi, font mono, stile telemetria.

## Sceneggiatura (voce)

| # | t | Voce (italiano) | Immagine |
|---|-----|---|---|
| 1 | 0–6s | «Il lavoro di un'azienda non vive in un solo software.» | Presentatore, mezzo busto, fondo grigio-nero, luce laterale fredda. |
| 2 | 6–14s | (silenzio, solo ambiente) | Tagli rapidi, 1s ciascuno: EMAIL → PDF → EXCEL → ERP → CRM → PERSONE. Ogni parola come etichetta mono su schermata reale corrispondente (inbox, allegato, foglio, gestionale). |
| 3 | 14–20s | «DOLMIR li collega.» | Cattura reale: la trasformazione del sito (capitolo 03) — i dodici sistemi sparsi che si ricompongono nell'anello. |
| 4 | 20–32s | «Legge. Verifica. Prepara. E si ferma, quando serve una decisione.» | Cattura reale del simulatore: il documento che si sottolinea, i campi che appaiono con la confidenza, poi il cancello ambra che ferma tutto. Una parola per scena: LEGGE / VERIFICA / PREPARA / SI FERMA. |
| 5 | 32–40s | «Non sostituiamo il giudizio. Costruiamo il sistema che lo rende più veloce.» | Presentatore. Alle sue spalle, fuori fuoco, il core DOLMIR proiettato. |
| 6 | 40–48s | (silenzio) | Il cancello: mano reale che preme APPROVA. L'azione parte. Il registro scrive. |
| 7 | 48–55s | «Scopri cosa possiamo costruire per la tua azienda.» | Nero. Logo DOLMIR. dolmir.com. Riga finale mono: SISTEMA · VERIFICA · PERSONA · AZIONE. |

## Direzione presentatore
Uomo o donna 35–50, abito semplice scuro senza cravatta, tono da spiegazione
tecnica — mai entusiasta, mai promozionale. Guarda in camera. Pause vere.
Nessuna gesticolazione da spot.

## Direzione visiva
Palette del sito: nero `#08090B`, bianco `#F2F4F5`, ciano `#45C7DE` solo
per gli eventi di sistema, ambra `#E3A551` SOLO al cancello umano. Grana
leggera. Nessun gradiente viola, nessun robot, nessuna stock footage.

## Come produrlo
**Strada A — reale (consigliata):** presentatore vero, mezza giornata di
studio; le scene di sistema sono screen-capture 4K del sito (già pronte:
basta registrare le sezioni 02, 03, 05). Montaggio 1 giorno.
**Strada B — ibrida Higgsfield:** generare SOLO il presentatore con un
flusso talking-head neutro (esiste il rischio concreto di registro UGC:
da verificare con un test da ~1 scena prima di impegnare crediti),
narrare con il flusso `narrator` (voce IT), montare con `video-editing`
sopra le capture reali del sito. Costo stimato: 100–200 crediti.
Decisione da prendere insieme prima di spendere.

## Posizionamento nel sito
Sopra la piega NO. Slot naturale: dentro il capitolo 01 (Il problema),
come momento cinematografico facoltativo «GUARDA IL FILM · 50s», caricato
lazy, mai in autoplay con audio.

---

## Prompt Higgsfield per scena (strada B)

Regole comuni a ogni prompt: `cinematic, near-black background #08090B,
cold side light, precise typography-free frame, no text, no logos, no
robots, no purple gradients, film grain subtle, 24fps look, premium
enterprise technology film` — aspect 16:9, durata 4–8s per clip.

- **S1/S5 (presentatore):** *"Italian business consultant, 40s, dark
  simple suit no tie, seated half-bust against graphite studio wall,
  single cold key light from left, calm direct gaze to camera, shallow
  depth, documentary realism, no gestures"* — testare UNA scena prima di
  impegnare crediti: se il registro scivola verso l'avatar-UGC, passare
  alla strada A.
- **S2 (frammenti):** niente generazione — sei screen-capture reali
  (inbox, PDF, foglio, gestionale, CRM, scrivania) con etichette mono
  aggiunte in edit.
- **S3/S4/S6 (sistema):** niente generazione — capture 4K del sito:
  trasformazione (cap. 03), simulatore con evidenza e cancello (cap. 02),
  APPROVA premuto. Il sito È il filmato di sistema.
- **S7 (chiusura):** card nera generata in edit, non con AI: logo DOLMIR,
  dolmir.com, riga mono `SISTEMA · VERIFICA · PERSONA · AZIONE`.

**Consegna:** master 16:9 H.264 ≤ 12 MB per il web →
`apps/web/public/film/dolmir-intro.mp4` (+ poster
`dolmir-intro-poster.jpg`). Il sito ha già lo slot: il video appare nel
capitolo 01 appena il file esiste, lazy e senza autoplay.
