import certifications from "./certifications.json";
import education from "./education.json";
import experience from "./experience.json";
import expertise from "./expertise.json";
import profile from "./profile.json";
import projects from "./projects.json";
import { validateContent, type ContentBundle } from "./schema";
import vision from "./vision.json";

const raw: unknown = {
  profile,
  expertise,
  experience,
  projects,
  certifications,
  education,
  vision,
};

const errors = validateContent(raw);

if (errors.length > 0) {
  throw new Error(`Invalid content:\n- ${errors.join("\n- ")}`);
}

/**
 * The single typed content bundle. Pages import from here and never from the
 * JSON files directly, so a schema error fails the build.
 */
export const content = raw as ContentBundle;
