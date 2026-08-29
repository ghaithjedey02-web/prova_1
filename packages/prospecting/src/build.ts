import { buildHypothesis, type SeedCompany } from './hypothesis.js';
import { computeConfidence, scoreProspect, tierFor } from './scoring.js';
import { UNKNOWN, type ProspectRecord, type Province, type SizeBand } from './types.js';

/**
 * Converts a verified seed entry into a full prospect record.
 * Every field the seed does not carry becomes `Unknown` — never a guess.
 */
export function buildRecord(c: SeedCompany, index: number, researchDate: string): ProspectRecord {
  const base: ProspectRecord = {
    id: `PRS-${String(index + 1).padStart(4, '0')}`,
    companyName: c.name,
    industry: 'Metalmeccanica',
    subIndustry: c.sub,
    city: c.city === 'Unknown' ? UNKNOWN : c.city,
    province: (c.province === 'Unknown' ? UNKNOWN : c.province) as Province,
    fullAddress: UNKNOWN,
    website: c.website === 'Unknown' ? UNKNOWN : c.website,
    generalEmail: UNKNOWN,
    decisionMakerName: UNKNOWN,
    decisionMakerRole: UNKNOWN,
    decisionMakerEmail: UNKNOWN,
    phone: UNKNOWN,
    linkedIn: UNKNOWN,
    employeeCount: UNKNOWN,
    sizeBand: UNKNOWN as SizeBand,
    services: c.services,
    techClues: [],
    relevantWorkflow: 'RFQ intake → preventivo',
    hypothesis: buildHypothesis(c),
    estimatedBusinessValueEur: UNKNOWN,
    leadScore: 0,
    tier: 'C',
    confidenceScore: 0,
    source: 'Web search (result summaries)',
    sourceUrl: c.src,
    researchDate,
    outreachStatus: 'Researching',
    contacted: false,
    responded: false,
    meetingBooked: false,
    proposalSent: false,
    isClient: false,
    notes: c.notes,
  };

  base.confidenceScore = computeConfidence(base);
  base.leadScore = scoreProspect(base).total;
  base.tier = tierFor(base.leadScore);
  return base;
}

export function buildAll(companies: SeedCompany[], researchDate: string): ProspectRecord[] {
  return companies
    .map((c, i) => buildRecord(c, i, researchDate))
    .sort((a, b) => b.leadScore - a.leadScore);
}
