# Part 3 — Backend and data

**Weeks 14–21 · 110 h**

> Goal: own the other half of the request. Schema, indexes, auth, jobs, retries — and be able to defend
> each choice with a query plan rather than an opinion.

This is the largest phase because it's the biggest honest gap. Nine years of frontend with "a little
Node" usually means: you can build an endpoint, but you've never had to justify an index, choose an
isolation level, or explain what happens when a write is retried.

The proxy from Part 1 becomes a real service. Nothing is thrown away.

---

## Concepts

### Node runtime, beyond the surface
- libuv, the event loop under I/O, the threadpool (and which APIs use it)
- `cluster` vs `worker_threads`; when neither helps
- Streams and backpressure end to end; when a stream beats a buffer
- Request lifecycle: parsing, middleware, timeouts, graceful shutdown, connection draining

### API design
- Resource modelling; naming that survives three years
- Status codes as a contract, not decoration
- Pagination: offset (and why it dies at depth) vs keyset vs cursor
- Versioning: when it's necessary and why most teams regret it
- Error shape: RFC 9457 problem details; a machine-readable error code alongside a human message
- Validation at the boundary; trust nothing from the wire
- Idempotency keys and retry safety; the difference between "at least once" and "exactly once"

### Auth and security
- Sessions vs JWT: revocation, statefulness, size, where each fails
- Refresh token rotation and reuse detection
- OAuth 2.0 / OIDC with PKCE; why the implicit flow is dead
- RBAC vs ABAC; authorisation at the query level, not the controller level
- Tenancy: how a missing `WHERE tenant_id = ?` becomes a breach, and the tests that prevent it
- CSRF, `SameSite`, cookie flags, XSS surfaces, CSP

### Postgres
- Schema: normalisation vs denormalisation; natural vs surrogate keys; naming discipline
- Indexes: B-tree ordering, composite column order, partial, covering, GIN; when the planner ignores them
- `EXPLAIN (ANALYZE, BUFFERS)` — reading plans, spotting seq scans, estimated vs actual rows
- Transactions, MVCC, isolation levels and the anomalies each allows; deadlocks and retry policy
- Migrations that don't lock: `CONCURRENTLY`, backfills in batches, expand/contract
- Time-series shapes: bucketing, rollups, materialised views, retention, partitioning
- Constraints as documentation that the database enforces

### Async work
- At-least-once delivery; dedupe keys; visibility timeouts; stuck jobs
- Retry with exponential backoff and jitter; dead-letter queues; poison messages
- Cron vs queue vs scheduled queue; the outbox pattern

### Observability and testing
- Structured logs with request IDs; metrics that answer questions; slow-query logging
- Unit vs integration vs contract tests; why mocks of your database lie
- Testcontainers or Docker Compose for real-Postgres integration tests
- Fixtures that represent production shapes, not the happy path

---

## Project — Console v3

Full requirements in `project.md`. Headline:

1. Ingest API with auth + per-tenant rate limiting
2. Postgres: raw events + rollups + migrations
3. Query API: filtered, keyset-paginated, time-bucketed
4. Rollup worker with retries, dedupe, dead letters
5. Idempotent ingest, proven by a double-submit test
6. Multi-tenancy enforced at the data layer, with a test that fails cross-tenant reads
7. OpenAPI spec + typed client
8. Integration tests against real Postgres
9. `docker-compose up` works from a clean clone
10. `SCHEMA.md`: every table, index, and the query it serves

---

## Drills

`drills.md` — SQL plans, N+1 hunts, idempotency, deadlocks, migrations.

---

## Exit criteria

- [ ] Justify every index by naming the query it serves
- [ ] Read a plan and say whether an index was used, and why not
- [ ] Explain what happens when the same event is delivered twice
- [ ] Name your isolation level and the anomaly it prevents
- [ ] Write a migration that doesn't block writes on a live table
- [ ] Find and fix an N+1 in your own code
- [ ] Explain a cross-tenant leak and the test that prevents it

---

## Resources

`RESOURCES.md` § Part 3. Minimum, all free except one:

1. [Use The Index, Luke](https://use-the-index-luke.com/) — read it fully, it's short and it's the core skill
2. Postgres docs: `EXPLAIN`, concurrency control, indexes
3. *Designing Data-Intensive Applications* ch. 1–3 (paid, and worth it — it carries into Part 4)
4. OWASP cheat sheets: sessions, CSRF, SQL injection, authentication

---

## Common ways this phase goes wrong

- **Reaching for an ORM to avoid SQL.** You're learning the database. Use `pg` or Kysely, write the SQL, read the plan. An ORM can come later, once you can tell when it's generating something stupid.
- **Mocking the database in tests.** Then you learn nothing about the database and your tests pass while production locks. Real Postgres in a container, always, for integration tests.
- **Building auth from scratch "to learn".** Implement session auth yourself (worth it), but use a library for password hashing and OIDC flows. Don't invent crypto.
- **Skipping `EXPLAIN`.** Without it you're guessing, and your indexes are cargo cult.
- **Scope creep into a product.** No billing, no email, no admin UI, no notifications. If it isn't in `project.md`, it waits.
