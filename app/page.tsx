import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowDown, Download } from "lucide-react";

import { CopyEmail } from "@/components/copy-email";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { InterestGlyph, type GlyphName } from "@/components/interest-glyph";
import { ProjectRow } from "@/components/project-row";
import { SectionHeading } from "@/components/section-heading";
import { TechnicalSkills } from "@/components/technical-skills";
import { Button } from "@/components/ui/button";
import { content } from "@/content";
import { assetUrl, currentRole, roleId } from "@/lib/content-selectors";

/** One rhythm for every section: 64px of padding on a phone, 96px on a desktop. */
const SECTION = "mx-auto w-full max-w-[1120px] px-5 py-16 md:px-8 md:py-24";

/* Stagger for the scroll-driven reveal: shifts an element's animation range
   later, so items revealed together do not move in lockstep. */
const revealDelay = (milliseconds: number) =>
  ({ "--reveal-from": `${milliseconds / 10}%` }) as CSSProperties;

const [firstName, ...restOfName] = content.profile.name.split(" ");
const lastName = restOfName.join(" ");

const currentSince = currentRole.start.split(" ").at(-1) ?? currentRole.start;

const handleFromUrl = (url: string) => url.split("/").filter(Boolean).at(-1) ?? "";
const linkedinHandle = handleFromUrl(content.profile.links.linkedin);
const githubHandle = handleFromUrl(content.profile.links.github);

export default function HomePage() {
  return (
    <main id="main">
      <section
        aria-labelledby="hero-title"
        className="relative overflow-hidden border-b border-rule"
      >
        <div className="mx-auto grid w-full max-w-[1120px] gap-x-10 gap-y-8 px-5 py-16 md:px-8 md:py-24 md:grid-cols-12 lg:min-h-[calc(100svh-4rem)] lg:content-center lg:gap-y-6 lg:py-24">
          <p className="font-mono text-[0.72rem] font-medium uppercase tracking-[0.12em] text-quiet md:col-span-7 md:row-start-1">
            {currentRole.role} at {currentRole.company} · since {currentSince}
          </p>

          <div className="md:col-span-7 md:row-start-2">
            <h1
              id="hero-title"
              className="font-serif text-[clamp(3rem,8.5vw,6.5rem)] font-medium leading-[0.92] tracking-[-0.035em]"
            >
              <span className="block">{firstName}</span>
              <span className="block italic text-accent">{lastName}</span>
            </h1>

            <p className="mt-8 max-w-xl font-serif text-[clamp(1.3rem,2.2vw,1.65rem)] leading-snug">
              {content.profile.headline}
            </p>

            <div className="mt-5 flex max-w-xl flex-col gap-3 text-[1.05rem] leading-relaxed text-quiet">
              {content.profile.summary.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-4">
              <Button asChild size="lg">
                <a href={`mailto:${content.profile.email}`}>Email me</a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a
                  href={assetUrl(content.profile.resume)}
                  download="Aadhithya-Vijayakumar-Resume.pdf"
                >
                  Résumé
                  <Download aria-hidden className="size-4" />
                </a>
              </Button>
              <Link
                href="#impact"
                className="inline-flex items-center gap-1.5 px-1 font-serif text-[0.95rem] text-quiet transition-colors hover:text-accent max-md:min-h-11"
              >
                See my work
                <ArrowDown aria-hidden className="size-4" />
              </Link>
            </div>
          </div>

          {/* A transparent cut-out over a flat backdrop, so the face keeps its natural
              brightness while only the backdrop follows the theme. */}
          <div className="relative min-h-[24rem] w-full max-w-sm overflow-hidden border border-rule bg-card dark:bg-[#171c27] md:col-span-5 md:col-start-8 md:row-start-2 md:min-h-0 md:max-w-none">
            <Image
              src={assetUrl(content.profile.photo)}
              alt={`${content.profile.name} portrait`}
              fill
              priority
              quality={85}
              sizes="(min-width: 768px) 36vw, 90vw"
              className="object-cover object-top"
            />
          </div>
        </div>
      </section>

      <section
        id="impact"
        aria-labelledby="impact-title"
        className="scroll-mt-24 border-b border-rule"
      >
        <div className={SECTION}>
          <SectionHeading
            id="impact-title"
            title="Selected impact"
            dek="Systems I changed, and what changed because of them."
          />
          <ul className="grid gap-px border border-rule bg-rule sm:grid-cols-2">
            {content.impact.map((item, index) => {
              const companies = [...new Set(item.sources.map((source) => source.company))];

              return (
                <li
                  key={item.capability}
                  data-reveal
                  style={revealDelay(index * 60)}
                  className="spot flex flex-col bg-paper p-6 md:p-8"
                >
                  <p className="font-mono text-[0.72rem] font-medium uppercase tracking-[0.12em] text-quiet">
                    {item.capability}
                  </p>
                  <h3 className="mt-4 font-serif text-[clamp(1.4rem,2vw,1.85rem)] leading-tight tracking-[-0.01em] [text-wrap:balance]">
                    {item.heading}
                  </h3>
                  <p className="mt-4 text-[1.02rem] leading-relaxed text-quiet">
                    {item.line}
                  </p>
                  <p className="mt-auto pt-6 text-[0.95rem]">
                    {companies.map((company, position) => (
                      <span key={company}>
                        {position > 0 ? " \u00B7 " : null}
                        <a
                          href={`#${roleId(company)}`}
                          className="underline decoration-rule decoration-1 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                        >
                          {company}
                        </a>
                      </span>
                    ))}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section
        id="experience"
        aria-labelledby="experience-title"
        className="scroll-mt-24"
      >
        <div className={SECTION}>
          <SectionHeading
            id="experience-title"
            title="Experience"
            dek="Five roles across banking, payments, a university and two internships."
          />
          <ExperienceTimeline entries={content.experience} />
        </div>
      </section>

      <section
        id="skills"
        aria-labelledby="skills-title"
        className="scroll-mt-24 border-t border-rule"
      >
        <div className={SECTION}>
          <SectionHeading
            id="skills-title"
            title="Skills"
            dek="Languages, frameworks and platforms I've shipped with."
          />
          <TechnicalSkills />
        </div>
      </section>

      <section id="work" aria-labelledby="work-title" className="scroll-mt-24 border-t border-rule">
        <div className={SECTION}>
          <SectionHeading
            id="work-title"
            title="Projects"
            dek="Personal projects, with the code on GitHub."
          />
          {content.projects.map((project, index) => (
            <div key={project.slug} data-reveal style={revealDelay(60)}>
              <ProjectRow project={project} index={index} />
            </div>
          ))}
        </div>
      </section>

      <section
        id="interests"
        aria-labelledby="interests-title"
        className="scroll-mt-24 border-t border-rule"
      >
        <div className={SECTION}>
          <SectionHeading
            id="interests-title"
            title="Areas of interest"
            dek="What I keep coming back to, and what I'm exploring next."
          />
          <div className="grid gap-px border-b border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
            {content.expertise.map((area) => (
              <article
                key={area.title}
                data-reveal
                className="spot glyph-host bg-paper p-6 md:p-8"
              >
                <InterestGlyph name={area.icon as GlyphName} />
                <h3 className="mt-6 font-serif text-2xl leading-tight [text-wrap:balance]">
                  {area.title}
                </h3>
                <p className="mt-3 text-[1.02rem] leading-relaxed text-quiet [text-wrap:pretty]">
                  {area.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="credentials"
        aria-labelledby="credentials-title"
        className="scroll-mt-24 border-t border-rule"
      >
        <div className={SECTION}>
          <SectionHeading
            id="credentials-title"
            title="Credentials"
            dek="Certifications and education."
          />

          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <div data-reveal>
              <h3 className="font-mono text-[0.72rem] font-medium uppercase tracking-[0.14em] text-quiet">
                Certifications
              </h3>
              <ul className="mt-5 border-y border-rule">
                {content.certifications.map((certification) => (
                  <li
                    key={certification.name}
                    className="flex items-center gap-4 border-b border-rule py-4 last:border-b-0"
                  >
                    <span className="grid size-12 shrink-0 place-items-center border border-rule bg-white p-1.5">
                      <Image
                        src={assetUrl(certification.logo)}
                        alt={`${certification.issuer} logo`}
                        width={80}
                        height={80}
                        className="size-full object-contain"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-serif text-lg leading-tight">
                        {certification.name}
                      </span>
                      <span className="mt-1 block font-mono text-[0.72rem] tracking-[0.02em] text-quiet">
                        {certification.issuer}
                      </span>
                    </span>
                    {certification.credentialUrl ? (
                      <a
                        href={certification.credentialUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="font-mono text-[0.72rem] font-medium uppercase tracking-[0.12em] text-accent underline decoration-rule decoration-1 underline-offset-4 transition-colors hover:decoration-accent"
                      >
                        Verify
                        <span className="sr-only"> (opens in new tab)</span>
                      </a>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>

            <div data-reveal style={revealDelay(100)}>
              <h3 className="font-mono text-[0.72rem] font-medium uppercase tracking-[0.14em] text-quiet">
                Education
              </h3>
              <ul className="mt-5 border-y border-rule">
                {content.education.map((entry) => (
                  <li
                    key={`${entry.degree}-${entry.institution}`}
                    className="border-b border-rule py-4 last:border-b-0"
                  >
                    <p className="font-serif text-lg leading-tight">
                      {entry.degree}
                    </p>
                    <p className="mt-1 font-mono text-[0.72rem] tracking-[0.02em] text-quiet">
                      {entry.institution} · {entry.location} · {entry.date}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="scroll-mt-24 border-t border-rule bg-invert text-invert-foreground"
      >
        <div className={SECTION}>
          <div data-reveal>
            <h2 className="font-serif text-[clamp(2.5rem,7vw,5rem)] leading-[0.95] tracking-[-0.02em]">
              Let&apos;s talk.
            </h2>
            <p className="mt-4 max-w-xl text-[1.05rem] leading-relaxed text-invert-foreground/75">
              {content.profile.contactIntro} The fastest way to reach me is email.
            </p>

            <CopyEmail
              email={content.profile.email}
              className="group mt-10 flex max-w-full items-center gap-3 border-b border-invert-foreground/25 pb-3 font-serif text-[clamp(1rem,4vw,2.75rem)] leading-[1.1] tracking-[-0.01em] transition-colors duration-300 hover:border-accent-invert hover:text-accent-invert"
            />

            <ul className="mt-2">
              <li>
                <a
                  href={content.profile.links.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex items-center justify-between gap-4 border-b border-invert-foreground/15 py-4 font-mono text-[0.72rem] font-medium uppercase tracking-[0.12em] transition-colors duration-300 hover:text-accent-invert"
                >
                  <span>LinkedIn</span>
                  <span className="flex items-center gap-2 text-invert-foreground/70">
                    <span className="lowercase">{linkedinHandle}</span>
                    <span aria-hidden className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </span>
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </li>
              <li>
                <a
                  href={content.profile.links.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex items-center justify-between gap-4 border-b border-invert-foreground/15 py-4 font-mono text-[0.72rem] font-medium uppercase tracking-[0.12em] transition-colors duration-300 hover:text-accent-invert"
                >
                  <span>GitHub</span>
                  <span className="flex items-center gap-2 text-invert-foreground/70">
                    <span className="lowercase">{githubHandle}</span>
                    <span aria-hidden className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </span>
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </li>
              <li>
                <a
                  href={assetUrl(content.profile.resume)}
                  download="Aadhithya-Vijayakumar-Resume.pdf"
                  className="group flex items-center justify-between gap-4 border-b border-invert-foreground/15 py-4 font-mono text-[0.72rem] font-medium uppercase tracking-[0.12em] transition-colors duration-300 hover:text-accent-invert"
                >
                  <span>Résumé</span>
                  <span className="flex items-center gap-2 text-invert-foreground/70">
                    PDF
                    <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-y-0.5">
                      ↓
                    </span>
                  </span>
                </a>
              </li>
            </ul>

            <div className="mt-16 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-invert-foreground/15 pt-5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-invert-foreground/55">
              <p>© 2026 {content.profile.name}</p>
              <a
                href="#main"
                className="inline-flex items-center gap-2 transition-colors duration-300 hover:text-accent-invert"
              >
                Back to top
                <span aria-hidden>↑</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
