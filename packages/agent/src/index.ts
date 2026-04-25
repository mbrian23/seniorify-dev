import { generateObject } from "ai";
import { z } from "zod";
import { Finding, type TeamConventions, type TicketContext } from "@seniorify/core";

const AuditSchema = z.object({
  findings: z.array(Finding.omit({ id: true, status: true })).max(5),
});

const SYSTEM_PROMPT = `You are a senior engineer auditing a junior's plan. Help, audit, and surface gaps. Never gate, never block, never refuse.

Given the linked ticket, the junior's plan, and the team's conventions, output an array of findings.
Categories: edge-case, security, performance, simplicity, ownership, convention, compliance.
Severity: block / warn / ok.

Rules:
- Be specific to THIS ticket. No generic best-practice noise.
- Max 5 findings. Prefer the most important ones.
- If the team conventions are provided, flag any plan element that deviates from them as category="convention".
- Compliance findings (audit-trail, AI-governance, regulated-data handling) belong in category="compliance".
- If the plan is solid, return one "ok" finding affirming the strongest aspect.
- Never tell the junior what to do — describe what's missing or risky, and the WHY it matters in one short clause. Let them decide.
- One-line title. 1-3 sentence detail.`;

export async function auditPlan(input: {
  ticket: TicketContext;
  plan: string;
  conventions?: TeamConventions;
}) {
  const conventionsBlock = input.conventions?.rules.length
    ? `Team conventions:\n${input.conventions.rules.map((r) => `- ${r}`).join("\n")}\n\n`
    : "";

  const { object } = await generateObject({
    model: "anthropic/claude-sonnet-4-6",
    schema: AuditSchema,
    system: SYSTEM_PROMPT,
    prompt: [
      `Ticket: ${input.ticket.ref}`,
      `Title: ${input.ticket.title}`,
      `Body: ${input.ticket.body}`,
      ``,
      conventionsBlock,
      `Junior's plan:`,
      input.plan,
    ].join("\n"),
  });
  return object.findings.map((f, i) => ({
    ...f,
    id: `f_${i + 1}`,
    status: "open" as const,
  }));
}

/**
 * Plain-English one-sentence summary of a signed plan.
 * Powers the manager's scannable dashboard.
 */
export async function summarizePlanForManager(input: {
  ticket: TicketContext;
  plan: string;
  findings: { title: string; severity: string; status: string; defense?: string }[];
  authorName: string;
}) {
  const { object } = await generateObject({
    model: "anthropic/claude-sonnet-4-6",
    schema: z.object({ summary: z.string() }),
    system:
      "Write ONE plain-English sentence summarizing what the junior decided and how it lands. " +
      "Audience: a busy engineering manager skimming a dashboard. " +
      "Mention the strongest non-obvious decision the junior made. " +
      "No jargon, no hedging, under 25 words.",
    prompt: [
      `Junior: ${input.authorName}`,
      `Ticket: ${input.ticket.title}`,
      `Plan: ${input.plan}`,
      `Findings:`,
      ...input.findings.map(
        (f) => `- [${f.severity}/${f.status}] ${f.title}${f.defense ? ` — defended: "${f.defense}"` : ""}`,
      ),
    ].join("\n"),
  });
  return object.summary;
}

export async function generateDefenseQuestion(input: {
  ticket: TicketContext;
  finding: { title: string; detail: string };
}) {
  const { object } = await generateObject({
    model: "anthropic/claude-sonnet-4-6",
    schema: z.object({ question: z.string() }),
    system:
      "You are a senior engineer running a 'defend your demo' session. " +
      "Write ONE pointed question that tests whether the junior understands the risk in the finding. " +
      "No hints, no leading questions. Plain English. Under 25 words.",
    prompt: [
      `Ticket: ${input.ticket.title}`,
      `Finding: ${input.finding.title}`,
      `Detail: ${input.finding.detail}`,
    ].join("\n"),
  });
  return object.question;
}
