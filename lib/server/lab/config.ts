import type { ProviderId, Tier } from "@/lib/lab-protocol";

/**
 * One place for every model ID, endpoint, limit and timeout.
 *
 * Model IDs and prices verified 2026-11-04:
 * - Anthropic: https://platform.claude.com/docs/en/about-claude/pricing
 *   `claude-sonnet-5-5` — $2.00 input / $10.00 output per 1M tokens.
 * - DeepSeek: https://api-docs.deepseek.com/quick_start/pricing
 *   `deepseek-flash` — peak $0.30 input / $1.20 output per 1M tokens;
 *   off-peak is half. `deepseek-chat` is no longer listed.
 *
 * Re-check both before deploying; model IDs drift.
 */
export const PRICING_VERSION = "2026-11-04.1";

export const MODELS: Record<
  ProviderId,
  { model: string; tier: Tier }
> = {
  anthropic: { model: "claude-sonnet-5-5", tier: "strong" },
  deepseek: { model: "deepseek-flash", tier: "cheap" },
};

export const PROVIDER_ORDER: Record<Tier, ProviderId[]> = {
  strong: ["anthropic", "deepseek"],
  cheap: ["deepseek", "anthropic"],
};

export const LIMITS = {
  maxPromptChars: 2_000,
  maxBodyBytes: 10_000,
  maxTokens: 1_024,
  attemptMs: 25_000,
  idleMs: 12_000,
  maxAttempts: 2,
} as const;

export const KEY_HEADERS = {
  anthropic: "x-lab-anthropic-key",
  deepseek: "x-lab-deepseek-key",
} as const;
