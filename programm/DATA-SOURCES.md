# Data sources for the console

The console needs a stream it doesn't control: unpredictable volume, real schemas, real outages.
These are all free and keyless (or have a usable free tier). Verify each before you depend on it —
rate limits and access rules change, and some services are geo-restricted.

---

## Recommended set

| Role | Source | Why |
|---|---|---|
| **Primary live stream** | Wikimedia EventStreams | Genuine SSE, high volume, no key, real-world messy payloads |
| **Secondary snapshots** | USGS earthquakes | Frequent polling, small payloads, easy aggregation demos |
| **Stress test** | Bluesky Jetstream | Much higher volume; use to find where your buffer breaks |
| **Deterministic baseline** | Your own synthetic generator | Reproducible benchmarks, offline development, outage simulation |

Use all four. The generator is not optional — without it you cannot write a benchmark you trust, and you
cannot work when the network is down.

---

## 1. Wikimedia EventStreams (primary)

**Endpoint:** `https://stream.wikimedia.org/v2/stream/recentchange`

- Protocol: **SSE** (`text/event-stream`), no API key.
- Volume: tens to hundreds of events/second, bursty.
- Policy: Wikimedia asks for a **descriptive User-Agent** identifying your tool and contact.
- Payload: JSON per event — wiki, title, user, bot flag, byte delta, timestamp, server URL, type.

**Why it's good for this program**
- It's *actually* server-sent events, so the transport lesson is real, not simulated.
- Volume is high enough that an unbounded array will kill the tab within minutes — which is exactly the
  lesson Part 1 needs to teach.
- The schema has nested, optional, and inconsistent fields. Real data is messy; your parser must cope.

**The lesson hiding in it:** browsers cannot set a custom `User-Agent`, and the endpoint's CORS
behaviour may not permit direct browser consumption. Don't fight it — **write the proxy**. That proxy is
the first version of your backend, and it gives you a place to rate-limit, normalise, buffer, and
reconnect. Frame it as the assignment, not as an obstacle.

Other topics on the same host if you want variety: `/v2/stream/page-create`,
`/v2/stream/revision-create`, `/v2/stream/page-links-change`.

---

## 2. USGS earthquakes (secondary, polling)

**Endpoints** (no key, GeoJSON, updates every minute):
- Last hour: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson`
- Last day: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson`
- Significant, week: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson`

**Use it for:** a second source with a *different* shape (polling, nested GeoJSON, geospatial fields).
Combining two sources is what forces you to design a normalised event schema and an ingestion pipeline
instead of a one-off parser. Magnitude, depth, and time make natural aggregation dimensions.

**Caveats:** poll no faster than once per minute. It's a public scientific service; be polite.

---

## 3. Bluesky Jetstream (stress)

**Endpoint:** `wss://jetstream2.us-east.bsky.network/subscribe`

Example with a filter:
`wss://jetstream2.us-east.bsky.network/subscribe?wantedCollections=app.bsky.feed.post`

- Protocol: **WebSocket**, JSON, no auth.
- Volume: **very high** — thousands per second unfiltered. Filter by collection or you'll drown.
- Free, public, intended for research and tooling.

**Use it for:** the deliberate overload test. Point your ingester at it with no filter and watch what
happens to memory, frame rate, and your drop counter. Then fix it with backpressure, sampling, or
server-side aggregation. This is the single best way to make "backpressure" a felt concept rather than
a word.

**Caveats:** don't leave an unfiltered connection running for hours. Use a filter or run for minutes.

---

## 4. Financial market streams (optional stress / time-series)

All public market data, no key, WebSocket:

| Source | Endpoint | Notes |
|---|---|---|
| Binance | `wss://stream.binance.com:9443/ws/btcusdt@trade` | Very high frequency. Regionally restricted in some countries. |
| Kraken | `wss://ws.kraken.com/v2` | Subscribe message required. Reliable. |
| Coinbase | `wss://ws-feed.exchange.coinbase.com` | Subscribe message required. Reliable. |

**Use for:** numeric time series with high update rates — ideal for windowed aggregation, rolling
averages, downsampling, and candle-style bucketing. Also the best material for Part 2's incremental
aggregation drills, because the numbers are easy to verify by hand.

**Caveats:** check availability from your location before planning around it. Have a fallback.

---

## 5. Other useful sources

| Source | Endpoint | Use |
|---|---|---|
| Open-Meteo | `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m` | Weather time series, no key, generous free tier, historical archive API |
| GitHub events | `https://api.github.com/events` | 60 req/h unauthenticated. DevOps-flavoured event schema |
| Hacker News | `https://hacker-news.firebaseio.com/v0/maxitem.json` | Simple incremental polling (track max id) |
| OpenSky | `https://opensky-network.org/api/states/all` | Aircraft positions; anonymous quota is small, good lesson in rate-limit budgets |
| Public APIs list | `https://github.com/public-apis/public-apis` | When you want a different domain later |

---

## 6. The synthetic generator (build this first)

Before wiring any real source, write `tools/generator`. It is ~150 lines and it pays for itself
immediately.

**Spec:**

```
generator --rate 500 --duration 60 --seed 42 --out fixture.ndjson
generator --rate 500 --replay fixture.ndjson --speed 10
generator --rate 500 --pattern burst --outage-at 30 --outage-for 5
```

Requirements:
- **Deterministic**: seeded PRNG, identical output for identical seed. Non-negotiable for benchmarks.
- **Configurable rate**, measured in events/sec, with burst mode.
- **Fault injection**: connection drops, malformed payloads, duplicate delivery, out-of-order timestamps,
  clock skew, oversized events.
- **Replay**: emit a recorded fixture at N× speed, so integration tests are fast and offline.
- **Same event schema** as the real source, so switching sources changes nothing downstream.

Why it matters: every benchmark in Part 2, every load test in Part 3, and every failure drill in Part 4
depends on being able to reproduce a scenario exactly. If your data source is "whatever the internet
sends right now", you can never prove an improvement.

---

## Event schema (define this in week 3)

Normalise every source into one shape, and freeze it. Something like:

```ts
type Event = {
  id: string;            // stable, source-scoped → dedupe key
  source: 'wikimedia' | 'usgs' | 'bluesky' | 'synthetic';
  ts: number;            // epoch ms, source time
  ingestedAt: number;    // epoch ms, your clock
  kind: string;          // 'edit' | 'quake' | 'post' | ...
  actor?: string;        // user / region / collection
  value?: number;        // byte delta / magnitude / price
  attrs: Record<string, string | number | boolean>;
};
```

The adapter layer maps each source into `Event`. Everything downstream — buffer, index, aggregation,
storage, API — knows only `Event`. This single decision is what makes Part 3 tractable, and it's the
kind of choice that shows up in a design doc later.

---

## Rules of engagement

1. **Check the terms.** Most of these are public-interest services. Cache, don't hammer. Announce yourself
   in a User-Agent where the service asks for it.
2. **Never depend on a live stream for tests.** Fixtures and the generator only.
3. **Assume every source will be unavailable.** Your architecture should still start and show something.
4. **Keep the adapter thin.** When a source dies, you should replace one file, not the app.
