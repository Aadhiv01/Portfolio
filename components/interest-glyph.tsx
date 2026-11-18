import type { ReactElement } from "react";

import type { InterestGlyphName } from "@/lib/interest-glyph-names";

/**
 * Small single-stroke drawings for the Areas of interest cards. Each one
 * depicts its idea and plays once when its card is hovered or focused.
 * Structure is drawn in muted ink, the moving part in the accent.
 *
 * Purely decorative (aria-hidden): the card title carries the meaning.
 * Animation lives in globals.css under "Interest glyphs" and is triggered
 * by a `.glyph-host` ancestor, so put that class on the card.
 */
export type GlyphName = InterestGlyphName;

const GLYPHS: Record<GlyphName, ReactElement> = {
  // Full stack, end to end: three layers, a dot travels top to bottom.
  stack: (
    <>
      <rect className="g-base" x="10" y="9" width="28" height="6" rx="1.5" />
      <rect className="g-base" x="10" y="21" width="28" height="6" rx="1.5" />
      <rect className="g-base" x="10" y="33" width="28" height="6" rx="1.5" />
      <path className="g-base" d="M24 15v6M24 27v6" />
      <circle className="g-dot g-stack-dot" cx="24" cy="12" r="2.25" />
    </>
  ),

  // Software that has to be right: two columns reconcile, then a check draws.
  correctness: (
    <>
      <circle className="g-dot-base" cx="12" cy="14" r="2" />
      <circle className="g-dot-base" cx="12" cy="24" r="2" />
      <circle className="g-dot-base" cx="12" cy="34" r="2" />
      <g className="g-right">
        <circle className="g-dot" cx="36" cy="14" r="2" />
        <circle className="g-dot" cx="36" cy="24" r="2" />
        <circle className="g-dot" cx="36" cy="34" r="2" />
      </g>
      <path
        className="g-accent g-check"
        d="M19 24.5l3.5 3.5 6.5-7.5"
        pathLength={1}
      />
    </>
  ),

  // Data in motion: records flow along a line; one fades out (a delete).
  stream: (
    <>
      <line className="g-base" x1="2" y1="24" x2="46" y2="24" />
      <g className="g-flow">
        <circle className="g-dot" cx="6" cy="24" r="2" />
        <circle className="g-dot" cx="16" cy="24" r="2" />
        <circle className="g-dot g-flow-delete" cx="26" cy="24" r="2" />
        <circle className="g-dot" cx="36" cy="24" r="2" />
      </g>
    </>
  ),

  // Automating the tedious: a loop that completes one turn on its own.
  loop: (
    <>
      <rect className="g-base" x="21" y="21" width="6" height="6" rx="1.5" />
      <g className="g-loop">
        <path className="g-accent" d="M24 12A12 12 0 1 1 13.61 18" />
        <path className="g-accent" d="M9.71 20.25L13.61 18L13.61 22.5" />
      </g>
    </>
  ),

  // Life after launch: a steady line, one blip passes through.
  pulse: (
    <>
      <path className="g-base" d="M4 24H17L20.5 15L25 33L28.5 24H44" />
      <path
        className="g-accent g-pulse"
        d="M4 24H17L20.5 15L25 33L28.5 24H44"
        pathLength={100}
      />
    </>
  ),

  // Language models that earn their place: model (accent) weighed against
  // plain rules (ink); the beam tips, then settles level.
  balance: (
    <>
      <path className="g-base" d="M24 14V38M16 38H32" />
      <g className="g-beam">
        <path className="g-base" d="M10 14H38" />
        <path className="g-accent" d="M12 14L8 23M12 14L16 23M7 23Q12 28 17 23" />
        <path className="g-base" d="M36 14L32 23M36 14L40 23M31 23Q36 28 41 23" />
      </g>
      <circle className="g-dot-base" cx="24" cy="14" r="1.75" />
    </>
  ),
};

export function InterestGlyph({
  name,
  className = "",
}: {
  name: GlyphName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden
      focusable="false"
      className={`glyph glyph-${name} ${className}`}
    >
      {GLYPHS[name]}
    </svg>
  );
}
