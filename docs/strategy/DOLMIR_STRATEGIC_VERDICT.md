# DOLMIR — Strategic Assessment and Verdict

**Date:** 2026-08-29
**Author role assumed:** founder + B2B strategist + Italian SME researcher + manufacturing analyst + AI implementation consultant + enterprise sales strategist + skeptical investor
**Status:** strategy only. No code, no pages, no design changes were made for this document.
**Question being answered:** can DOLMIR become a real, profitable business in Lombardia, Italy?

---

## Evidence legend

Every claim in this document carries one of five labels. Nothing is asserted without one.

| Label | Meaning |
|---|---|
| **FACT** | Verifiable, with a source given inline or in §17. |
| **SOURCE** | The origin of a FACT. |
| **ESTIMATE** | A number I constructed. The arithmetic is shown so you can attack it. Not observed in the world. |
| **INFERENCE** | A conclusion drawn from FACTs. Could be wrong; the reasoning is exposed. |
| **RECOMMENDATION** | What I think you should do. Opinion, argued. |
| **UNKNOWN** | Searched for, not found. Stated rather than filled with plausible fiction. |

A structural warning about this document: **WebFetch is blocked in this environment for all external domains.** Only search-result summaries were available. That means I could not open competitor pricing pages, read PDFs of Istat tables, or verify individual company facts by visiting their sites. Several things below are therefore weaker than they look in a normal research process, and I flag each one. Do not treat this as due diligence. Treat it as the best reasoning available under a real constraint.

---

# 1. Try to kill DOLMIR

This section exists to destroy the business, not to defend it. Nine attacks, strongest first. Each one gets an honest verdict: **KILLS IT**, **WOUNDS IT**, or **SURVIVABLE**.

## A. The buyer already has the tool and it costs €20/month

**FACT:** ChatGPT is used by roughly 65% of Italian professionals (SOURCE: Osservatorio Artificial Intelligence, Politecnico di Milano, reported 2025).
**FACT:** The Italian AI market reached ~€1.8bn in 2025, +50% YoY (SOURCE: Osservatorio AI, Politecnico di Milano).
**FACT:** Microsoft markets Copilot with a claim of ~1.2 hours/day saved per user.

The attack: the *titolare* of a 30-person carpenteria in Bergamo can paste an RFQ email into ChatGPT today, for €20/month, and get a structured summary and a draft reply. Why would they pay €18,000–35,000 plus a monthly fee for the same category of output?

**Honest answer, and it is not a comfortable one:** for a *single* RFQ, ChatGPT is genuinely competitive and cheaper. DOLMIR only wins where three things are simultaneously true:
1. The task is repetitive enough that a human copy-pasting into a chat window is itself the bottleneck (20+ times a week, not 3).
2. The output must land *inside an existing system* (ERP, gestionale, mailbox, PDF template) without a human retyping it.
3. Being wrong has a cost, so you need confidence gating, evidence, and refusal — not a confident paragraph of prose.

That is a real and defensible boundary. But it is a *narrow* one, and it eliminates most of what a generalist "AI agency" would sell.

**Verdict: WOUNDS IT SEVERELY.** It does not kill the business, but it kills any positioning that sounds like "we bring AI to your company." Every DOLMIR offer must survive the sentence *"why not just use ChatGPT?"* stated out loud, on the website, in the first meeting. If a workflow cannot survive that sentence, DOLMIR should not sell it.

## B. The economics of a €20k project do not close for a 20-person company

**FACT:** A RAL of €30,000 costs an Italian employer approximately €41,073 fully loaded (~137% of RAL); the metalmeccanico CCNL runs 3–5% above commercio (SOURCE: Italian employer-cost calculators and CCNL cost breakdowns, 2025–2026).
**ESTIMATE:** €41,073 ÷ ~1,650 productive hours/year ≈ **€24.9/hour loaded cost.** Round to €25/h.
**ESTIMATE:** A €20,000 implementation + €590/month over 3 years = €20,000 + €21,240 = **€41,240 total cost of ownership.**
**ESTIMATE:** At €25/h, that TCO must free **1,650 hours over 3 years ≈ 10.6 hours/week** merely to break even. A buyer who wants a 3× return needs ~32 hours/week freed — effectively a full FTE.

That is a brutal number. Most quoting bottlenecks in a 20–50 person shop do not consume 32 hours/week of one person's time.

**Verdict: KILLS THE COST-SAVING PITCH.** DOLMIR cannot be sold as labour arbitrage at this price point. It survives only if it is sold as **revenue capture or risk removal** — see §4, where the same €20k closes easily on a margin argument and does not close at all on a headcount argument. If you keep selling "we save you time," the business dies at the pricing conversation.

## C. An ERP vendor ships this as a feature and it becomes free

**FACT:** Multiple Italian vertical ERPs already market quoting modules to metalmeccanica and carpenteria (Gestlam ERP Concept, MTS Business CUBE Metal, Pro Consulting Metal Pro, Integro360, Plancraft) (SOURCE: vendor sites surfaced in search).
**FACT:** Pricing for these is **not publicly disclosed** in any source I could reach.
**INFERENCE:** These vendors have the customer relationship, the data model, and the distribution. Adding an LLM extraction step to an existing preventivazione module is a quarter of engineering work for them, not a company.

This attack already fired once: in Phase 1 the vertical scoring model gave metalmeccanica a competition score of 6/8 (favourable), and the competitive intelligence work overturned it. A falsification trigger written in `04-beachhead-decision.md` — *"an ERP incumbent ships SME-priced RFQ automation → pivot"* — has effectively fired.

**Verdict: WOUNDS IT.** It does not kill DOLMIR because (a) ERP quoting modules assume the data is already *in the ERP*, and the actual bottleneck is upstream — an unstructured email with a PDF attachment; (b) ERP replacement cycles in Italian SMEs are 7–15 years and switching is politically expensive. But it means DOLMIR must never position as "quoting software." It must position as the layer that turns messy inbound into structured input for whatever system the client already has — explicitly *including* the incumbent's.

## D. You cannot legally reach the buyer

**FACT:** The Garante per la protezione dei dati personali has repeatedly rejected legitimate interest as a basis for unsolicited commercial email to individuals. Personal addresses (`nome.cognome@azienda.it`) require consent.
**FACT:** Generic role addresses (`info@`, `commerciale@`, `preventivi@`) fall outside the GDPR because legal-entity data is not personal data.
**FACT:** Harvesting contacts from professional registries for commercial contact is not permitted.
**FACT:** Cold *calling* is permitted with a human operator to numbers not listed in the Registro Pubblico delle Opposizioni; the RPO now covers legal entities including Srl landlines, VoIP and centralini; the caller is obliged to screen their database against the RPO; sanctions run to €20M or 4% of turnover.
**FACT:** Enel was fined €26.5M for telemarketing violations.
(SOURCE: Garante decisions and RPO regulations, 2024–2026.)

**Verdict: SURVIVABLE, BUT IT SHAPES EVERYTHING.** Outbound is legal in a narrow corridor: role addresses only, human-dialled calls to RPO-screened numbers only. It does not kill the business. It does kill the fantasy of a 300-contact automated sequence, which is what the original brief implicitly assumed. This is also why §7's observation-based approach is not a nicety — it is the only version of outbound that is both legal and effective in this corridor.

## E. Italian manufacturing SMEs do not trust IT vendors

**FACT:** Trust in ICT vendors among Italian SMEs fell to **24% in 2023, from 42% in 2018**.
**FACT:** 72% of Italian SMEs with 10+ employees use an external IT provider; only **38% are satisfied**.
(SOURCE: Italian SME digitalisation surveys surfaced in search.)

**INFERENCE:** You are entering a market where the median buyer has already been disappointed by someone who sounded like you. The prior on a new, unknown, one-person AI vendor is negative, not neutral.

**Verdict: WOUNDS IT — and is simultaneously the opportunity.** A 24% trust level means differentiation on honesty is not a soft brand choice, it is the only available wedge. This validates the `DOLMIR_FINAL_POSITIONING.md` trust line — *"Se vi conviene comprare un prodotto invece di chiamarci, sta scritto qui"* — as a commercial instrument rather than a virtue signal. But it also means the sales cycle will be longer than a founder wants, and the first customer will be bought on *reference or observation*, not on copy.

## F. The subsidy that would have paid for this is gone

**FACT:** Transizione 5.0 funds were exhausted in autumn 2025 and the scheme closed to new GSE bookings from 1 January 2026 (Law 199/2025), replaced by Iperammortamento 2026–2028.
**FACT:** 7,417 firms that had already signed contracts were excluded and receive 89.77% of the benefit sought.

**INFERENCE:** Two damages. First, the "the State pays for 40% of this" argument is no longer available in the form the market remembers. Second, and worse, **7,417 Italian firms just had a bad experience with a digitalisation incentive.** Some of them are in your ICP. The word "incentivo" now carries residual burn.

**Verdict: WOUNDS IT.** Never build a pitch on financing. Iperammortamento 2026–2028 applies to capital goods and its treatment of software/AI services is **UNKNOWN** to me at this level of research — do not repeat any claim about it until a commercialista confirms it in writing.

## G. A one-person company cannot deliver an implementation and sell at the same time

This is the founder-capacity attack. An €18–35k implementation is, realistically, 4–10 weeks of concentrated work. During those weeks, outbound stops. Outbound stopping means the pipeline goes cold. The pipeline going cold means that when delivery ends, you restart from zero — the classic consultancy sawtooth.

**ESTIMATE:** With a 3-month sales cycle (see §6) and 6–8 weeks of delivery per client, a solo founder tops out at roughly **4–6 implementations per year**, i.e. **€90k–190k of revenue**, before any team.

**Verdict: SURVIVABLE, BUT IT CAPS THE BUSINESS.** €90k–190k is a good freelance income and a bad company. Anyone who tells you this scales without either productisation or hiring is not doing the arithmetic. The honest framing: DOLMIR year one is a *high-quality practice*, not a startup, and the only route out is that the same workflow repeats across clients so delivery time collapses on client 3, 4, 5.

## H. You have no track record, no case studies, and no logos

**FACT:** Italian SME buyers weight **references from similar companies** above all other inputs, and prefer demos on their own real data over brochures (SOURCE: Italian software buying-behaviour research, Capterra Italia 2026 and related).

The attack is circular and it is real: you need a reference to get a customer, and a customer to get a reference. Every credibility asset the website could carry — clients, testimonials, logos, ROI figures — is off-limits, correctly, because inventing them was forbidden and would be fraud.

**Verdict: SURVIVABLE, VIA ONE SPECIFIC MECHANIC.** The substitute for a case study is **a demonstration on the prospect's own data, run in front of them, that is allowed to fail.** You already built the machine for this: a pipeline that returns `suggestedUnitPriceEur: null` and `REQUIRES_TECHNICAL_ESTIMATE` rather than guessing. A system that visibly refuses to answer when it lacks evidence is the closest thing to a reference that a company with no clients can produce. That is not a consolation prize; it is a better artefact than a logo wall, *for this specific buyer, in this specific trust environment.*

## I. The founder is not Italian-market-native in the eyes of the buyer

Not addressed anywhere in prior research and I will not speculate about your background. But the structural point stands: metalmeccanica in Bergamo/Brescia is a relationship market with dense local networks — associazioni di categoria (Confindustria, Confapi, API), commercialisti, trade fairs. An outsider without a node in that network pays a trust tax.

**Verdict: SURVIVABLE, IF ADDRESSED DELIBERATELY.** It becomes fatal only if ignored. See §6 — the network route is not a nice-to-have channel, it is likely the *shortest* path to customer #1.

## Summary of the kill attempt

Nothing here kills DOLMIR outright. Three things are killed:

1. **The cost-saving pitch** (attack B) — dead at this price point.
2. **"AI agency" / generalist positioning** (attack A) — dead against a €20/month substitute.
3. **Scaled automated outbound** (attack D) — dead on Italian law.

What survives is narrower and harder than the original concept: a practice that sells *one repeatable, high-consequence workflow* to a *specific, observable* kind of company, proven by *a live demo on their data that is allowed to say "I don't know."*

---

# 2. Ideal customer profile — A, B, C

Three profiles, ranked. Each has **measurable** entry criteria you can verify from public information before you ever make contact. Anything I could not source is marked UNKNOWN rather than invented.

## ICP A — Conto terzi metalmeccanica / carpenteria with a quoting bottleneck (PRIMARY)

| Attribute | Measurable criterion | How you verify it publicly |
|---|---|---|
| Sector | ATECO 25.x (prodotti in metallo) or 28.x (macchinari) | Registro Imprese / visura |
| Size | 15–60 employees | Bilancio depositato (costo del personale ÷ ~€41k) — **FACT:** bilanci of società di capitali are public and obtainable by anyone without authorisation |
| Revenue | €3M–€15M | Bilancio depositato |
| Business model | Conto terzi / produzione a commessa (not own-catalogue serial product) | Website language: "lavorazioni su disegno", "conto terzi" |
| Inbound RFQ volume | **≥20–25 qualifying RFQs/week** | Not directly observable — must be established in the first conversation. See §4 for why this threshold, not the ≥10 of Phase 1 |
| Quoting staff | 1–3 people, often including the titolare | Job ads; LinkedIn "ufficio tecnico" headcount |
| Trigger signal | Currently advertising for a *preventivista* or *impiegato ufficio tecnico preventivi* | **FACT:** such ads exist in volume in Bergamo/Brescia/Milano (SOURCE: Indeed IT, InfoJobs, 2026 listings) |
| Systems | Has a gestionale/ERP; RFQs arrive by email as PDF/DWG attachments | Inferred, confirmed in meeting |
| Decision maker | Titolare or direttore operativo — 1–2 people, no committee | Company size |
| Disqualifier | Fewer than ~15 quotes/week; or a catalogue/configurator already live | Website |

**Why this is #1:** the trigger is publicly observable, the buyer is a single person, the economics work on a margin argument (§4), and the workflow scores highest in §3.

## ICP B — Distributori / ricambisti tecnici with catalogue-matching pain (SECONDARY)

| Attribute | Criterion | Verification |
|---|---|---|
| Sector | ATECO 46.x wholesale of industrial supplies, components, ricambi |
| Size | 10–50 employees |
| Signal | Public product catalogue, **no** online configurator or parametric search |
| Pain | Incoming requests reference competitor part numbers, photos, or verbal descriptions that must be matched to their own SKUs |
| Volume | High request count, low value per request — the opposite shape of ICP A |
| Decision maker | Owner or commercial director |
| Disqualifier | Already runs a B2B e-commerce with search |

**Why #2 and not #1:** the workflow (cross-reference matching) is technically attractive and repeatable, but the *pain per instance is lower*, which makes a €20k price harder to justify. Better as client #4–6, once you have a reference.

## ICP C — Impiantisti / installatori tecnici bidding on capitolati (TERTIARY, and I would not start here)

| Attribute | Criterion |
|---|---|
| Sector | Impiantistica industriale, elettrica, meccanica; ATECO 43.2x / 33.2x |
| Size | 20–80 employees |
| Pain | Long tender documents (capitolati) that must be read, checked for compliance, and priced |
| Value per instance | Very high — a single missed clause can cost more than the entire DOLMIR fee |
| Decision maker | Often 2–4 people including a technical director |

**Why I rank it last despite high pain:** error tolerance is near zero (a missed contractual clause is a legal liability, not an inconvenience), the sales cycle involves more people, and the volume per client is lower — which means less repetition, which means the AI has fewer comparables to learn from. High risk, slow sale, weak data. Correct as a year-two vertical, wrong as a beachhead.

## What I could not establish

**UNKNOWN:** the ratio of office/technical staff to production staff in Italian manufacturing SMEs. I searched for it in the previous phase and found no reliable published figure. This matters because it would let you estimate quoting capacity from headcount alone, which would make ICP A qualifiable entirely from public data. Without it, the ≥20 RFQ/week criterion must be asked, not observed. This is a real gap in the targeting model.


---

# 3. Workflow ranking — 18 candidates, 12 criteria

Each workflow is scored 1–10 on twelve criteria. Maximum 120. **All scores are ESTIMATE** — they are my judgement, calibrated against the market research in `12-competitive-intelligence.md` and this phase's searches, not measured in the field. Their purpose is to make my reasoning attackable, not to look quantitative.

### Criteria

| Code | Criterion | 10 means |
|---|---|---|
| FRQ | Frequency | Happens many times per day |
| PAIN | Pain intensity | Owner complains about it unprompted |
| MEAS | Measurability | Improvement is countable without argument |
| DATA | Input availability | Input is already digital, structured enough, and legally accessible |
| ERR | Error tolerance | A wrong output is cheap and recoverable |
| TIME | Time saved per instance | Hours, not minutes |
| REV | Revenue/cash impact | Directly wins orders or frees cash |
| BUILD | Ease of build | Buildable by one person in weeks |
| BUY | Buyer clarity | One person owns the budget and the pain |
| WHITE | Competitive whitespace | No incumbent already ships it |
| EXPL | Explainability | Sellable in two minutes to a non-technical owner |
| REPT | Repeatability | The same build resells to the next client |

### Scores

| # | Workflow | FRQ | PAIN | MEAS | DATA | ERR | TIME | REV | BUILD | BUY | WHITE | EXPL | REPT | **TOT** |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| W1 | **RFQ inbound → preventivo** (conto terzi) | 9 | 9 | 8 | 7 | 6 | 8 | 9 | 6 | 9 | 5 | 9 | 8 | **93** |
| W6 | Gare/tender monitoring + qualification | 7 | 7 | 8 | 9 | 8 | 7 | 8 | 7 | 6 | 3 | 8 | 7 | **85** |
| W2 | Order entry: PDF/email order → ERP | 9 | 7 | 9 | 8 | 4 | 6 | 4 | 7 | 7 | 4 | 9 | 8 | **82** |
| W11 | Solleciti / receivables chasing | 7 | 6 | 9 | 8 | 6 | 4 | 7 | 8 | 6 | 4 | 8 | 8 | **81** |
| W10 | Three-way match fattura/ordine/DDT | 9 | 6 | 9 | 8 | 6 | 5 | 4 | 7 | 6 | 3 | 8 | 8 | **79** |
| W5 | Technical drawing → BOM / feature extraction | 8 | 9 | 7 | 4 | 3 | 9 | 8 | 2 | 8 | 6 | 7 | 5 | **76** |
| W3 | Supplier quote comparison (RDO) | 6 | 6 | 7 | 6 | 7 | 6 | 6 | 6 | 6 | 6 | 7 | 6 | **75** |
| W8 | Material certificate (3.1) ↔ lot matching | 7 | 7 | 8 | 6 | 4 | 6 | 4 | 6 | 6 | 8 | 7 | 6 | **75** |
| W13 | Technical documentation translation EN/DE | 5 | 6 | 7 | 8 | 6 | 8 | 5 | 8 | 5 | 2 | 7 | 7 | **74** |
| W15 | Capitolato compliance checking | 4 | 9 | 6 | 7 | 2 | 9 | 8 | 4 | 6 | 7 | 7 | 4 | **73** |
| W18 | Spare-part identification from photo/serial | 6 | 7 | 7 | 5 | 5 | 6 | 7 | 4 | 6 | 7 | 8 | 5 | **73** |
| W7 | Non-conformity → 8D / CAPA drafting | 5 | 6 | 6 | 6 | 7 | 7 | 3 | 7 | 5 | 7 | 6 | 6 | **71** |
| W9 | "Where is my order?" status enquiries | 9 | 6 | 8 | 5 | 5 | 4 | 3 | 5 | 5 | 5 | 8 | 7 | **70** |
| W4 | DDT / packing list generation | 9 | 4 | 7 | 8 | 5 | 3 | 2 | 8 | 5 | 2 | 6 | 7 | **66** |
| W17 | Scadenzario sicurezza / formazione | 4 | 6 | 8 | 6 | 5 | 4 | 3 | 7 | 4 | 3 | 7 | 7 | **64** |
| W12 | CV screening for officina roles | 4 | 5 | 6 | 7 | 4 | 5 | 2 | 7 | 4 | 3 | 7 | 6 | **60** |
| W14 | Maintenance logs → scheduling | 5 | 5 | 6 | 3 | 6 | 4 | 4 | 5 | 5 | 5 | 6 | 5 | **59** |
| W16 | Export docs / dual-use screening | 4 | 7 | 6 | 6 | 2 | 5 | 3 | 4 | 4 | 7 | 5 | 4 | **57** |

### The ranking is not the answer — two filters change it

**Filter 1 — can this workflow carry a €20,000 price?** Requires REV ≥ 7 **and** PAIN ≥ 7. Survivors: **W1, W6, W5, W15, W18**. Everything else is a €3–8k job at best, no matter how well it scores overall. W11 (solleciti, 81) and W10 (three-way match, 79) are genuinely good automations that **cannot carry the price**, and selling them at €20k would be a lie the buyer would eventually detect.

**Filter 2 — can one person build it and is the space open?** Requires BUILD ≥ 5 and DATA ≥ 6. Survivors from filter 1: **W1 and W6**.
- W5 (drawing → BOM) dies on BUILD = 2. Parsing DWG/STEP geometry into manufacturable features is a multi-year engineering problem, and getting it wrong prices a job wrong. Do not attempt it in year one. It is, however, the single most valuable thing in this table if it were ever solved — note it as a long-term direction, not a beachhead.
- W15 (capitolati) dies on ERR = 2 and REPT = 4.
- W18 dies on BUILD = 4.

**Between W1 and W6:** W6 (gare) scores 85 and has the better data situation — tender portals are public, structured, and legally accessible, which is rare. It dies on **WHITE = 3**: Italian tender-monitoring services already exist and are established. Entering as an unknown against incumbents with a decade of data is the worst possible first fight.

**W1 (RFQ → preventivo) wins**, with an honest asterisk: its own whitespace score is only 5, because vertical ERPs ship quoting modules (attack C). The defence is that the ERP module starts *after* the data is structured, and DOLMIR's value is entirely in the messy 30 metres before that — an email, a PDF, a photo of a hand-annotated drawing, a customer's own part number. That boundary is where the business lives or dies, and it should be stated that plainly in every sales conversation.

**RECOMMENDATION:** commit to W1 as the single workflow for the first three customers. Build nothing for W2–W18 until customer #3 is signed. The existing `packages/rfq-engine` and the data-driven `WorkflowDefinition` already reflect this; do not widen them.

---

# 4. The €20,000 problem

The brief asked: what is the problem worth €20,000 to a Lombardy SME? Here is the arithmetic, run two ways — the way most AI consultancies pitch it (which fails), and the way that actually closes.

## 4.1 The labour-saving argument — it does not close

**FACT:** RAL €30,000 → ~€41,073 employer cost (~137% of RAL); metalmeccanico CCNL 3–5% higher (SOURCE: Italian employer cost analyses, 2025–2026).
**ESTIMATE:** ~1,650 productive hours/year → **€24.9/hour ≈ €25/h loaded.**
**ESTIMATE:** DOLMIR TCO over 3 years = €20,000 implementation + (€590 × 36) = **€41,240.**
**ESTIMATE:** Break-even = €41,240 ÷ €25 = 1,650 hours ÷ 156 weeks = **10.6 hours/week freed just to break even.**
**ESTIMATE:** For a buyer who wants a 3× return before signing — which is the normal ask from an Italian SME owner spending their own money — you need **~32 hours/week freed.** That is a full FTE.

**INFERENCE:** In a 20–50 person shop where 1–3 people do quoting, freeing 32 hours/week means eliminating most of one person's job. That is (a) rarely true and (b) something the owner will not say out loud, because that person is often a long-serving employee or a family member. **The labour-saving pitch fails both arithmetically and socially.**

This is why the previous phase's threshold of ≥10 RFQ/week was wrong. At, say, 25 minutes of human handling per RFQ, 10 RFQs/week = ~4 hours/week = ~€5,200 over three years. That does not pay for a €41k engagement. **The revised qualifying threshold is ≥20–25 RFQ/week** (ESTIMATE), which frees ~8–10 h/week — still only break-even. It follows that **the labour argument can never be the primary argument.** It is at best a supporting one.

## 4.2 The revenue argument — this is where €20,000 closes

Reframe. The question is not "how many hours do we save" but **"how many quotes do you currently not send, or send too late?"**

**FACT:** Preparing a preventivo for a significant commessa takes 2–5 hours in many Italian SMEs (SOURCE: Italian automation practitioner reporting, 2026). **Caveat: this is vendor-published content, not independent research. Treat as LIKELY, not CONFIRMED.**

**ESTIMATE — worked example, deliberately conservative:**

| Input | Conservative value | Notes |
|---|---|---|
| Qualifying RFQs received per week | 25 | ICP A threshold |
| RFQs currently answered | 18 | 7/week declined, deprioritised, or answered too late |
| Average order value when won | €8,000 | Conservative for conto terzi commessa |
| Win rate | 20% | Conservative; conto terzi shops often quote against 3–5 competitors |
| Gross margin on the order | 20% | Conservative for metalmeccanica conto terzi |
| Margin per **quote sent** | €8,000 × 20% × 20% = **€320** | |

If DOLMIR lets the same team answer **5 more quotes per week** — not 7, not all of them — that is 5 × 48 weeks × €320 = **€76,800 of additional gross margin per year.**

Against a first-year cost of €20,000 + €7,080 = €27,080, that is a **2.8× return in year one** and roughly 5.5× annualised thereafter.

**This is the €20,000 problem: not "quoting takes too long", but "you are leaving margin on the table every week because your quoting capacity is fixed and your inbound is not."**

## 4.3 Stress-testing my own numbers

I do not want you to trust the table above, so here is where it breaks:

- **If the shop answers everything already** (no declined RFQs), the revenue argument collapses to zero and only the weak labour argument remains. **This is the single most important qualifying question in the first meeting**, and it must be asked before any pricing is discussed.
- **If the win rate improvement is zero** because the customer buys purely on price and DOLMIR only makes quotes *faster*, not *better*, the extra quotes may convert below 20%. Speed-to-quote does correlate with win rate in most B2B contexts, but I have **no Italian metalmeccanica-specific data** on this — **UNKNOWN**, and it is the load-bearing assumption of the whole model.
- **If average order value is €2,000 rather than €8,000**, margin per quote drops to €80 and you need 20 extra quotes/week to justify the fee. This is exactly why ICP A excludes high-volume/low-value shops and why ICP B (distributori) is secondary.
- **If margin is 8% rather than 20%** — plausible for commodity lavorazioni in a price-squeezed market — the return halves.

**RECOMMENDATION:** never present the revenue table with your numbers. Present it as an empty template and fill it in *with the client, using their numbers, in the first meeting*. If their numbers do not produce at least a 2× first-year return, tell them so and do not sell. This is the commercial expression of the same principle already built into the engine: refuse to produce an answer the evidence does not support.

## 4.4 What the €20,000 must never be

**RECOMMENDATION — do not sell any of these at €20k**, all of which a generalist AI agency would try: a chatbot on the website, "AI training for your team", a document Q&A over the company's files, social media content generation, a dashboard. Each is either substitutable by a €20/month tool (attack A), or unmeasurable (fails MEAS), or both.


---

# 5. The nine competitor categories

Not a list of companies — a map of the *nine different things* a prospect could buy instead of DOLMIR. You lose deals to categories, not to named rivals. For each: who they are, what they charge (where publicly known), why they win, why they lose, and how DOLMIR must answer.

**Pricing note, applied throughout:** for most of these categories **pricing is not publicly disclosed.** I state that rather than estimating.

## C1 — Doing nothing / the status quo
**Who:** the titolare who says "ci pensiamo dopo l'estate."
**Price:** €0 visible, and the invisible cost is exactly the €76,800 of §4.2 — which they do not see, because unsent quotes generate no invoice and no complaint.
**Why they win:** no risk, no disruption, no decision. **This is DOLMIR's biggest competitor and will win most deals.**
**How DOLMIR answers:** make the invisible cost visible with *their* numbers in the first meeting (§4.3). Nothing else works against inertia.

## C2 — Hiring a person instead
**Who:** the same owner posting a job ad for a preventivista.
**FACT:** cost of that person ≈ **€41,073/year** fully loaded at RAL €30k, recurring forever.
**Why they win:** an employee is legible, flexible, and culturally the default. Nobody was ever criticised for hiring.
**Why they lose:** €41k/year forever vs. €20k once; recruitment in Lombardia metalmeccanica is slow and competitive; the new hire needs 3–6 months to be productive; and they will spend a large share of their time on exactly the mechanical extraction work DOLMIR removes.
**How DOLMIR answers:** this is the *strongest* frame available, and it is the reason the job-ad trigger in §7 is so valuable. The pitch is not "instead of hiring" — it is **"before you hire, let's make sure the role you're advertising is the one you actually need."** Note the honest risk: some will conclude they need both.

## C3 — ChatGPT / Copilot / Gemini used directly
**FACT:** ~65% of Italian professionals already use ChatGPT; the Italian AI market grew ~50% to €1.8bn in 2025 (SOURCE: Osservatorio AI, Politecnico di Milano).
**Price:** €20–30/user/month.
**Why they win:** cheap, immediate, no vendor, no project. For low-volume tasks they are genuinely the right answer.
**Why they lose:** no integration into the gestionale; no memory of past quotes as comparables; no confidence gate — it will produce a plausible price with no evidence, which is exactly the failure mode that costs a shop money; no audit trail.
**How DOLMIR answers:** put the comparison on the website in writing, honestly, including the cases where the answer is *"use ChatGPT, don't call us."* The `/confronto` page proposed in `DOLMIR_FINAL_POSITIONING.md` is the correct instrument. **Never pretend this competitor doesn't exist** — the buyer's teenage nephew already told them about it.

## C4 — Vertical ERP / gestionale vendors with quoting modules
**Who:** Gestlam, MTS Informatica (Business CUBE Metal), Pro Consulting (Metal Pro), Integro360, Plancraft and similar (SOURCE: vendor websites).
**Price: not publicly disclosed** for any of them.
**Why they win:** incumbency, the data is already in their system, a single throat to choke, and the buyer's commercialista already knows them.
**Why they lose:** their module begins where the data is already structured; migration/config projects are long; and their pricing model assumes a full ERP relationship.
**How DOLMIR answers:** explicitly *pro-incumbent* positioning — "we feed your gestionale, we do not replace it." Being the vendor who does not ask them to rip anything out is a structural advantage against a 24%-trust backdrop.

## C5 — Generalist "agenzie AI" and automation freelancers
**Who:** the fastest-growing category in Italy; typically n8n/Make integrators and AI content shops.
**FACT (indicative pricing):** Italian IT consultants commonly charge **€300–600/day**, with €80–150/hour quoted for consulenza informatica and senior specialists above €1,000/day (SOURCE: Italian consulting-rate guides, 2026). **Treat as LIKELY, not CONFIRMED — these are aggregator/blog figures, not a survey.**
**Why they win:** cheaper, faster to start, will say yes to anything.
**Why they lose:** no domain understanding of manufacturing; deliver a workflow that works in the demo and rots in month three; this category is the main producer of the 24%-trust / 38%-satisfaction statistics.
**How DOLMIR answers:** the "tools get abandoned" thesis from `12-competitive-intelligence.md` is the differentiator — but it is *unprovable without a track record*, so it must be demonstrated structurally (refusal behaviour, evidence, handover documentation) rather than asserted.

## C6 — Traditional system integrators and software houses
**Price:** not publicly disclosed; project-based, typically an order of magnitude above DOLMIR.
**Why they win:** they can staff a real project and survive an audit; procurement-safe.
**Why they lose:** minimum viable engagement is far above a 30-person shop's budget; slow.
**How DOLMIR answers:** not a real competitor in ICP A. Do not position against them; you will only make yourself sound expensive.

## C7 — Point-solution SaaS products (quoting/CPQ)
**Price:** varies; generally per-seat monthly, and mostly Anglo-Saxon products poorly adapted to Italian conto terzi practice.
**Why they win:** cheap, instantly available, no project.
**Why they lose:** assume a product catalogue and configurable options; a conto terzi shop quoting from customer drawings has nothing to configure.
**How DOLMIR answers:** name them honestly on `/confronto`. If a prospect has a catalogue, tell them to buy the product.

## C8 — The internal "smanettone"
**Who:** the owner's son, the IT-literate impiegato, the nephew studying at Politecnico who "already made a GPT."
**Price:** €0 marginal, and free is a very strong price.
**Why they win:** trust, availability, zero procurement.
**Why they lose:** it is nobody's job; it breaks when they are on holiday; no ownership, no documentation, no continuity.
**How DOLMIR answers:** **do not compete with this person — recruit them.** They are the internal champion. The pitch is "you built the prototype that proved it works; we build the version that survives you being on holiday." Fighting them loses the deal.

## C9 — Consulenti di processo / Lean & Industry 4.0 consultants
**Who:** the established process-consulting layer around Confindustria/Confapi, plus ex-Transizione 4.0/5.0 advisors now looking for a new subject.
**FACT:** management consultants in Italy are commonly quoted at €400–800/day (SOURCE: Italian consulting rate guides — **LIKELY, not CONFIRMED**).
**Why they win:** existing relationships, association credibility, they speak the owner's language.
**Why they lose:** they produce analysis, not a working system; the deliverable is a slide deck.
**How DOLMIR answers:** **this is a partner channel, not a competitor.** They diagnose and cannot implement; DOLMIR implements and lacks the relationship. See §6.

## Where DOLMIR actually sits

**INFERENCE:** DOLMIR's true competitive set is **C1 (nothing), C2 (hiring), C3 (ChatGPT) and C8 (the nephew)** — not C4/C5/C6. Three of those four cost the buyer nothing or very little. That is the honest competitive picture, and it means **the sales job is not "why us instead of them" but "why now instead of never."**

---

# 6. How Italians actually buy — and how that produces the first three customers

## 6.1 What the evidence says

**FACT:** Successful software adopters in Italy make the final decision **within three months**; longer purchase timelines correlate with *dissatisfaction* (SOURCE: Capterra Italia, 2026 software buying trends report, 3,300+ decision-makers across 11 countries, 263 in Italy).
**FACT:** Trust in ICT vendors among Italian SMEs fell to 24% (2023) from 42% (2018).
**FACT:** 72% of Italian SMEs with 10+ employees use an external IT provider; **38% are satisfied.**
**FACT:** References from similar companies weigh most heavily; demos on the customer's own real data outperform brochures.
**FACT:** Bilanci of società di capitali are public and obtainable by anyone, without authorisation or any connection to the company (SOURCE: Registro Imprese / Camere di Commercio).
**FACT:** Cold email is lawful to generic role addresses; cold calling is lawful, human-dialled, to numbers screened against the RPO (§1.D).

**INFERENCE from the three-month finding:** the widespread belief that Italian SMEs are slow buyers is imprecise. They are slow to *engage*, then fast to *decide*. The bottleneck is the first meeting, not the close. **That relocates the entire problem to getting into the room** — which is what §7 is about.

## 6.2 The three routes into the room, ranked

**Route 1 — Warm introduction through an intermediary (HIGHEST probability, slowest to set up).**
The intermediaries who already have trust with ICP A: commercialisti serving metalmeccanica clients, consulenti di processo (C9), associazioni di categoria (Confindustria Bergamo/Brescia, Confapi, API Lecco-Sondrio), and CAD/CAM or gestionale resellers who sit inside these shops already.
**RECOMMENDATION:** approach 10–15 of these with an explicit, non-fluffy proposal: *"I do one thing — inbound RFQ to preventivo. I don't sell ERP, I don't touch your scope. If you have a client drowning in preventivi, introduce me and I'll do the first Rilievo at no charge to you; if I'm not the right answer, I'll tell them so in writing."* A referral partner's own reputation is at stake, so being visibly willing to disqualify is the currency that opens this channel.

**Route 2 — Observation-based direct approach (MEDIUM probability, fastest to start, fully in your control).** This is §7.

**Route 3 — Trade fairs and local events (MEDIUM, expensive in time, good for route 1).** MECSPE, Lamiera, BI-MU and provincial Confindustria events. Attend as a visitor, not an exhibitor. The value is not leads; it is intermediaries for route 1 and — importantly — hearing how owners describe the problem in their own words, which you cannot get from a search engine.

**Explicitly deprioritised:** LinkedIn content, SEO, and paid ads. **INFERENCE:** the buyer is a 45–60-year-old owner of a conto terzi shop in Bergamo. Content marketing reaches this person years too slowly to fund a first customer, and SEO against established ERP vendors is a two-year project. The website is not a lead generator (see §13).

## 6.3 The realistic path to customers 1, 2, 3

- **Customer #1 — from route 1.** Comes via an intermediary, is a personal favour to that intermediary, and will negotiate. Accept a reduced price for the Rilievo if — and only if — you get a written, nameable reference in exchange. **RECOMMENDATION:** ask for the reference in the contract, not afterwards.
- **Customer #2 — from route 2.** Comes from the observation approach, converted by the demo on their own data plus the existence of customer #1 as a reference.
- **Customer #3 — from customer #1's network.** In dense provincial manufacturing networks, a satisfied conto terzi shop knows five others with the identical problem, and — crucially — they are usually **not** direct competitors if they do different lavorazioni. **RECOMMENDATION:** ask customer #1 for two specific introductions at the moment of the first measurable result, not at the end of the project.

---

# 7. The first-customer strategy, built on an OBSERVATION

The brief forbids "ask them what problem they have" — correctly, because it asks the prospect to do your work and signals you know nothing about them. The alternative is to arrive already knowing something true, specific, and public.

## 7.1 The primary observation: they are advertising for a preventivista

**FACT:** job ads for *preventivista*, *tecnico preventivista*, *impiegato ufficio tecnico – preventivi* in metalmeccanica and carpenteria are actively posted across Bergamo, Brescia and Milano (SOURCE: Indeed Italia and InfoJobs listings, 2026; example roles include "elaborare preventivi tecnico-economici per carpenterie metalliche medio-pesanti" and "potenziamento dell'Ufficio Preventivi").

**Why this is the right observation, and not a gimmick:**
1. It is **public and published by the company itself** — no scraping of personal data, no inference about their internals, nothing they would be uncomfortable knowing you saw.
2. It is a **declaration of the exact bottleneck DOLMIR solves**, made voluntarily and in writing.
3. It carries a **quantified alternative**: they have already decided to spend ~€41,073/year (FACT, §1.B) on this problem. You are not creating a budget; you are competing for one that already exists. That is a fundamentally different and much easier sale.
4. It is **time-bound**: the ad is live now. Urgency comes from their calendar, not from a manufactured discount.

## 7.2 The ethical and legal boundary — where I would stop

The brief said to use an observation "only if ethically and legally appropriate." Here is the line, drawn explicitly.

**Permitted:**
- Reading a public job ad and referencing it plainly.
- Reading a publicly deposited bilancio (FACT: legal, no authorisation required) to size the company.
- Reading their public website, catalogue, certifications and trade-fair presence.
- Writing to a **generic role address** (`info@`, `commerciale@`, `amministrazione@`) — outside GDPR because it is legal-entity data.
- Calling a company landline **after screening it against the RPO**, with a human operator.

**Not permitted, and I would refuse to build any of it:**
- Emailing `nome.cognome@azienda.it` without consent (Garante: legitimate interest rejected for unsolicited commercial email).
- Harvesting contacts from professional registries or albi for commercial contact.
- **Submitting a fake RFQ through their quote form to measure their response time.** This is the single most tempting tactic in this space and it is deceptive — you would be impersonating a customer and consuming a real person's unpaid technical work. It also destroys the trust position that is DOLMIR's only differentiator. **Do not do it.**
- Any claim to know their internal volumes, systems, or margins. You do not.
- Automated sequences, drip campaigns, or anything that makes 200 companies receive the same email. Beyond the legal exposure, it defeats the entire mechanism: the observation only works because it is *singular*.

## 7.3 The approach, concretely

**Step 1 — Build the observation list (manual, ~2 hours/week).** Monitor Indeed/InfoJobs for the role titles above, filtered to Lombardia manufacturing. **ESTIMATE:** 5–15 qualifying ads per week across BG/BS/MI/CO/LC. For each: find the company, verify ATECO and size from the visura/bilancio, find the role address, confirm they are conto terzi from their own site. Target: **30–40 qualified observations per month.** This is deliberately manual. Automating it would produce volume and destroy the specificity that makes it work.

**Step 2 — One email, to a role address, in Italian, that says something true.** Structure (not a template to send verbatim — each one must be individually true):

> **Oggetto:** la vostra ricerca di un preventivista
>
> Buongiorno,
> ho visto l'annuncio con cui cercate un [titolo esatto del ruolo]. Non mi candido e non vendo personale.
>
> Faccio una cosa sola: prendo le richieste di preventivo che vi arrivano via email — PDF, disegni, richieste scritte a mano — e le trasformo in una scheda già compilata per il vostro gestionale, con un livello di confidenza dichiarato. Quando i dati non bastano per dire un prezzo, il sistema **non lo inventa**: scrive che serve la valutazione di un preventivista.
>
> Prima che assumiate qualcuno, può avere senso capire quanta parte di quel ruolo è lavoro meccanico di lettura e trascrizione. Se la risposta è "poca", ve lo dico e chiudiamo qui.
>
> Se vi interessa: mandatemi 5 richieste di preventivo reali che avete già gestito. Le faccio passare dal sistema e vi mostro il risultato — compresi i casi in cui sbaglia. Venti minuti, in videochiamata o da voi.
>
> [nome] — DOLMIR

Why this works against the competitive set of §5: it addresses C2 (hiring) head-on rather than pretending it isn't happening; it pre-empts C3 by describing the confidence gate that ChatGPT does not have; it invites disqualification, which is the only credible signal available to a vendor with no clients; and it makes a small, concrete, low-risk ask.

**Step 3 — The demo is on their five real RFQs, and it is allowed to fail.** This is the whole strategy. **FACT:** Italian SME buyers prefer demos on their own real data over brochures. Run the pipeline live. When it returns `REQUIRES_TECHNICAL_ESTIMATE` on the ambiguous one, **do not apologise for it — point at it.** That refusal is the product.

**Step 4 — Human follow-up by telephone**, once, to the company landline, RPO-screened, 5–7 working days later. Not a sequence.

**ESTIMATE of the funnel** (see §12 for the full arithmetic): 40 observations/month → 3–5 replies → 2–3 demos → 1 paid Rilievo. That is the honest shape.

## 7.4 The secondary observation, for when the job-ad well runs dry

**Observation 2 — the response-time claim they make themselves.** Some shops publish "rispondiamo entro 24/48 ore" on their site. That is a public commitment about the exact workflow DOLMIR addresses, and it can be referenced honestly: *"avete scritto che rispondete entro 48 ore; noi lavoriamo su come mantenere quella promessa quando le richieste raddoppiano."* No verification of whether they keep it — you don't know and must not imply you do.

**Observation 3 — visible growth without visible office growth.** From public bilanci: revenue up materially year-on-year while costo del personale is flat. **INFERENCE:** more orders through the same office. Legitimate, public, and specific — but weaker than the job ad, because the inference could be wrong for a dozen reasons. Use it as context in a conversation, never as the opening claim.


---

# 8. The first offer — three options, one choice

## Option A — "Rilievo di Processo" as a paid diagnostic (€2,900), implementation quoted after

The offer currently defined in `DOLMIR_FINAL_POSITIONING.md`. Two days of work; the deliverable is a measured map of the RFQ flow, the volume and margin arithmetic of §4 filled in with the client's real numbers, and a go/no-go recommendation that is allowed to say *no*.

- **For:** paid from the first day, so it filters tyre-kickers; qualifies the €20k before anyone commits to it; produces a written artefact the client can show a partner; and being willing to conclude "don't do this" is the strongest available trust signal in a 24%-trust market.
- **Against:** €2,900 for two days of analysis from an unknown vendor is itself a hard sale — you are asking for money before demonstrating anything. It also risks looking like C9 (the consultant who delivers a deck).
- **Risk:** you sell three Rilievi, two conclude "no", and you have €8,700 and no implementation reference.

## Option B — Fixed-scope first implementation at a deliberately low price (€6,000–8,000), one workflow, 4 weeks

Skip the diagnostic. Sell a small, complete, working thing: inbound RFQ → structured record → draft preventivo, integrated into one mailbox and one output format, with the confidence gate.

- **For:** the client gets a working system, not a document. It produces the reference and the case study that unlock everything else (attack H). Four weeks is inside the three-month decision window (FACT, §6.1). Low enough that a titolare can approve it alone.
- **Against:** €6–8k for 4 weeks of work is roughly €1,500–2,000/week — below the €300–600/day market rate for Italian IT consulting (LIKELY, §5/C5). You are subsidising the reference. It also anchors your price low, and the first client will expect the same rate for phase two.
- **Risk:** you underprice permanently and the business never reaches the economics of §4.

## Option C — Free proof-of-concept on their data, then €20k+ implementation

Run the pipeline on their 5–10 real RFQs at no charge, show the output, then quote the full implementation.

- **For:** zero friction to the first meeting; maximum use of the "demo on real data" finding; costs you a day.
- **Against:** **free work signals that the work is worth nothing**, which is precisely wrong in a market where the buyer's main fear is a vendor who disappears (38% satisfaction, FACT). It attracts curiosity rather than intent. And it puts the entire commercial burden on a single €20k close with no intermediate commitment.
- **Risk:** high volume of pleasant meetings, no revenue.

## The choice

**RECOMMENDATION: Option B, with the free micro-demo of Option C used only as the meeting hook — and Option A introduced from customer #3 onward.**

Reasoning, stated as a sequence rather than a preference:

1. **What DOLMIR lacks is not margin, it is proof.** Attack H is the binding constraint. Every euro of first-customer pricing should be spent buying proof, not revenue.
2. **Option A requires the trust it is designed to build.** It is the right product for a company that already has two references. It is the wrong *first* product, because it asks the buyer to pay for judgement from someone whose judgement is unproven. This is a correction to `DOLMIR_FINAL_POSITIONING.md`, which put the Rilievo first.
3. **Option C's free demo is correct as a hook and wrong as an offer.** Running five of their real RFQs through the pipeline in a 20-minute call costs you almost nothing and is the single most persuasive thing you can do (FACT: demos on own data beat brochures). But it must lead to a priced, scoped, contracted thing in the same conversation — not to "let me send you a proposal."
4. **The price ladder that follows:** customer #1 at €6,000 in exchange for a written, nameable reference and two introductions. Customer #2 at €12,000. Customer #3 at €18,000, and from there the €18–35k band of the existing positioning becomes defensible because you can point at three working systems.
5. **The retainer:** keep the €390–790/month Presidio from the current positioning, but **do not sell it with the first implementation.** Sell it at month two, when the client has seen the system work and has started to worry about what happens if it stops. Selling maintenance to someone who has not yet experienced the thing working is selling insurance against an event they cannot picture.

**Explicit disagreement with prior work:** `DOLMIR_FINAL_POSITIONING.md` set the Rilievo di Processo at €2,900 as the entry product. I now think that is wrong for customers 1–2 and right from customer 3. The reason is attack H, which that document acknowledged but did not price against.

---

# 9. What DOLMIR does — four depths

## One sentence
> DOLMIR trasforma le richieste di preventivo che arrivano disordinate — email, PDF, disegni — in schede già compilate per il vostro gestionale, e quando i dati non bastano lo dice invece di inventare un prezzo.

## Thirty seconds
> Le officine conto terzi ricevono richieste di preventivo in email, allegati PDF, disegni, a volte foto. Qualcuno in ufficio tecnico legge tutto, cerca lavori simili fatti in passato, e riscrive i dati nel gestionale. Sono ore ogni settimana, e le richieste che non fanno in tempo a evadere sono margine che se ne va.
>
> DOLMIR costruisce il pezzo che manca: le richieste entrano come sono, escono come schede strutturate — materiale, quantità, lavorazioni, riferimenti a commesse simili già fatte — pronte per il vostro gestionale, quello che avete già.
>
> La differenza rispetto a un chatbot è una sola: quando le informazioni non bastano per dire un prezzo, il sistema si ferma e scrive "serve la valutazione del preventivista". Non tira a indovinare. In questo mestiere un prezzo sbagliato costa più di un prezzo dato in ritardo.

## Two minutes
> *(Structure for the meeting, not a script to memorise.)*
>
> **Il punto di partenza.** Il collo di bottiglia di un'officina conto terzi che lavora bene non è quasi mai in officina. È nei trenta metri tra la casella di posta e il gestionale: qualcuno deve leggere, capire, cercare precedenti, e ribattere i dati. Quel tratto non è mai stato informatizzato perché è irregolare — ogni cliente scrive in modo diverso.
>
> **Cosa facciamo.** Quel tratto lo copriamo noi. Le richieste arrivano dove arrivano già oggi. Il sistema legge mittente, oggetto e corpo del messaggio, apre gli allegati, estrae materiale, quantità, tolleranze, trattamenti, tempi richiesti. Per ogni campo dichiara un livello di confidenza e mostra da dove l'ha preso — la frase esatta nel documento. Poi cerca nelle vostre commesse passate quelle davvero comparabili e propone una bozza.
>
> **Dove si ferma.** Se non trova precedenti sufficientemente simili, non propone un prezzo. Scrive che serve una valutazione tecnica e passa la pratica al preventivista. Se la quantità è sotto il vostro minimo di lavorazione, ve lo dice. Se il pezzo somiglia a un lavoro fatto per un altro cliente, ve lo segnala invece di usarlo in silenzio.
>
> **Cosa non facciamo.** Non sostituiamo il gestionale. Non tocchiamo la produzione. Non vi chiediamo di cambiare come lavorate. Non vi vendiamo formazione sull'intelligenza artificiale.
>
> **Come si capisce se serve.** Prendete cinque richieste di preventivo vere delle ultime due settimane. Le facciamo passare dal sistema davanti a voi, comprese quelle su cui sbaglia. Se dopo venti minuti la risposta è che non vale la pena, ve lo diciamo noi.
>
> **Quanto costa e quanto rende.** L'implementazione è a prezzo fisso e concordato prima. Il ritorno lo calcoliamo insieme con i vostri numeri: quante richieste ricevete, quante ne evadete, quanto vale un ordine medio, che marginalità avete. Se il conto non torna almeno due volte nel primo anno, non firmiamo.

## Technical
DOLMIR builds and operates a document-to-decision pipeline for a single, client-specific workflow. The architecture is a staged pipeline — classify → extract → confidence-gate → triage → retrieve comparables → draft → human approval — implemented over a provider-agnostic model abstraction (`@dolmir/ai-core`), with the workflow itself expressed as data (`WorkflowDefinition`) rather than code, so the same engine serves different clients and different workflows without a rewrite.

Extraction returns, for every field, a value, a confidence score, and the verbatim evidence span it came from. A confidence gate below threshold routes to human review rather than to output. Pricing is proposed only when a retrieved historical job clears a similarity threshold; otherwise the draft returns `suggestedUnitPriceEur: null` with `priceBasis: 'REQUIRES_TECHNICAL_ESTIMATE'`. Cross-customer comparables are surfaced as an explicit warning rather than used silently.

Vendor SDKs are confined to `packages/ai-core/src/providers/` behind subpath exports, so the model provider is a deployment decision, not an architectural one — which matters commercially: a client asking "what if OpenAI raises prices / what if you disappear" gets a structural answer, not a reassurance. Deliverables include the running system, the workflow definition, and handover documentation sufficient for another developer to take it over. That last point is the answer to the 38%-satisfaction problem: **the client is not locked in, and is told so in writing.**

---

# 10. Your role — versus every tool you have

The brief asked me to define your role relative to Claude, ChatGPT, AI tools generally, Higgsfield, n8n, GitHub, Notion, the client, and a future developer. This is the section most likely to be uncomfortable, so I will be direct.

## What the tools have already done, and what it means

The tools have made **building** nearly free and left **distribution** exactly as expensive as it was. In this project, an AI-assisted process produced a working pipeline, a design system, a website, and several hundred pages of researched strategy — and **zero customers**. That asymmetry is the single most important fact about your position. It is also why the temptation to keep building is the largest risk to the business (see §16).

## Role definitions

**vs. Claude (and this session).** I can research, reason, write, build, and argue with you. I cannot: sign a contract, carry professional liability, walk into a shop in Bergamo, read a titolare's hesitation across a table, take a phone call, or be the person a client calls when the system breaks on a Friday. **Your role: everything that requires a legal person and a body.** Also — and this session is evidence — I will produce a great deal of plausible, well-formatted output. Your job is to be the one who asks whether any of it has been tested against a real buyer. Nothing in this document has been.

**vs. ChatGPT / general AI tools.** These are your competitors (C3) before they are your tools. **Your role: to know precisely where they are sufficient and to say so out loud.** That honesty is your product's differentiator, and it is the one thing a competitor cannot copy without destroying their own pitch.

**vs. Higgsfield (and generative media tools).** Marketing imagery and video. **Your role: severe restraint.** For a metalmeccanica buyer, glossy AI-generated visuals actively signal "agency, not engineer." A photograph of a real shop floor you actually visited is worth more than any generated asset. **RECOMMENDATION: use Higgsfield for nothing customer-facing until you have a real client site to photograph.** The risk is not cost, it is credibility.

**vs. n8n / Make / low-code automation.** These are the correct tool for the glue — mailbox polling, file movement, notifications — and the wrong tool for the judgement layer. **Your role: to draw that line deliberately and to own the judgement layer in real code.** The distinction matters commercially too: a competitor selling pure n8n workflows (C5) is selling something the client's nephew could rebuild; a confidence-gated extraction engine with evidence spans is not.

**vs. GitHub.** Version control, CI, and — importantly — the handover artefact. **Your role: to treat the repository as a deliverable the client owns**, not as your private asset. This is a direct answer to the 38%-satisfaction statistic, and you should say it in the sales meeting.

**vs. Notion.** Operating memory. **Your role: to keep it small.** Seven databases were built where twenty-three were specified, correctly. The failure mode of a solo founder is building the internal system instead of the business. Notion should hold prospects, observations, conversations, and delivery status. Nothing else, until there is someone else to coordinate with.

**vs. the client.** The client owns the domain knowledge, the historical quotes, the definition of "similar job", and the final price. **Your role is not to know their business better than they do — it is to build the thing that captures what they know and makes it repeatable.** Say this explicitly; it disarms the "an outsider can't understand our work" objection, which you will hear in every first meeting.

**vs. a future developer.** Everything you build now will be maintained by someone who is not you — possibly the client's own IT person, possibly a hire. **Your role: to build as if handover is certain**, because it is. Concretely: the workflow-as-data design, the provider abstraction, and written handover docs are not engineering vanity; they are the commercial promise that the client is not trapped.

## The one-line version

**Your role is to be the accountable human between a set of tools that can build anything and a market that trusts almost no one.** The tools cannot be accountable. That is the entire job, and it is not a small one.

---

# 11. Minimum viable operating stack

The test for every item: *does it get you closer to customer #1?* Anything that fails is deferred, however satisfying it would be to build.

## Keep (already exists, sufficient)
| Tool | Purpose | Why it stays |
|---|---|---|
| GitHub monorepo | Engine, workflows, website | Built, works, is the handover artefact |
| `@dolmir/ai-core` + `rfq-engine` | The demo and the first delivery | This *is* the product |
| Next.js site | Credibility surface + demo host | Built; see §13 for its actual job |
| Notion (7 databases) | Prospects, observations, conversations, delivery | Adequate. Do not expand |
| Google Workspace / Gmail | Correspondence, drafts | Already in use |
| Registro Imprese / visure | Company sizing from public bilanci | Legal, cheap, high-signal |
| Indeed + InfoJobs | The observation source (§7) | The primary lead engine |
| Calendar with public booking link | Removes a round-trip from meeting scheduling | Trivial, high leverage |

## Add (small, cheap, directly serves customer #1)
| Item | Why | Cost |
|---|---|---|
| P.IVA + regime/inquadramento confirmed with a commercialista | You cannot invoice without it. **This is a hard blocker on revenue** | Commercialista fee |
| RPO screening process for phone numbers | Legal requirement before any call (FACT, §1.D) | Low |
| Privacy policy + cookie policy reviewed by a lawyer | Site currently unlaunchable without it | One-off |
| A written, signed reference clause in the customer #1 contract | Converts a discount into an asset | €0 |
| A simple observation log (Notion) | Company, ad URL, date, role address, contact history | €0 |

## Explicitly DO NOT build yet
- **A CRM.** Notion handles 40 prospects. Build a CRM at 200.
- **Automated outbound sequences.** Legally constrained and strategically wrong (§7.2).
- **Any workflow beyond W1.** §3's whole point.
- **More website pages.** Including `/confronto` — it is the right page, but it is a customer-#3 page, not a customer-#0 page. **This is a change from `DOLMIR_FINAL_POSITIONING.md`.**
- **Billing, invoicing, or project-management automation.** You have zero clients.
- **The enrichment pipeline run at scale.** It is built and correctly refuses to guess emails; it needs outbound HTTP and, more importantly, it needs a reason to exist that 40 manual observations/month does not already satisfy.

**INFERENCE:** the stack is already over-built relative to the stage. The binding constraint is not tooling. It is that no Lombardy manufacturer has yet been asked to pay for this.

---

# 12. Sales funnel arithmetic

All figures below are **ESTIMATE**. There is no DOLMIR conversion data because there have been no DOLMIR conversations. I show every step so you can replace my numbers with real ones after week three of §15.

## Working backwards from three customers

| Stage | Rate | Basis |
|---|---|---|
| Qualified observations identified | — | 5–15 job ads/week in Lombardia metalmeccanica (FACT that ads exist; **ESTIMATE** of volume) |
| Observation → email sent to role address | 100% | Manual, one at a time |
| Email → reply | **6%** | ESTIMATE. Highly specific, individually written, non-templated, referencing their own published ad. Generic B2B cold email in Italy runs far below this; a templated version of the same email would too |
| Reply → 20-minute demo call | **50%** | ESTIMATE. The reply itself is a strong intent signal given the ask is specific |
| Demo → paid engagement | **35%** | ESTIMATE. Demos on the client's own data convert well (FACT), but the buyer is comparing against €0 (C1) and €41k/year (C2) |
| Engagement → completed + referenceable | **80%** | ESTIMATE |

## Three scenarios

| | Pessimistic | Base | Optimistic |
|---|---|---|---|
| Observations contacted / month | 25 | 40 | 55 |
| Reply rate | 3% | 6% | 10% |
| Replies / month | 0.75 | 2.4 | 5.5 |
| Demo rate | 40% | 50% | 60% |
| Demos / month | 0.3 | 1.2 | 3.3 |
| Close rate | 20% | 35% | 45% |
| **Customers / month** | **0.06** | **0.42** | **1.5** |
| **Months to 3 customers (route 2 alone)** | **~50** | **~7** | **~2** |

**The pessimistic column is the important one.** It says that if the honest reply rate is 3%, direct outbound alone does not build this business in any reasonable timeframe. **INFERENCE: route 2 cannot be the only channel.** Route 1 (intermediaries) must run in parallel from week one, because a single well-placed intermediary can produce as much as six months of cold outbound.

## Adding route 1

**ESTIMATE:** 12 intermediaries approached → 4 engage seriously → 2 make an introduction within 8 weeks → 1 becomes customer #1.

**Combined realistic target: 3 paying customers in 5–7 months**, not 6 weeks. Anyone promising faster is either better-connected than this analysis assumes or wrong.

## What the funnel says about time allocation

**ESTIMATE of a working week that is consistent with the numbers above:**

| Activity | Hours/week | Note |
|---|---|---|
| Observation sourcing + qualification | 3 | Manual, deliberately |
| Writing individual emails | 4 | ~10 emails, each genuinely specific |
| Intermediary cultivation (route 1) | 4 | Highest expected value per hour |
| Demos and meetings | 3 | Rising as the pipeline fills |
| Delivery for a signed client | 15–25 | Once one exists |
| Building / improving the product | **≤4** | **Hard cap** |
| Admin, legal, commercialista | 2 | |

**RECOMMENDATION:** the ≤4 hours/week cap on building is the single most important operational rule in this document. Every previous phase of this project overshot it by an order of magnitude. The product is sufficient to run a demo. It is not sufficient to *sell*, because selling is not a product problem.


---

# 13. The website's real job

The website is not a lead generator. **INFERENCE:** the buyer described in ICP A does not discover vendors by searching; they are told about them, or they are contacted. SEO against established ERP vendors and content marketing to a 50-year-old officina owner are both multi-year plays that cannot fund a first customer.

The website has exactly three jobs, in this order:

**Job 1 — Survive the check.** After your email or your intermediary's introduction, someone will type "DOLMIR" into a browser. The site's function at that moment is to make the person on the other end conclude *"this is a real, serious, technical operation, not a kid with ChatGPT."* That is the entire job of the homepage, the design quality, and the industrial visual register. It is a **defensive** function, and it is worth the execution quality already invested. **This job is currently done.**

**Job 2 — Be the demo's permanent address.** The `/dimostrazione` page lets a prospect re-run, alone and unpressured, the thing you showed them in the call — including the refusal case. **FACT:** Italian buyers prefer demos on real data. A prospect showing your demo to their partner, without you in the room, is the most valuable thing the site can do.

**Job 3 — State the boundary in public.** What DOLMIR does not do, when ChatGPT is enough, when they should buy a product instead. In a market where trust in ICT vendors sits at 24% (FACT), a public, written, self-limiting statement is a differentiator that costs nothing and cannot be copied by anyone whose business depends on selling everything to everyone.

**What the website must NOT do:** carry invented social proof, fabricated ROI percentages, stock photos of generic offices, a "trusted by" strip, or any claim that cannot be sourced. Not because of squeamishness — because ICP A's buyer has been burned before, checks, and asks the intermediary.

**RECOMMENDATION:** freeze the website. It is sufficient for jobs 1–3. The remaining launch blockers are legal and administrative (privacy/cookie policy reviewed by a lawyer, P.IVA and REA for the footer, a working contact endpoint — currently an honest 501), not creative. Ship those, then stop touching it until customer #3.

---

# 14. Seven brand positions, scored

Each position scored 1–10 on seven criteria. **All ESTIMATE.**

**Criteria:** CRED = credible with zero track record · DIFF = differentiated against the nine categories of §5 · CLAR = a titolare understands it in ten seconds · PRICE = defends €18–35k · CYCLE = short sales cycle · SOLO = deliverable by one person · MOAT = still defensible in three years.

| # | Position | CRED | DIFF | CLAR | PRICE | CYCLE | SOLO | MOAT | **TOT** |
|---|---|---|---|---|---|---|---|---|---|
| P4 | **"Il preventivo che non si inventa i prezzi"** — specialist in one workflow, inbound RFQ → preventivo, for conto terzi | 8 | 9 | 9 | 7 | 8 | 8 | 7 | **56** |
| P3 | "Ingegneria di processo con AI per PMI manifatturiere" *(current positioning)* | 6 | 6 | 5 | 7 | 4 | 5 | 6 | **39** |
| P2 | "Automazione processi / integratore no-code" | 5 | 3 | 7 | 3 | 7 | 8 | 3 | **36** |
| P6 | "Software house verticale metalmeccanica" (product, not service) | 4 | 5 | 7 | 4 | 4 | 3 | 9 | **36** |
| P5 | "Consulenza AI Act, governance e formazione" | 5 | 6 | 4 | 5 | 3 | 7 | 4 | **34** |
| P7 | "Direzione tecnica esterna / CTO frazionale" | 4 | 6 | 4 | 6 | 3 | 6 | 4 | **33** |
| P1 | "Agenzia AI per le PMI" | 3 | 2 | 6 | 3 | 5 | 6 | 2 | **27** |

## Reading the table

**P4 wins decisively, and it is narrower than the current positioning.** The reasons it scores as it does:
- **CRED 8:** a specific claim about a specific workflow is checkable, and therefore credible in a way that "AI for manufacturing" never is. Narrowness substitutes for track record.
- **DIFF 9:** it is the only position in the table that no one in the nine categories occupies. C4 sells ERP, C5 sells automation, C9 sells analysis. Nobody sells *"the system that refuses to price what it cannot evidence."*
- **CLAR 9:** the titolare's own vocabulary. "Preventivo" needs no translation; "ingegneria di processo" does.
- **CYCLE 8:** a narrow claim can be disproven or confirmed in one 20-minute demo, which is why it moves fast.
- **MOAT 7, not 9:** an ERP vendor can eventually ship this (attack C). The moat is accumulated comparables and delivery reputation, not technology.

**P1 scores 27 and should be regarded as radioactive.** It is where the market is heading, it is what most new entrants will call themselves, and it is indefensible against a €20/month substitute.

**P6 (product) has the highest MOAT at 9 and the lowest SOLO at 3.** It is the right destination and the wrong starting point. **INFERENCE:** the correct trajectory is P4 → accumulate three implementations of the same workflow → extract the common core → P6 in year two or three. Do not attempt to start at P6.

## Recommendation

**Keep DOLMIR as the company name. Narrow the public promise to P4 for the first year.**

Concretely: the headline claim becomes the workflow, not the discipline. `DOLMIR_FINAL_POSITIONING.md`'s line *"Il collo di bottiglia non è in officina"* is excellent and survives — but it should sit as the *argument*, with the P4 promise as the *headline*. A titolare must be able to repeat what you do to a colleague, in one sentence, without using the word "processo".

**The cost of this recommendation, stated honestly:** narrowing to P4 makes DOLMIR look like a one-trick vendor and closes off adjacent revenue in year one. I think that is the correct trade at this stage — a one-person company with no clients cannot afford breadth — but it is a real cost and you should make the choice knowingly.

---

# 15. Six-week validation plan

The purpose of these six weeks is **not** to get three customers. §12's arithmetic says that takes five to seven months. The purpose is to **destroy or confirm three assumptions cheaply**, so you stop early if they are false.

### The three assumptions under test

- **A1 — Reachability.** A specific, honest, individually-written email to a role address, referencing a company's own published job ad, gets a reply rate ≥3%.
- **A2 — Resonance.** When a titolare sees the pipeline run on their own RFQs *and refuse to price the ambiguous one*, they recognise the problem as theirs. Measured by: they volunteer their own numbers unprompted.
- **A3 — Willingness to pay.** At least one company will pay real money for a fixed-scope first implementation.

Everything else — pricing, retainer, brand, website — is secondary and can be corrected later. These three cannot.

---

### Week 1 — Legal foundation and the observation engine

**Do:** Confirm P.IVA and inquadramento with a commercialista. Commission privacy/cookie/terms review. Build the observation log in Notion. Source the first 15 qualified observations from Indeed/InfoJobs. Draft (do not send) the first 10 emails. List 12 candidate intermediaries for route 1 with a specific reason for each.

**Success:** 15 qualified observations logged with company, ATECO, size from bilancio, role address, ad URL. P.IVA path confirmed in writing. 12 named intermediaries.
**Failure:** fewer than 8 qualifying job ads found in a full week across BG/BS/MI/CO/LC.
**Decision on failure:** the primary observation trigger is too thin. Switch to observation 2/3 (§7.4) as primary and re-test in week 2 before proceeding. If that also fails, the whole outbound model in §7 is unsound and you go to route 1 exclusively.

---

### Week 2 — First contact

**Do:** Send 10 individually written emails. Contact 6 intermediaries. Screen phone numbers against the RPO for week-3 follow-up.

**Success:** ≥1 reply from 10 emails; ≥2 intermediaries respond with interest.
**Failure:** 0 replies **and** 0 intermediary engagement.
**Decision on failure:** do not increase volume. Rewrite the email — the most likely fault is that it reads as a template despite being individual, or that the ask is still too large. Volume is the wrong lever at a 0% reply rate; it converts a copy problem into a reputation problem.

---

### Week 3 — First demos, and the honest measurement of A2

**Do:** Run every demo on the prospect's own five real RFQs. Include the refusal case deliberately. Ask no discovery questions in the first ten minutes — show, then let them talk. Record (with permission) or write up immediately: **did they volunteer their own numbers?**

**Success:** ≥2 demo calls held; in ≥1 of them the prospect states, unprompted, how many RFQs they receive or how many they cannot answer.
**Failure:** demos happen but the conversation stays polite and abstract; nobody offers a number.
**Decision on failure:** **this is the most important failure signal in the plan.** Politeness without numbers means the problem is real but not expensive to them. Either the ICP is wrong (they are too small — raise the size floor) or the workflow is wrong (§3's runners-up). Do not push harder on the same profile.

---

### Week 4 — First price conversation

**Do:** With any prospect who volunteered numbers, fill in the §4.2 table live, with their figures. Present Option B: fixed scope, four weeks, €6,000, in exchange for a written reference and two introductions. Be explicit that the price is an introductory one and why.

**Success:** ≥1 written proposal sent; the prospect engages on scope rather than on price.
**Failure:** every conversation collapses on price, or the return calculation with their real numbers comes out below 2×.
**Decision on failure:** if the *arithmetic* fails with real numbers — not the negotiation, the arithmetic — that is a finding about the market, not the offer. It means ICP A at this size does not have a €20k problem. **Escalate the ICP: test 60–120 employee companies, where volumes are higher.** This would be a major, honest pivot and is far better learned in week 4 than in month nine.

---

### Week 5 — Intermediary channel and second wave

**Do:** Meet any intermediary who engaged; make the disqualification-friendly proposal of §6.2 concretely. Send 12 more observation emails using the week-2 learnings. Phone follow-up (RPO-screened) to week-2 non-responders.

**Success:** ≥1 intermediary commits to a specific introduction; cumulative reply rate ≥3% across ~22 emails.
**Failure:** intermediaries are warm but make no commitment, and the cumulative reply rate is below 2%.
**Decision on failure:** both channels are underperforming simultaneously — go to §16's kill criteria rather than adding activity.

---

### Week 6 — Judgement

**Do:** Compile the real numbers. Compare against A1/A2/A3. Write down what was learned that contradicts this document.

**Success (proceed):** ≥1 signed engagement, **or** ≥2 prospects who volunteered numbers and received a proposal, **or** ≥1 committed intermediary introduction to a company matching ICP A.
**Partial (continue with correction):** replies and demos happen but nothing converts → the offer or the price is wrong; the market is real. Iterate the offer, keep the ICP.
**Failure (stop and reconsider):** fewer than 3 replies from ~22 emails, no demo produced volunteered numbers, and no intermediary committed.
**Decision on failure:** the problem is not urgent enough for this ICP. Do not spend month three writing more code. Return to §3 and test W6 (gare) or move up-market before writing another line.

### What is deliberately absent from these six weeks

No new features. No new pages. No CRM. No content marketing. No automation of outbound. **The entire six weeks contains roughly zero hours of building**, and that is the point.

---

# 16. The investor test

## Would I invest?

**No — and that is the correct answer for this kind of business, not a condemnation of it.**

DOLMIR as described is a **high-quality consulting practice with a productisation option**, not a venture-scale company. §1.G caps a solo founder at roughly 4–6 implementations per year, or €90k–190k of revenue (ESTIMATE). That is a good living and an uninvestable business. An investor's money would not remove the binding constraint, because the binding constraint is founder time in a trust-gated market, not capital.

**What would change my answer:** three completed implementations of the *same* workflow, where implementation #3 took materially less time than #1, and where at least one client renewed the retainer. That is the evidence that a product exists underneath the service (position P6, §14). Until then, there is nothing to invest in.

**RECOMMENDATION:** do not raise money. Do not build for a raise. Build for customer #1, and let the third implementation tell you whether there is a product.

## Why DOLMIR will fail — ranked by probability

Written as if the post-mortem has already happened.

**1. Because you kept building instead of selling. (Highest probability by a wide margin.)**
The evidence is already in this repository. Across the project's phases, an enormous amount was built — engine, design system, website, 3D scene, ten review passes, hundreds of pages of strategy — and not one Lombardy manufacturer has been contacted. Building is comfortable, controllable, and produces visible progress. Selling to a skeptical 55-year-old titolare in Brescia is none of those things. **This is the most likely cause of death, and it will feel like productivity right up to the end.**

**2. Because the problem is real but not expensive.**
Quoting is annoying everywhere. Annoying is a €2,000 problem. §4 shows the arithmetic only closes on a revenue argument, and that argument depends on an assumption I could not verify: that faster quoting increases win rate in Italian conto terzi metalmeccanica. **UNKNOWN.** If that assumption is false, the business has no price.

**3. Because the buyer chooses "nothing" (C1).**
Not a competitor — inertia. Most qualified prospects will agree the problem is real, agree the numbers work, and do nothing, because doing nothing has never cost an Italian SME owner their job.

**4. Because one person cannot sell and deliver simultaneously.**
The sawtooth of §1.G. Customer #1 arrives, six weeks of delivery follow, the pipeline dies, and month four starts from zero with a bank balance that looks fine and a future that does not.

**5. Because ChatGPT gets good enough at the narrow thing.**
Attack A. If frontier models plus a €30/month connector reach reliable extraction *and* the ERP vendors expose simple ingestion endpoints, the 30-metre gap DOLMIR occupies closes. Timeframe **UNKNOWN**, but the direction is not.

**6. Because trust cannot be earned fast enough.**
24% vendor trust, 38% satisfaction (FACT). The honest positioning is right and slow. You may run out of runway before you run out of correctness.

**7. Because the founder's time is the only input and it is finite.**
Not a market risk; a physics one.

## What would make me wrong about all of this

One thing: **a signed customer #1 within 90 days at €6,000, from an observation-driven approach, whose written reference produces customer #2 within a further 60 days.** That single sequence would falsify most of the pessimism above, because it would prove reachability, resonance, willingness to pay, and referability in one chain. Nothing short of it should be treated as validation — not interest, not compliments, not a busy calendar.

---

# 17. Evidence ledger

## FACTs and SOURCEs used in this document

| Claim | Source | Confidence |
|---|---|---|
| RAL €30,000 ≈ €41,073 total employer cost (~137% of RAL); metalmeccanico CCNL 3–5% above commercio | Italian employer-cost analyses and CCNL cost breakdowns, 2025–2026 | CONFIRMED |
| ChatGPT used by ~65% of Italian professionals | Osservatorio Artificial Intelligence, Politecnico di Milano | CONFIRMED |
| Italian AI market ~€1.8bn in 2025, +50% YoY | Osservatorio AI, Politecnico di Milano | CONFIRMED |
| Microsoft claims ~1.2 h/day saved per Copilot user | Microsoft marketing | CONFIRMED as a vendor claim, not as an independent result |
| Garante rejects legitimate interest for unsolicited commercial email to individuals; role addresses permitted; registry harvesting not permitted | Garante privacy decisions | CONFIRMED |
| RPO covers legal entities; human-operator calls permitted; operators must screen; sanctions to €20M / 4% turnover; Enel fined €26.5M | RPO regulations and Garante sanctions | CONFIRMED |
| Transizione 5.0 exhausted autumn 2025, closed to new GSE bookings 1 Jan 2026 (L. 199/2025); 7,417 firms excluded, receive 89.77% of benefit | Legislative and GSE reporting | CONFIRMED |
| Trust in ICT vendors 24% (2023) vs 42% (2018); 72% of SMEs 10+ use an external IT provider, 38% satisfied | Italian SME digitalisation surveys | LIKELY — figures consistent across secondary reporting; primary source not opened (WebFetch blocked) |
| Successful Italian software adopters decide within three months; longer cycles correlate with dissatisfaction | Capterra Italia 2026, 3,300+ decision-makers, 263 Italian | CONFIRMED |
| References from similar companies and demos on own data outrank brochures | Italian software buying-behaviour research | LIKELY |
| Bilanci of società di capitali are public, obtainable without authorisation | Registro Imprese / Camere di Commercio | CONFIRMED |
| Job ads for preventivista / ufficio tecnico preventivi are actively posted in Lombardia metalmeccanica | Indeed Italia, InfoJobs, 2026 | CONFIRMED (existence). Volume per week is ESTIMATE |
| Italian IT consultants €300–600/day, €80–150/h; management consultants €400–800/day; senior specialists >€1,000/day | Italian consulting-rate guides, 2026 | LIKELY — aggregator content, not a survey |
| Vertical ERP/quoting vendors exist for carpenteria/metalmeccanica (Gestlam, MTS, Pro Consulting, Integro360, Plancraft) | Vendor websites | CONFIRMED (existence). **Pricing not publicly disclosed** for any |
| Preparing a preventivo takes 2–5 hours per significant commessa | Italian automation practitioner blog, 2026 | LIKELY — vendor-published, not independent |
| Payback 6–14 months (low-code) / 12–24 months (custom) for Italian SMEs | Same vendor-published source | UNCONFIRMED — vendor's own benchmark, self-selected sample. **Do not repeat this figure to a prospect** |

## Key ESTIMATEs (mine, with arithmetic shown)

| Estimate | Derivation |
|---|---|
| €25/hour loaded labour cost | €41,073 ÷ ~1,650 productive hours |
| 3-year TCO €41,240 | €20,000 + (€590 × 36) |
| 10.6 h/week to break even | €41,240 ÷ €25 ÷ 156 weeks |
| ~32 h/week for a 3× return | 3 × the above |
| €320 gross margin per quote sent | €8,000 × 20% win rate × 20% margin |
| €76,800/year from 5 extra quotes/week | 5 × 48 × €320 |
| Qualifying threshold ≥20–25 RFQ/week | Revised upward from Phase 1's ≥10 on the basis of the above |
| 6% reply rate, 50% demo rate, 35% close rate | Judgement, no DOLMIR data. Replace after week 3 of §15 |
| 3 customers in 5–7 months (combined channels) | §12 base case + route 1 |
| Solo founder ceiling 4–6 implementations/yr, €90k–190k | 6–8 weeks delivery + 3-month cycle |

## UNKNOWNs that materially affect the strategy

1. **Does faster quoting increase win rate in Italian conto terzi metalmeccanica?** The load-bearing assumption of §4.2. Not found.
2. **Office-to-production staffing ratios in Italian manufacturing SMEs.** Would make ICP A qualifiable from public data alone. Not found.
3. **Actual pricing of vertical ERP quoting modules.** Not publicly disclosed by any vendor.
4. **Whether Iperammortamento 2026–2028 covers AI/software services.** Do not repeat any claim about it until a commercialista confirms in writing.
5. **Real inbound RFQ volumes at ICP A companies.** Must be asked, cannot be observed.

## Method limitation

**WebFetch was blocked for every external domain throughout this research.** Only search-result summaries were available — no competitor pages, no PDFs, no primary statistical tables were opened. Every LIKELY rating above would need one hour with a working browser to become CONFIRMED or be discarded. **RECOMMENDATION:** before acting on the pricing and trust figures, verify them from a machine with normal internet access. Two of them (consulting day rates, the 2–5 hour quoting figure) are load-bearing for the pitch.

---

# 18. Where this document contradicts previous DOLMIR work

Stated explicitly so the change is a decision and not a drift.

| Prior position | Document | Now | Why |
|---|---|---|---|
| Qualifying threshold ≥10 RFQ/week | `04-beachhead-decision.md` | **≥20–25 RFQ/week** | §4.1 arithmetic. The old threshold cannot pay for the engagement |
| Rilievo di Processo €2,900 as the entry product | `DOLMIR_FINAL_POSITIONING.md` | **Option B (€6,000 fixed-scope implementation) for customers 1–2; Rilievo from customer 3** | §8. Attack H: proof is scarcer than margin |
| Metalmeccanica competition score 6/8 (favourable) | `02-vertical-scoring.md` | **Overturned** — vertical ERPs ship quoting modules | Already corrected in `12-competitive-intelligence.md`; restated here as attack C |
| Positioning "Ingegneria di processo con AI" as the headline | `DOLMIR_FINAL_POSITIONING.md` | **P4 workflow-specific promise as headline; process framing demoted to the argument** | §14 scoring, CLAR and CRED |
| Publish `/confronto` next | `DOLMIR_FINAL_POSITIONING.md` | **Defer to customer #3** | §11. Right page, wrong stage |
| 300-company prospect database | Original brief | **40 qualified observations/month, manual** | §7.2 legal corridor + specificity is the mechanism |
| Presidio retainer sold with the implementation | `DOLMIR_FINAL_POSITIONING.md` | **Sold at month two** | §8.5 |
| Sell on time saved | Implicit throughout | **Sell on margin captured** | §4 |

---

# DOLMIR — STRATEGIC VERDICT

**Overall: YELLOW.**

DOLMIR is not a bad idea and it is not yet a business. The workflow is real, the buyer is identifiable, the economics can be made to work, and the legal path to reach the buyer exists but is narrow. What is entirely missing is a single conversation with a Lombardy manufacturer. Every remaining risk in this document is a *market* risk, and market risk is not reducible by building. It is reducible only by contact.

The verdict is YELLOW rather than GREEN because three of the four load-bearing assumptions — reachability, resonance, willingness to pay — have never been tested. It is YELLOW rather than RED because none of the nine attacks in §1 killed the business outright, and because the honesty-based positioning is a genuine, uncopyable fit with a market where vendor trust has collapsed to 24%.

---

## 🟢 GREEN — keep, and stop debating

1. **The single workflow: inbound RFQ → preventivo, for conto terzi metalmeccanica.** Highest score in §3 (93/120) and the only candidate that survives both the €20k price filter and the solo-founder build filter.
2. **The refusal behaviour.** `REQUIRES_TECHNICAL_ESTIMATE` instead of a guessed price is not a technical detail — it is the product, the differentiator against ChatGPT, and the substitute for a case study you do not have.
3. **Demonstrating on the prospect's own real RFQs, including failures.** The single highest-leverage sales mechanic available, supported by evidence on Italian buying behaviour.
4. **The observation-based approach built on published job ads.** Public, legal, specific, time-bound, and it targets a budget that already exists (~€41k/year).
5. **Pro-incumbent positioning:** feed the gestionale, never replace it. Structural advantage against both ERP vendors and buyer inertia.
6. **Honesty as a commercial instrument** — stating in public when ChatGPT or a product is the better answer. Correct in a 24%-trust market, and uncopyable by anyone who sells everything.
7. **The technical architecture** — provider abstraction, workflow-as-data, handover-ready repository. Not because it is elegant, but because "you are not locked in" is a sales argument in a market with 38% satisfaction.
8. **The website at its current scope.** It does its three jobs (§13). Finish the legal blockers and stop.

## 🟡 YELLOW — validate before betting on it

1. **Reachability.** Does a specific, individually-written email to a role address get ≥3% replies? Test: weeks 1–2 of §15. Unknown today.
2. **Resonance.** Do prospects volunteer their own numbers after the demo? Test: week 3. **This is the most informative single signal in the plan.**
3. **Willingness to pay.** Will anyone pay €6,000 for the first implementation? Test: week 4.
4. **The win-rate assumption.** Does faster quoting actually win more orders in Italian conto terzi? UNKNOWN, and the entire €4.2 revenue model rests on it. Ask it directly in the first three demos.
5. **Price level (€6k → €12k → €18k → €18–35k).** The ladder is reasoned, not validated. Expect to be wrong by one rung in either direction.
6. **The €390–790/month retainer.** Untested; sell it at month two, not at signature.
7. **ICP A's size band (15–60 employees).** If week 4 shows the arithmetic failing with real numbers, move up-market to 60–120 rather than lowering the price.
8. **Intermediary channel (route 1).** Highest expected value per hour in §12, and completely unproven. Six intermediaries contacted by week 2 will tell you.
9. **Whether there is a product underneath the service.** Answered by implementation #3, not by opinion.

## 🔴 RED — stop, or never start

1. **Stop building.** Hard cap of ≤4 hours/week on product work until customer #1 signs. This is the most likely cause of death (§16.1), and it will feel like progress.
2. **Stop selling time saved.** The labour-saving pitch is arithmetically dead at this price point (§4.1). Sell margin captured.
3. **Kill "agenzia AI" and any generalist AI positioning.** Scores 27/70 (§14), indefensible against a €20/month substitute.
4. **Kill the pilot** — already killed in `DOLMIR_FINAL_POSITIONING.md`, and it stays killed.
5. **Kill the 300-company automated prospect database.** Legally constrained (§1.D) and strategically self-defeating: the observation only works because it is singular.
6. **Never email personal addresses** (`nome.cognome@`). Role addresses only. Never harvest registries. Never call an unscreened number.
7. **Never submit a fake RFQ to a prospect to measure their response time.** Deceptive, and it destroys the only differentiator DOLMIR has.
8. **Never build a financing story on incentives.** Transizione 5.0 is closed and 7,417 firms were just burned by it.
9. **Do not build a CRM, automations, additional pages, or any workflow beyond W1** before customer #3.
10. **Do not attempt drawing→BOM extraction (W5).** Highest value in the table, BUILD score 2. It will consume a year.
11. **Do not raise money.** Capital does not remove the binding constraint.
12. **Do not use generated marketing imagery** for anything customer-facing. For this buyer it signals agency, not engineer.
13. **Do not repeat the vendor-published payback figures** (6–14 / 12–24 months) to a prospect. Self-selected sample, unverifiable.

---

## The one thing

If you do exactly one thing from this document: **send ten individually-written emails, this week, to ten Lombardy manufacturers that are publicly advertising for a preventivista, offering a twenty-minute demo on five of their own real quote requests — including the ones where the system refuses to answer.**

Everything else in these 25,000 words is a hypothesis. That email is the only instrument that can test any of it.
