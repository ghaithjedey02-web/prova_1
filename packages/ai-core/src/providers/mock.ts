import type {
  AIProvider, CompletionRequest, CompletionResult,
  ExtractionRequest, ExtractionResult, FieldResult, ProviderCapabilities,
} from '../types.js';

/**
 * Deterministic offline provider.
 *
 * PURPOSE AND HONEST LIMITS — read before demoing this to anyone.
 * This is NOT a simulation of model quality. It is a rule-based stub that lets
 * the full pipeline run with no API key, no network and no cost, so that:
 *   - tests are fast, free and deterministic;
 *   - the sales demo cannot fail because of a flaky connection or a spent quota;
 *   - a prospect's laptop-in-a-meeting-room scenario always works.
 *
 * When showing a prospect, either run against a real provider, or state plainly
 * that this is a scripted walkthrough of the process. Never let a viewer believe
 * heuristic output is model output. That is a lie that costs a client.
 */
export class MockProvider implements AIProvider {
  readonly id = 'mock';
  readonly capabilities: ProviderCapabilities = {
    nativeStructuredOutput: true,
    euRegionAvailable: true,
    maxContextTokens: 200_000,
  };

  async complete(req: CompletionRequest): Promise<CompletionResult> {
    const last = req.messages.at(-1)?.content ?? '';
    return {
      text: `[mock:${req.operation}] ${last.slice(0, 120)}`,
      usage: { inputTokens: estimateTokens(last), outputTokens: 40 },
      providerId: this.id,
      modelId: 'mock-deterministic-v1',
      latencyMs: 1,
      estimatedCostEur: 0,
    };
  }

  async extract(req: ExtractionRequest): Promise<ExtractionResult> {
    const fields: Record<string, FieldResult> = {};
    for (const [name, spec] of Object.entries(req.schema)) {
      fields[name] = HEURISTICS[name]
        ? HEURISTICS[name]!(req.content)
        : { value: null, confidence: 0, evidence: '' };
      // A stub must never claim certainty it cannot have.
      if (fields[name]!.value === null && spec.required) {
        fields[name] = { value: null, confidence: 0, evidence: '' };
      }
    }
    return {
      fields,
      usage: { inputTokens: estimateTokens(req.content), outputTokens: 120 },
      providerId: this.id,
      modelId: 'mock-deterministic-v1',
      latencyMs: 2,
      estimatedCostEur: 0,
    };
  }
}

function estimateTokens(s: string): number {
  return Math.ceil(s.length / 4);
}

function found(value: unknown, evidence: string, confidence: number): FieldResult {
  return { value, confidence, evidence: evidence.trim().slice(0, 160) };
}
const NOT_FOUND: FieldResult = { value: null, confidence: 0, evidence: '' };

function firstMatch(text: string, re: RegExp): RegExpMatchArray | null {
  re.lastIndex = 0;
  return text.match(re);
}

/**
 * Italian-language heuristics for machining RFQs. Intentionally conservative:
 * when a pattern does not match we return NOT_FOUND with confidence 0 so the
 * pipeline routes the field to a human, which is exactly the behaviour we want
 * a real provider to exhibit too.
 */
const HEURISTICS: Record<string, (text: string) => FieldResult> = {
  customerCompany: (t) => {
    // A "Da:" line is only useful when it names a company, not an address —
    // the envelope sender is metadata, not the ragione sociale.
    const labelled = firstMatch(t, /(?:^|\n)[ \t]*(?:Da|From|Azienda|Ragione sociale)[ \t]*:[ \t]*([^\n@]{3,60})(?=\n|$)/i);
    const candidate = labelled?.[1] ? cleanCompany(labelled[1]) : '';
    if (candidate && !candidate.includes('@') && candidate.length > 2) {
      return found(candidate, labelled![0], 0.88);
    }
    // Otherwise look for a legal-form suffix anywhere (signature block, body).
    const sig = firstMatch(t, /([A-ZÀ-Ù][\w'&.\-]*(?:[ ][A-ZÀ-Ù][\w'&.\-]*){0,4}[ ](?:S\.?r\.?l\.?|S\.?p\.?A\.?|S\.?n\.?c\.?|S\.?a\.?s\.?))/);
    return sig?.[1] ? found(sig[1].trim(), sig[0], 0.78) : NOT_FOUND;
  },

  contactName: (t) => {
    const m = firstMatch(t, /(?:Cordiali saluti|Distinti saluti|Saluti|Grazie)[,\s]*\n+\s*([A-ZÀ-Ù][a-zà-ù]+\s+[A-ZÀ-Ù][a-zà-ù]+)/);
    return m?.[1] ? found(m[1], m[0], 0.8) : NOT_FOUND;
  },

  partDescription: (t) => {
    // Deliberately excludes "oggetto": in an email that is the subject line,
    // not the part. Capture stops at the newline — a description never spans lines.
    const m = firstMatch(t, /(?:^|\n)[ \t]*(?:descrizione|particolare|articolo|pezzo|denominazione)[ \t]*:[ \t]*([^\n]{5,90})/i);
    if (m?.[1]) return found(m[1].trim(), m[0], 0.85);
    // Fall back to the subject line with lower confidence, stripping the boilerplate.
    const subj = firstMatch(t, /\[OGGETTO EMAIL\][ \t]*([^\n]{5,90})/i);
    if (!subj?.[1]) return NOT_FOUND;
    const cleaned = subj[1]
      .replace(/^(?:richiest[ao]\s+(?:di\s+)?(?:offerta|preventivo|quotazione)|rdo|rfq|preventivo)\b/i, '')
      .replace(/^[\s\-–:]+/, '')
      .replace(/\bcod\.?\s*[A-Z0-9._\/-]+$/i, '')
      .trim();
    // A subject stripped down to a bare adjective ("urgente") is not a part
    // description. Returning null here is correct: the email genuinely does not
    // say what the part is, and a human must ask.
    const GENERIC = /^(urgente|urgentissimo|veloce|rapido|cortesia|info|informazioni|varie|richiesta|offerta|preventivo)$/i;
    const wordCount = cleaned.split(/\s+/).filter(Boolean).length;
    if (cleaned.length < 5 || GENERIC.test(cleaned) || wordCount < 2) return NOT_FOUND;
    return found(cleaned, subj[0], 0.6);
  },

  partNumber: (t) => {
    const m = firstMatch(t, /(?:codice|cod\.|p\/n|part\s*number|disegno|dis\.)\s*:?\s*([A-Z0-9][A-Z0-9._\/-]{3,24})/i);
    return m?.[1] ? found(m[1], m[0], 0.9) : NOT_FOUND;
  },

  quantity: (t) => {
    const m = firstMatch(t, /(?:quantit[àa]|q\.t[àa]|qty|n[.°]?\s*pezzi|pezzi)\s*:?\s*([\d.']+)/i);
    if (!m?.[1]) return NOT_FOUND;
    const n = Number(m[1].replace(/[.']/g, ''));
    return Number.isFinite(n) ? found(n, m[0], 0.92) : NOT_FOUND;
  },

  material: (t) => {
    // Prefer an explicitly labelled line; capture must not cross a newline.
    const labelled = firstMatch(t, /(?:^|\n)[ \t]*materiale[ \t]*:[ \t]*([^\n]{2,40})/i);
    if (labelled?.[1]) return found(labelled[1].trim(), labelled[0], 0.9);
    const m = firstMatch(
      t,
      /\b((?:acciaio|lamiera)[ ]?(?:inox[ ]?)?(?:AISI[ ]?\d{3}[A-Z]?|C\d{2}|S\d{3})?|inox[ ]?(?:AISI[ ]?)?\d{3}[A-Z]?|AISI[ ]?\d{3}[A-Z]?|alluminio[ ]?\d{0,4}|ottone|bronzo|ghisa|39NiCrMo3|42CrMo4|11SMn30|S235|S355)\b/i,
    );
    return m?.[1] ? found(m[1].trim(), m[0], 0.8) : NOT_FOUND;
  },

  tolerance: (t) => {
    const labelled = firstMatch(t, /(?:^|\n)[ \t]*tolleranze?[ \t]*:[ \t]*([^\n]{2,70})/i);
    if (labelled?.[1]) return found(labelled[1].trim(), labelled[0], 0.85);
    const m = firstMatch(t, /(?:IT\d|±\s*[\d.,]+\s*mm|\bH[6-9]\b)[^\n]{0,40}/i);
    return m?.[0] ? found(m[0].trim(), m[0], 0.7) : NOT_FOUND;
  },

  surfaceTreatment: (t) => {
    const m = firstMatch(t, /\b(zincat\w+|nichelat\w+|anodizzat\w+|brunit\w+|cementat\w+|tempra\w*|verniciat\w+|cataforesi|passivazione)\b/i);
    return m?.[1] ? found(m[1], m[0], 0.82) : NOT_FOUND;
  },

  deliveryDeadline: (t) => {
    const labelled = firstMatch(t, /(?:^|\n)[ \t]*(?:consegna|termine di consegna|scadenza)[ \t]*:[ \t]*([^\n]{3,45})/i);
    if (labelled?.[1]) return found(labelled[1].trim(), labelled[0], 0.85);
    const m = firstMatch(t, /(?:entro il|entro)[ \t]+([^\n]{3,40})/i);
    return m?.[1] ? found(m[1].trim(), m[0], 0.7) : NOT_FOUND;
  },

  drawingReference: (t) => {
    const m = firstMatch(t, /([\w-]{2,30}\.(?:pdf|dwg|dxf|step|stp|igs|iges))/i);
    return m?.[1] ? found(m[1], m[0], 0.95) : NOT_FOUND;
  },

  isRecurringOrder: (t) => {
    const m = firstMatch(t, /\b(fornitura ricorrente|ordine aperto|contratto quadro|come da ordine precedente|riordino|come sempre)\b/i);
    // Absence of any recurrence marker is itself reasonably strong evidence of
    // a one-off request — a low-confidence `false` would flood the review queue.
    return m?.[1] ? found(true, m[0], 0.85) : found(false, '', 0.75);
  },
};

function cleanCompany(s: string): string {
  return s.replace(/<[^>]*>/g, '').replace(/[<>"]/g, '').trim();
}
