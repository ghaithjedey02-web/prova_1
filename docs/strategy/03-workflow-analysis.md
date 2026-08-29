# 03 — Workflow Analysis

We do not sell to an industry. We sell into a *workflow*. This document maps the
five highest-value workflows in each of the top three verticals against the
thirteen evaluation dimensions, then ranks them.

**Evidence labelling used throughout:**
- `CONFIRMED` — verified against a cited public source
- `HYPOTHESIS` — reasoned from evidence, needs validation in discovery
- `UNKNOWN` — we do not know and must ask

Most economic figures below are `HYPOTHESIS`. They are modelling assumptions
built to be falsified in the first 20 discovery calls, not facts. The
assumptions register is `09-assumptions-register.md`.

---

## A. Metalmeccanica / meccanica di precisione

### A1. RFQ intake → preventivo (quotation) ★ TOP RANKED

| Dimension | Finding |
|---|---|
| 1. What happens today | RFQ arrives by email: free-text body + attachments (PDF drawings, DXF/STEP, Excel part lists). Someone opens it, reads it, decides whether to bid, looks for a comparable past job, estimates material + machining time + finishing, writes a quote in Excel or the ERP, emails it back. |
| 2. Who performs it | Owner (`titolare`) or a dedicated `preventivista` / ufficio tecnico. In 10–40 employee firms it is very often the owner personally. `HYPOTHESIS` |
| 3. How often | Continuous — estimated 10–60 RFQs/week for a firm of this size. `HYPOTHESIS` |
| 4. People involved | 1–3 (commercial intake, technical estimate, owner approval). `HYPOTHESIS` |
| 5. Time consumed | 20–90 min per quote; heavier for multi-part assemblies. Reported industry lead times reach **>30 days** end-to-end. `CONFIRMED` (lead time) / `HYPOTHESIS` (per-quote minutes) |
| 6. Where errors occur | Missed RFQs buried in inbox; misread revision/tolerance; wrong material grade; transcription errors from drawing to quote; forgotten follow-up. |
| 7. Cost of delay | **Direct revenue loss.** Buyers award to whoever responds credibly first. A late quote is a lost order, not a delayed one. |
| 8. Systems involved | Outlook/Gmail, Excel, ERP/gestionale (Zucchetti, TeamSystem, Dylog, Integro360, Dolimetal or bespoke), file server, sometimes CAD. |
| 9. Can AI automate it | **Partly, and that is the correct answer.** Intake, classification, extraction of structured fields, retrieval of comparable historic quotes, and first-draft generation: yes. Definitive pricing: no. |
| 10. What still needs humans | Final price, margin strategy, capacity/feasibility judgement, customer relationship, anything safety- or tolerance-critical. Human approval is mandatory in our design. |
| 11. Economic value | If a firm quotes 30 RFQs/week at avg €18k order value with a 22% win rate, a **3-point win-rate improvement** from faster, more consistent response ≈ €18k × 30 × 0.03 ≈ €16k/week of additional booked order value. Even at a fraction of that, the ROI case is overwhelming. `HYPOTHESIS — must be recalculated per client with their real numbers` |
| 12. Implementation complexity | **Medium.** Email + attachment parsing and structured extraction is well-understood. Complexity concentrates in per-client pricing logic and ERP write-back. |
| 13. Our price | €18,000–€35,000 implementation |
| 14. Recurring | €600–€1,500/month (hosting, model costs, accuracy tuning, volume growth) |

### A2. Conferma d'ordine → ERP entry
Customer PO arrives as PDF; someone retypes it into the ERP. Daily; 5–15 min each;
errors cause wrong quantities/dates shipped. High automation potential, low
strategic value — cost-side only. **Price €8–14k. Good expansion sale, weak land offer.**

### A3. Supplier RFQ / sourcing (acquisti)
Mirror image of A1, outbound: send the same material request to 5 suppliers,
chase, compare replies. Frequent, tedious, moderate value. **Price €10–18k.**
Strong *second* module for an existing client.

### A4. Non-conformity & customer complaint handling (reclami / NC)
Complaint arrives by email/phone → 8D or NC report → root cause → response.
Lower frequency, higher regulatory weight (ISO 9001 evidence). Valuable but
episodic. **Price €12–20k.**

### A5. Material & quality certificate management (3.1 certs, CE, DoC)
Certificates arrive as PDFs, must be filed, matched to heats/lots, and retrieved
on audit or customer demand. Painful during audits, invisible otherwise.
Low urgency → poor land offer. **Price €8–15k.**

---

## B. Wholesale / distribuzione B2B

### B1. Sales order entry from unstructured documents ★
Orders arrive as PDF, email body, spreadsheet, occasionally fax. Retyped into
ERP. Very high frequency, very high automation potential, purely cost-side value.
Crowded competitively. **Price €10–18k, €400–900/mo.**

### B2. Supplier price-list ingestion & margin recalculation
Supplier sends a new listino as PDF/Excel in an arbitrary layout; someone
normalises it and repropagates margins. Monthly/quarterly, high error cost
(selling below cost). **Price €12–20k.**

### B3. Order-status customer service deflection
"Where is my order?" queries consuming a service desk. Automatable, but requires
reliable ERP/carrier integration. **Price €10–16k, strong recurring.**

### B4. Product data enrichment & catalogue normalisation
Supplier data → clean, categorised, attributed catalogue records. Valuable for
e-commerce-active distributors. **Price €12–25k.**

### B5. Credit control / dunning follow-up
Overdue invoice chasing, tone-graded, escalation-aware. Direct cash-flow value,
easy to measure. **Price €8–14k.**

---

## C. Commercialisti (channel-first, see `02-vertical-scoring.md` §3)

### C1. Client document collection & chasing ★
Chasing 300 clients for missing documents every month. Universally hated,
perfectly repetitive, entirely automatable. Best entry wedge into this vertical.
**Price €8–15k, €400–800/mo.**

### C2. Passive invoice extraction & posting
Already partly solved inside TeamSystem/Zucchetti. Do not compete here.

### C3. Bank reconciliation / prima nota categorisation
Same caution as C2 — incumbent territory.

### C4. Scadenzario monitoring & proactive client communication
Deadline tracking plus automatic personalised client notices. Differentiating,
outside the gestionale's comfort zone. **Price €10–18k.**

### C5. Internal knowledge retrieval on normativa
"What changed in the 2026 Budget Law for X?" over the studio's own circulars and
precedents. High perceived value, moderate build. **Price €12–20k.**

---

## D. Ranking

| Rank | Workflow | Vertical | Value type | Score rationale |
|---|---|---|---|---|
| **1** | **RFQ intake → preventivo** | Metalmeccanica | **Revenue** | Only workflow on the list where value is won orders, not saved hours. Supports 2–4× the price of any cost-side workflow. Owner-visible, demoable, dense market. |
| 2 | Sales order entry | Wholesale | Cost | Easiest to build, but commoditised pricing |
| 3 | Client document chasing | Commercialisti | Cost + capacity | Best channel wedge |
| 4 | Supplier price-list ingestion | Wholesale | Margin protection | High error cost, underserved |
| 5 | Conferma d'ordine entry | Metalmeccanica | Cost | Best *expansion* sale after A1 |
| 6 | Supplier RFQ / sourcing | Metalmeccanica | Cost + margin | Natural second module |
| 7 | Scadenzario + client comms | Commercialisti | Retention | Differentiated |
| 8 | Credit control / dunning | Wholesale | Cash flow | Easy to measure |
| 9 | Order-status deflection | Wholesale | Cost | Integration-dependent |
| 10 | Knowledge retrieval | Commercialisti | Capacity | Weak urgency |

---

## E. The structural insight

Rankings 1, 2, 4, 5 and 6 are **the same computational problem** wearing
different industry clothing:

> An unstructured inbound business document arrives by email →
> classify it → extract structured fields → validate and score confidence →
> enrich from history/master data → draft the response or record →
> **route to a human for approval** → write to the system of record → measure.

We therefore build **one primitive** — the Document-to-Decision pipeline — and
configure it per workflow. The second vertical costs a fraction of the first.
This is the single most important architectural decision in the company and it
is why `packages/ai-core` and `packages/rfq-engine` are separate.

See `docs/architecture/overview.md`.
