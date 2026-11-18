/**
 * The names the interest cards may use for their drawing, in card order. Each is
 * drawn in components/interest-glyph.tsx. Kept in a plain module so the content
 * tests can check every card resolves to a drawing.
 */
export const interestGlyphNames = [
  "stack",
  "correctness",
  "stream",
  "loop",
  "pulse",
  "balance",
] as const;

export type InterestGlyphName = (typeof interestGlyphNames)[number];
