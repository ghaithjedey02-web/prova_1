import { describe, expect, it } from 'vitest';
import { DEMO_TOOLS } from '../src/demo-company.js';

/**
 * The console's grounding layer. If these fail, the model would have nothing
 * true to say about the demo company — so they are part of the test suite.
 */
describe('demo company tools', () => {
  it('lists delayed and at-risk orders', () => {
    const out = DEMO_TOOLS['get_delayed_orders']!.run({});
    const rows = out.data as { id: string; status: string }[];
    expect(rows.map((r) => r.id).sort()).toEqual(['ORD-10482', 'ORD-10488']);
  });

  it('finds order 10482 with its delay reason, even without the prefix', () => {
    const out = DEMO_TOOLS['get_order']!.run({ id: '10482' });
    const row = out.data as { id: string; reason?: string };
    expect(row.id).toBe('ORD-10482');
    expect(row.reason).toMatch(/cancello umano/i);
  });

  it('resolves the customer alias Meccanica Rossi', () => {
    const out = DEMO_TOOLS['get_customer']!.run({ name: 'meccanica rossi' });
    const row = out.data as { name: string };
    expect(row.name).toBe('Officine Rossi S.r.l.');
  });

  it('returns the four conflicts of the difficult order', () => {
    const out = DEMO_TOOLS['get_conflicts']!.run({ order_id: 'ORD-10482' });
    expect((out.data as unknown[]).length).toBe(4);
  });

  it('search_documents surfaces the contradictory attachment', () => {
    const out = DEMO_TOOLS['search_documents']!.run({ query: 'PF-2205' });
    const rows = out.data as { id: string }[];
    expect(rows.some((r) => r.id === 'DOC-PDF-482')).toBe(true);
  });

  it('unknown lookups answer honestly with null, never a guess', () => {
    const out = DEMO_TOOLS['get_order']!.run({ id: 'ORD-99999' });
    expect(out.data).toBeNull();
  });
});
