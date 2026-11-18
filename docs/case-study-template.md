# Case-study template

Send me short answers to these seven prompts for each project — plain prose is
fine, no formatting needed. I turn them into the `/work/[slug]` page and keep the
site's claim rules: only measured numbers, no invented metrics.

1. **Context** — what the system did and who used it.
2. **Problem** — what was broken or missing, who felt it, and what it cost them.
3. **Constraints** — scale, latency, team size, budget, compliance, legacy systems.
4. **Your role** — what you owned versus what the team owned.
5. **Decisions** — two or three decisions that mattered, the alternatives you
   rejected, and why.
6. **Results** — numbers only if you measured them; say how they were measured.
   If you did not measure, say what changed qualitatively.
7. **Tradeoff** — one thing you accepted to get the result, or would do
   differently now.

## Filled sample (illustrative, not your project)

> **Context.** A reconciliation service for a payments team. It compared the
> ledger against settlement files and opened a break when a transaction did not
> match on id, amount, currency or value date.
>
> **Problem.** Breaks were found by eye in a spreadsheet each morning. A break
> could sit for a day before anyone saw it, and the same break was often
> investigated twice by different people.
>
> **Constraints.** About 40k transactions a day, a 15-minute freshness target,
> a two-person team, and an existing Oracle system that could not be replaced.
>
> **Role.** I owned the matching job and the alerting path; a teammate owned the
> upstream extract, and we shared on-call.
>
> **Decisions.** We replaced the nightly batch extract with change data capture
> over Kafka. The alternative was a more frequent batch job: simpler, but it kept
> a fixed delay and still scanned unchanged rows. We also ran deterministic
> rules first and sent only ambiguous breaks to an LLM for triage, because
> sending every break to a model cost more and was slower for the common case.
>
> **Results.** Break visibility moved from next-morning to under 15 minutes,
> measured from the event timestamp to the alert. Duplicate investigations
> dropped after deduplicating by break signature; the count came from the alert
> log over eight weeks.
>
> **Tradeoff.** The pipeline is at-least-once, so the matcher has to be
> idempotent. That cost extra work up front, but it means a redelivery cannot
> open a second break.

## How it renders

The page currently has this shape, in order:

1. **Snapshot** — role, timeline, stack, one-line outcome.
2. **What it does** — the migrated project summary and feature list.
3. **Problem** — prompt 2.
4. **Constraints** — prompt 3.
5. **Decisions** — prompt 5, as short labelled blocks.
6. **Request and data flow** — prompt 1 plus a diagram only if it earns its place.
7. **Results** — prompt 6, measured numbers only.
8. **Tradeoff** — prompt 7.

Until all seven prompts are answered, the page shows a visible **Draft** badge and
`[[TODO]]` blocks. That is intentional: a draft page is better than an invented
one, but it should not be linked from the home page while it is a draft.
