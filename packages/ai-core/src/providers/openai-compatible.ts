import { AIError, ConfigurationError, ExtractionFormatError } from '../errors.js';
import type {
  AIProvider, CompletionRequest, CompletionResult, ExtractionRequest,
  ExtractionResult, ExtractionSchema, FieldResult, ModelTier,
  ProviderCapabilities, ProviderConfig,
} from '../types.js';

/**
 * Generic OpenAI-compatible provider (raw HTTP, no vendor SDK).
 *
 * WHY THIS EXISTS — it is a sales instrument, not a hedge.
 * The same wire format is spoken by OpenAI, Azure OpenAI, Mistral, Together,
 * vLLM and Ollama. That means when a prospect says "our drawings must never
 * leave our building" — and in this segment some will, because those drawings
 * are their customers' IP — we can answer "then we run the model on your
 * hardware" and it is a config change, not a rewrite.
 *
 * That answer wins deals a single-provider architecture cannot.
 */
export class OpenAICompatibleProvider implements AIProvider {
  readonly id: string;
  readonly capabilities: ProviderCapabilities;

  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly models: Record<ModelTier, string>;
  private readonly timeoutMs: number;

  constructor(config: ProviderConfig & { id?: string; capabilities?: Partial<ProviderCapabilities> } = {}) {
    this.id = config.id ?? 'openai-compatible';
    this.baseUrl = (config.baseUrl ?? process.env['OPENAI_BASE_URL'] ?? 'https://api.openai.com/v1').replace(/\/$/, '');
    // Local runtimes (Ollama, vLLM) need no key; hosted ones do.
    this.apiKey = config.apiKey ?? process.env['OPENAI_API_KEY'] ?? '';
    this.timeoutMs = config.timeoutMs ?? 120_000;

    const m = config.models ?? {};
    const fallback = process.env['OPENAI_MODEL'] ?? 'gpt-4o';
    this.models = {
      fast: m.fast ?? fallback,
      standard: m.standard ?? fallback,
      deep: m.deep ?? fallback,
    };

    this.capabilities = {
      nativeStructuredOutput: true,
      euRegionAvailable: false,
      maxContextTokens: 128_000,
      ...config.capabilities,
    };

    if (!this.apiKey && !/localhost|127\.0\.0\.1/.test(this.baseUrl)) {
      throw new ConfigurationError(
        `${this.id} requires an API key for a non-local baseUrl (${this.baseUrl}).`,
      );
    }
  }

  async complete(req: CompletionRequest): Promise<CompletionResult> {
    const tier = req.tier ?? 'standard';
    const model = this.models[tier];
    const started = Date.now();

    const body = {
      model,
      messages: req.messages.map((m) => ({ role: m.role, content: m.content })),
      max_completion_tokens: req.maxOutputTokens ?? 16000,
      ...(req.temperature !== undefined ? { temperature: req.temperature } : {}),
    };

    const json = await this.post('/chat/completions', body);
    const text = json?.choices?.[0]?.message?.content ?? '';

    return {
      text: String(text),
      usage: {
        inputTokens: json?.usage?.prompt_tokens ?? 0,
        outputTokens: json?.usage?.completion_tokens ?? 0,
      },
      providerId: this.id,
      modelId: model,
      latencyMs: Date.now() - started,
      // Pricing varies per deployment; we do not guess. Attribute cost from
      // the provider's own billing export instead of inventing a number here.
      estimatedCostEur: 0,
    };
  }

  async extract(req: ExtractionRequest): Promise<ExtractionResult> {
    const tier = req.tier ?? 'standard';
    const model = this.models[tier];
    const started = Date.now();

    const body = {
      model,
      messages: [
        { role: 'system', content: buildExtractionSystemPrompt(req.instructions) },
        { role: 'user', content: req.content },
      ],
      max_completion_tokens: 16000,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'extraction',
          strict: true,
          schema: buildJsonSchema(req.schema),
        },
      },
    };

    const json = await this.post('/chat/completions', body);
    const raw = json?.choices?.[0]?.message?.content ?? '';

    let parsed: Record<string, FieldResult>;
    try {
      parsed = JSON.parse(String(raw));
    } catch {
      throw new ExtractionFormatError(this.id, String(raw).slice(0, 500));
    }

    const fields: Record<string, FieldResult> = {};
    for (const key of Object.keys(req.schema)) {
      const r = parsed[key];
      fields[key] = r
        ? {
            value: r.value ?? null,
            confidence: clamp01(Number(r.confidence ?? 0)),
            evidence: String(r.evidence ?? '').slice(0, 300),
          }
        : { value: null, confidence: 0, evidence: '' };
    }

    return {
      fields,
      usage: {
        inputTokens: json?.usage?.prompt_tokens ?? 0,
        outputTokens: json?.usage?.completion_tokens ?? 0,
      },
      providerId: this.id,
      modelId: model,
      latencyMs: Date.now() - started,
      estimatedCostEur: 0,
    };
  }

  private async post(path: string, body: unknown): Promise<any> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(this.apiKey ? { authorization: `Bearer ${this.apiKey}` } : {}),
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!res.ok) {
        const detail = (await res.text()).slice(0, 300);
        throw new AIError(
          `HTTP ${res.status}: ${detail}`,
          res.status === 429 ? 'RATE_LIMIT' : 'API_ERROR',
          this.id,
          res.status === 429 || res.status >= 500,
        );
      }
      return await res.json();
    } catch (err) {
      if (err instanceof AIError) throw err;
      if (err instanceof Error && err.name === 'AbortError') {
        throw new AIError(`Timed out after ${this.timeoutMs}ms`, 'TIMEOUT', this.id, true, err);
      }
      throw new AIError(String(err), 'CONNECTION', this.id, true, err);
    } finally {
      clearTimeout(timer);
    }
  }
}

function buildExtractionSystemPrompt(instructions: string): string {
  return [
    instructions,
    '',
    'Return JSON only. For every field return {value, confidence, evidence}.',
    'Extract ONLY what is present. If absent or ambiguous: value=null, confidence=0.',
    'A null is a correct answer; an invented value is a defect.',
    '`evidence` must be a verbatim quote from the source, or an empty string.',
  ].join('\n');
}

function buildJsonSchema(schema: ExtractionSchema): Record<string, unknown> {
  const properties: Record<string, unknown> = {};
  for (const [name, spec] of Object.entries(schema)) {
    properties[name] = {
      type: 'object',
      properties: {
        value: { type: [jsonType(spec.type), 'null'], description: spec.description },
        confidence: { type: 'number' },
        evidence: { type: 'string' },
      },
      required: ['value', 'confidence', 'evidence'],
      additionalProperties: false,
    };
  }
  return {
    type: 'object',
    properties,
    required: Object.keys(schema),
    additionalProperties: false,
  };
}

function jsonType(t: ExtractionSchema[string]['type']): string {
  switch (t) {
    case 'number': return 'number';
    case 'boolean': return 'boolean';
    case 'string[]': return 'array';
    default: return 'string';
  }
}

function clamp01(n: number): number {
  return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0;
}
