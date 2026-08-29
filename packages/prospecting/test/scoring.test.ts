import { describe, expect, it } from 'vitest';
import { buildRecord } from '../src/build.js';
import { computeConfidence, scoreProspect, tierFor } from '../src/scoring.js';
import { UNKNOWN, type ProspectRecord } from '../src/types.js';
import type { SeedCompany } from '../src/hypothesis.js';

const seed: SeedCompany = {
  name: 'Test Meccanica S.r.l.', city: 'Urgnano', province: 'BG',
  website: 'https://example.test', sub: 'Lavorazioni meccaniche conto terzi',
  services: ['tornitura CNC', 'fresatura CNC'], notes: 'Lavora su disegno del cliente.',
  src: 'https://example.test',
};

const record = () => buildRecord(seed, 0, '2026-08-29');

describe('prospect record construction', () => {
  it('never invents contact details', () => {
    const r = record();
    expect(r.generalEmail).toBe(UNKNOWN);
    expect(r.phone).toBe(UNKNOWN);
    expect(r.decisionMakerName).toBe(UNKNOWN);
    expect(r.decisionMakerEmail).toBe(UNKNOWN);
    expect(r.employeeCount).toBe(UNKNOWN);
  });

  it('never labels an unverified hypothesis as CONFIRMED', () => {
    expect(record().hypothesis?.label).toBe('EVIDENCE-BASED HYPOTHESIS');
  });

  it('always records a source URL', () => {
    expect(record().sourceUrl).toBeTruthy();
  });

  it('always states what must not be claimed', () => {
    expect(record().hypothesis!.doNotClaim.length).toBeGreaterThan(0);
  });
});

describe('hypothesis differentiation', () => {
  it('gives prototype shops a different workflow hypothesis than volume shops', () => {
    const proto = buildRecord({ ...seed, services: ['prototipi', 'piccole serie'] }, 0, '2026-08-29');
    const volume = buildRecord({ ...seed, services: ['grandi serie'], notes: 'Tornitura automatica grandi serie.' }, 1, '2026-08-29');
    expect(proto.hypothesis!.suspectedWorkflow).not.toBe(volume.hypothesis!.suspectedWorkflow);
    expect(volume.hypothesis!.proposedSolution).toMatch(/riordini|listini/);
  });

  it('flags that the website was not visited when there is no website', () => {
    const r = buildRecord({ ...seed, website: 'Unknown' }, 0, '2026-08-29');
    expect(r.hypothesis!.doNotClaim.join(' ')).toMatch(/sito/);
  });
});

describe('scoring', () => {
  it('scores made-to-order work higher on pain than repeat volume work', () => {
    const made = scoreProspect(buildRecord({ ...seed, notes: 'Lavora su disegno, prototipi e piccole serie.' }, 0, 'x'));
    const volume = scoreProspect(buildRecord({ ...seed, services: ['tornitura automatica'], notes: 'Produzione di serie ad alto volume.' }, 1, 'x'));
    expect(made.painPotential).toBeGreaterThan(volume.painPotential);
  });

  it('rewards records that are actually actionable', () => {
    const bare = record();
    const rich: ProspectRecord = { ...bare, generalEmail: 'info@example.test', phone: '+39 035 000000', decisionMakerName: 'Mario Rossi', decisionMakerRole: 'Titolare', employeeCount: 30 };
    rich.confidenceScore = computeConfidence(rich);
    expect(scoreProspect(rich).total).toBeGreaterThan(scoreProspect(bare).total);
  });

  it('does not treat an unknown company size as a large one', () => {
    const unknown = scoreProspect({ ...record(), sizeBand: UNKNOWN as ProspectRecord['sizeBand'] });
    const ideal = scoreProspect({ ...record(), sizeBand: '25-49', employeeCount: 35 });
    expect(unknown.economicValue).toBeLessThan(ideal.economicValue);
  });

  it('assigns tiers at the documented thresholds', () => {
    expect(tierFor(70)).toBe('A');
    expect(tierFor(69)).toBe('B');
    expect(tierFor(55)).toBe('B');
    expect(tierFor(54)).toBe('C');
  });

  it('keeps every score within 0-100', () => {
    const s = scoreProspect(record());
    expect(s.total).toBeGreaterThanOrEqual(0);
    expect(s.total).toBeLessThanOrEqual(100);
  });
});
