import { safeSnippet } from './redaction.js';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/** Fields every log line carries. */
export interface LogFields {
  level: LogLevel;
  msg: string;
}

/** Arbitrary structured context merged alongside the base fields. */
export type LogRecord = LogFields & { ts: string } & Record<string, unknown>;

export interface Logger {
  log(record: LogFields & Record<string, unknown>): void;
}

const LEVEL_ORDER: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };

/**
 * Structured JSON lines to stderr. Deliberately dependency-free.
 * Swap for a hosted sink by implementing `Logger` — do not add a logging
 * framework until we have a client who needs one (BUY-before-BUILD, inverted:
 * build nothing before it is needed).
 */
export class ConsoleLogger implements Logger {
  constructor(private readonly minLevel: LogLevel = 'info') {}

  log(record: LogFields & Record<string, unknown>): void {
    if (LEVEL_ORDER[record.level] < LEVEL_ORDER[this.minLevel]) return;
    process.stderr.write(JSON.stringify({ ...record, ts: new Date().toISOString() }) + '\n');
  }
}

export class SilentLogger implements Logger {
  log(): void {}
}

/** Helper for the one thing we most often want to log safely. */
export function snippetField(text: string): string {
  return safeSnippet(text);
}
