import { describe, expect, it } from 'vitest';
import { MockProvider } from '@dolmir/ai-core/providers/mock';
import { RfqPipeline } from '../src/pipeline.js';
import { EXAMPLE_SHOP } from '../src/pricing.js';
import { classify } from '../src/stages/classify.js';
import { findComparables } from '../src/stages/enrich.js';
import { buildDraft } from '../src/stages/draft.js';
import { triage } from '../src/stages/triage.js';
import type { ExtractedRfq, HistoricQuote, InboundEmail } from '../src/types.js';

const history: HistoricQuote[] = [
  {
    quoteId: 'OFF-1', date: '2026-03-14', customerCompany: 'Tecnoflex Lecco S.r.l.',
    partNumber: 'FL-2280', partDescription: 'flangia tornita con foratura periferica',
    material: 'acciaio C40', quantity: 150, unitPriceEur: 14.2, won: true,
  },
];

function email(over: Partial<InboundEmail> = {}): InboundEmail {
  return {
    id: 'E1', receivedAt: '2026-08-24T08:00:00+02:00',
    from: 'buyer@example.test', subject: 'Richiesta di offerta', body: '',
    attachments: [], ...over,
  };
}

function field<T>(value: T | null, confidence = 0.95) {
  return { value, confidence, evidence: value === null ? '' : String(value) };
}

function extracted(over: Partial<ExtractedRfq> = {}): ExtractedRfq {
  return {
    customerCompany: field('Tecnoflex Lecco S.r.l.'),
    contactName: field('Marco Brambilla'),
    partDescription: field('flangia tornita con foratura periferica'),
    partNumber: field('FL-2280'),
    quantity: field(250),
    material: field('acciaio C40'),
    tolerance: field('H7'),
    surfaceTreatment: field(null),
    deliveryDeadline: field('30 ottobre 2026'),
    drawingReference: field('DIS.pdf'),
    isRecurringOrder: field(false),
    ...over,
  } as ExtractedRfq;
}

describe('classification', () => {
  it('detects an RFQ from Italian quotation language', () => {
    const r = classify(email({ body: 'Vi chiediamo un preventivo per 100 pezzi.' }));
    expect(r.classification).toBe('RFQ');
  });

  it('separates a purchase order from a quotation request', () => {
    const r = classify(email({ subject: "Conferma d'ordine n. 4471/2026", body: 'Confermiamo ordine.' }));
    expect(r.classification).toBe('ORDER');
  });

  it('filters marketing mail before any model call is made', () => {
    const r = classify(email({
      subject: 'Posizionamento sui motori di ricerca garantito',
      body: 'Webinar gratuito. Per disiscriverti clicca qui.',
    }));
    expect(r.classification).toBe('SPAM');
  });

  it('raises confidence when a technical drawing is attached', () => {
    const withDrawing = classify(email({
      body: 'Richiesta di offerta', attachments: [{ filename: 'p.dwg', sizeBytes: 1 }],
    }));
    const without = classify(email({ body: 'Richiesta di offerta' }));
    expect(withDrawing.confidence).toBeGreaterThan(without.confidence);
  });
});

describe('triage', () => {
  it('rejects a batch below the shop minimum', () => {
    const t = triage(extracted({ quantity: field(2) }), EXAMPLE_SHOP);
    expect(t.decision).toBe('NO_BID');
  });

  it('bids when everything is within declared capability', () => {
    expect(triage(extracted(), EXAMPLE_SHOP).decision).toBe('BID');
  });

  it('routes an unknown material to review rather than rejecting it', () => {
    // Losing a real opportunity costs the client far more than a human glance.
    const t = triage(extracted({ material: field('titanio grado 5') }), EXAMPLE_SHOP);
    expect(t.decision).toBe('REVIEW');
  });
});

describe('comparable retrieval', () => {
  it('ranks an exact part-code match highest', () => {
    const c = findComparables(extracted(), history);
    expect(c[0]?.matchedOn).toContain('codice articolo identico');
  });

  it('returns nothing when nothing is genuinely similar', () => {
    const c = findComparables(
      extracted({
        partNumber: field('ZZ-999'), partDescription: field('ingranaggio elicoidale'),
        customerCompany: field('Altra Azienda S.p.A.'), material: field('bronzo'),
      }),
      history,
    );
    expect(c).toHaveLength(0);
  });
});

describe('draft generation', () => {
  it('scales unit price down as batch size rises', () => {
    const d = buildDraft('E1', extracted(), findComparables(extracted(), history), EXAMPLE_SHOP);
    expect(d.priceBasis).toBe('HISTORIC_COMPARABLE');
    expect(d.suggestedUnitPriceEur!).toBeLessThan(14.2);
    expect(d.suggestedUnitPriceEur!).toBeGreaterThan(10);
  });

  it('REFUSES to invent a price when no comparable supports one', () => {
    // The single most important behaviour in the product.
    const e = extracted({ partNumber: field('ZZ-1'), partDescription: field('camma eccentrica'), material: field('bronzo') });
    const d = buildDraft('E1', e, findComparables(e, history), EXAMPLE_SHOP);
    expect(d.suggestedUnitPriceEur).toBeNull();
    expect(d.priceBasis).toBe('REQUIRES_TECHNICAL_ESTIMATE');
    expect(d.draftBodyIt).toContain('[DA DEFINIRE');
  });

  it('warns when the reference quote came from a different customer', () => {
    const e = extracted({ customerCompany: field('Valve Nord S.p.A.'), partNumber: field(null) });
    const d = buildDraft('E1', e, findComparables(e, history), EXAMPLE_SHOP);
    if (d.suggestedUnitPriceEur !== null) {
      expect(d.priceRationale.join(' ')).toMatch(/altro cliente/);
    }
  });

  it('flags a losing reference quote so the price gets reconsidered', () => {
    const lost: HistoricQuote[] = [{ ...history[0]!, won: false }];
    const d = buildDraft('E1', extracted(), findComparables(extracted(), lost), EXAMPLE_SHOP);
    expect(d.priceRationale.join(' ')).toMatch(/NON è stata acquisita/);
  });

  it('never leaves an unfilled field looking filled in the Italian draft', () => {
    const e = extracted({ partDescription: field(null), quantity: field(null) });
    const d = buildDraft('E1', e, [], EXAMPLE_SHOP);
    expect(d.draftBodyIt).toContain('[DESCRIZIONE PARTICOLARE]');
    expect(d.draftBodyIt).toContain('[QUANTITÀ]');
  });
});

describe('end-to-end pipeline', () => {
  const pipeline = new RfqPipeline({ provider: new MockProvider(), shop: EXAMPLE_SHOP, history });

  it('does not quote a purchase order', async () => {
    const r = await pipeline.process(email({ subject: "Conferma d'ordine n. 12", body: 'Confermiamo.' }));
    expect(r.status).toBe('NOT_AN_RFQ');
    expect(r.draft).toBeNull();
    expect(r.costEur).toBe(0);
  });

  it('queues missing required fields for a human', async () => {
    const r = await pipeline.process(email({ body: 'Vi chiediamo un preventivo, grazie.' }));
    expect(r.status).not.toBe('AUTO_DRAFTED');
    expect(r.reviewQueue.length).toBeGreaterThan(0);
  });

  it('produces an approval-ready draft from a complete request', async () => {
    const r = await pipeline.process(email({
      subject: 'Richiesta di offerta - flangia tornita',
      body: [
        'Da: Tecnoflex Lecco S.r.l.',
        'Descrizione: flangia tornita con foratura periferica',
        'Codice: FL-2280', 'Quantità: 250', 'Materiale: acciaio C40',
        'Consegna: entro il 30 ottobre 2026',
      ].join('\n'),
      attachments: [{ filename: 'DIS-FL-2280.pdf', sizeBytes: 1000 }],
    }));
    expect(r.status).toBe('AUTO_DRAFTED');
    expect(r.draft?.suggestedUnitPriceEur).toBeGreaterThan(0);
  });
});
