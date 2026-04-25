import { notFound } from "next/navigation";
import { PlanPanel } from "@/components/work/plan-panel";
import { AuditPanel } from "@/components/work/audit-panel";
import { getPlan } from "@/lib/store";
import { seedIfEmpty } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function WorkPlanPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  await seedIfEmpty();
  const { planId } = await params;
  const plan = await getPlan(planId);
  if (!plan) notFound();

  return (
    <main className="min-h-screen w-full bg-white text-zinc-900 font-sans">
      <div className="mx-auto max-w-[1280px] px-8 py-10">
        <header className="mb-10 flex items-baseline justify-between border-b border-zinc-200 pb-6">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-sm text-zinc-900">seniorify</span>
            <span className="text-xs text-zinc-500">/ work / {plan.id}</span>
          </div>
          <span className="text-xs text-zinc-500">live audit</span>
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
