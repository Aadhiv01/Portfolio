"use client";

import { useEffect, useRef, useState } from "react";
import { KeyRound, Play, Square } from "lucide-react";

import { readSseFrames } from "@/lib/lab-sse";
import type { LabEvent, MetricsEvent } from "@/lib/lab-protocol";
import { cn } from "@/lib/utils";

type MetaEvent = Extract<LabEvent, { type: "meta" }>;
type AttemptEvent = Extract<LabEvent, { type: "attempt" }>;

const EXAMPLES = [
  { label: "A definition", prompt: "What is a mutex?" },
  {
    label: "A SQL query",
    prompt:
      "Write a SQL query that finds duplicate charges in the last 30 days.",
  },
  {
    label: "An architecture call",
    prompt:
      "We are choosing a database for a payments system. Compare strong and eventual consistency, and recommend one.",
  },
];

const MAX_PROMPT = 2000;

function formatMs(value: number | null): string {
  return value === null ? "—" : `${value} ms`;
}

function formatCost(value: number | null): string {
  if (value === null) return "—";
  if (value === 0) return "$0";
  return `$${value.toFixed(6)}`;
}

function Metric({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="border-t border-rule pt-3">
      <dt className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.11em] text-quiet">
        {label}
      </dt>
      <dd
        className={cn(
          "mt-1 font-mono text-[0.88rem] font-medium tracking-[0.01em]",
          accent ? "text-accent" : "text-ink",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

export function RouterLab() {
  const [prompt, setPrompt] = useState("");
  const [anthropicKey, setAnthropicKey] = useState("");
  const [deepseekKey, setDeepseekKey] = useState("");
  const [answer, setAnswer] = useState("");
  const [meta, setMeta] = useState<MetaEvent | null>(null);
  const [attempts, setAttempts] = useState<AttemptEvent[]>([]);
  const [metrics, setMetrics] = useState<MetricsEvent | null>(null);
  const [error, setError] = useState<{
    code: string;
    message: string;
    partial: boolean;
  } | null>(null);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("Idle");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const hasKey = anthropicKey.trim().length > 0 || deepseekKey.trim().length > 0;

  const run = async () => {
    const text = prompt.trim();
    if (!text || running) return;

    if (!hasKey) {
      setError({
        code: "no_key",
        message: "Add an Anthropic or DeepSeek API key below to run the lab.",
        partial: false,
      });
      setStatus("Needs a key");
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setRunning(true);
    setAnswer("");
    setMeta(null);
    setAttempts([]);
    setMetrics(null);
    setError(null);
    setStatus("Classifying and routing…");

    let receivedText = false;

    try {
      const headers: Record<string, string> = {
        "content-type": "application/json",
      };
      if (anthropicKey.trim()) headers["x-lab-anthropic-key"] = anthropicKey.trim();
      if (deepseekKey.trim()) headers["x-lab-deepseek-key"] = deepseekKey.trim();

      const response = await fetch("/api/router", {
        method: "POST",
        headers,
        body: JSON.stringify({ prompt: text }),
        signal: controller.signal,
      });

      const type = response.headers.get("content-type") ?? "";
      if (!response.ok || !type.includes("text/event-stream")) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: { code?: string; message?: string } }
          | null;
        setError({
          code: payload?.error?.code ?? "request_failed",
          message:
            payload?.error?.message ?? "The lab request could not be started.",
          partial: false,
        });
        setStatus("Failed");
        return;
      }

      if (!response.body) {
        setError({
          code: "empty_response",
          message: "The lab returned no stream.",
          partial: false,
        });
        setStatus("Failed");
        return;
      }

      for await (const frame of readSseFrames(response.body, controller.signal)) {
        let event: LabEvent;
        try {
          event = JSON.parse(frame.data) as LabEvent;
        } catch {
          continue;
        }

        switch (event.type) {
          case "meta":
            setMeta(event);
            setStatus(
              `Routed to the ${event.classifiedTier} tier${
                event.substituted ? " (key for the other tier only)" : ""
              }`,
            );
            break;
          case "attempt":
            setAttempts((previous) => [...previous, event]);
            setStatus(
              `${event.reason === "failover" ? "Failing over to" : "Calling"} ${
                event.provider
              } · ${event.model}`,
            );
            break;
          case "token":
            receivedText = true;
            setAnswer((previous) => previous + event.text);
            break;
          case "metrics":
            setMetrics(event);
            break;
          case "error":
            setError({
              code: event.code,
              message: event.message,
              partial: event.partial,
            });
            setStatus(event.partial ? "Stopped mid-answer" : "Failed");
            break;
          case "done":
            setStatus("Done");
            break;
        }
      }
    } catch {
      if (controller.signal.aborted) {
        setStatus("Stopped");
      } else {
        setError({
          code: "network_error",
          message: "The request could not be completed.",
          partial: receivedText,
        });
        setStatus("Failed");
      }
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setRunning(false);
    }
  };

  const stop = () => {
    abortRef.current?.abort();
    setStatus("Stopped");
  };

  const served = metrics?.served;
  const classifier = meta?.classifier;

  return (
    <section id="lab" className="scroll-mt-24 border-b border-rule">
      <div className="mx-auto w-full max-w-[1120px] px-5 py-20 md:px-8 md:py-28">
        <div data-reveal>
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <p className="font-mono text-[0.72rem] font-medium uppercase tracking-[0.14em] text-accent">
              Lab — live
            </p>
            <p className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.12em] text-quiet">
              BYOK · no stored keys
            </p>
          </div>
          <h2 className="mt-5 font-serif text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.02] tracking-[-0.02em]">
            Router Lab.
          </h2>
          <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-quiet">
            A prompt is classified, routed to a cheap or strong model, and
            streamed back with the measured cost and latency for this request.
            Bring your own key; the answer is real, not a recording.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="border border-rule bg-card/40" data-reveal>
            <div className="border-b border-rule px-5 py-4">
              <label
                htmlFor="lab-prompt"
                className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.12em] text-quiet"
              >
                Prompt
              </label>
              <textarea
                id="lab-prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value.slice(0, MAX_PROMPT))}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                    event.preventDefault();
                    void run();
                  }
                }}
                rows={5}
                placeholder="Ask something you would ask a senior engineer…"
                className="mt-2 w-full resize-y border border-rule bg-paper p-3 text-base leading-relaxed text-ink outline-none transition-colors placeholder:text-quiet/85 focus:border-accent"
              />
              <div className="mt-2 flex items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.1em] text-quiet">
                <span>Ctrl / ⌘ + Enter to run</span>
                <span>
                  {prompt.length} / {MAX_PROMPT}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {EXAMPLES.map((example) => (
                  <button
                    key={example.label}
                    type="button"
                    onClick={() => setPrompt(example.prompt)}
                    aria-label={`Use example: ${example.label}`}
                    className="border border-rule px-2.5 py-1.5 text-left font-mono text-[0.72rem] font-medium leading-snug tracking-[0.01em] text-quiet transition-colors hover:border-accent hover:text-accent"
                  >
                    {example.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-5 py-4">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center gap-2 font-mono text-[0.7rem] font-medium uppercase tracking-[0.12em] text-quiet transition-colors hover:text-accent">
                  <KeyRound aria-hidden className="size-3.5" />
                  API keys {hasKey ? "· set" : "· required"}
                </summary>

                <div className="mt-4 space-y-3">
                  <div>
                    <label
                      htmlFor="lab-anthropic-key"
                      className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.1em] text-quiet"
                    >
                      Anthropic key
                    </label>
                    <input
                      id="lab-anthropic-key"
                      type="password"
                      value={anthropicKey}
                      onChange={(event) => setAnthropicKey(event.target.value)}
                      autoComplete="off"
                      spellCheck={false}
                      placeholder="sk-ant-…"
                      className="mt-1 h-11 w-full border border-rule bg-paper px-3 font-mono text-base text-ink outline-none transition-colors placeholder:text-quiet/75 focus:border-accent md:text-[0.9rem]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lab-deepseek-key"
                      className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.1em] text-quiet"
                    >
                      DeepSeek key
                    </label>
                    <input
                      id="lab-deepseek-key"
                      type="password"
                      value={deepseekKey}
                      onChange={(event) => setDeepseekKey(event.target.value)}
                      autoComplete="off"
                      spellCheck={false}
                      placeholder="sk-…"
                      className="mt-1 h-11 w-full border border-rule bg-paper px-3 font-mono text-base text-ink outline-none transition-colors placeholder:text-quiet/75 focus:border-accent md:text-[0.9rem]"
                    />
                  </div>
                  <p className="text-[0.82rem] leading-relaxed text-quiet">
                    Keys stay in this tab, are sent only to this site&apos;s
                    server for this request, and are never stored or logged. One
                    key is enough; two enable cross-provider failover.
                  </p>
                </div>
              </details>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={run}
                  disabled={running || prompt.trim().length === 0}
                  className="inline-flex h-11 items-center gap-2 border border-accent bg-accent px-4 font-mono text-[0.72rem] font-medium uppercase tracking-[0.12em] text-paper transition-colors hover:bg-ink hover:border-ink disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <Play aria-hidden className="size-3.5" />
                  Run lab
                </button>
                {running ? (
                  <button
                    type="button"
                    onClick={stop}
                    className="inline-flex h-11 items-center gap-2 border border-rule px-4 font-mono text-[0.72rem] font-medium uppercase tracking-[0.12em] text-ink transition-colors hover:border-accent hover:text-accent"
                  >
                    <Square aria-hidden className="size-3.5" />
                    Stop
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-col border border-rule" data-reveal>
            <div className="flex items-center justify-between gap-3 border-b border-rule px-5 py-3">
              <p
                role="status"
                aria-live="polite"
                className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.1em] text-quiet"
              >
                {status}
              </p>
              <span
                aria-hidden
                className={cn(
                  "size-1.5 rounded-full",
                  running ? "lab-live bg-accent" : "bg-rule",
                )}
              />
            </div>

            <div
              aria-busy={running}
              className="min-h-[15rem] flex-1 px-5 py-5"
            >
              {answer ? (
                <div className="whitespace-pre-wrap text-[1.04rem] leading-relaxed text-ink">
                  {answer}
                  {running ? <span aria-hidden className="lab-caret" /> : null}
                </div>
              ) : running ? (
                <p className="text-[1.02rem] leading-relaxed text-quiet">
                  Waiting for the first token…
                </p>
              ) : error ? null : (
                <p className="text-[1.02rem] leading-relaxed text-quiet">
                  Add a key, write a prompt, and run it. The classifier decides
                  the tier before any provider is called; the routing decision
                  and measured cost appear below the answer.
                </p>
              )}

              {error ? (
                <div className="mt-5 border border-accent/50 bg-accent/5 p-3">
                  <p className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.11em] text-accent">
                    {error.code}
                    {error.partial ? " · partial answer" : ""}
                  </p>
                  <p className="mt-1 text-[0.92rem] leading-relaxed text-ink">
                    {error.message}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="border-t border-rule px-5 py-4">
              <dl className="grid grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-4">
                <Metric
                  label="Tier"
                  value={
                    served
                      ? `${served.tier}${metrics?.substituted ? "*" : ""}`
                      : meta
                        ? `${meta.classifiedTier}${meta.substituted ? "*" : ""}`
                        : "—"
                  }
                  accent
                />
                <Metric
                  label="Model"
                  value={served ? served.model : "—"}
                />
                <Metric
                  label="First token"
                  value={formatMs(metrics?.ttftMs ?? null)}
                />
                <Metric
                  label="Total"
                  value={formatMs(metrics?.totalMs ?? null)}
                />
                <Metric
                  label="Tokens in / out"
                  value={
                    metrics
                      ? `${metrics.usage.inputTokens ?? "—"} / ${
                          metrics.usage.outputTokens ?? "—"
                        }`
                      : "—"
                  }
                />
                <Metric
                  label="Cost (this request)"
                  value={formatCost(metrics?.costUsd ?? null)}
                />
                <Metric
                  label="Confidence"
                  value={
                    classifier
                      ? `${Math.round(classifier.confidence * 100)}%`
                      : "—"
                  }
                />
                <Metric
                  label="Fallback"
                  value={
                    metrics
                      ? metrics.fallbackUsed
                        ? "yes"
                        : "no"
                      : attempts.length > 1
                        ? "yes"
                        : "—"
                  }
                />
              </dl>

              <p className="mt-4 font-mono text-[0.76rem] leading-relaxed tracking-[0.01em] text-quiet">
                Measured for this request only. Cost is tokens × published list
                price
                {metrics?.pricingPeriod ? `, ${metrics.pricingPeriod} rate` : ""}.
                Not a quality or uptime claim.
              </p>

              {meta || attempts.length > 0 ? (
                <details className="mt-3">
                  <summary className="cursor-pointer font-mono text-[0.7rem] font-medium uppercase tracking-[0.1em] text-quiet transition-colors hover:text-accent">
                    How it routed
                  </summary>
                  <div className="mt-3 space-y-3">
                    {classifier ? (
                      <p className="text-[0.82rem] leading-relaxed text-quiet">
                        Classifier score {classifier.score} —{" "}
                        {classifier.reasons.join(", ") || "no signals"}.
                      </p>
                    ) : null}
                    <ul className="space-y-2">
                      {meta?.plan.map((step) => {
                        const log = attempts.find(
                          (attempt) => attempt.provider === step.provider,
                        );
                        const outcome = metrics?.attempts.find(
                          (attempt) => attempt.provider === step.provider,
                        );
                        return (
                          <li
                            key={step.provider}
                            className="flex flex-wrap items-center justify-between gap-2 border-t border-rule pt-2 font-mono text-[0.7rem] tracking-[0.02em] text-quiet"
                          >
                            <span>
                              {step.provider} · {step.model}
                            </span>
                            <span className={outcome?.outcome === "ok" ? "text-accent" : ""}>
                              {outcome?.outcome ??
                                (log ? log.reason : "not called")}
                              {outcome ? ` · ${outcome.elapsedMs} ms` : ""}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </details>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
