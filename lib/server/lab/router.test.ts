import { afterEach, describe, expect, it, vi } from "vitest";

import type {
  LabEvent,
  MetricsEvent,
  NormalizedUsage,
} from "@/lib/lab-protocol";

import { runRouter } from "./router";
import { ProviderError, type ProviderStreamer } from "./providers/types";

const STRONG_PROMPT =
  "Design a multi-region architecture for a payments system with strong consistency and failover. Compare the trade-offs and explain your reasoning.";
const CHEAP_PROMPT = "What is a mutex?";

const usage = (
  inputTokens: number | null,
  outputTokens: number | null,
): NormalizedUsage => ({
  inputTokens,
  outputTokens,
  cachedInputTokens: null,
  reported: true,
});

function okStreamer(
  model: string,
  text: string,
  usageReport: NormalizedUsage,
): ProviderStreamer {
  return async function* () {
    yield { type: "meta", requestedModel: model, servedModel: model };
    yield { type: "text", text };
    yield { type: "usage", usage: usageReport };
    yield { type: "finish", reason: "stop" };
  };
}

function failingStreamer(error: ProviderError): ProviderStreamer {
  return async function* () {
    throw error;
    yield { type: "finish", reason: "stop" };
  };
}

async function collect(
  events: AsyncGenerator<LabEvent>,
): Promise<LabEvent[]> {
  const all: LabEvent[] = [];
  for await (const event of events) all.push(event);
  return all;
}

function clock() {
  let value = 0;
  return () => (value += 10);
}

function metricsOf(events: LabEvent[]): MetricsEvent {
  const metrics = events.find(
    (event): event is MetricsEvent => event.type === "metrics",
  );
  if (!metrics) throw new Error("expected a metrics event");
  return metrics;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("runRouter", () => {
  it("serves a strong prompt from Anthropic first", async () => {
    const streamers = {
      anthropic: okStreamer("claude-sonnet-5-5", "strong answer", usage(10, 5)),
      deepseek: okStreamer("deepseek-flash", "cheap answer", usage(10, 5)),
    };

    const events = await collect(
      runRouter({
        prompt: STRONG_PROMPT,
        keys: { anthropic: "a", deepseek: "d" },
        signal: new AbortController().signal,
        streamers,
        now: clock(),
      }),
    );

    expect(events.map((event) => event.type)).toEqual([
      "meta",
      "attempt",
      "token",
      "metrics",
      "done",
    ]);
    expect(events[0]).toMatchObject({
      type: "meta",
      classifiedTier: "strong",
      substituted: false,
    });

    const metrics = metricsOf(events);
    expect(metrics.served).toEqual({
      provider: "anthropic",
      model: "claude-sonnet-5-5",
      tier: "strong",
    });
    expect(metrics.usage).toEqual(usage(10, 5));
    expect(metrics.costUsd).toBeCloseTo(0.00007, 8);
    expect(metrics.fallbackUsed).toBe(false);
    expect(metrics.finishReason).toBe("stop");
    expect(metrics.attempts).toEqual([
      {
        provider: "anthropic",
        model: "claude-sonnet-5-5",
        outcome: "ok",
        elapsedMs: 20,
      },
    ]);
  });

  it("serves a cheap prompt from DeepSeek first", async () => {
    const streamers = {
      anthropic: okStreamer("claude-sonnet-5-5", "strong answer", usage(10, 5)),
      deepseek: okStreamer("deepseek-flash", "cheap answer", usage(10, 5)),
    };

    const events = await collect(
      runRouter({
        prompt: CHEAP_PROMPT,
        keys: { anthropic: "a", deepseek: "d" },
        signal: new AbortController().signal,
        streamers,
        now: clock(),
      }),
    );

    const attempt = events.find((event) => event.type === "attempt");
    expect(attempt).toMatchObject({ provider: "deepseek", reason: "primary" });
    expect(metricsOf(events).served?.provider).toBe("deepseek");
  });

  it("marks the route as substituted when only the other tier has a key", async () => {
    const streamers = {
      anthropic: okStreamer("claude-sonnet-5-5", "strong answer", usage(10, 5)),
      deepseek: okStreamer("deepseek-flash", "cheap answer", usage(10, 5)),
    };

    const events = await collect(
      runRouter({
        prompt: STRONG_PROMPT,
        keys: { deepseek: "d" },
        signal: new AbortController().signal,
        streamers,
        now: clock(),
      }),
    );

    expect(events[0]).toMatchObject({
      type: "meta",
      classifiedTier: "strong",
      substituted: true,
    });
    expect(events.find((event) => event.type === "attempt")).toMatchObject({
      provider: "deepseek",
      reason: "primary",
    });

    const metrics = metricsOf(events);
    expect(metrics.substituted).toBe(true);
    expect(metrics.served?.tier).toBe("cheap");
  });

  it("fails over to the second provider before any text is sent", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    const streamers = {
      anthropic: failingStreamer(
        new ProviderError({
          code: "provider_unavailable",
          message: "The provider is temporarily unavailable.",
          retryable: true,
        }),
      ),
      deepseek: okStreamer("deepseek-flash", "cheap answer", usage(10, 5)),
    };

    const events = await collect(
      runRouter({
        prompt: STRONG_PROMPT,
        keys: { anthropic: "a", deepseek: "d" },
        signal: new AbortController().signal,
        streamers,
        now: clock(),
      }),
    );

    const attempts = events.filter((event) => event.type === "attempt");
    expect(attempts).toHaveLength(2);
    expect(attempts[1]).toMatchObject({
      provider: "deepseek",
      reason: "failover",
    });

    const metrics = metricsOf(events);
    expect(metrics.fallbackUsed).toBe(true);
    expect(metrics.served?.provider).toBe("deepseek");
    expect(metrics.attempts[0]).toMatchObject({
      provider: "anthropic",
      outcome: "error",
      code: "provider_unavailable",
    });
    expect(events.at(-1)).toEqual({ type: "done" });
  });

  it("keeps partial text and stops when a provider fails mid-stream", async () => {
    const deepseek = vi.fn<ProviderStreamer>(async function* () {
      yield { type: "finish", reason: "stop" } as const;
    });

    const anthropic: ProviderStreamer = async function* () {
      yield {
        type: "meta",
        requestedModel: "claude-sonnet-5-5",
        servedModel: "claude-sonnet-5-5",
      };
      yield { type: "text", text: "partial " };
      throw new ProviderError({
        code: "provider_unavailable",
        message: "The provider is temporarily unavailable.",
        retryable: true,
      });
    };

    const events = await collect(
      runRouter({
        prompt: STRONG_PROMPT,
        keys: { anthropic: "a", deepseek: "d" },
        signal: new AbortController().signal,
        streamers: { anthropic, deepseek },
        now: clock(),
      }),
    );

    expect(deepseek).not.toHaveBeenCalled();
    expect(events.filter((event) => event.type === "attempt")).toHaveLength(1);

    const metrics = metricsOf(events);
    expect(metrics.truncated).toBe(true);
    expect(metrics.finishReason).toBe("error");
    expect(events.at(-1)).toMatchObject({
      type: "error",
      code: "provider_unavailable",
      partial: true,
    });
  });

  it("does not fail over when the error is not failover eligible", async () => {
    const deepseek = vi.fn<ProviderStreamer>(async function* () {
      yield { type: "finish", reason: "stop" } as const;
    });

    const streamers = {
      anthropic: failingStreamer(
        new ProviderError({
          code: "provider_rejected",
          message: "The provider rejected this request.",
          failoverEligible: false,
        }),
      ),
      deepseek,
    };

    const events = await collect(
      runRouter({
        prompt: STRONG_PROMPT,
        keys: { anthropic: "a", deepseek: "d" },
        signal: new AbortController().signal,
        streamers,
        now: clock(),
      }),
    );

    expect(deepseek).not.toHaveBeenCalled();
    expect(events.at(-1)).toMatchObject({
      type: "error",
      code: "provider_rejected",
      partial: false,
    });
    expect(metricsOf(events).fallbackUsed).toBe(false);
  });

  it("stops before calling a provider when no key is present", async () => {
    const anthropic = vi.fn<ProviderStreamer>(async function* () {
      yield { type: "finish", reason: "stop" } as const;
    });
    const deepseek = vi.fn<ProviderStreamer>(async function* () {
      yield { type: "finish", reason: "stop" } as const;
    });

    const events = await collect(
      runRouter({
        prompt: STRONG_PROMPT,
        keys: {},
        signal: new AbortController().signal,
        streamers: { anthropic, deepseek },
        now: clock(),
      }),
    );

    expect(events).toEqual([
      {
        type: "error",
        code: "no_key",
        message: "Add an Anthropic or DeepSeek API key to run the lab.",
        retryable: false,
        partial: false,
      },
    ]);
    expect(anthropic).not.toHaveBeenCalled();
    expect(deepseek).not.toHaveBeenCalled();
  });

  it("reports an abort before the first attempt", async () => {
    const controller = new AbortController();
    controller.abort();

    const events = await collect(
      runRouter({
        prompt: STRONG_PROMPT,
        keys: { anthropic: "a" },
        signal: controller.signal,
        streamers: {
          anthropic: okStreamer("claude-sonnet-5-5", "text", usage(1, 1)),
          deepseek: okStreamer("deepseek-flash", "text", usage(1, 1)),
        },
        now: clock(),
      }),
    );

    expect(events.at(-1)).toMatchObject({
      type: "error",
      code: "aborted",
      partial: false,
    });
    expect(metricsOf(events).served).toBeNull();
  });
});
