import { describe, expect, it } from "vitest";

import { readSseFrames, type SseFrame } from "./lab-sse";

const encoder = new TextEncoder();

function streamOf(chunks: Array<string | Uint8Array>): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(
          typeof chunk === "string" ? encoder.encode(chunk) : chunk,
        );
      }
      controller.close();
    },
  });
}

async function collect(
  body: ReadableStream<Uint8Array>,
  signal?: AbortSignal,
): Promise<SseFrame[]> {
  const frames: SseFrame[] = [];
  for await (const frame of readSseFrames(body, signal)) frames.push(frame);
  return frames;
}

describe("readSseFrames", () => {
  it("parses named events and plain messages", async () => {
    const frames = await collect(
      streamOf([
        'event: token\ndata: {"text":"hi"}\n\n',
        "data: bare\n\n",
      ]),
    );

    expect(frames).toEqual([
      { event: "token", data: '{"text":"hi"}' },
      { event: "message", data: "bare" },
    ]);
  });

  it("reassembles frames split across chunks, including mid UTF-8", async () => {
    const text = "event: token\ndata: {\"text\":\"héllo wörld\"}\n\n";
    const bytes = encoder.encode(text);
    const splitAt = text.indexOf("héllo") + 2; // inside the two-byte é
    const chunks = [
      bytes.slice(0, splitAt),
      bytes.slice(splitAt, splitAt + 7),
      bytes.slice(splitAt + 7),
    ];

    const frames = await collect(streamOf(chunks));

    expect(frames).toEqual([
      { event: "token", data: '{"text":"héllo wörld"}' },
    ]);
  });

  it("handles CRLF line endings", async () => {
    const frames = await collect(
      streamOf(["event: meta\r\ndata: one\r\n\r\ndata: two\r\n\r\n"]),
    );

    expect(frames).toEqual([
      { event: "meta", data: "one" },
      { event: "message", data: "two" },
    ]);
  });

  it("joins multi-line data and ignores comments", async () => {
    const frames = await collect(
      streamOf([": keep-alive\n\ndata: line one\ndata: line two\n\n"]),
    );

    expect(frames).toEqual([
      { event: "message", data: "line one\nline two" },
    ]);
  });

  it("emits a final frame that has no trailing blank line", async () => {
    const frames = await collect(streamOf(["data: last"]));

    expect(frames).toEqual([{ event: "message", data: "last" }]);
  });

  it("stops on abort and cancels the reader", async () => {
    let cancelled = false;
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode("data: first\n\n"));
      },
      cancel() {
        cancelled = true;
      },
    });
    const controller = new AbortController();
    const frames: SseFrame[] = [];

    for await (const frame of readSseFrames(body, controller.signal)) {
      frames.push(frame);
      controller.abort();
    }

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(frames).toEqual([{ event: "message", data: "first" }]);
    expect(cancelled).toBe(true);
  });
});
