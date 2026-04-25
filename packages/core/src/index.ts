import { z } from "zod";

export const Severity = z.enum(["block", "warn", "ok"]);
export type Severity = z.infer<typeof Severity>;

export const FindingCategory = z.enum([
  "edge-case",
  "security",
  "performance",
  "simplicity",
  "ownership",
]);
export type FindingCategory = z.infer<typeof FindingCategory>;

export const Finding = z.object({
  id: z.string(),
  severity: Severity,
  category: FindingCategory,
  title: z.string(),
  detail: z.string(),
  status: z.enum(["open", "addressed", "defended"]).default("open"),
  defense: z.string().optional(),
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
  createdAt: z.string(),
});
export type Plan = z.infer<typeof Plan>;

export const TicketContext = z.object({
  ref: z.string(),
  title: z.string(),
  body: z.string(),
  source: z.enum(["github", "jira", "linear", "mock"]),
});
export type TicketContext = z.infer<typeof TicketContext>;
