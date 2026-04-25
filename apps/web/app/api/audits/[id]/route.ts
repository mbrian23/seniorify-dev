import { NextResponse, type NextRequest } from "next/server";
import { getPlan } from "@/lib/store";
import { seedIfEmpty } from "@/lib/seed";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await seedIfEmpty();
  const { id } = await params;
  const plan = await getPlan(id);
  if (!plan) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json(plan);
}
