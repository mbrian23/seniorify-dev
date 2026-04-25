import { NextResponse, type NextRequest } from "next/server";
import { auditPlan, summarizePlanForManager } from "@seniorify/agent";
import { mockSource } from "@seniorify/collector";
import {
  addFindings,
  createPlan,
  getPlan,
  signPlan,
  updateFinding,
} from "@/lib/store";
import { seedIfEmpty } from "@/lib/seed";
import { teamConventions } from "@/lib/conventions";

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

  if (!tool) return bad("missing tool");

  try {
    switch (tool) {
      case "submit_plan": {
        const authorId = getString(params, "authorId");
        const ticketRef = getString(params, "ticketRef");
        const planText = getString(params, "plan");
        const ticket = await mockSource.fetchTicket(ticketRef);
        const findings = await auditPlan({
          ticket,
          plan: planText,
          conventions: teamConventions,
        });
        const created = await createPlan({
          authorId,
          ticketRef,
          draft: planText,
        });
        const updated = await addFindings(created.id, findings);
        return NextResponse.json({
          ok: true,
          result: { planId: updated.id, findings: updated.findings },
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

      case "sign_plan": {
        const planId = getString(params, "planId");
        const authorName = getString(params, "authorName");
        const plan = await getPlan(planId);
        if (!plan) return bad(`plan not found: ${planId}`, 404);
        const ticket = await mockSource.fetchTicket(plan.ticketRef);
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
        return NextResponse.json({ ok: true, result: plan });
      }

      default:
        return bad("unknown tool");
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
