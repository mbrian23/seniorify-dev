import { NextResponse, type NextRequest } from "next/server";
import { getTeamConventions, setTeamConventions } from "@/lib/conventions";

export const dynamic = "force-dynamic";

export async function GET() {
  const conventions = await getTeamConventions();
  return NextResponse.json({ ok: true, ...conventions });
}

export async function PUT(req: NextRequest) {
  let body: { rules?: unknown };
  try {
    body = (await req.json()) as { rules?: unknown };
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid json" },
      { status: 400 },
    );
  }
  if (!Array.isArray(body.rules)) {
    return NextResponse.json(
      { ok: false, error: "rules must be a string array" },
      { status: 400 },
    );
  }
  const rules = body.rules.filter(
    (r): r is string => typeof r === "string" && r.trim().length > 0,
  );
  const updated = await setTeamConventions(rules);
  return NextResponse.json({ ok: true, ...updated });
}
