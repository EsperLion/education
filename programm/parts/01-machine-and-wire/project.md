# Project — Console v1

**Goal:** a live dashboard that survives an hour of a fast public stream, on a tab that stays responsive,
with numbers that prove it.

Not a pretty dashboard. A *measured* one. Styling is out of scope; a plain table with monospace numbers
is the correct aesthetic for this phase.

---

## Architecture

```
public stream  ──►  proxy (Node, ~40 lines)  ──►  EventSource  ──►  ring buffer  ──►  virtual table
   Wikimedia            add UA, normalise            reconnect          cap+drop         windowed render
   (or generator)       rate-limit, reconnect                          metrics          perf HUD
```

The proxy is not architecture astronautics. It exists because:

1. The upstream may require headers a browser cannot set (`User-Agent`).
2. CORS may not permit direct browser consumption — and *finding out* is part of the exercise.
3. You want one place to reconnect, normalise, and later rate-limit.
4. In Part 3 this file becomes a real service. Starting it now means Part 3 is a refactor, not a rewrite.

---

## Requirements

### R1 — Proxy
- Connects to one source, re-emits SSE on `GET /stream`.
- Reconnects with backoff and logs each attempt with a reason.
- Normalises upstream payloads into the frozen `Event` type.
- Can be pointed at the generator instead of the network (`--source generator`).

### R2 — Bounded ingestion
- Ring buffer capped by **both** event count and approximate bytes.
- Drop-oldest policy, with a counter per policy decision.
- O(1) append. If you used `Array.shift()`, note it — you'll replace it in Part 2 and benchmark the delta.

### R3 — Rendering
- Hand-rolled virtualized table. Fixed row height. Window = visible + overscan.
- Render only the window. No library, no `react-window`, no `vue-virtual-scroller`.
- Target: 100k rows in the buffer, ≥55 fps while scrolling.

### R4 — Control
- Pause/resume that stops ingestion at the proxy, not just rendering.
- A live "buffer fill" bar, drop count, and ingest lag (now − event timestamp).

### R5 — Perf HUD
- fps from `rAF` deltas (rolling window, not instantaneous).
- Dropped frames.
- Long tasks (>50 ms) with duration.
- `performance.memory` where available (Chrome), otherwise a coarse estimate.
- All values sampled at ~4 Hz, never on every frame.

### R6 — Offline mode
- `--replay fixture.ndjson --speed 10` runs the whole thing without a network.
- This is what you demo when the venue wifi dies, and what makes benchmarks reproducible.

### R7 — Budget
`docs/budget.md` must state, with numbers and measurement methods:

| Metric | Target | How measured |
|---|---|---|
| Scroll fps | ≥55 at 100k rows | HUD, 30 s scroll, median |
| Long tasks during scroll | 0 over 50 ms | PerformanceObserver |
| Heap after 30 min | flat within ±15% | DevTools memory timeline |
| Ingest lag p95 | < 2000 ms | HUD |
| Bundle size (initial) | < 200 KB gzipped | bundle analyser |
| Time to interactive (local) | < 1.5 s | trace |

Fill in your own numbers, then hit them or explain why the target was wrong. Both outcomes are fine;
unmeasured targets are not.

### R8 — Trace analysis
600 words, structured as:

1. **Symptom** — what the user (you) saw.
2. **Evidence** — the trace, with the specific frame numbers and durations.
3. **Diagnosis** — which pipeline phase, which line of code.
4. **Fix** — what changed.
5. **Delta** — before/after numbers.

A trace analysis that doesn't quote numbers is a story, not an analysis.

---

## Stretch (only if you're ahead)

- **Web Worker for parsing**: move JSON parsing off the main thread, measure, and decide whether it was worth it. Write down the verdict — "no" is a valid result and a good one.
- **Service worker offline shell**: caches the app so it boots without network. Interesting because it interacts with your cache strategy.
- **Second source**: add USGS polling alongside the stream and normalise both into `Event`. This is a preview of Part 3 and will reveal how much your "generic" code is actually generic.

---

## Explicit non-goals

- Charts, visualisations, design systems, dark mode.
- Routing, auth, server-side anything (that's Part 3).
- State management libraries. One module with a `subscribe` function is the correct amount of state management here.
- Tests beyond the ring buffer and the normaliser. (Part 3 is where testing gets serious.)

---

## Definition of done

- [ ] Runs for 60 minutes without heap growth beyond budget
- [ ] 100k rows, smooth scroll, verified by the HUD
- [ ] Drops happen under overload and are visible in the UI
- [ ] Offline replay works with the network cable pulled
- [ ] `budget.md` has measured numbers
- [ ] `trace-analysis-01.md` is written and honest
- [ ] Deployed statically, or a runbook that a stranger could follow
