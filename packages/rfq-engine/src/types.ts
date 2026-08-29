/** Domain types for the RFQ → preventivo pipeline. */

export interface InboundEmail {
  id: string;
  receivedAt: string;
  from: string;
  subject: string;
  body: string;
  attachments: { filename: string; sizeBytes: number }[];
}

/** Extracted, confidence-scored view of an RFQ. */
export interface RfqFields {
  customerCompany: string | null;
  contactName: string | null;
  partDescription: string | null;
  partNumber: string | null;
  quantity: number | null;
  material: string | null;
  tolerance: string | null;
  surfaceTreatment: string | null;
  deliveryDeadline: string | null;
  drawingReference: string | null;
  isRecurringOrder: boolean | null;
}

export type FieldName = keyof RfqFields;

export interface ExtractedField<T = unknown> {
  value: T | null;
  confidence: number;
  evidence: string;
}

export type ExtractedRfq = { [K in FieldName]: ExtractedField<RfqFields[K]> };

export type Classification = 'RFQ' | 'ORDER' | 'GENERAL_ENQUIRY' | 'SPAM' | 'OTHER';

export type TriageDecision = 'BID' | 'REVIEW' | 'NO_BID';

export interface Triage {
  decision: TriageDecision;
  reasons: string[];
}

/** A past quote used as a pricing comparable. */
export interface HistoricQuote {
  quoteId: string;
  date: string;
  customerCompany: string;
  partNumber: string | null;
  partDescription: string;
  material: string;
  quantity: number;
  unitPriceEur: number;
  won: boolean | null;
}

export interface Comparable {
  quote: HistoricQuote;
  /** 0..1 similarity against the incoming RFQ. */
  similarity: number;
  matchedOn: string[];
}

export type PriceBasis = 'HISTORIC_COMPARABLE' | 'REQUIRES_TECHNICAL_ESTIMATE';

export interface DraftQuote {
  rfqId: string;
  customerCompany: string | null;
  partDescription: string | null;
  partNumber: string | null;
  quantity: number | null;
  material: string | null;
  deliveryDeadline: string | null;
  priceBasis: PriceBasis;
  /** Null when the draft needs a human technical estimate — by design. */
  suggestedUnitPriceEur: number | null;
  suggestedTotalEur: number | null;
  priceRationale: string[];
  comparables: Comparable[];
  /** Italian-language draft body the preventivista edits and sends. */
  draftBodyIt: string;
}

/** A field the system is not confident enough to use unreviewed. */
export interface ReviewItem {
  field: FieldName | 'PRICE';
  reason: string;
  confidence: number;
  evidence: string;
}

export type ProcessingStatus =
  | 'AUTO_DRAFTED'        // ready for a quick human approval
  | 'NEEDS_REVIEW'        // human must fill or correct fields
  | 'NEEDS_ESTIMATE'      // technically must be priced by a person
  | 'NOT_AN_RFQ';         // routed elsewhere

export interface ProcessedRfq {
  emailId: string;
  receivedAt: string;
  classification: Classification;
  classificationConfidence: number;
  extracted: ExtractedRfq | null;
  triage: Triage | null;
  draft: DraftQuote | null;
  reviewQueue: ReviewItem[];
  status: ProcessingStatus;
  /** Machine processing time. The human time saved is measured separately. */
  processingMs: number;
  costEur: number;
}
