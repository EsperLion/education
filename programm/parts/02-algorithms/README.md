# Part 2 — Algorithms that pay rent

**Weeks 8–13 · 80 h** (first contact in week 6: the ring buffer and your first Big-O)

> Goal: choose data structures on purpose, and be able to defend every one in your own codebase.

This is **not** interview preparation. There is no LeetCode grind here. The test of success is not
"I can solve a puzzle in 30 minutes" — it is "I know why my table is fast and what would make it slow".

Everything in this phase is applied to the console. If a structure doesn't earn its place, it gets
deleted and the deletion gets written down.

---

## Why this phase follows Part 1

Because you now have data flowing. A ring buffer that drops events, a table that renders 100k rows, a
stream that arrives faster than you draw. Those are the constraints that make complexity *felt*:
you've already watched an O(n) operation murder a frame. Now you find out which line it was.

---

## Concepts

**Cost**
- Big-O, Big-Θ, Big-Omega; amortized cost; space cost; constant factors
- Why O(n) can beat O(log n) below a few hundred elements — and the cache-locality reason

**Linear structures**
- Arrays, ring buffers, linked lists (and why they lose in JS), columnar layout
- Memory layout and cache locality: the difference between "fewer operations" and "faster"

**Hashing**
- Open addressing vs chaining; load factor; resize cost; tombstone deletion
- Hash quality, clustering, collision DoS; when a `Map` is not the answer

**Trees**
- BST, balancing (AVL/red-black intuition, not implementation), B-trees and fan-out
- Tries and prefix structures; segment trees only if a range-query need appears
- Why a database index is a B-tree and not a hash table

**Heaps**
- Binary heap, sift-up/down, top-K, k-way merge, priority scheduling

**Graphs**
- Adjacency list vs matrix; BFS, DFS, topological sort, cycle detection, connected components
- Dependency graphs and recomputation order

**Ordering and search**
- Comparison sorts, stability, why V8's TimSort is adaptive
- Quickselect; binary search and its variants (lower bound, "search on the answer")

**Recursion and DP**
- Recursion → iteration; memoization; tabulation
- Classic shapes: edit distance, LCS, knapsack, interval scheduling
- When greedy is provably right and when it silently isn't

**Incremental computation**
- Dirty flags, dependency tracking, topological recompute
- Diffing (Myers) and why the naive diff is quadratic
- The bug class incremental systems introduce (staleness), and how to test for it

**Rate limiting**
- Token bucket, leaky bucket, fixed/sliding window; burst semantics; distributed variants later

**Approximation**
- Bloom filter, HyperLogLog, count-min sketch — when "close enough" is the correct engineering answer

**Math, just enough**
- Sets, relations, functions; logarithms and why they appear everywhere
- Sums and series (amortized analysis lives here); combinatorics basics
- Probability, expected value, independence; modular arithmetic and hashing

---

## Project — Console v2 (the library)

Extract the console core into `@you/stream-grid`. Details in `project.md`.

Headline: ring buffer, columnar store, hash index, sorted index, virtual windowing, incremental
aggregation, LRU/LFU caches, token-bucket scheduler, benchmark harness, complexity table.

The library is the artifact. Publishing it is optional; having something with a public API, tests, and
benchmarks is not.

---

## Drills

`drills.md` — 18 drills. Implementations from scratch, plus measurement and hand-computation.

---

## Exit criteria

- [ ] Every structure in your code has a written justification and a measured cost
- [ ] You replaced at least one structure because the numbers said so, and can show the delta
- [ ] Implement cold: LRU, ring buffer, token bucket, topological sort
- [ ] Compute expected cost of a cache or hash map on paper, correctly
- [ ] Explain why a B-tree is the right shape for a disk-backed index
- [ ] `COMPLEXITY.md` contains measured constants, not just Big-O

---

## Resources

`RESOURCES.md` § Part 2. Minimum:

1. Skiena, *The Algorithm Design Manual* — Part I, plus the chapters on the structures you're building
2. MIT 6.006 lectures — hashing, trees, heaps, graphs, DP (YouTube, free)
3. [Visualgo](https://visualgo.net/) — when a structure won't sit still in your head
4. MIT 6.042J — first four problem sets only, for the math

Paid: Execute Program (TypeScript/SQL drills) for one month if you want the drill loop gamified.

---

## Common ways this phase goes wrong

- **Turning it into interview prep.** The moment you're doing "two pointers" problems you don't need,
  you've left the program. Every drill must connect to the console.
- **Implementing everything.** You need LRU, a ring buffer, a token bucket, a heap, and a topo sort.
  You do not need a red-black tree, a suffix array, or a segment tree unless the product demands it.
- **Benchmarking without controls.** Same input, same seed, same machine, warm-up run, median of N.
  Otherwise the numbers are decoration.
- **Skipping the math.** Two hours of probability and expected value will save you a week of confused
  benchmarking later.
