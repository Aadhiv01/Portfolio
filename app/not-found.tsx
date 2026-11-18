import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main
      id="main"
      className="mx-auto flex w-full max-w-[1120px] flex-1 flex-col justify-center px-5 py-24 md:px-8 md:py-32"
    >
      <p className="font-mono text-[0.72rem] font-medium uppercase tracking-[0.14em] text-accent">
        404 — Not found
      </p>
      <h1 className="mt-5 max-w-2xl font-serif text-[clamp(2.5rem,7vw,5rem)] font-medium leading-[0.95] tracking-[-0.03em]">
        This page doesn&apos;t exist.
      </h1>
      <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-quiet">
        The link may be old, or the page may not have been written yet.
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/">Back home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/work">Browse work</Link>
        </Button>
      </div>
    </main>
  );
}
