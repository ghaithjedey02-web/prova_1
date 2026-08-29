import type { Comparable, DraftQuote, ExtractedRfq, PriceBasis } from '../types.js';
import { scaleUnitPrice, type ShopProfile } from '../pricing.js';

/**
 * Produces the draft quote a human then approves.
 *
 * THE CENTRAL DESIGN DECISION OF THIS PRODUCT:
 * when no defensible pricing basis exists, we return `suggestedUnitPriceEur:
 * null` and say so — we do not produce a plausible-looking number.
 *
 * A confident-looking invented price is worse than no price at all: the
 * preventivista would have to check it anyway, so it saves nothing, and the one
 * time it slips through unchecked it costs the client a real margin on a real
 * order. Refusing to guess is what makes the tool trustworthy enough to be used
 * daily, which is the only way it ever produces value.
 */
export function buildDraft(
  rfqId: string,
  extracted: ExtractedRfq,
  comparables: Comparable[],
  shop: ShopProfile,
): DraftQuote {
  const qty = extracted.quantity.value;
  const rationale: string[] = [];

  let priceBasis: PriceBasis = 'REQUIRES_TECHNICAL_ESTIMATE';
  let unitPrice: number | null = null;

  const best = comparables[0];
  // 0.50 is the threshold at which a comparable is close enough to anchor a
  // price rather than merely inform one. Tune per client against their history.
  if (best && best.similarity >= 0.5 && typeof qty === 'number') {
    const scaled = scaleUnitPrice(best.quote.unitPriceEur, best.quote.quantity, qty);
    unitPrice = round2(scaled);
    priceBasis = 'HISTORIC_COMPARABLE';

    rationale.push(
      `Base: offerta ${best.quote.quoteId} del ${formatDateIt(best.quote.date)} — ` +
        `${best.quote.partDescription} per ${best.quote.customerCompany}, ` +
        `${best.quote.quantity} pz a €${best.quote.unitPriceEur.toFixed(2)}/pz.`,
    );
    rationale.push(`Corrispondenza: ${best.matchedOn.join(', ')} (${Math.round(best.similarity * 100)}%).`);
    if (qty !== best.quote.quantity) {
      rationale.push(
        `Prezzo riproporzionato da ${best.quote.quantity} a ${qty} pz → €${unitPrice.toFixed(2)}/pz.`,
      );
    }
    const sameCustomer = best.matchedOn.includes('stesso cliente');
    if (!sameCustomer) {
      rationale.push(
        `⚠️ Riferimento da un altro cliente (${best.quote.customerCompany}): ` +
          'verificare il posizionamento commerciale prima di inviare.',
      );
    }
    if (best.quote.won === false) {
      rationale.push('⚠️ L’offerta di riferimento NON è stata acquisita: valutare un prezzo più competitivo.');
    } else if (best.quote.won === true) {
      rationale.push('✅ L’offerta di riferimento è stata acquisita a questo prezzo.');
    }
  } else if (best) {
    rationale.push(
      `Trovate ${comparables.length} offerte simili ma sotto la soglia di affidabilità ` +
        `(migliore: ${Math.round(best.similarity * 100)}%). Richiesta stima tecnica.`,
    );
  } else {
    rationale.push('Nessuna offerta storica comparabile. Richiesta stima tecnica del reparto.');
  }

  const total = unitPrice !== null && typeof qty === 'number' ? round2(unitPrice * qty) : null;

  return {
    rfqId,
    customerCompany: extracted.customerCompany.value,
    partDescription: extracted.partDescription.value,
    partNumber: extracted.partNumber.value,
    quantity: qty,
    material: extracted.material.value,
    deliveryDeadline: extracted.deliveryDeadline.value,
    priceBasis,
    suggestedUnitPriceEur: unitPrice,
    suggestedTotalEur: total,
    priceRationale: rationale,
    comparables,
    draftBodyIt: renderItalianDraft(extracted, unitPrice, total, shop),
  };
}

/**
 * The Italian draft body.
 *
 * Written to sound like the shop, not like software: plain commercial Italian,
 * no marketing language. Unknown values render as an explicit `[…]` placeholder
 * so a human cannot mistake a gap for a filled field.
 */
function renderItalianDraft(
  e: ExtractedRfq,
  unitPrice: number | null,
  total: number | null,
  shop: ShopProfile,
): string {
  const contact = e.contactName.value ? `Gentile ${e.contactName.value},` : 'Spett.le Cliente,';
  const part = e.partDescription.value ?? '[DESCRIZIONE PARTICOLARE]';
  const code = e.partNumber.value ? ` (cod. ${e.partNumber.value})` : '';
  const qty = e.quantity.value ?? '[QUANTITÀ]';
  const material = e.material.value ? `\nMateriale: ${e.material.value}` : '';
  const treatment = e.surfaceTreatment.value ? `\nTrattamento: ${e.surfaceTreatment.value}` : '';
  const tolerance = e.tolerance.value ? `\nTolleranze: ${e.tolerance.value}` : '';

  const priceBlock =
    unitPrice !== null && total !== null
      ? `Prezzo unitario: € ${unitPrice.toFixed(2)}\nImporto totale: € ${total.toFixed(2)}`
      : 'Prezzo unitario: € [DA DEFINIRE — stima tecnica in corso]\nImporto totale: € [DA DEFINIRE]';

  const delivery = e.deliveryDeadline.value
    ? `Consegna richiesta: ${e.deliveryDeadline.value}\nConsegna proposta: ${shop.standardLeadTime}`
    : `Consegna: ${shop.standardLeadTime}`;

  return [
    contact,
    '',
    'in riferimento alla Vostra richiesta, siamo lieti di sottoporVi la nostra migliore offerta.',
    '',
    `Particolare: ${part}${code}`,
    `Quantità: ${qty} pz${material}${treatment}${tolerance}`,
    '',
    priceBlock,
    '',
    delivery,
    `Pagamento: ${shop.paymentTerms}`,
    `Validità offerta: ${shop.validityDays} giorni`,
    '',
    'Restiamo a disposizione per ogni chiarimento e per eventuali campionature.',
    '',
    'Cordiali saluti,',
    shop.signatureName,
    shop.signatureRole,
  ].join('\n');
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function formatDateIt(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('it-IT');
}
