import { readSseFrames } from "@/lib/lab-sse";
import type { NormalizedUsage } from "@/lib/lab-protocol";

import { LIMITS, MODELS } from "../config";
import {
  ProviderError,
  safeErrorForStatus,
  type ProviderEvent,
  type ProviderStreamArgs,
} from "./types";

interface AnthropicUsage {
  input_tokens?: number;
  output_tokens?: number;
  cache_creation_input_tokens?: number;
  cache_read_input_tokens?: number;
}

function normalizeUsage(
  usage: AnthropicUsage | undefined,
  reported: boolean,
): NormalizedUsage {
  if (!usage) {
    return {
      inputTokens: null,
      outputTokens: null,
      cachedInputTokens: null,
      reported: false,
    };
  }

  const input =
    (usage.input_tokens ?? 0) +
    (usage.cache_creation_input_tokens ?? 0) +
    (usage.cache_read_input_tokens ?? 0);

  return {
    inputTokens: Number.isFinite(input) && input > 0 ? input : null,
    outputTokens:
      typeof usage.output_tokens === "number" ? usage.output_tokens : null,
    cachedInputTokens:
      typeof usage.cache_read_input_tokens === "number"
        ? usage.cache_read_input_tokens
        : null,
    reported,
  };
}

function mapStopReason(
  reason: string | null | undefined,
): "stop" | "length" | "refusal" | null {
  if (reason === "max_tokens") return "length";
  if (reason === "refusal") return "refusal";
  if (reason === "end_turn" || reason === "stop_sequence" || reason === "stop") {
    return "stop";
  }
  return null;
}

export async function* streamAnthropic({
  apiKey,
  prompt,
  signal,
}: ProviderStreamArgs): AsyncGenerator<ProviderEvent> {
  const requestedModel = MODELS.anthropic.model;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      // Verified against the current Messages reference on 2026-11-04.
      "anthropic-version": "2026-10-21",
    },
    body: JSON.stringify({
      model: requestedModel,
      max_tokens: LIMITS.maxTokens,
      stream: true,
      messages: [{ role: "user", content: prompt }],
      // Sonnet 5.5 has no `disabled` thinking mode; `between_tools` with no
      // tools is its documented off switch. Allowed at effort high or below.
      thinking: { type: "between_tools" },
      output_config: { effort: "low" },
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
  let sawMessageStart = false;

  for await (const frame of readSseFrames(response.body, signal)) {
    if (!frame.data || frame.data === "[DONE]") continue;

    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(frame.data) as Record<string, unknown>;
    } catch {
      continue;
    }

    const type = payload.type;

    if (type === "error") {
      throw new ProviderError({
        code: "provider_error",
        // Fixed local copy: upstream error text is never forwarded.
        message: "The provider returned an error.",
        retryable: true,
      });
    }

    if (type === "message_start") {
      sawMessageStart = true;
      const message = (payload.message ?? {}) as Record<string, unknown>;
      if (typeof message.model === "string") servedModel = message.model;
      yield { type: "meta", requestedModel, servedModel };
      yield {
        type: "usage",
        usage: normalizeUsage(message.usage as AnthropicUsage, true),
      };
      continue;
    }

    if (type === "content_block_delta") {
      const delta = (payload.delta ?? {}) as Record<string, unknown>;
      if (delta.type === "text_delta" && typeof delta.text === "string") {
        yield { type: "text", text: delta.text };
      }
      continue;
    }

    if (type === "message_delta") {
      const usage = payload.usage as AnthropicUsage | undefined;
      if (usage) yield { type: "usage", usage: normalizeUsage(usage, true) };
      const delta = (payload.delta ?? {}) as Record<string, unknown>;
      const mapped = mapStopReason(delta.stop_reason as string | null);
      if (mapped) finish = mapped;
      continue;
    }

    if (type === "message_stop") {
      if (!finish) finish = "stop";
      break;
    }
  }

  if (!sawMessageStart) {
    throw new ProviderError({
      code: "empty_stream",
      message: "The provider returned no content.",
    });
  }

  if (!finish) {
    throw new ProviderError({
      code: "stream_incomplete",
      message: "The provider closed the stream before finishing.",
    });
  }

  yield { type: "finish", reason: finish };
}
