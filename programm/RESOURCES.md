# Resources

Every topic has a **free** path and a **paid** path. Start free. Pay only when a free source repeatedly
fails to explain something you need.

> Rule: **at most one paid subscription at a time**, and only while you're actively in a phase that
> needs it. Subscriptions are the most common way self-directed learning turns into spending.

---

## The minimum shelf

If you read only five things in 36 weeks, these:

| | Resource | Cost | Use |
|---|---|---|---|
| 1 | *High Performance Browser Networking* — Ilya Grigorik ([free online](https://hpbn.co/)) | Free | Parts 1, all of it |
| 2 | *Designing Data-Intensive Applications* — Martin Kleppmann | Paid (~$40) | Parts 3–4, chapters 1–6 + 8–9 |
| 3 | *The Algorithm Design Manual* — Steven Skiena | Paid (~$50) | Part 2, selectively |
| 4 | [Use The Index, Luke](https://use-the-index-luke.com/) — Markus Winand | Free | Part 3, SQL indexing |
| 5 | [web.dev — Learn Performance](https://web.dev/learn/performance) | Free | Part 1 |

Everything else below is support. Do not buy the rest up front.

---

## Paid platforms (pick at most one)

| Platform | ~Cost | Good for | Verdict |
|---|---|---|---|
| [Frontend Masters](https://frontendmasters.com/) | $39/mo | Browser perf, JS hard parts, architecture courses | Best single fit for Parts 1 and 4. Subscribe for 1–2 months, binge, cancel. |
| [Execute Program](https://www.executeprogram.com/) | ~$25/mo | Spaced-repetition drills: TypeScript, SQL, modern JS | Excellent for the *drill* half. Low time cost per session. |
| [Educative](https://www.educative.io/) | ~$20/mo | Text-based courses, system design | Decent DDIA companion; shallow on depth. |
| [O'Reilly](https://www.oreilly.com/) | ~$50/mo | The actual books, all of them | Only if you'd otherwise buy 3+ books. |
| [Boot.dev](https://www.boot.dev/) | ~$25/mo | Backend fundamentals, gamified | Good structure, but you're beyond the intro tier. |

**Recommended pairing for this program:** Frontend Masters for one month during Part 1, then Execute
Program for one month during Part 2–3. Total ~$65, spent twice, at the moments of need.

---

## Part 1 — Runtime, rendering, networking

### Free (primary)

- [What the heck is the event loop anyway?](https://www.youtube.com/watch?v=8aGhZQkoFbQ) — Philip Roberts. Still the best 26 minutes on the topic.
- [Jake Archibald: In The Loop](https://www.youtube.com/watch?v=cCOL7MC4Pl0) — the *visual* explanation of task ordering. Watch both.
- [web.dev — Learn Performance](https://web.dev/learn/performance) — the structured course. Free, current.
- [Chrome DevTools — Performance panel docs](https://developer.chrome.com/docs/devtools/performance/) — read the "Analyze runtime performance" guide once, properly.
- [High Performance Browser Networking](https://hpbn.co/) — networking half of Part 1. Chapters 1–4, 11–12.
- [HTTP/3 explained](https://http3-explained.haxx.se/) — Daniel Stenberg. Free book, short.
- [Cloudflare Learning Center](https://www.cloudflare.com/learning/) — DNS, TLS, CDN, caching. Skim, use as lookup.
- [MDN — HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching) — the reference you'll return to.
- [JavaScript Visualized](https://www.youtube.com/playlist?list=PLf9qBbyRg2aB) — Lydia Hallie. Event loop, promises, async/await. Visual, fast.
- [You Don't Know JS Yet](https://github.com/getify/You-Dont-Know-JS) — free on GitHub. Chapters on scope/closures, only if shaky.
- [V8 blog](https://v8.dev/blog) — pick 3 posts on hidden classes, GC, and the interpreter/JIT pipeline.
- [Julia Evans — zines](https://wizardzines.com/) — "How does the internet work", "Bite size networking". Cheap ($5-ish each), genuinely good.

### Paid

- Frontend Masters: *Web Performance Fundamentals*, *Blazingly Fast JS*, *The Hard Parts of JavaScript*.
- *Real World Instrumentation with OpenTelemetry* (O'Reilly) — only if Part 5 observability feels thin.

### Skip

- Anything teaching "use Lighthouse and get 100". You want mechanism, not scores.
- HTTP/2 deep-dive books. Read the summary and move on.

---

## Part 2 — Algorithms and math

### Free (primary)

- [MIT 6.006 Introduction to Algorithms](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/) — lectures + problem sets. Use for trees, heaps, graphs, DP.
- [Visualgo](https://visualgo.net/) — visualise the structure before you implement it. Good for graphs and trees.
- [The Algorithms](https://github.com/TheAlgorithms) — reference implementations in every language. Read, don't copy.
- [MIT 6.042J Mathematics for Computer Science](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2020/) — free textbook + lectures. Do the first 4 problem sets, no more.
- [Mathematics for Computer Science (PDF)](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/resources/mit6_042jf10_notes/) — Lehman/Leighton/Meyer. Reference.
- [3Blue1Brown — Essence of Linear Algebra](https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab) — only if you go near ML later.
- [Big-O Cheat Sheet](https://www.bigocheatsheet.com/) — one page, surprisingly useful.
- [Exercism](https://exercism.org/) — free tracks with mentoring. Good for TS/JS drills.

### Paid

- *The Algorithm Design Manual* — Skiena. The war stories are the value: real problems, real structure choices. Read Parts I–II, skip the catalogue until you need it.
- *Grokking Algorithms* — Bhargava. Cheap, illustrated, 4 hours. Fine as a warm-up, too shallow alone.
- *Algorithms* — Sedgewick. Reference only; don't read cover to cover.
- [NeetCode](https://neetcode.io/) — has a free tier. **Only** for the structure drills, not the grind. Never do 200 problems.
- Execute Program — *TypeScript*, *SQL*, *Concurrency* courses. Best fit for the drill block.

### Skip

- *Introduction to Algorithms* (CLRS) as a reading plan. It's a reference, not a curriculum, and it will eat
  three months. Look things up in it.
- LeetCode premium, "crack the interview" content, 500-problem lists.

---

## Part 3 — Backend and data

### Free (primary)

- [Use The Index, Luke](https://use-the-index-luke.com/) — the single best free resource on SQL indexing. Read it fully.
- [PostgreSQL docs](https://www.postgresql.org/docs/current/) — specifically: `EXPLAIN`, concurrency control, indexes, MVCC. Dense but correct.
- [Postgres Exercises](https://pgexercises.com/) — hands-on SQL with a real schema.
- [Full Stack Open](https://fullstackopen.com/en/) — Helsinki. Parts 4–5 (testing, auth) and 12 (containers) as a sanity check.
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/) — auth, sessions, CSRF, SQL injection.
- [The Twelve-Factor App](https://12factor.net/) — 30 minutes, still relevant.
- [Node.js docs — Streams, Backpressure](https://nodejs.org/docs/latest-v22.x/api/stream.html) and [Don't Block the Event Loop](https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop).
- [RFC 9457 — Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457) — read one real RFC, it's a skill.
- [jwt.io](https://jwt.io/introduction) + [OAuth 2.0 Simplified](https://oauth.net/2/) — auth mental model before implementation.

### Paid

- *Designing Data-Intensive Applications* — Kleppmann. **The** book for Parts 3–4. Buy it, annotate it, keep it.
- *SQL Performance Explained* — Markus Winand. The paid, deeper version of Use The Index Luke. Buy only if the free one clicked and you want more.
- *Node.js Design Patterns* — Casciaro. Chapters on streams, backpressure, and async patterns only.
- *Database Internals* — Petrov. Optional, Part 4+. Read the B-tree and LSM chapters if you get curious.
- Frontend Masters *Fullstack* paths / *API Design* courses — decent, but the free sources above are better value.

### Skip

- ORM tutorials that never show you SQL. You're learning the database, not the ORM.
- Microservices books. Wrong phase, wrong scale, wrong problem.

---

## Part 4 — System design and architecture

### Free (primary)

- [System Design Primer](https://github.com/donnemartin/system-design-primer) — broad, good index. Read the topics, not the whole thing.
- [Martin Fowler — bliki](https://martinfowler.com/bliki/) — pick: CQRS, Event Sourcing, StranglerFigApplication, CircuitBreaker, SacrificialArchitecture.
- [Patterns.dev](https://www.patterns.dev/) — free book. Rendering, data fetching, performance patterns.
- [Bulletproof React](https://github.com/alan2207/bulletproof-react) — a concrete FE architecture to argue with.
- [Awesome System Design](https://github.com/madd86/awesome-system-design) — reading list, use sparingly.
- [Google SRE Book](https://sre.google/sre-book/table-of-contents/) — chapters on SLOs, cascading failures, load shedding.
- [AWS Builders' Library](https://aws.amazon.com/builders-library/) — short articles on retries, timeouts, backoff. Genuinely good, vendor-neutral enough.
- [The Grug Brained Developer](https://grugbrain.dev/) — 20 minutes, antidote to over-architecture.
- [ADRs](https://adr.github.io/) — the format. Use it in Part 5.

### Paid

- *Software Architecture: The Hard Parts* — Ford et al. Best paid book on trade-offs and decomposition.
- *Fundamentals of Software Architecture* — Ford & Richards. The vocabulary primer; skip if you read Hard Parts.
- *Web Scalability for Startup Engineers* — Artur Ejsmont. Practical, slightly dated, still the best "how a real web system scales" book.
- *System Design Interview* vol. 1 — Alex Xu. You said no interview prep, but its case studies are useful *as* case studies. Optional.
- *A Philosophy of Software Design* — Ousterhout. ~150 pages, the highest value-per-page book on this list.

### Skip

- *Clean Architecture* (Uncle Bob). The dependency rule is one page; the rest is dogma that will make you
  over-abstract. If you read it, read it as an argument, not a manual.
- "Design 100 systems" listicles. Depth on three beats breadth on a hundred.

---

## Part 5 — Craft, delivery, security

### Free

- [Software Engineering at Google](https://abseil.io/resources/swe-book) — free online. Chapters on testing, code review, deprecation.
- [PortSwigger Web Security Academy](https://portswigger.net/web-security) — free, hands-on, the best security training that exists.
- [Playwright docs](https://playwright.dev/docs/intro) — e2e done properly.
- [GitHub Actions docs](https://docs.github.com/en/actions) + [Dependabot](https://docs.github.com/en/code-security).
- [OpenTelemetry docs](https://opentelemetry.io/docs/) — enough to instrument one service.
- [The Twelve-Factor App](https://12factor.net/) again — it's a checklist by week 33.

### Paid

- *Refactoring* — Fowler, 2nd ed. Read the catalogue selectively; the discipline of small steps is the point.
- *Working Effectively with Legacy Code* — Feathers. The seams and characterization-test chapters.
- *The Pragmatic Programmer* — Hunt & Thomas. Skim; much will already be instinct.
- *Staff Engineer* — Will Larson. Read at week 30, when the questions become about scope, not syntax.

### Skip

- Kubernetes books. You will not run a cluster in this program.
- Anything that promises "senior in 90 days".

---

## Reference, not reading

These are lookup tools. Don't schedule them:

- [MDN](https://developer.mozilla.org/) — always.
- [Can I Use](https://caniuse.com/) — before any compatibility claim.
- [web.dev](https://web.dev/) — when a metric confuses you.
- [Postgres wiki: Don't Do This](https://wiki.postgresql.org/wiki/Don%27t_Do_This) — read once, it's fun and useful.
- [High Performance Browser Networking](https://hpbn.co/) — networking lookup.
