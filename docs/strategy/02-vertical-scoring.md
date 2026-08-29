# 02 — Vertical Scoring Model

**Purpose:** choose the beachhead on evidence, not on which industry sounds exciting.

---

## 1. The model

Ten dimensions, weighted to sum to 100. Weights reflect what actually determines
whether a young implementation company survives its first year: can we find the
buyer, will they pay, and can we deliver without failing.

| # | Dimension | Weight | What a high score means |
|---|---|---|---|
| 1 | Pain intensity | 14 | The problem visibly costs them money *today* |
| 2 | Pain frequency | 10 | It recurs daily/weekly, not annually |
| 3 | Financial value | 14 | One instance of the problem is worth real money |
| 4 | Automation potential | 12 | Current AI can genuinely do the core of it |
| 5 | Ability to pay | 10 | Margins and cash exist for a €20k+ project |
| 6 | Market size (Lombardia) | 8 | Enough companies to sustain us for 3+ years |
| 7 | Decision-maker accessibility | 10 | We can reach the person who signs, directly |
| 8 | Competition *(inverted)* | 8 | High score = few credible incumbents |
| 9 | Reusability | 8 | Solution #2 costs far less to build than #1 |
| 10 | Recurring revenue potential | 6 | Natural reason to pay monthly, forever |

**Modifier — Implementation risk penalty (0 to −10).** Applied after the base
score. This is our addition to the brief's suggested model, and it is not
cosmetic: it is the single factor most likely to kill us. A vertical where the
first project fails technically or legally is worse than a vertical we never
entered. Regulatory exposure, integration lock-in and technical uncertainty all
land here.

**Weight changes vs. the brief.** The brief proposed Pain 20 / Value 20 /
Automation 15 / Pay 10 / Accessibility 10 / Repeatability 10 / Evidence 10 /
Competition 5. We split Pain into intensity + frequency (a severe annual problem
is not a business), and we raised Competition from 5 to 8 — because the research
found the low-end Italian market is *already crowded*, competition is a
first-order threat here, not a rounding error.

---

## 2. Scores

Scores are our judgement, anchored to the evidence in `01-market-analysis.md`.
They are transparent and arguable — that is the point. Change an input, change
the decision.

| Rank | Vertical | Pain | Freq | Value | Auto | Pay | Size | Access | Comp | Reuse | MRR | Base | Risk | **Final** |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Metalmeccanica / meccanica di precisione** | 13 | 9 | 13 | 9 | 8 | 8 | 9 | 6 | 7 | 5 | 87 | −5 | **82** |
| 2 | **Wholesale / distribuzione B2B** | 11 | 10 | 10 | 11 | 7 | 7 | 8 | 4 | 8 | 5 | 81 | −3 | **78** |
| 3 | **Commercialisti / accounting** | 13 | 10 | 8 | 9 | 6 | 7 | 8 | 2 | 8 | 6 | 77 | −5 | **72** |
| 4 | Logistics / spedizionieri | 12 | 9 | 10 | 10 | 7 | 6 | 7 | 3 | 7 | 5 | 76 | −4 | **72** |
| 5 | Serramenti / impiantistica | 11 | 9 | 8 | 9 | 5 | 6 | 9 | 6 | 7 | 4 | 74 | −3 | **71** |
| 6 | Insurance brokerages | 11 | 8 | 9 | 9 | 7 | 5 | 7 | 5 | 7 | 5 | 73 | −6 | **67** |
| 7 | Professional services | 10 | 8 | 9 | 8 | 7 | 6 | 8 | 4 | 6 | 5 | 71 | −4 | **67** |
| 8 | Real estate | 9 | 9 | 6 | 9 | 5 | 7 | 8 | 3 | 8 | 5 | 69 | −2 | **67** |
| 9 | Construction / edilizia | 12 | 8 | 11 | 7 | 6 | 7 | 7 | 5 | 5 | 4 | 72 | −6 | **66** |
| 10 | Food & beverage manufacturing | 9 | 8 | 8 | 8 | 7 | 6 | 7 | 5 | 6 | 5 | 69 | −4 | **65** |
| 11 | Automotive | 9 | 9 | 6 | 8 | 5 | 6 | 7 | 3 | 7 | 5 | 65 | −2 | **63** |
| 12 | Hotels / hospitality | 9 | 9 | 6 | 8 | 4 | 5 | 7 | 2 | 7 | 5 | 62 | −2 | **60** |
| 13 | Private healthcare | 11 | 10 | 7 | 7 | 6 | 5 | 6 | 4 | 7 | 5 | 68 | −8 | **60** |
| 14 | Travel / tourism | 9 | 8 | 5 | 8 | 3 | 4 | 7 | 2 | 6 | 4 | 56 | −2 | **54** |

---

## 3. Reasoning behind the decisive scores

### Metalmeccanica — 82 (winner)

- **Value 13/14.** This is the differentiator. In most verticals the value of
  automation is *saved cost* (hours × hourly rate) — a capped, unexciting number.
  Here the value is *won revenue*: a quote that arrives first, or arrives at all,
  converts into an order worth €5k–€200k. Research found firms with standard
  quotation lead times **exceeding 30 days**. Slow quoting loses orders outright.
- **Size 8/8.** 33,800 mechatronics local units in Lombardia. No other vertical
  we examined offers this density with this buyer profile.
- **Access 9/10.** These are owner-run firms. The person who feels the pain, the
  person who signs the cheque, and the person who answers the phone are one person.
- **Competition 6/8.** ERP vendors verticalise for metalworking (Dylog, Integro360,
  Dolimetal) but they sell entire systems on 6–12 month cycles. Nobody is selling
  a €25k point solution that bolts onto the ERP they already own.
- **Risk −5.** Honest penalty. Full automated interpretation of technical drawings
  and machining-time estimation is *hard* and we should not promise it in v1.
  Mitigated by scoping — see `04-beachhead-decision.md`.

### Wholesale / distribuzione — 78 (strong second)

Highest automation potential on the board (11/12): order entry from PDF/email
into an ERP is mechanical, structured and repetitive. Held back by Competition
4/8 — this is exactly the workflow the crowded €3–8k tier already advertises,
which caps our pricing.

### Commercialisti — 72 (ranked third, but for a different reason)

Tied on points with logistics; ranked above it deliberately.

The evidence of pain is the strongest of any vertical: **~120,000 registered
professionals nationally**, trainee registrations **down 5.7%** year-on-year, and
only about a third of entrants completing qualification compared with 18 years
ago. Work is rising while the labour supply shrinks. That is a structural,
non-cyclical buying pressure.

But **Competition scores 2/8** — the worst on the board. TeamSystem and Zucchetti
already embed AI in the gestionali these studios live inside, and studios buy
from their existing vendor. Ability to pay is only 6/10; they are famously
price-sensitive about their own tooling.

**The strategic read: a commercialista is a mediocre first customer and an
excellent distribution channel.** Each studio serves 200–400 SMEs and is the most
trusted advisor those SMEs have. One channel agreement is worth more than one
project sale. This belongs in the plan as a Q2 partnership motion, not a Q1
prospecting list.

### Why hospitality, travel and healthcare lose

- **Hospitality (60) / travel (54):** ability to pay 4/10 and 3/10. Thin,
  seasonal margins, and the software layer (PMS, channel managers, AI concierge)
  is already dense. Wrong customer for a €20k+ project.
- **Healthcare (60):** genuine pain and frequency, destroyed by a **−8 risk
  penalty**. Patient data is GDPR Article 9 special-category data. A young company
  with no compliance function should not make health data its first project.

---

## 4. What would change this decision

Stated in advance, so we can be honest with ourselves later:

- If 20+ discovery calls in metalmeccanica reveal that quotation lead time is
  *not* felt as a problem (owners say "we quote same day"), the Value score
  collapses and **wholesale/distribuzione becomes the beachhead**.
- If a Registro Imprese extract shows the addressable sub-segment (10–80
  employees, subcontract machining) is under ~800 companies in Lombardia, Size
  drops and we should widen to Veneto/Emilia rather than change vertical.
- If an incumbent ERP vendor ships a credible RFQ-automation module at SME
  pricing during our first 90 days, Competition drops to 3 and we should pivot
  to the wholesale workflow, which shares ~70% of the same engine (by design —
  see `docs/architecture/overview.md`).

## Sources

See `01-market-analysis.md` §Sources. Additional:
- [Fondazione Nazionale Commercialisti — Rapporto 2025 sull'Albo](https://www.fondazionenazionalecommercialisti.it/node/1836)
- [Ideaweb — Rigel: formulazione di preventivi complessi](https://www.ideawebtreviso.it/rigel-per-aziende-metalmeccaniche/rigel-per-aziende-metalmeccaniche.aspx) (source of the >30-day quotation lead-time reference)
- [Castaldo Solutions — Automazione AI per PMI: casi, costi e ROI](https://www.castaldosolutions.it/articles/blog/automazione-ai-pmi-italia) (low-end market pricing)
- [Usanest — Consulenza n8n in Italia: quanto costa](https://usanest.it/blog/consulenza-n8n-italia) (low-end market pricing)
