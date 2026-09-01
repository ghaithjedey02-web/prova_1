import { describe, expect, it } from 'vitest';
import { SYSTEM } from '../src/providers/anthropic-console.js';

/**
 * The console once behaved like a gatekeeper: it deflected greetings, refused
 * anything it read as off-topic, and used the word "demo" as a reason not to
 * answer. That was not a model limitation — it was written into this prompt.
 *
 * These assertions lock the fix in place. They are coarse on purpose: they
 * guard the PERMISSIONS the prompt grants and the excuses it forbids, which is
 * where that failure lived.
 */
describe('console system prompt', () => {
  it('tells the system to answer a greeting like a person', () => {
    expect(SYSTEM).toMatch(/ciao/i);
    expect(SYSTEM).toMatch(/non trasformare un saluto in un disclaimer/i);
  });

  it('grants it its own expertise, not just tool lookups', () => {
    expect(SYSTEM).toMatch(/ragiona liberamente/i);
    expect(SYSTEM).toMatch(/non richiede strumenti/i);
  });

  it('forbids "sono solo una demo" as an excuse', () => {
    expect(SYSTEM).toMatch(/sono solo una demo/i);
    expect(SYSTEM).toMatch(/scusa per non rispondere/i);
  });

  it('carries no instruction to deflect off-topic questions', () => {
    expect(SYSTEM).not.toMatch(/fuori tema/i);
    expect(SYSTEM).not.toMatch(/riporta la conversazione sul sistema/i);
  });

  it('still binds every demo-company fact to a tool', () => {
    expect(SYSTEM).toMatch(/DEVE venire da uno strumento/);
    expect(SYSTEM).toMatch(/Mai inventare un record/i);
  });

  it('still requires the human gate and the not-determined declaration', () => {
    expect(SYSTEM).toMatch(/request_human_decision/);
    expect(SYSTEM).toMatch(/declare_not_determined/);
    expect(SYSTEM).toMatch(/non scegliere al posto della persona/i);
  });

  it('still refuses to promise commercial numbers it does not have', () => {
    expect(SYSTEM).toMatch(/non promettere risultati commerciali/i);
  });
});
