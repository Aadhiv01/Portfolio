import Image from "next/image";

import type { Project } from "@/content/schema";
import { assetUrl } from "@/lib/content-selectors";
import { cn } from "@/lib/utils";

interface ProjectRowProps {
  project: Project;
  index: number;
}

export function ProjectRow({ project, index }: ProjectRowProps) {
  const reversed = index % 2 === 1;

  return (
    <article className="grid gap-6 border-t border-rule py-8 first:border-t-0 first:pt-0 md:grid-cols-12 md:gap-10 md:py-12 md:first:pt-0">
      <div
        className={cn(
          "relative col-span-12 overflow-hidden border border-rule bg-card md:col-span-7",
          reversed && "md:order-2",
        )}
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={assetUrl(project.image)}
            alt={`${project.title} illustration`}
            fill
            sizes="(min-width: 768px) 58vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div
        className={cn(
          "col-span-12 flex flex-col md:col-span-5",
          reversed && "md:order-1",
        )}
      >
        <h3 className="font-serif text-[clamp(1.6rem,2.4vw,2.1rem)] leading-tight">
          {project.title}
        </h3>

        <p className="mt-3 text-[1.05rem] leading-relaxed text-quiet">
          {project.summary}
        </p>

        <ul className="mt-5 space-y-2 border-t border-rule pt-5 text-[1rem] leading-relaxed">
          {project.features.slice(0, 3).map((feature) => (
            <li key={feature} className="flex gap-3">
              <span aria-hidden className="mt-[0.62rem] size-1 shrink-0 bg-quiet" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <ul className="mt-5 flex flex-wrap gap-2">
          {project.tech.map((technology) => (
            <li
              key={technology}
              className="border border-rule px-2 py-1 font-mono text-[0.7rem] font-medium uppercase tracking-[0.1em] text-quiet"
            >
              {technology}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <a
            href={project.repo}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center font-mono text-[0.72rem] font-medium uppercase tracking-[0.12em] text-ink underline decoration-rule decoration-1 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent max-md:min-h-11"
          >
            GitHub
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        </div>
      </div>
    </article>
  );
}
