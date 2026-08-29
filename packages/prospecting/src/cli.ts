#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createProviderFromEnv } from '@dolmir/ai-core';
import { buildAll } from './build.js';
import { enrichRecord } from './enrich.js';
import { toBriefing, toCsv } from './export.js';
import { scoreProspect } from './scoring.js';
import type { SeedCompany } from './hypothesis.js';
import type { ProspectRecord } from './types.js';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..', '..', '..');
const seedPath = join(repoRoot, 'data', 'prospects', 'seed-companies.json');
const outDir = join(repoRoot, 'out');

function main(): void {
  const cmd = process.argv[2] ?? 'report';
  const seed = JSON.parse(readFileSync(seedPath, 'utf8')) as {
    _meta: { researchDate: string }; companies: SeedCompany[];
  };
  const records = buildAll(seed.companies, seed._meta.researchDate);

  switch (cmd) {
    case 'report': report(records); break;
    case 'export': doExport(records); break;
    case 'top': top(records, Number(process.argv[3] ?? 30)); break;
    case 'enrich': void enrich(records); break;
    default:
      console.error(`Unknown command "${cmd}". Use: report | export | top [n] | enrich`);
      process.exit(1);
  }
}

function report(records: ProspectRecord[]): void {
  const a = records.filter((r) => r.tier === 'A');
  const b = records.filter((r) => r.tier === 'B');
  const c = records.filter((r) => r.tier === 'C');
  const avgConf = records.reduce((s, r) => s + r.confidenceScore, 0) / records.length;

  console.log('\n═══ DOLMIR — Prospect database status ═══\n');
  console.log(`Total records:        ${records.length}`);
  console.log(`  A-Tier (≥70):       ${a.length}`);
  console.log(`  B-Tier (55-69):     ${b.length}`);
  console.log(`  C-Tier (<55):       ${c.length}`);
  console.log(`Average confidence:   ${(avgConf * 100).toFixed(0)}%`);
  console.log('\nField coverage:');
  const fields: [string, (r: ProspectRecord) => boolean][] = [
    ['Website', (r) => r.website !== 'Unknown'],
    ['City', (r) => r.city !== 'Unknown'],
    ['Province', (r) => r.province !== 'Unknown'],
    ['General email', (r) => r.generalEmail !== 'Unknown'],
    ['Phone', (r) => r.phone !== 'Unknown'],
    ['Decision maker', (r) => r.decisionMakerName !== 'Unknown'],
    ['Employee count', (r) => typeof r.employeeCount === 'number'],
  ];
  for (const [label, fn] of fields) {
    const n = records.filter(fn).length;
    const pct = Math.round((n / records.length) * 100);
    const bar = '█'.repeat(Math.round(pct / 5)).padEnd(20, '░');
    console.log(`  ${label.padEnd(16)} ${bar} ${String(n).padStart(3)}/${records.length} (${pct}%)`);
  }

  console.log('\nBy province:');
  const byProv = new Map<string, number>();
  for (const r of records) byProv.set(String(r.province), (byProv.get(String(r.province)) ?? 0) + 1);
  for (const [p, n] of [...byProv.entries()].sort((x, y) => y[1] - x[1])) {
    console.log(`  ${p.padEnd(10)} ${n}`);
  }

  console.log('\n⚠️  Contact fields are 0% by design, not by omission.');
  console.log('   No email, phone or decision-maker name has been invented.');
  console.log('   Run `npm run prospect -- enrich` where outbound HTTP is available.\n');
}

function top(records: ProspectRecord[], n: number): void {
  const selected = records.slice(0, n);
  console.log(`\n═══ TOP ${selected.length} PROSPECTS ═══\n`);
  for (const [i, r] of selected.entries()) {
    const s = scoreProspect(r);
    console.log(`${String(i + 1).padStart(2)}. ${r.companyName.padEnd(38)} ${r.tier} ${String(r.leadScore).padStart(3)}/100  ${String(r.province).padEnd(8)} conf ${(r.confidenceScore * 100).toFixed(0)}%`);
    console.log(`    ${'pain'} ${s.painPotential}/20 · value ${s.economicValue}/20 · auto ${s.automationPotential}/15 · pay ${s.abilityToPay}/10 · access ${s.accessibility}/12 · repeat ${s.workflowRepeatability}/8 · evidence ${s.evidenceQuality}/15`);
  }
  console.log();
}

function doExport(records: ProspectRecord[]): void {
  mkdirSync(outDir, { recursive: true });

  const csvPath = join(outDir, 'prospects.csv');
  writeFileSync(csvPath, toCsv(records), 'utf8');

  const jsonPath = join(outDir, 'prospects.json');
  writeFileSync(jsonPath, JSON.stringify(records, null, 2), 'utf8');

  const briefPath = join(outDir, 'top-30-briefings.md');
  const briefings = [
    '# Top 30 Prospects — Briefing Sheets',
    '',
    '> Ogni scheda è un\'IPOTESI basata sulla descrizione pubblica dell\'azienda,',
    '> non su un problema constatato. Leggere la sezione "Da NON affermare"',
    '> prima di ogni contatto.',
    '',
    ...records.slice(0, 30).map((r, i) => toBriefing(r, i + 1)),
  ].join('\n');
  writeFileSync(briefPath, briefings, 'utf8');

  console.log(`Wrote:\n  ${csvPath}\n  ${jsonPath}\n  ${briefPath}`);
}

async function enrich(records: ProspectRecord[]): Promise<void> {
  const provider = createProviderFromEnv();
  if (provider.id === 'mock') {
    console.error('Refusing to enrich with the mock provider — it would write heuristic');
    console.error('guesses into the CRM as if they were researched facts.');
    console.error('Set DOLMIR_AI_PROVIDER=anthropic (with ANTHROPIC_API_KEY) and retry.');
    process.exit(1);
  }

  const limit = Number(process.argv[3] ?? records.length);
  const targets = records.filter((r) => r.website !== 'Unknown').slice(0, limit);
  console.log(`Enriching ${targets.length} records via ${provider.id}...\n`);

  const enriched: ProspectRecord[] = [];
  let ok = 0;
  let failed = 0;

  for (const [i, rec] of targets.entries()) {
    process.stdout.write(`[${i + 1}/${targets.length}] ${rec.companyName.padEnd(38)}`);
    const res = await enrichRecord(rec, { provider });
    if (res.error) {
      console.log(`  ✗ ${res.error}`);
      failed++;
    } else {
      console.log(`  ✓ ${res.changed.length ? res.changed.join(', ') : 'no new fields'}  → ${res.record.leadScore}/100`);
      ok++;
    }
    enriched.push(res.record);
  }

  mkdirSync(outDir, { recursive: true });
  const path = join(outDir, 'prospects.enriched.json');
  writeFileSync(path, JSON.stringify(enriched, null, 2), 'utf8');
  console.log(`\nEnriched ${ok}, failed ${failed}. Wrote ${path}`);
}

main();
