import { describe, expect, it } from "vitest";

import type { NormalizedUsage } from "@/lib/lab-protocol";

import {
  findPricing,
  isDeepSeekPeak,
  priceUsage,
} from "./pricing";

const usage = (
  inputTokens: number | null,
  outputTokens: number | null,
  cachedInputTokens: number | null = null,
): NormalizedUsage => ({
  inputTokens,
  outputTokens,
  cachedInputTokens,
  reported: true,
});

describe("findPricing", () => {
  it("finds the configured models", () => {
    expect(findPricing("anthropic", "claude-sonnet-5-5")?.outputPerMTok).toBe(10);
    expect(findPricing("deepseek", "deepseek-flash")?.inputPerMTok).toBe(0.3);
  });

  it("returns null for an unknown model", () => {
    expect(findPricing("deepseek", "deepseek-chat")).toBeNull();
  });
});

describe("isDeepSeekPeak", () => {
  it("is peak on a weekday inside the published windows", () => {
    expect(isDeepSeekPeak(new Date("2026-11-04T01:00:00Z"))).toBe(true);
    expect(isDeepSeekPeak(new Date("2026-11-04T03:59:00Z"))).toBe(true);
    expect(isDeepSeekPeak(new Date("2026-11-04T06:00:00Z"))).toBe(true);
    expect(isDeepSeekPeak(new Date("2026-11-04T09:59:00Z"))).toBe(true);
  });

  it("is off-peak outside the windows", () => {
    expect(isDeepSeekPeak(new Date("2026-11-04T00:59:00Z"))).toBe(false);
    expect(isDeepSeekPeak(new Date("2026-11-04T04:00:00Z"))).toBe(false);
    expect(isDeepSeekPeak(new Date("2026-11-04T10:00:00Z"))).toBe(false);
  });

  it("is off-peak all weekend", () => {
    expect(isDeepSeekPeak(new Date("2026-11-07T02:00:00Z"))).toBe(false); // Saturday
    expect(isDeepSeekPeak(new Date("2026-11-08T07:00:00Z"))).toBe(false); // Sunday
  });
});

describe("priceUsage", () => {
  it("prices Anthropic input and output at list price", () => {
    const result = priceUsage(
      "anthropic",
      "claude-sonnet-5-5",
      usage(1_000_000, 1_000_000),
      new Date("2026-11-04T02:00:00Z"),
    );

    expect(result.costUsd).toBe(12);
    expect(result.pricingPeriod).toBeNull();
  });

  it("charges cached Anthropic input at the cache-read rate", () => {
    const result = priceUsage(
      "anthropic",
      "claude-sonnet-5-5",
      usage(1_000_000, 0, 1_000_000),
      new Date("2026-11-04T02:00:00Z"),
    );

    expect(result.costUsd).toBe(0.2);
  });

  it("prices DeepSeek at peak rates during a weekday window", () => {
    const result = priceUsage(
      "deepseek",
      "deepseek-flash",
      usage(1_000_000, 1_000_000),
      new Date("2026-11-04T02:00:00Z"),
    );

    expect(result.costUsd).toBe(1.5);
    expect(result.pricingPeriod).toBe("peak");
  });

  it("halves DeepSeek rates off-peak", () => {
    const result = priceUsage(
      "deepseek",
      "deepseek-flash",
      usage(1_000_000, 1_000_000),
      new Date("2026-11-04T05:00:00Z"),
    );

    expect(result.costUsd).toBe(0.75);
    expect(result.pricingPeriod).toBe("off-peak");
  });

  it("splits cached and uncached DeepSeek input", () => {
    const result = priceUsage(
      "deepseek",
      "deepseek-flash",
      usage(1_000_000, 0, 500_000),
      new Date("2026-11-04T02:00:00Z"),
    );

    expect(result.costUsd).toBe(0.153);
    expect(result.pricingPeriod).toBe("peak");
  });

  it("returns null when the model or token counts are missing", () => {
    expect(
      priceUsage("deepseek", "unknown", usage(10, 10), new Date()).costUsd,
    ).toBeNull();
    expect(
      priceUsage("anthropic", "claude-sonnet-5-5", usage(null, 10), new Date())
        .costUsd,
    ).toBeNull();
    expect(
      priceUsage("anthropic", "claude-sonnet-5-5", usage(10, null), new Date())
        .costUsd,
    ).toBeNull();
  });

  it("never returns a negative cost when cached exceeds input", () => {
    const result = priceUsage(
      "deepseek",
      "deepseek-flash",
      usage(100, 0, 500),
      new Date("2026-11-04T02:00:00Z"),
    );

    expect(result.costUsd).toBeGreaterThan(0);
  });
});
