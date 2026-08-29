# Dolmir

AI implementation for Lombardy SMEs. We do not sell AI — we sell measurable
business outcomes in one expensive, repetitive workflow at a time.

**Beachhead:** subcontract precision-machining firms (10–80 employees) in
Lombardia. **Workflow:** RFQ intake → preventivo. **Product:** `Preventivo Rapido`.

Full reasoning: [`docs/strategy/04-beachhead-decision.md`](docs/strategy/04-beachhead-decision.md)

---

## Run the demo

No API key, no network required — it runs on a deterministic offline stub:

```bash
npm install
npm run demo
```

Against a real model:

```bash
export DOLMIR_AI_PROVIDER=anthropic
export ANTHROPIC_API_KEY=sk-ant-...
npm run demo
```

```bash
npm test        # 27 tests
npm run build   # typecheck + compile all packages
```

---

## What the demo shows

Five inbound emails from a machining shop's commercial inbox:

| Email | Outcome |
|---|---|
| Complete RFQ from a repeat customer | **Draft ready** — priced from that customer's own quote history, scaled for batch size |
| RFQ matching a part quoted for a *different* customer | **Draft ready, with a warning** to check commercial positioning first |
| Vague RFQ ("preventivo urgente", 4 pieces) | **Refused** — below shop minimum, and it says exactly which fields are missing |
| Purchase order | Correctly routed, not quoted |
| Marketing email | Filtered before any model call is made |

The behaviour to notice: when the system has no defensible pricing basis, it
returns `null` and says so. It does not produce a plausible-looking number.
A confident invented price saves nobody time — it has to be checked anyway — and
the once it isn't, it costs the client real margin.

---

## Repository map

| Path | Contents |
|---|---|
| [`docs/strategy/`](docs/strategy/) | Market analysis, vertical scoring, workflow ranking, beachhead decision, offer & pricing, 90-day plan, risks |
| [`docs/architecture/`](docs/architecture/) | Technical overview, AI provider layer, ADRs |
| [`docs/sales/`](docs/sales/) | Italian outreach templates, discovery call script, qualification |
| [`docs/website/`](docs/website/) | dolmir.com architecture |
| [`packages/ai-core/`](packages/ai-core/) | Provider-agnostic AI layer — the only place vendor SDKs appear |
| [`packages/rfq-engine/`](packages/rfq-engine/) | Preventivo Rapido |
| [`packages/prospecting/`](packages/prospecting/) | Prospect research and scoring pipeline |

## Architectural rules

1. Vendor SDKs appear **only** in `packages/ai-core/src/providers/`.
2. All AI calls go through `AIClient` — it owns retry, cost accounting and redacted logging.
3. **Every quote is approved by a human.** This is a liability firewall and a
   regulatory simplifier, not a UX choice.
4. No database, queue, web UI or vector store until a signed client needs one.

## Status

Pre-revenue. Zero clients. The demo runs; the market research is sourced; the
prospect pipeline is built. Everything else is a plan, and is labelled as such.
