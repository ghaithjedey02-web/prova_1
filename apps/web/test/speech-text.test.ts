import { describe, expect, it } from 'vitest';
import { sentences, speakable } from '../lib/speech-text';

/**
 * Synthesis reads the reply out loud. Two ways to sound like a machine: read
 * a record id literally, or spell its digits out one by one. Both are wrong;
 * the number should be a number.
 */
describe('speakable', () => {
  it('names the record and leaves the number readable as a number', () => {
    expect(speakable('ORD-10482 è in ritardo')).toBe('ordine 10482 è in ritardo');
    expect(speakable('PRV-2205')).toBe('preventivo 2205');
  });

  it('drops leading zeros so the number is not read as a code', () => {
    expect(speakable('FT-0482')).toBe('fattura 482');
  });

  it('spells the letters of an article code but not its digits', () => {
    expect(speakable('codice SL-4410')).toBe('codice S L 4410');
  });

  it('turns symbols and trade abbreviations into speech', () => {
    expect(speakable('40 pz')).toBe('40 pezzi');
    expect(speakable('58%')).toBe('58 per cento');
    expect(speakable('€ 8.140')).toBe('8140 euro');
    expect(speakable('12 gg')).toBe('12 giorni');
  });

  it('turns a bullet list into sentences rather than reading the dashes', () => {
    expect(speakable('Trovato:\n- quantità\n- consegna')).toBe('Trovato:. quantità. consegna');
  });

  it('leaves ordinary prose untouched', () => {
    const s = 'Il sistema si ferma prima di decidere.';
    expect(speakable(s)).toBe(s);
  });
});

describe('sentences', () => {
  it('splits on sentence ends so the voice can breathe', () => {
    expect(sentences('Ho letto l’ordine. Le fonti non concordano. Decidete voi.')).toEqual([
      'Ho letto l’ordine.',
      'Le fonti non concordano. Decidete voi.',
    ]);
  });

  it('folds a short fragment into its neighbour instead of stuttering', () => {
    expect(sentences('Sì. Il lotto arriva l’undici settembre e la lavorazione parte subito dopo.')).toEqual([
      'Sì. Il lotto arriva l’undici settembre e la lavorazione parte subito dopo.',
    ]);
  });

  it('returns nothing for empty input', () => {
    expect(sentences('   ')).toEqual([]);
  });
});
