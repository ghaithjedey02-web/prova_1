/**
 * Prospect record schema.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * THE ONE RULE: NEVER FABRICATE.
 * Any field we have not verified against a citable source is the literal string
 * `'Unknown'` or `'Not found'`. Never a plausible guess, never an inferred
 * email pattern, never a "probably the owner" name.
 *
 * This is not pedantry. A cold email to an invented address bounces and damages
 * the sending domain's reputation. A cold call asking for a person who does not
 * work there ends the conversation and the relationship. Fabricated employee
 * counts and revenue figures produce ROI models that collapse on first contact
 * with the prospect. The database is only worth building if it is true.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const UNKNOWN = 'Unknown' as const;
export const NOT_FOUND = 'Not found' as const;
export type Unverified = typeof UNKNOWN | typeof NOT_FOUND;

/** Evidence labels required by our research protocol. */
export type EvidenceLabel = 'CONFIRMED' | 'EVIDENCE-BASED HYPOTHESIS' | 'UNKNOWN';

export type Province = 'BG' | 'BS' | 'CO' | 'CR' | 'LC' | 'LO' | 'MB' | 'MI' | 'MN' | 'PV' | 'SO' | 'VA' | Unverified;

export type SizeBand = '1-9' | '10-24' | '25-49' | '50-99' | '100-249' | '250+' | Unverified;

export type OutreachStatus =
  | 'Not started' | 'Researching' | 'Queued' | 'Contacted'
  | 'Replied' | 'Meeting booked' | 'Discovery done' | 'Audit sold'
  | 'Proposal sent' | 'Won' | 'Lost' | 'Disqualified';

/** The per-company analysis required by the research protocol. */
export interface Hypothesis {
  /** 1. What this company appears to do. */
  whatTheyDo: string;
  /** 2. Where a repetitive workflow may exist. */
  suspectedWorkflow: string;
  /** 3. Why that workflow could be an economic opportunity. */
  economicRationale: string;
  /** 4. What solution could improve it. */
  proposedSolution: string;
  /** 5. What evidence supports this. */
  supportingEvidence: string[];
  /** 6. What must be verified on a discovery call. */
  toVerifyInDiscovery: string[];
  /** 7. Who to contact. */
  whoToContact: string;
  /** 8. What we must NOT assert, because it is only an assumption. */
  doNotClaim: string[];
  label: EvidenceLabel;
}

export interface ProspectRecord {
  id: string;
  companyName: string;
  industry: string;
  subIndustry: string;
  city: string | Unverified;
  province: Province;
  fullAddress: string | Unverified;
  website: string | Unverified;
  generalEmail: string | Unverified;
  decisionMakerName: string | Unverified;
  decisionMakerRole: string | Unverified;
  decisionMakerEmail: string | Unverified;
  phone: string | Unverified;
  linkedIn: string | Unverified;
  employeeCount: number | Unverified;
  sizeBand: SizeBand;
  /** Services the company states it offers. */
  services: string[];
  /** Observed technology signals (ERP, CMS, job ads naming software). */
  techClues: string[];
  relevantWorkflow: string;
  hypothesis: Hypothesis | null;
  estimatedBusinessValueEur: number | Unverified;
  /** 0-100, computed — never hand-entered. */
  leadScore: number;
  tier: 'A' | 'B' | 'C';
  /** 0-1: how much of this record is verified rather than assumed. */
  confidenceScore: number;
  source: string;
  sourceUrl: string;
  researchDate: string;
  outreachStatus: OutreachStatus;
  contacted: boolean;
  responded: boolean;
  meetingBooked: boolean;
  proposalSent: boolean;
  isClient: boolean;
  notes: string;
}

export function isVerified(v: unknown): boolean {
  return typeof v === 'string' ? v !== UNKNOWN && v !== NOT_FOUND && v.length > 0 : v !== undefined && v !== null;
}
