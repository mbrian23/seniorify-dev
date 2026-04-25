import type { Finding } from "@seniorify/core";
import Link from "next/link";
import { getPlan } from "@/lib/store";
import { seedIfEmpty } from "@/lib/seed";
import { SEVERITY_COLORS } from "../../../../components/manager/severity";
import { relativeTime } from "../../../../components/manager/relative-time";

export const dynamic = "force-dynamic";

function shortId(id: string): string {
  const cleaned = id.replace(/^pln[_-]?/i, "");
  return `PLN-${cleaned.slice(0, 8).toUpperCase()}`;
}

const STATUS_STYLE: Record<Finding["status"], string> = {
  open: "border-zinc-300 text-zinc-700 bg-white",
  addressed: "border-emerald-200 text-emerald-800 bg-emerald-50",
  defended: "border-amber-200 text-amber-800 bg-amber-50",
  overridden: "border-rose-200 text-rose-800 bg-rose-50",
};

function StatusBadge({ status }: { status: Finding["status"] }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-[4px] border px-2 py-0.5 font-mono text-[10px] lowercase ${STATUS_STYLE[status]}`}
    >
      {status}
    </span>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen w-full bg-white text-zinc-900 font-sans">
      <div className="mx-auto w-full max-w-[960px] px-8 py-12 flex flex-col gap-6">
        <div className="text-xs text-zinc-500 lowercase font-sans">
          seniorify / manager / plan
        </div>
        <div className="rounded-[4px] border border-zinc-200 px-6 py-8 flex flex-col gap-3">
          <span className="text-sm text-zinc-900 lowercase">no such plan</span>
          <span className="text-xs text-zinc-500">
            this plan id was not found in the audit store.
          </span>
          <Link
            href="/manager"
            className="font-mono text-xs text-zinc-900 underline underline-offset-4 decoration-zinc-300 hover:decoration-zinc-900 w-fit"
          >
            ← /manager
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await seedIfEmpty();
  const { id } = await params;
  const plan = await getPlan(id);

  if (!plan) return <NotFound />;

  const findings = plan.findings;
  const planText = plan.signedPlan ?? plan.draft;

  return (
    <div className="min-h-screen w-full bg-white text-zinc-900 font-sans">
      <div className="mx-auto w-full max-w-[960px] px-8 py-12 flex flex-col gap-8">
        <header className="flex items-start justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="text-xs text-zinc-500 lowercase">
              seniorify / manager / plan /{" "}
              <span className="font-mono text-zinc-900">{shortId(plan.id)}</span>
            </div>
            <h1 className="text-2xl text-zinc-900 lowercase tracking-tight">
              audit trail
            </h1>
          </div>
          <Link
            href="/manager"
            className="rounded-[4px] border border-zinc-200 px-3 py-1.5 font-mono text-xs text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
          >
            ← /manager
          </Link>
        </header>

        <section className="rounded-[4px] border border-zinc-200">
          <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-3">
            <span className="text-sm text-zinc-900 lowercase">summary</span>
          </div>
          <div className="px-6 py-4 text-sm text-zinc-800">
            {plan.summary ? (
              plan.summary
            ) : (
              <span className="text-zinc-400">(no summary)</span>
            )}
          </div>
        </section>

        <section className="rounded-[4px] border border-zinc-200">
          <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-3">
            <span className="text-sm text-zinc-900 lowercase">task</span>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-x-6 gap-y-2 px-6 py-4 text-sm">
            <span className="text-xs text-zinc-500 lowercase">ticket</span>
            <span className="font-mono text-xs text-zinc-900">
              {plan.ticketRef}
            </span>
            <span className="text-xs text-zinc-500 lowercase">submitted by</span>
            <span className="font-mono text-xs text-zinc-900">
              @{plan.authorId}
            </span>
            <span className="text-xs text-zinc-500 lowercase">created</span>
            <span className="font-mono text-xs text-zinc-700">
              {relativeTime(plan.createdAt)}
            </span>
          </div>
        </section>

        <section className="rounded-[4px] border border-zinc-200">
          <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-3">
            <span className="text-sm text-zinc-900 lowercase">plan</span>
            <span className="font-mono text-[10px] text-zinc-500 lowercase">
              {plan.signedPlan ? "signed" : "draft"}
            </span>
          </div>
          <pre className="whitespace-pre-wrap break-words px-6 py-4 font-mono text-xs leading-relaxed text-zinc-800">
            {planText}
          </pre>
        </section>

        <section className="rounded-[4px] border border-zinc-200">
          <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-3">
            <span className="text-sm text-zinc-900 lowercase">findings</span>
            <span className="font-mono text-xs text-zinc-500">
              {findings.length}
            </span>
          </div>
          {findings.length === 0 ? (
            <div className="px-6 py-8 text-sm text-zinc-500">
              no findings raised.
            </div>
          ) : (
            <ul>
              {findings.map((f) => (
                <li
                  key={f.id}
                  className="flex flex-col gap-2 border-b border-zinc-100 px-6 py-4 last:border-b-0"
                >
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: SEVERITY_COLORS[f.severity] }}
                    />
                    <span className="rounded-[4px] border border-zinc-200 px-2 py-0.5 font-mono text-[10px] text-zinc-600 lowercase">
                      {f.category}
                    </span>
                    <StatusBadge status={f.status} />
                    <span className="ml-auto font-mono text-[10px] text-zinc-400 lowercase">
                      {f.id}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-zinc-900">
                    {f.title}
                  </div>
                  <div className="whitespace-pre-wrap text-xs text-zinc-500">
                    {f.detail}
                  </div>
                  {f.defense ? (
                    <div className="mt-1 rounded-[4px] border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs italic text-zinc-700">
                      <div className="whitespace-pre-wrap">{f.defense}</div>
                      <div className="mt-2 not-italic font-mono text-[10px] text-zinc-500 lowercase">
                        decided{" "}
                        {f.decidedAt
                          ? relativeTime(f.decidedAt)
                          : "—"}
                      </div>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="flex items-center justify-between border-t border-zinc-200 pt-4 text-xs text-zinc-500 font-mono lowercase">
          <span>
            {plan.signedAt
              ? `signed at ${new Date(plan.signedAt).toISOString()}`
              : "(unsigned)"}
          </span>
          <span>{shortId(plan.id)}</span>
        </footer>
      </div>
    </div>
  );
}
