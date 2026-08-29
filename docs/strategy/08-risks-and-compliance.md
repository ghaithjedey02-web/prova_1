# 08 — Risks, Legal & Compliance

Written as a co-founder flagging what could kill us, not as a disclaimer page.

**This document is not legal advice.** Before the first client contract, a
qualified Italian lawyer must review the MSA, the DPA and the AI Act
classification. Budgeted in the 90-day plan, Week 6.

---

## 1. EU AI Act — where we actually stand

**Status as of today (August 2026):** the AI Act became applicable on
**2 August 2026**. Prohibitions (Art. 5) and the AI-literacy duty (Art. 4) have
applied since 2 February 2025. GPAI obligations have applied since 2 August 2025.
Article 50 transparency duties, GPAI enforcement powers and the penalty regime
took effect **2 August 2026**. The heaviest Annex III high-risk obligations were
deferred by the Digital Omnibus to **2 December 2027**.

**Our classification — assessed, not assumed:**

| System | Likely classification | Reasoning |
|---|---|---|
| RFQ intake + extraction + draft quote | **Minimal / limited risk** | Not an Annex III use case. Assists a business process; a human approves every output. |
| Any customer-facing chat interface we build | **Limited risk — Art. 50 transparency applies** | Users must be told they are interacting with an AI system |
| CV screening / candidate ranking | **Annex III HIGH RISK** | 🚫 **We do not build this.** Full stop. |
| Worker monitoring / productivity evaluation | **Annex III HIGH RISK** | 🚫 **We do not build this.** |
| Credit scoring / creditworthiness | **Annex III HIGH RISK** | 🚫 Not in year one. |

**Standing rule:** if a prospect asks us to automate anything touching hiring,
worker evaluation, creditworthiness, or access to essential services, we decline
in year one and say why. That conversation *builds* credibility — it signals we
understand the regulation better than the vendor who said yes.

**Obligations that do bind us now:**
- **Art. 4 AI literacy.** As a deployer and as a provider we must ensure staff
  (ours and, contractually, the client's operators) have adequate AI literacy.
  Cheap to satisfy: it is part of our training deliverable. Make it explicit in the SOW.
- **Art. 50 transparency.** Any AI-generated text that reaches a third party
  should be identifiable as such where the regulation requires it. Our design
  keeps a human as the sender of every quote, which materially simplifies this.

## 2. GDPR

Highest-probability legal failure for a company like ours. Specifics:

- **We are a Data Processor**, the client is the Controller. A **DPA (Art. 28)**
  is mandatory before touching a single production email. Non-negotiable.
- **RFQ emails contain personal data** — names, direct emails, phone numbers of
  buyers at the client's customers. This is ordinary personal data, not special
  category, which keeps it manageable.
- **Sub-processors must be disclosed.** Every AI provider we route data through is
  a sub-processor and must be named in the DPA with the client's right to object.
  This is a direct architectural requirement, and it is why `packages/ai-core`
  exists: we must be able to swap or restrict providers per client without a rewrite.
- **Data residency will be asked about.** Expect "do our drawings leave Europe?"
  in most sales conversations. Have a real answer: EU-region model endpoints,
  documented retention, no training on client data. Get this in writing from
  providers before selling it.
- **Retention.** Default to the minimum that makes the product work. Document it.
- 🚫 **No health data. No special-category data.** Reason healthcare scored −8.

## 3. Commercial and confidentiality risk

- **Technical drawings are the client's customers' IP.** A leak is existential —
  not for us, for them. Expect strict NDAs. Sign them. Never use client data to
  train anything, and say so contractually.
- **Quoting logic is the client's crown jewels.** Never reuse one client's pricing
  configuration for another. Store per-client, isolated. Say this unprompted in
  sales — competitors will not think to.
- **A wrong quote can cost the client real money.** Mandatory human approval is
  not just good design, it is our liability firewall. Contractually: we provide
  a decision-support tool; the client approves and remains responsible for the
  commercial terms of every quote issued. Get this into the MSA.

## 4. Business risks, ranked by probability × damage

| # | Risk | Prob. | Damage | Mitigation |
|---|---|---|---|---|
| 1 | **No first client in 90 days** | Medium-high | Existential | Paid audit lowers commitment; 3 parallel channels; falsification triggers force a fast pivot instead of a slow death |
| 2 | **Pricing rejected as too high** | Medium | High | Audit tests it for €2,900 instead of a lost quarter; value framed as revenue not cost |
| 3 | **First implementation overruns badly** | **High** | High | Assume 2× effort on client #1 and price it in; narrow v1 scope; explicit "not included" lists |
| 4 | **Extraction accuracy below promise** | Medium | High | Accuracy threshold tested on their historic RFQs *before* full commitment; refund guarantee bounded to pilot fee |
| 5 | **ERP integration blocked by vendor** | Medium | Medium | Always design a CSV/export fallback path; qualify ERP in the audit |
| 6 | **Founder capacity — one person selling and delivering** | **High** | High | Do not run outreach and delivery at full tilt simultaneously. See 90-day plan. |
| 7 | **GDPR/DPA gap discovered mid-deal** | Medium | High | Lawyer-reviewed templates ready *before* the first proposal, not after |
| 8 | **Commoditised competitor undercuts at €5k** | Medium | Medium | Refuse the comparison; sell measured accuracy and accountability |
| 9 | **AI provider price/policy change** | Medium | Medium | Provider abstraction layer; per-client provider config |
| 10 | **August / Christmas dead zones in Italy** | **Certain** | Medium | Plan around them — Italian industry substantially closes in August. Calendar it. |

## 5. Reputational rules

- Never fabricate a case study, a client logo, or a metric.
- Until we have a real case study, sell the *method* and the demo, not fictional proof.
- Do not use scraped personal emails for cold outreach where a business
  address is available. Prefer role addresses (`info@`, `commerciale@`) and
  publicly published contacts, and honour opt-outs immediately.

## Sources

- [European Commission — AI Act regulatory framework](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai)
- [European Commission — Guidelines for providers and deployers of high-risk AI systems](https://digital-strategy.ec.europa.eu/en/policies/guidelines-ai-high-risk-systems)
- [EU Artificial Intelligence Act — high-level summary](https://artificialintelligenceact.eu/high-level-summary/)
- [SIG — Comprehensive EU AI Act summary, August 2026 update](https://www.softwareimprovementgroup.com/blog/eu-ai-act-summary/)
