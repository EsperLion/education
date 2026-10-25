# Drills — Part 1

Small, finite, finishable in one sitting. Do them in order within each group. Write the result down in
`drills/part-01.md` — a drill you can't recall the outcome of didn't happen.

Rules: 20–60 minutes each. If one takes longer, stop, note where you got stuck, move on. Revisit at the gate.

---

## A. Event loop and tasks

- [ ] **A1.** Write 10 ordering puzzles (mixed `setTimeout`, `Promise.then`, `queueMicrotask`, `rAF`,
      `await`). Predict all 10 in writing **first**, then run. Score yourself. Target: 10/10.
- [ ] **A2.** Implement `sleep(ms)` three ways: `setTimeout`, `requestAnimationFrame` loop, `AbortSignal`.
      Which one is correct for a UI delay and why?
- [ ] **A3.** Starve `requestAnimationFrame` with a self-scheduling microtask. Capture the trace.
      Explain the difference between "blocked" and "starved".
- [ ] **A4.** Batch 1000 DOM updates three ways: one-by-one, inside `rAF`, inside `DocumentFragment`.
      Measure. Explain the result in terms of style/layout/paint.

## B. Memory

- [ ] **B1.** Leak a `ResizeObserver` or event listener on a removed node. Find it in a heap snapshot.
      Fix it. Prove the node is collectable (snapshot diff, not vibes).
- [ ] **B2.** Create a closure that retains a 50 MB `ArrayBuffer`. Show it in the snapshot. Break the
      reference and show it gone.
- [ ] **B3.** Compare `structuredClone` of a 10 MB buffer vs transferring it to a worker. Measure both.
- [ ] **B4.** Explain the difference between a minor and a major GC, and describe what you'd see in a
      timeline for each.

## C. Rendering

- [ ] **C1.** Reproduce layout thrash: read → write → read in a loop over 200 nodes. Capture the trace.
      Then fix it (batch reads, then writes). Quote the frame-time delta.
- [ ] **C2.** Animate the same element with `left` and with `transform`. Same trace, side by side.
      Explain in terms of layout/paint/composite.
- [ ] **C3.** Promote an element to its own layer with `will-change`. Measure memory before and after.
      When is the layer a mistake?
- [ ] **C4.** Implement a virtualized list from scratch in under 100 lines. Scrolling must not allocate
      per frame (check the allocation timeline).

## D. Network

- [ ] **D1.** Build the cache-prediction table: 8 combinations of `Cache-Control`/`ETag` × (reload,
      navigation, back-forward). Predict, verify, score.
- [ ] **D2.** Force a CORS preflight with a custom header. Read the actual preflight request and response.
      Then fix it server-side. Explain what the browser refused to tell you and why.
- [ ] **D3.** Add `stale-while-revalidate=60` to one endpoint. Observe the behaviour with the network
      throttled. Describe what the user sees.
- [ ] **D4.** Compute the wall-clock cost of one extra RTT for a page with 6 sequential requests at
      50 ms / 150 ms / 400 ms RTT. Compare against 6 parallel requests over HTTP/2.
- [ ] **D5.** Serve one asset with an ETag, one without. Compare 304 vs 200 in the Network panel
      (headers, sizes, timing). Explain why 304 isn't free.

## E. Integration

- [ ] **E1.** Point the console at the Bluesky stream **without** a filter for 60 seconds. Record heap,
      fps, drops. Then add backpressure and re-record. Write the two-row table.
- [ ] **E2.** Kill the network mid-stream (`Network → Offline`). What does the UI do? What should it do?
      Implement the "should".
- [ ] **E3.** Re-run the whole thing at 6× CPU throttle. Which of your assumptions broke first?

---

## Cold-recall set (for the gate)

At week 7, redo these from a blank file, no reference:

- ring buffer with tests
- the 10 loop puzzles
- the thrash fix
- the cache table

Anything you can't redo cold is your week-8 list.
