# acme/worker-svc#547 — PII leaking through logger

**Labels:** security, compliance, urgent
**Assignee:** @martin

## Background

Security audit flagged that `src/logger.ts` is forwarding entire request
and response objects to `console.log` via `JSON.stringify`. That means
customer emails, addresses, partial card numbers, and internal payment
payloads are landing in our log aggregator in plain text.

We are *not* on the approved list of services that can store this kind of
data, and our retention policy doesn't redact. Compliance has been pinging
us in #sec-review for two weeks. This needs to land before the next SOC 2
review window.

## Acceptance criteria

- Replace the in-house `log()` wrapper with `@acme/log`, which has built-in
  PII redaction (emails, card PANs, auth tokens, addresses).
- Remove every direct `console.log` in `src/worker.ts` and `src/products.ts`
  (and anywhere else they slipped in) — call `@acme/log` instead.
- Add a CI check that fails the build on `console.log` outside of
  `scripts/`. We have `eslint-plugin-acme` for this; just enable the rule.
- Audit existing log lines for fields that should be redacted even with
  the new logger (e.g., we sometimes log the raw `job` object).

## Files involved

- `src/logger.ts` — the offender
- `src/worker.ts` — has `console.log` calls that include the full job payload
- `src/products.ts` — currently quiet but we should standardize before more
  logging gets added

## Notes

Do not "fix" this by silently dropping logs — we still need observability,
just redacted. Talk to @ops if you're unsure what the redacted shape should
look like; they have a doc.
