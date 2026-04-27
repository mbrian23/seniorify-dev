import { NextResponse, type NextRequest } from "next/server";
import { evaluateDefense } from "@seniorify/agent";
import { ticketSource } from "@seniorify/collector";
import { getPlan } from "@/lib/store";
import { getTeamConventions } from "@/lib/conventions";
import { isDemoMode } from "@/lib/demo";

type TranscriptTurn = { role: "junior" | "senior"; text: string };

type Body = {
  planId?: string;
  findingId?: string;
  transcript?: TranscriptTurn[];
  latestUtterance?: string;
};

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(req: NextRequest) {
  if (isDemoMode()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Voice evaluation is disabled in this public demo. DM Martin on LinkedIn to see the live pipeline.",
        demo: true,
      },
      { status: 503 },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return bad("invalid json body");
  }

  const { planId, findingId, latestUtterance } = body;
  const transcript = body.transcript ?? [];

  if (!planId) return bad("missing planId");
  if (!findingId) return bad("missing findingId");
  if (!latestUtterance) return bad("missing latestUtterance");

  const plan = await getPlan(planId);
  if (!plan) return bad(`plan not found: ${planId}`, 404);

  const activeFinding = plan.findings.find((f) => f.id === findingId);
  if (!activeFinding) return bad(`finding not found: ${findingId}`, 404);

  const [ticket, conventions] = await Promise.all([
    ticketSource.fetchTicket(plan.ticketRef),
    getTeamConventions(),
  ]);

  const otherFindings = plan.findings
    .filter((f) => f.id !== findingId)
    .map((f) => ({
      title: f.title,
      severity: f.severity,
      status: f.status,
      defense: f.defense,
    }));

  try {
    const result = await evaluateDefense({
      ticket,
      conventions,
      plan: plan.draft,
      activeFinding: {
        id: activeFinding.id,
        severity: activeFinding.severity,
        category: activeFinding.category,
        title: activeFinding.title,
        detail: activeFinding.detail,
      },
      otherFindings,
      transcript,
      latestUtterance,
    });
    return NextResponse.json({ ok: true, result });
  } catch (e) {
    const message = e instanceof Error ? e.message : "evaluate failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
