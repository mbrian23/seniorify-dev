import type { TicketContext } from "@seniorify/core";

export interface TicketSource {
  fetchTicket(ref: string): Promise<TicketContext>;
}

export { mockSource } from "./mock";
export { githubSource, parseGithubRef } from "./github";

import { githubSource, parseGithubRef } from "./github";
import { mockSource } from "./mock";

/**
 * Smart ticket resolver.
 *
 * - If the ref is `owner/repo#N`, hit GitHub. If GitHub fails (rate limit,
 *   404, network), fall back to the mock fixtures so the demo is robust.
 * - Otherwise, use mock.
 */
export const ticketSource: TicketSource = {
  async fetchTicket(ref) {
    if (parseGithubRef(ref)) {
      try {
        return await githubSource.fetchTicket(ref);
      } catch (err) {
        const message = err instanceof Error ? err.message : "github error";
        const fallback = await mockSource.fetchTicket(ref);
        return {
          ...fallback,
          body: `${fallback.body}\n\n[seniorify: github fetch failed (${message}); using mock]`,
        };
      }
    }
    return mockSource.fetchTicket(ref);
  },
};
