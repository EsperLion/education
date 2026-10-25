# Part 0 — Baseline

**Week 1 · 10 h · no code that ships**

The purpose of this part is not to learn anything. It is to make the next 35 weeks *legible* — so that
in month five you can prove you've moved, and so that a bad week is a bad week rather than a suspicion
that the whole thing is pointless.

---

## Tasks

### 1. Score yourself (2 h)

Open `RUBRIC.md` and fill the **W1** column for all ~40 items. Be stingy. Read the scale definitions
and apply them literally: a 3 means you could defend it in a design review, not that you've heard of it.

Don't look anything up while scoring. The point is the honest baseline, not a good score.

### 2. Write the north star (30 min)

Four sentences at the top of `PROGRESS.md`:

1. What I can do today.
2. What I want to be able to do at week 36.
3. Why that specific thing (what it unlocks — a role, a project, confidence in a specific situation).
4. What I am explicitly *not* trying to become.

Sentence 4 matters most. Without it, every interesting tangent becomes a legitimate detour.

### 3. Set up the two repos (1 h)

- `education/` — this folder. Commit it.
- `console/` — the product. Separate repo or a subdirectory, your call, but keep the history clean.

Minimum toolchain: Node LTS, pnpm, Docker (for Postgres in Part 3 — install now, use later),
a Postgres client (`psql` or a GUI), Chrome, and a working debugger in your editor.

### 4. Choose your data sources (30 min)

Read `DATA-SOURCES.md`. Decide:
- Primary live stream (default: Wikimedia EventStreams via a proxy)
- Secondary snapshot source (default: USGS)
- Stress source (default: Bluesky Jetstream)

Write the choice and the reason into `PROGRESS.md`. If you pick a different domain, that's fine — but
pick one and write down why, because you'll be living with it for nine months.

### 5. Freeze the event schema (1 h)

Define the `Event` type from `DATA-SOURCES.md` and put it in `console/packages/shared/types.ts` (or
equivalent). This type appears in every phase. Getting it roughly right now saves a week later.

What it must support: stable id for dedupe, source-local timestamp *and* ingest timestamp, a
`kind` discriminator, and a free-form `attrs` bag for source-specific fields.

### 6. Build the generator skeleton (2 h)

`tools/generator` with:
- seeded PRNG (mulberry32 or xorshift — anything deterministic)
- `--rate`, `--seed`, `--out` flags
- emits `Event`-shaped NDJSON

Nothing fancy. You'll extend it with burst/outage/replay in weeks 3 and 10.

### 7. Start the log habit (30 min)

Create `log/week-01.md` from the template. Short is fine. The habit is the deliverable.

---

## Done when

- [ ] `RUBRIC.md` W1 column complete
- [ ] North-star statement written, including the "not trying to become" sentence
- [ ] Both repos initialized and committed
- [ ] Data sources chosen and justified in `PROGRESS.md`
- [ ] `Event` type frozen in the shared package
- [ ] Generator produces byte-identical output for the same seed
- [ ] `log/week-01.md` exists

---

## What you should be able to say at the end of this week

> "In 35 weeks I will be able to [specific capability]. Today I'd score myself [X] on the rubric for it.
> I'm measuring progress by [these] criteria, and I'm not chasing [these]."

If you can't fill those blanks, the program has no target and the rest of this folder is decoration.
