import type { NormalizedUsage } from "@/lib/lab-protocol";

import type { ProviderError } from "./providers/types";

export function mergeUsage(
  base: NormalizedUsage,
  next: NormalizedUsage,
): NormalizedUsage {
  return {
    inputTokens: next.inputTokens ?? base.inputTokens,
    outputTokens: next.outputTokens ?? base.outputTokens,
    cachedInputTokens: next.cachedInputTokens ?? base.cachedInputTokens,
    reported: base.reported || next.reported,
  };
}

/** Fixed, local error payloads. Upstream text is never forwarded. */
export function publicError(error: unknown): {
  code: string;
  message: string;
  retryable: boolean;
} {
  if (isProviderError(error)) {
    return {
      code: error.code,
      message: error.message,
      retryable: error.retryable,
    };
  }
  return {
    code: "internal_error",
    message: "The router could not complete this request.",
    retryable: false,
  };
}

function isProviderError(value: unknown): value is ProviderError {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    "message" in value &&
    typeof (value as { code?: unknown }).code === "string"
  );
}

export function delay(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal.addEventListener("abort", onAbort, { once: true });
  });
}
