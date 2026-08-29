# 05 — The Offer & Pricing

**Principle:** we price against the business value created, not against our hours.
**Constraint:** we never promise a number we cannot measure with the client's own data.

---

## Positioning statement

> Per le officine meccaniche e le aziende di lavorazioni conto terzi in Lombardia:
> trasformiamo le richieste di offerta che arrivano via email in preventivi pronti
> da approvare — in ore, non in giorni. Il vostro gestionale resta dov'è.

English: *For subcontract machining firms in Lombardia: we turn the RFQs that
arrive by email into quotes ready for approval — in hours, not days. Your ERP
stays where it is.*

Note what this does **not** say. It does not say "AI". It says the outcome and
it removes the buyer's biggest fear (ripping out their ERP).

---

## The ladder

### Step 1 — Workflow Audit (`Audit di Processo`)

| | |
|---|---|
| **Price** | **€2,900** fixed |
| **Timeline** | 10 working days |
| **Target** | Any qualified firm, 10–80 employees, ≥10 RFQ/week |
| **Deliverables** | (1) Mapped as-is RFQ→quote process with measured cycle time; (2) Sample analysis of their **last 50 real RFQs** — volume, channel, response time, win/loss where known; (3) Quantified opportunity model built on *their* numbers; (4) Technical feasibility assessment incl. ERP integration path; (5) Fixed-price implementation proposal; (6) 90-minute findings presentation |
| **Included** | Up to 3 interviews, analysis of up to 50 RFQs, 1 ERP/system review |
| **Not included** | Any software build, any system change, licences |
| **Credit** | **100% credited** against an implementation signed within 60 days |
| **Risk to us** | Low. Cash-positive discovery. |
| **Risk to client** | €2,900 and ~4 hours of their time |

**Why a paid audit and not a free one.** Free discovery attracts people who will
never buy, and it trains the client to value our thinking at zero. A €2,900 fee
is small enough to approve without a committee and large enough to filter.
It also produces the ROI model that justifies the implementation price — the
audit sells the project.

### Step 2 — Pilot (`Avvio Preventivo Rapido`) *— optional*

| | |
|---|---|
| **Price** | **€7,500** fixed |
| **Timeline** | 4 weeks |
| **Target** | Firms >50 employees, or any client who needs proof before committing |
| **Deliverables** | Working system on one RFQ channel (one inbox), extraction + triage + draft quote, human approval interface, measurement dashboard. Up to 50 RFQs/month. |
| **Not included** | ERP write-back, multi-user roles, multi-channel intake, custom pricing rules beyond 5 |
| **Success criterion** | ≥80% field-level extraction accuracy on their real RFQs, measured and reported |
| **Credit** | **50% credited** against full implementation |

**Co-founder note:** use this sparingly. Every extra step in the ladder delays
revenue and adds a chance to say no. For a 15–40 person owner-run firm, go
Audit → Implementation directly. The pilot exists for the larger, slower buyer.

### Step 3 — Full Implementation (`Implementazione`)

| | |
|---|---|
| **Price** | **€18,000 – €35,000** |
| **Timeline** | 6–10 weeks |
| **Deliverables** | Multi-channel RFQ intake; document + attachment extraction; classification and bid/no-bid triage; retrieval of comparable historic quotes; draft quote generation using client pricing logic; **human approval workflow**; ERP/gestionale integration; audit trail; measurement dashboard; team training; 30 days hypercare |
| **Included** | Up to 3 integrations, up to 5 users, configuration of client pricing rules, documentation, training |
| **Not included** | ERP licence costs, model/API consumption beyond fair-use (billed at cost + 15%), new workflows outside RFQ scope, hardware, ongoing dev after hypercare |

**Price band logic:**
| Band | Profile |
|---|---|
| €18,000 | ≤20 employees, single inbox, simple pricing logic, CSV/export ERP integration |
| €25,000 | 20–50 employees, 2 channels, moderate pricing rules, API ERP integration |
| €35,000 | 50–80 employees, multi-site or multi-entity, complex rules, bidirectional ERP sync |

### Step 4 — Managed Service (`Servizio Gestito`)

| | |
|---|---|
| **Price** | **€600 – €1,500/month** |
| **Term** | 12 months initial, then rolling 3-month |
| **Included** | Hosting and infrastructure; model/API consumption within tier; monitoring and uptime; monthly accuracy review and prompt/rule tuning; up to 4h/month of changes; quarterly business review with measured results; version upgrades |
| **Not included** | New workflows or modules (priced separately); ERP migrations; >4h/month change requests |
| **Tiering** | €600 ≤150 RFQ/mo · €950 ≤400/mo · €1,500 ≤1,000/mo · above: custom |

**Why the retainer is real and not a tax.** Extraction accuracy degrades as
customers change document formats and as the client enters new markets. Model
versions change. Without active tuning the system quietly decays and the client
churns angry. The retainer buys sustained accuracy — and we should say exactly
that, because it is true and it is defensible.

---

## Expansion modules (sold to existing clients only)

| Module | Price | Retainer uplift |
|---|---|---|
| Conferma d'ordine → ERP | €8,000–€14,000 | +€250/mo |
| Supplier RFQ / sourcing | €10,000–€18,000 | +€300/mo |
| Non-conformity handling | €12,000–€20,000 | +€350/mo |

---

## Unit economics (planning model — `HYPOTHESIS`)

Per full client, year one:

```
Audit                            €2,900   (credited if they proceed)
Implementation                  €25,000   (mid band)
Retainer 12 × €950              €11,400
                                --------
Year-1 revenue per client       €36,400
Year-2+ recurring                €11,400  (before expansion modules)
```

Delivery cost assumption: 120–180 hours for a mid-band implementation once the
core engine exists. **The first implementation will take roughly double** — price
it the same, absorb the difference, and treat the excess as R&D that builds the
reusable engine.

Ten clients in eighteen months ⇒ ~€364k cumulative revenue and ~€114k ARR.
That is a real business. It does not require a hundred clients.

---

## ROI framing — what we say and what we never say

**We say:** *"In the audit we measure your current response time and your RFQ
volume. We then model the improvement against your own numbers, and we install
the measurement so you can verify it yourself."*

**We never say:** a specific % improvement before the audit; a guaranteed win-rate
increase; a payback period we have not modelled on their data; or that the project
qualifies for Transizione 5.0 (it usually does not on its own — see
`01-market-analysis.md` §3).

**Guarantee we can honestly offer:** if the pilot does not reach the stated
extraction-accuracy threshold on the client's own historic RFQs, they do not
proceed to implementation and the pilot fee is refunded. That is a real,
measurable, bounded promise — and it is a far stronger sales instrument than a
revenue guarantee we cannot control.

---

## Pricing risks

- **€18k may be above the segment's reflex budget.** The audit is the instrument
  that tests this cheaply. If 10 audits produce zero implementations, the problem
  is the price or the value story — not the market.
- **Anchoring against the €3–8k tier.** Prospects will have seen those prices.
  The answer is not to discount; it is to refuse the comparison: that tier sells
  connectors between apps, we sell a quoting capability with measured accuracy
  and accountability. Different product.
- **Scope creep is the main margin killer.** "Not included" lists above are
  contractual, not decorative.
