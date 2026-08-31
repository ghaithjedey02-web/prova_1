import { describe, expect, it } from 'vitest';
import { DEMO_TOOLS, SYSTEM_TOOLS } from '../src/demo-company.js';

/**
 * The console's contract with the model. The two system tools are how DOLMIR
 * says "a person must decide this" and "I do not know" in a form the interface
 * can render as a state — so their shape is part of the product, not a detail.
 */
describe('console tool contract', () => {
  it('every data tool reports a human-readable summary, never a bare count', () => {
    for (const [name, tool] of Object.entries(DEMO_TOOLS)) {
      const args =
        name === 'get_order' ? { id: 'ORD-10482' }
        : name === 'get_customer' ? { name: 'Rossi' }
        : name === 'search_documents' ? { query: 'PF-2205' }
        : {};
      const out = tool.run(args);
      expect(out.summary, name).toBeTruthy();
      expect(out.summary, name).not.toMatch(/^\d+$/);
      expect(out.label, name).toBeTruthy();
    }
  });

  it('an empty result says so in words instead of returning "0"', () => {
    const out = DEMO_TOOLS['get_orders']!.run({ status: 'inesistente' });
    expect(out.summary).toMatch(/nessun/i);
    expect(out.data).toEqual([]);
  });

  it('exposes exactly the two self-knowledge tools', () => {
    expect(Object.keys(SYSTEM_TOOLS).sort()).toEqual(['declare_not_determined', 'request_human_decision']);
  });

  it('the human gate demands options, so the model cannot ask without alternatives', () => {
    const schema = SYSTEM_TOOLS['request_human_decision']!.input_schema as {
      required: string[];
      properties: Record<string, unknown>;
    };
    expect(schema.required).toContain('question');
    expect(schema.required).toContain('options');
  });

  it('NON DETERMINATO demands the list of what is missing', () => {
    const schema = SYSTEM_TOOLS['declare_not_determined']!.input_schema as { required: string[] };
    expect(schema.required).toContain('missing');
  });

  it('no data tool can reach anything outside the demo company', () => {
    const out = DEMO_TOOLS['search_documents']!.run({ query: 'password' });
    expect(out.data).toEqual([]);
  });
});
