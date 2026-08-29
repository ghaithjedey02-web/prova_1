# dolmir.com — Site Architecture

**Positioning constraint:** this is not an AI-agency website. It is the website of
a company that fixes one expensive problem for a specific kind of manufacturer.

The visitor we care about is a 45–60 year old owner of a machining shop in
Brescia, on a laptop, mildly sceptical, who has been cold-called by three
"digital transformation" vendors this year. Everything below is designed for
that person and nobody else.

---

## 1. What the site must do

In priority order:

1. Make them recognise their own problem in the first screen
2. Prove we understand their trade, not just software
3. Let them **try the demo without talking to anyone**
4. Give a price range so they can self-qualify
5. Make booking a call trivial

That's it. It is not a brand showcase and it is not a lead-capture funnel.

## 2. What the site must NOT do

- ❌ No hero video of glowing neural networks
- ❌ No "we harness the power of artificial intelligence"
- ❌ No fake client logos, no invented testimonials, no fabricated metrics
- ❌ No 3D, no scroll-jacking, no cursor effects
- ❌ No chatbot popup
- ❌ No gated PDF in exchange for an email
- ❌ No English-first. **Italian is the primary language.** English is secondary.

The absence of these is itself a differentiator in this market — the vendors
this buyer distrusts all have them.

## 3. Sitemap

```
/                          Home
/come-funziona             How it works — the process, honestly
/demo                      Interactive demo ← the most important page
/prezzi                    Pricing guidance
/chi-siamo                 Who we are
/contatti                  Contact
/note                      Notes (technical writing, builds credibility)
  /note/[slug]
/casi                      Case studies — NOT PUBLISHED until one is real
/legale/privacy            Privacy policy
/legale/cookie             Cookie policy
/legale/termini            Terms
```

Nine pages. A tenth page is a decision that needs justifying.

## 4. Page structure

### `/` — Home

**Above the fold — one job: recognition.**

> # Le richieste di offerta arrivano più in fretta di quanto riusciate a rispondere.
> Trasformiamo le RdO che arrivano via email in preventivi pronti da approvare.
> Per officine di lavorazioni conto terzi in Lombardia. Il vostro gestionale resta dov'è.
>
> [ Prova la demo ]   [ Parliamone 15 minuti ]

No image of a robot. If any image, a real photograph of a real workshop —
licensed, or generated but never presented as a photo of a client's plant.

**Section 2 — The problem, in their words**

Three short columns, no icons:
- *La richiesta arriva e si accumula nella casella insieme a tutto il resto*
- *Chi prepara i preventivi è una persona sola, e quando è occupata si ferma tutto*
- *Il cliente sceglie chi risponde per primo*

**Section 3 — Before / after diagram**

The single most important graphic on the site. Two rows, plain, legible:
today's path (5 manual steps, days) versus the assisted path (same steps,
machine-assisted, human approval retained, hours). Must show the human approval
box explicitly — that box is what makes the buyer relax.

**Section 4 — What it does NOT do**

An unusual section, and the highest-trust element on the page:

> **Cosa non fa**
> Non legge i disegni tecnici per calcolare i tempi macchina.
> Non decide i prezzi al posto vostro.
> Non invia niente al cliente senza la vostra approvazione.
> Non sostituisce il vostro gestionale.

Stating limits plainly is the fastest way to be believed about the rest.

**Section 5 — Price anchor** → *Audit di Processo, €2.900, dieci giorni.*

**Section 6 — Single CTA.**

### `/demo` — The interactive demo

The commercial core of the site. Runs in-browser, no signup, no email required.

Flow:
1. Pick a sample Italian RFQ email, **or paste your own**
2. Watch extraction populate a structured card, field by field, with confidence
3. See the comparable historic quote it matched against
4. See the drafted Italian quote
5. **See the approval step** — nothing sends itself
6. See the counters: fields extracted, time elapsed

Non-negotiables:
- A visible banner: *dati di esempio, non un caso reale*
- If a paste is used, state clearly whether it is processed in-browser or sent
  to a server — and if sent, say what is retained. This buyer's RFQs contain
  their customers' IP; being casual here loses the deal in one sentence.
- Must degrade to the recorded 3-minute video if anything fails.

### `/prezzi` — Pricing

Publishing prices is a deliberate choice. It costs some enquiries and saves far
more time, and in a market full of "contattaci per un preventivo" it reads as
confidence. Show the ladder: Audit €2.900 → Implementazione €18.000–35.000 →
Servizio gestito €600–1.500/mese. Say what is not included.

### `/casi` — Case studies

**Do not publish until a real one exists.** Until then the route 404s or is
absent from navigation. An empty or fabricated case-study page is worse than no
page. When the first is ready, it needs: measured before, measured after, named
client with written permission, and the method.

### `/note` — Technical notes

Where credibility is earned with the sceptical buyer: short pieces on quoting
practice, extraction accuracy, what automation cannot do. Written for a
preventivista, not for a search engine.

## 5. Design direction

| | |
|---|---|
| **Feel** | Premium industrial. Closer to a precision-instrument catalogue than to a SaaS landing page. |
| **Type** | One serious sans (Inter / Söhne) + a monospace for data and code. Generous size — the reader may be 55. |
| **Colour** | Near-black on off-white. One accent, used sparingly. Dark mode supported. |
| **Space** | Heavy whitespace. Long line-length discipline (65–75 chars). |
| **Motion** | Only where it explains: the demo pipeline animating stage by stage. Nothing decorative. Respect `prefers-reduced-motion`. |
| **Images** | Real machining, real documents, real screens. No stock handshakes, no glowing brains. |

## 6. Technical

- Next.js static export or Astro. No CMS in v1 — MDX files in the repo.
- No analytics that require a cookie banner; use a cookieless, EU-hosted tool.
  A cookie wall on first paint is a trust cost we don't need to pay.
- Italian first, `hreflang` for an English subset.
- Target LCP < 1.5s on 4G. This buyer may be on a phone in a workshop.
- WCAG AA. Real contrast, real focus states, full keyboard access.

## 7. Build sequence

**Week 3 of the 90-day plan — five pages only:** Home, Come funziona, Prezzi,
Chi siamo, Contatti. Static, no demo.

**Week 6 — add `/demo`** once the sales demo has been run live enough times to
know which parts land.

**Week 13 — add `/casi`** with the first real case study.

Do not perfect the site before there are clients. It is a supporting asset, not
the business. The demo is the only page that changes outcomes.

---

## 8. Generated visual assets

Produced with Higgsfield (`marketing_studio_image`), 16:9, 1376×768.

| Asset | Use | URL |
|---|---|---|
| Workshop interior A | Home hero background | https://d8j0ntlcm91z4.cloudfront.net/user_3IWNhA6wnS80L9kj7n6EaO07HtE/hf_20260829_023036_f9a8ff75-c6d1-4f6b-9576-887985537daf.png |
| Workshop interior B | Alternate hero / `/chi-siamo` | https://d8j0ntlcm91z4.cloudfront.net/user_3IWNhA6wnS80L9kj7n6EaO07HtE/hf_20260829_023036_6b98308c-9a27-42d2-816c-e4d9d2841ccc.png |
| Machinist's desk (overhead) | `/come-funziona` header — right-hand negative space is reserved for text | https://d8j0ntlcm91z4.cloudfront.net/user_3IWNhA6wnS80L9kj7n6EaO07HtE/hf_20260829_023039_ddf8ddc3-b763-4a6f-9776-c32dfdb29cb9.png |

**Prompting constraints used, and why they matter commercially:** no text, no
logos, no signage, no futuristic or glowing elements. Muted palette, natural
light, no people. The buyer we are addressing has been shown glowing-brain
imagery by every vendor who called them this year; restraint is the
differentiator, and a generated image containing invented branding would be
actively harmful.

⚠️ **Two rules for these images:**
1. **Download and self-host them.** The CDN URLs above are not a permanent store.
2. **Never caption a generated image as a client's plant or as a photograph of a
   real installation.** They are illustrative. Presenting one as a client site
   is a fabricated credential.

The **before/after diagram is deliberately not a generated image** — it is
hand-authored inline SVG. It carries the argument, it must be legible in both
themes, it must be accessible, and it will change as the product changes.
Generated art cannot do any of those things.
