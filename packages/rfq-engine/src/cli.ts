#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ConsoleLogger, SilentLogger } from '@dolmir/ai-core';
import { createProviderFromEnv } from '@dolmir/ai-core/registry';
import { RfqPipeline } from './pipeline.js';
import { EXAMPLE_SHOP } from './pricing.js';
import { computeMachineStats, computeRoi, type Baseline } from './metrics.js';
import type { HistoricQuote, InboundEmail, ProcessedRfq } from './types.js';

/**
 * The sales demo.
 *
 * Runs offline with the deterministic MockProvider by default so it cannot fail
 * in a meeting room. Set DOLMIR_AI_PROVIDER=anthropic (with ANTHROPIC_API_KEY)
 * to run it against a real model.
 */

const here = dirname(fileURLToPath(import.meta.url));
const fixtures = join(here, '..', 'fixtures');

const C = {
  reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
  red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m',
  blue: '\x1b[34m', cyan: '\x1b[36m',
};

/**
 * DEMO BASELINE — NOT A REAL MEASUREMENT.
 * These numbers are illustrative placeholders for the walkthrough. In a real
 * engagement they are replaced by figures measured during the paid Workflow
 * Audit. The banner below states this to the viewer; do not remove it.
 */
const DEMO_BASELINE: Baseline = {
  minutesPerQuoteManual: 42,
  responseTimeHoursManual: 52,
  rfqsPerWeek: 28,
  loadedHourlyCostEur: 34,
  source: 'ILLUSTRATIVE PLACEHOLDER — replace with audit-measured client data',
};

const DEMO_ASSISTED = { minutesPerQuoteAssisted: 11, responseTimeHoursAssisted: 4 };

async function main(): Promise<void> {
  const verbose = process.argv.includes('--verbose');
  const provider = createProviderFromEnv();

  const emails: InboundEmail[] = JSON.parse(readFileSync(join(fixtures, 'emails.json'), 'utf8'));
  const history: HistoricQuote[] = JSON.parse(readFileSync(join(fixtures, 'history.json'), 'utf8'));

  const pipeline = new RfqPipeline({
    provider,
    shop: EXAMPLE_SHOP,
    history,
    logger: verbose ? new ConsoleLogger('debug') : new SilentLogger(),
  });

  header('DOLMIR — Preventivo Rapido');
  console.log(`${C.dim}Cliente dimostrativo: ${EXAMPLE_SHOP.shopName}${C.reset}`);
  console.log(`${C.dim}Provider AI: ${provider.id}${C.reset}`);
  if (provider.id === 'mock') {
    console.log(
      `${C.yellow}⚠  MockProvider attivo: estrazione con regole deterministiche, non un modello.\n` +
        `   Serve a mostrare il flusso senza rete. Per un test reale: DOLMIR_AI_PROVIDER=anthropic${C.reset}`,
    );
  }
  console.log(`${C.dim}Storico offerte caricate: ${history.length}${C.reset}\n`);

  section('PRIMA — Il processo attuale');
  console.log(`  ${C.dim}1.${C.reset} L'email arriva nella casella commerciale, insieme a tutto il resto.`);
  console.log(`  ${C.dim}2.${C.reset} Qualcuno la apre, la legge, decide se è una richiesta di offerta.`);
  console.log(`  ${C.dim}3.${C.reset} Cerca a memoria se un pezzo simile è già stato quotato.`);
  console.log(`  ${C.dim}4.${C.reset} Ricopia i dati a mano nel foglio preventivi.`);
  console.log(`  ${C.dim}5.${C.reset} Scrive l'offerta e la invia — se non si perde per strada.`);
  console.log(`\n  ${C.bold}Tempo medio dichiarato: ${DEMO_BASELINE.minutesPerQuoteManual} min/preventivo · ` +
    `risposta in ~${DEMO_BASELINE.responseTimeHoursManual} h${C.reset}`);

  section('DOPO — Con Preventivo Rapido');
  const results: ProcessedRfq[] = [];
  for (const email of emails) {
    results.push(await pipeline.process(email));
  }

  for (const r of results) renderResult(r);

  section('RISULTATO MISURATO');
  const stats = computeMachineStats(results);
  console.log(`  Email elaborate:              ${C.bold}${stats.documentsProcessed}${C.reset}`);
  console.log(`  Riconosciute come RdO:        ${C.bold}${stats.classifiedAsRfq}${C.reset}`);
  console.log(`  Scartate automaticamente:     ${C.bold}${stats.notRfq}${C.reset} ${C.dim}(ordine, spam, altro)${C.reset}`);
  console.log(`  Bozza pronta da approvare:    ${C.green}${C.bold}${stats.autoDrafted}${C.reset}`);
  console.log(`  Da completare a mano:         ${C.yellow}${stats.needsReview}${C.reset}`);
  console.log(`  In attesa di stima tecnica:   ${C.yellow}${stats.needsEstimate}${C.reset}`);
  console.log(`  Estrazione senza correzioni:  ${C.bold}${(stats.cleanExtractionRate * 100).toFixed(0)}%${C.reset}`);
  console.log(`  Tempo macchina medio:         ${stats.avgProcessingMs.toFixed(0)} ms/email`);
  console.log(`  Costo modello totale:         €${stats.totalCostEur.toFixed(4)}`);

  section('MODELLO ROI');
  console.log(`${C.red}${C.bold}  ⚠  DATI DIMOSTRATIVI — non misurati presso un cliente reale.${C.reset}`);
  console.log(`${C.dim}     In un progetto vero questi numeri vengono dall'Audit di Processo.${C.reset}\n`);
  const roi = computeRoi(DEMO_BASELINE, DEMO_ASSISTED);
  console.log(`  Tempo umano risparmiato:      ${C.bold}${roi.weeklyHoursSaved.toFixed(1)} h/settimana${C.reset}`);
  console.log(`  Valore annuo del tempo:       ${C.bold}€${Math.round(roi.annualLabourValueEur).toLocaleString('it-IT')}${C.reset}`);
  console.log(`  Tempo di risposta:            ${DEMO_BASELINE.responseTimeHoursManual} h → ` +
    `${C.green}${C.bold}${DEMO_ASSISTED.responseTimeHoursAssisted} h${C.reset} ` +
    `(${(roi.responseTimeReductionPct * 100).toFixed(0)}% in meno)`);
  console.log(`\n${C.dim}  Avvertenze:${C.reset}`);
  for (const c of roi.caveats) console.log(`${C.dim}   · ${c}${C.reset}`);

  section('IL PUNTO');
  console.log('  Nessun preventivo parte senza approvazione umana.');
  console.log('  Il sistema non inventa un prezzo: se non ha una base storica, lo dichiara.');
  console.log('  Il gestionale resta dov\'è.\n');
}

function renderResult(r: ProcessedRfq): void {
  const badge = {
    AUTO_DRAFTED: `${C.green}● BOZZA PRONTA${C.reset}`,
    NEEDS_REVIEW: `${C.yellow}● DA VERIFICARE${C.reset}`,
    NEEDS_ESTIMATE: `${C.yellow}● STIMA TECNICA${C.reset}`,
    NOT_AN_RFQ: `${C.dim}○ NON È UNA RdO${C.reset}`,
  }[r.status];

  console.log(`\n  ${C.bold}${r.emailId}${C.reset}  ${badge}`);

  if (r.status === 'NOT_AN_RFQ') {
    console.log(`    ${C.dim}Classificata come ${r.classification} ` +
      `(confidenza ${(r.classificationConfidence * 100).toFixed(0)}%) → instradata, non quotata.${C.reset}`);
    return;
  }

  const d = r.draft!;
  console.log(`    Cliente:    ${d.customerCompany ?? C.dim + '—' + C.reset}`);
  console.log(`    Particolare: ${d.partDescription ?? C.dim + '—' + C.reset}` +
    (d.partNumber ? ` ${C.dim}(${d.partNumber})${C.reset}` : ''));
  console.log(`    Quantità:   ${d.quantity ?? C.dim + '—' + C.reset}` +
    (d.material ? ` · ${d.material}` : ''));

  if (r.triage) {
    const tc = r.triage.decision === 'BID' ? C.green : r.triage.decision === 'NO_BID' ? C.red : C.yellow;
    console.log(`    Triage:     ${tc}${r.triage.decision}${C.reset} ${C.dim}— ${r.triage.reasons[0]}${C.reset}`);
  }

  if (d.suggestedUnitPriceEur !== null) {
    console.log(`    ${C.green}${C.bold}Prezzo proposto: €${d.suggestedUnitPriceEur.toFixed(2)}/pz ` +
      `→ totale €${d.suggestedTotalEur!.toFixed(2)}${C.reset}`);
  } else {
    console.log(`    ${C.yellow}Prezzo: da definire — nessuna base storica affidabile${C.reset}`);
  }
  for (const line of d.priceRationale) console.log(`      ${C.dim}${line}${C.reset}`);

  if (r.reviewQueue.length) {
    console.log(`    ${C.yellow}Richiede attenzione (${r.reviewQueue.length}):${C.reset}`);
    for (const q of r.reviewQueue) console.log(`      ${C.dim}· ${q.field}: ${q.reason}${C.reset}`);
  }
}

function header(t: string): void {
  console.log(`\n${C.cyan}${C.bold}${'═'.repeat(66)}${C.reset}`);
  console.log(`${C.cyan}${C.bold}  ${t}${C.reset}`);
  console.log(`${C.cyan}${C.bold}${'═'.repeat(66)}${C.reset}\n`);
}

function section(t: string): void {
  console.log(`\n${C.blue}${C.bold}▸ ${t}${C.reset}`);
  console.log(`${C.dim}${'─'.repeat(66)}${C.reset}`);
}

main().catch((err) => {
  console.error(`${C.red}Demo failed:${C.reset}`, err);
  process.exit(1);
});
