# Part 5 — Craft and capstone

**Weeks 31–36 · 70 h**

> Goal: the difference between "works on my machine" and "someone else can own this".

Everything up to here made you capable. This phase makes the capability *legible*: a clean build, a
pipeline that catches regressions, a deploy you can roll back, and documents that let a stranger operate
what you built.

It's also where the six artifacts come together into one thing you can point at.

---

## Concepts

### Build and bundle
- Module graph, tree shaking, side-effect annotations, why a barrel file hurts
- Code splitting by route vs by feature vs by vendor; chunk strategy and cache stability
- Bundle analysis: what's actually in there, and what's dead
- The build's real job: fast dev feedback vs optimal production output, and why they differ

### Monorepo mechanics
- Workspaces, task graphs, remote caching, affected builds
- Package boundaries as architectural enforcement, not just organisation
- Versioning internal packages: lockstep vs independent

### CI/CD
- Pipelines that fail for the right reason; flaky tests as a debt with interest
- Caching: dependencies, build output, test results
- Preview environments; environment parity
- Perf budgets enforced in CI — the only kind that survive contact with a deadline

### Observability
- Error tracking with context (release, tenant, request id)
- Traces across UI → API → worker; what a span is for
- Alerts that correspond to user pain; SLOs vs thresholds
- Dashboards: one per question, not one per metric

### Security
- OWASP top 10 applied to *this* app: injection, broken access control, SSRF, supply chain
- CSP that doesn't get disabled in week two; nonces and hashes
- Cookies, headers, and the browser's security model
- Dependency hygiene: lockfiles, audit, Dependabot, the cost of a transitive dependency
- Secrets: rotation, scope, and not-in-git as a baseline

### Refactoring legacy
- Seams: where to introduce a test boundary in code that has none
- Characterization tests: pinning current behaviour before changing it
- The strangler pattern; incremental replacement over rewrites
- Migration windows and dual-running

### Writing
- ADRs: decision, context, consequences — three paragraphs, no ceremony
- Runbooks: what to do at 3 a.m. when you're half asleep
- README as the front door: clone → run → verify, in ten steps

---

## Capstone — Console v5

Full detail in `project.md`. Headline:

1. One repo, clear boundaries (web / api / worker / shared)
2. CI: typecheck, lint, unit, integration, perf budget, bundle check
3. Deployed and reachable, with a tested rollback
4. `ARCHITECTURE.md` with a diagram you'd show in an interview
5. 5–8 ADRs
6. `README.md` a stranger can follow
7. A 5-minute demo you can narrate

---

## Exit criteria

- [ ] Someone else runs it from the README without asking you anything
- [ ] CI catches a deliberately introduced perf regression
- [ ] You can explain any file in the repo and why it lives where it does
- [ ] Rollback is documented and tested, under two minutes
- [ ] Rubric rescored; every previously-shaky domain is at 2+
- [ ] You can give the 5-minute demo without notes

---

## Resources

`RESOURCES.md` § Part 5. Minimum:

1. [Software Engineering at Google](https://abseil.io/resources/swe-book) — free, chapters on testing and code review
2. [PortSwigger Web Security Academy](https://portswigger.net/web-security) — free, hands-on
3. [Google SRE Book](https://sre.google/sre-book/table-of-contents/) — SLOs, alerting
4. *A Philosophy of Software Design* — if you haven't read it yet, now
5. [The Twelve-Factor App](https://12factor.net/) — as a checklist against your deploy

---

## Common ways this phase goes wrong

- **Polishing instead of finishing.** The capstone is a 6-week phase, not an open-ended product. Freeze
  features at week 33; weeks 34–36 are delivery, docs, and drills only.
- **A CI pipeline that's slow enough to skip.** If the pipeline takes 20 minutes, you'll bypass it. Under 8
  minutes or it doesn't exist.
- **Deploying to a VPS and discovering you have no backups.** Backups and a restore test are part of
  "deployed", not a later nicety.
- **Writing docs at the very end.** Write the ADRs as you make the decisions; reconstructing them later
  produces fiction.
- **Not rehearsing the demo.** Five minutes, out loud, once, before you show anyone.
