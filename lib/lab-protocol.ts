/**
 * Wire protocol shared by the Router Lab route handler and its client.
 * Isomorphic: no server-only imports here.
 */

export type Tier = "cheap" | "strong";

export type ProviderId = "anthropic" | "deepseek";

export interface NormalizedUsage {
  inputTokens: number | null;
  outputTokens: number | null;
  cachedInputTokens: number | null;
  reported: boolean;
}

export interface PlanStep {
  provider: ProviderId;
  model: string;
  tier: Tier;
}

export interface Classification {
  tier: Tier;
  score: number;
  confidence: number;
  reasons: string[];
}

export interface ServedModel {
  provider: ProviderId;
  model: string;
  tier: Tier;
}

export interface AttemptResult {
  provider: ProviderId;
  model: string;
  outcome: "ok" | "error" | "aborted";
  elapsedMs: number;
  code?: string;
}

export interface MetricsEvent {
  type: "metrics";
  ttftMs: number | null;
  totalMs: number;
  attempts: AttemptResult[];
  fallbackUsed: boolean;
  substituted: boolean;
  served: ServedModel | null;
  usage: NormalizedUsage;
  costUsd: number | null;
  pricingVersion: string;
  pricingPeriod: "peak" | "off-peak" | null;
  finishReason: "stop" | "length" | "refusal" | "error" | null;
  truncated: boolean;
}

export type LabEvent =
  | {
      type: "meta";
      classifiedTier: Tier;
      plan: PlanStep[];
      classifier: Classification;
      pricingVersion: string;
      substituted: boolean;
    }
  | {
      type: "attempt";
      index: number;
      provider: ProviderId;
      model: string;
      reason: "primary" | "failover";
    }
  | { type: "token"; text: string }
  | MetricsEvent
  | { type: "done" }
  | {
      type: "error";
      code: string;
      message: string;
      retryable: boolean;
      partial: boolean;
    };

export const EMPTY_USAGE: NormalizedUsage = {
  inputTokens: null,
  outputTokens: null,
  cachedInputTokens: null,
  reported: false,
};
