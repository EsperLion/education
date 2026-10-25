# Engineering Foundations — a 36-week program

A self-directed program for an experienced frontend developer (9 years, React → Vue, web + mobile,
some Node) who wants the fundamentals that make senior engineers *trustworthy*: how the machine works,
how networks work, how data is stored and queried, and how to design a system on purpose instead of by accident.

**Constraints this program is built around**

| | |
|---|---|
| Time | 10–15 h/week (sized for ~12) |
| Duration | 36 weeks, ~440 h |
| Style | Project-first — fundamentals are learned because they unblock the next feature |
| Goal | Stay in frontend, gain real system-design range (fullstack-capable) |
| Interview prep | None. Deliberately excluded. |
| Language | English materials |

---

## The spine

One product, built five times. Each version is defined by a wall you hit.

> **A real-time analytics console** — ingest events from public streams, store them, query them,
> render 100k+ rows at 60 fps, with auth, multi-tenancy, and a deploy story.

- **v1** (Part 1) — live SSE feed, ring buffer, perf budget, instrumentation. Teaches the runtime and the wire.
- **v2** (Part 2) — the core extracted into a tested library: indexes, windowing, incremental aggregation, cache. Teaches data structures that pay rent.
- **v3** (Part 3) — a real backend: Postgres, auth, tenants, jobs, rate limits. Teaches data and API design.
- **v4** (Part 4) — design docs and one hard slice: partitioned ingestion at 100×. Teaches system design.
- **v5** (Part 5) — unified, deployed, documented. The capstone artifact.

You keep one repo. Every phase adds a directory, not a new project. Nothing gets thrown away.

---

## Folder map

```
programm/
  README.md                  ← you are here
  SYLLABUS.md                ← the 36-week map and per-phase detail
  RUBRIC.md                  ← self-assessment, retaken at every gate
  RESOURCES.md               ← books/courses, free + paid, with "read this, skip that"
  DATA-SOURCES.md            ← free APIs and streams for the console
  PROGRESS.md                ← the one-line-per-week tracker
  schedule/
    weeks-01-12.md           ← detailed plan for the first quarter
  parts/
    00-baseline/
    01-machine-and-wire/     { README, project, drills }
    02-algorithms/           { README, project, drills }
    03-backend-and-data/     { README, project, drills }
    04-system-design/        { README, project, design-docs }
    05-craft-capstone/       { README, project }
  log/_template.md           ← weekly log
  reviews/_template.md       ← monthly retrospective
```

Only the first 12 weeks are scheduled in detail. Planning week 30 in week 1 is fiction; you will know
more after Part 1 than you do now.

---

## How to use it

1. **Read `SYLLABUS.md` once.** Then never read it end-to-end again. Work from the part folders.
2. **Write the weekly log every week**, even badly. Ten lines is enough. This is the only habit whose
   absence reliably kills self-directed programs — without it, month four feels like month one.
3. **Pass the exit criteria before moving on.** They are written as things you can *do*, not things you
   have *seen*. If you can't do them, the phase isn't finished, no matter how many hours you logged.
4. **Retake `RUBRIC.md` at every phase gate.** Score honestly on a 0–3 scale. Compare against the
   previous column, not against a hypothetical expert.
5. **Adjust the plan at the gates, not mid-week.** Mid-week changes are procrastination in disguise.

---

## Weekly rhythm (~12 h)

| Block | Hours | What |
|---|---|---|
| Reading | 2 | Fixed slot. Notes go in the repo, not in your head. |
| Project | 5 | The feature that is currently blocked. |
| Drills | 2 | Small focused reps. Predictable, small, finishable in one sitting. |
| Writing | 1.5 | The weekly log: what broke, what you now understand. |
| Review | 1.5 | Cleanup, next-week plan, tick `PROGRESS.md`. |

Compress for 8 h/week: drop drills to 1 h and project to 3.5 h, accept ~48 weeks instead of 36.
Expand for 15 h/week: add 2 h to project and 1 h to reading. Do **not** add a second project.

---

## Phase gates

At the end of each phase, in one sitting:

1. Fill in the rubric column. Diff against last time.
2. Run the phase's exit-criteria checklist. Unticked box = stay one more week.
3. Write a **teach-back**: 400–600 words explaining the phase's central idea with no jargon, to a
   fictional junior. If you can't, you don't have it yet.
4. Update `SYLLABUS.md` dates for the next phase.
5. Only then start the next phase.

---

## Anti-goals (explicit, to protect the schedule)

- **No LeetCode grinding.** Algorithms are learned as tools for this product, not as interview theater.
- **No new framework.** Vue + TypeScript + Node + Postgres for 36 weeks. That is the whole stack.
- **No side quests.** No Rust, no Haskell, no "quick Kubernetes primer". Park them in a `someday.md`.
- **No tutorial-following.** Tutorials are reference material. The project is the curriculum.
- **No cert collection.** Nobody is checking.

---

## What success looks like at week 36

- You can look at a slow page and say *why* it's slow, then prove it with a profile.
- You can design a schema, justify every index, and explain what happens on a retry.
- You can write a design doc that a senior stranger can meaningfully critique.
- You can defend a frontend architecture: module boundaries, state ownership, test strategy.
- You have one deployed system that you understand end to end, down to the TCP handshake.
- Your rubric scores moved by at least 1 point in every domain you flagged as shaky.

Start with `parts/00-baseline/README.md`.
