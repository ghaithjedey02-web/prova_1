import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { include: ['packages/*/test/**/*.test.ts'], environment: 'node' },
  resolve: { alias: { '@dolmir/ai-core': new URL('./packages/ai-core/src/index.ts', import.meta.url).pathname } },
});
