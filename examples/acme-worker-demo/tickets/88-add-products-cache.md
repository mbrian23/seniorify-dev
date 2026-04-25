# acme/worker-svc#88 — Add caching to /products endpoint

**Labels:** performance, frontend-pain
**Assignee:** unassigned

## Background

The frontend hits `GET /products` on every page load — header dropdown,
homepage grid, search-as-you-type, all uncached. `src/products.ts` makes
a fresh catalog DB call every time. Catalog data changes maybe twice a
day, so we're paying ~30k DB round-trips per minute for data that's
effectively static within a 60-second window.

P95 on `/products` jumped from 80 ms to 340 ms after we onboarded
tenant `bigco-eu`, and the catalog DB CPU is now sitting at 70% during
business hours. This is going to bite us at the next launch.

## Acceptance criteria

- `listProducts` reads from a cache layer first; on miss, falls through to
  the DB and populates the cache.
- TTL is configurable per tenant, default 60 s.
- Cache invalidation hook for the catalog admin tool (we already have an
  internal pub/sub channel `catalog.invalidate`).
- Use the team's `@acme/cache` adapter — do NOT roll your own in-memory map,
  it won't survive across worker pods.
- Use `@acme/http` for any outbound HTTP, not raw axios.

## Files involved

- `src/products.ts` — the endpoint handlers
- `src/http.ts` — currently raw axios; should be `@acme/http`

## Out of scope

- Full CDN cache for the products page — that's #91 and depends on this
  shipping first.
