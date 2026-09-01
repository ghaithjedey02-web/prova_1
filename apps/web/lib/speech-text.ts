/**
 * Turning a written system reply into something a synthesiser reads like a
 * person.
 *
 * Record ids are the problem: "ORD-10482" read literally comes out as letters
 * and punctuation and instantly sounds like a machine reading a spreadsheet.
 * The fix is to name the record and let the number be a NUMBER — Italian
 * synthesis says "ordine diecimilaquattrocentottantadue" correctly — rather
 * than spelling the digits out one by one, which is the other way to sound
 * like a machine.
 *
 * Article codes keep their letters spelled (SL is not a word) but their digits
 * stay a number: "S L 4410".
 *
 * Pure and dependency-free, so it is unit-tested directly.
 */

const RECORD: Record<string, string> = { ord: 'ordine', prv: 'preventivo', ft: 'fattura', doc: 'documento' };

export function speakable(text: string): string {
  return text
    .replace(/\*\*/g, '')
    .replace(/^[-–•]\s*/gm, '')
    .replace(/\n+/g, '. ')
    // ORD-10482 → "ordine 10482": named, then read as a number.
    .replace(/\b(ORD|PRV|FT|DOC)-?0*(\d{1,6})\b/gi, (_m, k: string, n: string) => `${RECORD[k.toLowerCase()] ?? k} ${n}`)
    // SL-4410 → "S L 4410": letters spelled, digits still a number.
    .replace(/\b([A-Z]{2,3})-(\d{2,6})\b/g, (_m, k: string, n: string) => `${k.split('').join(' ')} ${n}`)
    .replace(/€\s?([\d.]+)(,\d+)?/g, (_m, whole: string) => `${whole.replace(/\./g, '')} euro`)
    .replace(/(\d+)\s?%/g, '$1 per cento')
    .replace(/\bpz\b/gi, 'pezzi')
    .replace(/\bgg\b/gi, 'giorni')
    .replace(/\bq\.tà\b/gi, 'quantità')
    .replace(/\bn\.\s?(\d)/gi, 'numero $1')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Split a reply into utterance-sized pieces at sentence ends.
 *
 * Browser synthesis reads one long string in a flat rush; queued sentences
 * get a real breath between them, which is most of what makes a spoken system
 * sound composed rather than breathless. It also means an interruption stops
 * within a sentence instead of at the end of a paragraph.
 */
export function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?…:])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .reduce<string[]>((out, s) => {
      // Fold very short fragments together: a lone "Sì." between two pauses
      // reads as a stutter, not as emphasis.
      const prev = out[out.length - 1];
      const SHORT = 16;
      if (prev && (s.length < SHORT || prev.length < SHORT)) out[out.length - 1] = `${prev} ${s}`;
      else out.push(s);
      return out;
    }, []);
}
