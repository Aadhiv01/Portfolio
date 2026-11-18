import { existsSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import certifications from "./certifications.json";
import education from "./education.json";
import experience from "./experience.json";
import expertise from "./expertise.json";
import impact from "./impact.json";
import profile from "./profile.json";
import projects from "./projects.json";
import resumeSkills from "./resume-skills.json";
import { validateContent, type ContentBundle } from "./schema";
import skills from "./skills.json";
import vision from "./vision.json";
import { interestGlyphNames } from "../lib/interest-glyph-names";

const bundle = {
  profile,
  skills,
  expertise,
  experience,
  projects,
  impact,
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

/** Every bullet on the page, with the employer it sits under. */
const bullets = experience.flatMap((entry) =>
  entry.highlights.map((highlight) => ({ company: entry.company, text: highlight.text })),
);

/** The prose written for the page, as opposed to dates and proper nouns. */
const proseFields = (): { where: string; text: string }[] => [
  { where: "profile.headline", text: profile.headline },
  { where: "profile.contactIntro", text: profile.contactIntro },
  ...profile.summary.map((text, index) => ({ where: `profile.summary[${index}]`, text })),
  ...expertise.map((card) => ({ where: `interest "${card.title}"`, text: `${card.title} ${card.description}` })),
  ...experience.map((entry) => ({ where: `${entry.company} summary`, text: entry.summary })),
  ...impact.map((item) => ({ where: `impact "${item.capability}"`, text: item.line })),
  ...bullets.map((bullet) => ({ where: `${bullet.company} bullet`, text: bullet.text })),
];

/** Everything that can reach the rendered page. Legacy fields and the parked vision cards are excluded. */
const renderedText = (): string => {
  const visibleProfile = {
    name: profile.name,
    headline: profile.headline,
    roles: profile.roles,
    summary: profile.summary,
    contactIntro: profile.contactIntro,
  };

  return JSON.stringify({
    visibleProfile,
    skills,
    expertise,
    experience,
    projects,
    impact,
    certifications,
    education,
  });
};

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
      expect("note" in claim ? claim.note : undefined).toContain("[[TODO:");
    }
  });

  it("publishes real copy in every field the page renders", () => {
    expect(profile.summaryStatus).toBe("current");
    expect("summaryNote" in profile ? profile.summaryNote : undefined).toBeUndefined();

    for (const copy of [profile.headline, profile.contactIntro, ...profile.summary]) {
      expect(copy).not.toContain("[[TODO:");
    }
  });

  it("does not carry unmeasured impact copy on projects", () => {
    for (const project of projects) {
      expect(Object.keys(project)).not.toContain("impact");
    }
  });

  it("shows certifications without dates", () => {
    for (const certification of certifications) {
      expect(Object.keys(certification)).not.toContain("year");
    }
  });
});

describe("skills", () => {
  const listed = new Set(resumeSkills.union.map((skill) => skill.toLowerCase()));
  const bulletText = bullets.map((bullet) => bullet.text).join(" \n ").toLowerCase();

  it("lists only skills found in at least one résumé variant or in a résumé bullet", () => {
    for (const group of skills) {
      for (const item of group.items) {
        const key = item.toLowerCase();
        expect(
          listed.has(key) || bulletText.includes(key),
          `${group.label}: "${item}" is on no résumé variant and in no bullet`,
        ).toBe(true);
      }
    }
  });

  it("leaves out tools every engineer is assumed to know", () => {
    const assumed = ["Git", "GitHub", "JIRA", "Agile/Scrum", "IntelliJ", "VS Code", "Postman", "Data lake"];
    const all = skills.flatMap((group) => group.items);

    for (const item of assumed) {
      expect(all, `"${item}" reads junior on a portfolio`).not.toContain(item);
    }
  });

  it("orders the rows by the story of the work", () => {
    expect(skills.slice(0, 4).map((group) => group.label)).toEqual([
      "Languages",
      "Backend",
      "Data and streaming",
      "Frontend",
    ]);
  });

  it("lists each skill once", () => {
    const all = skills.flatMap((group) => group.items.map((item) => item.toLowerCase()));
    expect(new Set(all).size).toBe(all.length);
  });
});

describe("the never-claim list", () => {
  /** Things the owner has said never to claim. A skill that is only being learned does not belong on the page. */
  const neverClaim = [
    "Docker", "Helm", "Fargate", "API Gateway", "CloudWatch", "Datadog", "Splunk",
    "Dynatrace", "OpenTelemetry", "Spring Security", "OIDC", "SAML", "LDAP",
    "Secrets Manager", "Vault", "GitHub Actions", "CDK", "Scala", "Spark",
    "Databricks", "Azure", "FastAPI", "Playwright", "React Testing Library",
    "Codex", "WCAG", "Infor", "Golang", "Rust",
  ];

  it("appears nowhere on the rendered page", () => {
    const text = renderedText();

    for (const term of neverClaim) {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      expect(new RegExp(`\\b${escaped}\\b`, "i").test(text), `"${term}" is on the never-claim list`).toBe(false);
    }
  });
});

describe("résumé writing rules, applied to the page", () => {
  it("keeps colons and dashes out of every bullet", () => {
    for (const bullet of bullets) {
      expect(bullet.text, `${bullet.company}: colon`).not.toMatch(/:/);
      expect(bullet.text, `${bullet.company}: dash`).not.toMatch(/[–—]| - /);
    }
  });

  it("never puts Java and Python in the same bullet", () => {
    for (const bullet of bullets) {
      const both = /\bJava\b/.test(bullet.text) && /\bPython\b/.test(bullet.text);
      expect(both, `${bullet.company}: ${bullet.text}`).toBe(false);
    }
  });

  it("keeps em dashes and colons out of the prose written for the page", () => {
    for (const field of proseFields()) {
      expect(field.text, `${field.where}: em or en dash`).not.toMatch(/[–—]/);
      expect(field.text, `${field.where}: colon`).not.toMatch(/:/);
    }
  });
});

describe("the longest role", () => {
  const goldman = experience.find((entry) => entry.company === "Goldman Sachs");

  it("is shown in three themed groups of 3, 2 and 4 bullets", () => {
    expect(goldman).toBeDefined();
    const groups = new Map<string, number>();

    for (const highlight of goldman?.highlights ?? []) {
      const group = "group" in highlight ? highlight.group : undefined;
      expect(group, `ungrouped bullet: ${highlight.text}`).toBeDefined();
      groups.set(group as string, (groups.get(group as string) ?? 0) + 1);
    }

    expect([...groups]).toEqual([
      ["Data movement", 3],
      ["Platform services", 2],
      ["Reliability and team", 4],
    ]);
  });
});

describe("selected impact", () => {
  it("traces every card to verified résumé bullets, verbatim", () => {
    for (const item of impact) {
      for (const source of item.sources) {
        const entry = experience.find((candidate) => candidate.company === source.company);
        expect(entry, `impact "${item.capability}": no entry for ${source.company}`).toBeDefined();

        const match = entry?.highlights.find((highlight) => highlight.text === source.text);
        expect(match, `impact "${item.capability}": no matching bullet`).toBeDefined();
        expect(match?.verified).toBe(true);
      }
    }
  });

  it("only headlines numbers that a source bullet states", () => {
    for (const item of impact) {
      const sourceText = item.sources.map((source) => source.text).join(" ");

      for (const figure of item.heading.match(/~?\d[\d.,]*[+%]?/g) ?? []) {
        expect(sourceText, `impact "${item.capability}": "${figure}" is in no source`).toContain(figure);
      }
    }
  });

  it("draws on at least three different employers across the cards", () => {
    const companies = new Set(impact.flatMap((item) => item.sources.map((source) => source.company)));
    expect(companies.size).toBeGreaterThanOrEqual(3);
  });
});

describe("areas of interest", () => {
  const employers = /Goldman|Utah|Grid Elevated|JPMorgan|JPMC|Wiley/i;

  it("has six cards", () => {
    expect(expertise).toHaveLength(6);
  });

  it("is written as interests, with no numbers or employer names", () => {
    for (const card of expertise) {
      expect(card.description, `${card.title}: digits`).not.toMatch(/\d/);
      expect(`${card.title} ${card.description}`, `${card.title}: employer`).not.toMatch(employers);
    }
  });

  it("gives every card a drawing that exists", () => {
    for (const card of expertise) {
      expect(
        (interestGlyphNames as readonly string[]).includes(card.icon),
        `no drawing named: ${card.icon}`,
      ).toBe(true);
    }
  });

  it("uses a different drawing and title on every card", () => {
    expect(new Set(expertise.map((card) => card.icon)).size).toBe(expertise.length);
    expect(new Set(expertise.map((card) => card.title)).size).toBe(expertise.length);
  });
});
