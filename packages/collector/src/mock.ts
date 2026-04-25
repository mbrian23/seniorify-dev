import type { TicketContext } from "@seniorify/core";
import type { TicketSource } from "./index";

const FIXTURES: Record<string, TicketContext> = {
  "acme/worker-svc#412": {
    ref: "acme/worker-svc#412",
    title: "Fix retry storm in upstream call",
    body:
      "When the payments upstream returns 5xx, the worker retries indefinitely and " +
      "eventually saturates the queue. Add a sane retry strategy.",
    source: "mock",
  },
  "acme/api#88": {
    ref: "acme/api#88",
    title: "Add caching to /products endpoint",
    body:
      "Frontend hits /products on every page load. Add caching so we stop hammering " +
      "the catalog DB.",
    source: "mock",
  },
};

export const mockSource: TicketSource = {
  async fetchTicket(ref) {
    const found = FIXTURES[ref];
    if (!found) {
      return {
        ref,
        title: "Unknown ticket",
        body: "No fixture for this ref.",
        source: "mock",
      };
    }
    return found;
  },
};
