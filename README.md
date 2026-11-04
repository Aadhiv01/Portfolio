# Portfolio v2

Personal site for Aadhithya Vijayakumar: a static-first Next.js portfolio plus a
**Router Lab** — a real cost-routed LLM demo with a classifier, provider failover,
per-request telemetry, and a reproducible eval harness.

## Branch model

| Branch | What it is |
|---|---|
| `main` | Legacy Create React App site, still the deployable version at aadhithyavijayakumar.com. Do not modify. |
| `v2` | This rebuild. Not deployed. |

Cutover happens only after the v2 site passes the definition of done in
`CLAUDE.md`.

## Stack

Next.js 16.4.5 (App Router) · React 19.3.0 · TypeScript 5.9 (strict) ·
Tailwind CSS 4 · shadcn/ui (Phase 2) · Recharts (Phase 4) · Vitest

## Commands

```bash
npm run dev        # local dev server
npm run build      # production build
npm start          # serve the production build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm test           # content schema tests (Vitest)
```

## Content

All copy lives in `content/` and is typed by `content/schema.ts`. Pages must
never hardcode copy. Unknown or unverified facts are the literal marker
`[[TODO: …]]`; never replace one with an invented value.

Open placeholders:

```bash
grep -rn "\[\[TODO" content
```

See `content/MIGRATION.md` for provenance, exclusions, and the security notes
from the legacy site (including the committed API key that must be rotated).

## Structure

```
app/          App Router routes and layout
components/   UI (Phase 2)
content/      Typed JSON/MDX, assets, voice guide, migration report
lib/          Server-side routing/orchestration (Phase 3)
scripts/      Eval harness (Phase 4)
```

## Rules

Read `CLAUDE.md` before changing anything. Plan first for changes touching more
than three files. No secrets in the client bundle; no new dependency without a
stated reason.
