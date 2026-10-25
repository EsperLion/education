# Weeks 1–12

The detailed first quarter. ~12 h per week, split as: **2 h reading · 5 h build · 2 h drills · 1.5 h writing · 1.5 h review.**

Do not read ahead. Each week's reading is deliberately only what the build needs.

> If a week slips, re-cut the plan on review day. Do not cram two weeks into one — that's how the
> next three weeks get skipped.

---

## Week 1 — Baseline

**Goal:** make the next 35 weeks measurable.

**Build (3 h)**
- `git init` the program folder; commit the templates.
- Create `console/` with pnpm + TypeScript + Vite. Blank page, one test, `pnpm dev` works.
- Create `tools/generator/` skeleton: seeded PRNG, emits `Event`-shaped NDJSON to stdout. Ten events is enough.

**Read (2 h)**
- This folder: `README.md`, `SYLLABUS.md`, `DATA-SOURCES.md`.
- Skim `RESOURCES.md`, note which paid option (if any) you'd consider — don't buy yet.

**Drills (1 h)** — none. This week is setup.

**Write (2 h)**
- `RUBRIC.md`, honestly, all 40 items.
- North-star statement in `PROGRESS.md` (4 sentences).
- `log/week-01.md`: why you're doing this, what you expect to be bad at.

**Done when**
- [ ] Rubric filled and committed
- [ ] North star written
- [ ] `pnpm dev` renders something
- [ ] `node tools/generator --seed 42` produces the same output twice

---

## Week 2 — The event loop, for real

**Goal:** predict execution order instead of observing it.

**Read (2 h)**
- Philip Roberts, *What the heck is the event loop anyway?* (26 min)
- Jake Archibald, *In The Loop* (talk; the task-ordering part)
- V8 blog: one post on hidden classes; one on the interpreter/JIT pipeline
- MDN: *Event loop*, *Microtask guide*

**Build (5 h)**
- A `/lab/loop` page in the console app: buttons that trigger known task/microtask/rAF sequences, each logging with timestamps.
- Instrumentation module: a `perf.ts` that wraps `performance.mark`/`measure` and a `longtask` observer, logging to console and a debug panel.
- Microbenchmark: object shape (monomorphic vs polymorphic access), property order, `Map` vs object for hot lookup. Record numbers in `notes/` — you'll reuse this harness all year.

**Drills (2 h)**
- Write down predictions for 10 ordering puzzles **before** running them (`drills/loop-puzzles.md`).
- Implement `sleep(ms)` correctly; then explain why `await null` yields differently from `setTimeout(0)`.
- Starve `requestAnimationFrame` with a microtask chain; explain the observed result.

**Write (1.5 h)**
- `notes/event-loop.md`: your own diagram, the three findings that surprised you, and the ordering rules you'd give a junior.

**Review (1.5 h)**

**Done when**
- [ ] 10/10 ordering predictions correct
- [ ] You can explain why a long microtask chain blocks rendering but `setTimeout` doesn't
- [ ] The perf harness works and is reusable

---

## Week 3 — Memory, workers, and the first backend

**Goal:** bounded memory, and a proxy that exists for a reason.

**Read (2 h)**
- Chrome DevTools docs: *Fix memory problems*, *Record heap snapshots*
- V8 blog: GC generations / scavenger & major GC
- MDN: *Transferable objects*, `postMessage`
- `DATA-SOURCES.md` §1 — the Wikimedia proxy problem

**Build (5 h)**
- Node proxy: connects to the Wikimedia stream (or the generator), re-emits SSE to the browser. Reconnect with backoff. Log bytes/sec.
- Client: consume SSE, append to a **bounded ring buffer** (cap by count and by bytes), drop-oldest policy.
- Wire the generator's `--replay` mode so you can develop offline. From now on, the live source is optional.

**Drills (2 h)**
- Leak a listener on a detached DOM node; find it in a heap snapshot. Then fix it and prove the node is collectable.
- Compare `structuredClone` vs `ArrayBuffer` transfer for 10 MB. Measure.
- Measure the cost of 100k `postMessage` round-trips; explain when a worker is *not* worth it.

**Write (1.5 h)**
- `notes/memory.md`: leak taxonomy in your own words + the snapshot screenshots that convinced you.

**Done when**
- [ ] Stream flows end to end through your proxy
- [ ] Heap stays flat over a 30-minute run
- [ ] You can find a leak from a snapshot in under 10 minutes
- [ ] Buffer cap is enforced and observable

---

## Week 4 — Rendering and the first real jank

**Goal:** see the rendering pipeline in a trace, then break it on purpose.

**Read (2 h)**
- web.dev: *Rendering performance*, *Optimize long tasks*, *Interaction to Next Paint*
- DevTools: *Analyze runtime performance* (the full walkthrough, once)

**Build (5 h)**
- Hand-rolled virtualized table: fixed row height, windowed render, `transform`-based offset. No library.
- Perf HUD: fps from `rAF` deltas, dropped frames, long tasks, heap size, buffer fill, ingest lag.
- Scroll with 100k synthetic rows.

**Drills (2 h)**
- Reproduce layout thrash (read `offsetHeight` in a write loop), capture the trace, then fix it with batch reads/writes.
- Compare `left` animation vs `transform` animation in the same trace.
- Deliberately trigger forced synchronous layout; count the reflows in the trace.

**Write (1.5 h)**
- `notes/trace-analysis-01.md`: the 600-word analysis of one jank you caused. Which phase, which numbers, what you changed, what the delta was.

**Done when**
- [ ] 100k rows scroll at ≥55 fps
- [ ] No long task over 50 ms during scroll
- [ ] Trace analysis reads like a diagnosis, not a diary

---

## Week 5 — The wire

**Goal:** stop guessing what the network is doing.

**Read (2 h)**
- HPBN: ch. 1–4 (latency, TCP, TLS), ch. 11–12 (HTTP/1.1, HTTP/2)
- [HTTP/3 explained](https://http3-explained.haxx.se/) — skim
- MDN: *HTTP caching*, *CORS*
- Cloudflare: DNS and TLS pages

**Build (5 h)**
- Code-split the app: route-level and vendor chunks. Analyse the bundle.
- Set explicit `Cache-Control` per asset class (hashed JS = immutable, HTML = no-cache, fonts = long-lived).
- Add a custom request header to force a CORS preflight, break it, then fix it properly (server-side).
- Record a Network-panel waterfall; annotate each phase (DNS, connect, TLS, TTFB, content).

**Drills (2 h)**
- Fill a table: 8 combinations of `Cache-Control`/`ETag` → what the browser does on reload and on navigation. Predict, then verify.
- Explain, in writing, why a 304 is cheaper but not free.
- Compute the cost of one extra round-trip at 100 ms RTT for a six-request page.

**Write (1.5 h)**
- `notes/network.md` + `console/docs/cache-strategy.md` (a table you could hand to a reviewer).

**Done when**
- [ ] Every asset has a defensible cache header
- [ ] You can predict a waterfall before opening DevTools, and be right
- [ ] 8/8 cache predictions correct

---

## Week 6 — Backpressure (and Part 2 begins)

**Goal:** survive a source that is faster than you.

**Read (2 h)**
- HPBN ch. 16 (HTTP over WebSocket) or MDN *Server-sent events* — pick `EventSource` semantics properly
- Node.js: *Backpressure* in streams docs
- Skiena: ch. 2 (algorithm analysis) — start Part 2

**Build (5 h)**
- Add a proper ring buffer **with tests** (cap by count and bytes, drop-oldest, O(1) append).
- Backpressure UI: buffer fill %, dropped count, ingest lag ms. Make it visible, not diagnostic-only.
- Pause/resume that actually stops ingestion upstream (proxy-level), not just rendering.
- Add a WebSocket source alongside SSE behind one adapter interface. Same downstream code.

**Drills (2 h)**
- Implement a ring buffer from scratch, cold, with tests.
- Compute Big-O (time and space) for 10 functions in your own codebase.
- Two sum / move-zeroes style warm-ups — 20 minutes, once, to shake off rust. Not a habit.

**Write (1.5 h)**
- `notes/backpressure.md`: what backpressure is, the three places it can exist in *your* pipeline, and which one you implemented.

**Done when**
- [ ] Buffer never exceeds its cap under overload
- [ ] Drops are counted, surfaced, and explained
- [ ] Swapping SSE → WS touches only the adapter

---

## Week 7 — GATE 1

**Goal:** close Part 1 properly. This week has less new material on purpose.

**Read (1 h)** — your own notes. Fix the gaps you find.

**Build (4 h)**
- Write `console/docs/budget.md`: target fps, max heap, max lag, max bundle size, and *how each is measured*.
- Make the measurement repeatable: a script (even a Playwright-driven one) that prints the numbers.
- Deploy the static build somewhere free, or write a 10-line runbook.
- Polish: remove dead code, add a README that a stranger could follow.

**Drills (2 h)**
- Re-run every Part 1 drill cold: loop puzzles, LRU-less ring buffer, leak hunt, thrash fix.
- Anything you can't redo goes on next week's list, not under the rug.

**Write (3 h)**
- Teach-back: **"How a click becomes pixels"** — 400–600 words, no jargon, for a junior. Cover: event → task → microtask → rAF → style → layout → paint → composite → network if data is needed.

**Gate**
- [ ] `RUBRIC.md` rescored (W7 column)
- [ ] All Part 1 exit criteria ticked
- [ ] Teach-back written
- [ ] `PROGRESS.md` updated, dates adjusted for Part 2

---

## Week 8 — Arrays, hashing, and honest measurement

**Build (5 h)**
- Hash index in the library: open addressing, load factor, resize. Instrument probe counts.
- Columnar store for the event schema; compare against array-of-objects on a 1M-row scan.
- `COMPLEXITY.md` v0: table of every structure and operation, with measured constants.

**Read (2 h)**
- Skiena ch. 3 (data structures)
- MIT 6.006: hashing lecture

**Drills (2 h)**
- Implement a hash map from scratch. Tests for resize, delete, and collision chains.
- Implement LRU. Then LFU. Explain when LRU is the wrong policy.
- Construct a hash-collision worst case in your own map; measure the degradation.

**Write (1.5 h)** — `notes/hashing.md`: load factor, clustering, why `Map` is not always faster than an object.

**Done when**
- [ ] Columnar scan beats AoS by a measured margin (or you can explain why not)
- [ ] `COMPLEXITY.md` has real numbers, not Big-O alone

---

## Week 9 — Trees, and why databases look like that

**Build (5 h)**
- Sorted index: binary search with `lowerBound`/`upperBound`, range query returning a slice.
- Compare: hash index vs sorted array vs a small B-tree for three workloads (point, range, insert-heavy). Write the table.
- Index-backed filtering in the console: filter by field using the index, not `Array.filter`.

**Read (2 h)**
- Skiena: trees, balanced trees
- [Use The Index, Luke](https://use-the-index-luke.com/) ch. 1–2 — B-tree anatomy

**Drills (2 h)**
- BST insert/search/delete; then AVL rotations. Rotations matter — they're the B-tree intuition.
- `lower_bound` variants: first ≥, last ≤, count in range. Off-by-one drills until boring.
- Given a query, sketch the B-tree traversal by hand.

**Write (1.5 h)** — `notes/trees.md`: one page on "why a B-tree is the right shape for a disk-backed index".

**Done when**
- [ ] Range query is O(log n + k) and measured
- [ ] You can explain fan-out and why disks changed the tree shape

---

## Week 10 — Heaps and schedulers

**Build (5 h)**
- Token-bucket scheduler for ingestion: configurable rate, burst, and observable queue depth.
- Reconnect with exponential backoff + full jitter; prove it with a log.
- Top-K aggregation using a bounded heap.

**Read (2 h)**
- Skiena: heaps, priority queues
- One article on token bucket vs sliding window

**Drills (2 h)**
- Implement a min-heap from scratch; then k-way merge of N sorted streams.
- Implement token bucket with tests including the burst boundary.
- Implement a sliding-window counter; compare memory and accuracy with the bucket.

**Write (1.5 h)** — `notes/scheduling.md`: burst behaviour, why naive retries cause stampedes.

**Done when**
- [ ] Ingestion rate is capped and observable
- [ ] Backoff is tested, not assumed

---

## Week 11 — Graphs and incremental computation

**Build (5 h)**
- Group-by aggregation with **incremental** add/remove (no full recompute on each event).
- Derived-field dependency graph: topo order for recomputation, cycle detection at registration.
- Measure: full recompute vs incremental on 1M events.

**Read (2 h)**
- Skiena: graph traversal, topological sort
- One article on incremental/demand-driven computation (Salsa/Adapton lineage is fine)

**Drills (2 h)**
- BFS, DFS, topological sort, cycle detection — from scratch.
- A "dirty propagation" toy: 5 nodes, mutate one, recompute only what's needed.

**Write (1.5 h)** — `notes/incremental.md`: when incremental is worth the complexity, and the bug class it introduces.

**Done when**
- [ ] Update path is ≥5× faster than recompute, measured
- [ ] A cycle is detected and reported, not hung on

---

## Week 12 — Sorting, search, diffing — and re-planning

**Build (5 h)**
- Maintain a sorted view incrementally: insertion into a sorted array vs periodic re-sort vs a tree. Benchmark all three.
- Row-update diffing: Myers diff over visible keys, so only changed rows re-render.
- Wire both into the table; measure render cost per update batch.

**Read (2 h)**
- Skiena: sorting, and the first DP chapter
- One clear write-up of Myers diff

**Drills (2 h)**
- Merge sort, quickselect. Then answer: why is V8's sort stable, and what does stability cost?
- Binary search on the answer: two problems (e.g. capacity, minimum-rate).
- Implement a small Myers diff for sequences of ≤100 items.

**Write (2.5 h)**
- Quarter review: what took longer than planned, what you'd cut.
- Re-plan weeks 13–21 in `PROGRESS.md`, adjust Part 3 dates.

**Done when**
- [ ] Sorted view stays ordered under inserts, measured
- [ ] Diff reduces re-renders, measured
- [ ] Weeks 13–21 dates are realistic and committed

---

## The daily minimum

On bad weeks, keep one thing alive: **25 minutes a day on the current build**. Not reading, not planning —
one commit. Momentum is the scarce resource, not hours.
