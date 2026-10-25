# Project — Console v4

**Goal:** produce four documents that can be critiqued and one implementation that can fail, then make
the architecture survive the failure.

Weeks 22–30. Rough allocation: **estimation 1 week · design-100x 3 weeks · frontend design 2 weeks ·
foreign design 1.5 weeks · hard slice 2 weeks · review + failure drill 0.5 week.**

---

## Artifact 1 — `docs/design-100x.md`

Your console at **1M events/min ingested, 10k tenants, 90-day retention, p95 query < 500 ms**.

Sections (see `design-docs.md` for the full template):

1. **Requirements** — functional, non-functional, explicit non-goals. Who uses it, for what, how often.
2. **Estimates** — events/s (peak/avg), bytes/event, storage/90d, query QPS, egress, cost/month. Show the arithmetic.
3. **API** — the endpoints, at the level of shape and guarantees, not OpenAPI.
4. **Data model and storage choice** — Postgres? Postgres + partitioning? ClickHouse? Timescale? Justify against at least two alternatives. This is the central decision; spend time here.
5. **Write path** — ingest → validation → buffer → storage. Where does backpressure live? What happens at 3× peak?
6. **Read path** — raw vs rollups; cache layers; what a dashboard load costs.
7. **Partitioning and retention** — key choice, hot-key analysis, how deletion actually happens.
8. **Failure modes** — one section per dependency: DB, queue, upstream, cache. What degrades, what breaks, what the user sees.
9. **What I'd do differently at 10×** — and at 1/10×. This section reveals whether you designed or copied.
10. **Known weaknesses** — written by you, before anyone else finds them.

Constraints: 4–6 pages. Every claim either has a number or is explicitly labelled as a guess. No
architecture diagram that only repeats the prose.

---

## Artifact 2 — `docs/design-frontend.md`

Architecture for the console UI at **50 screens, 6 engineers, 2 years of churn**.

Must contain:

1. **Module map** — the actual dependency graph, with the allowed directions. Include the rule ("features
   may import shared; shared may not import features") and how it's enforced (lint rule, not discipline).
2. **State ownership matrix** — a table: state → owner → lifetime → update mechanism → who reads it.
   Every row filled. No "it depends".
3. **Data fetching strategy** — what's cached, for how long, how it's invalidated, where prefetching
   happens, how optimistic updates roll back.
4. **Rendering strategy** — what's server-rendered (if anything), what's client, what's static; why.
5. **Test plan** — a table: risk → test level → what it covers → what it deliberately doesn't.
6. **Design system boundary** — what's a primitive, what's a pattern, how a breaking change ships.
7. **Third-party boundary** — what's allowed in, and the exit cost of each choice.

Constraints: 3–4 pages. This document will be the thing you're most likely to reuse in a real job, so
make it specific to *this* app rather than generically correct.

---

## Artifact 3 — `docs/design-foreign.md`

A system outside your comfort zone. Pick one:

- **Collaborative document editor** — OT vs CRDT, presence, offline, conflict semantics.
- **Activity feed** — fan-out on write vs read, ranking, cold start, deletion.
- **Job scheduler** — cron vs delayed queue, exactly-once semantics, catch-up after downtime, clock issues.
- **File sync** — chunking, dedupe, conflict resolution, resumable transfer.

Requirements: same template, 3–4 pages, but **you have no code to lean on** — so the design must stand on
reasoning alone. This is the artifact that tests whether the previous two taught you a transferable skill
or just made you fluent in your own system.

---

## Artifact 4 — `docs/architecture-review-<project>.md`

Review a real OSS project you didn't write. Candidates:

- A frontend-heavy app with a real backend (Grafana, Hoppscotch, Outline, Cal.com)
- A build tool with an interesting internal architecture (Vite, esbuild)
- Something in your own domain that you've used and wondered about

Method:
1. Map the module graph from the imports (a script is fine — 30 lines).
2. Identify the boundaries and whether they hold.
3. Find three smells, each with a file path and a concrete consequence.
4. Find one thing done well that you'd copy.
5. Write it as if the maintainers will read it. They might.

Constraints: 2–3 pages, no drive-by criticism. Every smell needs a *consequence*, not just a preference.

---

## Hard slice — partitioned ingestion with degradation

Implement, not just design. Target: **sustain 3× your current ingest rate, with no unbounded memory
growth, and degrade visibly rather than silently.**

Minimum:
1. **Time partitioning** of `events` (monthly or daily, `pg_partman` or hand-rolled), with creation ahead
   of time and automatic drops past retention.
2. **Batched ingest** with a bounded queue. When the queue is full: shed load with 429, never grow.
3. **Circuit breaker** around the DB writes. When open, accept-and-buffer-to-disk or reject — pick one,
   document why, and make the choice visible in metrics.
4. **Degradation mode**: when the DB is unavailable, the UI keeps streaming (from the in-process fan-out)
   and shows a clear "history unavailable" state. No spinner-of-death.
5. **Measured**: before/after throughput, p95 ingest latency, memory profile under 3× load.

Non-goal: actually handling 1M events/min. You're proving the *shape* holds, not paying for the hardware.

---

## Failure drill — execute this, don't plan it

Pick three, run them, and write up each in `docs/failure-drill.md`:

- [ ] Stop Postgres for 60 s mid-ingest. What does the UI show? What does the API return? Any data loss? Fix the worst behaviour.
- [ ] Make the upstream stream die silently (no FIN). Does your reconnect detect it? Add a heartbeat.
- [ ] Throttle the DB to 50 ms/query. Where does latency accumulate first? Add a timeout that fails fast.
- [ ] Kill the worker while a job is `running`. Does it recover? How long until it does?
- [ ] Fill the disk. (Yes, really — a small loopback volume.) What breaks first?

Each write-up: **timeline · what the user saw · what the metrics showed · what you changed · what's still
wrong**. Keep "what's still wrong". It's the honest column.

---

## Definition of done

- [ ] Four design docs, each with a "known weaknesses" section you wrote
- [ ] Every estimate shows its arithmetic
- [ ] `design-frontend.md` has a completely filled state ownership matrix
- [ ] Architecture review names three smells with file paths and consequences
- [ ] Hard slice measured: throughput, p95 latency, memory under 3× load
- [ ] Three failure drills executed with timelines and follow-up changes
- [ ] One design doc has been read by someone else (a colleague, a forum, a friend) and you recorded their criticism
