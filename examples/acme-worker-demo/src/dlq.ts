// @ts-nocheck
// Dead-letter queue seam. Real impl pushes to the platform DLQ topic;
// for now we log a structured line so on-call can grep from the worker logs.
//
// PII rule: never include customerId or payment payload fields here.

import { logger } from "./logger.js";

export interface DLQEntry {
  jobId: string;
  reason: "exhausted" | "terminal";
  attempts: number;
  lastStatus: number | "network" | "timeout";
}

export async function sendToDLQ(entry: DLQEntry): Promise<void> {
  logger.log("[dlq] charge job parked", entry);
}
