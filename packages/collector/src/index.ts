import type { TicketContext } from "@seniorify/core";

export interface TicketSource {
  fetchTicket(ref: string): Promise<TicketContext>;
}

export { mockSource } from "./mock";
// export { githubSource } from "./github"; // TODO: wire GitHub MCP
// export { jiraSource } from "./jira";     // TODO: wire Jira REST
