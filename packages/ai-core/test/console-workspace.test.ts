import { describe, expect, it } from 'vitest';
import { pickWorkspace } from '../src/providers/anthropic-console.js';

describe('workspace resolution for identity-linked keys', () => {
  it('returns null when the identity has no live workspace to act in', () => {
    expect(pickWorkspace([])).toBeNull();
    expect(pickWorkspace([{ id: 'wrkspc_a', archived_at: '2026-01-01' }])).toBeNull();
  });
  it('uses the only live workspace without needing its name', () => {
    expect(pickWorkspace([{ id: 'wrkspc_a', name: 'Anything' }, { id: 'wrkspc_b', archived_at: '2026-01-01' }])).toBe('wrkspc_a');
  });
  it('prefers a workspace named for the product or for production', () => {
    expect(pickWorkspace([{ id: 'wrkspc_a', name: 'Sandbox' }, { id: 'wrkspc_b', name: 'DOLMIR' }])).toBe('wrkspc_b');
    expect(pickWorkspace([{ id: 'wrkspc_a', name: 'Sandbox' }, { id: 'wrkspc_b', name: 'Production' }])).toBe('wrkspc_b');
  });
  it('falls back to the first live workspace when nothing is named', () => {
    expect(pickWorkspace([{ id: 'wrkspc_a', name: 'One' }, { id: 'wrkspc_b', name: 'Two' }])).toBe('wrkspc_a');
  });
});
