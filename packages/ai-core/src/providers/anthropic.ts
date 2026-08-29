import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { z } from 'zod';
import { AIError, ConfigurationError, ExtractionFormatError } from '../errors.js';
import type {
  AIProvider, CompletionRequest, CompletionResult, ExtractionRequest,
  ExtractionResult, ExtractionSchema, FieldResult, ModelTier,
  ProviderCapabilities, ProviderConfig,
} from '../types.js';

/**
 * Anthropic provider.
 *
 * This is the ONLY file permitted to import `@anthropic-ai/sdk`. Everything
 * else in the monorepo goes through `AIClient` and the `AIProvider` interface.
 */

/**
 * Tier → model mapping.
 *
 * All tiers default to `claude-opus-5` deliberately. Downgrading a tier is a
 * cost optimisation, and a cost optimisation without measurement is a quality
 * regression we would discover through a client complaint. Override per client
 * in config once we have accuracy data from real RFQs to compare against.
 */
const DEFAULT_MODELS: Record<ModelTier, string> = {
  fast: 'claude-opus-5',
  standard: 'claude-opus-5',
  deep: 'claude-opus-5',
};

/** USD per 1M tokens, from the published price list. Converted to EUR at call time. */
const PRICING_USD_PER_MTOK: Record<string, { input: number; output: number }> = {
  'claude-opus-5': { input: 5, output: 25 },
  'claude-sonnet-5': { input: 2, output: 10 },
  'claude-haiku-4-5': { input: 1, output: 5 },
};

/**
 * Static FX rate. Deliberately a constant, not a live lookup: this figure exists
 * to attribute cost per client on invoices, where a stable, auditable rate beats
 * a precise one. Review quarterly.
 */
const USD_TO_EUR = 0.92;

const EFFORT_BY_TIER: Record<ModelTier, 'low' | 'medium' | 'high'> = {
  fast: 'low',
  standard: 'medium',
  deep: 'high',
};

export class AnthropicProvider implements AIProvider {
  readonly id = 'anthropic';
  readonly capabilities: ProviderCapabilities = {
    nativeStructuredOutput: true,
    euRegionAvailable: true,
    maxContextTokens: 1_000_000,
  };

  private readonly client: Anthropic;
  private readonly models: Record<ModelTier, string>;

  constructor(config: ProviderConfig = {}) {
    const apiKey = config.apiKey ?? process.env['ANTHROPIC_API_KEY'];
    if (!apiKey) {
      throw new ConfigurationError(
        'AnthropicProvider requires an API key (config.apiKey or ANTHROPIC_API_KEY). ' +
          'For a no-network demo use MockProvider instead.',
      );
    }
    this.client = new Anthropic({
      apiKey,
      ...(config.baseUrl ? { baseURL: config.baseUrl } : {}),
      ...(config.timeoutMs ? { timeout: config.timeoutMs } : {}),
    });
    this.models = { ...DEFAULT_MODELS, ...config.models };
  }

  async complete(req: CompletionRequest): Promise<CompletionResult> {
    const tier = req.tier ?? 'standard';
    const model = this.models[tier];
    const started = Date.now();

    const system = req.messages.filter((m) => m.role === 'system').map((m) => m.content).join('\n\n');
    const messages = req.messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    try {
      const res = await this.client.messages.create({
        model,
        max_tokens: req.maxOutputTokens ?? 16000,
        ...(system ? { system } : {}),
        messages,
        thinking: { type: 'adaptive' },
        output_config: { effort: EFFORT_BY_TIER[tier] },
      });

      if (res.stop_reason === 'refusal') {
        throw new AIError(
          `Model declined the request (${res.stop_details?.category ?? 'unknown'})`,
          'REFUSAL', this.id, false,
        );
      }

      const text = res.content
        .filter((b): b is Anthropic.TextBlock => b.type === 'text')
        .map((b) => b.text)
        .join('');

      return {
        text,
        usage: { inputTokens: res.usage.input_tokens, outputTokens: res.usage.output_tokens },
        providerId: this.id,
        modelId: model,
        latencyMs: Date.now() - started,
        estimatedCostEur: estimateCostEur(model, res.usage.input_tokens, res.usage.output_tokens),
      };
    } catch (err) {
      throw wrapError(err, this.id);
    }
  }

  async extract(req: ExtractionRequest): Promise<ExtractionResult> {
    const tier = req.tier ?? 'standard';
    const model = this.models[tier];
    const started = Date.now();
    const zodSchema = buildZodSchema(req.schema);

    try {
      const res = await this.client.messages.parse({
        model,
        max_tokens: 16000,
        system: buildExtractionSystemPrompt(req.instructions),
        messages: [{ role: 'user', content: req.content }],
        thinking: { type: 'adaptive' },
        output_config: { effort: EFFORT_BY_TIER[tier], format: zodOutputFormat(zodSchema) },
      });

      if (res.stop_reason === 'refusal') {
        throw new AIError(
          `Model declined the extraction (${res.stop_details?.category ?? 'unknown'})`,
          'REFUSAL', this.id, false,
        );
      }

      const parsed = res.parsed_output as Record<string, FieldResult> | null;
      if (!parsed) {
        throw new ExtractionFormatError(this.id, JSON.stringify(res.content).slice(0, 500));
      }

      // Never trust a confidence value we did not clamp ourselves.
      const fields: Record<string, FieldResult> = {};
      for (const key of Object.keys(req.schema)) {
        const raw = parsed[key];
        fields[key] = raw
          ? {
              value: raw.value ?? null,
              confidence: clamp01(Number(raw.confidence ?? 0)),
              evidence: String(raw.evidence ?? '').slice(0, 300),
            }
          : { value: null, confidence: 0, evidence: '' };
      }

      return {
        fields,
        usage: { inputTokens: res.usage.input_tokens, outputTokens: res.usage.output_tokens },
        providerId: this.id,
        modelId: model,
        latencyMs: Date.now() - started,
        estimatedCostEur: estimateCostEur(model, res.usage.input_tokens, res.usage.output_tokens),
      };
    } catch (err) {
      throw wrapError(err, this.id);
    }
  }
}

/**
 * The extraction contract, stated to the model.
 *
 * The anti-hallucination clause is the commercially important part: a
 * confidently wrong material grade produces a wrong quote, and a wrong quote
 * costs our client real money. A null with low confidence costs them ten seconds.
 */
function buildExtractionSystemPrompt(instructions: string): string {
  return [
    instructions,
    '',
    'Rules you must follow exactly:',
    '1. Extract ONLY what is present in the source text. Never infer, complete or guess a value.',
    '2. If a field is absent, ambiguous, or you are unsure: set value to null and confidence to 0.',
    '   A null is a correct answer. An invented value is a defect.',
    '3. `confidence` is 0.0–1.0 and must reflect genuine certainty about THIS document.',
    '4. `evidence` must be a verbatim quote from the source supporting the value. If you cannot',
    '   quote the source, you do not have the value — return null.',
    '5. Do not translate, normalise or reformat values unless the field description asks for it.',
  ].join('\n');
}

/** Builds a Zod schema of `{value, confidence, evidence}` per requested field. */
function buildZodSchema(schema: ExtractionSchema) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const [name, spec] of Object.entries(schema)) {
    shape[name] = z.object({
      value: valueSchema(spec.type).nullable().describe(spec.description),
      confidence: z.number().min(0).max(1).describe('Genuine certainty, 0.0-1.0. Use 0 when absent.'),
      evidence: z.string().describe('Verbatim supporting quote from the source. Empty if none.'),
    });
  }
  return z.object(shape);
}

function valueSchema(t: ExtractionSchema[string]['type']): z.ZodTypeAny {
  switch (t) {
    case 'number': return z.number();
    case 'boolean': return z.boolean();
    case 'string[]': return z.array(z.string());
    default: return z.string();
  }
}

function clamp01(n: number): number {
  return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0;
}

function estimateCostEur(model: string, inputTokens: number, outputTokens: number): number {
  const p = PRICING_USD_PER_MTOK[model];
  if (!p) return 0;
  const usd = (inputTokens / 1e6) * p.input + (outputTokens / 1e6) * p.output;
  return Number((usd * USD_TO_EUR).toFixed(6));
}

function wrapError(err: unknown, providerId: string): Error {
  if (err instanceof AIError) return err;
  if (err instanceof Anthropic.RateLimitError)
    return new AIError('Rate limited', 'RATE_LIMIT', providerId, true, err);
  if (err instanceof Anthropic.AuthenticationError)
    return new AIError('Authentication failed', 'AUTH', providerId, false, err);
  if (err instanceof Anthropic.BadRequestError)
    return new AIError(`Bad request: ${err.message}`, 'BAD_REQUEST', providerId, false, err);
  if (err instanceof Anthropic.APIConnectionError)
    return new AIError('Connection error', 'CONNECTION', providerId, true, err);
  if (err instanceof Anthropic.APIError)
    return new AIError(`API error ${err.status}: ${err.message}`, 'API_ERROR', providerId, (err.status ?? 500) >= 500, err);
  return new AIError(String(err), 'UNKNOWN', providerId, false, err);
}
