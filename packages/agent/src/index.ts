import { generateObject } from "ai";
import { z } from "zod";
import { Finding, type TeamConventions, type TicketContext } from "@seniorify/core";

const AuditFindingSchema = Finding.omit({
  id: true,
  status: true,
  defense: true,
  decidedAt: true,
}).extend({
  // Required from the model even though it's optional in core (legacy rows).
  learn: z.string(),
});
const AuditSchema = z.object({
  findings: z.array(AuditFindingSchema).max(5),
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
- One-line title. 1-3 sentence detail.

Every finding MUST include a "learn" field — one sentence framed as "Why X and not Y?" that names the concrete alternative the junior didn't pick and the tradeoff their choice makes. The point is to teach the junior the libraries and tradeoffs at play, not to grade them.

Examples of well-formed "learn" lines:
- "Why retries-with-jitter and not idempotency-keys? Jitter spreads load but lets duplicate writes through; idempotency-keys cost a roundtrip but make the operation safe to retry."
- "Why fetch in a Server Component and not useEffect? RSC runs once on the server with no waterfall, but loses client-side reactivity — pick based on whether the data changes after first paint."
- "Why a single transaction and not two requests? One trip preserves consistency under concurrent writes; two trips are simpler but can leave half-applied state."

The "ok" finding's learn line should still name an X-vs-Y tradeoff the junior got right.`;

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

const EvaluateDefenseSchema = z.discriminatedUnion("verdict", [
  z.object({
    verdict: z.literal("probe"),
    followup: z.string(),
  }),
  z.object({
    verdict: z.literal("reject"),
    followup: z.string(),
  }),
  z.object({
    verdict: z.literal("accept"),
    recordedDefense: z.string(),
  }),
]);
export type EvaluateDefenseResult = z.infer<typeof EvaluateDefenseSchema>;

const EVALUATE_SYSTEM_PROMPT = `You are a senior engineer evaluating a junior's spoken defense of a finding on their plan. The junior is in a live voice conversation; you are the brain behind the voice.

You receive: the ticket, the team conventions, the full plan, the active finding under defense (including its "learn" line — the X-vs-Y tradeoff the junior should walk away understanding), the other findings on this plan (with how the junior resolved each), the conversation so far, and the junior's latest spoken utterance.

Decide ONE of:
- "probe" — the defense is incomplete or hand-wavy. Return a single follow-up question framed as "Why X and not Y?" that names a concrete alternative and forces the junior to articulate the tradeoff. Under 25 words.
- "reject" — the defense contradicts the ticket, the conventions, or an earlier defense the junior gave on this plan. Return a follow-up — also "Why X and not Y?" form when possible — that names what's missing or contradictory. Under 25 words.
- "accept" — the defense is specific, addresses the WHY in the finding, AND demonstrates the junior understands the tradeoff named in the finding's "learn" line. Return a "recordedDefense": a normalized one-line written form (under 25 words) suitable for a manager to read later. Strip filler, fix grammar, keep the junior's reasoning.

Rules:
- Every probe and reject MUST be a "Why X and not Y?" question naming a real, plausible alternative — never a vague "can you say more?" or "what about X?". The junior learns by comparing.
- Spoken defenses ramble. Judge the substance, not the polish.
- Cross-check against otherFindings — if the junior defended X earlier and is now contradicting it, reject and name the contradiction.
- Never invent risks the original finding didn't raise. Stay scoped to activeFinding.
- Never accept "we'll handle it later" or "it's fine" without a concrete reason — probe with "Why X and not Y?".
- Never give the junior the answer. You ask; they defend.`;

export async function evaluateDefense(input: {
  ticket: TicketContext;
  conventions: TeamConventions;
  plan: string;
  activeFinding: {
    id: string;
    severity: string;
    category: string;
    title: string;
    detail: string;
  };
  otherFindings: Array<{
    title: string;
    severity: string;
    status: string;
    defense?: string;
  }>;
  transcript: Array<{ role: "junior" | "senior"; text: string }>;
  latestUtterance: string;
}): Promise<EvaluateDefenseResult> {
  const conventionsBlock = input.conventions.rules.length
    ? `Team conventions:\n${input.conventions.rules.map((r) => `- ${r}`).join("\n")}`
    : "Team conventions: (none provided)";

  const otherFindingsBlock = input.otherFindings.length
    ? input.otherFindings
        .map(
          (f) =>
            `- [${f.severity}/${f.status}] ${f.title}${f.defense ? ` — defended: "${f.defense}"` : ""}`,
        )
        .join("\n")
    : "(no other findings on this plan)";

  const transcriptBlock = input.transcript.length
    ? input.transcript.map((t) => `${t.role}: ${t.text}`).join("\n")
    : "(no prior turns)";

  const { object } = await generateObject({
    model: "anthropic/claude-sonnet-4-6",
    schema: EvaluateDefenseSchema,
    system: EVALUATE_SYSTEM_PROMPT,
    prompt: [
      `Ticket: ${input.ticket.ref}`,
      `Title: ${input.ticket.title}`,
      `Body: ${input.ticket.body}`,
      ``,
      conventionsBlock,
      ``,
      `Junior's plan:`,
      input.plan,
      ``,
      `Active finding under defense:`,
      `- id: ${input.activeFinding.id}`,
      `- severity: ${input.activeFinding.severity}`,
      `- category: ${input.activeFinding.category}`,
      `- title: ${input.activeFinding.title}`,
      `- detail: ${input.activeFinding.detail}`,
      ``,
      `Other findings on this plan:`,
      otherFindingsBlock,
      ``,
      `Conversation so far:`,
      transcriptBlock,
      ``,
      `Junior's latest utterance:`,
      input.latestUtterance,
    ].join("\n"),
  });

  return object;
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
