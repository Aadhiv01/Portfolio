import type { NormalizedUsage, ProviderId } from "@/lib/lab-protocol";

/**
 * Versioned list prices, USD per 1M tokens.
 *
 * Sources checked 2026-11-04:
 * - Anthropic: https://platform.claude.com/docs/en/about-claude/pricing
 * - DeepSeek: https://api-docs.deepseek.com/quick_start/pricing
 *
 * DeepSeek charges peak rates 01:00–04:00 and 06:00–10:00 UTC, Monday–Friday.
 * Off-peak is half. Chinese public holidays are not modelled; the returned
 * period is labelled in telemetry so the estimate is never presented as exact.
 */

export interface PricingEntry {
  provider: ProviderId;
  model: string;
  inputPerMTok: number;
  outputPerMTok: number;
  cachedInputPerMTok: number;
  peakMultiplier: 1 | 0.5 | null;
  verifiedAt: string;
  source: string;
}

export const PRICING: PricingEntry[] = [
  {
    provider: "anthropic",
    model: "claude-sonnet-5-5",
    inputPerMTok: 2,
    outputPerMTok: 10,
    cachedInputPerMTok: 0.2,
    peakMultiplier: null,
    verifiedAt: "2026-11-04",
    source: "https://platform.claude.com/docs/en/about-claude/pricing",
  },
  {
    provider: "deepseek",
    model: "deepseek-flash",
    inputPerMTok: 0.3,
    outputPerMTok: 1.2,
    cachedInputPerMTok: 0.006,
    peakMultiplier: 1,
    verifiedAt: "2026-11-04",
    source: "https://api-docs.deepseek.com/quick_start/pricing",
  },
];

export function findPricing(
  provider: ProviderId,
  model: string,
): PricingEntry | null {
  return (
    PRICING.find((entry) => entry.provider === provider && entry.model === model) ??
    null
  );
}

export function isDeepSeekPeak(at: Date): boolean {
  const day = at.getUTCDay();
  if (day === 0 || day === 6) return false;
  const hour = at.getUTCHours();
  return (hour >= 1 && hour < 4) || (hour >= 6 && hour < 10);
}

export interface PricedUsage {
  costUsd: number | null;
  pricingPeriod: "peak" | "off-peak" | null;
}

export function priceUsage(
  provider: ProviderId,
  model: string,
  usage: NormalizedUsage,
  at: Date,
): PricedUsage {
  const entry = findPricing(provider, model);
  if (!entry) return { costUsd: null, pricingPeriod: null };
  if (usage.inputTokens === null || usage.outputTokens === null) {
    return { costUsd: null, pricingPeriod: null };
  }

  const period =
    entry.peakMultiplier === null
      ? null
      : isDeepSeekPeak(at)
        ? "peak"
        : "off-peak";
  const multiplier =
    period === "off-peak" ? 0.5 : 1;

  const cached = usage.cachedInputTokens ?? 0;
  const uncached = Math.max(usage.inputTokens - cached, 0);
  const cost =
    (uncached * entry.inputPerMTok +
      cached * entry.cachedInputPerMTok +
      usage.outputTokens * entry.outputPerMTok) /
    1_000_000;

  return {
    costUsd: Math.round(cost * multiplier * 1e8) / 1e8,
    pricingPeriod: period,
  };
}
