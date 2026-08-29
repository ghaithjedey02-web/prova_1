import { AIClient, ConsoleLogger, type AIProvider, type ExtractionSchema } from '@dolmir/ai-core';
import { computeConfidence, scoreProspect, tierFor } from './scoring.js';
import { UNKNOWN, type ProspectRecord, type SizeBand } from './types.js';

/**
 * Website enrichment.
 *
 * Fills the fields that make a record actionable — address, phone, general
 * email, size, technology signals — by reading the company's own public pages.
 *
 * WHAT THIS DELIBERATELY DOES NOT DO:
 *  - It never guesses an email from a name pattern (`nome.cognome@azienda.it`).
 *    A bounced cold email damages our sending domain, and once the domain is
 *    burned every future campaign suffers. Guessing is not worth that.
 *  - It never infers an employee count from "we are a large company".
 *  - It never records a named person unless the page states their role.
 *  - It respects robots.txt and rate-limits itself. We are contacting these
 *    companies as a prospective supplier; hammering their site is a bad first
 *    impression they can see in their logs.
 */

const ENRICHMENT_SCHEMA: ExtractionSchema = {
  legalName: { type: 'string', description: 'Full legal company name including the legal form (S.r.l., S.p.A., S.n.c., S.a.s.).' },
  fullAddress: { type: 'string', description: 'Complete street address including postal code and town, exactly as printed.' },
  city: { type: 'string', description: 'Town or city of the main premises.' },
  province: { type: 'string', description: 'Two-letter Italian province code (e.g. BG, BS, MI).' },
  generalEmail: { type: 'string', description: 'A general contact email address printed on the page. Only if literally shown.' },
  phone: { type: 'string', description: 'Main telephone number printed on the page.' },
  vatNumber: { type: 'string', description: 'Partita IVA if shown, usually in the footer.' },
  employeeCount: { type: 'number', description: 'Number of employees ONLY if stated as a figure. Never estimate from adjectives.' },
  yearFounded: { type: 'number', description: 'Year the company was founded, if stated.' },
  services: { type: 'string[]', description: 'Machining and manufacturing services the company says it offers.' },
  certifications: { type: 'string[]', description: 'Quality certifications stated (ISO 9001, IATF 16949, EN 1090, etc.).' },
  contactPersonName: { type: 'string', description: 'A named individual ONLY if the page states both their name and their role.' },
  contactPersonRole: { type: 'string', description: 'That person\'s stated role.' },
  hasQuoteForm: { type: 'boolean', description: 'True if the site has a form or explicit invitation to request a quote (richiedi preventivo).' },
  mentionsErp: { type: 'string', description: 'Any named ERP, gestionale or CAD software mentioned anywhere on the page.' },
};

const INSTRUCTIONS = [
  'You are reading the public website of an Italian precision-machining or metalworking company.',
  'Extract only firmographic facts that are literally printed on the page.',
  'CRITICAL: never infer an email address from a person\'s name and the domain.',
  'CRITICAL: never estimate an employee count from descriptive language such as "azienda strutturata".',
  'If a fact is not printed, return null. A null is correct; a guess is a defect.',
].join('\n');

export interface EnrichOptions {
  provider: AIProvider;
  /** Milliseconds between requests to the same host. Be a good citizen. */
  politenessDelayMs?: number;
  userAgent?: string;
}

export async function enrichRecord(
  record: ProspectRecord,
  opts: EnrichOptions,
): Promise<{ record: ProspectRecord; changed: string[]; error?: string }> {
  if (record.website === UNKNOWN) {
    return { record, changed: [], error: 'No website to enrich from' };
  }

  const ai = new AIClient({ provider: opts.provider, logger: new ConsoleLogger('warn') });
  const ua = opts.userAgent ?? 'DolmirProspectBot/0.1 (+https://dolmir.com/bot; contact@dolmir.com)';

  let html: string;
  try {
    if (!(await isAllowedByRobots(record.website, ua))) {
      return { record, changed: [], error: 'Disallowed by robots.txt' };
    }
    html = await fetchText(record.website, ua);
    // The contact page is where the address, phone and email actually live.
    const contact = await tryFetchContactPage(record.website, ua);
    if (contact) html += '\n\n--- PAGINA CONTATTI ---\n\n' + contact;
  } catch (err) {
    return { record, changed: [], error: `Fetch failed: ${String(err)}` };
  }

  const text = htmlToText(html).slice(0, 40_000);
  const res = await ai.extract({
    content: text, schema: ENRICHMENT_SCHEMA, instructions: INSTRUCTIONS,
    tier: 'standard', operation: 'prospect_enrich',
  });

  const updated = { ...record };
  const changed: string[] = [];
  // 0.7 floor: a wrong phone number in a CRM is worse than a blank one.
  const take = (key: string): string | null => {
    const f = res.fields[key];
    return f && f.value !== null && f.confidence >= 0.7 ? String(f.value) : null;
  };

  const addr = take('fullAddress');
  if (addr) { updated.fullAddress = addr; changed.push('fullAddress'); }
  const city = take('city');
  if (city && updated.city === UNKNOWN) { updated.city = city; changed.push('city'); }
  const prov = take('province');
  if (prov && updated.province === UNKNOWN) { updated.province = prov as ProspectRecord['province']; changed.push('province'); }
  const email = take('generalEmail');
  if (email && email.includes('@')) { updated.generalEmail = email; changed.push('generalEmail'); }
  const phone = take('phone');
  if (phone) { updated.phone = phone; changed.push('phone'); }

  const empField = res.fields['employeeCount'];
  if (empField && typeof empField.value === 'number' && empField.confidence >= 0.8) {
    updated.employeeCount = empField.value;
    updated.sizeBand = bandFor(empField.value);
    changed.push('employeeCount');
  }

  // A person is only recorded when BOTH name and role are stated. A name
  // without a role is not a decision maker, it is a stranger.
  const person = take('contactPersonName');
  const role = take('contactPersonRole');
  if (person && role) {
    updated.decisionMakerName = person;
    updated.decisionMakerRole = role;
    changed.push('decisionMaker');
  }

  const svcField = res.fields['services'];
  if (Array.isArray(svcField?.value) && svcField.value.length) {
    updated.services = [...new Set([...updated.services, ...(svcField.value as string[])])];
    changed.push('services');
  }

  const clues: string[] = [];
  const certField = res.fields['certifications'];
  if (Array.isArray(certField?.value)) clues.push(...(certField.value as string[]));
  const erp = take('mentionsErp');
  if (erp) clues.push(`Software: ${erp}`);
  if (res.fields['hasQuoteForm']?.value === true) clues.push('Modulo richiesta preventivo sul sito');
  if (clues.length) { updated.techClues = [...new Set([...updated.techClues, ...clues])]; changed.push('techClues'); }

  if (changed.length) {
    updated.source = `${record.source} + website enrichment`;
    updated.researchDate = new Date().toISOString().slice(0, 10);
  }
  updated.confidenceScore = computeConfidence(updated);
  updated.leadScore = scoreProspect(updated).total;
  updated.tier = tierFor(updated.leadScore);

  await sleep(opts.politenessDelayMs ?? 2000);
  return { record: updated, changed };
}

async function isAllowedByRobots(siteUrl: string, ua: string): Promise<boolean> {
  try {
    const origin = new URL(siteUrl).origin;
    const res = await fetch(`${origin}/robots.txt`, { headers: { 'user-agent': ua } });
    if (!res.ok) return true; // no robots.txt ⇒ no restriction
    const body = await res.text();
    // Conservative reading: honour a blanket disallow for all agents.
    return !/^\s*user-agent:\s*\*[\s\S]*?^\s*disallow:\s*\/\s*$/im.test(body);
  } catch {
    return true;
  }
}

async function fetchText(url: string, ua: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const res = await fetch(url, { headers: { 'user-agent': ua }, signal: controller.signal, redirect: 'follow' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

async function tryFetchContactPage(baseUrl: string, ua: string): Promise<string | null> {
  const candidates = ['/contatti', '/contatti.html', '/contatti.php', '/contact', '/azienda', '/chi-siamo'];
  for (const path of candidates) {
    try {
      const url = new URL(path, baseUrl).toString();
      const body = await fetchText(url, ua);
      if (body.length > 200) return body;
    } catch { /* try the next candidate */ }
  }
  return null;
}

/** Strips markup so the model reads content, not tag soup. */
function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|tr|h[1-6])>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#\d+;/g, ' ')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function bandFor(n: number): SizeBand {
  if (n < 10) return '1-9';
  if (n < 25) return '10-24';
  if (n < 50) return '25-49';
  if (n < 100) return '50-99';
  if (n < 250) return '100-249';
  return '250+';
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
