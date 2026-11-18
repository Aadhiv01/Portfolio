/**
 * Content schema for the portfolio.
 *
 * Rules (see CLAUDE.md):
 * - Never invent facts. Unknown values are the literal string "[[TODO: ...]]".
 * - Every claim that is not verified carries `verified: false` and an
 *   explanatory `note` with a TODO describing what evidence is needed.
 * - Pages read from /content only; they never hardcode copy.
 */

export type ClaimSource = "legacy-site" | "resume";

export interface Claim {
  text: string;
  source: ClaimSource;
  verified: boolean;
  note?: string;
  /** Optional theme heading the bullet is shown under (used for the longest role). */
  group?: string;
}

export interface Phone {
  number: string;
  display: boolean;
  note: string;
}

export interface ProfileLinks {
  linkedin: string;
  github: string;
}

export interface Profile {
  name: string;
  headline: string;
  legacyTagline: string;
  roles: string[];
  summary: string[];
  summaryStatus: "legacy" | "current";
  /** Present only while the summary is still legacy copy awaiting a rewrite. */
  summaryNote?: string;
  /** Optional: the owner is open to relocation, so no location is published. */
  location?: string;
  email: string;
  phone: Phone;
  links: ProfileLinks;
  photo: string;
  resume: string;
  contactIntro: string;
  legacyContactIntro: string;
}

export interface ExpertiseArea {
  /** A lucide-react icon name, resolved by the page. Decorative only. */
  icon: string;
  title: string;
  description: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface ExperienceEntry {
  company: string;
  role: string;
  start: string;
  end: string;
  summary: string;
  highlights: Claim[];
  logo: string;
  notes?: string;
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  features: string[];
  tech: string[];
  repo: string;
  demo: string | null;
  image: string;
  claims: Claim[];
}

/** One bullet an impact card is condensed from. `text` must be a verified bullet, verbatim. */
export interface ImpactSource {
  company: string;
  text: string;
}

/**
 * One card in the home page's "Selected impact" block. `line` is the short
 * display wording and `heading` is a short outcome with its figure inside it. Each source is
 * the exact text of a verified highlight under its company in experience.json,
 * which a test enforces, so a card can never claim more than the résumé bullets
 * it is condensed from. Digits in `heading` must appear in a source.
 */
export interface ImpactItem {
  capability: string;
  heading: string;
  line: string;
  sources: ImpactSource[];
}

export interface Certification {
  name: string;
  issuer: string;
  credentialUrl: string | null;
  credentialNote?: string;
  logo: string;
}

export interface EducationEntry {
  degree: string;
  institution: string;
  location: string;
  date: string;
}

export interface VisionCard {
  title: string;
  body: string;
  status: "legacy";
  note: string;
}

export interface ContentBundle {
  profile: Profile;
  skills: SkillGroup[];
  expertise: ExpertiseArea[];
  experience: ExperienceEntry[];
  projects: Project[];
  impact: ImpactItem[];
  certifications: Certification[];
  education: EducationEntry[];
  vision: VisionCard[];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.length > 0 && value.every(isNonEmptyString);

const isClaim = (value: unknown): value is Claim => {
  if (!isRecord(value)) return false;
  if (!isNonEmptyString(value.text)) return false;
  if (value.source !== "legacy-site" && value.source !== "resume") return false;
  if (typeof value.verified !== "boolean") return false;
  if (value.note !== undefined && !isNonEmptyString(value.note)) return false;
  if (value.group !== undefined && !isNonEmptyString(value.group)) return false;
  return !(value.verified === false && !isNonEmptyString(value.note));
};

const isClaimArray = (value: unknown): value is Claim[] =>
  Array.isArray(value) && value.length > 0 && value.every(isClaim);

const isProfile = (value: unknown): value is Profile => {
  if (!isRecord(value)) return false;
  return (
    isNonEmptyString(value.name) &&
    isNonEmptyString(value.headline) &&
    isNonEmptyString(value.legacyTagline) &&
    isStringArray(value.roles) &&
    isStringArray(value.summary) &&
    (value.summaryStatus === "legacy" || value.summaryStatus === "current") &&
    (value.summaryNote === undefined || isNonEmptyString(value.summaryNote)) &&
    (value.location === undefined || isNonEmptyString(value.location)) &&
    isNonEmptyString(value.email) &&
    isRecord(value.phone) &&
    isNonEmptyString(value.phone.number) &&
    typeof value.phone.display === "boolean" &&
    isNonEmptyString(value.phone.note) &&
    isRecord(value.links) &&
    isNonEmptyString(value.links.linkedin) &&
    isNonEmptyString(value.links.github) &&
    isNonEmptyString(value.photo) &&
    isNonEmptyString(value.resume) &&
    isNonEmptyString(value.contactIntro) &&
    isNonEmptyString(value.legacyContactIntro)
  );
};

const isSkillGroup = (value: unknown): value is SkillGroup =>
  isRecord(value) &&
  isNonEmptyString(value.label) &&
  isStringArray(value.items);

const isExpertiseArea = (value: unknown): value is ExpertiseArea =>
  isRecord(value) &&
  isNonEmptyString(value.icon) &&
  isNonEmptyString(value.title) &&
  isNonEmptyString(value.description);

const isExperienceEntry = (value: unknown): value is ExperienceEntry => {
  if (!isRecord(value)) return false;
  return (
    isNonEmptyString(value.company) &&
    isNonEmptyString(value.role) &&
    isNonEmptyString(value.start) &&
    isNonEmptyString(value.end) &&
    isNonEmptyString(value.summary) &&
    isClaimArray(value.highlights) &&
    isNonEmptyString(value.logo) &&
    (value.notes === undefined || isNonEmptyString(value.notes))
  );
};

const isProject = (value: unknown): value is Project => {
  if (!isRecord(value)) return false;
  return (
    isNonEmptyString(value.slug) &&
    isNonEmptyString(value.title) &&
    isNonEmptyString(value.summary) &&
    isStringArray(value.features) &&
    isStringArray(value.tech) &&
    isNonEmptyString(value.repo) &&
    (value.demo === null || isNonEmptyString(value.demo)) &&
    isNonEmptyString(value.image) &&
    Array.isArray(value.claims) &&
    value.claims.every(isClaim)
  );
};

const isImpactSource = (value: unknown): value is ImpactSource =>
  isRecord(value) && isNonEmptyString(value.company) && isNonEmptyString(value.text);

const isImpactItem = (value: unknown): value is ImpactItem =>
  isRecord(value) &&
  isNonEmptyString(value.capability) &&
  isNonEmptyString(value.heading) &&
  isNonEmptyString(value.line) &&
  Array.isArray(value.sources) &&
  value.sources.length > 0 &&
  value.sources.every(isImpactSource);

const isCertification = (value: unknown): value is Certification => {
  if (!isRecord(value)) return false;
  return (
    isNonEmptyString(value.name) &&
    isNonEmptyString(value.issuer) &&
    (value.credentialUrl === null || isNonEmptyString(value.credentialUrl)) &&
    (value.credentialNote === undefined || isNonEmptyString(value.credentialNote)) &&
    isNonEmptyString(value.logo)
  );
};

const isEducationEntry = (value: unknown): value is EducationEntry =>
  isRecord(value) &&
  isNonEmptyString(value.degree) &&
  isNonEmptyString(value.institution) &&
  isNonEmptyString(value.location) &&
  isNonEmptyString(value.date);

const isVisionCard = (value: unknown): value is VisionCard =>
  isRecord(value) &&
  isNonEmptyString(value.title) &&
  isNonEmptyString(value.body) &&
  value.status === "legacy" &&
  isNonEmptyString(value.note);

/**
 * Runtime validation used by tests and any future content loader.
 * Returns a list of human-readable errors; empty means valid.
 */
export function validateContent(input: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(input)) return ["content: expected an object"];

  if (!isProfile(input.profile)) errors.push("profile: invalid shape");

  if (!Array.isArray(input.skills) || input.skills.length === 0 || !input.skills.every(isSkillGroup)) {
    errors.push("skills: expected a non-empty array of {label, items}");
  }

  if (!Array.isArray(input.expertise) || !input.expertise.every(isExpertiseArea)) {
    errors.push("expertise: expected a non-empty array of {icon, title, description}");
  }

  if (!Array.isArray(input.experience) || !input.experience.every(isExperienceEntry)) {
    errors.push("experience: invalid entry");
  }

  if (!Array.isArray(input.projects) || !input.projects.every(isProject)) {
    errors.push("projects: invalid entry");
  } else {
    const slugs = input.projects.map((project) => (project as Project).slug);
    if (new Set(slugs).size !== slugs.length) errors.push("projects: duplicate slug");
  }

  if (!Array.isArray(input.impact) || input.impact.length === 0 || !input.impact.every(isImpactItem)) {
    errors.push("impact: expected a non-empty array of {capability, heading, line, sources}");
  }

  if (!Array.isArray(input.certifications) || !input.certifications.every(isCertification)) {
    errors.push("certifications: invalid entry");
  }

  if (!Array.isArray(input.education) || !input.education.every(isEducationEntry)) {
    errors.push("education: invalid entry");
  }

  if (!Array.isArray(input.vision) || !input.vision.every(isVisionCard)) {
    errors.push("vision: invalid entry");
  }

  return errors;
}

export const TODO_MARKER = "[[TODO:";
