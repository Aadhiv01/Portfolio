interface SectionHeadingProps {
  title: string;
  /** One line stating the takeaway, so a skimmer gets the point without reading on. */
  dek?: string;
  id?: string;
}

/**
 * The one heading used by every section: a serif title, a quiet one-line dek,
 * and a hairline rule. Selected impact and Skills used to carry a small grey
 * label instead, which made them read as footnotes.
 */
export function SectionHeading({ title, dek, id }: SectionHeadingProps) {
  return (
    <div data-reveal className="mb-8 md:mb-10">
      <div className="border-b border-rule pb-6">
        <h2
          id={id}
          className="font-serif text-[clamp(2rem,3.6vw,3rem)] leading-[1.02] tracking-[-0.02em]"
        >
          {title}
        </h2>
        {dek ? (
          <p className="mt-3 max-w-2xl text-[1.05rem] leading-relaxed text-quiet">
            {dek}
          </p>
        ) : null}
      </div>
    </div>
  );
}
