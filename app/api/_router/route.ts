import type { LabEvent, ProviderId } from "@/lib/lab-protocol";

import { KEY_HEADERS, LIMITS } from "@/lib/server/lab/config";
import { runRouter } from "@/lib/server/lab/router";

export const maxDuration = 60;

const encoder = new TextEncoder();

function jsonError(status: number, code: string, message: string): Response {
  return Response.json(
    { error: { code, message } },
    {
      status,
      headers: { "cache-control": "no-store" },
    },
  );
}

function readKeys(request: Request): Partial<Record<ProviderId, string>> {
  const keys: Partial<Record<ProviderId, string>> = {};
  for (const provider of ["anthropic", "deepseek"] as const) {
    const value = request.headers.get(KEY_HEADERS[provider])?.trim();
    if (value) keys[provider] = value;
  }
  return keys;
}

export async function POST(request: Request): Promise<Response> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return jsonError(415, "bad_content_type", "Send JSON.");
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > LIMITS.maxBodyBytes) {
    return jsonError(413, "body_too_large", "The request body is too large.");
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return jsonError(400, "bad_body", "The request body could not be read.");
  }

  if (raw.length > LIMITS.maxBodyBytes) {
    return jsonError(413, "body_too_large", "The request body is too large.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return jsonError(400, "bad_body", "The request body is not valid JSON.");
  }

  const prompt =
    typeof parsed === "object" && parsed !== null && "prompt" in parsed
      ? (parsed as { prompt?: unknown }).prompt
      : undefined;

  if (typeof prompt !== "string" || prompt.trim().length === 0) {
    return jsonError(400, "bad_prompt", "A prompt is required.");
  }

  if (prompt.length > LIMITS.maxPromptChars) {
    return jsonError(
      413,
      "prompt_too_long",
      `Keep the prompt under ${LIMITS.maxPromptChars} characters.`,
    );
  }

  const keys = readKeys(request);
  if (Object.keys(keys).length === 0) {
    return jsonError(
      400,
      "no_key",
      "Add an Anthropic or DeepSeek API key to run the lab.",
    );
  }

  const abort = new AbortController();
  const onAbort = () => abort.abort();
  request.signal.addEventListener("abort", onAbort, { once: true });

  let closed = false;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: LabEvent) => {
        if (closed) return;
        try {
          controller.enqueue(
            encoder.encode(
              `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`,
            ),
          );
        } catch {
          closed = true;
        }
      };

      try {
        for await (const event of runRouter({
          prompt: prompt.trim(),
          keys,
          signal: abort.signal,
        })) {
          send(event);
        }
      } catch {
        send({
          type: "error",
          code: "internal_error",
          message: "The router could not complete this request.",
          retryable: false,
          partial: false,
        });
      } finally {
        closed = true;
        request.signal.removeEventListener("abort", onAbort);
        try {
          controller.close();
        } catch {
          // The client already closed the stream.
        }
      }
    },
    cancel() {
      closed = true;
      abort.abort();
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-store, no-transform",
      "x-accel-buffering": "no",
      connection: "keep-alive",
    },
  });
}
