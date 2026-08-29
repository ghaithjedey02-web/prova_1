# 04 — Beachhead Decision

**Decision date:** 2026-08-29
**Status:** Committed. Revisit only against the falsification triggers in §6.

---

## 1. The decision

**Primary vertical:** Metalmeccanica / meccanica di precisione — subcontract
machining and fabrication firms (`lavorazioni conto terzi`) in Lombardia,
**10–80 employees**, concentrated in Brescia, Bergamo, Lecco, Varese,
Monza-Brianza and Milano.

**Primary workflow:** **RFQ intake → preventivo** — from "a request for quote
lands in the inbox" to "a reviewed draft quote is ready for the owner to send."

**Product name:** `Preventivo Rapido` (internal codename: `rfq-engine`).

---

## 2. Top 3 verticals × top 3 workflows

| Vertical | Workflow 1 | Workflow 2 | Workflow 3 |
|---|---|---|---|
| **1. Metalmeccanica (82)** | **RFQ → preventivo** ★ | Conferma d'ordine → ERP | Supplier RFQ / sourcing |
| **2. Wholesale / distribuzione (78)** | Sales order entry | Supplier price-list ingestion | Credit control / dunning |
| **3. Commercialisti (72)** | Client document chasing | Scadenzario + client comms | Knowledge retrieval |

---

## 3. Why this wins — tested against the brief's own criteria

The brief specified the criteria. Here is the beachhead scored against each.

**Probability of getting the first client — HIGH.**
The buyer is one person (the owner), reachable by phone, who personally
experiences the pain weekly. No committee, no procurement, no IT department.
Compare with insurance (compliance review) or healthcare (DPO sign-off).

**Measurable ROI — the strongest available.**
Two metrics the owner already tracks in their head:
`quote response time` (days → hours) and `RFQs answered per week`. We can
baseline both in the first meeting by asking two questions. Contrast with
"improved efficiency," which cannot be invoiced against.

**Ease of implementation — medium, and deliberately scoped down.**
We are **not** promising automated interpretation of technical drawings or
machining-time estimation. That is the hard AI problem and the −5 risk penalty in
the scoring model. We automate intake, extraction, triage, historic-comparable
retrieval and draft generation — then hand to a human. This is the difference
between a 3-week delivery and a 9-month research project.

**Repeatability — high.**
Every firm in the segment runs the same shape of process with the same tools
(email + Excel + an ERP). The variable part is pricing logic, which we isolate as
per-client configuration rather than per-client code.

**Ability to charge meaningfully — yes, and this is decisive.**
Because the value is *won revenue*, not *saved hours*, this workflow escapes the
€3–8k commoditised tier documented in `01-market-analysis.md` §4. Cost-side
automation is priced against a clerk's salary. Revenue-side automation is priced
against the orders it wins. Same technology, 3× the price.

**Ability to find companies — excellent.**
33,800 mechatronics local units in Lombardia; dense public directories, trade
association member lists, and subcontracting marketplaces.

**Ability to contact decision makers — excellent.** Owner-operated firms.

**Ability to create a convincing demo — excellent, and this decided it.**
We can ask a prospect to forward one real RFQ email during the discovery call and
show a drafted quote before the call ends. No other workflow on the list produces
a moment that visceral. See `docs/strategy/11-demo-spec.md`.

---

## 4. What we are explicitly NOT doing in v1

Written down so it cannot quietly creep back in:

- ❌ Automated reading of technical drawings to derive machining time
- ❌ Autonomous price setting — every quote is human-approved, without exception
- ❌ Sending quotes to the customer automatically
- ❌ Replacing the ERP
- ❌ Any workflow touching hiring, CV screening or worker evaluation
      (EU AI Act Annex III high-risk — see `08-risks-and-compliance.md`)
- ❌ Any workflow touching health data

## 5. The land-and-expand path

```
Workflow Audit (paid)  →  Pilot: RFQ intake  →  Full implementation
                                              →  + Conferma d'ordine module
                                              →  + Supplier RFQ module
                                              →  Monthly retainer, growing
```

One client, entered through one workflow, has a natural path to three modules
and a permanent retainer. That is what makes this a company rather than a
sequence of projects.

## 6. Falsification triggers

We revisit this decision — without ego — if any of these fire:

1. **≥20 discovery calls** and fewer than 6 owners describe quote turnaround as
   a top-3 problem → the Value assumption is wrong → switch to wholesale order entry.
2. **≥30 qualified outreach attempts** and reply rate < 4% → the access
   assumption is wrong → change channel (associations, fairs, partners) before changing vertical.
3. **First pilot** cannot reach ≥80% field-level extraction accuracy on the
   client's own last-50 RFQs → the technical assumption is wrong → renegotiate
   scope to the wholesale/structured-document case.
4. An ERP incumbent ships SME-priced RFQ automation → pivot to workflow #2,
   reusing the shared engine.

## 7. Assumptions this decision rests on

Tracked in `09-assumptions-register.md`. The three that matter most:

- **A1:** Subcontract machining firms of 10–80 employees receive enough RFQs
  (≥10/week) for automation to matter. *Confidence: medium. Validate in calls 1–10.*
- **A2:** Quote turnaround materially affects win rate in this segment.
  *Confidence: medium-high (industry lead times >30 days documented). Validate in calls 1–20.*
- **A3:** Owners will pay €18k+ for a workflow system. *Confidence: medium.
  This is the assumption most likely to be wrong, and the Workflow Audit offer
  exists specifically to test it cheaply.*
