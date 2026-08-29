# The AI Provider Layer

## Why this abstraction exists

It is not architectural taste. There are four concrete commercial reasons:

1. **GDPR sub-processors.** Every AI provider we route client data through must
   be named in that client's DPA. Some clients will object to a specific vendor.
   Provider choice must be a per-client config value, not a code change.
2. **Data residency and on-prem.** In this segment, technical drawings are the
   client's *customers'* intellectual property. Some prospects will require that
   data never leaves their building. `OpenAICompatibleProvider` pointed at a local
   vLLM or Ollama endpoint answers that requirement without a rewrite — and wins
   deals a single-provider architecture cannot.
3. **Pricing and availability move.** Model prices, rate limits and deprecations
   change on someone else's schedule, not ours.
4. **Testing and demos.** `MockProvider` makes the whole pipeline runnable with
   no key, no network and no cost.

## The contract

```ts
interface AIProvider {
  readonly id: string;
  readonly capabilities: ProviderCapabilities;
  complete(req: CompletionRequest): Promise<CompletionResult>;
  extract(req: ExtractionRequest): Promise<ExtractionResult>;
}
```

Two methods only. Every method added here is a method every future provider must
implement — the interface stays deliberately narrow.

## Tiers, not model names

Domain code asks for `'fast' | 'standard' | 'deep'`. Each provider maps tiers to
its own model ids. Domain code never names a model.

All Anthropic tiers currently map to `claude-opus-5`. Downgrading a tier is a
cost optimisation, and an unmeasured cost optimisation is a quality regression
discovered through a client complaint. Downgrade only with accuracy data from
real client RFQs.

## The extraction contract

Every extracted field returns:

```ts
{ value: T | null, confidence: number, evidence: string }
```

- `value: null` is a **correct** answer when the document does not contain it.
- `confidence` gates the field against a per-field floor (`schema.ts`).
- `evidence` must be a verbatim source quote. **If the model cannot quote the
  source, it does not have the value.** This single rule is our main defence
  against confident hallucination, and it doubles as the client-facing
  explanation of why a field was filled the way it was.

Confidence values from a provider are always clamped by us. We do not trust a
self-reported number we did not bound.

## Adding a provider

1. Implement `AIProvider` in `src/providers/`.
2. Map tiers to model ids; declare `euRegionAvailable` honestly — it appears in
   a DPA.
3. Add it to `registry.ts`.
4. Add extraction tests, including the absent-field and no-evidence cases.
5. Update the sub-processor list in the DPA template.

No changes anywhere else in the codebase should be required. If they are, the
abstraction has leaked and that is a bug.
