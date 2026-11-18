import {
  EMPTY_USAGE,
  type AttemptResult,
  type LabEvent,
  type NormalizedUsage,
  type ProviderId,
  type ServedModel,
} from "@/lib/lab-protocol";

import { classifyPrompt } from "./classifier";
import {
  LIMITS,
  MODELS,
  PRICING_VERSION,
  PROVIDER_ORDER,
} from "./config";
import { priceUsage } from "./pricing";
import { streamAnthropic } from "./providers/anthropic";
import { streamDeepSeek } from "./providers/deepseek";
import {
  ProviderError,
  type ProviderStreamer,
} from "./providers/types";
import { delay, mergeUsage, publicError } from "./telemetry";

export interface RunRouterArgs {
  prompt: string;
  keys: Partial<Record<ProviderId, string>>;
  signal: AbortSignal;
  streamers?: Record<ProviderId, ProviderStreamer>;
  limits?: Partial<typeof LIMITS>;
  now?: () => number;
}

const DEFAULT_STREAMERS: Record<ProviderId, ProviderStreamer> = {
  anthropic: streamAnthropic,
  deepseek: streamDeepSeek,
};

const INITIAL_PLAN_ORDER: ProviderId[] = ["anthropic", "deepseek"];

export async function* runRouter({
  prompt,
  keys,
  signal,
  streamers = DEFAULT_STREAMERS,
  limits = {},
  now = () => performance.now(),
}: RunRouterArgs): AsyncGenerator<LabEvent> {
  const config = { ...LIMITS, ...limits };
  const classification = classifyPrompt(prompt);
  const requestedOrder = PROVIDER_ORDER[classification.tier];

  const plan = INITIAL_PLAN_ORDER.map((provider) => ({
    provider,
    model: MODELS[provider].model,
    tier: MODELS[provider].tier,
  }));

  const available = requestedOrder
    .filter((provider) => Boolean(keys[provider]?.trim()))
    .map((provider) => ({ provider, model: MODELS[provider].model }));

  if (available.length === 0) {
    yield {
      type: "error",
      code: "no_key",
      message: "Add an Anthropic or DeepSeek API key to run the lab.",
      retryable: false,
      partial: false,
    };
    return;
  }

  const substituted = MODELS[available[0].provider].tier !== classification.tier;

  yield {
    type: "meta",
    classifiedTier: classification.tier,
    plan,
    classifier: classification,
    pricingVersion: PRICING_VERSION,
    substituted,
  };

  const startedAt = now();
  let ttftMs: number | null = null;
  let anyText = false;
  let usage: NormalizedUsage = EMPTY_USAGE;
  let served: ServedModel | null = null;
  let finishReason: "stop" | "length" | "refusal" | "error" | null = null;
  let truncated = false;
  let fallbackUsed = false;
  const attempts: AttemptResult[] = [];
  const maxAttempts = Math.min(config.maxAttempts, available.length);

  const finishWithMetrics = function* (
    error?: { code: string; message: string; retryable: boolean; partial: boolean },
  ): Generator<LabEvent> {
    const priced = served
      ? priceUsage(served.provider, served.model, usage, new Date())
      : { costUsd: null, pricingPeriod: null };

    yield {
      type: "metrics",
      ttftMs,
      totalMs: Math.round(now() - startedAt),
      attempts,
      fallbackUsed,
      substituted,
      served,
      usage,
      costUsd: priced.costUsd,
      pricingVersion: PRICING_VERSION,
      pricingPeriod: priced.pricingPeriod,
      finishReason,
      truncated,
    };

    if (error) {
      yield { type: "error", ...error };
      return;
    }

    yield { type: "done" };
  };

  for (let index = 0; index < maxAttempts; index += 1) {
    const { provider, model } = available[index];
    const apiKey = keys[provider]?.trim();
    if (!apiKey) continue;

    if (index > 0) fallbackUsed = true;

    yield {
      type: "attempt",
      index,
      provider,
      model,
      reason: index === 0 ? "primary" : "failover",
    };

    const attemptStart = now();
    const controller = new AbortController();
    let abortReason: "outer" | "timeout" | "idle" | null = null;

    const abortWith = (reason: "outer" | "timeout" | "idle") => {
      abortReason ??= reason;
      controller.abort();
    };
    const onOuterAbort = () => abortWith("outer");

    if (signal.aborted) {
      yield* finishWithMetrics({
        code: "aborted",
        message: "The request was stopped.",
        retryable: false,
        partial: anyText,
      });
      return;
    }

    signal.addEventListener("abort", onOuterAbort, { once: true });
    const totalTimer = setTimeout(() => abortWith("timeout"), config.attemptMs);
    let idleTimer = setTimeout(() => abortWith("idle"), config.idleMs);

    let attemptFailed = false;
    let failure: ProviderError | null = null;

    try {
      const stream = streamers[provider]({
        apiKey,
        prompt,
        signal: controller.signal,
      });

      for await (const event of stream) {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => abortWith("idle"), config.idleMs);

        if (event.type === "meta") {
          served = {
            provider,
            model: event.servedModel,
            tier: MODELS[provider].tier,
          };
          continue;
        }

        if (event.type === "text") {
          if (!event.text) continue;
          if (ttftMs === null) ttftMs = Math.round(now() - attemptStart);
          anyText = true;
          yield { type: "token", text: event.text };
          continue;
        }

        if (event.type === "usage") {
          usage = mergeUsage(usage, event.usage);
          continue;
        }

        if (event.type === "finish") {
          finishReason = event.reason;
        }
      }

      if (!anyText) {
        throw new ProviderError({
          code: "empty_stream",
          message: "The provider returned no text.",
        });
      }
    } catch (error) {
      attemptFailed = true;
      failure =
        error instanceof ProviderError
          ? error
          : new ProviderError({
              code: "provider_error",
              message: "The provider call failed.",
              retryable: true,
            });
    } finally {
      clearTimeout(totalTimer);
      clearTimeout(idleTimer);
      signal.removeEventListener("abort", onOuterAbort);
    }

    const elapsedMs = Math.round(now() - attemptStart);

    if (!attemptFailed) {
      attempts.push({ provider, model: served?.model ?? model, outcome: "ok", elapsedMs });
      yield* finishWithMetrics();
      return;
    }

    if (abortReason === "outer") {
      attempts.push({ provider, model, outcome: "aborted", elapsedMs });
      finishReason = "error";
      yield* finishWithMetrics({
        code: "aborted",
        message: "The request was stopped.",
        retryable: false,
        partial: anyText,
      });
      return;
    }

    if (abortReason === "timeout" || abortReason === "idle") {
      failure = new ProviderError({
        code: "timeout",
        message:
          abortReason === "idle"
            ? "The provider stopped sending data."
            : "The provider took too long to respond.",
        retryable: true,
      });
    }

    const safe = failure ?? new ProviderError({
      code: "provider_error",
      message: "The provider call failed.",
    });

    attempts.push({
      provider,
      model,
      outcome: "error",
      elapsedMs,
      code: safe.code,
    });

    if (anyText) {
      truncated = true;
      finishReason = "error";
      yield* finishWithMetrics({
        code: safe.code,
        message: safe.message,
        retryable: safe.retryable,
        partial: true,
      });
      return;
    }

    const isLast = index === maxAttempts - 1;
    if (isLast || !safe.failoverEligible) {
      finishReason = "error";
      yield* finishWithMetrics({
        ...publicError(safe),
        partial: false,
      });
      return;
    }

    try {
      await delay(250 + Math.floor(Math.random() * 250), signal);
    } catch {
      attempts.push({ provider, model, outcome: "aborted", elapsedMs });
      finishReason = "error";
      yield* finishWithMetrics({
        code: "aborted",
        message: "The request was stopped.",
        retryable: false,
        partial: false,
      });
      return;
    }
  }

  finishReason = "error";
  yield* finishWithMetrics({
    code: "all_providers_failed",
    message: "No provider produced an answer.",
    retryable: false,
    partial: false,
  });
}
