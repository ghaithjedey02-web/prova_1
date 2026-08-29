import { ConfigurationError } from './errors.js';
import { AnthropicProvider } from './providers/anthropic.js';
import { MockProvider } from './providers/mock.js';
import { OpenAICompatibleProvider } from './providers/openai-compatible.js';
import type { AIProvider, ProviderConfig } from './types.js';

export type ProviderName = 'mock' | 'anthropic' | 'openai-compatible';

/**
 * Resolves a provider by name.
 *
 * Provider choice is a per-client setting because each provider is a named
 * GDPR sub-processor in that client's DPA. Changing it must never require a
 * code change — see `docs/architecture/ai-provider-layer.md`.
 */
export function createProvider(name: ProviderName, config: ProviderConfig = {}): AIProvider {
  switch (name) {
    case 'mock': return new MockProvider();
    case 'anthropic': return new AnthropicProvider(config);
    case 'openai-compatible': return new OpenAICompatibleProvider(config);
    default: {
      const exhaustive: never = name;
      throw new ConfigurationError(`Unknown AI provider: ${String(exhaustive)}`);
    }
  }
}

/**
 * Reads the provider from the environment, defaulting to `mock`.
 *
 * Defaulting to mock is intentional: a missing API key should degrade to a
 * runnable, obviously-fake pipeline rather than a crash — which is what makes
 * the sales demo safe to run on any laptop, offline.
 */
export function createProviderFromEnv(): AIProvider {
  const name = (process.env['DOLMIR_AI_PROVIDER'] ?? 'mock') as ProviderName;
  return createProvider(name);
}
