import { defineConfig } from 'vitest/config';

const src = (p: string) => new URL(`./packages/${p}`, import.meta.url).pathname;

export default defineConfig({
  test: { include: ['packages/*/test/**/*.test.ts', 'apps/*/test/**/*.test.ts'], environment: 'node' },
  resolve: {
    alias: [
      { find: '@dolmir/ai-core/providers/mock', replacement: src('ai-core/src/providers/mock.ts') },
      { find: '@dolmir/ai-core/registry', replacement: src('ai-core/src/registry.ts') },
      { find: '@dolmir/ai-core', replacement: src('ai-core/src/index.ts') },
    ],
  },
});
