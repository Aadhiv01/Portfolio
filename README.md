# Portfolio v2

Personal site for Aadhithya Vijayakumar: a static-first Next.js portfolio. A
**Router Lab** — a cost-routed LLM demo with a classifier, provider failover,
per-request telemetry and an eval harness — is built and tested but parked off
the published page until it has measured results.

For the full project record — stack rationale, everything built so far, open
placeholders, verification results and what's next — see
[`docs/README.md`](docs/README.md).

## Branch model

| Branch | What it is |
|---|---|
| `main` | Legacy Create React App site, still the deployable version at aadhithyavijayakumar.com. Do not modify. |
| `v2` | This rebuild. Not deployed. |

Cutover happens only after the v2 site passes the definition of done in
`CLAUDE.md`.

## Status (17 Nov 2026) — v2.0

- Home page order: hero, selected impact, experience (timeline), skills,
  projects, areas of interest, credentials, contact.
- Content is traced to the owner's résumé variants (the union of all of them is
  the source of truth). Tests enforce it: every skill and bullet is on a variant,
  nothing on the never-claim list appears, and the owner's own writing rules (no
  colons or dashes in bullets, no Java and Python in one bullet) hold.
- Positioning: "Full-stack engineer. I build the product people use and the data
  that moves underneath it." No year count, no location, title "Software
  Engineer".
- Motion is the scroll reveal, the experience timeline, the interest drawings (on
  hover), and a mouse-following highlight (mouse users only). The 2D car, road, intro plate and rotating roles
  were removed; their code is in [`docs/archive/route-car/`](docs/archive/route-car/).
- The Router Lab is **off the page and its endpoint is offline**
  (`app/api/_router/`). See [`docs/book-of-work.md`](docs/book-of-work.md).
- The owner's own to-do list (what to learn and build next) is in
  [`docs/owner-todo.md`](docs/owner-todo.md).
- Not deployed yet. Remaining before cutover: rotate the old Google key, then
  deploy and change DNS (below).

## Deploy and cutover to aadhithyavijayakumar.com

Vercel Hobby is free; no paid service is involved.

1. Authenticate the CLI on this machine (interactive, run it yourself):
   `npx vercel login`.
2. Deploy from this directory: `npx vercel --prod`. The first run creates and
   links the project. Alternatively, import `github.com/Aadhiv01/Portfolio` in
   the Vercel dashboard and set the production branch to `v2`.
3. In Vercel → Project → Settings → Domains, add `aadhithyavijayakumar.com` and
   `www.aadhithyavijayakumar.com`. Copy the exact DNS records the dashboard
   shows — do not guess them.
4. At GoDaddy, replace the GitHub Pages records with the Vercel ones: the apex
   `A` record points at Vercel, and `www` becomes a `CNAME` to the target Vercel
   shows (typically `cname.vercel-dns.com`). Check the current records before
   changing anything; the legacy site depends on them until cutover.
5. Wait for DNS propagation and confirm both apex and `www` serve the v2 site.
   Keep the legacy `main` branch and its deployment until then.

The domain, DNS and Vercel account are owner-controlled; the deploy step needs
your login.

## Stack

Next.js 16.4.5 (App Router) · React 19.3.0 · TypeScript 5.9 (strict) ·
Tailwind CSS 4 · shadcn/ui · Lucide · Vitest

Recharts is reserved for the Phase 4 eval charts. There is no animation library:
motion is CSS plus a few small client observers.

## Commands

```bash
npm run dev        # local dev server (syncs content/assets first)
npm run build      # production build (syncs content/assets first)
npm start          # serve the production build
npm run lint       # ESLint
npm run typecheck  # next typegen + tsc --noEmit
npm test           # Vitest: content, SSE, classifier, pricing, providers, router, route
```

## Routes

| Route | State |
|---|---|
| `/` | The home page: hero, selected impact, experience, skills, projects, areas of interest, credentials, contact |
| `/opengraph-image`, `/twitter-image` | The 1200x630 share card, built at build time |
| `/_not-found` | Styled 404 |

The Router Lab endpoint is offline: it lives in the private folder
`app/api/_router/` and has no request-rate limit yet. See the book of work.

## Router Lab (parked)

The lab classifies a prompt locally, picks a cheap or strong model, fails over
across two providers before the first token, and reports the measured latency,
tokens and list-price cost for that request. It is bring-your-own-key only: keys
are request-scoped, never stored or logged. It is not mounted on any page and its
endpoint is not routed. To try it locally, rename `app/api/_router` to
`app/api/router`, mount `components/router-lab.tsx` on a page, and run:

```bash
curl -N http://localhost:3000/api/router \
  -H 'content-type: application/json' \
  -H "x-lab-deepseek-key: $DEEPSEEK_API_KEY" \
  -d '{"prompt":"What is a mutex?"}'
```

Models and prices are in `lib/server/lab/config.ts` and `pricing.ts` with source
URLs and verification dates. Architecture, limits and the open manual-key check
are in [`docs/README.md`](docs/README.md#router-lab--post-apirouter).

## Design system

- **Chalk + ultramarine.** Cool chalk paper, near-black navy ink, one electric
  blue signal. Flat surfaces and hairlines; no grain, decorative gradient or
  glass.
- **Type:** Source Serif 4 for narrative (italic once, on the hero surname),
  IBM Plex Mono for labels; both via `next/font/google` (self-hosted at build).
  No visible text below 0.7rem; micro labels are uppercase with tight tracking,
  metadata is sentence case.
- **Theme:** class-based dark mode, system default, persisted in `localStorage`
  by an inline pre-paint script. No `next-themes`.
- **Motion:** one, the CSS scroll reveal. It collapses under
  `prefers-reduced-motion`.
- **Images:** canonical files live in `content/assets`. `scripts/sync-assets.mjs`
  copies them to the git-ignored `public/assets` on `predev` and `prebuild`.

## Content

All copy lives in `content/` and is typed by `content/schema.ts`. Pages must
never hardcode copy. Unknown or unverified facts are the literal marker
`[[TODO: …]]`; never replace one with an invented value. Experience highlights
render only when `verified: true`.

- `skills.json` holds the grouped Technical skills table shown under the hero.
- `experience[].skills` holds the per-role chips; the two lists are independent,
  so a skill can appear in the table without being attributed to a job.

Open placeholders:

```bash
grep -rn "\[\[TODO" content
```

See `content/MIGRATION.md` for provenance, exclusions, and the security notes
from the legacy site (including the committed API key that must be rotated).

## Structure

```
app/          App Router routes, layout, global styles
components/   Site chrome, sections, and shadcn primitives
content/      Typed JSON, assets, migration report, voice and vision notes
lib/          Content selectors; Router Lab protocol, classifier, router and providers
proxy.ts      Rejects unknown case-study slugs with a real 404
scripts/      Asset sync; eval harness arrives in Phase 4
```

## Rules

Read `CLAUDE.md` before changing anything. Plan first for changes touching more
than three files. No secrets in the client bundle; no new dependency without a
stated reason.
