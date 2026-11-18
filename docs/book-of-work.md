# Book of work — Claude-facing

> **Never rendered on the site.** This file exists so the deferred and future
> work has a durable home that is not the published portfolio. Nothing here
> should be copied into `content/` or any page until it is actually built and
> its claims are verified. Sites that "plan" work they have not done read as
> padding to the audience this site targets.

Last updated: 2026-11-17

---

## 1. Router Lab — built, parked

**State:** implementation complete and tested (classifier, router, failover,
telemetry, BYOK streaming route, 63 unit tests). Removed from the published
page on 2026-11-11; the code is untouched and still compiles:

- `components/router-lab.tsx`
- `app/api/_router/route.ts`, `app/api/_router/route.test.ts` (private folder, so
  the endpoint is not routed; rename to `router` to bring it back)
- `lib/server/lab/**`, `lib/lab-sse.ts`

**Why parked:** the site's first job is the person and the work. A live LLM demo
in the main scroll competes with that, and it cannot be shown to a recruiter
without the visitor supplying their own API key.

**Before it returns:**

- A request-rate limit on the endpoint. It only limits body and prompt size today.
  BYOK protects provider spend, not function hours. Check what is free on the
  host before choosing one.
- **Replay mode:** committed JSON recordings of real runs played through the same
  UI, so a visitor sees it work without pasting a key.

- A committed eval harness with results (accuracy, cost per 1k, p95 latency) —
  the whole point is a *measured* LLM system, not a demo.
- A dedicated route (`/lab`) rather than a homepage section, so the homepage
  stays static-first and the JS ships only where it is needed.
- Screenshots or a recorded run for the case study, so a hiring manager sees it
  without a key.

## 2. CDC + LLM reconciliation platform — the second flagship

Context lives in memory (`cdc-llm-recon-platform`). Shape: Kafka change data
capture feeding a lakehouse, with an LLM triage layer that classifies
reconciliation breaks and drafts the exception summary an operator acts on.

**What it has to prove:** the same two things as Router Lab, at a larger scale —
real pipeline mechanics (CDC, idempotency, replay, schema evolution) and a
measured model component (precision/recall on triage labels, not vibes).

**Not to be written into `content/` until** there is a running system with
numbers. The Goldman Sachs reconciliation work is the résumé-side evidence for
the domain; the personal build is the engineering evidence.

## 3. Case studies still to be written

Each is a page the site currently marks as a draft. Order by evidence
availability, not by fondness:

1. **Faculty scheduling application** — React + Spring Boot + Hibernate +
   PostgreSQL, ~40% administrative workload reduction at the University of Utah;
   the field-tracking application shares the stack.
2. **Storage provisioning services** — the self-serve path that replaced manual
   requests for application teams.
3. **CDC for reconciliation jobs** — replacing scheduled batch extracts with
   change streams; what the failure modes were and how replay works.

## 4. Ideas parked with the Lab

- A scroll-scrubbed "how it works" diagram for the CDC pipeline (asset required
  before it is more than a promise).
- A written piece on interface work as leverage — the thread that connects the
  React roles, the visualisations, and the internal tooling.

## 5. House style reminders for future work

- Never invent facts. Unknown values are `[[TODO: ...]]` and the content
  validation fails the build if an unverified claim has no note.
- No dependency for something the platform already does; the motion is CSS.
- Every interactive surface must work with a keyboard, a mouse and a thumb.

---

## 6. Next versions of the portfolio

The AI-side scope comes from the reference JD saved in `docs/owner-todo.md` (an LLM
full stack role built around an agentic product). Each version adds one project that
the site can truthfully show, and each project keeps its own evals, limits and
failure modes. Nothing is described as built until it is.

**v2.1: the LLM foundation and the first proof**
- Ship the Router Lab at `/lab` with replay mode, a request-rate limit and a small
  committed eval (always cheap, always strong, routed). Covers LLM API integration,
  streaming, failover, cost and latency tracking.
- GitHub Actions on the repo (lint, typecheck and tests on every pull request) and a
  one-command local setup, so developer experience is visible.
- A "Building now" section (this site, then the Lab) to replace the school and
  personal projects.

**v2.2: the agent**
- The CDC and LLM triage project as a full stack agent: a tool-calling loop that
  investigates a failed reconciliation, multi-step reasoning, a small working memory
  of earlier breaks, and a review screen where an operator accepts or edits the
  suggestion. Rules run first and the model only handles the ambiguous cases.
- The three-arm eval harness on injected failures with known answers: rules only,
  model only and the mix, scored on accuracy, cost, latency and false alarms, with a
  committed regression check.
- Guardrails and observability: validated structured output, redaction of identifiers
  before anything reaches a model, OpenTelemetry traces and cost per request.
- A CDC flow diagram (source, change stream, Kafka, reconciliation, lakehouse, with
  monitoring) as one theme-aware SVG.
- Real case studies, each written from facts the owner supplies and drawn from more
  than one employer: faculty scheduling, storage provisioning, and CDC with the
  deletes insight.

**v2.3: retrieval and the engineering practice**
- RAG over pgvector whose index is kept fresh by change events, including deletes,
  with retrieval quality measured by the same eval harness.
- A write-up of the AI-assisted engineering workflow: how Claude Code is steered with
  a CLAUDE.md, tests first, review gates, and a public repo where agents did the
  building, with the review notes. Try Codex or Cursor once so the comparison is real.
- Postmortems and short decision records. A short post on the deletes insight
  ("a snapshot cannot see a record that is gone"), and one on how the content tests
  enforce honesty.

**v2.4 and later**
- A local script that checks the site's content against every résumé variant and
  reports drift.
- Optionally, two résumé downloads (full stack, and backend and data), only if both
  will be kept current.
- "Exploring" tags or a "Learning now" row, only for things the owner has started,
  never for the never-claim list.

**Open design items (the owner is not yet fully satisfied with the look)**
- The car and road, and the intro plate, are archived in
  `docs/archive/route-car/`. Open question: does a traversal element earn its
  place, and what would it prove about the work? Known issues if it returns: page
  height could grow but not shrink, and the speed cap was tuned by measurement.
- Type and colour discipline: reserve the accent for links and interaction, and
  uppercase mono for dates and small metadata. Nav, buttons, labels and chips still
  use tracked mono caps.
- Whether to show the optional availability line in the hero as well as in Contact.

## 6b. Review suggestions: what was done, adapted or set aside

Done as suggested: curated skills list and story order (the ink and grey ranking
was tried and then removed: every skill now shows at full weight, ordered inside each
row by how often target job descriptions ask for it), Goldman in three themes, plain impact labels and a takeaway subtitle, the
Streaming sentence tightened, impact headings as short outcomes with the number
inside, the interests back to a 3 by 2 grid with the drawings above the titles, the
portrait background cut out so the face keeps its natural brightness, interest text edits and the rename to "Life after
launch", interests as editorial rows, buttons in sentence case with Email filled
and Résumé outlined, portrait cooled and aligned, project spacing, copy-to-clipboard
email, lowercase handles, and the double dividers removed.

Adapted: the Streaming line uses "Kafka since 2023", not "in production since
2023", because the résumé says deployed, not production. The Projects subtitle is
"Personal projects, with the code on GitHub" (the owner confirmed they are personal projects), where the earlier wording was held back because "outside work" and "on my own
time" are not established for either project (StudentFieldwork Tracker overlaps a
University of Utah bullet). The Claude Code and Copilot bullet moved to a
Skills row ("AI-assisted development"). Naming specific tools used at Goldman is
worth confirming with the firm's policy.

Set aside, kept as alternatives: a bento layout with one wide lead card, and
pulling a large italic phrase from each interest card (for example "costly and
quiet"). Both are cheap to try if the rows feel too plain. A looser, warmer portrait
needs a new photo. The contact line now says "senior" only, since "mid" can anchor recruiters lower.

Principle recorded 17 Nov 2026: the site is the full record and each résumé is a
tailored excerpt of it, so the site may include more than any one résumé, but
titles, dates and numbers must never contradict it.

## 7. Before and after cutover (owner actions and decisions)

- **Rotate the old Google AI Studio (Gemini) key.** It is in the public repo's
  history (`content/MIGRATION.md`). It was not in the live site's JavaScript when
  checked on 16 Nov 2026. Move AI calls behind a server route if they return.
- **Move the DeepSeek token out of `~/.zshrc`** into a safer store such as the
  macOS Keychain. Never commit it.
- **Analytics.** v1 uses Google Analytics; v2's footer says "No analytics". Decide
  before cutover, because switching loses sight of who visits.
- **Credly link** for the AWS certification (`credentialUrl` is null).
- **Confirm the SonarQube bullet** (did a failed quality gate really block
  merges?) before it is added to Goldman. SonarQube is on the page as a skill only.
- **Oracle Certified Java Associate** is on the site but not on the current
  résumé. Projects are not on the résumé either. Both kept by choice.
- **Print styles** for pages a hiring manager might print.
- **LinkedIn headline and GitHub pins** to match the site's positioning.

## 8. Working rules for this project

- Always look across all five experiences and the résumé variants before proposing
  any skill, interest, expertise, work item or project. Never build one from a
  single role or bullet.
- The union of the résumé variants is the source of truth. Anything on the
  never-claim list (see `content/content.test.ts`) stays off the page until it has
  been done.
- Read-only means read-only. Nothing in the owner's folders is written or
  overwritten without confirmation.
