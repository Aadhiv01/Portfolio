# Portfolio v2 — project record

Everything about this rebuild in one place: what it is, what it's made of, what
is finished, what is deliberately unfinished, and why the choices were made.

> **Last updated:** 2026-11-04
> **Branch:** `v2` (not deployed). `main` is still the live legacy CRA site at
> aadhithyavijayakumar.com and **must not be modified** until cutover.

---

## 1. What this is

A rebuild of Aadhithya Vijayakumar's portfolio, aimed at senior SDE roles that
lean toward ML engineering / MLOps. The site has two jobs:

1. **Be a sharp, skimmable portfolio** — a hiring manager should understand the
   person and the work in under a minute.
2. **Prove LLM systems engineering with evidence** — the flagship is a working,
   measured **Router Lab**, not a description of one.

The rebuild is static-first. Almost every page is plain HTML at the edge; server
code exists only where the Router Lab needs it.

---

## 2. Status at a glance

| Phase | Scope | Status |
|---|---|---|
| 0 | Branch, Next.js scaffold, tooling | **Done** on `v2` |
| 1 | Content migration + typed schema + tests | **Done** on `v2` |
| 2 | Design system, layout, pages, motion, QA | **Done** (working tree; commit pending) |
| 3 | Router Lab: classifier, router, failover, telemetry, BYOK route | **Done** (working tree; manual run with real keys pending) |
| 4 | Eval harness + committed results + Recharts charts | Not started |
| 5 | Lighthouse, deployment, DNS cutover | Visual/a11y QA and Lighthouse done; deploy and DNS pending |

**In one sentence:** the site is built and passes its checks; the Router Lab —
a real classify → route → stream → measure path behind BYOK — is built, tested
and parked off the published page, covered by 64 unit tests across the router,
providers, SSE parsing, route handler and content schema.

---

## 3. Repository map

```
app/
  layout.tsx              fonts, metadata (incl. metadataBase), pre-paint theme script, chrome
  page.tsx                home: hero -> selected impact -> experience -> skills -> projects -> interests -> credentials -> contact
  opengraph-image.tsx     1200x630 share card, built at build time from content
  twitter-image.tsx       re-exports the share card
  not-found.tsx           styled 404
  icon.svg                favicon
  globals.css             tokens, base styles, the one motion (scroll reveal)
  api/_router/            Router Lab endpoint, OFFLINE: the underscore makes the folder private,
                          so it is not routed. Rename to `router` to bring it back.
components/
  site-header.tsx         sticky header, resume link, controls
  site-nav.tsx            desktop nav + mobile menu (Escape closes, solid panel)
  theme-toggle.tsx        light/dark, aria-pressed, persisted
  section-heading.tsx     the one heading: serif title, a one-line dek, hairline rule
  experience-timeline.tsx vertical timeline: rail + logo-in-a-circle dots, scroll-driven, no JavaScript
  technical-skills.tsx    flat, always-visible skills list, grouped like the resume
  project-row.tsx         image + summary + GitHub link (no case-study link)
  pointer-glow.tsx        client: a soft highlight that follows the mouse site-wide, plus `.spot` cards
  copy-email.tsx          client: the big email copies to the clipboard, falling back to mailto
  interest-glyph.tsx      the owner's six single-stroke drawings for the interest rows (decorative)
  router-lab.tsx          client lab: prompt, BYOK keys, streaming answer, ticker (not mounted)
  ui/button.tsx           shadcn primitive
content/
  schema.ts               typed schema + TODO marker validation
  index.ts                parses and freezes the content bundle
  *.json                  profile, projects, experience, expertise (rendered as "Areas of interest"),
                          impact, education, certifications, skills
  resume-skills.json      the union of skills across the owner's resume variants; tests only
  content.test.ts         Vitest: schema + "no invented facts" invariants
  assets/                 canonical images and resume.pdf (copied to public/assets at dev/build)
  MIGRATION.md            provenance, exclusions, legacy security notes
  voice.md, vision.json   voice samples / legacy marketing copy (not rendered)
lib/
  content-selectors.ts    display rules: current role, verified-only highlights, skill usage
  utils.ts                cn() re-export
  interest-glyph-names.ts the six drawing names the interest rows may use (tested)
  lab-protocol.ts         isomorphic SSE event types shared by client and server
  lab-sse.ts              incremental SSE frame parser (client + server)
  server/lab/*            classifier, router, pricing, telemetry, provider adapters (parked)
scripts/
  sync-assets.mjs         content/assets → public/assets
.portfolio-screens/       CDP screenshot + check scripts used for QA
docs/README.md            this file
docs/book-of-work.md      deferred and future work (never rendered)
docs/archive/route-car/   the removed 2D car, road and intro plate, kept as .txt for the redesign
```

---

## 4. Stack, and why each piece is there

| Job | Choice | Reason | Trade-off |
|---|---|---|---|
| Framework | **Next.js 16.4.5** (App Router, Turbopack) | Static-first pages, but server route handlers in the same repo for the Router Lab. Metadata, image optimisation and streaming come built in. | Heavier than a content-site framework. Justified only because of the server-side lab. |
| UI runtime | **React 19.3.0** | Required by Next; server components keep client JS small. | — |
| Language | **TypeScript 5.9, strict** | The content schema is the guard against invented facts; strict TS makes bad data a build error. | Slightly slower authoring. |
| Styling | **Tailwind CSS 4** | One styling approach, CSS-first tokens via `@theme`, fast builds, tiny runtime cost. | Class-heavy markup; migration friction if ever leaving. |
| Components | **shadcn/ui v4** (Radix primitives) | Accessible behaviour without adopting a component framework. The code is owned, so it can be restyled completely. Replaces the banned MUI/PrimeReact stack. | Upstream changes are merged by hand. |
| Icons | **Lucide** | Tree-shaken SVGs, consistent stroke weight, no icon font. | — |
| Motion | **CSS + two small client observers** | No animation library in the bundle. Compositor-friendly, and one `prefers-reduced-motion` block disables everything. | Complex choreography is harder; deliberately out of scope. |
| Fonts | **`next/font/google`** | Self-hosted at build: no third-party request, no layout shift. | Font files become part of the build. |
| Content | **Typed JSON + schema + Vitest** | No CMS, no database, no monthly cost. Validation runs in tests and at build. | Copy edits are code changes. |
| Images | **`next/image`** + local assets | Responsive sizing and modern formats without an external CDN. | — |
| Charts (Phase 4) | **Recharts** | The React default, integrates with the same design tokens. Loaded only on eval pages. | Heaviest of the common chart libs; must stay off the home page. |
| Testing | **Vitest 3.2.7** | Fast, no browser needed for schema, router, provider and route-handler tests. | No browser component tests yet. |
| Hosting (planned) | **Vercel free tier** | ~$0/month, first-class Next support, custom domain via GoDaddy DNS. | Vendor tie-in; acceptable at this scale. |

**Not in the bundle, deliberately:** `three` (removed in v2.0), animation libraries, UI kits, CSS-in-JS,
state managers, particle/typewriter libraries, LangChain. See the dependency
rules in `CLAUDE.md`.

### Dependency health (checked 2026-11-04)

- `next@16.4.5` — released 2026-11-03 and includes the latest security fixes.
- `react@19.3.0` — above the range affected by the React2Shell RSC vulnerability
  (19.0.0–19.2.0).
- `npm audit --omit=dev`: **0 high, 0 critical**; 6 low/moderate findings, all
  inside the **`shadcn` CLI** dependency tree (`ts-morph`, `minimatch`,
  `deepmerge`, `@shadcn/registry`).
- **Improvement worth making:** `shadcn` is a build-time CLI and belongs in
  `devDependencies`, not `dependencies`. Moving it removes those findings from
  the production audit and shrinks the production install.

---

## 5. Design system

**Direction:** chalk & ultramarine, flat hairline surfaces. Cool, precise,
instrument-like — a technical dossier rather than warm print.

| Token | Light | Dark |
|---|---|---|
| `--paper` | `#f4f5f7` | `#0c0f16` |
| `--ink` | `#0d1220` | `#edf0f5` |
| `--quiet` (muted text) | `#4c5566` | `#a3aab8` |
| `--rule` (hairlines) | `#d8dce4` | `#232833` |
| `--accent` | `#2447e0` | `#7c92ff` |
| `--accent-invert` (on dark blocks) | `#7c92ff` | `#7c92ff` |
| `--card` | `#eceff4` | `#101520` |

Every pair above was checked: ink 17:1, quiet 6.9:1 (light) and 8.2:1 (dark),
accent 6.3–6.8:1 on paper. `--accent-invert` exists because the inverted contact
block stays dark in both themes; using the light-theme blue there would drop to
~2.4:1.

- **Type:** Source Serif 4 for display and narrative (italic used once, on the
  hero surname); IBM Plex Mono for labels, dates and metadata. Body ~1.05rem/1.65;
  lead paragraphs 1.1rem. Hero `clamp(3rem, 8.5vw, 6.5rem)`.
- **Type floor:** no visible text below 0.7rem (11.2px). Micro labels are
  uppercase at 0.7–0.72rem with 0.11–0.14em tracking and mono 500; metadata is
  0.74–0.8rem in sentence case with near-zero tracking. Uppercase is reserved
  for short labels, never for sentences.
- **Layout:** single 1120px container, 12-column grid on desktop, one column at
  375px, hairline section rules, generous vertical rhythm. Section heads are
  a title over a hairline rule. There is no numbering scheme.
- **Shape:** square corners everywhere. No decorative gradients, glassmorphism,
  bento grid, paper grain or cursor glow.
- **Motion:** one, the scroll reveal (a CSS scroll-driven animation, no
  JavaScript). Accordion panels fade in on open. Everything is disabled under
  `prefers-reduced-motion: reduce`. The intro plate, rotating roles, parallax,
  hover sheens, scroll-progress bar, road and car were all removed for v2.0;
  the car, road and intro are archived in `docs/archive/route-car/`.
- **Theme:** class-based dark mode, system default, set by an inline pre-paint
  script and persisted in `localStorage`. No `next-themes` dependency.

**Why this direction:** the 2026 default portfolio look is warm paper plus one
warm accent, oversized serif, grain and a spotlight. That recipe is now a tell.
The rebuild keeps the serif/mono voice but cools the surface to chalk, reduces
the accent to a single ultramarine signal, and drops the decorative print
effects so the remaining motion and the Router Lab carry the character.

---

## 6. What is built, page by page

### `/` — home

1. **Hero** — name, factual current role, the headline ("Full-stack engineer. I
   build the product people use and the data that moves underneath it."), a
   two-sentence summary, and the portrait. "Email me" is the filled button,
   "Résumé" the outlined download, and "See my work" a quiet scroll cue. The
   portrait is a transparent cut-out over a flat backdrop that follows the theme,
   aligned to the top of the name and the bottom of the buttons.
2. **Selected impact** — four boxed cards (Streaming, Migrations, Product,
   Payments), each with a short outcome heading (the number inside it), one line, and links to the role(s)
   it comes from. `content/impact.json` stores the exact source bullets, and tests
   fail if a card stops matching a verified bullet or headlines a number no source
   states. The only boxed grid on the page.
3. **Experience** — a vertical timeline of five roles with logos in circular
   dots. Bullets come from the union of the owner's résumé variants. Goldman's nine
   bullets sit under three themes (Data movement, Platform services, Reliability
   and team). No skill chips, because skills belong to the person.
4. **Skills** — a flat, always-visible list in eight rows ordered by the story of
   the work, every skill at full weight and ordered inside each row by how often
   target job descriptions ask for it. Assumed tools (Git, JIRA, IDEs) and "Data lake" are left out. Every
   item is on a résumé variant or in a bullet, and nothing on the never-claim list
   can appear (both tested).
5. **Projects** — NeighborNexus and StudentFieldwork Tracker, each with a GitHub
   link ("Personal projects, with the code on GitHub"). Not on the résumé; kept by choice, to be replaced.
6. **Areas of interest** — a 3 by 2 grid with thin dividing lines (drawing above
   the title, then the text). Each drawing plays once on hover or
   focus and shows its settled state under reduced motion. Five are interests
   rooted in the work, with no numbers or employer names (tested); the sixth is a
   new direction (LLM triage, tested against plain rules).
7. **Credentials** — certifications without dates, and education.
8. **Contact** — "Let's talk.", a one-line availability sentence ("Open to senior full stack and backend roles."), the email (click
   to copy, mailto as fallback), LinkedIn and GitHub in lowercase, and the résumé.
   The footer is only the copyright and a back-to-top link.

**Site-wide:** a mouse-following highlight and per-card spotlights (fine pointer
only, off under reduced motion), a scroll reveal, one heading style with a
takeaway line under each title, and one spacing scale.

### Router Lab — `POST /api/router`

A real request path, not a recording:

```
client (components/router-lab.tsx)
  → POST /api/router           validate, cap, stream SSE
  → classifier                  local regex/heuristic score → cheap | strong
  → provider order              strong: Anthropic → DeepSeek
                                cheap:  DeepSeek → Anthropic
  → raw-fetch adapters          Anthropic Messages / DeepSeek chat completions
  → router                      per-attempt deadline, idle deadline, failover
  → SSE                         meta → attempt → token* → metrics → done | error
```

- **Classifier:** deterministic, no model call. Code fences, stack traces, SQL,
  design/trade-off/debug language, multi-part questions, long prompts and
  operational constraints raise the score; greetings, arithmetic and short
  simple questions lower it. `score >= 3` → strong, `<= 0` → cheap, 1–2 → strong
  only when the prompt is long or explicitly ambiguous. Brevity never downgrades
  a prompt that already crossed the strong boundary. Confidence and the reason
  list are returned and shown in the UI.
- **Models:** `claude-sonnet-5-5` (strong, $2 / $10 per 1M input/output) and
  `deepseek-flash` (cheap, $0.30 / $1.20 at peak, half off-peak). Verified
  2026-11-04; `deepseek-chat` is no longer listed. IDs and rates live in
  `lib/server/lab/config.ts` and `pricing.ts` with source URLs and dates.
- **Streaming:** chunk-safe SSE parser shared by client and server; handles
  split frames, CRLF, multi-line data and split UTF-8.
- **Failover:** at most two attempts. A provider may fail over only before the
  first text delta; once text has been sent, a failure ends the stream with a
  `partial` error and keeps the partial answer. No same-provider retry.
- **Deadlines:** 25s per attempt, 12s idle between events, both linked to the
  client abort signal. `maxDuration = 60` on the route.
- **Cost:** tokens × the versioned list price at request time, with the DeepSeek
  peak/off-peak window resolved from UTC. The UI labels it "measured for this
  request only" and never turns it into a quality or uptime claim.
- **Keys:** BYOK only. Keys arrive in `x-lab-anthropic-key` /
  `x-lab-deepseek-key`, live in request-scoped variables, are never stored,
  logged, echoed or put in telemetry, and are never read from env in this phase.
  Error messages are fixed local strings; upstream text is not forwarded.
- **Limits:** 2,000-character prompt, 10KB body, 1,024 output tokens.
- **Empty state:** without a key the lab explains BYOK and does not fake output.


### Routes

Built routes: `/`, the 404 page, `/icon.svg`, `/opengraph-image`,
`/twitter-image`. All are static. The earlier `/work` index, the three
`/work/[slug]` draft case-study pages and the `proxy.ts` that served them were
removed for v2.0: the drafts were full of `[[TODO]]` blocks and were linked from
the home page. The page template is still in `docs/case-study-template.md` for
when real case studies are written.

The Router Lab endpoint is **offline** (`app/api/_router/`, a private folder). It
has no request-rate limit, so it must not be routed until one exists.

### Content and safety rules

- All copy lives in `content/`; pages never hardcode bio facts.
- Unverified metrics are filtered out at render time.
- Unknown facts are the literal marker `[[TODO: …]]`, never a plausible guess.
- No secrets anywhere in the client bundle. Provider calls happen only in the
  server route handler, and only with a per-request BYOK key.

---

## 7. Verification already performed

- `npm run typecheck`, `npm run lint`, `npm test` pass. The suite was 64 tests when the Lab shipped; it is now 82 (see `npm test`), including tests that enforce the owner's own résumé rules on the page. The original breakdown:
  content schema (4), SSE parser (6), classifier (10), pricing (12), Anthropic
  adapter (7), DeepSeek adapter (7), router failover/telemetry (8), route
  handler validation + streaming (9), content invariants (1).
- Provider calls are tested against mocked `fetch` streams: success, 401/429/5xx,
  in-stream errors, empty and incomplete streams, failover before text, partial
  text on mid-stream failure, no-key short-circuit, and abort.
- Route tests assert the key string never appears in any emitted frame.
- Production build verified in a clean copy of the repo (see §10 for why a copy),
  and again in place once the sandbox allowed it.
- Routes: `/` → 200; unknown paths → 404; `/opengraph-image` → a 1200x630 PNG.
- Screenshots at **375px and 1440px**, light and dark, with every section
  revealed (checked with a script that scrolls the full page).
- No horizontal overflow at either width.
- Keyboard pass: skip link appears on focus, mobile menu opens and closes with
  Escape, theme toggle persists, focus visible throughout.
- `prefers-reduced-motion`: all animation off, all content visible, smooth
  scroll disabled.
- No unverified metric appears in the rendered home HTML.
- Asset sync works on `predev` and `prebuild`.

**Still to verify:** the deployed build.

**Lighthouse 12, production build (`next start`), 17 Nov 2026:**

- Desktop (1440): **100 / 100 / 100 / 100**, LCP 0.7 s, TBT 0 ms, CLS 0.
- Mobile: accessibility **100**; performance **93 to 97** across three runs (FCP
  0.9 s, LCP 2.7 to 3.3 s simulated, TBT 40 ms, CLS 0). Lighthouse's simulated
  (Lantern) LCP has a floor of about 2.3 s on this machine and swings run to run,
  so treat the mobile number as a range and do not quote one figure.

---

## 8. Open placeholders (`[[TODO]]`)

These are intentional. Each one is a fact that does not exist yet; inventing a
value would violate the project rules.

**Personal**
- One-line headline.
- Location (and whether it should be public).
- Whether to display the phone number.
- Rewritten contact intro (legacy copy says "actively seeking full-time roles",
  which now conflicts with current employment).
- 3–5 sample sentences in your real voice (`content/voice.md`).

**Experience**
- Goldman contract title: resume says "Java Software Developer (Contract)",
  legacy site says "Java Software Developer".
- Confirm and source the 40% / 60% / 30% / 40% figures in the experience entries.
- Confirm the zero-breach six-month claim and its period.
- Confirm the 18-scenario / 90%-success figures.
- JPMC: confirm "zero-downtime" and "transaction accuracy" before restoring the
  legacy summary.

**Credentials**
- Credly verification URL and credential ID (AWS).
- Oracle certification verification URL and credential ID.

**Case studies**
- Problem, Constraints, Approach, Architecture, Results, What I'd change for
  each project.

**Other**
- `vision.json` legacy marketing copy: rewrite or drop.
- Rotate the Google API key that is committed in the legacy bundle.

List them at any time with:

```bash
grep -rn "\[\[TODO" content
```

---

## 9. Security and content constraints (non-negotiable)

1. **Never invent facts.** No fabricated metrics, employers, dates or quotes.
   Unknown values are `[[TODO: …]]`.
2. **No secrets in the client bundle.** Provider calls happen in server route
   handlers. Keys live in env vars only. `.env*` is never committed.
3. **~$0/month hosting.** No paid services without asking. Hard spend caps on
   every provider dashboard.
4. **Dependency discipline.** One UI approach (Tailwind + shadcn), one chart lib
   (Recharts), CSS-first motion.
5. **No orchestration frameworks** in the router. Official SDKs or plain `fetch`.
6. **Don't claim what isn't measured.** No uptime guarantees.
7. **Live mode is BYOK only.** Keys stay in memory for the request, are never
   stored or logged, and travel over HTTPS to our route handler only.
8. **Do not modify the legacy site** until cutover.
9. **The old bundle contains a committed Google API key.** Treat it as
   compromised and rotate it.

---

## 10. Running it locally

```bash
npm run dev        # syncs content/assets → public/assets, then next dev
npm run build      # production build (also syncs assets)
npm start          # serve the production build
npm run lint
npm run typecheck  # next typegen + tsc --noEmit
npm test           # Vitest: content, SSE, classifier, pricing, providers, router, route
```

Open <http://localhost:3000>.

### Environment note (this machine, this session)

In earlier sandbox sessions, reading `.git/index` timed out, which made
`git status` fail (`unable to map index file: Operation timed out`) and made the
dev server stall at "Compiling /". That is an environment restriction, not a
defect in the code:

- `git log` / `git rev-parse` work.
- A source-identical copy **without** `.git` builds and runs normally; the
  Phase 2 preview ran from `/tmp/portfolio-preview`.
- In the Phase 3 session the sandbox allowed typecheck, tests and a production
  build in place.
- Commit from a normal terminal:

  ```bash
  git add -A
  git commit -m "feat: build editorial portfolio site"
  ```

Node 23.2.0 was used locally. Node 24 LTS is the safer long-term choice before
deployment.

---

## 11. What's next

### Phase 3 — Router Lab (done)

Shipped as described in §6: classifier, provider router with failover, streaming
adapters for both providers, SSE route handler, client UI, nav/footer links and
63 tests. Still open:

- **Manual run with real keys.** The path is covered by mocked streams end to
  end; a live cheap and live strong prompt still need to be run with the
  owner's own keys to confirm the ticker matches the provider's usage.
- **No rate limiting or Turnstile.** BYOK keeps the owner's budget out of the
  request path; a per-IP limit becomes necessary before any owner-key mode.
- **No persistence.** Request telemetry is returned to the browser only; nothing
  is stored. Phase 4's eval harness will produce the committed numbers.

### Phase 4 — Measurement

- `npm run eval` runs a fixed prompt set under three arms: always-strong,
  always-cheap, routed.
- Results committed to `content/eval/*.json`.
- Recharts charts read only committed data. No fabricated numbers.

### Phase 5 — Ship

- Lighthouse 95+ on all four categories.
- Final 375/1440 and reduced-motion pass on the deployed build.
- Vercel deploy, then GoDaddy DNS records updated only after the site passes the
  definition of done.
- Rotate the legacy API key.

### Content work in parallel

- Fill the placeholders in §8.
- Write the six missing case-study sections per project.
- Confirm which legacy metrics are real and can be shown.

---

## 12. Decision log

| Date | Decision | Why |
|---|---|---|
| Phase 0 | Rebuild on `v2` in the same repo | Keeps `main` live; one history; easy cutover |
| Phase 0 | Next.js 16 + React 19 | Static pages plus server routes for the Router Lab |
| Phase 0 | Tailwind 4 + shadcn/ui | One styling system; owned, accessible primitives |
| Phase 1 | Typed JSON content, not MDX | Schema validation catches invented or missing facts |
| Phase 1 | Hide unverified metrics | "Never invent facts" |
| Phase 2 | Editorial paper + rust | Distinctive, avoids AI-template tells |
| Post-Phase 3 | Chalk + ultramarine, flat hairline surfaces | Warm paper/rust had become the 2026 portfolio default; cooled surface, one blue signal, no grain or spotlight |
| Phase 2 | Draft case-study pages now | Real routes and layout, prose marked TODO |
| Phase 2 | CSS-only motion | No library weight; reduced-motion is trivial |
| Phase 2 | `proxy.ts` for unknown slugs | Correct 404s under Cache Components |
| Phase 3 | Anthropic + DeepSeek | One strong tier, one cheap tier, different vendors so failover is real |
| Phase 3 | Heuristic classifier, no second model call | Adds latency and cost for little gain at 2,000 characters; Phase 4 can measure an LLM arm |
| Phase 3 | SSE over one POST | One streaming format, native to both providers, no polling or sockets |
| Phase 3 | BYOK, keys in headers, no env fallback | Keeps the owner's spend and key out of the request path |
| Phase 3 | Versioned pricing table with peak windows | Cost is computed from published rates and labelled; never presented as a quality claim |
| Phase 3 | Two attempts max, failover only before first text | A mid-answer swap would silently mix models; partial text is better |

---

## 13. External read on the stack and design

This section records outside opinion gathered in November 2026, not project
requirements. Treat percentages as directional.

- **Next.js for a portfolio:** forum consensus is that it is usually overkill
  and that Astro or plain HTML ships less JavaScript. Next is justified when the
  site is genuinely app-shaped, needs server routes, or is itself a demonstration
  of Next experience. This project qualifies because of the Router Lab.
- **Tailwind 4:** broadly positive. Faster builds and CSS-first tokens are the
  wins; class-heavy markup and migration friction are the recurring complaints.
- **shadcn/ui:** widely considered production-suitable and worth it for
  React + Tailwind. Ownership and accessibility are praised; manual upstream
  merges are the cost.
- **CSS-first animation:** the 2026 recommendation is to start with CSS and only
  add `motion`/Framer Motion for layout, gesture or exit animation. The project
  follows that.
- **Design:** editorial serif + mono labels + grain + oversized type is a
  recognized current direction. The known "AI-generated" tells — indigo
  accents, Inter/Geist, rounded gradient cards, bento grids, stock shadcn looks,
  excessive motion — are all absent.
- **Caution:** too many effects can read as junior. Keep the motion layer
  subordinate to the Router Lab once it exists.

<details>
<summary>Sources consulted</summary>

- https://eddrit.com/r/nextjs/comments/1plngxv/should_a_next_dev_use_next_for_his_portfolio
- https://www.reddit.com/r/nextjs/comments/162nuk3/nextjs_for_a_landing_page/
- https://www.reddit.com/r/astrojs/comments/1f4ox46/when_not_to_use_astro/
- https://www.pkgpulse.com/guides/astro-vs-nextjs-2026
- https://www.mervcodes.com/blog/astro-vs-nextjs-static-sites/
- https://dev.to/ottoaria/tailwind-css-v4-in-2026-what-changed-whats-better-and-should-you-upgrade-1boc
- https://ajmani.dev/shadcn-ui-review-for-production/
- https://tiennguyen.dev/is-shadcn-worth-it/
- https://redlib.catsarch.com/r/react/comments/1u4bxiv/is_shadcn_suitable_for_production_environments/
- https://adamarant.com/en/blog/partial-prerendering-is-stable-in-nextjs-16-how-to-structure-routes
- https://ui.wensity.com/blog/framer-motion-vs-css-animations-which-should-you-use-in-2026
- https://opentailwind.dev/blog/why-tailwind-sites-look-the-same/
- https://redlib.kylrth.com/r/tailwindcss/comments/1ams3xk/portfolio_using_nextjs_tailwindcss_gsap/
- https://mayank-kushwaha-aiportfolio.vercel.app/blog/portfolios-that-dont-look-ai-generated
- https://techtrendi.com/blog/developer-portfolio-that-hiring-managers-actually-review
- https://www.netlify.com/changelog/2026-11-03-nextjs-security-vulnerabilities/
- https://newreleases.io/project/github/vercel/next.js/release/v16.4.5
- https://vercel.com/kb/bulletin/security-bulletin-cve-2025-55184-and-cve-2025-55183
- https://www.pkgpulse.com/guides/recharts-vs-chartjs-vs-nivo-vs-visx-react-charting-2026

</details>
