/**
 * Base error for all Momo SDK errors.
 */
export class MomoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MomoError";
  }
}

/**
 * Thrown when the Momo API returns a non-2xx status code.
 */
export class MomoApiError extends MomoError {
  constructor(
    message: string,
    public readonly status: number,
    public readonly rawResponse: string
  ) {
    super(message);
    this.name = "MomoApiError";
  }
}

/**
 * Thrown on 401 Unauthorized responses.
 */
export class MomoAuthenticationError extends MomoApiError {
  constructor(rawResponse: string) {
    super("Authentication failed — check your API key", 401, rawResponse);
    this.name = "MomoAuthenticationError";
  }
}

/**
 * Thrown on 429 Too Many Requests responses.
 */
export class MomoRateLimitError extends MomoApiError {
  constructor(
    rawResponse: string,
    public readonly remaining: number,
    public readonly limit: number
  ) {
    super("Rate limit exceeded", 429, rawResponse);
    this.name = "MomoRateLimitError";
  }
}

/**
 * Thrown when a request exceeds the configured timeout.
 */
export class MomoTimeoutError extends MomoError {
  constructor(public readonly timeoutMs: number) {
    super(`Request timed out after ${timeoutMs}ms`);
    this.name = "MomoTimeoutError";
  }
}
