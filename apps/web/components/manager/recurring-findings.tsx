import type { FindingCategory, Plan } from "@seniorify/core";

export type RecurringFinding = {
  title: string;
  category: string;
  count: number;
  authors: string[];
};

export type TopicGap = {
  category: FindingCategory;
  count: number;
  /** Most recent "learn" line under this category — shown as the lesson the junior keeps brushing past. */
  exampleLearn?: string;
};

export type AuthorTopics = {
  authorId: string;
  topics: TopicGap[];
};

const SEVERITY_WEIGHT: Record<string, number> = {
  block: 3,
  warn: 1,
  ok: 0,
};

/**
 * Per-junior topic gaps. For each author, weights findings by severity
 * (block=3, warn=1, ok=0) within each category. Returns top 3 categories
 * per author so coaching beats firefighting.
 */
export function buildTopicsByAuthor(plans: Plan[]): AuthorTopics[] {
  const byAuthor = new Map<
    string,
    Map<
      FindingCategory,
      { count: number; latestLearnAt: number; exampleLearn?: string }
    >
  >();

  for (const p of plans) {
    const planTime = new Date(p.createdAt).getTime();
    for (const f of p.findings) {
      const weight = SEVERITY_WEIGHT[f.severity] ?? 0;
      if (weight === 0) continue;
      const cats =
        byAuthor.get(p.authorId) ??
        new Map<
          FindingCategory,
          { count: number; latestLearnAt: number; exampleLearn?: string }
        >();
      const cur = cats.get(f.category) ?? {
        count: 0,
        latestLearnAt: 0,
        exampleLearn: undefined,
      };
      cur.count += weight;
      if (f.learn && planTime >= cur.latestLearnAt) {
        cur.latestLearnAt = planTime;
        cur.exampleLearn = f.learn;
      }
      cats.set(f.category, cur);
      byAuthor.set(p.authorId, cats);
    }
  }

  const rows: AuthorTopics[] = [];
  for (const [authorId, cats] of byAuthor.entries()) {
    const topics = Array.from(cats.entries())
      .map(([category, v]) => ({
        category,
        count: v.count,
        exampleLearn: v.exampleLearn,
      }))
      .filter((t) => t.count >= 2)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
    if (topics.length > 0) rows.push({ authorId, topics });
  }
  rows.sort(
    (a, b) =>
      b.topics.reduce((s, t) => s + t.count, 0) -
      a.topics.reduce((s, t) => s + t.count, 0),
  );
  return rows;
}

export function TopicsByAuthorPanel({ rows }: { rows: AuthorTopics[] }) {
  return (
    <div className="rounded-[4px] border border-zinc-200">
      <div className="flex flex-col gap-1 px-6 py-4 border-b border-zinc-200">
        <span className="text-sm text-zinc-900 lowercase">
          topics to coach
        </span>
        <span className="text-xs text-zinc-500">
          per junior — categories where findings keep landing. weighted by
          severity.
        </span>
      </div>
      {rows.length === 0 ? (
        <div className="px-6 py-8 text-sm text-zinc-500">
          no recurring topics yet. nothing to coach.
        </div>
      ) : (
        <ul>
          {rows.map((r) => (
            <li
              key={r.authorId}
              className="flex flex-col gap-3 px-6 py-4 border-b border-zinc-100 last:border-b-0"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-sm text-zinc-900 lowercase">
                  {r.authorId}
                </span>
                <span className="font-mono text-[10px] text-zinc-500">
                  {r.topics.length} topic{r.topics.length === 1 ? "" : "s"}
                </span>
              </div>
              <ul className="flex flex-col gap-2">
                {r.topics.map((t) => (
                  <li
                    key={t.category}
                    className="flex flex-col gap-1 rounded-[4px] border border-zinc-100 bg-zinc-50 px-3 py-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-zinc-900 lowercase">
                        {t.category}
                      </span>
                      <span className="font-mono text-[10px] text-zinc-500">
                        weight {t.count}
                      </span>
                    </div>
                    {t.exampleLearn ? (
                      <span className="text-xs text-zinc-600 leading-relaxed">
                        {t.exampleLearn}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

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
