import { afterEach, describe, expect, it, vi } from "vitest";

import { streamDeepSeek } from "./deepseek";
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
  'data: {"model":"deepseek-flash","choices":[{"delta":{"content":"Hi"},"finish_reason":null}]}\n\n',
  'data: {"choices":[{"delta":{"content":" there"},"finish_reason":null}]}\n\n',
  'data: {"choices":[{"delta":{},"finish_reason":"stop"}],"usage":{"prompt_tokens":8,"completion_tokens":4,"prompt_cache_hit_tokens":2}}\n\n',
  "data: [DONE]\n\n",
];

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("streamDeepSeek", () => {
  it("maps chunks to meta, text, usage and finish", async () => {
    mockFetch(async () => sseResponse(happyChunks));

    const events = await collect(
      streamDeepSeek({ apiKey: "sk-test", prompt: "hi", signal: signal() }),
    );

    expect(events[0]).toEqual({
      type: "meta",
      requestedModel: "deepseek-flash",
      servedModel: "deepseek-flash",
    });
    expect(events.filter((event) => event.type === "text")).toEqual([
      { type: "text", text: "Hi" },
      { type: "text", text: " there" },
    ]);
    expect(events).toContainEqual({
      type: "usage",
      usage: {
        inputTokens: 8,
        outputTokens: 4,
        cachedInputTokens: 2,
        reported: true,
      },
    });
    expect(events.at(-1)).toEqual({ type: "finish", reason: "stop" });
  });

  it("requests usage in the stream and uses the configured model", async () => {
    const fetchMock = mockFetch(async () => sseResponse(happyChunks));

    await collect(
      streamDeepSeek({ apiKey: "sk-test", prompt: "hi", signal: signal() }),
    );

    const call = fetchMock.mock.calls.at(0);
    expect(call).toBeDefined();
    if (!call) return;

    const [input, init] = call;
    expect(input).toBe("https://api.deepseek.com/chat/completions");
    expect(init?.headers).toMatchObject({
      authorization: "Bearer sk-test",
    });

    const body = JSON.parse(String(init?.body)) as Record<string, unknown>;
    expect(body.model).toBe("deepseek-flash");
    expect(body.stream).toBe(true);
    expect(body.stream_options).toEqual({ include_usage: true });
    expect(body.max_tokens).toBe(1024);
    expect(body).not.toHaveProperty("temperature");
  });

  it("maps 429 to a retryable rate-limit error", async () => {
    mockFetch(async () => new Response("slow down", { status: 429 }));

    const error = await collect(
      streamDeepSeek({ apiKey: "k", prompt: "hi", signal: signal() }),
    ).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ProviderError);
    expect((error as ProviderError).code).toBe("rate_limited");
    expect((error as ProviderError).retryable).toBe(true);
  });

  it("surfaces an in-stream provider error", async () => {
    mockFetch(async () =>
      sseResponse(['data: {"error":{"message":"upstream detail"}}\n\n']),
    );

    const error = await collect(
      streamDeepSeek({ apiKey: "k", prompt: "hi", signal: signal() }),
    ).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ProviderError);
    expect((error as ProviderError).code).toBe("provider_error");
  });

  it("fails on a stream with no chunks", async () => {
    mockFetch(async () => sseResponse([]));

    await expect(
      collect(streamDeepSeek({ apiKey: "k", prompt: "hi", signal: signal() })),
    ).rejects.toMatchObject({ code: "empty_stream" });
  });

  it("fails when the stream closes without finishing", async () => {
    mockFetch(async () => sseResponse([happyChunks[0]]));

    await expect(
      collect(streamDeepSeek({ apiKey: "k", prompt: "hi", signal: signal() })),
    ).rejects.toMatchObject({ code: "stream_incomplete" });
  });

  it("accepts [DONE] as a clean stop when no finish reason arrives", async () => {
    mockFetch(async () =>
      sseResponse([
        'data: {"choices":[{"delta":{"content":"ok"},"finish_reason":null}]}\n\n',
        "data: [DONE]\n\n",
      ]),
    );

    const events = await collect(
      streamDeepSeek({ apiKey: "k", prompt: "hi", signal: signal() }),
    );

    expect(events.at(-1)).toEqual({ type: "finish", reason: "stop" });
  });
});
