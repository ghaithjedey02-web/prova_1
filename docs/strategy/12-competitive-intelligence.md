# 12 — Competitive Intelligence

**Date:** 2026-08-29
**Status:** This document invalidates part of `02-vertical-scoring.md` and
`04-beachhead-decision.md`. Read §1 before acting on either.

## Research method and its limits — read first

**Company websites could not be opened.** The network egress proxy in this
environment blocks every external domain; only search is available. So this
research reconstructs businesses from search-indexed page content, press
coverage and trade listings — not from reading the sites, following links, or
checking LinkedIn and registry records.

Consequences:
- Pricing is reported only where a source stated a figure. Everywhere else:
  **"Pricing not publicly disclosed."**
- Client names are labelled by evidence strength. Nothing is inferred from a
  logo strip, because no logo strip was seen.
- Founder backgrounds, team sizes and partnership depth are largely **UNKNOWN**.

Every claim below carries **CONFIRMED** (stated by a citable source),
**LIKELY** (strongly implied by multiple sources) or **UNCONFIRMED**.

---

## 1. 🔴 The finding that changes the plan

`02-vertical-scoring.md` scored metalmeccanica **Competition 6/8**, on the
reasoning that *"ERP vendors verticalise for metalworking but they sell entire
systems… Nobody is selling a €25k point solution that bolts onto the ERP they
already own."*

**That is wrong.** The RFQ→quote workflow is one of the most contested
workflows in the sector.

| Product | Origin | What it does | Evidence |
|---|---|---|---|
| **Uptool** | US, founded 2023 | Detects RFQs in the inbox, parses email + attachments + **3D CAD, 2D drawings and BOMs**, drafts estimates from material/finishing databases. Claims 90% of the quoting workflow automated, quotes 10× faster. | **CONFIRMED.** $6M seed from Khosla Ventures, Eclipse, Bessemer, Kleiner Perkins. **From $195/month**, zero upfront, "up and running within an hour." |
| **Spanflug MAKE** | Germany | Calculates manufacturing times and costs from CAD and 2D models, determines machining phases, materials and machines. Claims quoting up to 90% more efficient. | **CONFIRMED.** Italian-language site (`spanflug.de/it/`), Italian product brochure, **exhibits at MECSPE**. **Free for up to 5 components/month.** |
| **CloudNC Quote Agent** | UK | RFQ → customer-ready quote in under 10 minutes | CONFIRMED (free trial offered) |
| **Machine Research** | US | ML on 3D CAD for programming, setup and run-time estimates | CONFIRMED |
| **DigiFabster** | Intl. | Quotes in minutes, 24/7 online quoting | CONFIRMED |
| **Computes QUOTE** | Italy | RFQ management with real-time quote status | CONFIRMED. Pricing not publicly disclosed. |
| **S3TechWare** | Italy | "Gestione avanzata preventivi per officine meccaniche" | CONFIRMED. Pricing not publicly disclosed. |
| **MTS Informatica — Business CUBE Metal** | Italy | Quoting + multi-level BOM for metalworking | CONFIRMED. Pricing not publicly disclosed. |
| **Rigel (Ideaweb)** | Italy | Complex quotation formulation for metalworking | CONFIRMED |
| **Siemens Zel X** | Intl. | Machine-shop management, Italian pages | CONFIRMED |

Three specific problems for us:

1. **A localised European competitor is already in our market.** Spanflug sells
   in Italian and exhibits at MECSPE — the fair our prospects attend.
2. **Uptool does more than we scoped, for ~1/100th of our entry price.** We
   deliberately excluded drawing interpretation as "the hard AI problem." A
   company founded in 2023 with $6M ships it at $195/month.
3. **The falsification trigger has fired.** `04-beachhead-decision.md` §6 says:
   *"An ERP incumbent ships SME-priced RFQ automation → pivot to workflow #2."*
   TeamSystem and Zucchetti have shipped AI (below); dedicated products already
   exist. The trigger condition is met.

**But it does not mean the vertical is wrong** — see §6.

---

## 2. The market map

Five layers, not one. Our earlier three-tier model missed the product layer
entirely, which is where the actual threat is.

| Layer | Who | Sells | Price signal |
|---|---|---|---|
| **1. Vertical AI products** | Uptool, Spanflug, CloudNC, Machine Research, DigiFabster | Self-serve SaaS for one workflow | **$195/mo** (Uptool); **freemium** (Spanflug) |
| **2. Italian vertical software** | Computes, S3TechWare, MTS, Rigel, Qualiware, Sinergest | Licensed modules inside/next to an ERP | Not publicly disclosed |
| **3. ERP incumbents** | TeamSystem, Zucchetti | AI inside the system of record | Bundled |
| **4. AI implementation firms** | Yellow Tech, Giallo, Arko, CRMpartners, Avvale, Neosperience | Consulting + build | €2.5k–40k projects; €150/h advisory |
| **5. Commoditised automation** | n8n/Make freelancers | Connectors | €3k–8k |

**DOLMIR was positioned in layer 4 while describing a layer-1 product.** That
mismatch is the strategic problem this research surfaces.

---

## 3. The five closest competitors

### 3.1 Giallo — `giallostudio.it` 🔴 near-identical positioning

**CONFIRMED from indexed page content:**
- *"Agenti AI e automazione per le PMI"* — helps companies and professional
  practices remove repetitive work: **"preventivi, fatture, email, data-entry"**
- *"dall'AI audit al primo flusso live in **2-4 settimane**"*
- *"A differenza di un'agenzia che rivende strumenti altrui, progettiamo e
  sviluppiamo in autonomia"*
- *"Se un intervento non sposta ore e costi, non si fa."*
- Fixed-price packages beginning with an AI audit; *"no surprise quotes"*
- GDPR-compliant tools, **European servers where possible**, no personal data to
  models without legal basis and anonymisation

**Assessment.** This is our positioning, already live: audit-first, fixed price,
measurable hours, build-don't-resell, EU data handling — and *preventivi named
first* in their workflow list. Several things we treated as differentiators are
already someone's homepage copy.

**Where they are weaker:** they are horizontal (SMEs *and* professional
practices) and also sell websites, e-commerce and custom software — a generalist
tail. 2–4 weeks to first live flow implies small engagements. No vertical depth.

Clients: **UNCONFIRMED** — none found. Pricing: **not publicly disclosed** as figures.

### 3.2 Yellow Tech — Milan 🔴 the scale benchmark

**CONFIRMED via Italian trade press (Media Key, Tecnelab, Innovami):**
- Founded **Milan, April 2024**, sole founder/CEO Antonio Pisante
- Revenue **€148K (2024) → €1.78M (2025)**, +1,105%. Forecast €3M (2026),
  €6M (2027), €10M (2028)
- **500+ client organisations, 300+ AI agents in production**
- Named clients: **Schneider Electric, Groupama, Sisal, Autotorino, Croce Rossa,
  Omnia Technologies, WeRoad** — CONFIRMED as named in press, though the depth
  of each relationship is UNCONFIRMED
- Sectors: manufacturing, finance, automotive, food & beverage
- Internal case studies claim time savings **up to 92%**; break-even <6 months
- Also sells **AI training/adoption programmes**
- CTA: **"Prenota una Call Gratuita sull'AI"**

**Acquisition (LIKELY, from observable footprint):** heavy content/SEO. They
publish an extensive guide library *and a ranking of "the best AI consulting
companies in Italy"* — a classic authority play that captures buyers at the
comparison stage. Plus enterprise logos and a free call.

**The important read:** they are **two years old**. Their moat is not
experience. It is content volume, logo credibility and breadth. That tells us
what actually compounds in this market — and that a standing start is survivable.

### 3.3 Uptool — see §1. The product-layer threat.

### 3.4 Spanflug — see §1. The localised European threat.

### 3.5 Arko — `arko-ai.com`

**CONFIRMED:** full cycle — department-by-department process mapping
(administration, sales, operations, customer service), identification of
high-volume repetitive tasks, custom automations and assistants, **with a free
preliminary analysis.**

**Why it matters to us:** it prices our €2,900 audit against free.

---

## 4. Offer structures — what the market actually sells

The structure the brief asked us to look for **exists, and it is uniform**:

```
free/paid assessment → use-case identification with ROI → pilot → go-live → maintenance
```

Sources describe Italian AI consulting as *"un percorso strutturato — tipicamente
in 4-5 fasi — che include: assessment dei processi, identificazione dei use case
con ROI misurabile, selezione delle tecnologie e sviluppo di un pilota
verificabile prima del go-live."*

**Implication for `/metodo`:** our 7-phase methodology is **table stakes, not
differentiation.** Every competitor has the same shape. Presenting it as our
distinctive method is a weak claim that a comparing buyer will discount.

Entry offers observed: **free** (Arko, Yellow Tech call, Spanflug freemium) ·
**paid audit** (Giallo) · **free trial** (CloudNC) · **$195/mo self-serve** (Uptool).

---

## 5. Pricing — what the evidence says

**CONFIRMED figures found:**

| Item | Observed |
|---|---|
| AI advisory | from **~€150/hour** |
| IT consulting | from **€80/hour** |
| Complete IT project | from **€2,000** |
| Single well-defined process automation | from **~€2,500** |
| Broader transformation | **€8,000–25,000** |
| **OCR + validation + exception handling + gestionale integration** | **€15,000–40,000** |
| Typical SME initial investment | *"a few thousand to fifteen thousand euro"* |
| **Typical monthly recurring** | ***"poche centinaia di euro"*** — a few hundred |
| Real example A | €8,500 build + **€150/month** |
| Real example B | €12,000 build + **€200/month** |
| Uptool | **$195/month**, no upfront |
| Low-end n8n/Make tier | €3,000–8,000 |

### What this does to our pricing

✅ **Implementation €18,000–35,000 is CORRECT.** It sits inside the observed
€15,000–40,000 band for exactly our scope (OCR + validation + exception handling
+ ERP integration). Keep it.

🔴 **Retainer €600–1,500/month is 3–4× the observed norm.** The market pays
€150–200/month for maintenance on this class of project. €600 as an *entry*
tier will read as expensive to any buyer who compares.

🔴 **The €2,000–4,000/month from the Phase-2 brief is dead.** I flagged it as
likely unsellable; the evidence now puts it at **10–20× the observed norm.**

🟠 **The €2,900 audit is contested.** Arko gives the analysis free; Yellow Tech
gives a free call; Spanflug gives free quoting for 5 parts/month. Our audit
survives only if its depth is *visibly* different — analysing 50 real historic
RFQs and producing measured numbers is genuinely deeper than a free chat, but
the website must make that difference obvious in seconds.

---

## 6. Where the real gap is — and it is not a workflow

We looked for an uncontested workflow. There isn't an obvious one:

- **Quoting** — 10 products (§1)
- **Order entry** — Esker, Typelens, Virtual Workforce, Retica.ai, So Smart
- **Invoices/documents** — TeamSystem and Zucchetti ship it natively
- **Quality / non-conformity / 8D** — Qualiware, AYAMA, ISI, Sinergest. Here the
  sources note AI automation is *less prominent* — a relative gap, but a
  low-frequency, low-value workflow

**The gap is not the workflow. It is that the tools get abandoned.**

CONFIRMED, from Italian sources on why SME AI projects fail:

> *"un fornitore presenta uno strumento che promette efficienza, l'azienda
> acquista la licenza, e dopo tre mesi lo strumento è sottoutilizzato o
> abbandonato perché il problema che avrebbe dovuto risolvere non era stato
> definito con precisione."*

> *"Quello che sembrava un progetto da due settimane diventa un incubo di
> integrazione da sei mesi, e a quel punto è più facile continuare a fare tutto
> a mano."*

> PMI run on *"gestionali comprati nel 2008, fogli Excel utilizzati come database
> aziendale ed email usate come archivio documentale."*

Plus: no KPIs, no internal ownership, and *"AI pilot purgatory"* — pilots that
never reach production.

**This is the whitespace.** Layer-1 products sell capability. Nobody owns the
outcome inside a messy Italian SME with a 2008 gestionale. That is a services
job, and it is exactly what the 58.6% skills barrier (Istat) predicts.

---

## 7. Positioning — where DOLMIR should stand

**Crowded:** generalist AI consulting (Yellow Tech, Arko, CRMpartners, Giallo
and dozens more) · self-serve quoting products · n8n/Make connectors.

**Empty:** *tool-agnostic process engineering with measured outcomes, delivered
into legacy Italian SME environments, by someone who owns the result.*

### The repositioning this evidence argues for

**From:** "We build you a quoting system."
→ competes with Uptool at 100× the price and loses the comparison.

**To:** "We measure the process, engineer the fix, and make it work inside the
systems you already have — and we install the measurement so you can check us."

Concretely, that means being willing to say to a prospect:
*"Spanflug may be the right tool for you. We'll be the ones who make it work
with your gestionale, configure your rates, and prove it saved you time."*

**The trade-off, stated honestly:** this is closer to "implementation partner"
than "product builder," which is exactly what Giallo positions *against*
("non rivendiamo strumenti altrui"). It caps some pricing. But it is defensible
against a $195/month product, and "we build it all ourselves" is not.

**The moat is the audit, the integration and the measurement — not the software.**

---

## 8. Competitive advantage matrix

| Competitor | Their advantage | Their weakness | DOLMIR response |
|---|---|---|---|
| **Uptool** | Product depth incl. CAD; VC funding; $195/mo | US-focused; self-serve assumes in-house skill; no Italian ERP integration; no local presence | Be the Italian implementation and integration layer. Do not out-build them. |
| **Spanflug** | German engineering credibility; Italian localisation; MECSPE presence; freemium | Product only; buyer still configures rates and integrates alone | Same: implementation + measurement. Consider partnership rather than competition. |
| **Yellow Tech** | Scale, logos, content volume, brand | Generalist across 6+ sectors; nobody there knows what a preventivista does all day | Vertical depth. Out-specific them on one workflow in one sector. |
| **Giallo** | Same positioning, already live; audit-first; EU data stance | Horizontal; also sells websites/e-commerce; short 2–4 week engagements | Go deeper: 50 real RFQs analysed, not a generic audit. Vertical language they cannot match. |
| **Arko** | Free preliminary analysis | Free analysis is necessarily shallow | Make the paid audit's depth visible and quantified. |
| **TeamSystem / Zucchetti** | Own the system of record and the relationship | Horizontal AI, not workflow-specific; slow | Be the honest answer to *"ERP AI or custom?"* — a question buyers are already asking. |

### Must / should / could / never

**MUST HAVE**
- A demonstration on the prospect's *own* document (already built)
- Measured before/after from their real data
- Integration competence with Zucchetti / TeamSystem / bespoke gestionali
- An honest comparison page against the products

**SHOULD HAVE**
- Vertical vocabulary no generalist can fake
- A published sector benchmark on quote response times
- MECSPE presence (next edition ~March 2027)

**COULD HAVE**
- Partnership/reseller status with Spanflug or similar
- Italian-language content library (the Yellow Tech playbook)

**SHOULD NEVER DO**
- Compete on price with a $195/month product
- Claim to build what Uptool builds, at our size
- Present the 4–7 phase methodology as a differentiator
- Publish a monthly price above ~€400 without evidence it is accepted

---

## 9. Website implications

The site we built is well-executed for the *old* positioning. Three changes the
evidence argues for:

1. **The hero claim is now contestable.** "Il lavoro che non si vede" is about
   discovering hidden cost — good, and still true. Keep it. But the supporting
   copy currently implies we build the system. It should imply we *make the
   outcome happen*, tool-agnostically.
2. **`/metodo` needs demoting or sharpening.** A 7-phase process is the market
   standard. Either make the *measurement* the hero of that page, or cut it.
3. **Add an honest comparison.** *"Esistono già prodotti che fanno questo. Ecco
   quando conviene comprarli, e quando serve altro."* No competitor does this.
   It is the single strongest trust asset available to a company with no clients,
   and it directly answers the objection a researching buyer will already have.

The demonstration remains the strongest asset and needs no change.

---

## Sources

- [Giallo — Agenti AI e automazione per le PMI](https://giallostudio.it/)
- [Uptool](https://uptool.com/) · [Uptool product](https://uptool.com/product) · [Fabricating & Metalworking — AI Quoting Software for SMB Manufacturers](https://fabricatingandmetalworking.com/ai-quoting-software-uptool/) · [Xometry Pro — interview with Uptool](https://xometry.pro/en/articles/ai-interviews-uptool/)
- [Spanflug MAKE](https://spanflug.de/en/make/) · [Spanflug quotazione (IT)](https://spanflug.de/it/quotazione-semplice/) · [MECSPE catalogue listing](https://mecspe.com/portale/it/spanflug-technologies-gmbh/prodotti/spanflug-make-software-di-quotazione-automatizzata)
- [CloudNC Quote Agent](https://www.cloudnc.com/quote-agent) · [Machine Research](https://machineresearch.com/) · [DigiFabster](https://digifabster.com/industry/cnc-machine-shops/)
- [Computes QUOTE](https://www.computesgroup.com/prodotti/computes-quote/) · [S3TechWare](https://s3techware.com/) · [MTS Informatica](https://www.mtsinformatica.com/gestionale-produzione-per-metalmeccanica-e-carpenteria/)
- [Yellow Tech](https://yellowtech.it/) · [Media Key — Yellow Tech +1.105%](https://mediakey.it/news/yellow-tech-la-ai-transformation-company-italiana-cresce-del-1-105-e-punta-a-6-milioni-di-ricavi-nel-2027/) · [Tecnelab](https://www.tecnelab.it/news/attualita/yellow-tech-ricavi-in-crescita-del-1-105-nel-2025) · [Innovami](https://www.innovami.news/2026/08/18/yellow-tech-cresce-del-1-105-la-startup-italiana-punta-sullai-transformation-delle-aziende/)
- [Arko — Consulenza AI per PMI](https://arko-ai.com/consulenza-ai-pmi) · [CRMpartners](https://www.crmpartners.it/consulenza-intelligenza-artificiale/) · [Avvale — Intelligent Automation](https://www.avvale.com/services/intelligent-automation)
- [TeamSystem — Intelligenza Artificiale](https://www.teamsystem.com/teamsystem-intelligenza-artificiale/) · [AI gestionali italiani: TeamSystem vs Zucchetti 2026](https://lucasammarco.com/blog/ai-gestionali-italiani-teamsystem-zucchetti-2026) · [Alpiflow — TeamSystem Studio AI vs Zucchetti vs custom](https://www.alpiflow.com/insights/teamsystem-studio-ai-zucchetti-vs-custom)
- [Esker Italia — gestione ordini clienti](https://www.esker.com/it/blog/o2c/come-ottimizzare-la-gestione-degli-ordini-clienti/) · [Retica.ai](https://retica.ai/en/blog/automate-the-entry-of-orders-and-transport-documents/) · [Typelens](https://www.typelens.com/blog/automazione-documentale-guida-imprese-italiane) · [So Smart](https://www.so-smart.it/it/blogreader/automatizzare-importazione-ordini-vendita-intelligenza-artificiale-edi.html)
- [Digitalpunk — perché le aziende italiane restano bloccate](https://digitalpunk.it/automazione-con-ai-perche-le-aziende-italiane-restano-bloccate-e-come-sbloccarsi/) · [ESM Italia — AI pilot purgatory](https://www.esmitalia.it/blog-articolo.php?id=2253) · [Best Tech Partner — errori comuni PMI](https://www.besttechpartner.ai/2026/05/27/implementazione-intelligenza-artificiale-guida-agli-errori-comuni-per-le-pmi/)
- [Levora — quanto costa automatizzare un processo](https://levora.pro/blog/quanto-costa-automatizzare-processo-aziendale/) · [m-ai — quanto costa automatizzare](https://www.m-ai.it/quanto-costa-automatizzare-processi/) · [FreelanceDEV](https://freelancedev.it/blog/quanto-costa-automatizzare-un-processo-aziendale) · [Synaptica](https://synaptica-solution.com/knowledge/cos-e-consulenza-ai-pmi/)
- [MECSPE 2026](https://mecspe.com/en/) · [MECSPE 2026 — 2.000 espositori, 70.000 visitatori](https://www.recoverweb.it/mecspe-2026-oltre-2-000-espositori-e-piu-di-60-000-visitatori/)
- [Qualiware](https://www.qualiware.it/software-gestione-non-conformita/) · [Sinergest 8D](https://www.sinergestsuite.it/software/qualita/modulo-8d/)

**intellserv.it:** no indexed footprint found across multiple searches.
Assessment: **UNCONFIRMED / negligible public presence.** Either very new, not
indexed, or not a meaningful market participant. Not treated as a competitor.
