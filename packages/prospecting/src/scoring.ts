import { isVerified, type ProspectRecord } from './types.js';

/**
 * Lead scoring, 0-100.
 *
 * Adjusted from the model originally proposed in the brief. Two changes, both
 * deliberate:
 *
 * 1. **Evidence quality raised from 10 to 15.** With a brand-new database the
 *    dominant failure mode is not mis-ranking a good lead — it is wasting a
 *    week chasing a company we know almost nothing about. Rewarding verified
 *    records makes the score reflect *actionability*, not just attractiveness.
 *
 * 2. **"Competition" (5) removed at the company level.** Competitive intensity
 *    is a property of the vertical, and it is already priced into the vertical
 *    scoring model. Scoring it again per company would double-count it with no
 *    per-company evidence to justify a difference. Its 5 points moved to
 *    Evidence quality and Accessibility.
 *
 * The score is COMPUTED, never hand-entered. A hand-tuned lead score is just
 * someone's mood recorded as a number.
 */

export interface ScoreBreakdown {
  painPotential: number;      // 20
  economicValue: number;      // 20
  automationPotential: number; // 15
  abilityToPay: number;       // 10
  accessibility: number;      // 12
  workflowRepeatability: number; // 8
  evidenceQuality: number;    // 15
  total: number;
}

const WEIGHTS = {
  painPotential: 20, economicValue: 20, automationPotential: 15,
  abilityToPay: 10, accessibility: 12, workflowRepeatability: 8, evidenceQuality: 15,
} as const;

/** Signals in a company's own self-description that correlate with RFQ load. */
const HIGH_PAIN_SIGNALS = [
  'conto terzi', 'su disegno', 'su misura', 'prototipi', 'piccole serie',
  'preventiv', 'personalizzat', 'campionatura',
];
const SCALE_SIGNALS = ['grandi serie', 'grande serie', 'produzione di serie', 'automatica'];
const QUALITY_SIGNALS = ['iso 9001', 'iso', 'certificat', 'iatf', 'en 1090'];

export function scoreProspect(p: ProspectRecord): ScoreBreakdown {
  const text = [p.companyName, p.subIndustry, ...p.services, p.notes].join(' ').toLowerCase();

  // --- Pain potential (20) -------------------------------------------------
  // Made-to-order work means every enquiry is a bespoke quote. That is the pain.
  let pain = 8;
  const painHits = HIGH_PAIN_SIGNALS.filter((s) => text.includes(s)).length;
  pain += Math.min(9, painHits * 3);
  // A pure high-volume repeat producer quotes far less often.
  if (SCALE_SIGNALS.some((s) => text.includes(s)) && painHits === 0) pain -= 4;
  if (p.relevantWorkflow.toLowerCase().includes('rfq')) pain += 3;

  // --- Economic value (20) -------------------------------------------------
  // Driven by size: more people quoting means more hours and more lost orders.
  const value = sizeBandValue(p.sizeBand, p.employeeCount);

  // --- Automation potential (15) -------------------------------------------
  // Email-driven, document-heavy work is what our pipeline handles.
  let automation = 9;
  if (text.match(/disegno|dwg|dxf|step|cad/)) automation += 3;
  if (text.match(/conto terzi|subfornitura/)) automation += 3;

  // --- Ability to pay (10) -------------------------------------------------
  let pay = 4;
  if (QUALITY_SIGNALS.some((s) => text.includes(s))) pay += 2; // certification implies process investment
  pay += sizeBandPay(p.sizeBand, p.employeeCount);

  // --- Accessibility (12) --------------------------------------------------
  // A named decision maker is worth far more than a generic inbox.
  let access = 2;
  if (isVerified(p.website)) access += 3;
  if (isVerified(p.generalEmail)) access += 2;
  if (isVerified(p.phone)) access += 2;
  if (isVerified(p.decisionMakerName)) access += 3;

  // --- Workflow repeatability (8) ------------------------------------------
  // How closely this company matches our beachhead template.
  let repeat = 3;
  if (p.subIndustry.toLowerCase().match(/tornitura|fresatura|lavorazioni meccaniche|meccanica di precisione/)) repeat += 3;
  if (p.subIndustry.toLowerCase().match(/carpenteria|lamiera/)) repeat += 2;

  // --- Evidence quality (15) -----------------------------------------------
  // Rewards records we can actually act on tomorrow.
  const evidence = Math.round(p.confidenceScore * WEIGHTS.evidenceQuality);

  const b: ScoreBreakdown = {
    painPotential: clamp(pain, 0, WEIGHTS.painPotential),
    economicValue: clamp(value, 0, WEIGHTS.economicValue),
    automationPotential: clamp(automation, 0, WEIGHTS.automationPotential),
    abilityToPay: clamp(pay, 0, WEIGHTS.abilityToPay),
    accessibility: clamp(access, 0, WEIGHTS.accessibility),
    workflowRepeatability: clamp(repeat, 0, WEIGHTS.workflowRepeatability),
    evidenceQuality: clamp(evidence, 0, WEIGHTS.evidenceQuality),
    total: 0,
  };
  b.total = b.painPotential + b.economicValue + b.automationPotential + b.abilityToPay +
    b.accessibility + b.workflowRepeatability + b.evidenceQuality;
  return b;
}

export function tierFor(score: number): 'A' | 'B' | 'C' {
  if (score >= 70) return 'A';
  if (score >= 55) return 'B';
  return 'C';
}

/**
 * Confidence: the share of decision-relevant fields we have actually verified.
 * Weighted — a phone number matters more than a LinkedIn URL.
 */
export function computeConfidence(p: ProspectRecord): number {
  const weighted: [boolean, number][] = [
    [isVerified(p.companyName), 1],
    [isVerified(p.website), 2],
    [isVerified(p.city), 1],
    [p.province !== 'Unknown' && p.province !== 'Not found', 1],
    [isVerified(p.fullAddress), 1],
    [isVerified(p.generalEmail), 2],
    [isVerified(p.phone), 2],
    [isVerified(p.decisionMakerName), 3],
    [isVerified(p.decisionMakerEmail), 3],
    [typeof p.employeeCount === 'number', 2],
    [p.services.length > 0, 2],
    [p.techClues.length > 0, 1],
  ];
  const max = weighted.reduce((s, [, w]) => s + w, 0);
  const got = weighted.reduce((s, [ok, w]) => s + (ok ? w : 0), 0);
  return Number((got / max).toFixed(3));
}

function sizeBandValue(band: ProspectRecord['sizeBand'], count: number | string): number {
  const n = typeof count === 'number' ? count : null;
  const effective = n ?? bandMidpoint(band);
  if (effective === null) return 9; // unknown size ⇒ neutral, never optimistic
  if (effective < 10) return 5;     // likely cannot fund a €18k project
  if (effective < 25) return 14;
  if (effective < 50) return 20;    // the sweet spot
  if (effective < 100) return 18;
  if (effective < 250) return 13;   // longer cycle, may have internal IT
  return 8;
}

function sizeBandPay(band: ProspectRecord['sizeBand'], count: number | string): number {
  const n = typeof count === 'number' ? count : bandMidpoint(band);
  if (n === null) return 2;
  if (n < 10) return 0;
  if (n < 25) return 2;
  if (n < 100) return 4;
  return 3;
}

function bandMidpoint(band: ProspectRecord['sizeBand']): number | null {
  switch (band) {
    case '1-9': return 5;
    case '10-24': return 17;
    case '25-49': return 37;
    case '50-99': return 75;
    case '100-249': return 175;
    case '250+': return 400;
    default: return null;
  }
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, Math.round(n)));
}
