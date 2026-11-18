import { afterEach, describe, expect, it, vi } from "vitest";

import { streamAnthropic } from "./anthropic";
import { ProviderError, type ProviderEvent } from "./types";

const encoder = new TextEncoder();

function sseResponse(chunks: string[], status = 200): Response {
  return new Response(
    new ReadableStream({
      start(controller) {
        for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
        controller.close();
      },
    }),
    {
      status,
      headers: { "content-type": "text/event-stream" },
    },
  );
}

async function collect(
  stream: AsyncGenerator<ProviderEvent>,
): Promise<ProviderEvent[]> {
  const events: ProviderEvent[] = [];
  for await (const event of stream) events.push(event);
  return events;
}

function mockFetch(handler: () => Promise<Response>) {
  const fetchMock = vi.fn<typeof fetch>();
  fetchMock.mockImplementation(async () => handler());
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

const signal = () => new AbortController().signal;

const happyChunks = [
  'event: message_start\ndata: {"type":"message_start","message":{"model":"claude-sonnet-5-5","usage":{"input_tokens":10,"cache_creation_input_tokens":2,"cache_read_input_tokens":3,"output_tokens":1}}}\n\n',
  'event: content_block_delta\ndata: {"type":"content_block_delta","delta":{"type":"thinking_delta","thinking":"hidden"}}\n\n',
  'event: content_block_delta\ndata: {"type":"content_block_delta","delta":{"type":"text_delta","text":"Hello"}}\n\n',
  'event: content_block_delta\ndata: {"type":"content_block_delta","delta":{"type":"text_delta","text":" world"}}\n\n',
  'event: message_delta\ndata: {"type":"message_delta","delta":{"stop_reason":"end_turn"},"usage":{"output_tokens":12}}\n\n',
  'event: message_stop\ndata: {"type":"message_stop"}\n\n',
];

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("streamAnthropic", () => {
  it("maps the stream to meta, text, usage and finish", async () => {
    mockFetch(async () => sseResponse(happyChunks));

    const events = await collect(
      streamAnthropic({ apiKey: "sk-ant-test", prompt: "hi", signal: signal() }),
    );

    expect(events[0]).toEqual({
      type: "meta",
      requestedModel: "claude-sonnet-5-5",
      servedModel: "claude-sonnet-5-5",
    });
    expect(events[1]).toEqual({
      type: "usage",
      usage: {
        inputTokens: 15,
        outputTokens: 1,
        cachedInputTokens: 3,
        reported: true,
      },
    });
    expect(events.filter((event) => event.type === "text")).toEqual([
      { type: "text", text: "Hello" },
      { type: "text", text: " world" },
    ]);
    expect(events.at(-1)).toEqual({ type: "finish", reason: "stop" });
  });

  it("sends the model, thinking off switch and no sampling params", async () => {
    const fetchMock = mockFetch(async () => sseResponse(happyChunks));

    await collect(
      streamAnthropic({ apiKey: "sk-ant-test", prompt: "hi", signal: signal() }),
    );

    const call = fetchMock.mock.calls.at(0);
    expect(call).toBeDefined();
    if (!call) return;

    const [input, init] = call;
    expect(input).toBe("https://api.anthropic.com/v1/messages");
    expect(init?.headers).toMatchObject({ "x-api-key": "sk-ant-test" });

    const body = JSON.parse(String(init?.body)) as Record<string, unknown>;
    expect(body.model).toBe("claude-sonnet-5-5");
    expect(body.max_tokens).toBe(1024);
    expect(body.stream).toBe(true);
    expect(body.thinking).toEqual({ type: "between_tools" });
    expect(body.output_config).toEqual({ effort: "low" });
    expect(body).not.toHaveProperty("temperature");
    expect(body).not.toHaveProperty("top_p");
    expect(body).not.toHaveProperty("top_k");
  });

  it("maps an auth failure to a safe, non-retryable error", async () => {
    mockFetch(async () => new Response("upstream detail", { status: 401 }));

    const error = await collect(
      streamAnthropic({ apiKey: "bad", prompt: "hi", signal: signal() }),
    ).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ProviderError);
    expect((error as ProviderError).code).toBe("invalid_key");
    expect((error as ProviderError).message).not.toContain("upstream detail");
  });

  it("fails when the stream never starts", async () => {
    mockFetch(async () => sseResponse(["data: {}\n\n"]));

    await expect(
      collect(
        streamAnthropic({ apiKey: "k", prompt: "hi", signal: signal() }),
      ),
    ).rejects.toMatchObject({ code: "empty_stream" });
  });

  it("fails when the stream ends without a stop reason", async () => {
    mockFetch(async () =>
      sseResponse([happyChunks[0], happyChunks[2]]),
    );

    await expect(
      collect(
        streamAnthropic({ apiKey: "k", prompt: "hi", signal: signal() }),
      ),
    ).rejects.toMatchObject({ code: "stream_incomplete" });
  });

  it("surfaces an in-stream error without forwarding its text", async () => {
    mockFetch(async () =>
      sseResponse([
        'data: {"type":"error","error":{"type":"overloaded_error","message":"secret upstream text"}}\n\n',
      ]),
    );

    const error = await collect(
      streamAnthropic({ apiKey: "k", prompt: "hi", signal: signal() }),
    ).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ProviderError);
    expect((error as ProviderError).message).not.toContain("secret upstream text");
  });

  it("rejects a non-SSE response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response("{}", {
            status: 200,
            headers: { "content-type": "application/json" },
          }),
      ),
    );

    await expect(
      collect(
        streamAnthropic({ apiKey: "k", prompt: "hi", signal: signal() }),
      ),
    ).rejects.toMatchObject({ code: "bad_stream" });
  });
});
