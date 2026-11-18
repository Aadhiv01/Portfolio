import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";

import { PointerGlow } from "@/components/pointer-glow";
import { SiteHeader } from "@/components/site-header";
import { content } from "@/content";

import "./globals.css";

const serif = Source_Serif_4({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-source-serif",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const description = content.profile.headline;

export const metadata: Metadata = {
  metadataBase: new URL("https://aadhithyavijayakumar.com"),
  title: {
    default: `${content.profile.name} — ${content.profile.roles[0]}`,
    template: `%s — ${content.profile.name}`,
  },
  description,
  applicationName: `${content.profile.name} — Portfolio`,
  authors: [{ name: content.profile.name, url: content.profile.links.github }],
  creator: content.profile.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: content.profile.name,
    title: `${content.profile.name} — ${content.profile.roles[0]}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${content.profile.name} — ${content.profile.roles[0]}`,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f5f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0f16" },
  ],
};

/* Runs before anything paints, so the page never flashes the wrong theme. */
const bootScript = `(function(){var r=document.documentElement;try{var s=localStorage.getItem("theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)r.classList.add("dark");}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${serif.variable} ${mono.variable}`}
    >
      <body className="min-h-svh bg-paper text-ink antialiased">
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <PointerGlow />
        <a
          href="#main"
          className="fixed left-4 top-4 z-[100] -translate-y-[200%] border border-accent bg-paper px-4 py-3 font-mono text-xs uppercase tracking-[0.16em] text-ink transition-transform duration-200 focus:translate-y-0"
        >
          Skip to content
        </a>
        <div className="relative z-10 flex min-h-svh flex-col">
          <SiteHeader />
          {children}
        </div>
      </body>
    </html>
  );
}
