export class AIError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly providerId: string,
    readonly retryable: boolean,
    override readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'AIError';
  }
}

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

/** Thrown when a provider returns output we cannot parse into the requested shape. */
export class ExtractionFormatError extends AIError {
  constructor(providerId: string, readonly raw: string) {
    super('Provider returned unparseable structured output', 'EXTRACTION_FORMAT', providerId, true);
    this.name = 'ExtractionFormatError';
  }
}
