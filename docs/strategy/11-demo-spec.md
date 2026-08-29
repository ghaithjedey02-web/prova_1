# 11 — Demo Specification

The demo is the single highest-leverage asset we own. It is the thing that
converts "another vendor called me" into "show me that again."

**Built and running:** `npm run demo` (offline, no API key required).

---

## 1. What the demo must achieve

In order of importance:

1. **Recognition** — the owner sees their own inbox on the screen
2. **Trust** — they see the system refuse to guess
3. **Speed** — they see days become seconds
4. **Control** — they see that nothing sends without a human

Note that "impressive technology" is not on the list. In this segment, a demo
that looks too magical reads as too risky.

## 2. Structure — BEFORE / AFTER

### BEFORE — the process today

Five steps, stated in their language, not ours:

1. The email arrives in the commercial inbox, along with everything else
2. Someone opens it, reads it, decides whether it is a request for quote
3. They try to remember whether a similar part was quoted before
4. They retype the details into the quote spreadsheet
5. They write the quote and send it — if it hasn't got lost along the way

Then the baseline: *~42 minutes per quote, response in ~52 hours.*

**Those figures are labelled ILLUSTRATIVE on screen.** In a real engagement they
are replaced by numbers measured in the paid audit. The demo says so out loud.

### AFTER — five real emails through the pipeline

| Email | What the demo shows |
|---|---|
| Complete RFQ from a repeat customer | **Draft ready.** Priced from that customer's own quote history, scaled for batch size, with the source quote named and dated |
| RFQ matching a part quoted for a *different* customer | **Draft ready, with a warning** to check commercial positioning before sending |
| Vague RFQ ("preventivo urgente", 4 pieces) | **Refused.** Below shop minimum, and it lists exactly which fields are missing |
| Purchase order | Routed, not quoted |
| Marketing email | Filtered before any model call is made |

### The three moments that sell

**Moment 1 — the historic comparable.**
> *"Base: offerta OFF-2026-118 del 14/03/2026 — flangia tornita per Tecnoflex Lecco, 150 pz a €14,20/pz. ✅ L'offerta di riferimento è stata acquisita a questo prezzo."*

This is the shop's own institutional memory, currently living in one person's
head. Owners react to this line more than to anything else in the demo.

**Moment 2 — the refusal.**
> *"Prezzo: da definire — nessuna base storica affidabile."*

Counter-intuitively the strongest trust signal in the whole demo. Say it out
loud: *"It could have invented a number here. It doesn't. If it can't justify a
price from your history, it says so."*

**Moment 3 — the cross-customer warning.**
> *"⚠️ Riferimento da un altro cliente (Meccanica Sebina): verificare il posizionamento commerciale prima di inviare."*

Shows judgement, not just extraction. It knows that another customer's price is
information, not an answer.

## 3. Running it live

| | |
|---|---|
| **Length** | 6–8 minutes. Never longer. |
| **Setup** | Terminal, large font, dark background. Nothing else on screen. |
| **Opening** | *"Le mostro cosa succede a cinque email arrivate in una mattina."* |
| **During** | Silence while output scrolls. Let them read. Do not narrate every line. |
| **The ask** | *"Me ne inoltri una vostra, anche vecchia. La facciamo passare adesso."* |

That last line is the whole sales strategy compressed into one sentence. When a
prospect forwards a real RFQ, the demo stops being a demo.

**Fallbacks, in order:** live terminal → recorded 3-minute video → printed
before/after sheet. Never let a technical failure end the meeting.

## 4. Technical specification

**Implemented:** `packages/rfq-engine`

```
InboundEmail
  → classify()            deterministic, free, no model call
  → AIClient.extract()    structured fields + confidence + evidence
  → gateFields()          per-field confidence floors → review queue
  → triage()              bid / review / no-bid vs shop capability
  → findComparables()     deterministic scoring over quote history
  → buildDraft()          Italian draft, or an explicit refusal
  → ProcessedRfq          status + review queue + measured cost
```

**Fixtures:** 5 Italian emails, 4 historic quotes, one shop profile.
Written to include the awkward cases — the vague enquiry and the purchase
order — because a demo where everything works is not credible to someone who
has seen software fail.

**Provider:** `MockProvider` by default — deterministic, offline, zero cost, so
the demo cannot fail on a meeting-room wifi. A banner states plainly that this
is rule-based, not model output. **Never let a viewer believe heuristic output
is model output.**

Set `DOLMIR_AI_PROVIDER=anthropic` to run against a real model, which is what
we do when processing a prospect's own forwarded RFQ.

## 5. Roadmap

| When | Addition |
|---|---|
| Now | Terminal demo ✅ built |
| Week 2 | Recorded 3-minute video fallback |
| Week 6 | Browser demo on `/demo` — same pipeline, visual pipeline animation |
| Week 6 | "Paste your own RFQ" with an explicit data-handling notice |
| Week 12 | Replace illustrative baseline with the first client's real measured figures |

## 6. Rules

- ❌ Never show a fabricated client name as if real (fixtures use `.example` domains)
- ❌ Never present illustrative ROI as measured
- ❌ Never demo a feature that does not exist
- ❌ Never remove the human approval step to make it look more impressive
- ✅ Always show at least one case the system refuses
