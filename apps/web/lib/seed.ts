import type { Plan } from "@seniorify/core";
import { plansCount, upsertSeedPlan } from "./store";

function daysAgo(d: number): string {
  return new Date(Date.now() - d * 86_400_000).toISOString();
}

function buildSeed(): Plan[] {
  const plans: Plan[] = [
    // ---------- Ana: 4 plans, 3 signed cleanly with strong defenses, 1 in progress ----------
    {
      id: "pln_a0000001",
      authorId: "ana",
      ticketRef: "acme/worker-svc#412",
      draft:
        "Wrap the payments upstream call with @acme/retry, capped at 3 attempts and exponential backoff.\n" +
        "Add an idempotency-key header derived from the payment intent id.\n" +
        "Emit a 'retry_exhausted' metric via @acme/observability so on-call sees the failure mode.",
      revisions: [],
      findings: [
        {
          id: "f_1",
          severity: "warn",
          category: "edge-case",
          title: "Cap retries does not cover non-idempotent partial failures",
          detail:
            "If the upstream returns 5xx after partially committing, retries can double-charge. Confirm the upstream is fully idempotent under the chosen key.",
          status: "defended",
          defense:
            "Confirmed with payments team: the intent-id idempotency window is 24h, longer than any retry budget. Verified in their staging logs.",
        },
        {
          id: "f_2",
          severity: "ok",
          category: "convention",
          title: "Uses @acme/retry and @acme/observability per team standards",
          detail:
            "Plan correctly uses the internal retry primitive and registers observability. No deviation from team conventions.",
          status: "addressed",
        },
      ],
      summary:
        "Ana wrapped the payments retry storm with @acme/retry plus a 24h idempotency-key window, defended against double-charge risk.",
      signedAt: daysAgo(28),
      signedPlan:
        "Wrap the payments upstream call with @acme/retry, capped at 3 attempts and exponential backoff.\n" +
        "Add an idempotency-key header derived from the payment intent id.\n" +
        "Emit a 'retry_exhausted' metric via @acme/observability so on-call sees the failure mode.",
      createdAt: daysAgo(29),
    },
    {
      id: "pln_a0000002",
      authorId: "ana",
      ticketRef: "acme/api#88",
      draft:
        "Add a Redis cache in front of /products with a 60s TTL and stale-while-revalidate.\n" +
        "Key by querystring hash. Bypass cache when an admin auth header is present.\n" +
        "Track hit/miss ratio in @acme/observability.",
      revisions: [],
      findings: [
        {
          id: "f_1",
          severity: "warn",
          category: "performance",
          title: "Stale-while-revalidate may serve stale prices during pricing pushes",
          detail:
            "Pricing team pushes updates via a topic; SWR window of 60s may briefly show stale prices on product detail. Confirm SLA tolerates this.",
          status: "defended",
          defense:
            "Pricing PM signed off: 60s staleness is within the customer-facing SLA. Will subscribe to pricing.update topic in v2 to invalidate immediately.",
        },
        {
          id: "f_2",
          severity: "ok",
          category: "convention",
          title: "Observability registration present",
          detail: "Hit/miss ratio is wired through @acme/observability per team standard.",
          status: "addressed",
        },
        {
          id: "f_3",
          severity: "warn",
          category: "edge-case",
          title: "Querystring hash collision across locales",
          detail:
            "Two customers in different locales may share a cache entry if locale is read from header, not querystring. Confirm key dimensions.",
          status: "defended",
          defense:
            "Key now includes Accept-Language; verified locally with curl that en-US and de-DE produce different keys.",
        },
      ],
      summary:
        "Ana cached /products with 60s SWR plus locale in the cache key, after pricing PM confirmed the staleness SLA.",
      signedAt: daysAgo(20),
      signedPlan:
        "Add a Redis cache in front of /products with a 60s TTL and stale-while-revalidate.\n" +
        "Key by querystring hash. Bypass cache when an admin auth header is present.\n" +
        "Track hit/miss ratio in @acme/observability.",
      createdAt: daysAgo(21),
    },
    {
      id: "pln_a0000003",
      authorId: "ana",
      ticketRef: "acme/worker-svc#412",
      draft:
        "Refactor retry logic into a shared @acme/retry middleware so other workers can adopt it.\n" +
        "Add structured logs via @acme/log with redacted PII.\n" +
        "Backfill tests for the exponential backoff jitter.",
      revisions: [],
      findings: [
        {
          id: "f_1",
          severity: "ok",
          category: "simplicity",
          title: "Extracts retry primitive cleanly without changing call sites",
          detail:
            "The middleware shape preserves existing call sites and only adds an opt-in wrapper. Low blast radius.",
          status: "addressed",
        },
        {
          id: "f_2",
          severity: "warn",
          category: "compliance",
          title: "Confirm redaction list covers payment metadata",
          detail:
            "Payment metadata can contain partial card BIN. Verify the redactor's allowlist excludes that field before merging.",
          status: "defended",
          defense:
            "Audited with security: redactor is keyed on a denylist that includes all payment.* fields. Added a unit test asserting redaction.",
        },
      ],
      summary:
        "Ana extracted a shared retry middleware and added a redaction unit test that the security team signed off on.",
      signedAt: daysAgo(11),
      signedPlan:
        "Refactor retry logic into a shared @acme/retry middleware so other workers can adopt it.\n" +
        "Add structured logs via @acme/log with redacted PII.\n" +
        "Backfill tests for the exponential backoff jitter.",
      createdAt: daysAgo(12),
    },
    {
      id: "pln_a0000004",
      authorId: "ana",
      ticketRef: "acme/api#88",
      draft:
        "Add a /products/search endpoint backed by an inverted index in Redis.\n" +
        "Reuse the cache key strategy from /products.\n" +
        "Gate behind a feature flag while we benchmark.",
      revisions: [],
      findings: [
        {
          id: "f_1",
          severity: "warn",
          category: "performance",
          title: "Inverted index in Redis may exceed memory budget at peak SKUs",
          detail:
            "Catalog has 1.2M SKUs; an inverted index on title+desc can blow past the current Redis memory cap. Estimate index size before rollout.",
          status: "open",
        },
        {
          id: "f_2",
          severity: "warn",
          category: "ownership",
          title: "Search ranking is owned by the discovery team",
          detail:
            "Ranking signals belong to discovery. Confirm with their lead before duplicating logic in API.",
          status: "open",
        },
      ],
      // not signed — in progress
      createdAt: daysAgo(2),
    },

    // ---------- Pablo: 3 signed plans. Recurring "No idempotency guard" story. ----------
    {
      id: "pln_p0000001",
      authorId: "pablo",
      ticketRef: "acme/worker-svc#501",
      draft:
        "Add a /webhooks/stripe handler that updates the subscription row on payment_succeeded.\n" +
        "Use axios for outbound notifications back to the customer's webhook URL.",
      revisions: [],
      findings: [
        {
          id: "f_1",
          severity: "block",
          category: "edge-case",
          title: "No idempotency guard on Stripe webhook handler",
          detail:
            "Stripe retries webhooks. Without a dedupe on event.id, a single payment can update the subscription twice and double-extend the period.",
          status: "overridden",
          defense:
            "Skipping for now — Stripe rarely retries in practice. Will revisit if it becomes an issue.",
        },
        {
          id: "f_2",
          severity: "warn",
          category: "convention",
          title: "Plan uses axios; team standard is @acme/http",
          detail:
            "Outbound calls in this codebase use @acme/http (auto traces, retries, mTLS). Switch axios to @acme/http.",
          status: "addressed",
        },
      ],
      summary:
        "Pablo shipped the Stripe webhook handler but overrode the idempotency-guard finding, citing low retry frequency.",
      signedAt: daysAgo(24),
      signedPlan:
        "Add a /webhooks/stripe handler that updates the subscription row on payment_succeeded.\n" +
        "Use axios for outbound notifications back to the customer's webhook URL.",
      createdAt: daysAgo(25),
    },
    {
      id: "pln_p0000002",
      authorId: "pablo",
      ticketRef: "acme/api#142",
      draft:
        "Add POST /coupons/redeem. Look up the coupon, mark it consumed, return the discount.\n" +
        "Log the request body for debugging.",
      revisions: [],
      findings: [
        {
          id: "f_1",
          severity: "block",
          category: "edge-case",
          title: "No idempotency guard on coupon redemption",
          detail:
            "If the client retries after a network blip, the same coupon can be redeemed twice. Add idempotency-key on the redeem call and dedupe server-side.",
          status: "addressed",
          defense:
            "Added an idempotency-key header check after a customer hit this in staging. Now stored in a 24h Redis dedupe set.",
        },
        {
          id: "f_2",
          severity: "block",
          category: "compliance",
          title: "No audit log for PII access — request body logging exposes emails",
          detail:
            "Request body can contain customer email and partial address. Logging it raw violates the PII convention. Use @acme/log redaction or log only ids.",
          status: "addressed",
        },
        {
          id: "f_3",
          severity: "warn",
          category: "convention",
          title: "Plan uses console.log; team standard is @acme/log",
          detail: "Replace console.log with @acme/log so logs reach the central pipeline.",
          status: "addressed",
        },
      ],
      summary:
        "Pablo addressed coupon double-redeem only after staging caught it; the same idempotency gap recurred from his Stripe plan.",
      signedAt: daysAgo(14),
      signedPlan:
        "Add POST /coupons/redeem. Look up the coupon, mark it consumed, return the discount.\n" +
        "Log redacted ids only via @acme/log; dedupe by idempotency-key in Redis for 24h.",
      createdAt: daysAgo(16),
    },
    {
      id: "pln_p0000003",
      authorId: "pablo",
      ticketRef: "acme/worker-svc#618",
      draft:
        "Process refund.created events from the queue. Update the order row, send a confirmation email.\n" +
        "Use fetch directly for the email provider.",
      revisions: [],
      findings: [
        {
          id: "f_1",
          severity: "warn",
          category: "convention",
          title: "Plan uses fetch directly; team standard is @acme/http",
          detail:
            "Use @acme/http for outbound so traces and retries are picked up automatically.",
          status: "addressed",
        },
        {
          id: "f_2",
          severity: "ok",
          category: "ownership",
          title: "Refund row writes are correctly scoped to the orders service",
          detail: "No cross-service writes; only the orders row is mutated.",
          status: "addressed",
        },
      ],
      summary:
        "Pablo wired refund events into the orders service and switched to @acme/http; clean ownership scope.",
      signedAt: daysAgo(5),
      signedPlan:
        "Process refund.created events from the queue. Update the order row, send a confirmation email via @acme/http.",
      createdAt: daysAgo(6),
    },

    // ---------- Sofia: 2 signed, decent defenses ----------
    {
      id: "pln_s0000001",
      authorId: "sofia",
      ticketRef: "acme/api#88",
      draft:
        "Add ETag support to /products so the frontend can short-circuit unchanged responses.\n" +
        "Compute the ETag from a hash of the response body.",
      revisions: [],
      findings: [
        {
          id: "f_1",
          severity: "warn",
          category: "performance",
          title: "Hashing the full body on every request is expensive at peak",
          detail:
            "At peak the catalog response is ~200KB. Hashing per-request adds CPU. Consider hashing the upstream version-token instead.",
          status: "defended",
          defense:
            "Catalog DB doesn't expose a version-token yet; opened a follow-up ticket. For now hashing is bounded by the existing cache layer so most requests skip it.",
        },
        {
          id: "f_2",
          severity: "ok",
          category: "convention",
          title: "Observability registration present",
          detail: "ETag hit ratio is reported via @acme/observability.",
          status: "addressed",
        },
      ],
      summary:
        "Sofia added ETag support and defended the per-request hash by leaning on the existing cache to absorb cost.",
      signedAt: daysAgo(18),
      signedPlan:
        "Add ETag support to /products so the frontend can short-circuit unchanged responses.\n" +
        "Compute the ETag from a hash of the response body.",
      createdAt: daysAgo(19),
    },
    {
      id: "pln_s0000002",
      authorId: "sofia",
      ticketRef: "acme/worker-svc#412",
      draft:
        "Add a circuit breaker around the payments upstream so retries pause when the error rate spikes.\n" +
        "Surface breaker state in @acme/observability.",
      revisions: [],
      findings: [
        {
          id: "f_1",
          severity: "warn",
          category: "edge-case",
          title: "Breaker open state needs a fallback path",
          detail:
            "When the breaker is open, callers will see immediate failures. Confirm the upstream queue absorbs this or define a fallback.",
          status: "defended",
          defense:
            "Discussed with the payments team — open state is acceptable; the queue is sized to absorb 5 minutes of failures.",
        },
        {
          id: "f_2",
          severity: "ok",
          category: "compliance",
          title: "No PII in breaker telemetry",
          detail: "Breaker state and error rates only — no request bodies. Compliant with PII rule.",
          status: "addressed",
        },
      ],
      summary:
        "Sofia added a circuit breaker with payments-team-approved open-state fallback, no PII leaked in telemetry.",
      signedAt: daysAgo(8),
      signedPlan:
        "Add a circuit breaker around the payments upstream so retries pause when the error rate spikes.\n" +
        "Surface breaker state in @acme/observability.",
      createdAt: daysAgo(9),
    },
  ];

  return plans;
}

export async function seedIfEmpty(): Promise<void> {
  const count = await plansCount();
  if (count > 0) return;
  const plans = buildSeed();
  for (const plan of plans) {
    await upsertSeedPlan(plan);
  }
}
