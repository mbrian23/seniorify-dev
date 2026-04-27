// @ts-nocheck
// #412 — payments charge with bounded retries, jittered backoff, idempotency.
//
// Audited plan: pln_4543a6b8 (https://seniorify.dev/work/pln_4543a6b8)

import axios from "axios";
import { createHash } from "node:crypto";
import { sendToDLQ } from "./dlq.js";

const PAYMENTS_URL = process.env.PAYMENTS_URL ?? "https://payments.internal/charge";

const MAX_ATTEMPTS = 5;
const REQUEST_TIMEOUT_MS = 10_000;
const BASE_BACKOFF_MS = 250;
const MAX_BACKOFF_MS = 30_000;
const TOTAL_DEADLINE_MS = 60_000;

interface ChargeJob {
  jobId: string;
  customerId: string;
  amountCents: number;
  currency: string;
}

// Hash over canonical fields so a re-enqueue with mutated amount/currency
// produces a fresh key — protects against silent replay of stale charges.
function idempotencyKeyFor(job: ChargeJob): string {
  const canonical = JSON.stringify({
    jobId: job.jobId,
    customerId: job.customerId,
    amountCents: job.amountCents,
    currency: job.currency,
  });
  return `charge-${createHash("sha256").update(canonical).digest("hex").slice(0, 32)}`;
}

function isRetryable(err: any): boolean {
  if (!err?.response) return true; // network / timeout / DNS
  const status = err.response.status;
  return status === 408 || status === 429 || (status >= 500 && status < 600);
}

function lastStatusOf(err: any): number | "network" | "timeout" {
  if (err?.code === "ECONNABORTED") return "timeout";
  return err?.response?.status ?? "network";
}

function backoffDelayMs(attempt: number): number {
  // Exponential with full jitter: random in [0, min(cap, base * 2^attempt))
  const exp = Math.min(MAX_BACKOFF_MS, BASE_BACKOFF_MS * 2 ** attempt);
  return Math.floor(Math.random() * exp);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function processCharge(job: ChargeJob): Promise<void> {
  console.log("[worker] processing job", job.jobId);

  const idempotencyKey = idempotencyKeyFor(job);
  const deadline = Date.now() + TOTAL_DEADLINE_MS;
  let lastStatus: number | "network" | "timeout" = "network";

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const res = await axios.post(
        PAYMENTS_URL,
        {
          customer: job.customerId,
          amount: job.amountCents,
          currency: job.currency,
        },
        {
          timeout: REQUEST_TIMEOUT_MS,
          headers: { "Idempotency-Key": idempotencyKey },
        },
      );
      console.log("[worker] charge ok", job.jobId, res.status);
      return;
    } catch (err: any) {
      lastStatus = lastStatusOf(err);

      if (!isRetryable(err)) {
        console.log("[worker] charge terminal", { jobId: job.jobId, lastStatus, attempt: attempt + 1 });
        await sendToDLQ({ jobId: job.jobId, reason: "terminal", attempts: attempt + 1, lastStatus });
        return;
      }

      const delay = backoffDelayMs(attempt);
      const wakeAt = Date.now() + delay;
      if (attempt + 1 >= MAX_ATTEMPTS || wakeAt >= deadline) break;

      console.log("[worker] charge retry", { jobId: job.jobId, lastStatus, attempt: attempt + 1, delayMs: delay });
      await sleep(delay);
    }
  }

  console.log("[worker] charge exhausted", { jobId: job.jobId, lastStatus, attempts: MAX_ATTEMPTS });
  await sendToDLQ({ jobId: job.jobId, reason: "exhausted", attempts: MAX_ATTEMPTS, lastStatus });
}
