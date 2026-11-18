import { content } from "@/content";

/**
 * A flat, always-visible skills list. Skills belong to the person, not to one
 * employer, so nothing is tied to a role: the experience bullets carry the
 * evidence. Every skill is shown at full weight, because a recruiter scanning for
 * one word should find it, and inside each row the order follows how often the
 * jobs being targeted ask for it. Rows follow the story of the work.
 */
export function TechnicalSkills() {
  return (
    <dl className="border-b border-rule">
      {content.skills.map((group) => (
        <div
          key={group.label}
          data-reveal
          className="grid gap-2 border-t border-rule py-5 first:border-t-0 first:pt-0 md:grid-cols-12 md:gap-8"
        >
          <dt className="font-mono text-[0.72rem] font-medium uppercase tracking-[0.12em] text-quiet md:col-span-3">
            {group.label}
          </dt>
          <dd className="text-[1.05rem] leading-relaxed md:col-span-9">
            {group.items.map((item, index) => (
              <span key={item}>
                {item}
                {index < group.items.length - 1 ? (
                  <span className="text-quiet">{"\u00A0\u00B7 "}</span>
                ) : null}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}
