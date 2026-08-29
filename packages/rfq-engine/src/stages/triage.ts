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
      reasons.push(`Quantità ${qty} sotto il minimo di lavorazione dell'officina (${shop.minQuantity} pz).`);
      hardFail = true;
    } else if (shop.maxQuantity !== null && qty > shop.maxQuantity) {
      reasons.push(`Quantità ${qty} oltre il lotto massimo abituale (${shop.maxQuantity} pz).`);
      hardFail = true;
    }
  } else {
    reasons.push('Quantità non identificata: impossibile valutare la fattibilità del lotto.');
  }

  const material = extracted.material.value;
  if (typeof material === 'string' && material.length > 0) {
    const normalised = material.toLowerCase();
    const supported = shop.materials.some((m) => normalised.includes(m.toLowerCase()));
    if (!supported) {
      reasons.push(`Materiale "${material}" non presente fra quelli dichiarati: verificare la fattibilità.`);
    }
  } else {
    reasons.push('Materiale non identificato.');
  }

  const treatment = extracted.surfaceTreatment.value;
  if (typeof treatment === 'string' && treatment.length > 0 && !shop.treatmentsOutsourced) {
    reasons.push(`Trattamento "${treatment}" richiesto ma nessun partner esterno configurato.`);
  }

  if (extracted.isRecurringOrder.value === true) {
    reasons.push('Segnalata come fornitura ricorrente o contratto quadro: priorità alta, probabilità di acquisizione superiore.');
  }

  if (hardFail) return { decision: 'NO_BID', reasons };
  if (reasons.length === 0) {
    return { decision: 'BID', reasons: ['Rientra nella capacità dichiarata dell\u2019officina. Nessun ostacolo rilevato.'] };
  }
  return { decision: 'REVIEW', reasons };
}
