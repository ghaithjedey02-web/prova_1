# Technical Architecture

**Governing principle:** build the smallest thing that lets us win and deliver the
first client. Every component below must justify its existence against that test.
BUY before BUILD; and before buying, ask whether we need it at all yet.

---

## 1. The one idea

Every workflow in our roadmap is the same computation:

```
inbound unstructured document
      → classify (is this even the thing?)
      → extract structured fields (with confidence + evidence)
      → gate on confidence (low confidence ⇒ human)
      → triage (should we act on this at all?)
      → enrich from the client's own history / master data
      → draft the output
      → HUMAN APPROVAL   ← never optional
      → write to system of record
      → measure
```

We call this the **Document-to-Decision pipeline**. RFQ→quote is its first
configuration. Order entry, supplier price lists and customer POs are the same
pipeline with a different schema and renderer. This is why vertical #2 is cheap.

## 2. Repository layout

```
packages/
  ai-core/       Provider-agnostic AI layer. The ONLY place vendor SDKs appear.
  rfq-engine/    The beachhead product: Preventivo Rapido.
  prospecting/   Internal go-to-market tooling (prospect research pipeline).
docs/
  strategy/      Market, scoring, beachhead, offer, plan, risks.
  architecture/  This directory, plus ADRs.
  sales/         Outreach templates, call scripts, qualification.
  website/       dolmir.com architecture.
data/
  prospects/     Prospect data (schema + seeds).
```

## 3. Stack, and why

| Choice | Reason |
|---|---|
| TypeScript, Node 22 | One language across engine, tooling and any future web app. Strict mode on. |
| npm workspaces | Zero extra tooling. Adopt pnpm/turbo only if build time becomes a real problem. |
| Vitest | Fast, no config ceremony. |
| **No framework, no database yet** | We have no clients. A schema we invent now will be wrong. Fixtures and JSON until a real client's data shape is known. |
| **No queue, no Kubernetes, no vector DB** | All three are speculative at this stage. Comparable retrieval is deterministic scoring and will stay that way until a client's history makes it inadequate. |

**Deliberately deferred** (do not build until a signed client needs it): persistent
database, web UI, authentication, multi-tenancy, job queue, vector search,
observability platform.

## 4. Layering rules

```
    cli / (future) web ui
            ↓
       rfq-engine            ← domain logic, no vendor SDKs
            ↓
        ai-core              ← AIClient facade
            ↓
    providers/*              ← the ONLY vendor SDK / HTTP boundary
```

Enforced rules:
1. Nothing outside `packages/ai-core/src/providers/` imports a vendor SDK or
   references a vendor model name.
2. All AI calls go through `AIClient` — it owns retry, usage accounting and
   redacted logging. A direct provider call bypasses cost tracking that ends up
   on a client invoice.
3. Domain packages never read `process.env` for provider selection; they receive
   an `AIProvider`. This keeps them testable and multi-tenant-ready.

## 5. Human-in-the-loop, as an architectural constraint

`ProcessedRfq.status` is never "sent". The terminal machine state is a draft plus
a review queue. This is simultaneously:

- **a product decision** — trust is what makes the tool used daily;
- **a liability firewall** — the client approves and owns every commercial term;
- **an EU AI Act simplifier** — meaningful human oversight keeps us clearly out
  of autonomous-decision territory.

Any future feature that removes the approval step must be treated as a change to
the company's risk posture, not a UX improvement.

## 6. Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `DOLMIR_AI_PROVIDER` | `mock` | `mock` \| `anthropic` \| `openai-compatible` |
| `ANTHROPIC_API_KEY` | — | Required when provider is `anthropic` |
| `OPENAI_API_KEY` | — | Required for hosted OpenAI-compatible endpoints |
| `OPENAI_BASE_URL` | `https://api.openai.com/v1` | Point at Azure, Mistral, vLLM or Ollama |
| `OPENAI_MODEL` | `gpt-4o` | Model id for the OpenAI-compatible provider |

Defaulting to `mock` is intentional: a missing key degrades to a runnable,
obviously-labelled stub rather than a crash. That is what makes the sales demo
safe to run on any laptop, offline, in a meeting room with no wifi.

## 7. Security & data protection

- **Redaction before logging.** `redact()` strips emails, phones, VAT numbers and
  IBANs from anything written to logs. We are a data processor; leaking client
  data into logs is a reportable breach.
- **Per-client isolation.** `ShopProfile` and quote history are per client. Never
  pooled, never aggregated, never used to train.
- **No secrets in the repo.** `.env` is gitignored; `.env.example` documents names only.
- **Provider = sub-processor.** Named in each client DPA; swappable via config.

See `docs/strategy/08-risks-and-compliance.md`.

## 8. Testing

`npm test` — 27 tests covering classification, triage, comparable retrieval,
draft refusal behaviour, confidence gating, redaction and the end-to-end pipeline.

The highest-value test in the suite is
*"REFUSES to invent a price when no comparable supports one."* If that test ever
goes red, the product is no longer safe to sell.

## 9. Deployment (when a client exists — not before)

Intended v1: a single small VM or container running a scheduled inbox poller plus
the pipeline, writing drafts to the client's mailbox as actual draft messages.
No public web surface in v1 — nothing to attack, nothing to authenticate.

## 10. Costs

`AIClient` accumulates per-call token usage and EUR cost. Model consumption is
billed to clients at cost + 15% beyond the retainer's fair-use tier, so this
number must be trustworthy. FX is a fixed documented constant, reviewed
quarterly — auditable beats precise on an invoice.
