import type { Comparable, ExtractedRfq, HistoricQuote } from '../types.js';

/**
 * Finds comparable historic quotes.
 *
 * This is the component that makes the product defensible. Anybody can extract
 * fields from an email; the value is in "you quoted this same customer a nearly
 * identical part in March at €14.20 — here is what you charged and whether you
 * won it." That is the shop's own institutional memory, which today lives in one
 * person's head and in a folder of spreadsheets.
 *
 * Deterministic scoring, not embeddings: at a few thousand historic quotes it is
 * fast enough, fully explainable to the client, and adds no vector-store
 * infrastructure before a client needs it.
 */
export function findComparables(
  extracted: ExtractedRfq,
  history: HistoricQuote[],
  limit = 3,
): Comparable[] {
  const scored: Comparable[] = [];

  for (const quote of history) {
    let score = 0;
    const matchedOn: string[] = [];

    const partNumber = extracted.partNumber.value;
    if (partNumber && quote.partNumber && normalise(partNumber) === normalise(quote.partNumber)) {
      score += 0.5;
      matchedOn.push('codice articolo identico');
    }

    const customer = extracted.customerCompany.value;
    if (customer && similarText(customer, quote.customerCompany) > 0.7) {
      score += 0.12;
      matchedOn.push('stesso cliente');
    }

    const description = extracted.partDescription.value;
    if (description) {
      const sim = similarText(description, quote.partDescription);
      if (sim > 0.35) {
        // Description carries the most diagnostic weight after an exact part
        // code: "we have quoted this same kind of part before" is the question
        // a preventivista actually asks.
        score += sim * 0.4;
        matchedOn.push(`descrizione simile (${Math.round(sim * 100)}%)`);
      }
    }

    const material = extracted.material.value;
    if (material && similarText(material, quote.material) > 0.6) {
      score += 0.12;
      matchedOn.push('stesso materiale');
    }

    if (score > 0.2) {
      scored.push({ quote, similarity: Math.min(1, score), matchedOn });
    }
  }

  return scored.sort((a, b) => b.similarity - a.similarity).slice(0, limit);
}

function normalise(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/** Token overlap (Jaccard). Cheap, explainable, adequate for short shop descriptions. */
function similarText(a: string, b: string): number {
  const ta = tokens(a);
  const tb = tokens(b);
  if (ta.size === 0 || tb.size === 0) return 0;
  let shared = 0;
  for (const t of ta) if (tb.has(t)) shared++;
  return shared / (ta.size + tb.size - shared);
}

const STOPWORDS = new Set(['di', 'in', 'da', 'per', 'con', 'il', 'la', 'lo', 'e', 'a', 'srl', 'spa', 'snc', 'sas']);

function tokens(s: string): Set<string> {
  return new Set(
    s.toLowerCase().split(/[^a-zà-ù0-9]+/).filter((t) => t.length > 2 && !STOPWORDS.has(t)),
  );
}
