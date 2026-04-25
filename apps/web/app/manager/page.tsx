import type { Plan } from "@seniorify/core";
import { KpiTile } from "../../components/manager/kpi-tile";
import {
  TeamTable,
  buildTeamRows,
} from "../../components/manager/team-table";
import {
  RecurringFindingsPanel,
  buildRecurringFindings,
} from "../../components/manager/recurring-findings";
import {
  RecentSignedPlans,
  getRecentSignedPlans,
} from "../../components/manager/recent-signed-plans";
import { getAllPlans } from "@/lib/store";
import { seedIfEmpty } from "@/lib/seed";

export const dynamic = "force-dynamic";

async function fetchPlans(): Promise<Plan[]> {
  await seedIfEmpty();
  try {
    return await getAllPlans();
  } catch {
    return [];
  }
}

export default async function ManagerPage() {
  const plans = await fetchPlans();

  const totalFindings = plans.reduce((acc, p) => acc + p.findings.length, 0);
  const openDefenses = plans.reduce(
    (acc, p) => acc + p.findings.filter((f) => f.status === "open").length,
    0,
  );
  const signed = plans.filter((p) => p.signedAt).length;

  const teamRows = buildTeamRows(plans);
  const recurring = buildRecurringFindings(plans);
  const recent = getRecentSignedPlans(plans, 8);

  const empty = plans.length === 0;

  return (
    <div className="min-h-screen w-full bg-white text-zinc-900 font-sans">
      <div className="mx-auto w-full max-w-[1280px] px-8 py-12 flex flex-col gap-10">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl text-zinc-900 lowercase tracking-tight">
            engineering quality
          </h1>
          <p className="text-sm text-zinc-500">
            audit trail across your team&apos;s ai-assisted work — last 30 days.
          </p>
        </header>

        {empty ? (
          <div className="rounded-[4px] border border-zinc-200 px-6 py-4 text-sm text-zinc-700">
            no audits yet — invite your team to install the seniorify plugin.
          </div>
        ) : null}

        <section className="flex flex-col gap-3">
          <div className="grid grid-cols-4 gap-6">
            <KpiTile
              label="plans audited"
              value={String(plans.length)}
              delta={empty ? "" : "across all juniors"}
            />
            <KpiTile
              label="findings raised"
              value={String(totalFindings)}
              delta={empty ? "" : "across all plans"}
            />
            <KpiTile
              label="open defenses"
              value={String(openDefenses)}
              delta={empty ? "" : "awaiting response"}
            />
            <KpiTile
              label="signed plans"
              value={String(signed)}
              delta={empty ? "" : "ready to ship"}
            />
          </div>

          <div className="grid grid-cols-4 gap-6">
            <KpiTile
              badge="dora"
              label="change failure rate"
              value="6%"
              delta="-3pt vs prev 30d"
            />
            <KpiTile
              badge="dora"
              label="lead time"
              value="2.4 days"
              delta="-0.7d vs prev 30d"
            />
            <KpiTile
              badge="dora"
              label="deploy frequency"
              value="12 / week"
              delta="steady"
            />
            <KpiTile
              badge="dora"
              label="mttr"
              value="42 min"
              delta="-8m vs prev 30d"
            />
          </div>
        </section>

        <section className="grid grid-cols-5 gap-6">
          <div className="col-span-3">
            <TeamTable rows={teamRows} />
          </div>
          <div className="col-span-2">
            <RecurringFindingsPanel rows={recurring} />
          </div>
        </section>

        <section>
          <RecentSignedPlans plans={recent} />
        </section>
      </div>
    </div>
  );
}
