# Drills — Part 3

SQL and backend drills. Most involve the real database — no mocks, no ORM hiding the query.

Log outcomes in `drills/part-03.md`. Include the plan (`EXPLAIN ANALYZE` output) where relevant; a
drill without evidence is a claim.

---

## SQL and plans

- [ ] **S1.** Create a 1M-row table. Write a query with a `WHERE` + `ORDER BY` + `LIMIT`. Capture the plan. Add the right composite index. Capture again. Explain the difference in rows-read and time.
- [ ] **S2.** Same query, but the index has the columns in the wrong order. Show the planner ignoring it (or using it badly). Articulate the rule.
- [ ] **S3.** Force a seq scan (`enable_indexscan = off`). When is a seq scan actually the right choice? Find the crossover with `EXPLAIN`.
- [ ] **S4.** Write a query the planner estimates badly (stale stats). Fix with `ANALYZE`, explain what changed.
- [ ] **S5.** Build a partial index for "only unresolved jobs". Show it used and show the size difference.
- [ ] **S6.** Build a covering index (`INCLUDE`). Show the plan going index-only, then break it by adding a column that forces a heap fetch.
- [ ] **S7.** GIN index on `jsonb`: query `attrs->>'region' = 'eu'` vs `attrs @> '{"region":"eu"}'`. Which uses the index? Why does `jsonb_path_ops` not help with the first?
- [ ] **S8.** [pgexercises](https://pgexercises.com/) — all "aggregation" and "window functions" exercises. Window functions especially: `row_number`, `lag`, running totals.
- [ ] **S9.** Write a time-bucketed aggregate (`date_trunc('hour', ts)`) with a gap-filling requirement: hours with no events must appear as 0. Two ways: `generate_series` + left join, and a CTE. Compare plans.

## Transactions and concurrency

- [ ] **C1.** Reproduce a **non-repeatable read** at `READ COMMITTED` using two `psql` sessions. Then at `REPEATABLE READ`.
- [ ] **C2.** Reproduce a **phantom read**. Which isolation level prevents it? What does Postgres actually do there?
- [ ] **C3.** Cause a **deadlock** with two transactions locking rows in opposite order. Read the error. Then fix it with consistent ordering.
- [ ] **C4.** Implement `SELECT ... FOR UPDATE SKIP LOCKED` as a job queue. Two workers, one job — prove only one processes it.
- [ ] **C5.** Cause **lost update** with read-modify-write, then fix it three ways: `SELECT FOR UPDATE`, an atomic `UPDATE ... SET x = x + 1`, and optimistic concurrency with a version column. Compare the trade-offs in writing.
- [ ] **C6.** Exhaust the connection pool deliberately. What does the API do? What should it do?

## Migrations

- [ ] **M1.** Add a `NOT NULL` column with a default to a 1M-row table. Watch the lock. Explain why this differs pre- and post-Postgres 11.
- [ ] **M2.** Write an expand/contract pair: add nullable column → dual-write → backfill in batches → add constraint → drop old column. Document each step's lock profile.
- [ ] **M3.** Create an index with `CREATE INDEX CONCURRENTLY` on a table under write load. Then do it without `CONCURRENTLY` and observe the write block. Time both.
- [ ] **M4.** Write a batched backfill (10k rows per statement, sleep between). Verify it doesn't hold a long transaction.

## API and correctness

- [ ] **A1.** Implement idempotent ingest. Then write the test that submits the same batch twice and asserts `rowCount` unchanged. Then kill the process mid-request and retry — what happens?
- [ ] **A2.** Implement keyset pagination. Write a test: insert 100 rows, page through with `limit=10`, concurrently insert 5 new rows at the front, assert no duplicates and no skips.
- [ ] **A3.** Implement per-tenant rate limiting. Test the burst boundary. Then explain what changes if you have three API instances (and why the in-memory version is wrong there).
- [ ] **A4.** Find an N+1 in your own code. Fix it with a join or a dataloader. Measure the query count before/after.
- [ ] **A5.** Write a cross-tenant leak on purpose (forget `where tenant_id`). Write the test that catches it. Then add the guard that makes it impossible to forget.
- [ ] **A6.** Return RFC 9457 problem details for three error classes (validation, auth, conflict). Include a stable `code` and a `requestId`.
- [ ] **A7.** Sign a session cookie correctly: httpOnly, Secure, SameSite, expiry, rotation. Then demonstrate session fixation and fix it.
- [ ] **A8.** Implement refresh-token rotation with reuse detection. Test: reuse an old refresh token → whole family revoked.

## Auth

- [ ] **X1.** Hash passwords with argon2id (or bcrypt with a sane cost). Time three cost settings; pick one with a justification.
- [ ] **X2.** Store API keys the way you'd store passwords. Show that a leaked DB row can't be used as a key.
- [ ] **X3.** Add revocation. Prove that revocation takes effect on the next request, not after a TTL.

## Performance and ops

- [ ] **P1.** Enable `pg_stat_statements`. Find your slowest query. Fix it. Record before/after.
- [ ] **P2.** Load-test ingest with `k6` or `autocannon`. Find the throughput ceiling at 1/2/4 workers. Where is the bottleneck: Node, the pool, or the DB?
- [ ] **P3.** Kill Postgres mid-request. What does the API return? Implement a retry with backoff and a circuit breaker.
- [ ] **P4.** Verify rollup idempotency: run the job twice, assert identical table state.

---

## Cold-recall set (for the gate, week 21)

- Write a keyset-paginated query with a composite index, from scratch, and explain the plan.
- Explain, without notes, the difference between `READ COMMITTED` and `REPEATABLE READ`, with the anomaly each allows.
- Implement idempotent batch insert + its test, in 30 minutes.
- State the five things you check before shipping a migration to a table with traffic.
