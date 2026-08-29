# 09 — Assumptions Register

Every assumption this business rests on, stated so it can be proven wrong.

**Status labels:** `UNTESTED` · `TESTING` · `CONFIRMED` · `FALSIFIED`

---

## Critical — these decide whether the company works

| ID | Assumption | Confidence | Status | How we test it | If wrong |
|---|---|---|---|---|---|
| **A1** | Subcontract machining firms of 10–80 employees receive ≥10 RFQs/week | Medium | `UNTESTED` | Question 2 in every discovery call | Volume too low to matter → move upmarket to 50–150 employees, or switch workflow |
| **A2** | Quote turnaround materially affects win rate in this segment | Medium-high | `UNTESTED` | Discovery calls 1–20; ask about lost orders | The value story collapses → pivot to wholesale order entry (cost-side, lower price) |
| **A3** | An owner will pay €18k+ for a workflow system | Medium | `UNTESTED` | The €2,900 audit is the cheap test | Restructure as a lower-priced productised subscription |
| **A4** | Cold outreach reaches these owners at ≥8% reply rate | Low-medium | `UNTESTED` | First 80 contacts | Change channel — trade associations, fairs, ERP-vendor partnerships — before changing vertical |
| **A5** | Field extraction reaches ≥80% accuracy on real Italian RFQs | Medium | `UNTESTED` | First pilot, on their last 50 RFQs | Narrow scope to structured documents only |

## Important — these shape the offer

| ID | Assumption | Confidence | Status | Notes |
|---|---|---|---|---|
| A6 | Shops keep a retrievable quote history | Medium | `UNTESTED` | If it lives only in one person's head, the comparables feature — the most compelling part of the demo — does not work. **Ask this early.** |
| A7 | Their ERP allows some integration or export | Medium-high | `UNTESTED` | CSV fallback always designed in |
| A8 | The owner decides alone up to ~€30k | Medium | `UNTESTED` | If a committee exists, the cycle lengthens and the audit price may need to drop |
| A9 | They will forward a real RFQ during a sales call | Medium | `UNTESTED` | This is the demo's whole conversion mechanic. If they refuse on confidentiality grounds, we need a sanitisation step. |
| A10 | A retainer is accepted as normal | Medium | `UNTESTED` | Italian SMEs are often resistant to recurring software fees; the accuracy-decay argument is the honest counter |

## Market-level

| ID | Assumption | Confidence | Status | Notes |
|---|---|---|---|---|
| A11 | 33,800 mechatronics local units is current and relevant | Medium | `UNTESTED` | Assolombarda figure, recent but not current-quarter. Our addressable slice is a subset we have not sized. |
| A12 | ERP vendors will not ship SME-priced RFQ automation within 12 months | Medium | `UNTESTED` | Monitor Zucchetti, TeamSystem, Dylog release notes quarterly |
| A13 | The €3–8k commoditised tier will not move up-market into our band | Medium | `UNTESTED` | Their constraint is domain depth, not ambition |

## Delivery

| ID | Assumption | Confidence | Status | Notes |
|---|---|---|---|---|
| A14 | Mid-band implementation ≈120–180 hours once the engine exists | Low-medium | `UNTESTED` | **Assume 2× on client one.** Tracked as `Margin Signal` in Notion → Projects |
| A15 | Model consumption stays well under the retainer's fair-use tier | Medium | `UNTESTED` | `AIClient` accumulates real cost per call — measure from the first pilot |
| A16 | Per-client pricing logic is configuration, not code | Medium | `UNTESTED` | If it turns out to need code per client, reusability collapses and so does the margin model |

## Documented environment limitations

| ID | Fact | Consequence |
|---|---|---|
| E1 | The egress proxy blocked all external domains during the research session | Company websites could not be read; contact fields are `Unknown`, not fabricated. Enrichment must run elsewhere. |
| E2 | `unioncamerelombardia.it` blocked | Sector totals come from search-indexed summaries, not our own reading of the PDF. **Re-verify before client-facing use.** |
| E3 | No paid registry access | No per-province, per-ATECO counts. Budgeted in the 90-day plan. |

---

## How to use this document

1. After every discovery call, update the status of anything the call touched.
2. When an assumption is **FALSIFIED**, act on the "if wrong" column rather than
   arguing with the evidence.
3. Review the whole register at the week-6 checkpoint.

The purpose of writing these down in advance is to make it impossible to
quietly retrofit the story when reality disagrees.
