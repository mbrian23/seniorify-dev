import { generateObject } from "ai";
import { z } from "zod";
import { Finding, type TicketContext } from "@seniorify/core";

const AuditSchema = z.object({
  findings: z.array(Finding.omit({ id: true, status: true })).max(5),
});

const SYSTEM_PROMPT = `You are a senior engineer auditing a junior's plan. You do NOT write the plan for them. You do NOT give them code. You audit.

Given a plan and the linked ticket, output an array of findings. Categories: edge-case, security, performance, simplicity, ownership. Severity: block / warn / ok.

Rules:
- Be specific to THIS ticket. No generic best-practice noise.
- Max 5 findings. Prefer the most important ones.
- If the plan is solid, return one "ok" finding affirming the strongest aspect.
- Never tell the junior what to do — describe what's missing or risky and let them decide.
- One-line title. 1-3 sentence detail.`;

export async function auditPlan(input: {
  ticket: TicketContext;
  plan: string;
}) {
  const { object } = await generateObject({
    model: "anthropic/claude-sonnet-4-6",
    schema: AuditSchema,
    system: SYSTEM_PROMPT,
    prompt: [
      `Ticket: ${input.ticket.ref}`,
      `Title: ${input.ticket.title}`,
      `Body: ${input.ticket.body}`,
      ``,
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
