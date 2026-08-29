import { describe, expect, it } from 'vitest';
import { MockProvider } from '../src/providers/mock.js';
import type { ExtractionSchema } from '../src/types.js';

const schema: ExtractionSchema = {
  customerCompany: { type: 'string', description: 'company', required: true },
  quantity: { type: 'number', description: 'qty', required: true },
  material: { type: 'string', description: 'material' },
};

const provider = new MockProvider();

describe('MockProvider extraction', () => {
  it('returns null with zero confidence when a field is absent', async () => {
    const res = await provider.extract({
      content: 'Buongiorno, avete disponibilità?',
      schema, instructions: '', operation: 'test',
    });
    expect(res.fields['quantity']?.value).toBeNull();
    expect(res.fields['quantity']?.confidence).toBe(0);
  });

  it('never treats the envelope sender address as the company name', async () => {
    const res = await provider.extract({
      content: '[MITTENTE] buyer@acme.example\n[CORPO DEL MESSAGGIO]\nDa: Acme Industriale S.r.l.\nQuantità: 100',
      schema, instructions: '', operation: 'test',
    });
    expect(res.fields['customerCompany']?.value).toBe('Acme Industriale S.r.l.');
  });

  it('does not let a material capture span newlines', async () => {
    const res = await provider.extract({
      content: 'Materiale: acciaio C40\nTolleranze: H7',
      schema, instructions: '', operation: 'test',
    });
    expect(String(res.fields['material']?.value)).toBe('acciaio C40');
  });

  it('parses thousands separators in quantities', async () => {
    const res = await provider.extract({
      content: 'Quantità: 1.200 pezzi', schema, instructions: '', operation: 'test',
    });
    expect(res.fields['quantity']?.value).toBe(1200);
  });

  it('always attaches evidence to any value it reports', async () => {
    const res = await provider.extract({
      content: 'Da: Test S.p.A.\nQuantità: 50', schema, instructions: '', operation: 'test',
    });
    for (const f of Object.values(res.fields)) {
      if (f.value !== null) expect(f.evidence.length).toBeGreaterThan(0);
    }
  });
});
