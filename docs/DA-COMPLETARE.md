# DA COMPLETARE — dati e credenziali che mancano

Tutto ciò che il sito non può inventare. Ogni voce ha un segnaposto
dichiarato nel codice: nessuna di queste è stata riempita con un valore
plausibile, perché un dato legale inventato è una bugia stampata su ogni
pagina.

## 1. Dati legali dell'azienda

| dato | dove | stato oggi |
|---|---|---|
| Partita IVA | `apps/web/content/site.ts` → `site.vat` | **inserita** (04282240136, dal documento Agenzia delle Entrate) |
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
| `ANTHROPIC_WORKSPACE_ID` | **obbligatoria se la chiave è di tipo *identity-linked*** (vedi sotto) | Anthropic rifiuta ogni richiesta con 400 e la console resta offline |
| `DOLMIR_CONSOLE_MODEL` | fissa il modello (opzionale) | default `claude-opus-5` |
| `ELEVENLABS_API_KEY` | voce neurale italiana (consigliata) | ripiego sulla voce del browser |
| `ELEVENLABS_VOICE_ID` / `ELEVENLABS_MODEL` | scelta della voce (opzionale) | default multilingue |
| `OPENAI_API_KEY` | voce alternativa, se manca ElevenLabs | come sopra |

`ANTHROPIC_API_KEY` è l'unica che cambia il prodotto: senza, il capitolo
02 non ha nulla dietro.

### La chiave in produzione è *identity-linked*: serve il workspace

Verificato il 2026-09-02 dal log del server: Anthropic risponde
`400 — anthropic-workspace-id is required when authenticating with an
identity-linked API key`. La chiave presente su Vercel è legata a una
persona, non a un workspace, e ogni richiesta deve dichiarare in quale
workspace agisce. Il codice invia l'intestazione quando la variabile esiste.
Due strade, una sola basta:

1. **Aggiungere `ANTHROPIC_WORKSPACE_ID`** su Vercel (Production):
   Console Anthropic → *Settings → Workspaces* → aprire il workspace →
   copiare l'id (`wrkspc_…`). Poi *Redeploy*.
2. **Oppure** creare in Console una chiave normale legata al workspace
   (*API Keys → Create Key*, scegliendo il workspace) e sostituire
   `ANTHROPIC_API_KEY`. In quel caso `ANTHROPIC_WORKSPACE_ID` non serve.

Dal commit di oggi il server prova a cavarsela da solo: senza
`ANTHROPIC_WORKSPACE_ID`, elenca i workspace in cui la chiave può agire
(endpoint *List Workspaces*, accettato dalle chiavi identity-linked non
vincolate) e, se ce n'è uno solo attivo — o uno chiamato DOLMIR/Production
— usa quello, registrandolo nel log come `[parla] workspace resolved …`.
Il valore in `ANTHROPIC_WORKSPACE_ID`, se presente, ha sempre la
precedenza.

Resta un caso in cui serve un'azione manuale: se la chiave agisce solo nel
**Default Workspace**, l'elenco arriva vuoto (Anthropic non lo include) e il
log dice `workspace not decidable`. Allora la strada più semplice è la 2:
creare in Console una chiave **vincolata a un workspace** e sostituire
`ANTHROPIC_API_KEY`.

Finché uno dei due non è vero, la console mostra «Modello non attivo su
questo ambiente» — non una risposta finta — e il log riporta
`[parla] workspace 400 …`.

## 3. Contatto (Vercel → Settings → Environment Variables)

`/api/contatto` è pronto: valida, filtra i bot (campo honeypot), limita gli
invii per IP e spedisce via Resend con una chiamata HTTPS diretta. Senza
provider risponde 501 e il modulo lo dice, invece di fingere l'invio.

| variabile | cosa fa | default |
|---|---|---|
| `RESEND_API_KEY` | accende l'invio (resend.com → API Keys) | assente → 501 |
| `CONTACT_TO` | destinatario delle richieste | `info@dolmir.com` |
| `CONTACT_FROM` | mittente, su un dominio verificato in Resend | `DOLMIR <contatto@dolmir.com>` |

Per usare `contatto@dolmir.com` come mittente va verificato `dolmir.com` in
Resend (record DNS DKIM/SPF che Resend indica).

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

## 6. Dominio `www.dolmir.com` (Vercel → Settings → Domains)

Verificato dall'esterno il 2026-09-02: `https://dolmir.com` risponde 200 a
browser, Googlebot e Bingbot; `https://www.dolmir.com` **fallisce il TLS**
(`ERR_CERT_COMMON_NAME_INVALID`) perché il certificato copre solo
`dolmir.com`. Il DNS di `www` punta già a Vercel (CNAME → `dolmir.com`),
ma il dominio non è aggiunto al progetto, quindi Vercel non ha mai emesso
il certificato.

Da fare, una volta sola, nel pannello Vercel:

1. Progetto `prova-1-web` → **Settings → Domains → Add**.
2. Inserire `www.dolmir.com`.
3. Scegliere **Redirect to `dolmir.com`** (308).
4. Attendere lo stato *Valid Configuration*: il certificato viene emesso
   in automatico (nessun record CAA blocca Let's Encrypt).

Il DNS non va toccato. Il codice contiene già un redirect `www → apex` in
`apps/web/next.config.ts` come rete di sicurezza.

Nota sui vecchi percorsi WordPress (`/wp-login.php`, `/xmlrpc.php`,
`/wp-admin`, `*.php`): rispondono **403** con `x-vercel-mitigated: deny`.
È il filtro di sistema di Vercel, attivo su tutta la piattaforma (stesso
comportamento su `nextjs.org`), non una regola di questo progetto. Google
scarterà quegli URL da solo; le pagine reali sono tutte 200.
