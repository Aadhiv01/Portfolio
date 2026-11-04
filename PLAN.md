# Portfolio v2 — plan and case-study template

## Status

| Phase | Scope | Status |
|---|---|---|
| 0 | Branch + Next.js scaffold + tooling | Done on `v2` |
| 1 | Content migration + typed schema | Done on `v2` |
| 2 | Design system, layout, sections, case-study pages | Next |
| 3 | Router Lab: classifier, provider router, failover, telemetry, BYOK route | Not started |
| 4 | Eval harness + committed results + charts | Not started |
| 5 | QA (Lighthouse, a11y, 375/1440) + Vercel/GoDaddy cutover | Not started |

Phase 3 provider decision: Anthropic `claude-sonnet-5-5` (strong tier) and
DeepSeek `deepseek-chat` (cheap tier), with cross-provider failover. `claude-3-5-sonnet`
is retired and must not be used. `deepseek-reasoner` (R1) is reserved for
math/logic only if the eval shows a reasoning model wins. Verify IDs and prices
from the provider docs at build time; keep them in one server config file.

## Case-study template

Every project page uses these sections, in order:

1. **Snapshot** — role, timeline, stack, one-line outcome.
2. **Problem** — what was broken or missing, and who felt it.
3. **Constraints** — scale, latency, budget, team, compliance.
4. **Approach** — the decisions that mattered and the alternatives rejected.
5. **Architecture** — a diagram plus the request/data flow.
6. **Results** — only measured numbers, with the measurement method. No
   guarantees, no invented percentages.
7. **What I'd change** — one honest tradeoff.

Unverified claims stay as `[[TODO: …]]` until evidence exists. Charts and
tickers read only committed data.
