# Project — Console v3

**Goal:** a backend you'd let someone else operate. Auth, tenancy, real SQL, real jobs, real tests,
real failure behaviour.

The Part 1 proxy is now `apps/api`. The library from Part 2 is a workspace package. The UI talks to the
API instead of the raw stream.

---

## Shape

```
apps/
  web/        # console UI (Part 1 + 2 library)
  api/        # ingest + query + auth
  worker/     # rollups, retention, dead letters
packages/
  stream-grid/  # Part 2 library
  shared/       # Event type, API types (generated from OpenAPI or shared TS)
infra/
  docker-compose.yml
  migrations/
```

`docker-compose up` must bring up Postgres, the API, the worker, and a seeded database. One command,
clean clone, no manual steps. If it needs three READMEs, it's not done.

---

## Data model (starting point — change it, but justify it)

```sql
create table tenants (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  created_at  timestamptz not null default now()
);

create table api_keys (
  id           uuid primary key default gen_random_uuid(),
  tenant_id    uuid not null references tenants(id) on delete cascade,
  key_hash     text not null unique,          -- never store the key
  label        text not null,
  last_used_at timestamptz,
  revoked_at   timestamptz
);

create table events (
  id              bigserial primary key,
  tenant_id       uuid not null references tenants(id),
  client_event_id text not null,              -- idempotency key from the client
  source          text not null,
  ts              timestamptz not null,       -- event time
  ingested_at     timestamptz not null default now(),
  kind            text not null,
  actor           text,
  value           double precision,
  attrs           jsonb not null default '{}'::jsonb,
  unique (tenant_id, client_event_id)         -- the idempotency guarantee
);

create index events_tenant_ts_idx on events (tenant_id, ts desc, id desc);
create index events_tenant_kind_ts_idx on events (tenant_id, kind, ts desc);
create index events_attrs_gin on events using gin (attrs jsonb_path_ops);

create table rollups (
  tenant_id     uuid not null references tenants(id),
  bucket_start  timestamptz not null,
  interval      text not null,               -- '1m' | '1h' | '1d'
  kind          text not null,
  count         bigint not null,
  sum_value     double precision not null,
  min_value     double precision,
  max_value     double precision,
  primary key (tenant_id, interval, kind, bucket_start)
);

create table jobs (
  id           bigserial primary key,
  type         text not null,
  payload      jsonb not null,
  status       text not null default 'pending',   -- pending|running|done|dead
  attempts     int not null default 0,
  run_at       timestamptz not null default now(),
  locked_until timestamptz,
  last_error   text
);
create index jobs_ready_idx on jobs (run_at) where status = 'pending';
```

**Questions you must be able to answer about this schema:**

- Why `bigserial` for `events.id` and `uuid` for `tenants.id`?
- Why is the pagination index `(tenant_id, ts desc, id desc)` and not `(tenant_id, ts)`?
- Why `jsonb_path_ops` on the GIN index and what does it *not* support?
- At 100M events, what do you do with `events`? (Answer in Part 4 — partition by time or tenant.)
- Why `unique (tenant_id, client_event_id)` instead of a separate `idempotency_keys` table?
- What does the partial index on `jobs` buy you?

Tune it. Break it. Measure. Then write `SCHEMA.md` with the query behind each index.

---

## API surface

```
POST   /v1/events                 # batch ingest, Idempotency-Key header, api-key auth
GET    /v1/events                 # filters: kind, actor, from, to; keyset cursor; limit
GET    /v1/series                 # kind, interval, from, to → bucketed aggregates
GET    /v1/stream                 # SSE fan-out from ingest (Part 1's proxy, now authenticated)
POST   /v1/auth/session           # email+password → session cookie
POST   /v1/auth/refresh           # rotate refresh token
DELETE /v1/auth/session           # revoke
GET    /healthz /readyz
```

Rules:
- Every response is typed; the client is generated from the OpenAPI spec or shares TS types.
- Errors: RFC 9457 problem details + a stable `code`.
- `limit` is bounded by the server, not trusted from the client.
- Every list endpoint is keyset-paginated. Offset pagination is a deliberate non-goal.

---

## Required features

### R1 — Ingest
- Batch endpoint (1–500 events per request), api-key auth, per-tenant rate limit.
- **Idempotent**: resubmitting the same batch returns success and inserts nothing new.
  Enforced by `unique (tenant_id, client_event_id)` + `on conflict do nothing`, and **tested**.
- Backpressure: if the DB is slow, reject with 429/503 rather than growing an unbounded in-memory queue.
- Validation at the boundary with a schema; reject with a useful error, not a 500.

### R2 — Query
- Keyset pagination over `(ts, id)`. Cursor is opaque and signed/validated.
- Filters compose: kind, actor, time range. Only enable filters you index.
- Time-bucketed series endpoint, served from `rollups` when the range allows, from `events` otherwise.
- `limit` bounded server-side. Response includes a `hasMore` and the next cursor.

### R3 — Auth
- Session auth for the UI: httpOnly, `Secure`, `SameSite=Lax`, rotation on privilege change.
- API keys for ingest: hashed at rest, shown once, revocable, with `last_used_at`.
- Authorisation enforced in a single place that every query goes through — a `withTenant()` helper or a
  repository layer. Not sprinkled `where` clauses.

### R4 — Tenancy
- Every row carries `tenant_id`. Every query goes through the tenant-scoped accessor.
- **Test:** create two tenants, insert rows for each, assert that tenant A's token cannot read tenant B's
  rows — including through filters, cursors, and direct-id lookups. This test is mandatory.

### R5 — Worker
- Rollup job: computes 1m/1h/1d buckets for closed windows. Idempotent (rerun produces the same result).
- Queue table with `FOR UPDATE SKIP LOCKED`, `locked_until`, attempt counting, exponential backoff.
- Dead-letter after N attempts, with the error preserved and a way to replay.
- Retention job deleting old raw events, batched, non-blocking.

### R6 — Migrations
- A real migration tool, versioned, checked in, runnable from a clean DB.
- At least one **expand/contract** migration pair written and documented.
- One index created with `CONCURRENTLY`, with a comment explaining why.

### R7 — Tests
- Integration tests against real Postgres via Testcontainers or Compose.
- Coverage that matters: idempotency, tenancy, pagination boundaries (empty, exactly limit, cursor at end),
  rollup idempotency, auth revocation.
- One test that deliberately causes a failure mid-batch and asserts partial-insert behaviour is defined.

### R8 — Observability
- Structured JSON logs with `requestId`, `tenantId`, `durationMs`, and the query count per request.
- `GET /metrics` (Prometheus or plain JSON) exposing request rate, latency p50/p95, DB pool stats.
- Slow-query log (anything over 100 ms).

### R9 — Delivery
- `docker-compose up` from clean clone: Postgres + migrations + seed + API + worker.
- Seed script generating 30 days of synthetic events for 2 tenants (use Part 1's generator).
- README: clone → run → query, in under 10 steps.

---

## Definition of done

- [ ] Clean clone → `docker-compose up` → working API in one command
- [ ] Double-submit returns 200 and inserts nothing new (test proves it)
- [ ] Cross-tenant read fails (test proves it)
- [ ] `SCHEMA.md`: every table, every index, the query it serves, the plan that shows it used
- [ ] `EXPLAIN` write-up for the three most important queries, before and after tuning
- [ ] Keyset pagination is stable under concurrent inserts (test it)
- [ ] Rollup rerun is idempotent (test it)
- [ ] Auth revocation takes effect on the next request (test it)
- [ ] Migration runs on a table with 1M rows without blocking writes (measure `pg_locks`)
- [ ] OpenAPI spec validates and the typed client compiles

---

## Non-goals

Billing, email, admin UI, OAuth social login (implement OIDC with a library if you want it, in week 17,
but it isn't required), real-time push to end users beyond the SSE endpoint, Kubernetes, CI pipelines
(that's Part 5), load testing at scale (that's Part 4).
