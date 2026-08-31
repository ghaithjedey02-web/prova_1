/**
 * Turning a written system reply into something a synthesiser reads like a
 * person. Record ids are the whole problem: "ORD-10482" comes out as a string
 * of letters and symbols and instantly sounds like a machine reading a
 * spreadsheet, so ids become words plus digits, symbols become their names,
 * and bullet lists become sentences with real pauses.
 *
 * Pure and dependency-free, so it is unit-tested directly.
 */
/** Record ids read as digits, symbols as words, bullets as pauses. */
export function speakable(text: string): string {
  return text
    .replace(/\*\*/g, '')
    .replace(/^[-–•]\s*/gm, '')
    .replace(/\n+/g, '. ')
    .replace(/\b(ORD|PRV|FT|DOC)-?(\d{3,6})\b/gi, (_m, k: string, n: string) => {
      const kind = { ord: 'ordine', prv: 'preventivo', ft: 'fattura', doc: 'documento' }[k.toLowerCase()] ?? k;
      return `${kind} ${n.split('').join(' ')}`;
    })
    .replace(/\b([A-Z]{2})-(\d{3,5})\b/g, (_m, k: string, n: string) => `${k.split('').join(' ')} ${n.split('').join(' ')}`)
    .replace(/€\s?([\d.,]+)/g, '$1 euro')
    .replace(/(\d+)\s?%/g, '$1 per cento')
    .replace(/\bpz\b/gi, 'pezzi')
    .replace(/\bgg\b/gi, 'giorni')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
