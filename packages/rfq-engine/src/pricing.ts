/**
 * Per-client shop configuration.
 *
 * ⚠️ COMMERCIAL AND CONTRACTUAL RULE
 * A shop's pricing logic and quote history are its most sensitive commercial
 * asset — arguably more sensitive than its customer list. This structure is
 * loaded per client from that client's own isolated store and must never be
 * shared, pooled, aggregated across clients, or used to train anything.
 * See `docs/strategy/08-risks-and-compliance.md` §3.
 */
export interface ShopProfile {
  clientId: string;
  shopName: string;
  /** Full shop hourly rate in EUR, all-in. */
  hourlyRateEur: number;
  minQuantity: number;
  maxQuantity: number | null;
  /** Materials the shop routinely works. Matched case-insensitively as substrings. */
  materials: string[];
  treatmentsOutsourced: boolean;
  /** Target gross margin applied to comparable-derived prices, 0..1. */
  targetMargin: number;
  /** Standard commercial terms, injected into the draft. */
  paymentTerms: string;
  validityDays: number;
  standardLeadTime: string;
  signatureName: string;
  signatureRole: string;
}

export const EXAMPLE_SHOP: ShopProfile = {
  clientId: 'demo-officina',
  shopName: 'Officina Meccanica Demo S.r.l.',
  hourlyRateEur: 58,
  minQuantity: 10,
  maxQuantity: 20000,
  materials: ['acciaio', 'inox', 'aisi', 'alluminio', 'ottone', 'c40', 's235', '39nicrmo3', '42crmo4'],
  treatmentsOutsourced: true,
  targetMargin: 0.28,
  paymentTerms: 'Bonifico bancario 60 gg d.f.f.m.',
  validityDays: 30,
  standardLeadTime: '3-4 settimane dalla conferma d’ordine',
  signatureName: 'Ufficio Preventivi',
  signatureRole: 'Officina Meccanica Demo S.r.l.',
};

/**
 * Applies quantity scaling to a historic unit price.
 *
 * Deliberately simple and transparent — a log-based scaling curve the owner can
 * understand and override, not a black box. In this business a pricing rule the
 * client cannot explain to their own customer is a rule they will not use.
 */
export function scaleUnitPrice(
  historicUnitPrice: number,
  historicQty: number,
  newQty: number,
  elasticity = 0.12,
): number {
  if (historicQty <= 0 || newQty <= 0) return historicUnitPrice;
  const ratio = newQty / historicQty;
  const factor = Math.pow(ratio, -elasticity); // larger batch ⇒ lower unit price
  return historicUnitPrice * factor;
}
