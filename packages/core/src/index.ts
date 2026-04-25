import { z } from "zod";

export const Severity = z.enum(["block", "warn", "ok"]);
export type Severity = z.infer<typeof Severity>;

export const FindingCategory = z.enum([
  "edge-case",
  "security",
  "performance",
  "simplicity",
  "ownership",
  "convention",
  "compliance",
]);
export type FindingCategory = z.infer<typeof FindingCategory>;

export const Finding = z.object({
  id: z.string(),
  severity: Severity,
  category: FindingCategory,
  title: z.string(),
  detail: z.string(),
  /**
   * One-sentence "X vs Y" tradeoff the junior should take away. Names the
   * alternative they didn't pick and what their choice optimized for.
   * Optional for legacy rows; new findings always include it.
   */
  learn: z.string().optional(),
  status: z.enum(["open", "addressed", "defended", "overridden"]).default("open"),
  defense: z.string().optional(),
  decidedAt: z.string().optional(),
});
export type Finding = z.infer<typeof Finding>;

export const Plan = z.object({
  id: z.string(),
  authorId: z.string(),
  ticketRef: z.string(),
  draft: z.string(),
  revisions: z.array(z.object({ text: z.string(), at: z.string() })).default([]),
  findings: z.array(Finding).default([]),
  signedAt: z.string().optional(),
  signedPlan: z.string().optional(),
  /**
   * One-sentence plain-English summary, generated at sign time.
   * Powers the manager's scannable dashboard and weekly digest.
   */
  summary: z.string().optional(),
  createdAt: z.string(),
});
export type Plan = z.infer<typeof Plan>;

export const TeamConventions = z.object({
  rules: z.array(z.string()).default([]),
});
export type TeamConventions = z.infer<typeof TeamConventions>;

export const TicketContext = z.object({
  ref: z.string(),
  title: z.string(),
  body: z.string(),
  source: z.enum(["github", "jira", "linear", "mock"]),
});
export type TicketContext = z.infer<typeof TicketContext>;
