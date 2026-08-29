import { describe, expect, it } from 'vitest';
import { redact, safeSnippet } from '../src/redaction.js';

describe('redaction', () => {
  it('removes email addresses', () => {
    expect(redact('scrivi a m.brambilla@tecnoflex.it subito')).toBe('scrivi a [EMAIL] subito');
  });

  it('removes Italian mobile and landline numbers', () => {
    expect(redact('chiama 3351234567')).toBe('chiama [PHONE]');
    expect(redact('tel +39 02 12345678')).toContain('[PHONE]');
  });

  it('removes partita IVA', () => {
    expect(redact('P.IVA 12345678901')).toBe('P.IVA [VAT]');
  });

  it('removes IBAN', () => {
    expect(redact('IT60X0542811101000000123456')).toBe('[IBAN]');
  });

  it('truncates before redacting so no raw prefix leaks', () => {
    const out = safeSnippet('a'.repeat(50) + ' mario@example.com', 20);
    expect(out.length).toBeLessThanOrEqual(20);
    expect(out).not.toContain('@');
  });
});
