import type { NormalizedUsage } from "@/lib/lab-protocol";

export type ProviderEvent =
  | { type: "meta"; requestedModel: string; servedModel: string }
  | { type: "text"; text: string }
  | { type: "usage"; usage: NormalizedUsage }
  | { type: "finish"; reason: "stop" | "length" | "refusal" };

export interface ProviderStreamArgs {
  apiKey: string;
  prompt: string;
  signal: AbortSignal;
}

export type ProviderStreamer = (
  args: ProviderStreamArgs,
) => AsyncGenerator<ProviderEvent>;

export class ProviderError extends Error {
  readonly code: string;
  readonly retryable: boolean;
  readonly failoverEligible: boolean;

  constructor({
    code,
    message,
    retryable = false,
    failoverEligible = true,
  }: {
    code: string;
    message: string;
    retryable?: boolean;
    failoverEligible?: boolean;
  }) {
    super(message);
    this.name = "ProviderError";
    this.code = code;
    this.retryable = retryable;
    this.failoverEligible = failoverEligible;
  }
}

const FAILOVER_STATUSES = new Set([401, 403, 404, 408, 409, 425, 429, 500, 502, 503, 504, 529]);

export function statusIsFailoverEligible(status: number): boolean {
  return FAILOVER_STATUSES.has(status);
}

/** Map an upstream status to a safe, local code. Never forward upstream text. */
export function safeErrorForStatus(status: number): ProviderError {
  if (status === 401 || status === 403) {
    return new ProviderError({
      code: "invalid_key",
      message: "The provider rejected this API key.",
      failoverEligible: true,
    });
  }
  if (status === 429) {
    return new ProviderError({
      code: "rate_limited",
      message: "The provider rate-limited this request.",
      retryable: true,
      failoverEligible: true,
    });
  }
  if (status >= 500) {
    return new ProviderError({
      code: "provider_unavailable",
      message: "The provider is temporarily unavailable.",
      retryable: true,
      failoverEligible: true,
    });
  }
  return new ProviderError({
    code: "provider_rejected",
    message: "The provider rejected this request.",
    failoverEligible: statusIsFailoverEligible(status),
  });
}
