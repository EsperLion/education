# Writing and reviewing design docs

Two things live here: the **template** you write against, and the **checklist** a reviewer would use.
Write knowing the checklist exists — that's the whole trick.

---

## Template

```markdown
# <System> — design

Status: draft | review | accepted     Author:     Date:
Reviewers:                             Supersedes:

## 1. Problem and context
What exists today. What hurts. Why now. Two paragraphs maximum.

## 2. Requirements
### Functional
- ...
### Non-functional
- Load: avg / peak QPS, payload size, growth rate
- Latency: p50 / p95 / p99 targets, per endpoint
- Availability: target, and what "unavailable" means to the user
- Retention, consistency, compliance
### Explicit non-goals
- ...

## 3. Estimates
Show the arithmetic. Every number below must be traceable to an assumption above.

| Quantity | Assumption | Result |
|---|---|---|
| Peak write QPS | 1M/min ÷ 60 × 2 (peak factor) | 33k/s |
| Bytes/event | measured from fixture | ~520 B |
| Storage/day | 33k × 86.4k s × 520 B | ~1.5 TB |
| Storage/90d | × 90, × 0.6 (compression) | ~81 TB |
| Read QPS | 10k tenants × 20 req/min ÷ 60 | ~3.3k/s |
| Egress/day | ... | ... |

## 4. API
Shapes and guarantees. Not full schemas. Note pagination, idempotency, error model.

## 5. Data model and storage choice
The schema, and the *decision*: why this store. Include at least two rejected alternatives
with the reason each was rejected.

## 6. Write path
Ingest → validation → buffer → persistence. Where is backpressure? What is the failure
behaviour at 3× peak?

## 7. Read path
Raw vs precomputed. Cache layers and their TTLs. What a cold read costs.

## 8. Partitioning, retention, rebalancing
Key choice. Hot-key analysis. How data is deleted (and how long that takes).

## 9. Consistency and correctness
What must be strongly consistent. What may lag, and by how much. Idempotency guarantees.

## 10. Failure modes
One subsection per dependency: detect, degrade, recover. What the user sees.

## 11. Operational concerns
Deploy, rollback, migrations, observability, on-call burden, cost/month.

## 12. Alternatives considered
Three, with why-not. One sentence each is enough — but they must be real.

## 13. What I'd do differently
At 10× and at 1/10×.

## 14. Known weaknesses
Written by the author. This section is the credibility test.
```

---

## The hostile-read checklist

A reviewer's questions, in the order they'll be asked. Score your own doc against this before showing it
to anyone.

### Structure and honesty
- [ ] Is there a single sentence stating what this system does? (If not, the doc is not ready.)
- [ ] Are the non-goals specific enough to exclude something? ("No fancy UI" is not a non-goal.)
- [ ] Does every number trace back to an assumption, or is it labelled a guess?
- [ ] Is there a "known weaknesses" section, and is it uncomfortable to read? (If it isn't, it's decoration.)
- [ ] Are the rejected alternatives real, or strawmen?

### Estimates
- [ ] Do peak and average QPS differ, and is the multiplier justified?
- [ ] Is storage growth computed for a year, not just a day?
- [ ] Is egress cost mentioned? (It's the one everyone forgets.)
- [ ] Do the units line up? (Check twice. Bytes vs bits, per-second vs per-minute.)
- [ ] Is the estimate within an order of magnitude of reality, or at least honest about uncertainty?

### Data
- [ ] Does every index correspond to a named query?
- [ ] Is the partitioning key chosen against the dominant query, and does it create hot partitions?
- [ ] What happens to a cross-partition query? Is it answered, slow, or forbidden?
- [ ] Is deletion/retention an actual mechanism or a wish?
- [ ] Are constraints in the database, or only in application code?

### Correctness
- [ ] What happens on a retried write? Is it stated, or assumed?
- [ ] Is there a consistency claim anywhere, and is it precise ("read-your-writes on the session")?
- [ ] What's the failure behaviour of a partially-completed operation?
- [ ] Are concurrent updates considered at all?

### Failure
- [ ] For each dependency: detect (how fast?), degrade (to what?), recover (how?)
- [ ] Is there a timeout on every outbound call? A retry budget? A breaker?
- [ ] Does a retry storm make the outage worse? (Usually yes, if nobody thought about it.)
- [ ] What does the user see during a partial outage? Is that a designed state?
- [ ] Is there any unbounded queue, buffer, or table? There always is, unless you looked.

### Operations
- [ ] Can this be deployed without downtime? Rolled back in two minutes?
- [ ] Is the migration plan compatible with the old code running concurrently?
- [ ] What will page someone at 3 a.m., and is that acceptable?
- [ ] What's the monthly cost, and which line item dominates?

### Frontend-specific (for `design-frontend.md`)
- [ ] Does every piece of state have exactly one owner?
- [ ] Is the dependency direction enforced by tooling, or by hope?
- [ ] Does the test plan name what is *not* tested, and why that's acceptable?
- [ ] Is the data fetching strategy specific (TTLs, invalidation triggers), not "we use a cache"?
- [ ] Is accessibility addressed at the architecture level (focus, announcements, keyboard paths)?

---

## Estimation cheat sheet

Memorise roughly. Precision is not the point; order of magnitude is.

**Time**
- 1 day ≈ 86,400 s ≈ 10⁵ s
- 1M/day ≈ 12/s · 1M/hour ≈ 280/s · 1M/min ≈ 17k/s
- 1k/s ≈ 86M/day

**Latency (order of magnitude)**
| Operation | ~Time |
|---|---|
| L1 cache | 1 ns |
| Main memory | 100 ns |
| SSD random read | 100 µs |
| Same-datacentre round trip | 0.5 ms |
| Same-region (cloud) round trip | 1–2 ms |
| Cross-continent round trip | 80–150 ms |
| Postgres simple indexed read | 0.1–1 ms |
| Postgres indexed write (durable) | 1–5 ms |

**Throughput (single node, ballpark)**
- Node HTTP, trivial handler: 10–30k req/s per core
- Postgres: 5–20k simple writes/s; 50k+ reads/s; far less with joins and hot rows
- nginx/Caddy static: 50k+ req/s

**Sizes**
- Typical JSON event: 300–800 B
- 1 KB × 1M/s = 1 GB/s
- 1M events × 500 B = 500 MB/day ≈ 180 GB/year uncompressed
- Compressed JSON typically 3–10× smaller

**Rules of thumb**
- p95 is typically 2–3× the mean; p99 is 5–10×. Design for p95, alarm on p99.
- Fan-out at write is cheap until the graph gets dense; fan-out at read is cheap until the graph gets big.
- The closest cache wins. Browser beats CDN beats app beats DB, in both latency and cost.
- Every retry multiplies load. Every timeout that's too long multiplies it further.
- If you can't estimate it, you can't design it — go measure something.

---

## The one rule

> A design doc is not a description of what you'll build. It's an argument for why this is the least-wrong
> option under these constraints. If it has no rejected alternatives, it's not an argument.
