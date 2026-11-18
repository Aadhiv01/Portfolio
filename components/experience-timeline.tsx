import Image from "next/image";

import type { Claim, ExperienceEntry } from "@/content/schema";
import {
  assetUrl,
  rangeLabel,
  roleId,
  verifiedHighlights,
} from "@/lib/content-selectors";

/** Bullets in their written order, split into themed groups when they carry one. */
function groupHighlights(highlights: Claim[]) {
  const groups: { name: string | null; items: Claim[] }[] = [];

  for (const highlight of highlights) {
    const name = highlight.group ?? null;
    const last = groups.at(-1);

    if (last && last.name === name) last.items.push(highlight);
    else groups.push({ name, items: [highlight] });
  }

  return groups;
}

/**
 * Experience as a vertical timeline: a rail down the left, a circular dot per
 * role with the company logo inside, and the role beside it. The rail and the
 * dots are drawn by CSS scroll-driven animation (see `.timeline` in
 * globals.css), so there is no script and nothing to hydrate.
 */
export function ExperienceTimeline({ entries }: { entries: ExperienceEntry[] }) {
  return (
    <ol className="timeline">
      {entries.map((entry) => {
        const highlights = verifiedHighlights(entry);

        return (
          <li
            key={`${entry.company}-${entry.start}`}
            id={roleId(entry.company)}
            className="timeline-item scroll-mt-28"
          >
            <span aria-hidden className="timeline-dot">
              <Image
                src={assetUrl(entry.logo)}
                alt=""
                width={96}
                height={96}
                className="size-full object-contain"
              />
            </span>

            <article className="spot timeline-card">
              <p className="font-mono text-[0.72rem] font-medium uppercase tracking-[0.12em] text-quiet">
                {rangeLabel(entry)}
              </p>
              <h3 className="mt-2 font-serif text-[clamp(1.4rem,2.2vw,1.85rem)] leading-tight">
                {entry.role}
              </h3>
              <p className="mt-1 font-serif text-[1.1rem] text-quiet">
                {entry.company}
              </p>

              <p className="mt-4 max-w-[68ch] text-[1.02rem] leading-relaxed text-quiet">
                {entry.summary}
              </p>

              {highlights.length > 0 ? (
                <div className="mt-5 max-w-[68ch] space-y-6">
                  {groupHighlights(highlights).map((group) => (
                    <div key={group.name ?? "all"}>
                      {group.name ? (
                        <h4 className="mb-3 font-mono text-[0.7rem] font-medium uppercase tracking-[0.12em] text-quiet">
                          {group.name}
                        </h4>
                      ) : null}
                      <ul className="space-y-2.5 text-[1rem] leading-relaxed">
                        {group.items.map((highlight) => (
                          <li key={highlight.text} className="flex gap-3">
                            <span
                              aria-hidden
                              className="mt-[0.62rem] size-1 shrink-0 bg-quiet"
                            />
                            <span>{highlight.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : null}
            </article>
          </li>
        );
      })}
    </ol>
  );
}
