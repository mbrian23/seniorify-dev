import type { Plan } from "@seniorify/core";
import Link from "next/link";
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

type PlanStatus = {
  label: string;
  tone: "signed" | "open" | "ready" | "drafting";
};

function deriveStatus(plan: Plan): PlanStatus {
  if (plan.signedAt) return { label: "signed", tone: "signed" };
  const openCount = plan.findings.filter((f) => f.status === "open").length;
  if (openCount > 0) {
    return {
      label: `awaiting defense · ${openCount} open`,
      tone: "open",
    };
  }
  if (plan.findings.length === 0)
    return { label: "drafting", tone: "drafting" };
  return { label: "ready to sign", tone: "ready" };
}

const TONE_CLASS: Record<PlanStatus["tone"], string> = {
  signed: "border-emerald-200 bg-emerald-50 text-emerald-800",
  open: "border-amber-200 bg-amber-50 text-amber-800",
  ready: "border-emerald-200 bg-emerald-50 text-emerald-800",
  drafting: "border-zinc-200 bg-zinc-50 text-zinc-600",
};

const TONE_DOT: Record<PlanStatus["tone"], string> = {
  signed: "bg-emerald-600",
  open: "bg-amber-600",
  ready: "bg-emerald-600",
  drafting: "bg-zinc-400",
};

export default async function WorkPage() {
  const plans = await loadPlans();
  const plan = pickActivePlan(plans);
  const status = plan ? deriveStatus(plan) : null;

  return (
    <main className="min-h-screen w-full bg-white font-sans text-zinc-900">
      <div className="mx-auto max-w-[1280px] px-8 py-10">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-zinc-200 pb-6">
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="flex items-baseline gap-2 font-mono text-sm lowercase text-zinc-900 hover:text-zinc-700"
            >
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full bg-zinc-900"
              />
              seniorify
              <span className="text-zinc-400">/ work</span>
            </Link>
            {status ? (
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-[4px] border px-2 py-0.5 font-mono text-[10px] lowercase ${TONE_CLASS[status.tone]}`}
                >
                  <span
                    aria-hidden
                    className={`inline-block h-1.5 w-1.5 rounded-full ${TONE_DOT[status.tone]}`}
                  />
                  {status.label}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                  {plan?.ticketRef}
                </span>
              </div>
            ) : null}
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-zinc-500">
              live audit · martin brian
            </span>
            <Link
              href="/manager"
              className="inline-flex h-8 items-center rounded-[4px] border border-zinc-200 bg-white px-3 font-mono text-xs lowercase text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900"
            >
              manager view →
            </Link>
          </div>
        </header>

        {plan === null ? (
          <div className="rounded-[4px] border border-dashed border-zinc-300 bg-zinc-50/40 p-12 text-center">
            <p className="text-sm text-zinc-500">No active audits.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
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
