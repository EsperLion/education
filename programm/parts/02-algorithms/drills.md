# Drills — Part 2

Implementation drills (cold, from scratch, with tests) and reasoning drills (on paper).
Budget: 2 h/week across weeks 8–13. Log outcomes in `drills/part-02.md`.

**Cold means:** blank file, no reference, no autocomplete on the algorithm. You may look up *syntax*,
never *the algorithm*.

---

## Implementation (from scratch, with tests)

- [ ] **I1. Ring buffer** — cap by count and bytes, O(1) append, wrap-around, eviction count.
- [ ] **I2. Hash map** — open addressing, linear probing, resize at 0.7, tombstone delete.
- [ ] **I3. LRU** — O(1) get and put, using a map + a doubly linked list (not an array).
- [ ] **I4. LFU** — O(1) amortised; document the tie-break rule.
- [ ] **I5. Binary heap** — sift-up/down, `push`/`pop`/`peek`, `heapify` in O(n).
- [ ] **I6. K-way merge** — merge N sorted streams using the heap, O(n log k).
- [ ] **I7. Topological sort** — Kahn's algorithm *and* DFS-based; detect cycles in both.
- [ ] **I8. BFS/DFS** — on an adjacency list, with a visited set, iterative only.
- [ ] **I9. Token bucket** — injectable clock, burst boundary tests.
- [ ] **I10. Sliding-window counter** — compare memory and accuracy with the token bucket.
- [ ] **I11. `lowerBound` / `upperBound`** — duplicates, empty range, all-equal array, single element.
- [ ] **I12. Quickselect** — find k-th element in O(n) average; measure against a full sort.
- [ ] **I13. Myers diff** — sequences ≤100; return the edit script, not just a boolean.
- [ ] **I14. Bloom filter** — parameterise by expected n and false-positive rate; measure the actual FPR.
- [ ] **I15. HyperLogLog** — estimate cardinality within 2% at 10k distinct; compare to a `Set`.

## Reasoning (on paper, 20 minutes each)

- [ ] **R1.** Compute amortized cost of a dynamic array growth from 1 to n. Show the series sum.
- [ ] **R2.** For n = 10, 1k, 100k, 1M: at what n does a binary search on a *linked* list stop being worth it, given cache misses? Estimate, then measure.
- [ ] **R3.** Explain why a hash index can't serve `WHERE ts BETWEEN a AND b` efficiently. What structure can?
- [ ] **R4.** Draw the B-tree traversal for a query on `tenant_id = 7 AND ts > T` with a composite index `(tenant_id, ts)`. How many pages?
- [ ] **R5.** Given a stream of 10M events, estimate memory for: (a) a `Set` of ids, (b) a Bloom filter at 1% FPR, (c) an HLL at 2% error.
- [ ] **R6.** Compute the probability of at least one collision when inserting 10k items into a 100k-bucket hash table.
- [ ] **R7.** A cache with 80% hit rate and 5 ms miss cost vs 100% hit at 1 ms. Which is faster on average? At what hit rate do they tie?
- [ ] **R8.** Explain why TimSort is O(n) on already-sorted input, and what that means for your sorted index's insert path.
- [ ] **R9.** For your incremental aggregation: state the exact input sequence that would produce a stale result if `remove` had an off-by-one.
- [ ] **R10.** Compute the expected number of probes for a successful lookup in linear probing at load factor 0.5 and 0.9.

## Measurement

- [ ] **M1.** Benchmark: 1M `Array.shift()` from a 10k-capped array vs your ring buffer. Report both.
- [ ] **M2.** Benchmark: AoS vs columnar for sum, filter, and random access. Explain each result.
- [ ] **M3.** Benchmark: hash index vs `Array.find` for a point lookup at 1k / 100k / 1M rows.
- [ ] **M4.** Benchmark: sorted-array insert vs re-sort-on-read vs B-tree-ish structure, insert-heavy workload.
- [ ] **M5.** Benchmark: incremental aggregation vs full recompute at 100k events and 1k updates/sec.
- [ ] **M6.** Construct a hash-collision worst case in your own map; measure lookup time at 100, 1k, 10k colliding keys.

---

## Cold-recall set (for the gate, week 13)

From a blank file, no reference, 90 minutes total:

- ring buffer with tests
- LRU with tests
- token bucket with injected clock
- topological sort with cycle detection

Then, on paper: complexity table for the library's eight main operations.

Failing one is fine — it just means it goes into week 14's warm-up. Failing three means the phase
isn't done, regardless of what the project looks like.
