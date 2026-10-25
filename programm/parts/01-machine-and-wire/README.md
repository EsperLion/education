# Part 1 — The machine and the wire

**Weeks 2–7 · 75 h**

> Goal: stop treating the browser and the network as magic. Be able to say *why* something is slow and
> prove it.

By the end you will have a live console, a perf budget, a trace analysis you're proud of, and a mental
model that holds up when something unfamiliar breaks.

---

## The two halves

**The machine** — how JavaScript actually runs and how pixels actually get to the screen.

**The wire** — what happens between `fetch()` and a byte arriving, and who decides whether it's cached.

They meet in the project: a live stream is both an event-loop problem (bounded buffering, batching) and
a network problem (transport choice, reconnect, backpressure).

---

## Concepts

### Runtime and memory
- Parse → bytecode → JIT; hidden classes (object shape), inline caches, why monomorphism is fast
- Call stack, heap, stack vs heap allocation; GC generations; minor vs major collection pauses
- Leak taxonomy: detached DOM, forgotten listeners, unbounded caches, closures over large scopes,
  timers that outlive components
- Event loop: macrotasks, microtasks, `rAF`, `rIC`, and starvation
- Workers: when they help, `postMessage` cost, transferables, when NOT to use one

### Rendering
- Style → layout → paint → composite; main thread vs compositor
- Forced synchronous layout (layout thrash) and how it looks in a trace
- Layers and `will-change`: when a layer helps, when it costs memory
- Long tasks, input delay, INP; the 16.7 ms budget and why "60 fps" is a simplification
- LCP, INP, CLS — the mechanism behind each metric

### The wire
- DNS → TCP → TLS 1.3 → HTTP; connection reuse, keep-alive, HTTP/2 multiplexing, HTTP/3/QUIC
- Conditional requests, ETag/If-None-Match, ranges, status codes that matter
- `Cache-Control` in depth: `max-age`, `s-maxage`, `immutable`, `stale-while-revalidate`, `no-cache` vs `no-store`, shared vs private
- CDN: edge caching, cache keys, purge, the "why is production stale" class of bug
- CORS: simple vs preflighted, credentials, and why the error message is unhelpful
- Transport choice: SSE vs WebSocket vs long-poll; framing, reconnect, heartbeats, backpressure

---

## Project — Console v1

Details in `project.md`. Summary:

1. Local Node proxy → public stream
2. Bounded ring buffer (cap by count and bytes)
3. Hand-rolled virtualized table
4. Pause/resume + backpressure indicator
5. Perf HUD (fps, long tasks, heap, lag)
6. `budget.md` with real numbers
7. One 600-word trace analysis

---

## Drills

`drills.md`. Twelve small, finite exercises. Each should take 20–60 minutes. They are cumulative
maintenance, not a second curriculum — if a drill takes over two hours, stop and note why.

---

## Exit criteria

- [ ] Explain, from a trace, exactly which phase a jank came from
- [ ] Predict microtask/macrotask ordering before running it, and be right
- [ ] Explain why the proxy exists — in terms of headers *and* CORS
- [ ] State your `Cache-Control` strategy and justify each asset class
- [ ] Explain where the heap grows and what bounds it
- [ ] The perf budget is measured by a repeatable script or CI, not by vibes

---

## Resources

See `RESOURCES.md` § Part 1. The core three, all free:

1. *High Performance Browser Networking* — ch. 1–4, 11–12
2. `web.dev/learn/performance` — the whole course
3. Philip Roberts + Jake Archibald event-loop talks

If you're going to pay for anything in this phase, one month of Frontend Masters (*Web Performance
Fundamentals*) is the highest-value option. It is not necessary.

---

## Common ways this phase goes wrong

- **Reading HPBN cover to cover.** Don't. Ch. 1–4 and 11–12 are the load-bearing ones; the rest is lookup.
- **Trusting Lighthouse scores.** A 100 on Lighthouse with a 400 ms INP is a broken product with a green badge. Measure what a user feels.
- **Building the proxy "properly"** with routing, config, logging, and a plugin system in week 3. It's 40 lines. It becomes 400 in Part 3; build it then.
- **Skipping the trace analysis.** It's the only deliverable here that proves understanding rather than activity.
