import { AIError } from './errors.js';
import { ConsoleLogger, type Logger } from './logger.js';
import { safeSnippet } from './redaction.js';
import type {
  AIProvider, CompletionRequest, CompletionResult,
  ExtractionRequest, ExtractionResult,
} from './types.js';

export interface AIClientOptions {
  provider: AIProvider;
  logger?: Logger;
  maxRetries?: number;
  /** Base delay for exponential backoff, ms. */
  retryBaseMs?: number;
  /** Correlation id written to every log line. One per processed document. */
  traceId?: string;
}

export interface UsageTotals {
  calls: number;
  inputTokens: number;
  outputTokens: number;
  costEur: number;
}

/**
 * The single entry point for every AI call in the system.
 *
 * Responsibilities kept here rather than in providers, so that adding a
 * provider stays cheap:
 *   - retry with exponential backoff on retryable failures only
 *   - usage and cost accumulation (we bill model consumption at cost + 15%,
 *     so this number ends up on a client invoice and must be trustworthy)
 *   - redacted structured logging
 */
export class AIClient {
  private readonly provider: AIProvider;
  private readonly logger: Logger;
  private readonly maxRetries: number;
  private readonly retryBaseMs: number;
  private readonly traceId: string;
  private totals: UsageTotals = { calls: 0, inputTokens: 0, outputTokens: 0, costEur: 0 };

  constructor(opts: AIClientOptions) {
    this.provider = opts.provider;
    this.logger = opts.logger ?? new ConsoleLogger();
    this.maxRetries = opts.maxRetries ?? 2;
    this.retryBaseMs = opts.retryBaseMs ?? 500;
    this.traceId = opts.traceId ?? cryptoRandomId();
  }

  get providerId(): string {
    return this.provider.id;
  }

  async complete(req: CompletionRequest): Promise<CompletionResult> {
    return this.run('complete', req.operation, () => this.provider.complete(req), (r) => r);
  }

  async extract(req: ExtractionRequest): Promise<ExtractionResult> {
    return this.run(
      'extract',
      req.operation,
      () => this.provider.extract(req),
      (r) => r,
      { contentSnippet: safeSnippet(req.content, 120), fieldCount: Object.keys(req.schema).length },
    );
  }

  usage(): UsageTotals {
    return { ...this.totals };
  }

  private async run<T extends { usage: { inputTokens: number; outputTokens: number }; estimatedCostEur: number; latencyMs: number; modelId: string }>(
    kind: string,
    operation: string,
    fn: () => Promise<T>,
    pick: (r: T) => T,
    extra: Record<string, unknown> = {},
  ): Promise<T> {
    let lastErr: unknown;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const result = await fn();
        this.totals.calls += 1;
        this.totals.inputTokens += result.usage.inputTokens;
        this.totals.outputTokens += result.usage.outputTokens;
        this.totals.costEur += result.estimatedCostEur;

        this.logger.log({
          level: 'info',
          msg: 'ai_call',
          traceId: this.traceId,
          kind,
          operation,
          provider: this.provider.id,
          model: result.modelId,
          attempt,
          latencyMs: result.latencyMs,
          inputTokens: result.usage.inputTokens,
          outputTokens: result.usage.outputTokens,
          costEur: result.estimatedCostEur,
          ...extra,
        });
        return pick(result);
      } catch (err) {
        lastErr = err;
        const retryable = err instanceof AIError && err.retryable;

        this.logger.log({
          level: retryable && attempt < this.maxRetries ? 'warn' : 'error',
          msg: 'ai_call_failed',
          traceId: this.traceId,
          kind,
          operation,
          provider: this.provider.id,
          attempt,
          retryable,
          code: err instanceof AIError ? err.code : 'UNKNOWN',
          error: err instanceof Error ? err.message : String(err),
        });

        if (!retryable || attempt === this.maxRetries) break;
        // Exponential backoff with jitter — avoids synchronised retry storms
        // when a batch of RFQs is processed at once.
        const delay = this.retryBaseMs * 2 ** attempt * (0.5 + Math.random());
        await sleep(delay);
      }
    }
    throw lastErr;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function cryptoRandomId(): string {
  return Math.random().toString(36).slice(2, 10);
}
