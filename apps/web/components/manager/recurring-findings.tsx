import type { Plan } from "@seniorify/core";

export type RecurringFinding = {
  title: string;
  category: string;
  count: number;
  authors: string[];
};

export function buildRecurringFindings(plans: Plan[]): RecurringFinding[] {
  const signed = plans.filter((p) => p.signedAt);
  const map = new Map<
    string,
    { title: string; category: string; count: number; authors: Set<string> }
  >();
  for (const p of signed) {
    for (const f of p.findings) {
      const key = f.title;
      const cur = map.get(key);
      if (cur) {
        cur.count += 1;
        cur.authors.add(p.authorId);
      } else {
        map.set(key, {
          title: f.title,
          category: f.category,
          count: 1,
          authors: new Set([p.authorId]),
        });
      }
    }
  }
  const rows: RecurringFinding[] = [];
  for (const v of map.values()) {
    if (v.count > 1) {
      rows.push({
        title: v.title,
        category: v.category,
        count: v.count,
        authors: Array.from(v.authors),
      });
    }
  }
  rows.sort((a, b) => b.count - a.count);
  return rows;
}

export function RecurringFindingsPanel({
  rows,
}: {
  rows: RecurringFinding[];
}) {
  return (
    <div className="rounded-[4px] border border-zinc-200">
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
        <span className="text-sm text-zinc-900 lowercase">
          recurring findings
        </span>
        <span className="text-xs text-zinc-500 font-mono">
          {rows.length}
        </span>
      </div>
      {rows.length === 0 ? (
        <div className="px-6 py-8 text-sm text-zinc-500">
          nothing recurring. clean.
        </div>
      ) : (
        <ul>
          {rows.map((r) => {
            const authorList = r.authors.map((a) => a).join(", ");
            return (
              <li
                key={r.title}
                className="flex flex-col gap-1.5 px-6 py-4 border-b border-zinc-100 last:border-b-0"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm text-zinc-900">{r.title}</span>
                  <span className="shrink-0 rounded-[4px] border border-zinc-200 px-2 py-0.5 font-mono text-[10px] text-zinc-600 lowercase">
                    {r.category}
                  </span>
                </div>
                <span className="text-xs text-zinc-500 font-mono">
                  {authorList} · {r.count} times in 30 days
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
