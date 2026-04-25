// @ts-nocheck
// TODO #412 — fix retry storm; we keep saturating the queue.
//
// On-call paged us twice last week because this worker hammers the payments
// upstream when it flakes. Need to make this retry sanely. -mb

import axios from "axios";

const PAYMENTS_URL = process.env.PAYMENTS_URL ?? "https://payments.internal/charge";
const MAX_RETRIES = 10;

interface ChargeJob {
  jobId: string;
  customerId: string;
  amountCents: number;
  currency: string;
}

export async function processCharge(job: ChargeJob): Promise<void> {
  console.log("[worker] processing job", job);

  let attempt = 0;
  while (attempt < MAX_RETRIES) {
    try {
      const res = await axios.post(PAYMENTS_URL, {
        customer: job.customerId,
        amount: job.amountCents,
        currency: job.currency,
      });

      console.log("[worker] charge ok", job.jobId, res.data);
      return;
    } catch (err: any) {
      attempt += 1;
      console.log("[worker] charge failed, retrying", job.jobId, err?.message);
      // tight retry — sleep a bit then try again
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  console.log("[worker] giving up after", MAX_RETRIES, "attempts", job);
  throw new Error(`charge failed for job ${job.jobId}`);
}
