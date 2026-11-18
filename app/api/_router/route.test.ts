import { afterEach, describe, expect, it, vi } from "vitest";

import { readSseFrames, type SseFrame } from "@/lib/lab-sse";
import type { LabEvent, MetricsEvent } from "@/lib/lab-protocol";

import { POST } from "./route";

const encoder = new TextEncoder();

const HAPPY_CHUNKS = [
  'data: {"model":"deepseek-flash","choices":[{"delta":{"content":"Hi"},"finish_reason":null}]}\n\n',
  'data: {"choices":[{"delta":{"content":" there"},"finish_reason":"stop"}],"usage":{"prompt_tokens":8,"completion_tokens":4}}\n\n',
  "data: [DONE]\n\n",
];

function sseResponse(chunks: string[], status = 200): Response {
  return new Response(
    new ReadableStream({
      start(controller) {
        for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
        controller.close();
      },
    }),
    { status, headers: { "content-type": "text/event-stream" } },
  );
}

function mockFetch(handler: () => Promise<Response>) {
  const fetchMock = vi.fn<typeof fetch>();
  fetchMock.mockImplementation(async () => handler());
  vi.stubGlobal("fetch", fetchMock);
}

function request(
  body: string,
  headers: Record<string, string> = {},
): Request {
  return new Request("http://localhost/api/router", {
    method: "POST",
    headers,
    body,
  });
}

async function framesOf(response: Response): Promise<SseFrame[]> {
  if (!response.body) throw new Error("expected a response body");
  const frames: SseFrame[] = [];
  for await (const frame of readSseFrames(response.body)) frames.push(frame);
  return frames;
}

async function eventsOf(response: Response): Promise<LabEvent[]> {
  return (await framesOf(response)).map(
    (frame) => JSON.parse(frame.data) as LabEvent,
  );
}

function errorOf(response: Response) {
  return response.json() as Promise<{ error: { code: string; message: string } }>;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("POST /api/router", () => {
  it("rejects a non-JSON content type", async () => {
    const response = await POST(
      request("hello", { "x-lab-deepseek-key": "sk-test" }),
    );

    expect(response.status).toBe(415);
    expect((await errorOf(response)).error.code).toBe("bad_content_type");
  });

  it("rejects malformed JSON", async () => {
    const response = await POST(
      request("{not json", {
        "content-type": "application/json",
        "x-lab-deepseek-key": "sk-test",
      }),
    );

    expect(response.status).toBe(400);
    expect((await errorOf(response)).error.code).toBe("bad_body");
  });

  it("requires a prompt", async () => {
    const response = await POST(
      request(JSON.stringify({ prompt: "   " }), {
        "content-type": "application/json",
        "x-lab-deepseek-key": "sk-test",
      }),
    );

    expect(response.status).toBe(400);
    expect((await errorOf(response)).error.code).toBe("bad_prompt");
  });

  it("caps prompt length", async () => {
    const response = await POST(
      request(JSON.stringify({ prompt: "a".repeat(2001) }), {
        "content-type": "application/json",
        "x-lab-deepseek-key": "sk-test",
      }),
    );

    expect(response.status).toBe(413);
    expect((await errorOf(response)).error.code).toBe("prompt_too_long");
  });

  it("caps the request body size", async () => {
    const response = await POST(
      request(JSON.stringify({ prompt: "a".repeat(10_001) }), {
        "content-type": "application/json",
        "x-lab-deepseek-key": "sk-test",
      }),
    );

    expect(response.status).toBe(413);
    expect((await errorOf(response)).error.code).toBe("body_too_large");
  });

  it("requires at least one key", async () => {
    const response = await POST(
      request(JSON.stringify({ prompt: "What is a mutex?" }), {
        "content-type": "application/json",
      }),
    );

    expect(response.status).toBe(400);
    expect((await errorOf(response)).error.code).toBe("no_key");
  });

  it("streams meta, attempt, token, metrics and done", async () => {
    mockFetch(async () => sseResponse(HAPPY_CHUNKS));

    const response = await POST(
      request(JSON.stringify({ prompt: "What is a mutex?" }), {
        "content-type": "application/json",
        "x-lab-deepseek-key": "sk-secret-key",
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/event-stream");
    expect(response.headers.get("cache-control")).toContain("no-store");

    const frames = await framesOf(response);
    const events = frames.map((frame) => JSON.parse(frame.data) as LabEvent);

    expect(frames.map((frame) => frame.event)).toEqual(
      events.map((event) => event.type),
    );
    expect(events[0]).toMatchObject({ type: "meta", classifiedTier: "cheap" });
    expect(events.find((event) => event.type === "attempt")).toMatchObject({
      provider: "deepseek",
      reason: "primary",
    });
    expect(
      events
        .filter((event) => event.type === "token")
        .map((event) => event.text)
        .join(""),
    ).toBe("Hi there");
    expect(events.at(-1)).toEqual({ type: "done" });

    const metrics = events.find(
      (event): event is MetricsEvent => event.type === "metrics",
    );
    expect(metrics?.served?.model).toBe("deepseek-flash");
    expect(metrics?.usage).toMatchObject({ inputTokens: 8, outputTokens: 4 });
    expect(typeof metrics?.costUsd).toBe("number");

    expect(JSON.stringify(frames)).not.toContain("sk-secret-key");
  });

  it("keeps the 200 stream and flags a mid-stream failure as partial", async () => {
    mockFetch(async () =>
      sseResponse([
        'data: {"choices":[{"delta":{"content":"partial"},"finish_reason":null}]}\n\n',
        'data: {"error":{"message":"upstream detail"}}\n\n',
      ]),
    );

    const response = await POST(
      request(JSON.stringify({ prompt: "What is a mutex?" }), {
        "content-type": "application/json",
        "x-lab-deepseek-key": "sk-secret-key",
      }),
    );

    expect(response.status).toBe(200);

    const events = await eventsOf(response);
    const metrics = events.find(
      (event): event is MetricsEvent => event.type === "metrics",
    );
    expect(metrics?.truncated).toBe(true);
    expect(events.at(-1)).toMatchObject({
      type: "error",
      code: "provider_error",
      partial: true,
    });
    expect(JSON.stringify(events)).not.toContain("upstream detail");
    expect(JSON.stringify(events)).not.toContain("sk-secret-key");
  });

  it("turns an upstream failure into a safe streamed error", async () => {
    mockFetch(async () => new Response("upstream detail", { status: 500 }));

    const response = await POST(
      request(JSON.stringify({ prompt: "What is a mutex?" }), {
        "content-type": "application/json",
        "x-lab-deepseek-key": "sk-secret-key",
      }),
    );

    expect(response.status).toBe(200);

    const events = await eventsOf(response);
    expect(events.at(-1)).toMatchObject({
      type: "error",
      code: "provider_unavailable",
      partial: false,
    });
    expect(JSON.stringify(events)).not.toContain("upstream detail");
    expect(JSON.stringify(events)).not.toContain("sk-secret-key");
  });
});
