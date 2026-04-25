import { NextResponse } from "next/server";
import { getAllPlans } from "@/lib/store";
import { seedIfEmpty } from "@/lib/seed";

export async function GET() {
  await seedIfEmpty();
  const plans = await getAllPlans();
  return NextResponse.json({ plans });
}
