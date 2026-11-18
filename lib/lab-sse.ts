/**
 * Incremental Server-Sent Events reader.
 *
 * Handles frames split across chunks, CRLF, comments, multi-line `data:`
 * fields, UTF-8 sequences split across chunks, and a final frame with no
 * trailing blank line. Works in the browser and in Node.
 */

export interface SseFrame {
  event: string;
  data: string;
  id?: string;
}

const decoder = () => new TextDecoder("utf-8");

export async function* readSseFrames(
  body: ReadableStream<Uint8Array>,
  signal?: AbortSignal,
): AsyncGenerator<SseFrame> {
  const reader = body.getReader();
  const decode = decoder();
  let buffer = "";
  let eventName = "message";
  let dataLines: string[] = [];
  let id: string | undefined;

  const flush = (): SseFrame | null => {
    if (dataLines.length === 0) {
      eventName = "message";
      id = undefined;
      return null;
    }
    const frame: SseFrame = {
      event: eventName,
      data: dataLines.join("\n"),
      ...(id ? { id } : {}),
    };
    eventName = "message";
    dataLines = [];
    id = undefined;
    return frame;
  };

  const handleLine = (rawLine: string): SseFrame | null => {
    const line = rawLine.endsWith("\r") ? rawLine.slice(0, -1) : rawLine;

    if (line === "") return flush();
    if (line.startsWith(":")) return null;

    const colon = line.indexOf(":");
    const field = colon === -1 ? line : line.slice(0, colon);
    let value = colon === -1 ? "" : line.slice(colon + 1);
    if (value.startsWith(" ")) value = value.slice(1);

    if (field === "event") eventName = value || "message";
    else if (field === "data") dataLines.push(value);
    else if (field === "id") id = value;

    return null;
  };

  const onAbort = () => {
    void reader.cancel().catch(() => {});
  };
  signal?.addEventListener("abort", onAbort, { once: true });

  try {
    while (true) {
      if (signal?.aborted) return;
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decode.decode(value, { stream: true });

      let newline = buffer.indexOf("\n");
      while (newline !== -1) {
        const line = buffer.slice(0, newline);
        buffer = buffer.slice(newline + 1);
        const frame = handleLine(line);
        if (frame) yield frame;
        newline = buffer.indexOf("\n");
      }
    }

    buffer += decode.decode();
    if (buffer.length > 0) {
      const frame = handleLine(buffer);
      if (frame) yield frame;
    }
    const finalFrame = flush();
    if (finalFrame) yield finalFrame;
  } finally {
    signal?.removeEventListener("abort", onAbort);
    reader.releaseLock();
  }
}
