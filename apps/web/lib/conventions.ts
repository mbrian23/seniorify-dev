import type { TeamConventions } from "@seniorify/core";

export const teamConventions: TeamConventions = {
  rules: [
    "Use the internal http client at @acme/http for outbound calls; never axios or fetch directly.",
    "All new endpoints must register with @acme/observability for tracing.",
    "Logger: @acme/log only. No console.log in committed code.",
    "Retries: must use @acme/retry with idempotency-key header.",
    "PII: never log request bodies that may contain PII (compliance).",
  ],
};
