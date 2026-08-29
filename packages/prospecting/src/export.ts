import type { ProspectRecord } from './types.js';

/** CSV export — the format every CRM and Notion import accepts. */
export function toCsv(records: ProspectRecord[]): string {
  const headers = [
    'ID', 'Company Name', 'Industry', 'Sub-industry', 'City', 'Province', 'Full Address',
    'Website', 'General Email', 'Decision Maker Name', 'Decision Maker Role',
    'Decision Maker Email', 'Phone', 'LinkedIn', 'Employee Count', 'Size Band',
    'Services', 'Tech Clues', 'Relevant Workflow', 'Pain Hypothesis',
    'Potential AI Solution', 'Estimated Business Value', 'Lead Score', 'Tier',
    'Confidence Score', 'Evidence Label', 'Source', 'Source URL', 'Research Date',
    'Outreach Status', 'Contacted', 'Responded', 'Meeting', 'Proposal', 'Client', 'Notes',
  ];

  const rows = records.map((r) => [
    r.id, r.companyName, r.industry, r.subIndustry, r.city, r.province, r.fullAddress,
    r.website, r.generalEmail, r.decisionMakerName, r.decisionMakerRole,
    r.decisionMakerEmail, r.phone, r.linkedIn, String(r.employeeCount), r.sizeBand,
    r.services.join('; '), r.techClues.join('; '), r.relevantWorkflow,
    r.hypothesis?.suspectedWorkflow ?? '', r.hypothesis?.proposedSolution ?? '',
    String(r.estimatedBusinessValueEur), String(r.leadScore), r.tier,
    String(r.confidenceScore), r.hypothesis?.label ?? 'UNKNOWN', r.source, r.sourceUrl,
    r.researchDate, r.outreachStatus,
    yn(r.contacted), yn(r.responded), yn(r.meetingBooked), yn(r.proposalSent), yn(r.isClient),
    r.notes,
  ]);

  return [headers, ...rows].map((row) => row.map(csvCell).join(',')).join('\n');
}

function csvCell(v: string): string {
  const s = v ?? '';
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function yn(b: boolean): string {
  return b ? 'Yes' : 'No';
}

/** Markdown briefing sheet — what you actually read before dialling. */
export function toBriefing(r: ProspectRecord, rank: number): string {
  const h = r.hypothesis;
  const lines = [
    `## ${rank}. ${r.companyName} — ${r.tier}-Tier (${r.leadScore}/100)`,
    '',
    `**Dove:** ${r.city}${r.province !== 'Unknown' ? ` (${r.province})` : ''} · **Sito:** ${r.website}`,
    `**Cosa fa:** ${r.subIndustry}`,
    `**Confidenza dati:** ${(r.confidenceScore * 100).toFixed(0)}% · **Fonte:** ${r.sourceUrl}`,
    '',
  ];
  if (h) {
    lines.push(`**Ipotesi [${h.label}]**`, '', `- **Workflow sospetto:** ${h.suspectedWorkflow}`,
      `- **Perché conta:** ${h.economicRationale}`, `- **Cosa proporremmo:** ${h.proposedSolution}`,
      `- **Chi contattare:** ${h.whoToContact}`, '',
      '**Da verificare in discovery:**',
      ...h.toVerifyInDiscovery.map((v) => `- [ ] ${v}`), '',
      '**⚠️ Da NON affermare:**',
      ...h.doNotClaim.map((d) => `- ${d}`), '');
  }
  return lines.join('\n');
}
