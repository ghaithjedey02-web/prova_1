import Anthropic from '@anthropic-ai/sdk';
import { describe, expect, it } from 'vitest';
import { ConsoleError, classifyConsoleError } from '../src/providers/anthropic-console.js';

/**
 * When the model call fails in production, the only thing the visitor may see
 * is a reason code, and the only thing the operator may see is the server log.
 * These assertions pin the mapping from what the SDK throws to those codes —
 * in particular, that a rejected key, a missing model and an empty balance are
 * recognised as configuration (the console goes offline and offers a person)
 * rather than shown as a transient glitch to retry.
 */
const h = new Headers();
const api = (status: number, message: string) =>
  Anthropic.APIError.generate(status, { error: { type: 'error', message } }, message, h);

describe('console error classification', () => {
  it('reads a rejected key as configuration', () => {
    const e = classifyConsoleError(api(401, 'invalid x-api-key'));
    expect(e.reason).toBe('auth');
    expect(e.configuration).toBe(true);
  });

  it('reads an unknown model as configuration', () => {
    const e = classifyConsoleError(api(404, 'model: claude-nope'));
    expect(e.reason).toBe('model');
    expect(e.configuration).toBe(true);
  });

  it('reads an empty balance as billing, a missing workspace as workspace, other 400s as request', () => {
    expect(classifyConsoleError(api(400, 'Your credit balance is too low to access the Anthropic API.')).reason).toBe('billing');
    const ws = classifyConsoleError(api(400, 'anthropic-workspace-id is required when authenticating with an identity-linked API key; send the id of the workspace this request acts in.'));
    expect(ws.reason).toBe('workspace');
    expect(ws.configuration).toBe(true);
    expect(classifyConsoleError(api(400, 'max_tokens: must be positive')).reason).toBe('request');
  });

  it('keeps upstream weather transient', () => {
    expect(classifyConsoleError(api(429, 'rate limited')).reason).toBe('rate');
    expect(classifyConsoleError(api(529, 'overloaded')).reason).toBe('overloaded');
    expect(classifyConsoleError(api(500, 'internal')).reason).toBe('overloaded');
    expect(classifyConsoleError(api(429, 'rate limited')).configuration).toBe(false);
  });

  it('separates timeouts from other connection failures', () => {
    expect(classifyConsoleError(new Anthropic.APIConnectionTimeoutError()).reason).toBe('timeout');
    expect(classifyConsoleError(new Anthropic.APIConnectionError({ message: 'ECONNRESET' })).reason).toBe('network');
  });

  it('passes its own errors through and never loses the message', () => {
    const own = new ConsoleError('billing', 400, 'no credit');
    expect(classifyConsoleError(own)).toBe(own);
    expect(classifyConsoleError(new Error('boom')).message).toBe('boom');
    expect(classifyConsoleError('string').reason).toBe('unknown');
  });
});
