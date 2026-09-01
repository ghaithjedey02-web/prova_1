# DA COMPLETARE — dati e credenziali che mancano

Tutto ciò che il sito non può inventare. Ogni voce ha un segnaposto
dichiarato nel codice: nessuna di queste è stata riempita con un valore
plausibile, perché un dato legale inventato è una bugia stampata su ogni
pagina.

## 1. Dati legali dell'azienda

| dato | dove | stato oggi |
|---|---|---|
| Partita IVA | `apps/web/content/site.ts` → `site.vat` | `'in registrazione'` |
| Ragione sociale completa | `site.legalName` | `'DOLMIR'` |
| Sede legale | non ancora mostrata | assente |
| Telefono | non ancora mostrato | assente |
| REA / capitale sociale | non ancora mostrati | assenti |

Quando esistono: aggiornare `site.ts`. Il footer e le pagine legali li
leggono da lì, quindi si aggiornano da soli.

**Non aggiungere** certificazioni, numeri di clienti, percentuali di
risparmio o referenze finché non sono verificabili.

## 2. Variabili d'ambiente (Vercel → Settings → Environment Variables)

| variabile | cosa accende | senza di essa |
|---|---|---|
| `ANTHROPIC_API_KEY` | **la console AI**: modello reale, strumenti, streaming | la console dice «Modello non attivo su questo ambiente» e offre il contatto |
| `DOLMIR_CONSOLE_MODEL` | fissa il modello (opzionale) | default interno |
| `ELEVENLABS_API_KEY` | voce neurale italiana (consigliata) | ripiego sulla voce del browser |
| `ELEVENLABS_VOICE_ID` / `ELEVENLABS_MODEL` | scelta della voce (opzionale) | default multilingue |
| `OPENAI_API_KEY` | voce alternativa, se manca ElevenLabs | come sopra |

`ANTHROPIC_API_KEY` è l'unica che cambia il prodotto: senza, il capitolo
02 non ha nulla dietro.

## 3. Contatto

`/api/contatto` risponde 501: manca un provider email (Resend, Postmark,
SES…). Il modulo di contatto lo dice invece di fingere l'invio.

## 4. Film

Il master del film è ospitato fuori dal repo. Per servirlo in prima
persona: scaricarlo (URL in `docs/video/DOLMIR-FILM.md`) e salvarlo come
`apps/web/public/film/dolmir-film.mp4`. Senza, il componente passa al
master remoto e poi al film procedurale WebGL.

## 5. Google

L'identità tecnica è completa (favicon 16/32/48, apple-touch, 192/512,
manifest, canonical, Open Graph, JSON-LD). **Quando** Google aggiorni
l'icona e lo snippet nei risultati non dipende da noi: si può sollecitare
una nuova scansione da Search Console, ma non promettere una data.
