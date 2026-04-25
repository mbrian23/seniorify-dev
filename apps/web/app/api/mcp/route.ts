import { NextResponse, type NextRequest } from "next/server";
import { after } from "next/server";
import { auditPlan, summarizePlanForManager } from "@seniorify/agent";
import { ticketSource } from "@seniorify/collector";
import {
  addFindings,
  createPlan,
  getPlan,
  setStatus,
  signPlan,
  updateFinding,
} from "@/lib/store";
import { seedIfEmpty } from "@/lib/seed";
import { getTeamConventions } from "@/lib/conventions";

const FINDING_STATUS = new Set(["open", "addressed", "defended", "overridden"]);

/**
 * Runs the audit pipeline for a plan in the background after the HTTP
 * response has been sent. Vercel keeps the function alive until this
 * resolves, so the LLM call doesn't block the MCP tool's reply.
 */
async function runAudit(planId: string, ticketRef: string, planText: string) {
  try {
    const [ticket, conventions] = await Promise.all([
      ticketSource.fetchTicket(ticketRef),
      getTeamConventions(),
    ]);
    const findings = await auditPlan({
      ticket,
      plan: planText,
      conventions,
    });
    await addFindings(planId, findings);
  } catch (err) {
    const message = err instanceof Error ? err.message : "audit failed";
    await setStatus(planId, `error: ${message.slice(0, 200)}`);
  }
}

type McpBody = {
  tool?: string;
  params?: Record<string, unknown>;
};

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function getString(params: Record<string, unknown>, key: string): string {
  const v = params[key];
  if (typeof v !== "string" || v.length === 0) {
    throw new Error(`missing or invalid param: ${key}`);
  }
  return v;
}

export async function POST(req: NextRequest) {
  await seedIfEmpty();

  let body: McpBody;
  try {
    body = (await req.json()) as McpBody;
  } catch {
    return bad("invalid json body");
  }

  const tool = body.tool;
  const params = body.params ?? {};
  const origin = new URL(req.url).origin;
  const auditUrlFor = (planId: string) => `${origin}/work/${planId}`;

  if (!tool) return bad("missing tool");

  try {
    switch (tool) {
      case "submit_plan": {
        const authorId = getString(params, "authorId");
        const ticketRef = getString(params, "ticketRef");
        const planText = getString(params, "plan");
        const created = await createPlan({
          authorId,
          ticketRef,
          draft: planText,
        });
        // Decoupled: respond now, run the audit after.
        after(runAudit(created.id, ticketRef, planText));
        return NextResponse.json({
          ok: true,
          result: {
            planId: created.id,
            status: "auditing",
            auditUrl: auditUrlFor(created.id),
          },
        });
      }

      case "defend": {
        const planId = getString(params, "planId");
        const findingId = getString(params, "findingId");
        const defense = getString(params, "defense");
        const updated = await updateFinding(planId, findingId, {
          status: "defended",
          defense,
        });
        return NextResponse.json({ ok: true, result: updated });
      }

      case "update_finding": {
        const planId = getString(params, "planId");
        const findingId = getString(params, "findingId");
        const status = getString(params, "status");
        if (!FINDING_STATUS.has(status)) {
          return bad(`invalid status: ${status}`);
        }
        const defense = typeof params.defense === "string" ? params.defense : undefined;
        const updated = await updateFinding(planId, findingId, {
          status: status as "open" | "addressed" | "defended" | "overridden",
          defense,
        });
        return NextResponse.json({ ok: true, result: updated });
      }

      case "sign_plan": {
        const planId = getString(params, "planId");
        const authorName = getString(params, "authorName");
        const plan = await getPlan(planId);
        if (!plan) return bad(`plan not found: ${planId}`, 404);
        const ticket = await ticketSource.fetchTicket(plan.ticketRef);
        const summary = await summarizePlanForManager({
          ticket,
          plan: plan.draft,
          findings: plan.findings.map((f) => ({
            title: f.title,
            severity: f.severity,
            status: f.status,
            defense: f.defense,
          })),
          authorName,
        });
        const signed = await signPlan(planId, summary);
        return NextResponse.json({ ok: true, result: signed });
      }

      case "get_audit": {
        const planId = getString(params, "planId");
        const plan = await getPlan(planId);
        if (!plan) return bad(`plan not found: ${planId}`, 404);
        return NextResponse.json({
          ok: true,
          result: { ...plan, auditUrl: auditUrlFor(planId) },
        });
      }

      default:
        return bad("unknown tool");
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
