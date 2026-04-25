import type { Plan } from "@seniorify/core";
import { relativeTime } from "./relative-time";

const FALLBACK_CONVENTIONS = [
  "Use @acme/http for outbound calls; never axios or fetch directly.",
  "Retries must use @acme/retry with idempotency-key header.",
  "Logger: @acme/log only. No console.log in committed code.",
];

type Status = {
  label: string;
  color: string;
};

function deriveStatus(plan: Plan): Status {
  if (plan.signedAt) return { label: "signed", color: "#15803D" };
  const hasOpen = plan.findings.some((f) => f.status === "open");
  if (hasOpen) return { label: "awaiting defense", color: "#B45309" };
  if (plan.findings.length === 0) return { label: "drafting", color: "#A1A1AA" };
  return { label: "ready to sign", color: "#15803D" };
}

export function PlanPanel({
  plan,
  conventions,
}: {
  plan: Plan;
  conventions?: string[];
}) {
  const status = deriveStatus(plan);
  const rules = (conventions && conventions.length > 0
    ? conventions
    : FALLBACK_CONVENTIONS
  ).slice(0, 3);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-zinc-500">task</span>
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-sm text-zinc-900">
            {plan.ticketRef}
          </span>
          <span className="text-sm text-zinc-700">
            {plan.draft.split("\n")[0].slice(0, 80) || plan.ticketRef}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-zinc-500">submitted by</span>
        <span className="text-sm text-zinc-900">
          ana{" "}
          <span className="font-mono text-zinc-500">
            · {relativeTime(plan.createdAt)}
          </span>
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-zinc-500">plan</span>
        <div className="rounded-[4px] border border-zinc-200 p-4">
          <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-6 text-zinc-800">
            {plan.draft}
          </pre>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-zinc-500">status</span>
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-block rounded-full"
            style={{
              width: 8,
              height: 8,
              backgroundColor: status.color,
            }}
          />
          <span className="text-sm text-zinc-900">{status.label}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-zinc-500">conventions in scope</span>
        <ul className="flex flex-col gap-1.5">
          {rules.map((rule, i) => (
            <li
              key={i}
              className="flex gap-2 text-sm text-zinc-500 leading-relaxed"
            >
              <span aria-hidden className="shrink-0">
                ·
              </span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
