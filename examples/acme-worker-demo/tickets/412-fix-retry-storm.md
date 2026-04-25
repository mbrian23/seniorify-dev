# acme/worker-svc#412 — Fix retry storm in upstream call

**Labels:** bug, reliability, on-call
**Assignee:** @martin

## Background

The payments worker (`src/worker.ts`) retries the upstream `POST /charge`
call up to 10 times with a fixed 200 ms sleep between attempts, no jitter,
no exponential backoff, no idempotency key, and no request timeout. When
payments-svc has a partial outage, our worker pile-drives it: every job in
the queue retries 10× in ~2 seconds, which keeps the upstream pinned and
makes recovery slower for everyone.

We've been paged on this twice in the last week. PagerDuty incident #4471
and #4488 both root-caused to this loop.

We also have no way to know which charges actually went through — without
an idempotency key, retrying after a network blip can double-charge a
customer.

## Acceptance criteria

- Retries use exponential backoff with jitter (cap somewhere reasonable, e.g. 30 s).
- Each charge request carries a stable idempotency key so retries are safe.
- Per-request timeout is set (current default is "wait forever").
- Max attempts is bounded and logged when exhausted, with enough context to
  triage from the dead-letter queue.
- Failed jobs route to the existing DLQ, not just `throw`.

## Files involved

- `src/worker.ts` — the retry loop lives here
- `src/http.ts` — HTTP client wrapper (note: team standard is `@acme/http`,
  this still uses raw axios)

## Notes

Whoever picks this up: please don't just bump the sleep to 2 seconds and
call it a day. We need real backoff + idempotency, not a band-aid.
