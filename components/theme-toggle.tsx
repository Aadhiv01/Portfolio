"use client";

import { Moon, Sun } from "lucide-react";

/**
 * No state and no next-themes. The inline script in the layout sets `.dark`
 * before paint; this button flips it and remembers the choice. The two icons
 * are swapped by CSS, so server and client markup match.
 */
export function ThemeToggle() {
  function toggleTheme() {
    const root = document.documentElement;
    const isDark = root.classList.toggle("dark");

    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
      // Private mode or blocked storage: the theme still flips for this page.
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className="grid size-10 place-items-center border border-rule text-ink transition-colors duration-300 hover:border-accent hover:text-accent max-lg:size-11"
    >
      <Moon aria-hidden className="size-4 dark:hidden" />
      <Sun aria-hidden className="hidden size-4 dark:block" />
    </button>
  );
}
