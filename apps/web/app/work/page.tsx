import type { Plan } from "@seniorify/core";
import { PlanPanel } from "@/components/work/plan-panel";
import { AuditPanel } from "@/components/work/audit-panel";
import { getAllPlans } from "@/lib/store";
import { seedIfEmpty } from "@/lib/seed";

export const dynamic = "force-dynamic";

async function loadPlans(): Promise<Plan[]> {
  // Server component talks to Postgres directly — no HTTP hop needed.
  await seedIfEmpty();
  try {
    return await getAllPlans();
  } catch {
    return [];
  }
}

function pickActivePlan(plans: Plan[]): Plan | null {
  if (plans.length === 0) return null;
  const sorted = [...plans].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const unsigned = sorted.find((p) => !p.signedAt);
  return unsigned ?? sorted[0];
}

export default async function WorkPage() {
  const plans = await loadPlans();
  const plan = pickActivePlan(plans);

  return (
    <main className="min-h-screen w-full bg-white text-zinc-900 font-sans">
      <div className="mx-auto max-w-[1280px] px-8 py-10">
        <header className="mb-10 flex items-baseline justify-between border-b border-zinc-200 pb-6">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-sm text-zinc-900">seniorify</span>
            <span className="text-xs text-zinc-500">/ work</span>
          </div>
          <span className="text-xs text-zinc-500">
            live audit · ana pereira
          </span>
        </header>

        {plan === null ? (
          <div className="rounded-[4px] border border-zinc-200 p-12 text-center">
            <p className="text-sm text-zinc-500">No active audits.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <section className="lg:col-span-1">
              <PlanPanel plan={plan} />
            </section>
            <section className="lg:col-span-2">
              <AuditPanel plan={plan} />
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
