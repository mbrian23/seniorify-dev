import type { Plan } from "@seniorify/core";
import Link from "next/link";
import { SEVERITY_COLORS } from "./severity";
import { relativeTime } from "./relative-time";

export type DecisionRow = {
  planId: string;
  authorId: string;
  finding: {
    title: string;
    severity: string;
    category: string;
    status: "addressed" | "defended" | "overridden";
  };
  defense?: string;
  decidedAt?: string;
};

const STATUS_STYLE: Record<DecisionRow["finding"]["status"], string> = {
  addressed: "border-emerald-200 text-emerald-800 bg-emerald-50",
  defended: "border-amber-200 text-amber-800 bg-amber-50",
  overridden: "border-rose-200 text-rose-800 bg-rose-50",
};

function isDecidedStatus(
  s: string,
): s is "addressed" | "defended" | "overridden" {
  return s === "addressed" || s === "defended" || s === "overridden";
}

function severityColor(severity: string): string {
  if (severity === "block" || severity === "warn" || severity === "ok") {
    return SEVERITY_COLORS[severity];
  }
  return "#A1A1AA";
}

export function getRecentDecisions(plans: Plan[], limit = 10): DecisionRow[] {
  const rows: DecisionRow[] = [];
  for (const p of plans) {
    for (const f of p.findings) {
      if (f.status === "open") continue;
      if (!isDecidedStatus(f.status)) continue;
      rows.push({
        planId: p.id,
        authorId: p.authorId,
        finding: {
          title: f.title,
          severity: f.severity,
          category: f.category,
          status: f.status,
        },
        defense: f.defense,
        decidedAt: f.decidedAt ?? p.signedAt,
      });
    }
  }
  rows.sort((a, b) => {
    const at = a.decidedAt ? new Date(a.decidedAt).getTime() : 0;
    const bt = b.decidedAt ? new Date(b.decidedAt).getTime() : 0;
    return bt - at;
  });
  return rows.slice(0, limit);
}

export function RecentDecisions({ items }: { items: DecisionRow[] }) {
  return (
    <div className="rounded-[4px] border border-zinc-200">
      <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
        <span className="text-sm text-zinc-900 lowercase">recent decisions</span>
        <span className="font-mono text-xs text-zinc-500">{items.length}</span>
      </div>
      {items.length === 0 ? (
        <div className="px-6 py-8 text-sm text-zinc-500">
          no decisions yet — findings will appear here once they leave the open state.
        </div>
      ) : (
        <ul>
          {items.map((row, i) => (
            <li
              key={`${row.planId}-${i}`}
              className="grid grid-cols-[12px_1fr_110px] items-start gap-4 border-b border-zinc-100 px-6 py-4 last:border-b-0"
            >
              <span
                aria-hidden
                className="mt-1.5 inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: severityColor(row.finding.severity) }}
              />
              <div className="flex min-w-0 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-zinc-700">
                    @{row.authorId}
                  </span>
                  <span className="font-mono text-[10px] text-zinc-400">·</span>
                  <span
                    className={`inline-flex shrink-0 items-center rounded-[4px] border px-2 py-0.5 font-mono text-[10px] lowercase ${STATUS_STYLE[row.finding.status]}`}
                  >
                    {row.finding.status}
                  </span>
                  <span className="font-mono text-[10px] text-zinc-400">·</span>
                  <span className="font-mono text-[10px] text-zinc-600 lowercase">
                    {row.finding.category}
                  </span>
                </div>
                <Link
                  href={`/manager/plan/${row.planId}`}
                  className="truncate text-sm font-semibold text-zinc-900 hover:underline"
                >
                  {row.finding.title}
                </Link>
                {row.defense ? (
                  <span className="line-clamp-2 text-xs italic text-zinc-500">
                    {row.defense}
                  </span>
                ) : null}
              </div>
              <span className="text-right font-mono text-xs text-zinc-500">
                {row.decidedAt ? relativeTime(row.decidedAt) : "—"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
