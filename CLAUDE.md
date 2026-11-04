# CLAUDE.md: Portfolio rebuild

## Who this is for
Senior SDE (5+ yrs), full-stack / cloud, moving toward ML-SDE / MLOps roles.
Audience: hiring managers and senior engineers who skim fast, then dig into one thing.
The site must prove: production scale experience + I can build and *measure* LLM systems.

## Non-negotiables
1. **Never invent facts.** No fabricated metrics, employers, dates, or quotes. Anything unknown is a placeholder: `[[TODO: what is needed]]`. List all open placeholders when asked (`grep -rn "\[\[TODO" content src`).
2. **No secrets in the client bundle.** All provider calls happen in server route handlers. Keys live in env vars only. Never commit `.env*`.
3. **Budget cap: ~$0/month hosting.** No paid services without asking. Hard-cap spend on every provider dashboard.
4. **Dependency discipline.** One UI approach (Tailwind + shadcn/ui), one chart lib (Recharts), one animation approach (CSS first, `motion` only if CSS can't do it). Before adding any dependency, state why and what it replaces. Banned: jQuery, Popper, Tether, Bootstrap, MUI, PrimeReact, particle libs, typewriter libs, Redux.
5. **No orchestration frameworks** (LangChain etc.) in the router. Use official SDKs / plain `fetch`. This is a deliberate, documented choice.
6. **Don't claim what isn't measured.** No "100% uptime". Report measured numbers (e.g. failover success in injected-failure tests).

## Stack
Next.js (App Router, current stable; pin versions at scaffold), React, TypeScript (strict), Tailwind, shadcn/ui, Recharts.
Content: MDX + typed JSON in `/content`. Static by default.
Router demo: route handlers in `/app/api/*`. Postgres + Prisma are **phase 3, optional**; v1 uses committed JSON replays and eval results.
Models: confirm current model IDs from the provider docs at build time, don't rely on memory. Keep model IDs in one config file.

## Migration context (this is a rebuild, not an upgrade)
- Old site: Create React App at github.com/Aadhiv01/Portfolio, live at aadhithyavijayakumar.com. It was deployed with `gh-pages` (GitHub Pages) with the custom domain on GoDaddy DNS. `[[TODO: confirm: GitHub Pages or GoDaddy hosting]]`
- New site is built on a `v2` branch (or new repo). **Do not modify the old site until cutover**; it stays live.
- Reuse old **content and assets** only (copy, project descriptions, images, resume). Do not port old components or dependencies wholesale. If a component's logic is worth keeping, restyle it into the new design system.
- First migration task: inventory old `src/` content and assets into a `/content` draft, without changing the old code. Mark anything unclear as `[[TODO]]`.
- Cutover: change DNS at GoDaddy to the records Vercel shows in its Domains settings. Only after the new site passes the definition of done.
- Known issue: the old bundle includes `openai` and `@google/generative-ai`. Treat any key used there as compromised and rotate it.

## Router architecture (flagship case study)
Request flow: UI → server route handler (orchestrator) → classifier → routing switch → provider client (cheap or strong model) → token stream → metrics extractor → telemetry (JSON replays in v1; Postgres/Prisma optional in phase 3).
- **Orchestrator:** official provider SDKs or plain `fetch` only. Own the message payload, token counting and structured JSON stream payloads. No LangChain or similar.
- **Classifier:** regex heuristics first, then a low-latency small-model call only when heuristics are uncertain. Returns a route plus a confidence value. Log both.
- **Routing:** simple/math tasks go to the cheap tier, architectural/ambiguous tasks to the strong tier. Prefer a fast non-reasoning model for the cheap tier unless the eval shows a reasoning model wins. Model IDs live in one config file; verify current IDs from provider docs.
- **Failover:** try/catch around provider calls, exponential backoff with jitter, re-route to the secondary provider on 429/503/timeouts. Cap retries. Surface the fallback in telemetry. Never claim guaranteed uptime; report measured failover success from injected-failure tests.
- **Telemetry per request:** latency (ms), input/output tokens, route chosen, classifier confidence, fallback used, cost computed from a versioned pricing table.
- **Eval:** `npm run eval` runs a fixed prompt set under three arms (always-strong, always-cheap, routed) and writes `/content/eval/*.json`. Charts read only from committed data. No adaptive routing from telemetry unless it is actually built.
- **Live mode:** bring-your-own-key only. Keys stay in memory for the request, are never stored or logged, and are sent over HTTPS to our route handler only. Owner-key mode stays disabled unless behind Turnstile, rate limits and a hard spend cap.

## Design principles
- Clarity first, then rhythm: alternate dense text, full-bleed visual, and data sections.
- One signature element: the **Router Lab** (interactive request flow with cost/latency ticker). No decorative motion.
- Type: one serif for narrative, one mono for system details. Strong contrast, light + dark mode.
- Respect `prefers-reduced-motion`. Lighthouse target: 95+ on all four categories. Fully usable at 375px width.

## Voice (placeholders, fill from voice.md)
- First person, plain, specific. Lead with the problem and the number.
- Avoid: "passionate", "leveraging", "cutting-edge", "synergy".
- `[[TODO: 3-5 sample sentences in my real voice]]`

## Conventions
- Components in `/components`, one per file, named exports. Server code in `/lib/server`.
- Content schema types in `/content/schema.ts`; pages never hardcode copy.
- Commits: small, imperative, one concern each.
- Every case study follows the template in PLAN.md.

## Commands
- `npm run dev`, `npm run build`, `npm run lint`, `npm run typecheck`, `npm test`
- `npm run eval`: run the router eval harness (phase 2)

## Definition of done (per task)
Typecheck, lint and build pass; works at 375px and 1440px; no new dependency without justification; no secrets or TODO-less invented facts.

## Working style
Plan first (plan mode) for anything touching more than 3 files. Show the plan, wait for approval, then implement. Prefer the smallest change that meets the goal.
