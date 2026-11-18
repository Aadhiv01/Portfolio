# Owner's to-do: what to learn and build next

For the owner, not for the site. It is the ranked list from the portfolio
planning, ordered by how often job descriptions ask for it and how cheaply it
closes a gap. Last updated 2026-11-17.

## How this list was made

- The résumé variants (all of them, combined) show the real strengths: Java and
  Python backends, React and Angular front ends, SQL and NoSQL, Kafka, AWS,
  Terraform, Kubernetes, Jenkins, Grafana, on-call, and mentoring.
- The job-search profile (`job_search_profile_summary.txt`) lists the gaps worth
  closing, ranked by how often JDs ask: Docker, an observability tool, a small AI
  feature you can truthfully show, accessibility basics, and a test-first habit.
- Caution on the data: the JD sample leaves out roles that were skipped because
  they required LLM, RAG or MLOps. So those skills are probably more in demand
  than the sample suggests. Paste the skipped JDs and the terms can be counted.

## Do these first

1. **Docker.** Containerize one small service and deploy it on AWS. Closes the
   biggest gap, and is needed for most of the rest.
2. **Triage as a full stack tool (the flagship).** The planned CDC + LLM
   reconciliation project, built as a small full stack product: a Postgres source,
   change events through Kafka, a reconciliation job, an LLM that suggests the
   cause of a break, and a review screen where an operator accepts or edits it.
   Rules run first and the model handles the ambiguous cases. Test it on failures
   you injected yourself, and compare rules only, model only, and the mix on
   accuracy, cost, latency and false alarms. Use synthetic data only.
3. **One general LLM feature in a normal app**, such as pulling structured fields
   out of messy text, reusing the same evaluation setup. Covers the feature-side
   roles.
4. **Observability.** Instrument one service with OpenTelemetry and send it to
   CloudWatch or Grafana. JDs list observability tools as common.
5. **A test-first habit.** One side project built with red, green, refactor, with
   the commits to show it.
6. **GitHub Actions on the portfolio repo** (lint and tests on every pull
   request). About an hour, and it closes a gap.

## Then

7. **Authentication depth.** A small Spring Boot app with JWT and OAuth login.
8. **Distributed-systems fundamentals.** Idempotent consumers, ordering and
   retries, in a Kafka-backed service.
9. **Accessibility basics.** Audit the portfolio itself and write up the fixes.
10. **MLOps tooling, in this order if you go for ML platform roles:** Airflow
    (closest to your Autosys work), MLflow (tracking, registry, and LLM tracing and
    evaluation), then Databricks Free Edition for the lakehouse side (do not claim
    your lakehouse was Databricks), and SageMaker only conceptually. RAG with
    pgvector fits naturally: you already know Postgres, and your CDC experience
    gives you a real angle on keeping an index fresh when records are deleted.

## Reference JD: LLM-based full stack engineer (Adobe, agentic product)

Saved 2026-11-17 as the target for the AI-side projects. It is a stretch role
today: its required items include shipped agentic systems, which the never-claim
list says not to claim yet. Use it as the scope for what to build, then apply once
the work exists.

| What the JD asks for | Where you stand | How to close it |
|---|---|---|
| Full-stack depth across backend, APIs and clients | Strong (Java, Python, React, Angular) | Already on the site |
| AI-assisted engineering (Claude Code, Codex, Cursor) with a real workflow | Strong on Claude Code and Copilot, review-first | Show it: a public repo where agents did the building, with tests, review notes and the CLAUDE.md that steered them (v2.3). Try Codex or Cursor once so you can speak to them |
| LLM APIs, prompt engineering, context window management | Router Lab covers API integration, streaming, failover and cost | Ship the Lab with an eval (v2.1), and add context management to the agent project |
| Agentic systems: tool use, multi-step reasoning, orchestration, memory | Gap | The triage tool as an agent (v2.2): tool-calling loop, multi-step investigation, a small working memory of past breaks, and an honest list of its failure modes |
| Retrieval-augmented generation | Gap | RAG with pgvector whose index is kept fresh by change events, including deletes (v2.3) |
| Evaluation and quality framework for agent behavior | Interest, not yet shipped | The three-arm eval harness: rules only, model only, and the mix, scored on known failures. Commit the results and the regression check (v2.1 and v2.2) |
| Guardrails, data protection, observability | Adjacent (Grafana, sensitive data at work) | Structured-output validation, redaction of identifiers before they reach a model, and OpenTelemetry traces and cost per request (v2.2) |
| Developer experience: tooling, local loops, CI/CD | Adjacent (Jenkins, GitLab CI/CD) | GitHub Actions on the portfolio repo, a one-command local setup, and a short note on how the loop works (v2.1) |
| Cross-functional work with product, design, platform, security | Yes (on the résumés) | Already on the site |
| Responsible AI for generative and agentic systems | Gap in vocabulary, not in instinct | A short "limits and failure modes" section in each AI project write-up |

Terms from this JD worth counting in the skipped-JD tally: LLM APIs, prompt
engineering, context window, RAG, tool use, agent orchestration, memory, evals,
guardrails, observability, Claude Code, Codex, Cursor.

## Housekeeping

- Capture plain screenshots of NeighborNexus and StudentFieldwork Tracker. They would
  read better than the illustrations on the Projects section.
- Get a looser, warmer portrait with a hint of environment. The current one reads
  like an ID photo, even after being cooled and darkened.
- Decide whether the Goldman bullets may name specific tools (Claude Code, GitHub
  Copilot) under the firm's policy.
- Confirm whether NeighborNexus and StudentFieldwork Tracker were built on your
  own time, so the Projects subtitle can say so.
- Rotate the old Gemini key. Move the DeepSeek token out of `~/.zshrc`.
- Delete the `angular php` résumé folder. Fix Hibernate to Hibernate/JPA on the
  senior full stack and tesla variants.
- Confirm the SonarQube quality-gate wording before adding that bullet.
- Add the Credly link for the AWS certification. (Analytics is decided: Google Analytics 4.)
- Update LinkedIn to match the site headline, and pin the portfolio repo.

## What goes on the site, and when

Nothing on this list appears on the site as a claim until it is done. Items you
have started can appear as "exploring" cards. Items you have finished can move
into Experience, Skills or a "Building now" section. The tests will block anything
on the never-claim list until you remove it from that list yourself.
