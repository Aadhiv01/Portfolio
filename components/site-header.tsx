import Link from "next/link";

import { content } from "@/content";
import { SiteNav } from "./site-nav";

const initials = content.profile.name
  .split(" ")
  .map((part) => part[0])
  .slice(0, 2)
  .join("");

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper">
      <div className="mx-auto flex h-16 w-full max-w-[1120px] items-center justify-between px-5 md:px-8">
        <Link
          href="/"
          aria-label={`${initials} — ${content.profile.name}, home`}
          className="group flex items-center gap-3"
        >
          <span className="grid size-9 place-items-center border border-ink bg-ink font-mono text-[0.72rem] font-medium tracking-[0.12em] text-paper transition-colors duration-300 group-hover:border-accent group-hover:bg-accent">
            {initials}
          </span>
          <span className="hidden font-mono text-[0.7rem] font-medium uppercase leading-[1.5] tracking-[0.12em] text-quiet sm:block">
            {content.profile.name.split(" ")[0]}
            <br />
            {content.profile.name.split(" ").slice(1).join(" ")}
          </span>
        </Link>
        <SiteNav />
      </div>
    </header>
  );
}
