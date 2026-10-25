# Self-assessment rubric

Score each item **0–3**. Do this in week 1, then again at every phase gate
(weeks 7, 14, 22, 30, 36). Keep old columns — the diff is the point.

| Score | Meaning |
|---|---|
| **0** | I couldn't explain this or do it without looking it up |
| **1** | I know the words; I'd need a tutorial to act |
| **2** | I can do it unaided; I couldn't teach it or debug it under pressure |
| **3** | I can do it, explain the trade-offs, and diagnose it when it breaks |

Be stingy. A 3 means you'd defend it in a design review. Most working developers score 1 on most of
this list, which is exactly why it's worth doing.

---

## A. JavaScript runtime and memory

| # | Item | W1 | W7 | W14 | W22 | W30 | W36 |
|---|---|---|---|---|---|---|---|
| A1 | Explain the event loop phases and predict task/microtask/rAF ordering |2 | | | | | |
| A2 | Explain how the JIT and object shape affect hot-path performance |0 | | | | | |
| A3 | Diagnose a memory leak from a heap snapshot |0 | | | | | |
| A4 | Choose between worker, chunking, and doing nothing for heavy computation |1 | | | | | |
| A5 | Explain what a long task does to input latency | 0| | | | | |

## B. Rendering and performance

| # | Item | W1 | W7 | W14 | W22 | W30 | W36 |
|---|---|---|---|---|---|---|---|
| B1 | Read a DevTools performance trace and name the bottleneck phase | 1| | | | | |
| B2 | Identify and fix layout thrash |0 | | | | | |
| B3 | Explain compositing and when a layer helps or hurts | 0| | | | | |
| B4 | Interpret LCP, INP, CLS and know which code changes move each |0 | | | | | |
| B5 | Set and enforce a perf budget |0 | | | | | |

## C. Networking and HTTP

| # | Item | W1 | W7 | W14 | W22 | W30 | W36 |
|---|---|---|---|---|---|---|---|
| C1 | Walk through DNS → TCP → TLS → HTTP for a single request | 1| | | | | |
| C2 | Design a caching strategy across browser, CDN, and origin |1 | | | | | |
| C3 | Debug CORS and explain preflight behaviour |1 | | | | | |
| C4 | Choose SSE vs WebSocket vs polling for a given product need |2 | | | | | |
| C5 | Explain HTTP/2 and HTTP/3 differences and their practical effects | 0| | | | | |

## D. Data structures and complexity

| # | Item | W1 | W7 | W14 | W22 | W30 | W36 |
|---|---|---|---|---|---|---|---|
| D1 | Estimate time and space complexity for unfamiliar code |1 | | | | | |
| D2 | Justify the data structure chosen in your own code |2 | | | | | |
| D3 | Implement a hash map, LRU, ring buffer, or heap from scratch | 0| | | | | |
| D4 | Reason about cache locality and memory layout |0 | | | | | |
| D5 | Recognise when a simple O(n) beats a clever O(log n) |0 | | | | | |

## E. Algorithms and computation

| # | Item | W1 | W7 | W14 | W22 | W30 | W36 |
|---|---|---|---|---|---|---|---|
| E1 | Design an incremental (non-recomputing) update path |0 | | | | | |
| E2 | Use topological ordering and cycle detection where appropriate | 0| | | | | |
| E3 | Implement a rate limiter and explain its burst behaviour | 0| | | | | |
| E4 | Explain a diffing algorithm and its complexity |1 | | | | | |
| E5 | Recognise problems that need DP vs greedy vs search | 0| | | | | |

## F. Math for engineering

| # | Item | W1 | W7 | W14 | W22 | W30 | W36 |
|---|---|---|---|---|---|---|---|
| F1 | Do back-of-envelope estimates with QPS, storage, and bandwidth |0 | | | | | |
| F2 | Reason with logarithms, sums, and expected values | 0| | | | | |
| F3 | Read a paper or spec with formulas and not bounce off | 1| | | | | |

## G. TypeScript and type-level thinking

| # | Item | W1 | W7 | W14 | W22 | W30 | W36 |
|---|---|---|---|---|---|---|---|
| G1 | Write generics and conditional types without fighting the compiler | 2| | | | | |
| G2 | Model API responses so invalid states are unrepresentable |2 | | | | | |
| G3 | Share types across client, server, and database boundaries |2 | | | | | |

## H. Backend and APIs

| # | Item | W1 | W7 | W14 | W22 | W30 | W36 |
|---|---|---|---|---|---|---|---|
| H1 | Design a resource-oriented API with sane errors and pagination | 1| | | | | |
| H2 | Implement idempotent writes and explain retry safety | 0| | | | | |
| H3 | Implement auth end to end (session or OIDC), including revocation | 1| | | | | |
| H4 | Design background jobs with retries, dedupe, and dead letters | 0| | | | | |
| H5 | Debug backpressure in a streaming pipeline | 0| | | | | |

## I. Databases

| # | Item | W1 | W7 | W14 | W22 | W30 | W36 |
|---|---|---|---|---|---|---|---|
| I1 | Design a schema and defend it |1 | | | | | |
| I2 | Read `EXPLAIN ANALYZE` and act on it | 0| | | | | |
| I3 | Justify each index by the query it serves | 0| | | | | |
| I4 | Choose an isolation level and name the anomaly it prevents |0 | | | | | |
| I5 | Write a non-blocking migration |0 | | | | | |
| I6 | Model time-series data with retention and rollups |0 | | | | | |

## J. Architecture and testing

| # | Item | W1 | W7 | W14 | W22 | W30 | W36 |
|---|---|---|---|---|---|---|---|
| J1 | Draw and defend module boundaries for a frontend app |2 | | | | | |
| J2 | Assign ownership of each kind of state explicitly | 2| | | | | |
| J3 | Pick a test level per risk and say what you're not testing |2 | | | | | |
| J4 | Refactor legacy code behind seams with characterization tests |1 | | | | | |
| J5 | Review someone else's architecture and find real problems |2 | | | | | |

## K. Systems and scaling

| # | Item | W1 | W7 | W14 | W22 | W30 | W36 |
|---|---|---|---|---|---|---|---|
| K1 | Frame requirements and non-goals before designing |0 | | | | | |
| K2 | Explain what breaks at 10× and 100× | 0| | | | | |
| K3 | Choose a consistency model deliberately | 0| | | | | |
| K4 | Design partitioning and handle hot keys |2 | | | | | |
| K5 | Design for partial failure: timeouts, retries, degradation |2 | | | | | |
| K6 | Write a design doc that invites useful critique |2 | | | | | |

## L. Tooling, delivery, security

| # | Item | W1 | W7 | W14 | W22 | W30 | W36 |
|---|---|---|---|---|---|---|---|
| L1 | Explain your bundle: what's in it, why, and what's split |2 | | | | | |
| L2 | Build a CI pipeline that fails for the right reasons |1 | | | | | |
| L3 | Set up production observability and meaningful alerts |1 | | | | | |
| L4 | Apply the OWASP top 10 to a real codebase |0 | | | | | |
| L5 | Deploy, monitor, and roll back a service |1 | | | | | |

## M. Communication

| # | Item | W1 | W7 | W14 | W22 | W30 | W36 |
|---|---|---|---|---|---|---|---|
| M1 | Write a design doc or ADR someone can act on |2 | | | | | |
| M2 | Explain a system to a non-specialist without losing accuracy | 2| | | | | |
| M3 | Give a useful code review |1 | | | | | |

---

## Scoring notes

- Total is not the metric. **Delta per domain** is.
- Any domain still at 0–1 at week 36 was skipped, not learned. Be honest about which.
- If you score yourself 3 in week 1, you're lying; the 3s should appear around week 22+.
- Keep a one-line justification next to any score that surprises you. Future-you will want to know why.
