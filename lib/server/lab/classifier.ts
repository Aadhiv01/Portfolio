import type { Classification } from "@/lib/lab-protocol";

const REASONING_TERMS =
  /\b(design|architecture|architect|debug|refactor|trade-?off|compare|prove|derive|analy[sz]e|algorithm|complexity)\b/;
const TECHNICAL_TERMS =
  /\b(api|sql|cache|queue|distributed|concurrency|schema|llm|rag|embedding|eval|index|transaction|migration|kubernetes|docker)\b/;
const OPERATIONAL_TERMS =
  /\b(production|scale|security|latency|throughput|consistency|failure mode|edge case)\b/;
const AMBIGUITY_TERMS =
  /\b(should i|best approach|best way|which|help me decide|plan|how would you)\b/;
const GREETING =
  /^(hi|hello|hey|thanks|thank you|good (morning|afternoon|evening))\b[\s!.?]*$/i;
const ARITHMETIC_ONLY = /^[\d\s+\-*/^().=%]+$/;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Deterministic local classifier. No model call: it adds latency and cost for
 * little gain at this prompt length. Phase 4 can compare it to an LLM arm.
 */
export function classifyPrompt(raw: string): Classification {
  const prompt = raw.trim();
  const text = prompt.toLowerCase();
  const words = prompt.split(/\s+/).filter(Boolean).length;
  const reasons: string[] = [];
  let score = 0;

  const add = (points: number, reason: string) => {
    score += points;
    reasons.push(reason);
  };

  if (ARITHMETIC_ONLY.test(prompt)) {
    return {
      tier: "cheap",
      score: -3,
      confidence: 0.9,
      reasons: ["arithmetic_only"],
    };
  }

  if (GREETING.test(prompt) && words <= 12) {
    return {
      tier: "cheap",
      score: -3,
      confidence: 0.9,
      reasons: ["greeting"],
    };
  }

  if (/```|<code>|<\/code>/.test(text)) add(3, "code_block");
  if (/\bat\s+\S+\s*:\d+:\d+/.test(text)) add(3, "stack_trace");
  if (/\b(select|insert|update|delete)\b[^\n]*\bfrom\b/.test(text)) {
    add(3, "sql");
  }
  if (REASONING_TERMS.test(text)) add(3, "reasoning_task");
  if ((text.match(/\?/g) ?? []).length >= 2) add(3, "multi_part_question");
  if ((text.match(/^\s*(\d+[.)]|[-*])\s+\S/gm) ?? []).length >= 3) {
    add(3, "list_of_items");
  }

  if (words >= 50 || prompt.length > 240) add(2, "long_prompt");
  const operationalHits = text.match(OPERATIONAL_TERMS) ?? [];
  if (operationalHits.length >= 2) add(2, "operational_constraints");

  if (prompt.length >= 80) add(1, "medium_length");
  if (TECHNICAL_TERMS.test(text)) add(1, "technical_term");
  if (/\b(explain|analy[sz]e|plan|write code|implement|why|how)\b/.test(text)) {
    add(1, "explanatory");
  }
  if (AMBIGUITY_TERMS.test(text)) add(1, "ambiguous_choice");

  // Never let brevity undo a signal that already crossed the strong boundary:
  // a short prompt that contains code or a SQL statement is still strong.
  if (score < 3) {
    if (words <= 12 && !TECHNICAL_TERMS.test(text) && !REASONING_TERMS.test(text)) {
      add(-2, "short_and_simple");
    }
    if (prompt.length <= 40 && !/\b(why|how)\b/.test(text)) {
      add(-1, "very_short");
    }
  }

  const strongConfidence = clamp(0.75 + Math.min(Math.abs(score), 4) * 0.05, 0.75, 0.95);

  if (score >= 3) {
    return { tier: "strong", score, confidence: strongConfidence, reasons };
  }

  if (score <= 0) {
    if (reasons.length === 0 && prompt.length > 80) {
      return {
        tier: "strong",
        score,
        confidence: 0.55,
        reasons: ["unknown_prompt_safe_default"],
      };
    }
    return { tier: "cheap", score, confidence: 0.85, reasons };
  }

  if (prompt.length > 120 || AMBIGUITY_TERMS.test(text)) {
    return { tier: "strong", score, confidence: 0.75, reasons };
  }

  return { tier: "cheap", score, confidence: 0.75, reasons };
}
