import Link from "next/link";
import { notFound } from "next/navigation";
import type { Plan } from "@seniorify/core";
import { PlanPanel } from "@/components/work/plan-panel";
import { AuditPanel } from "@/components/work/audit-panel";
import { getPlan } from "@/lib/store";
import { seedIfEmpty } from "@/lib/seed";

export const dynamic = "force-dynamic";

function headerStatus(plan: Plan): { label: string; color: string } {
  if (plan.signedAt) return { label: "signed", color: "#15803D" };
  const open = plan.findings.filter((f) => f.status === "open").length;
  if (plan.findings.length === 0)
    return { label: "auditing", color: "#A1A1AA" };
  if (open > 0)
    return {
      label: `${open} open · awaiting defense`,
      color: "#B45309",
    };
  return { label: "ready to sign", color: "#15803D" };
}

export default async function WorkPlanPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  await seedIfEmpty();
  const { planId } = await params;
  const plan = await getPlan(planId);
  if (!plan) notFound();

  const status = headerStatus(plan);

  return (
    <main className="min-h-screen w-full bg-white text-zinc-900 font-sans">
      <div className="mx-auto max-w-[1280px] px-8 py-10">
        <header className="mb-10 flex items-center justify-between gap-6 border-b border-zinc-200 pb-6">
          <div className="flex items-baseline gap-3 min-w-0">
            <Link
              href="/manager"
              className="font-mono text-sm text-zinc-900 hover:text-zinc-600"
            >
              seniorify
            </Link>
            <span className="text-xs text-zinc-400">/ work /</span>
            <span className="font-mono text-sm text-zinc-700 truncate">
              {plan.ticketRef}
            </span>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: status.color }}
              />
              <span className="font-mono text-[11px] uppercase tracking-wide text-zinc-600">
                {status.label}
              </span>
            </div>
            <Link
              href="/manager"
              className="rounded-[4px] border border-zinc-200 px-3 py-1.5 font-mono text-xs text-zinc-700 hover:bg-zinc-50"
            >
              ← manager
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <section className="lg:col-span-1">
            <PlanPanel plan={plan} />
          </section>
          <section className="lg:col-span-2">
            <AuditPanel plan={plan} />
          </section>
        </div>
      </div>
    </main>
  );
}
