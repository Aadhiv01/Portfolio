import { content } from "@/content";
import type { Claim, ExperienceEntry } from "@/content/schema";

/** The current role is the first entry in the content bundle (Aug 2024 to Present). */
export const currentRole = content.experience[0];

/** Display rule: unverified resume claims never reach the DOM. */
export function verifiedHighlights(entry: ExperienceEntry): Claim[] {
  return entry.highlights.filter((highlight) => highlight.verified);
}

export function assetUrl(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

/** "Aug 2024 to Present". Written out so no dash appears in the copy. */
export function rangeLabel(entry: ExperienceEntry): string {
  return `${entry.start} to ${entry.end}`;
}

/** A stable anchor for a role, so impact cards can link to it. */
export function roleId(company: string): string {
  return `role-${company
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}
