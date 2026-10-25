# Syllabus — 36 weeks

~440 hours at ~12 h/week. Phases overlap slightly; the order below is nominal.

| Part | Weeks | Hours | Focus | Ship |
|---|---|---|---|---|
| 0. Baseline | 1 | 10 | Diagnostic, repo, north star | Filled rubric + log |
| 1. The machine and the wire | 2–7 | 75 | JS runtime, event loop, rendering, HTTP/TLS/DNS, caching, CDN, profiling | Console v1 |
| 2. Algorithms that pay rent | 8–13 | 80 | Complexity, hashing, trees, heaps, graphs, recursion, discrete math | Console v2 (library) |
| 3. Backend and data | 14–21 | 110 | Node internals, APIs, auth, Postgres, transactions, jobs, idempotency | Console v3 |
| 4. System design and architecture | 22–30 | 95 | Estimates, replication, partitioning, failure modes, FE architecture, testing | 3 design docs + hard slice |
| 5. Craft and capstone | 31–36 | 70 | Build/CI, observability, security, refactoring, writing | Capstone v5 |

Weeks 6–7 are a deliberate seam: while Part 1 finishes, you write your first ring buffer and compute
your first Big-O. The formal Part 2 block is weeks 8–13. Do not start a phase before its predecessor's
exit criteria are met; the week ranges are a guide to *pace*, not permission.

---

## Part 0 — Baseline (1 week, 10 h)

**Goal:** make progress measurable.

- Fill `RUBRIC.md` honestly. Do this before reading anything, so the "before" is real.
- `git init` the program folder + the project repo. One repo for the product, one for notes if you prefer.
- Write the **north-star statement**: 4 sentences on what you want to be able to do at week 36.
  Put it at the top of `PROGRESS.md`.
- Pick your data sources from `DATA-SOURCES.md` and note why.
- Install the baseline toolchain: Node LTS, pnpm, Docker (for Postgres later), a Postgres client,
  Chrome + your editor's debugger.
- Write `log/week-01.md`.

**Deliverable:** filled rubric, north-star statement, repo skeleton, week-01 log.

**Exit:** you can state, in one sentence, what you will be able to do in 9 months that you cannot do now.

---

## Part 1 — The machine and the wire (weeks 2–7, 75 h)

**Goal:** stop treating the browser and the network as magic.

### Concepts

*Runtime and memory*
- Parse → bytecode → JIT; hidden classes and why object shape matters; inline caches
- Call stack, heap, stack vs heap allocation, GC generations, minor/major GC pauses
- Memory leak taxonomy: detached DOM, forgotten listeners, unbounded caches, closures over large scopes
- Event loop phases: macrotasks, microtasks, `requestAnimationFrame`, `requestIdleCallback`, starvation
- Concurrency models: workers, `postMessage` costs, transferables, when *not* to use a worker

*Rendering*
- Style → layout → paint → composite; main thread vs compositor thread
- Forced synchronous layout (layout thrash) and how to detect it in a trace
- Layers, `will-change`, compositing trade-offs
- Interaction cost: long tasks, INP, input delay, dropped frames, jank budget (16.7 ms)
- Core Web Vitals: LCP, INP, CLS — what each actually measures and what moves it

*The wire*
- DNS resolution, connection setup, TCP, TLS 1.3 handshake, connection reuse
- HTTP semantics: methods, status codes that matter, conditional requests (ETag, If-None-Match), ranges
- Caching: `Cache-Control` directives, `immutable`, `stale-while-revalidate`, shared vs private, CDN edge vs browser
- CORS for real: simple vs preflighted, credentials, why the error message lies to you
- HTTP/1.1 vs HTTP/2 (multiplexing, head-of-line) vs HTTP/3 (QUIC)
- Push transports: SSE vs WebSocket vs long-poll; framing, reconnect, backpressure
- Compression, image formats, font loading strategy

### Project — Console v1

A live dashboard consuming a public event stream, with a thin local proxy in front of it.

Required features:
1. Local Node proxy that connects to the upstream stream and re-emits it (also your first backend lesson:
   header requirements, rate limits, why browsers can't always talk to these APIs directly).
2. Bounded ingestion: a ring buffer with a hard cap, so the tab survives an hour of streaming.
3. Live table rendering with a windowed/virtualized view — but hand-rolled, no library.
4. Pause/resume, and a visible backpressure indicator (buffer fill, drop count).
5. Perf HUD: fps, dropped frames, long tasks, JS heap size.
6. A written **perf budget** (`budget.md`): target fps, max heap, max ingest lag, and the measurement method.
7. Deployed static build (free tier is fine) or documented local run.

### Deliverables

`console/` (repo), `budget.md`, a 600-word trace analysis of one real jank you caused and fixed.

### Exit criteria

- [ ] You can explain, from a DevTools trace, exactly which phase a jank came from
- [ ] You can predict microtask/macrotask ordering before running it, and be right
- [ ] You can explain why the proxy exists, in terms of both headers and CORS
- [ ] You can state what your `Cache-Control` strategy is and why each asset got what it got
- [ ] You can explain where the heap is growing and what bounds it
- [ ] Perf budget is measured in CI or by a repeatable script, not by vibes

---

## Part 2 — Algorithms that pay rent (weeks 8–13, 80 h; first contact in week 6)

**Goal:** choose data structures on purpose. Not interview prep — maintenance and performance.

### Concepts

- Complexity: Big-O, amortized cost, space cost, constant factors, when O(n) beats O(log n)
- Arrays, ring buffers, linked structures, columnar layout, cache locality
- Hash maps: open addressing vs chaining, load factor, resize cost, hash quality, DoS via collisions
- Trees: BST, balanced trees, B-tree intuition (→ why database indexes look like that), tries for prefix work
- Heaps and priority queues: top-K, schedulers, merging streams
- Graphs: adjacency representations, BFS/DFS, topological sort, cycle detection
- Sorting: stability, comparison vs counting, why V8's sort is what it is
- Binary search and its variants (lower bound, "binary search on the answer")
- Recursion → iteration, memoization, DP basics (edit distance, LCS, knapsack shape)
- Diffing (Myers) and incremental recomputation (dirty flags, topological recompute)
- Rate limiting: token bucket, sliding window, leaky bucket
- Probabilistic structures: Bloom filter, HyperLogLog — when approximate is the right answer
- Math: sets and relations, logarithms, series, combinatorics, probability and expected value, modular arithmetic

### Project — Console v2 (library)

Extract the console's core into a real library, e.g. `@you/stream-grid`.

Required:
1. Ring-buffer store + columnar layout for the event schema.
2. Hash index for equality lookups, sorted index for range queries.
3. Virtualized windowing with O(log n) visible-range computation.
4. Incremental aggregation: group-by with incremental add/remove, not full recompute.
5. LRU and LFU caches with hit/miss instrumentation.
6. Token-bucket scheduler for ingestion and for reconnects.
7. Benchmark harness (`tinybench` or hand-rolled) with before/after numbers.
8. `COMPLEXITY.md`: a table of every structure and operation in your own code, with real measured constants.
9. Tests: property-based or at least table-driven for the tricky parts.

### Deliverables

Library (npm-published or workspace-private), `COMPLEXITY.md`, benchmark report, `notes/data-structures.md`.

### Exit criteria

- [ ] Every structure in your code has a written justification and a measured cost
- [ ] You replaced at least one structure because the numbers said so, and can show the delta
- [ ] You can implement LRU, a ring buffer, a token bucket, and topological sort from scratch, cold
- [ ] You can compute expected cost of a cache or hash map on paper
- [ ] You can explain why a B-tree is the right shape for a disk-backed index

---

## Part 3 — Backend and data (weeks 14–21, 110 h)

**Goal:** own the other half of the request. This is the largest phase, because it is the biggest gap.

### Concepts

*Node runtime*
- libuv, the threadpool, event loop under I/O, `cluster` vs `worker_threads`
- Streams, backpressure, when a stream beats a buffer
- The request lifecycle: parsing, middleware, timeouts, graceful shutdown

*API design*
- Resource modeling; naming; status codes as a contract
- Pagination: offset vs keyset (and why offset dies at depth)
- Versioning strategies and why most teams should not version
- Error shapes (RFC 9457 problem details); validation at the boundary
- Idempotency keys, retries, and what "exactly once" actually means

*Auth and security*
- Sessions vs JWT; refresh rotation; revocation; where to store what
- OAuth 2.0 / OIDC with PKCE; why implicit flow is dead
- RBAC vs ABAC; tenancy boundaries and the query-level enforcement of them
- CSRF, `SameSite`, XSS surfaces, CSP, cookie flags

*Postgres*
- Schema design: normalization vs denormalization, natural vs surrogate keys, time-series shapes
- Indexes: B-tree, composite ordering, partial, covering, GIN; when an index is ignored
- `EXPLAIN (ANALYZE, BUFFERS)` — reading plans without fear
- Transactions, MVCC, isolation levels and the anomalies each prevents; deadlocks
- Migrations that don't lock the table; zero-downtime patterns
- Aggregates over time: bucketing, materialized views, rollups, retention

*Async work*
- At-least-once delivery, dedupe, retry with jitter, dead-letter queues
- Cron vs queue; visibility timeouts; stuck jobs

*Observability and testing*
- Structured logs, request/trace IDs, metrics that answer questions
- Unit vs integration vs contract tests; test doubles and their lies
- Docker Compose for local parity

### Project — Console v3

Turn the proxy into a real service.

Required:
1. Ingest API with authentication and per-tenant rate limiting.
2. Postgres schema for raw events + rollups; migrations via a real tool.
3. Query API: filtered, keyset-paginated, time-bucketed aggregates.
4. Background worker computing rollups, with retries, dedupe, and a visible job log.
5. Idempotent ingest (client-supplied key), demonstrated by a deliberate double-submit test.
6. Multi-tenancy enforced at the data layer, with a test that proves cross-tenant reads fail.
7. OpenAPI spec + generated or hand-written typed client.
8. Integration tests against a real Postgres (container), not mocks.
9. `docker-compose up` brings the whole thing to life; seed script included.
10. `SCHEMA.md`: every table, every index, and the query it exists for.

### Deliverables

Service code, `SCHEMA.md`, `EXPLAIN` write-up for the three most important queries, OpenAPI spec.

### Exit criteria

- [ ] You can justify every index by naming the query it serves
- [ ] You can read a plan and say whether an index was used, and why
- [ ] You can explain what happens when the same event is delivered twice
- [ ] You can name the isolation level you chose and the anomaly it prevents
- [ ] You can write a migration that doesn't block writes on a live table
- [ ] You can find and fix an N+1 query in your own code

---

## Part 4 — System design and architecture (weeks 22–30, 95 h)

**Goal:** design on purpose, and defend it. Plus the frontend half, which most system-design material ignores.

### Concepts

*System design*
- Framing: functional requirements, non-functional requirements, explicit non-goals
- Back-of-envelope estimation: QPS, storage growth, bandwidth, cost per request
- The scaling ladder: vertical → cache → read replicas → partition → async → edge
- CAP and PACELC, stated without hand-waving
- Consistency models: linearizable, causal, read-your-writes, eventual
- Replication: leader/follower, lag, failover, split brain
- Partitioning: hash vs range, hot keys, consistent hashing, rebalancing
- Caching layers: client, CDN, app, DB; invalidation, stampede, TTL jitter
- Queue-based decoupling, outbox pattern, event sourcing (and when it's a mistake)
- Failure: timeouts, retries, circuit breakers, bulkheads, graceful degradation, load shedding
- Multi-tenancy models: silo, pool, bridge — and their query implications
- Cost as a design constraint

*Frontend architecture*
- Module boundaries and dependency rules; what "layer" means in a UI app
- State taxonomy: server state, client state, URL state, form state — different tools, different rules
- Data fetching: waterfalls, prefetching, dedupe, optimistic updates, staleness
- Design systems, component API design, versioning
- Monorepos: when they help, when they're a tax
- Testing strategy per boundary; contract tests; e2e for the few paths that matter
- Accessibility as an architectural constraint, not a lint rule

### Project — Console v4

1. **Three design docs**, each 3–5 pages, written to be critiqued:
   - `docs/design-100x.md` — your console at 1M events/min and 10k tenants
   - `docs/design-foreign.md` — a system outside your comfort zone (collaborative doc, activity feed, or scheduling)
   - `docs/design-frontend.md` — module map, state ownership matrix, test plan for the console UI
2. **One hard slice implemented**: partitioned ingestion with idempotency, backpressure, and a
   degradation mode that survives an upstream outage. Measured, not asserted.
3. **An architecture review** of a real OSS project, using `parts/04-system-design/design-docs.md`'s template.
4. A **failure drill**: kill the database mid-ingest, document what the user sees and what you changed.

### Exit criteria

- [ ] A design doc survives a hostile read: every claim has a number or a trade-off
- [ ] You can estimate QPS and storage for an unfamiliar product in 10 minutes
- [ ] You can explain what breaks first at 10× and at 100×, and why
- [ ] You can point at a repo's module graph and name three architectural smells
- [ ] Your frontend design doc states who owns each piece of state, with no "it depends"

---

## Part 5 — Craft and capstone (weeks 31–36, 70 h)

**Goal:** the difference between "works on my machine" and "someone else can own this".

### Concepts

- Bundlers for real: module graph, tree shaking, code splitting, chunk strategy, bundle analysis
- Monorepo mechanics: workspaces, task graph, caching, affected builds
- CI/CD: pipelines that fail for the right reasons; caching; previews
- Perf budgets enforced in CI; regressions caught automatically
- Observability in production: error tracking, sessions, traces, alerts that don't cry wolf
- Security: OWASP top 10 in practice, CSP, dependency and supply-chain hygiene, secret handling
- Refactoring legacy: seams, characterization tests, strangler pattern
- ADRs, runbooks, and technical writing that people actually read
- Optional: deploy to a VPS (Caddy + Docker + backups + a real domain)

### Project — Capstone v5

Unify v1–v4 into one coherent, deployed product.

Required:
1. One repo, clear boundaries between UI, API, worker, and shared types.
2. CI running typecheck, lint, unit, integration, and the perf budget.
3. Deployed and reachable (VPS or free tier), with a documented deploy and rollback.
4. `ARCHITECTURE.md` with a diagram you'd show in an interview.
5. 5–8 ADRs recording the decisions you'd otherwise forget.
6. `README.md` a stranger can follow from clone to running.
7. A 5-minute demo you can narrate.

### Exit criteria

- [ ] Someone else can run it from the README without asking you anything
- [ ] CI catches a deliberately introduced perf regression
- [ ] You can explain any file in the repo and why it exists where it does
- [ ] Rollback is a documented, tested 2-minute operation
- [ ] Rubric rescored; every previously-shaky domain is at 2 or above

---

## Excluded on purpose

Kubernetes, microservices, Kafka, GraphQL federation, Rust, compilers, ML theory, LeetCode patterns,
certifications, and "learn a new framework". Each is defensible; none is on the critical path for the
goal, and each costs 40+ hours you don't have. Park them in `someday.md` if the urge is strong.

---

## If you fall behind

You will. The correct response, in order:

1. Cut drills first. They're maintenance, not progress.
2. Cut reading second — the project will teach the concept, just less comfortably.
3. Never cut the weekly log. It's 20 minutes and it's the thing that keeps the whole program alive.
4. Never cut the exit criteria. A phase you skipped is a phase you'll pay for twice.
5. If you lose 3+ weeks, re-baseline: rerun the rubric, rewrite dates, and pick up at the current phase's
   midpoint rather than restarting.
