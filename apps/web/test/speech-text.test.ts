import { describe, expect, it } from 'vitest';
import { speakable } from '../lib/speech-text';

/**
 * Synthesis reads the reply out loud. Record ids read character by character
 * are the single thing that makes a spoken system sound like a machine
 * reading a spreadsheet, so they are rewritten before they reach the voice.
 */
describe('speakable', () => {
  it('reads order ids as a word and its digits', () => {
    expect(speakable('ORD-10482 è in ritardo')).toBe('ordine 1 0 4 8 2 è in ritardo');
  });

  it('names the other record types too', () => {
    expect(speakable('PRV-2205')).toBe('preventivo 2 2 0 5');
    expect(speakable('FT-0482')).toBe('fattura 0 4 8 2');
  });

  it('spells an article code instead of letting it be read as a word', () => {
    expect(speakable('codice SL-4410')).toBe('codice S L 4 4 1 0');
  });

  it('turns symbols and trade abbreviations into speech', () => {
    expect(speakable('40 pz')).toBe('40 pezzi');
    expect(speakable('58%')).toBe('58 per cento');
    expect(speakable('€ 8140')).toBe('8140 euro');
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
