import type { Classification } from '../types.js';
import type { InboundEmail } from '../types.js';

/**
 * Cheap deterministic classification before any model call.
 *
 * Rationale: most inbox traffic is not an RFQ. Spending a model call on every
 * newsletter is a cost line that grows with the client's spam volume and buys
 * nothing. Keyword gating removes the obvious cases for free; genuinely
 * ambiguous mail is where a model call earns its keep.
 */

const RFQ_SIGNALS = [
  /richiest[ao]\s+(?:di\s+)?(?:offerta|preventivo|quotazione)/i,
  /\brdo\b/i, /\brfq\b/i,
  /(?:ci\s+)?(?:potete|potreste|puoi|può)\s+(?:quotare|preventivare)/i,
  /invio\s+disegn/i,
  /preventiv\w+/i,
  /quotazion\w+/i,
  /offerta\s+per/i,
];

const ORDER_SIGNALS = [
  /conferma\s+d['i]\s*ordine/i,
  /ordine\s+n[.°]/i,
  /\bpurchase\s+order\b/i,
  /\bp\.?o\.?\s*n[.°]/i,
];

const SPAM_SIGNALS = [
  /disiscriv|unsubscribe|newsletter|webinar\s+gratuito|promozione\s+esclusiva/i,
  /posizionamento\s+sui\s+motori|seo\s+garantit/i,
];

const DRAWING_EXT = /\.(pdf|dwg|dxf|step|stp|igs|iges)$/i;

export interface ClassificationResult {
  classification: Classification;
  confidence: number;
  signals: string[];
}

export function classify(email: InboundEmail): ClassificationResult {
  const haystack = `${email.subject}\n${email.body}`;
  const signals: string[] = [];

  if (SPAM_SIGNALS.some((r) => r.test(haystack))) {
    return { classification: 'SPAM', confidence: 0.9, signals: ['marketing/newsletter markers'] };
  }

  const orderHits = ORDER_SIGNALS.filter((r) => r.test(haystack)).length;
  const rfqHits = RFQ_SIGNALS.filter((r) => r.test(haystack)).length;
  const hasDrawing = email.attachments.some((a) => DRAWING_EXT.test(a.filename));

  if (orderHits > 0 && orderHits >= rfqHits) {
    signals.push(`${orderHits} order marker(s)`);
    return { classification: 'ORDER', confidence: Math.min(0.95, 0.7 + orderHits * 0.1), signals };
  }

  if (rfqHits > 0) signals.push(`${rfqHits} quotation marker(s)`);
  if (hasDrawing) signals.push('technical drawing attached');

  if (rfqHits > 0 || (hasDrawing && /quant|pezzi|\bpz\b/i.test(haystack))) {
    // Attachments raise confidence: a drawing plus a quotation phrase is about
    // as unambiguous as this domain gets.
    const confidence = Math.min(0.96, 0.55 + rfqHits * 0.13 + (hasDrawing ? 0.15 : 0));
    return { classification: 'RFQ', confidence, signals };
  }

  return { classification: 'GENERAL_ENQUIRY', confidence: 0.5, signals: ['no quotation markers found'] };
}
