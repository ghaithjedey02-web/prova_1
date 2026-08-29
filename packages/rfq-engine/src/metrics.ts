import type { ProcessedRfq } from './types.js';

/**
 * Before/after measurement.
 *
 * HONESTY RULE — this is the module most likely to be abused into a lie.
 * `baseline` values must come from the client's own measured numbers, captured
 * during the paid Workflow Audit. They are never our estimates and never
 * industry averages. If we do not have a client's real baseline, we report
 * machine-side facts only (documents processed, fields extracted, review rate)
 * and we say the ROI is not yet measured.
 *
 * A fabricated baseline produces a number the client will eventually check.
 * When they do, we lose the account and the reference.
 */
export interface Baseline {
  /** Client-measured average minutes to prepare one quote today. */
  minutesPerQuoteManual: number;
  /** Client-measured average hours from RFQ arrival to quote sent. */
  responseTimeHoursManual: number;
  /** Client-stated RFQs received per week. */
  rfqsPerWeek: number;
  /** Fully-loaded hourly cost of the person doing this work, EUR. */
  loadedHourlyCostEur: number;
  /** Where each number came from. Required — no unsourced baselines. */
  source: string;
}

export interface AssistedMeasurement {
  /** Human minutes still required per quote, measured during the pilot. */
  minutesPerQuoteAssisted: number;
  /** Measured hours from arrival to quote sent, with the system in place. */
  responseTimeHoursAssisted: number;
}

export interface MachineStats {
  documentsProcessed: number;
  classifiedAsRfq: number;
  autoDrafted: number;
  needsReview: number;
  needsEstimate: number;
  notRfq: number;
  /** Share of RFQs needing no field correction. */
  cleanExtractionRate: number;
  avgProcessingMs: number;
  totalCostEur: number;
}

export function computeMachineStats(results: ProcessedRfq[]): MachineStats {
  const rfqs = results.filter((r) => r.classification === 'RFQ');
  const autoDrafted = rfqs.filter((r) => r.status === 'AUTO_DRAFTED').length;
  const needsReview = rfqs.filter((r) => r.status === 'NEEDS_REVIEW').length;
  const needsEstimate = rfqs.filter((r) => r.status === 'NEEDS_ESTIMATE').length;
  const cleanExtraction = rfqs.filter((r) => !r.reviewQueue.some((q) => q.field !== 'PRICE')).length;

  return {
    documentsProcessed: results.length,
    classifiedAsRfq: rfqs.length,
    autoDrafted,
    needsReview,
    needsEstimate,
    notRfq: results.length - rfqs.length,
    cleanExtractionRate: rfqs.length ? cleanExtraction / rfqs.length : 0,
    avgProcessingMs: results.length
      ? results.reduce((s, r) => s + r.processingMs, 0) / results.length
      : 0,
    totalCostEur: results.reduce((s, r) => s + r.costEur, 0),
  };
}

export interface RoiModel {
  weeklyMinutesSaved: number;
  weeklyHoursSaved: number;
  annualLabourValueEur: number;
  responseTimeReductionHours: number;
  responseTimeReductionPct: number;
  caveats: string[];
}

/**
 * Labour-side ROI only. Deliberately conservative.
 *
 * We do NOT model won-revenue here even though that is the larger prize and the
 * core of our positioning. Win-rate improvement depends on the client's market,
 * their competitors' response times and their pricing — none of which we
 * control or can measure in a pilot. We present it qualitatively in the sales
 * conversation and quantitatively only after a client has real before/after
 * win-rate data of their own. Claiming it earlier would be unfalsifiable.
 */
export function computeRoi(baseline: Baseline, assisted: AssistedMeasurement): RoiModel {
  const minutesSavedPerQuote = Math.max(0, baseline.minutesPerQuoteManual - assisted.minutesPerQuoteAssisted);
  const weeklyMinutesSaved = minutesSavedPerQuote * baseline.rfqsPerWeek;
  const weeklyHoursSaved = weeklyMinutesSaved / 60;
  // 46 working weeks: Italian industry substantially closes in August and over
  // the Christmas period. Using 52 would overstate the benefit by ~12%.
  const annualLabourValueEur = weeklyHoursSaved * baseline.loadedHourlyCostEur * 46;

  const responseTimeReductionHours = Math.max(
    0, baseline.responseTimeHoursManual - assisted.responseTimeHoursAssisted,
  );
  const responseTimeReductionPct = baseline.responseTimeHoursManual > 0
    ? responseTimeReductionHours / baseline.responseTimeHoursManual
    : 0;

  return {
    weeklyMinutesSaved,
    weeklyHoursSaved,
    annualLabourValueEur,
    responseTimeReductionHours,
    responseTimeReductionPct,
    caveats: [
      `Baseline source: ${baseline.source}`,
      'Labour value assumes freed time is redeployed to productive work, not eliminated.',
      'Annualised over 46 working weeks to account for August and December shutdowns.',
      'Excludes any win-rate or revenue effect — not claimed until the client measures it.',
    ],
  };
}
