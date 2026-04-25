import type { Plan, Severity } from "@seniorify/core";
import Link from "next/link";
import { SEVERITY_COLORS } from "./severity";
import { relativeTime } from "./relative-time";

export function getRecentSignedPlans(plans: Plan[], limit = 8): Plan[] {
  return plans
    .filter((p) => p.signedAt)
    .slice()
    .sort((a, b) => {
      const at = new Date(a.signedAt ?? a.createdAt).getTime();
      const bt = new Date(b.signedAt ?? b.createdAt).getTime();
      return bt - at;
    })
    .slice(0, limit);
}

function severityCounts(plan: Plan): Record<Severity, number> {
  const counts: Record<Severity, number> = { block: 0, warn: 0, ok: 0 };
  for (const f of plan.findings) counts[f.severity] += 1;
  return counts;
}

function shortId(id: string): string {
  // turn pln_ab12cd34 into PLN-AB12CD34
  const cleaned = id.replace(/^pln[_-]?/i, "");
  return `PLN-${cleaned.slice(0, 8).toUpperCase()}`;
}

function SeverityChip({
  severity,
  count,
}: {
  severity: Severity;
  count: number;
}) {
  if (count === 0) return null;
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-700">
      <span
        aria-hidden
        className="inline-block h-2 w-2 rounded-full"
        style={{ backgroundColor: SEVERITY_COLORS[severity] }}
      />
      {count} {severity}
    </span>
  );
}

export function RecentSignedPlans({ plans }: { plans: Plan[] }) {
  return (
    <div className="rounded-[4px] border border-zinc-200">
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
        <span className="text-sm text-zinc-900 lowercase">
          recent signed plans
        </span>
        <span className="text-xs text-zinc-500 font-mono">
          {plans.length}
        </span>
      </div>
      {plans.length === 0 ? (
        <div className="px-6 py-8 text-sm text-zinc-500">
          no signed plans yet.
        </div>
      ) : (
        <ul>
          {plans.map((p) => {
            const counts = severityCounts(p);
            const ts = p.signedAt ?? p.createdAt;
            return (
              <li
                key={p.id}
                className="grid grid-cols-[140px_1fr_100px_180px_90px_90px] gap-4 items-center px-6 py-4 border-b border-zinc-100 last:border-b-0"
              >
                <Link
                  href={`/manager/plan/${p.id}`}
                  className="font-mono text-xs text-zinc-900 hover:underline underline-offset-4 decoration-zinc-300"
                >
                  {shortId(p.id)}
                </Link>
                <Link
                  href={`/manager/plan/${p.id}`}
                  className="text-sm text-zinc-800 truncate hover:underline underline-offset-4 decoration-zinc-300"
                >
                  {p.summary ?? p.draft.split("\n")[0]}
                </Link>
                <span className="font-mono text-sm text-zinc-700">
                  @{p.authorId}
                </span>
                <span className="flex items-center gap-3">
                  <SeverityChip severity="block" count={counts.block} />
                  <SeverityChip severity="warn" count={counts.warn} />
                  <SeverityChip severity="ok" count={counts.ok} />
                  {counts.block + counts.warn + counts.ok === 0 ? (
                    <span className="font-mono text-xs text-zinc-400">—</span>
                  ) : null}
                </span>
                <span className="font-mono text-xs text-zinc-500">
                  {relativeTime(ts)}
                </span>
                <Link
                  href={`/manager/plan/${p.id}`}
                  className="font-mono text-xs text-zinc-900 underline underline-offset-4 decoration-zinc-300 hover:decoration-zinc-900"
                >
                  open audit
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
