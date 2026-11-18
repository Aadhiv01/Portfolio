import { describe, expect, it } from "vitest";

import { classifyPrompt } from "./classifier";

describe("classifyPrompt", () => {
  it("sends arithmetic to the cheap tier with high confidence", () => {
    const result = classifyPrompt("24 * 7 + 3");

    expect(result.tier).toBe("cheap");
    expect(result.confidence).toBe(0.9);
    expect(result.reasons).toContain("arithmetic_only");
  });

  it("sends greetings to the cheap tier", () => {
    expect(classifyPrompt("Hello there!").tier).toBe("cheap");
    expect(classifyPrompt("Thanks").tier).toBe("cheap");
  });

  it("treats a short definition question as cheap", () => {
    const result = classifyPrompt("What is a mutex?");

    expect(result.tier).toBe("cheap");
    expect(result.score).toBeLessThan(0);
  });

  it("escalates design and trade-off language to strong", () => {
    const result = classifyPrompt(
      "Design a multi-region architecture for a payments system with strong consistency and failover. Compare the trade-offs and explain your reasoning.",
    );

    expect(result.tier).toBe("strong");
    expect(result.reasons).toContain("reasoning_task");
  });

  it("escalates SQL plus an explanation request to strong", () => {
    const result = classifyPrompt(
      "SELECT * FROM orders WHERE id IN (SELECT id FROM refunds). Explain why the query plan is slow.",
    );

    expect(result.tier).toBe("strong");
    expect(result.reasons).toContain("sql");
  });

  it("escalates multiple questions to strong", () => {
    const result = classifyPrompt(
      "Why does the queue back up? What should I check first?",
    );

    expect(result.tier).toBe("strong");
    expect(result.reasons).toContain("multi_part_question");
  });

  it("escalates fenced code to strong", () => {
    const result = classifyPrompt(
      "Why does this return undefined?\n```js\nconst x = [1].map(fn);\n```",
    );

    expect(result.tier).toBe("strong");
    expect(result.reasons).toContain("code_block");
  });

  it("keeps a one-signal short question on the cheap tier", () => {
    const result = classifyPrompt("How do I cache this?");

    expect(result.tier).toBe("cheap");
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThan(3);
  });

  it("escalates a long prompt that has a mild signal", () => {
    const result = classifyPrompt(
      "I am putting together a deployment checklist for a service that will receive steady traffic from several regions. " +
        "Please outline what I should verify before the first release and how to roll back safely if something looks wrong. " +
        "The team has not shipped this kind of service before, so assume no prior context.",
    );

    expect(result.tier).toBe("strong");
    expect(result.reasons).toContain("long_prompt");
  });

  it("always returns a reason list and a confidence in range", () => {
    const prompts = [
      "hi",
      "summarize this",
      "Compare Postgres and DynamoDB for a write-heavy workload.",
      "1. set up the repo\n2. add tests\n3. deploy",
    ];

    for (const prompt of prompts) {
      const result = classifyPrompt(prompt);
      expect(result.reasons.length).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
      expect(result.confidence).toBeLessThanOrEqual(0.95);
    }
  });
});
