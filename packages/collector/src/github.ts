import type { TicketContext } from "@seniorify/core";
import type { TicketSource } from "./index";

const REF = /^([\w.-]+)\/([\w.-]+)#(\d+)$/;

/**
 * Parse a ticket ref of the form `owner/repo#123`.
 * Returns null if it doesn't match.
 */
export function parseGithubRef(ref: string) {
  const m = REF.exec(ref);
  if (!m) return null;
  return { owner: m[1], repo: m[2], number: m[3] };
}

/**
 * Fetches a GitHub issue (or PR) as a TicketContext.
 * Uses the unauthenticated public API by default; if process.env.GITHUB_TOKEN
 * is set, requests are authenticated for higher rate limits and private repos.
 */
export const githubSource: TicketSource = {
  async fetchTicket(ref) {
    const parsed = parseGithubRef(ref);
    if (!parsed) {
      throw new Error(`bad github ref: ${ref}`);
    }
    const { owner, repo, number } = parsed;

    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "seniorify",
    };
    const token = process.env.GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;

    const url = `https://api.github.com/repos/${owner}/${repo}/issues/${number}`;
    const res = await fetch(url, { headers });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`github ${res.status} on ${url}: ${text.slice(0, 120)}`);
    }
    const data = (await res.json()) as { title?: string; body?: string };
    return {
      ref,
      title: data.title ?? "(untitled)",
      body: data.body ?? "",
      source: "github",
    };
  },
};
