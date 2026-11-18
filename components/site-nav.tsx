"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { content } from "@/content";
import { assetUrl } from "@/lib/content-selectors";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/#impact", label: "Impact", id: "impact" },
  { href: "/#experience", label: "Experience", id: "experience" },
  { href: "/#skills", label: "Skills", id: "skills" },
  { href: "/#work", label: "Projects", id: "work" },
  { href: "/#interests", label: "Interests", id: "interests" },
  { href: "/#credentials", label: "Credentials", id: "credentials" },
  { href: "/#contact", label: "Contact", id: "contact" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const marker = window.scrollY + window.innerHeight * 0.35;
      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 4;

      if (atBottom) {
        setActive("contact");
        return;
      }

      let current: string | null = null;
      for (const link of links) {
        const section = document.getElementById(link.id);
        if (section && section.offsetTop <= marker) current = link.id;
      }
      setActive(current);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const initial = requestAnimationFrame(update);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      cancelAnimationFrame(initial);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <>
      <nav aria-label="Primary" className="hidden items-center lg:flex">
        {links.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className={cn(
              "sweep relative px-3 py-2 font-mono text-[0.72rem] font-medium uppercase tracking-[0.12em] text-quiet transition-colors duration-200 hover:text-ink",
              pathname === "/" && active === link.id && "text-ink",
            )}
          >
            {link.label}
            <span
              aria-hidden
              className={cn(
                "absolute inset-x-3 -bottom-px h-px origin-left bg-accent transition-transform duration-300",
                pathname === "/" && active === link.id
                  ? "scale-x-100"
                  : "scale-x-0",
              )}
            />
          </Link>
        ))}
      </nav>

      <div className="ml-2 hidden items-center gap-2 lg:flex">
        <ThemeToggle />
        <Button asChild variant="outline" size="sm">
          <a
            href={assetUrl(content.profile.resume)}
            download="Aadhithya-Vijayakumar-Resume.pdf"
          >
            Résumé
          </a>
        </Button>
      </div>

      <div className="flex items-center gap-2 lg:hidden">
        <ThemeToggle />
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="grid size-10 place-items-center border border-rule text-ink transition-colors hover:border-accent hover:text-accent max-lg:size-11"
        >
          {menuOpen ? (
            <X aria-hidden className="size-4" />
          ) : (
            <Menu aria-hidden className="size-4" />
          )}
        </button>
      </div>

      {menuOpen ? (
        <div
          id="mobile-nav"
          className="absolute inset-x-0 top-full border-b border-rule bg-paper lg:hidden"
        >
          <nav aria-label="Mobile" className="px-5 py-4">
            <ul className="divide-y divide-rule">
              {links.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between py-3 font-mono text-xs font-medium uppercase tracking-[0.12em] text-ink"
                  >
                    {link.label}
                    <span aria-hidden className="text-accent">
                      ↗
                    </span>
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${content.profile.email}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between py-3 font-mono text-xs font-medium uppercase tracking-[0.12em] text-ink"
                >
                  Email
                  <span aria-hidden className="text-accent">
                    ↗
                  </span>
                </a>
              </li>
            </ul>
            <a
              href={assetUrl(content.profile.resume)}
              download="Aadhithya-Vijayakumar-Resume.pdf"
              className="mt-4 flex h-11 items-center justify-center border border-accent bg-accent font-mono text-xs font-medium uppercase tracking-[0.12em] text-paper"
            >
              Download résumé
            </a>
          </nav>
        </div>
      ) : null}
    </>
  );
}
