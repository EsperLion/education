# Project — Console v2 (`@you/stream-grid`)

**Goal:** turn the console's ad-hoc internals into a library with a public API, tests, benchmarks, and a
complexity table that survives scrutiny.

The console becomes a *consumer* of the library. If the library API is right, the console's component
code should shrink.

---

## Public API (start here, then earn every change)

```ts
// Storage
createStore(schema: Schema, opts: { maxCount: number; maxBytes?: number }): Store
interface Store {
  append(e: Event): void;              // O(1) amortised
  get(id: string): Event | undefined;  // O(1)
  size(): number;
  dropped(): number;                   // count of evictions
  range(from: number, to: number): Iterable<Event>;  // by insertion order
}

// Indexing
createHashIndex(store: Store, field: keyof Event): Index
interface Index {
  find(value: unknown): Event[];       // O(1 + k)
  range(lo: number, hi: number): Event[];  // sorted index only: O(log n + k)
  stats(): { probes: number; resizes: number; loadFactor: number };
}

// Windowing
createWindow(store: Store, schema: { rowHeight: number; viewport: number }): Window
interface Window {
  visible(scrollTop: number): { start: number; end: number };  // O(log n)
  offset(index: number): number;
}

// Aggregation
createAggregation(spec: { groupBy: string; aggregate: 'count' | 'sum' | 'avg' | 'p95' }): Aggregation
interface Aggregation {
  add(e: Event): void;     // incremental, O(1) amortised
  remove(e: Event): void;  // incremental, O(1) amortised
  result(): Map<string, number>;
}
// Must be exact for add/remove sequences — a test asserts incremental == full recompute.

// Caching
createLru<K, V>(capacity: number): Cache<K, V>
createLfu<K, V>(capacity: number): Cache<K, V>
interface Cache<K, V> {
  get(k: K): V | undefined;
  set(k: K, v: V): void;
  stats(): { hits: number; misses: number; evictions: number };
}

// Scheduling
createTokenBucket(opts: { rate: number; burst: number; now?: () => number }): Bucket
interface Bucket {
  tryTake(n?: number): boolean;
  schedule<T>(fn: () => Promise<T>): Promise<T>;  // queued, not dropped
  depth(): number;
}

// Ordering
topologicalSort<T>(nodes: T[], edges: [T, T][]): { order: T[]; cycles: T[][] };
```

Design constraints:
- No dependencies (except dev tooling).
- No DOM access. It's data structures; the console adapts it to the DOM.
- Every method that can be O(n) or worse is **documented** as such, and that claim is tested.

---

## Required deliverables

### 1. Ring buffer, properly
Cap by count **and** bytes. Drop-oldest. O(1) append. `dropped()` exposed. Replaces Part 1's array.

**Prove the delta:** Part 1 used `Array.shift()` (probably). Benchmark 1M appends at cap 10k, before/after.
Put both numbers in the PR description or `BENCHMARKS.md`.

### 2. Columnar store
Store fields in parallel typed arrays (or grouped plain arrays) plus one object array for `attrs`.
Compare against array-of-objects on: full scan + sum, filtered scan, single-row random access.
Report which wins and why — including the case where AoS wins.

### 3. Hash index
Open addressing with linear probing. Load factor 0.7 with resize. Expose probe stats.
Then a **collision DoS demo**: craft inputs that hash to one bucket and measure the degradation.

### 4. Sorted index
Maintains sorted order incrementally. Binary search with `lowerBound`/`upperBound`.
Compare against: (a) re-sort on read, (b) hash index + in-memory filter.
Table of three workloads: point lookup, range query, insert-heavy.

### 5. Virtual windowing
O(log n) (or O(1) for fixed heights) visible-range computation. No allocation per frame — verified with
the allocation timeline.

### 6. Incremental aggregation
`add`/`remove` in O(1) amortised. **Correctness test**: run 10k random add/remove ops, assert incremental
result equals full recompute at every 100 steps. This test is the whole point of the section.

For `p95` you may approximate with a t-digest-like sketch or a bounded reservoir — but then document the
error bound and test it.

### 7. LRU and LFU
Both, with hit/miss/eviction stats. Tests: LRU ordering under interleaved access; LFU tie-breaking
(lowest frequency, then oldest — pick a rule and document it).

### 8. Token bucket
Rate + burst + injectable clock (for deterministic tests). `schedule()` queues rather than drops.
Tests: burst boundary, sustained rate, clock injection, queue depth.

### 9. Benchmarks
`tinybench` or hand-rolled. Rules:
- Same seed, same input, warm-up run, median of N ≥ 5
- Report ns/op *and* throughput
- One table per structure comparison
- Commit the numbers in `BENCHMARKS.md`, with the machine spec

### 10. `COMPLEXITY.md`
For every exported operation: expected complexity, worst case, measured constant at n=1k/100k/1M, and
the reason the structure was chosen over the obvious alternative.

### 11. Tests
Table-driven or property-based. Minimum coverage targets:
- ring buffer: wrap-around, cap by bytes, eviction order
- hash index: resize under load, delete/tombstone, collision path
- sorted index: duplicates, empty range, boundary values
- aggregation: incremental == recompute
- token bucket: deterministic clock boundaries

---

## Integration

The console must consume the library and get **simpler**. If the console component grew, the API is wrong —
go back and fix the API rather than papering over it in the view layer.

Target: the table component drops to a render-only component with no data logic.

---

## Definition of done

- [ ] Public API implemented, no `any` in the exported surface
- [ ] 1M-row scan and scroll stay within the Part 1 budget, or better
- [ ] Ring buffer replacement shows a measured improvement, or a reasoned "no change"
- [ ] `BENCHMARKS.md` with reproducible commands
- [ ] `COMPLEXITY.md` with expected *and* measured
- [ ] Collision-DoS demo documented (and mitigated with a randomized seed or a probe limit)
- [ ] Incremental-equals-recompute test green
- [ ] Console component shrank; no data logic left in the view

---

## Non-goals

- Publishing to npm (optional; a workspace package is fine).
- A fluent builder API, plugins, adapters for other frameworks.
- SSR support, DOM bindings, accessibility in the library.
- Beating a general-purpose library. Beating *your Part 1 code*, measurably, with an explanation.
