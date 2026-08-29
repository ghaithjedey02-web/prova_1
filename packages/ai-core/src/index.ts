/**
 * Core entry point — deliberately free of vendor SDK imports.
 *
 * Providers are subpath exports (`@dolmir/ai-core/providers/mock`, etc.) rather
 * than barrel exports. Importing this module must never pull a vendor SDK into
 * the consuming bundle — the marketing site runs the real pipeline in the
 * browser, and a stray `@anthropic-ai/sdk` import would add hundreds of
 * kilobytes to a page that never makes a server call.
 */
export * from './types.js';
export * from './errors.js';
export * from './client.js';
export * from './logger.js';
export { redact, safeSnippet } from './redaction.js';
