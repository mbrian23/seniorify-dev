"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import type { Finding, Plan, Severity } from "@seniorify/core";
import { SeverityDot } from "./severity-dot";

type DefendState = {
  findingId: string;
  text: string;
};

const SEVERITY_RANK: Record<Severity, number> = {
  block: 0,
  warn: 1,
  ok: 2,
};

async function callMcp(
  tool: string,
  params: Record<string, unknown>,
): Promise<void> {
  const res = await fetch("/api/mcp", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ tool, params }),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`mcp ${tool} failed: ${res.status} ${text}`);
  }
}

export function AuditPanel({ plan }: { plan: Plan }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [defending, setDefending] = useState<DefendState | null>(null);
  const [busyFindingId, setBusyFindingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [demoDefense, setDemoDefense] = useState("");
  const [signing, setSigning] = useState(false);

  const findings = plan.findings;
  const openCount = findings.filter((f) => f.status === "open").length;
  const canSign = !plan.signedAt && openCount === 0 && findings.length > 0;

  const demoQuestion = useMemo(() => {
    const openFindings = findings.filter((f) => f.status === "open");
    if (openFindings.length === 0) {
      return "Why are retries safe here without an idempotency key?";
    }
    const sorted = [...openFindings].sort(
      (a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity],
    );
    const top = sorted[0];
    const t = top.title.trim().replace(/[.?!]+$/, "");
    return `${t}?`;
  }, [findings]);

  function refresh() {
    startTransition(() => {
      router.refresh();
    });
  }

  async function handleAddress(finding: Finding) {
    setError(null);
    setBusyFindingId(finding.id);
    try {
      await callMcp("update_finding", {
        planId: plan.id,
        findingId: finding.id,
        status: "addressed",
      });
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed to address");
    } finally {
      setBusyFindingId(null);
    }
  }

  async function handleDefendSubmit(findingId: string, defense: string) {
    if (!defense.trim()) return;
    setError(null);
    setBusyFindingId(findingId);
    try {
      await callMcp("defend", {
        planId: plan.id,
        findingId,
        defense: defense.trim(),
      });
      setDefending(null);
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed to defend");
    } finally {
      setBusyFindingId(null);
    }
  }

  async function handleDemoDefenseSubmit() {
    if (!demoDefense.trim()) return;
    const openFindings = findings.filter((f) => f.status === "open");
    if (openFindings.length === 0) return;
    const sorted = [...openFindings].sort(
      (a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity],
    );
    const top = sorted[0];
    setError(null);
    setBusyFindingId(top.id);
    try {
      await callMcp("defend", {
        planId: plan.id,
        findingId: top.id,
        defense: demoDefense.trim(),
      });
      setDemoDefense("");
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed to defend");
    } finally {
      setBusyFindingId(null);
    }
  }

  async function handleSign() {
    if (!canSign) return;
    setError(null);
    setSigning(true);
    try {
      await callMcp("sign_plan", {
        planId: plan.id,
        authorName: "Ana Pereira",
      });
      router.push("/manager");
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed to sign");
      setSigning(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-24">
      <div className="flex items-center gap-3">
        <h2 className="text-sm text-zinc-900">findings</h2>
        <span className="font-mono inline-flex h-5 min-w-5 items-center justify-center rounded-[4px] border border-zinc-200 px-1.5 text-xs text-zinc-700">
          {findings.length}
        </span>
      </div>

      {findings.length === 0 ? (
        <div className="rounded-[4px] border border-zinc-200 p-6 text-sm text-zinc-500">
          No findings yet. The audit is in progress.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {findings.map((f) => (
            <li
              key={f.id}
              className="rounded-[4px] border border-zinc-200 p-4"
            >
              <div className="flex items-start gap-4">
                <div className="pt-1.5">
                  <SeverityDot severity={f.severity} />
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-wide text-zinc-500">
                      {f.category}
                    </span>
                    <span className="font-mono text-[11px] text-zinc-400">
                      ·
                    </span>
                    <span className="font-mono text-[11px] text-zinc-400">
                      {f.id}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-zinc-900 truncate">
                    {f.title}
                  </div>
                  <div className="text-sm text-zinc-500 leading-relaxed line-clamp-2">
                    {f.detail}
                  </div>

                  {f.status === "addressed" && f.defense ? (
                    <div className="mt-2 flex items-start gap-2 text-sm italic text-zinc-600">
                      <span aria-hidden className="text-[#15803D]">
                        ✓
                      </span>
                      <span>{f.defense}</span>
                    </div>
                  ) : null}
                  {f.status === "addressed" && !f.defense ? (
                    <div className="mt-2 flex items-center gap-2 text-sm italic text-zinc-600">
                      <span aria-hidden className="text-[#15803D]">
                        ✓
                      </span>
                      <span>addressed</span>
                    </div>
                  ) : null}
                  {f.status === "defended" && f.defense ? (
                    <div className="mt-2 flex items-start gap-2 text-sm italic text-zinc-600">
                      <span aria-hidden className="text-[#15803D]">
                        ✓
                      </span>
                      <span>{f.defense}</span>
                    </div>
                  ) : null}
                  {f.status === "overridden" ? (
                    <div className="mt-2 flex items-start gap-2 text-sm italic text-[#B91C1C]">
                      <span aria-hidden>!</span>
                      <span>{f.defense ?? "overridden"}</span>
                    </div>
                  ) : null}

                  {defending?.findingId === f.id ? (
                    <div className="mt-3 flex flex-col gap-2">
                      <textarea
                        value={defending.text}
                        onChange={(e) =>
                          setDefending({
                            findingId: f.id,
                            text: e.target.value,
                          })
                        }
                        rows={3}
                        placeholder="explain your reasoning..."
                        className="rounded-[4px] border border-zinc-200 p-3 font-sans text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 resize-none"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleDefendSubmit(f.id, defending.text)
                          }
                          disabled={
                            busyFindingId === f.id || !defending.text.trim()
                          }
                          className="rounded-[4px] border border-zinc-900 bg-zinc-900 px-3 py-1.5 text-xs text-white hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          submit defense
                        </button>
                        <button
                          type="button"
                          onClick={() => setDefending(null)}
                          disabled={busyFindingId === f.id}
                          className="rounded-[4px] border border-zinc-200 px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50"
                        >
                          cancel
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>

                {f.status === "open" && defending?.findingId !== f.id ? (
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddress(f)}
                      disabled={busyFindingId === f.id || isPending}
                      className="rounded-[4px] border border-zinc-200 px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50 disabled:opacity-40"
                    >
                      Address
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDefending({ findingId: f.id, text: "" })
                      }
                      disabled={busyFindingId === f.id || isPending}
                      className="rounded-[4px] border border-zinc-900 bg-zinc-900 px-3 py-1.5 text-xs text-white hover:bg-zinc-800 disabled:opacity-40"
                    >
                      Defend
                    </button>
                  </div>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-2 rounded-[4px] border border-zinc-300 bg-zinc-50 p-5 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-zinc-500">defend your demo</span>
          <p className="text-sm font-semibold text-zinc-900">{demoQuestion}</p>
        </div>
        <textarea
          value={demoDefense}
          onChange={(e) => setDemoDefense(e.target.value)}
          rows={3}
          placeholder="write your reasoning..."
          className="rounded-[4px] border border-zinc-200 bg-white p-3 font-sans text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 resize-none"
        />
        <div>
          <button
            type="button"
            onClick={handleDemoDefenseSubmit}
            disabled={!demoDefense.trim() || busyFindingId !== null}
            className="rounded-[4px] border border-zinc-900 bg-zinc-900 px-3 py-1.5 text-xs text-white hover:bg-zinc-800 disabled:opacity-40"
          >
            submit defense
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-[4px] border border-[#B91C1C]/30 bg-red-50 p-3 text-xs text-[#B91C1C] font-mono">
          {error}
        </div>
      ) : null}

      <div className="fixed bottom-6 right-6 z-10">
        <button
          type="button"
          onClick={handleSign}
          disabled={!canSign || signing}
          className="rounded-[4px] border border-zinc-900 bg-zinc-900 px-5 py-2.5 text-sm text-white shadow-none hover:bg-zinc-800 disabled:bg-zinc-300 disabled:border-zinc-300 disabled:cursor-not-allowed"
        >
          {signing
            ? "signing..."
            : plan.signedAt
              ? "signed"
              : openCount > 0
                ? `Sign plan · ${openCount} open`
                : "Sign plan"}
        </button>
      </div>
    </div>
  );
}
