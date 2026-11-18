import { readSseFrames } from "@/lib/lab-sse";
import type { NormalizedUsage } from "@/lib/lab-protocol";

import { LIMITS, MODELS } from "../config";
import {
  ProviderError,
  safeErrorForStatus,
  type ProviderEvent,
  type ProviderStreamArgs,
} from "./types";

interface DeepSeekUsage {
  prompt_tokens?: number;
  completion_tokens?: number;
  prompt_cache_hit_tokens?: number;
  prompt_tokens_details?: { cached_tokens?: number };
}

function normalizeUsage(usage: DeepSeekUsage): NormalizedUsage {
  const cached =
    usage.prompt_cache_hit_tokens ??
    usage.prompt_tokens_details?.cached_tokens ??
    null;

  return {
    inputTokens:
      typeof usage.prompt_tokens === "number" ? usage.prompt_tokens : null,
    outputTokens:
      typeof usage.completion_tokens === "number"
        ? usage.completion_tokens
        : null,
    cachedInputTokens: cached,
    reported: true,
  };
}

function mapFinishReason(
  reason: string | null | undefined,
): "stop" | "length" | "refusal" | null {
  if (reason === "length") return "length";
  if (reason === "content_filter") return "refusal";
  if (reason === "stop") return "stop";
  return null;
}

export async function* streamDeepSeek({
  apiKey,
  prompt,
  signal,
}: ProviderStreamArgs): AsyncGenerator<ProviderEvent> {
  const requestedModel = MODELS.deepseek.model;

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: requestedModel,
      max_tokens: LIMITS.maxTokens,
      stream: true,
      stream_options: { include_usage: true },
      messages: [{ role: "user", content: prompt }],
    }),
    signal,
    cache: "no-store",
  });

  if (!response.ok) throw safeErrorForStatus(response.status);

  const contentType = response.headers.get("content-type") ?? "";
  if (!response.body || !contentType.includes("text/event-stream")) {
    throw new ProviderError({
      code: "bad_stream",
      message: "The provider did not return a stream.",
    });
  }

  let servedModel = requestedModel;
  let finish: "stop" | "length" | "refusal" | null = null;
  let sawChunk = false;
  let sawDone = false;

  for await (const frame of readSseFrames(response.body, signal)) {
    if (frame.data === "[DONE]") {
      sawDone = true;
      break;
    }
    if (!frame.data) continue;

    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(frame.data) as Record<string, unknown>;
    } catch {
      continue;
    }

    if (typeof payload.error === "object" && payload.error !== null) {
      throw new ProviderError({
        code: "provider_error",
        message: "The provider returned an error.",
        retryable: true,
      });
    }

    if (!sawChunk) {
      sawChunk = true;
      if (typeof payload.model === "string") servedModel = payload.model;
      yield { type: "meta", requestedModel, servedModel };
    }

    if (typeof payload.usage === "object" && payload.usage !== null) {
      yield {
        type: "usage",
        usage: normalizeUsage(payload.usage as DeepSeekUsage),
      };
    }

    const choices = Array.isArray(payload.choices) ? payload.choices : [];
    const choice = choices[0] as Record<string, unknown> | undefined;
    if (!choice) continue;

    const delta = (choice.delta ?? {}) as Record<string, unknown>;
    if (typeof delta.content === "string" && delta.content.length > 0) {
      yield { type: "text", text: delta.content };
    }

    const mapped = mapFinishReason(choice.finish_reason as string | null);
    if (mapped) finish = mapped;
  }

  if (!sawChunk) {
    throw new ProviderError({
      code: "empty_stream",
      message: "The provider returned no content.",
    });
  }

  if (!finish) {
    if (sawDone) {
      finish = "stop";
    } else {
      throw new ProviderError({
        code: "stream_incomplete",
        message: "The provider closed the stream before finishing.",
      });
    }
  }

  yield { type: "finish", reason: finish };
}
