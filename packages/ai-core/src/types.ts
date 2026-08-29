/**
 * Core contracts for the Dolmir AI layer.
 *
 * ARCHITECTURAL RULE — enforced by review and by test:
 * No code outside `packages/ai-core/src/providers/` may import a vendor SDK,
 * call a vendor HTTP endpoint, or reference a vendor-specific model name.
 * Everything upstream talks to `AIClient` and these interfaces only.
 *
 * Why this matters commercially, not just aesthetically:
 *  - Every AI provider is a GDPR sub-processor that must be named in the client
 *    DPA. Clients will object to specific ones. We must be able to swap a
 *    provider per client as a config change, not a rewrite.
 *  - Provider pricing and availability move constantly.
 *  - Some clients will require EU-region endpoints or on-prem inference.
 */

/** Stable, provider-neutral capability tiers we select against. */
export type ModelTier =
  /** Cheap, fast. Classification, routing, short extraction. */
  | 'fast'
  /** Balanced. Most structured extraction work. */
  | 'standard'
  /** Highest capability. Complex reasoning, difficult documents. */
  | 'deep';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface CompletionRequest {
  messages: Message[];
  tier?: ModelTier;
  maxOutputTokens?: number;
  temperature?: number;
  /** Free-form label used for cost attribution and log correlation. */
  operation: string;
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
}

export interface CompletionResult {
  text: string;
  usage: TokenUsage;
  providerId: string;
  modelId: string;
  /** Wall-clock latency in ms. */
  latencyMs: number;
  /** Estimated cost in EUR. Zero when the provider does not report pricing. */
  estimatedCostEur: number;
}

/**
 * A JSON-Schema-ish description of the object we want back.
 * Deliberately minimal: providers differ wildly in structured-output support,
 * so we keep the shared contract small and let each provider adapt.
 */
export interface SchemaField {
  type: 'string' | 'number' | 'boolean' | 'string[]';
  description: string;
  /** When absent the model must return null rather than inventing a value. */
  required?: boolean;
}

export type ExtractionSchema = Record<string, SchemaField>;

export interface ExtractionRequest {
  /** The document text to extract from. */
  content: string;
  schema: ExtractionSchema;
  /** Domain instructions, e.g. "This is an Italian machining RFQ." */
  instructions: string;
  tier?: ModelTier;
  operation: string;
}

export interface FieldResult<T = unknown> {
  value: T | null;
  /** 0..1. Below `confidenceFloor` the field is routed for human review. */
  confidence: number;
  /** Verbatim source span supporting the value. Empty when not found. */
  evidence: string;
}

export interface ExtractionResult {
  fields: Record<string, FieldResult>;
  usage: TokenUsage;
  providerId: string;
  modelId: string;
  latencyMs: number;
  estimatedCostEur: number;
}

export interface ProviderCapabilities {
  /** Provider can enforce a JSON response shape natively. */
  nativeStructuredOutput: boolean;
  /** Provider offers an EU-region endpoint. Relevant to the DPA. */
  euRegionAvailable: boolean;
  maxContextTokens: number;
}

/**
 * The only interface a provider must implement.
 * Keep it small — every method here is a method every future provider must support.
 */
export interface AIProvider {
  readonly id: string;
  readonly capabilities: ProviderCapabilities;
  complete(req: CompletionRequest): Promise<CompletionResult>;
  extract(req: ExtractionRequest): Promise<ExtractionResult>;
}

export interface ProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  /** Maps our neutral tiers onto this provider's concrete model ids. */
  models?: Partial<Record<ModelTier, string>>;
  timeoutMs?: number;
}
