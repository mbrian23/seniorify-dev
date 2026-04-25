import type { Plan } from "@seniorify/core";
import { FindingsBar } from "./findings-bar";
import { ReadinessMeter } from "./readiness-meter";

export type TeamRow = {
  authorId: string;
  handle: string;
  plansSigned: number;
  findingsPerPlan: number;
  topCategory: string;
  readiness: number;
};

const READINESS: Record<string, number> = {
  martin: 4,
  pablo: 1,
  sofia: 3,
};

const KNOWN_AUTHORS = ["martin", "pablo", "sofia"] as const;

function topCategoryFor(plans: Plan[]): string {
  const counts = new Map<string, number>();
  for (const p of plans) {
    for (const f of p.findings) {
      counts.set(f.category, (counts.get(f.category) ?? 0) + 1);
    }
  }
  if (counts.size === 0) return "—";
  let best = "—";
  let bestN = 0;
  for (const [k, n] of counts) {
    if (n > bestN) {
      best = k;
      bestN = n;
    }
  }
  return best;
}

export function buildTeamRows(plans: Plan[]): TeamRow[] {
  const authors = new Set<string>(KNOWN_AUTHORS);
  for (const p of plans) authors.add(p.authorId);

  const rows: TeamRow[] = [];
  for (const author of authors) {
    const mine = plans.filter((p) => p.authorId === author);
    const plansSigned = mine.filter((p) => p.signedAt).length;
    const totalFindings = mine.reduce((acc, p) => acc + p.findings.length, 0);
    const fpp = mine.length > 0 ? totalFindings / mine.length : 0;
    rows.push({
      authorId: author,
      handle: `@${author}`,
      plansSigned,
      findingsPerPlan: fpp,
      topCategory: topCategoryFor(mine),
      readiness: READINESS[author] ?? 3,
    });
  }
  rows.sort((a, b) => b.readiness - a.readiness);
  return rows;
}

export function TeamTable({ rows }: { rows: TeamRow[] }) {
  const maxFpp = Math.max(1, ...rows.map((r) => r.findingsPerPlan));
  return (
    <div className="rounded-[4px] border border-zinc-200">
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
        <span className="text-sm text-zinc-900 lowercase">team</span>
        <span className="text-xs text-zinc-500 font-mono">
          {rows.length} juniors
        </span>
      </div>
      <div className="grid grid-cols-[1fr_110px_180px_1fr_180px] gap-4 px-6 py-3 border-b border-zinc-200 text-xs text-zinc-500 lowercase">
        <span>junior</span>
        <span className="text-right">plans signed</span>
        <span>findings / plan</span>
        <span>top finding category</span>
        <span>readiness</span>
      </div>
      {rows.length === 0 ? (
        <div className="px-6 py-8 text-sm text-zinc-500">no team data yet.</div>
      ) : (
        rows.map((r) => (
          <div
            key={r.authorId}
            className="grid grid-cols-[1fr_110px_180px_1fr_180px] gap-4 px-6 py-4 border-b border-zinc-100 items-center last:border-b-0"
          >
            <span className="font-mono text-sm text-zinc-900">{r.handle}</span>
            <span className="font-mono text-sm text-zinc-900 text-right tabular-nums">
              {r.plansSigned}
            </span>
            <FindingsBar value={r.findingsPerPlan} max={maxFpp} />
            <span className="font-mono text-sm text-zinc-700 lowercase">
              {r.topCategory}
            </span>
            <ReadinessMeter filled={r.readiness} />
          </div>
        ))
      )}
    </div>
  );
}
