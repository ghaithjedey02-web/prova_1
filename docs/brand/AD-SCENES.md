# DOLMIR — Scene pubblicitarie modulari

Il sito è il girato. Le rotte `/scene/*` rendono un'esperienza alla volta
senza chrome (niente nav, footer, readout) — si registra lo schermo e si
ottiene un master pulito. Non indicizzate, non linkate dalla navigazione.

**Come registrare:** Chrome a finestra 1920×1080 (o 1080×1920 per i
verticali via device toolbar), registrazione schermo 60fps, poi crop in
edit. Palette e tipografia sono già quelle del brand.

| Concept | Rotta | Ricetta | Overlay proposto | Formati |
|---|---|---|---|---|
| «Dal caos al sistema.» | `/scene/trasformazione` | Lasciar partire l'auto-play (i nodi sparsi si ricompongono, ~4s), poi trascinare il fader PRIMA→DOPO a mano. | «Il lavoro si disperde. / DOLMIR lo ricompone.» | 16:9 · 9:16 |
| «Dall'email all'azione.» | `/scene/demo` | Tab 01 Manifattura → AVVIA → lasciare correre fino al cancello → APPROVA. ~12s totali. | «Legge. Verifica. Prepara. / Tu approvi.» | 16:9 · 1:1 |
| «L'AI che non indovina.» | `/scene/demo` | Tab 06 Caso difficile → AVVIA → fermarsi sul cancello rosso (IL SISTEMA NON INDOVINA). | «Quando non è sicuro, / si ferma e chiede.» | 9:16 |
| «Dentro l'intelligenza.» | `/scene/intelligenza` | Nessuna interazione: 8–10s di flussi nel core, poi hover su EMAIL. | «Input → Intelligenza → Azione.» | 16:9 |
| «Dal pezzo al sistema.» | `/scene/materia` | Scroll lento e costante per tutta la sequenza (fisico→punti→record), ~15s. | «La stessa cosa, / a quattro livelli.» | 16:9 |
| «Il film.» (master 25s) | `/scene/film` | Auto-play: un unico piano sequenza WebGL. Al cancello (t≈17,5s) il mondo si ferma in ambra: premere APPROVA per il finale, o RIFIUTA per la variante «Fermato». | Le didascalie sono già nel film. | 16:9 · 9:16 · 1:1 |

**Capitoli del film** (per tagli e clip): IL CAOS 0–4,5s · SCANSIONE
4,5–8s · COMPRENSIONE 8–13s · CONNESSIONE 13–17,5s · REVISIONE UMANA
(pausa reale, durata a scelta) · AZIONE 17,5–21s · RISULTATO 21–25s.
La barra dei capitoli in alto è cliccabile: si può far ripartire la
registrazione da qualunque capitolo. Un clip verticale forte: solo
CONNESSIONE→REVISIONE→AZIONE (~10s + pausa).

**Regole:** mai musica epica, mai voce entusiasta; sottotitoli mono
bianchi; i numeri mostrati sono di simulazione e nei post vanno dichiarati
tali; chiusura sempre su card nera `DOLMIR · dolmir.com`.
