# Project — Capstone v5

**Weeks 31–36.** Feature freeze at the end of week 33. Weeks 34–36 are delivery, docs, and the demo.

The goal is not more features. The goal is: **a stranger can clone this, run it, understand it, and
safely change it.** That's the whole deliverable.

---

## 1. Repository shape

```
/
├── apps/
│   ├── web/          # UI — framework-free view layer over stream-grid where possible
│   ├── api/          # ingest + query + auth
│   └── worker/       # rollups, retention, dead letters
├── packages/
│   ├── stream-grid/  # Part 2 library
│   ├── shared/       # Event type, API contract, validation schemas
│   └── config/       # tsconfig, eslint, shared build config
├── docs/
│   ├── ARCHITECTURE.md
│   ├── adr/          # 0001-*.md … 0008-*.md
│   ├── RUNBOOK.md
│   ├── budget.md
│   ├── design-*.md   # from Part 4
│   └── failure-drill.md
├── infra/
│   ├── docker-compose.yml
│   ├── Dockerfile.api
│   ├── Dockerfile.web
│   ├── Caddyfile       # or equivalent, if deploying
│   └── migrations/
└── .github/workflows/ci.yml
```

Boundary rules — enforced by lint config, not by memory:
- `web` may import `shared` and `stream-grid`; never `api` or `worker` internals.
- `api` and `worker` may import `shared`; `worker` may import `api`'s job code, not its HTTP layer.
- `shared` imports nothing from the apps.
- No cross-app relative imports (`../../api/src/...`) — that's the smell this phase exists to remove.

---

## 2. CI (`.github/workflows/ci.yml`)

Must run on every push and PR, **under 8 minutes**, and fail for the right reasons:

| Job | Checks | Fails when |
|---|---|---|
| `typecheck` | `tsc --noEmit` across workspaces | any type error |
| `lint` | eslint + boundary rules + import cycles | boundary violation, cycle, lint error |
| `unit` | stream-grid, shared, pure functions | any failure |
| `integration` | API + worker against real Postgres (service container) | any failure |
| `build` | production build of web + api | build error |
| `bundle` | initial JS gzip size vs budget | over budget by >5% |
| `perf` | headless scroll + ingest benchmark vs baseline | p95 frame time or ingest lag regression >15% |
| `audit` | dependency audit, lockfile check | known critical vuln, lockfile drift |

Two requirements that make this real:

- **The perf job must be able to fail.** Prove it: introduce a deliberate 3× slowdown, watch CI go red,
  then revert. Document the run in `docs/failure-drill.md`.
- **Flaky tests get quarantined, not retried.** A retry-mask hides the bug you'll meet in production.

---

## 3. Deployment

Pick one and commit to it:

**Option A — VPS (recommended if you'll keep it):**
- One small box, Docker Compose behind Caddy (automatic TLS).
- Postgres in a container with a named volume; nightly `pg_dump` to object storage or another box.
- **Restore tested once**, timed, written into `RUNBOOK.md`.
- Deploy = `git pull && docker compose up -d --build`, with a tagged previous image for rollback.

**Option B — managed free tier:**
- Static web on Netlify/Vercel/Cloudflare Pages.
- API + Postgres on Fly.io/Railway/Neon free tier.
- Same rollback discipline; you just inherit less of the ops.

**Non-negotiable either way:** a documented rollback that you have actually performed once, timed, in
under two minutes.

---

## 4. `ARCHITECTURE.md` (2–4 pages)

For an engineer who will join in six months:

1. What the system does, in one paragraph, in plain language.
2. The diagram — components, data flow, and where the trust boundaries are. One diagram, meaningful.
3. The three decisions that shape everything else, each linking to its ADR.
4. Request lifecycle: a write, and a read, end to end, with the names of the actual modules.
5. Where the sharp edges are: known weaknesses, deliberate compromises, "don't do this" notes.
6. How to run it, and how to run the tests. (Link, don't duplicate.)

The test: could someone predict where a bug lives after reading only this?

---

## 5. ADRs (5–8)

`docs/adr/NNNN-title.md`, format:

```markdown
# 0007 — Time-partitioned events table instead of a separate time-series store

Status: accepted (2026-XX-XX)

## Context
90-day retention, 33k writes/s peak, queries always scoped to a tenant and a time range.
We already run Postgres and have no ops capacity for a second datastore.

## Decision
Partition `events` monthly with `pg_partman`; retention = drop partition.

## Consequences
+ No new infrastructure; existing backup/restore path covers it.
+ Partition pruning makes retention queries cheap.
− Cross-tenant, cross-month queries must fan out; capped by API design.
− Requires monitoring that next month's partition exists.
− Migration tooling must handle partition creation specially.
```

Candidates for the 5–8: storage engine choice · partitioning key · auth model · idempotency mechanism ·
rollup strategy · monorepo layout · rendering strategy · state ownership · deploy target.

Write each **when you decide**, not at the end.

---

## 6. `RUNBOOK.md`

For 3 a.m., half asleep:

- What the service looks like when healthy (the one dashboard).
- Top five alerts, each with: what it means, first check, safe mitigation, escalation.
- Deploy procedure and rollback procedure, copy-pasteable.
- Restore-from-backup procedure, with the last test date.
- "I'm about to do something risky" checklist: backup? rollback ready? off-peak?

---

## 7. `README.md`

The front door. Ten steps maximum from clone to a working query:

```
1. prerequisites
2. cp .env.example .env
3. docker compose up
4. open http://localhost:...
5. log in with the seeded user
6. here's what you should see
```

Include: what the project is (2 sentences), a screenshot or terminal recording, the architecture link,
the test commands, and the licence. No badges you don't earn.

---

## 8. Demo (5 minutes, no notes)

Structure:
1. **0:00–0:30** — the problem, in user terms. What this console is for.
2. **0:30–2:00** — the live path: stream in, table renders, 100k rows, smooth. Show the HUD.
3. **2:00–3:00** — a query with filters, paginated, fast. Show the plan behind it.
4. **3:00–4:00** — the failure story: kill the DB, show degradation, bring it back.
5. **4:00–5:00** — the architecture in one picture, and the one decision you'd defend hardest.

Record it once. Watching yourself is the cheapest feedback available.

---

## Definition of done

- [ ] Clean clone → running in under 10 minutes, following only the README
- [ ] CI green, under 8 minutes, and proven able to fail
- [ ] Deployed and reachable, or a documented local-only rationale with a runbook
- [ ] Rollback performed once and timed at under 2 minutes
- [ ] Backup restore performed once and documented
- [ ] `ARCHITECTURE.md` predicts where a bug would live (test it on a friend)
- [ ] 5–8 ADRs, written at decision time
- [ ] `RUNBOOK.md` with the top five alerts
- [ ] Demo recorded, 5 minutes, watchable
- [ ] Rubric rescored (W36); every previously-shaky domain ≥ 2
- [ ] Final `log/week-36.md` — read week 1's entry first

---

## What comes after

Not a new program. Three options, in order of value:

1. **Maintain it for three months.** Fix what annoys you. Add one feature a month. Real learning lives
   in maintenance, and almost nobody does it.
2. **Find a system at work that hurts**, and apply one artifact — a design doc, a test plan, a perf budget.
   The program's value is realised when it changes your day job.
3. **Teach one piece of it** — a talk, a blog post, a review for a colleague. Teaching is the cheapest
   way to find the holes you still have.
