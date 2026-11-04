import { existsSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import certifications from "./certifications.json";
import education from "./education.json";
import experience from "./experience.json";
import expertise from "./expertise.json";
import profile from "./profile.json";
import projects from "./projects.json";
import { validateContent, type ContentBundle } from "./schema";
import vision from "./vision.json";

const bundle = {
  profile,
  expertise,
  experience,
  projects,
  certifications,
  education,
  vision,
};

const assetPaths = (content: ContentBundle): string[] => [
  content.profile.photo,
  content.profile.resume,
  ...content.experience.map((entry) => entry.logo),
  ...content.projects.map((project) => project.image),
  ...content.certifications.map((certification) => certification.logo),
];

describe("content bundle", () => {
  it("matches the schema", () => {
    expect(validateContent(bundle)).toEqual([]);
  });

  it("references only assets that exist under content/", () => {
    for (const assetPath of assetPaths(bundle as ContentBundle)) {
      const absolute = join(process.cwd(), "content", assetPath);
      expect(existsSync(absolute), `missing asset: ${assetPath}`).toBe(true);
    }
  });

  it("gives every unverified claim a TODO note", () => {
    const claims = [
      ...experience.flatMap((entry) => entry.highlights),
      ...projects.flatMap((project) => project.claims),
    ];

    for (const claim of claims.filter((item) => !item.verified)) {
      expect(claim.note).toContain("[[TODO:");
    }
  });

  it("keeps placeholder markers in fields that still need real copy", () => {
    expect(profile.headline).toContain("[[TODO:");
    expect(profile.location).toContain("[[TODO:");
    expect(profile.contactIntro).toContain("[[TODO:");
  });
});
