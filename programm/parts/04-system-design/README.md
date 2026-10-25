# Part 4 — System design and architecture

**Weeks 22–30 · 95 h**

> Goal: design on purpose, and defend it. Write documents that survive a hostile read.

Two halves, deliberately together: **distributed systems** (the part every system-design course covers)
and **frontend architecture** (the part they all skip, and the part you'll actually be judged on).

The unifying skill is the same: state constraints, make a choice, name the trade-off, and be wrong in
ways you can detect.

---

## Concepts — system design

**Framing**
- Functional requirements, non-functional requirements, explicit non-goals
- Latency vs throughput vs cost; picking the constraint that actually binds
- Back-of-envelope estimation: QPS, storage/year, bandwidth, fan-out, cost/request
- The difference between a requirement and a solution someone already likes

**Scaling**
- The ladder: vertical → cache → read replicas → partition → async → edge. In that order, because order is the lesson.
- What breaks at 10× and at 100× (they are different problems)
- Hot keys, thundering herds, retry storms

**Distribution**
- CAP stated precisely, and PACELC (what happens when there's no partition — which is most of the time)
- Consistency models: linearizable, sequential, causal, read-your-writes, monotonic reads, eventual
- Replication: leader/follower, lag, failover, split brain, replica reads and stale data
- Partitioning: hash vs range, rebalancing, consistent hashing, cross-partition queries
- Idempotency and the "exactly once" illusion; at-least-once plus dedupe

**Caching**
- Layers: browser, CDN, app, DB. Which one to reach for, and why the closest one wins
- Invalidation strategies; TTL jitter; stampede protection; cache-aside vs write-through
- What caching costs you: staleness, coherence, and a new failure mode

**Async and events**
- Queues for decoupling vs for throughput; when a queue makes things worse
- Outbox pattern; transactional messaging; ordering guarantees (and their cost)
- Event sourcing: the two problems it solves and the five it creates

**Failure**
- Timeouts, retries with jitter, circuit breakers, bulkheads, load shedding
- Graceful degradation: what the user sees when a dependency dies
- Partial failure as the normal case, not the exception

**Multi-tenancy**
- Silo, pool, bridge; the query-level implications of each
- Noisy neighbours; per-tenant quotas; data isolation as a correctness property

**Cost**
- Cost per 1k requests, per GB stored, per GB egress — as a design input, not an afterthought

---

## Concepts — frontend architecture

**Boundaries**
- What a "layer" means in a UI app; dependency direction; what may import what
- Feature folders vs technical folders — and the failure mode of each at 5 engineers vs 25
- Shared code: when a shared package is a coupling you'll regret

**State**
- The four kinds: server state, client state, URL state, form state. Different lifetimes, different tools.
- Ownership: exactly one owner per piece of state; duplication is a bug, not a convenience
- Derived state and memoisation; the bugs that come from caching derivations

**Data fetching**
- Waterfalls and how to see them; parallelisation; prefetch on intent
- Cache semantics: staleness, revalidation, optimistic updates, rollback
- Deduplication and request coalescing

**Components**
- Component API design: props as a contract; composition over configuration
- Design systems: tokens, primitives, versioning, and the migration problem
- Accessibility as an architectural constraint (focus management, live regions), not a lint rule

**Monorepos**
- Workspaces, task graphs, caching, affected builds
- When a monorepo is a tax: team boundaries, release cadence, tooling maturity

**Testing strategy**
- Test level per risk; what you deliberately don't test
- Contract tests between UI and API; where the type boundary lives
- e2e for the few paths where the money is; why 500 e2e tests is a failure state
- Visual regression: cheap for design systems, expensive for everything else

---

## Project — Console v4

Full detail in `project.md`. Four artifacts:

1. `docs/design-100x.md` — your console at 1M events/min, 10k tenants
2. `docs/design-foreign.md` — a system outside your comfort zone
3. `docs/design-frontend.md` — module map, state ownership, test plan
4. `docs/architecture-review-*.md` — a real OSS project, reviewed

Plus one hard slice implemented (partitioned ingest with degradation) and one failure drill executed.

---

## Exit criteria

- [ ] A design doc survives a hostile read: every claim has a number or a named trade-off
- [ ] Estimate QPS and storage for an unfamiliar product in 10 minutes, on paper
- [ ] Explain what breaks first at 10× and at 100×, and why
- [ ] Point at a repo's module graph and name three architectural smells
- [ ] Your frontend design doc assigns ownership of every piece of state, with no "it depends"
- [ ] You ran a failure drill and changed the design because of it

---

## Resources

`RESOURCES.md` § Part 4. Minimum:

1. *Designing Data-Intensive Applications* ch. 1–6, 8–9 (paid — the one book to actually buy)
2. [System Design Primer](https://github.com/donnemartin/system-design-primer) — topic index, not a read-through
3. [AWS Builders' Library](https://aws.amazon.com/builders-library/) — timeouts, retries, backoff, load shedding
4. [Google SRE Book](https://sre.google/sre-book/table-of-contents/) — SLOs, cascading failures
5. [Patterns.dev](https://www.patterns.dev/) — the frontend rendering and data patterns
6. *A Philosophy of Software Design* (paid, short) — the best 150 pages on decomposition

---

## How to write a design doc that gets critiqued

The test isn't "does it sound impressive". It's: **can a smart stranger find the weak point?**

- Numbers, not adjectives. "Fast" is not a requirement. "p95 < 200 ms at 5k req/s" is.
- One decision per section, with the alternatives you rejected and why.
- An explicit "what I'd do differently at 10×" section.
- A "known weaknesses" section you wrote yourself. This is the section that earns trust.
- No diagrams that only restate the text. A diagram should show something prose can't.

Template and review checklist: `design-docs.md`.

---

## Common ways this phase goes wrong

- **Designing for 100× on day one.** You'll build a distributed system to serve 200 users. The 100× doc is an exercise in *understanding*, not a build plan.
- **Copying a known architecture.** "Netflix uses X" is not an argument. Start from your constraints; arrive (or don't) at X on your own.
- **Architecture without code.** The hard slice exists to keep you honest. If the design can't survive contact with an implementation, it wasn't a design.
- **Skipping the frontend half.** It's the half you'll be hired for. It's also the half where most senior FE candidates are weakest.
- **Writing for the reader you wish you had.** Write for a skeptical staff engineer who has 20 minutes.
