import type { Plan } from "@seniorify/core";
import { KpiTile } from "../../components/manager/kpi-tile";
import {
  TeamTable,
  buildTeamRows,
} from "../../components/manager/team-table";
import {
  RecurringFindingsPanel,
  TopicsByAuthorPanel,
  buildRecurringFindings,
  buildTopicsByAuthor,
} from "../../components/manager/recurring-findings";
import {
  RecentSignedPlans,
  getRecentSignedPlans,
} from "../../components/manager/recent-signed-plans";
import {
  RecentDecisions,
  getRecentDecisions,
} from "../../components/manager/recent-decisions";
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
  const topicsByAuthor = buildTopicsByAuthor(plans);
  const recent = getRecentSignedPlans(plans, 8);

  const empty = plans.length === 0;

  return (
    <div className="min-h-screen w-full bg-white font-sans text-zinc-900">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-8 py-12">
        <header className="flex flex-col gap-6 border-b border-zinc-200 pb-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="relative inline-flex h-1.5 w-1.5 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-600" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                  live · last 30 days
                </span>
              </div>
              <h1 className="text-3xl tracking-tight lowercase text-zinc-900">
                engineering quality
              </h1>
              <p className="max-w-xl text-sm text-zinc-500">
                audit trail across your team&apos;s ai-assisted work. every plan
                signed, every defense recorded.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 items-center rounded-[4px] border border-zinc-200 bg-white px-3 font-mono text-xs lowercase text-zinc-600">
                30d
              </span>
              <a
                href="/manager/settings"
                className="inline-flex h-8 items-center rounded-[4px] border border-zinc-200 bg-white px-3 font-mono text-xs lowercase text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900"
              >
                company guidelines →
              </a>
            </div>
          </div>
        </header>

        {empty ? (
          <div className="rounded-[4px] border border-dashed border-zinc-300 bg-zinc-50/40 px-6 py-5 text-sm text-zinc-700">
            no audits yet — invite your team to install the seniorify plugin.
          </div>
        ) : null}

        <section className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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
              direction={openDefenses > 0 ? "down" : "neutral"}
              trend="up-good"
            />
            <KpiTile
              label="signed plans"
              value={String(signed)}
              delta={empty ? "" : "ready to ship"}
              direction="up"
              trend="up-good"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <TeamTable rows={teamRows} />
          </div>
          <div className="lg:col-span-2">
            <RecurringFindingsPanel rows={recurring} />
          </div>
        </section>

        <section>
          <TopicsByAuthorPanel rows={topicsByAuthor} />
        </section>

        <section>
          <RecentSignedPlans plans={recent} />
        </section>

        <section className="flex flex-col gap-3">
          <RecentDecisions items={getRecentDecisions(plans)} />
        </section>
      </div>
    </div>
  );
}
