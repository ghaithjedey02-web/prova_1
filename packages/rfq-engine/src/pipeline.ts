import { AIClient, type Logger, SilentLogger } from '@dolmir/ai-core';
import type { AIProvider } from '@dolmir/ai-core';
import { CONFIDENCE_FLOOR, DEFAULT_CONFIDENCE_FLOOR, EXTRACTION_INSTRUCTIONS, RFQ_SCHEMA } from './schema.js';
import { classify } from './stages/classify.js';
import { buildDraft } from './stages/draft.js';
import { findComparables } from './stages/enrich.js';
import { triage } from './stages/triage.js';
import type { ShopProfile } from './pricing.js';
import type {
  ExtractedRfq, FieldName, HistoricQuote, InboundEmail,
  ProcessedRfq, ProcessingStatus, ReviewItem,
} from './types.js';

export interface PipelineOptions {
  provider: AIProvider;
  shop: ShopProfile;
  history: HistoricQuote[];
  logger?: Logger;
}

/**
 * The Document-to-Decision pipeline, configured for RFQs.
 *
 * The stage sequence — classify → extract → gate → triage → enrich → draft →
 * human approval — is workflow-agnostic by design. Order entry, supplier price
 * lists and customer POs are the same pipeline with a different schema and a
 * different draft renderer. See `docs/strategy/03-workflow-analysis.md` §E.
 */
export class RfqPipeline {
  private readonly ai: AIClient;
  private readonly shop: ShopProfile;
  private readonly history: HistoricQuote[];

  constructor(opts: PipelineOptions) {
    this.ai = new AIClient({ provider: opts.provider, logger: opts.logger ?? new SilentLogger() });
    this.shop = opts.shop;
    this.history = opts.history;
  }

  async process(email: InboundEmail): Promise<ProcessedRfq> {
    const started = Date.now();

    // Stage 1 — classify. Free, deterministic, runs before any model spend.
    const cls = classify(email);
    if (cls.classification !== 'RFQ') {
      return {
        emailId: email.id,
        receivedAt: email.receivedAt,
        classification: cls.classification,
        classificationConfidence: cls.confidence,
        extracted: null, triage: null, draft: null,
        reviewQueue: [],
        status: 'NOT_AN_RFQ',
        processingMs: Date.now() - started,
        costEur: 0,
      };
    }

    // Stage 2 — structured extraction.
    const raw = await this.ai.extract({
      content: buildExtractionInput(email),
      schema: RFQ_SCHEMA,
      instructions: EXTRACTION_INSTRUCTIONS,
      tier: 'standard',
      operation: 'rfq_extract',
    });
    const extracted = raw.fields as unknown as ExtractedRfq;

    // Stage 3 — confidence gating. Everything below its floor goes to a human.
    const reviewQueue = gateFields(extracted);

    // Stage 4 — bid/no-bid triage.
    const tri = triage(extracted, this.shop);

    // Stage 5 — retrieve comparables from the shop's own quote history.
    const comparables = findComparables(extracted, this.history);

    // Stage 6 — draft.
    const draft = buildDraft(email.id, extracted, comparables, this.shop);
    if (draft.suggestedUnitPriceEur === null) {
      reviewQueue.push({
        field: 'PRICE',
        reason: 'Nessuna offerta storica sufficientemente simile: serve una stima tecnica.',
        confidence: 0,
        evidence: '',
      });
    }

    return {
      emailId: email.id,
      receivedAt: email.receivedAt,
      classification: cls.classification,
      classificationConfidence: cls.confidence,
      extracted,
      triage: tri,
      draft,
      reviewQueue,
      status: deriveStatus(reviewQueue, draft.suggestedUnitPriceEur),
      processingMs: Date.now() - started,
      costEur: raw.estimatedCostEur,
    };
  }

  usage() {
    return this.ai.usage();
  }
}

/** Attachments are listed, not parsed — v1 scope. See beachhead decision §4. */
function buildExtractionInput(email: InboundEmail): string {
  const attachments = email.attachments.length
    ? `\n\nAllegati: ${email.attachments.map((a) => a.filename).join(', ')}`
    : '\n\nAllegati: nessuno';
  // Envelope fields are labelled distinctly from body content: real emails
  // often repeat "Da:" and "Oggetto:" inside the quoted body, and an
  // undifferentiated header lets the sender address shadow the real company name.
  return [
    `[MITTENTE] ${email.from}`,
    `[OGGETTO EMAIL] ${email.subject}`,
    '[CORPO DEL MESSAGGIO]',
    email.body,
  ].join('\n') + attachments;
}

function gateFields(extracted: ExtractedRfq): ReviewItem[] {
  const queue: ReviewItem[] = [];
  for (const [name, field] of Object.entries(extracted) as [FieldName, { value: unknown; confidence: number; evidence: string }][]) {
    const floor = CONFIDENCE_FLOOR[name] ?? DEFAULT_CONFIDENCE_FLOOR;
    const required = RFQ_SCHEMA[name]?.required === true;

    if (field.value === null || field.value === undefined) {
      if (required) {
        queue.push({ field: name, reason: 'Campo obbligatorio non trovato nel documento.', confidence: 0, evidence: '' });
      }
      continue;
    }
    if (field.confidence < floor) {
      queue.push({
        field: name,
        reason: `Confidenza ${field.confidence.toFixed(2)} sotto la soglia di ${floor} prevista per questo campo.`,
        confidence: field.confidence,
        evidence: field.evidence,
      });
    }
  }
  return queue;
}

function deriveStatus(queue: ReviewItem[], price: number | null): ProcessingStatus {
  if (queue.length === 0 && price !== null) return 'AUTO_DRAFTED';
  if (queue.some((q) => q.field !== 'PRICE')) return 'NEEDS_REVIEW';
  return 'NEEDS_ESTIMATE';
}
