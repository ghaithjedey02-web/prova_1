import type { ExtractedRfq, Triage } from '../types.js';
import type { ShopProfile } from '../pricing.js';

/**
 * Bid / no-bid triage against the shop's stated capability.
 *
 * This exists because the highest-value minute we save is not the minute spent
 * writing a quote — it is the hour spent quoting a job the shop was never going
 * to win or never should have taken. Owners recognise this problem immediately,
 * which makes it a good discovery-call talking point.
 *
 * Note the asymmetry: we say NO_BID only on hard capability limits, and route
 * everything else to REVIEW. Wrongly discarding a real opportunity is far more
 * expensive to the client than a redundant human glance.
 */
export function triage(extracted: ExtractedRfq, shop: ShopProfile): Triage {
  const reasons: string[] = [];
  let hardFail = false;

  const qty = extracted.quantity.value;
  if (typeof qty === 'number') {
    if (qty < shop.minQuantity) {
      reasons.push(`Quantity ${qty} is below the shop minimum of ${shop.minQuantity}.`);
      hardFail = true;
    } else if (shop.maxQuantity !== null && qty > shop.maxQuantity) {
      reasons.push(`Quantity ${qty} exceeds the typical batch ceiling of ${shop.maxQuantity}.`);
      hardFail = true;
    }
  } else {
    reasons.push('Quantity not identified — cannot assess batch fit.');
  }

  const material = extracted.material.value;
  if (typeof material === 'string' && material.length > 0) {
    const normalised = material.toLowerCase();
    const supported = shop.materials.some((m) => normalised.includes(m.toLowerCase()));
    if (!supported) {
      reasons.push(`Material "${material}" is not in the shop's declared list — verify feasibility.`);
    }
  } else {
    reasons.push('Material not identified.');
  }

  const treatment = extracted.surfaceTreatment.value;
  if (typeof treatment === 'string' && treatment.length > 0 && !shop.treatmentsOutsourced) {
    reasons.push(`Surface treatment "${treatment}" requested but no outsourcing partner configured.`);
  }

  if (extracted.isRecurringOrder.value === true) {
    reasons.push('Flagged as a repeat/framework order — prioritise: higher win probability.');
  }

  if (hardFail) return { decision: 'NO_BID', reasons };
  if (reasons.length === 0) {
    return { decision: 'BID', reasons: ['Within declared shop capability; no blockers found.'] };
  }
  return { decision: 'REVIEW', reasons };
}
