"use client";

import { useRouter } from "next/navigation";
import { Fragment, useState, useTransition } from "react";
import type { Finding, Plan } from "@seniorify/core";
import { SeverityDot } from "./severity-dot";
import { VoiceDefend } from "./voice-defend";

type DefendState = {
  findingId: string;
  text: string;
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
  const [voicingFindingId, setVoicingFindingId] = useState<string | null>(null);
  const [busyFindingId, setBusyFindingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [signing, setSigning] = useState(false);

  // Open findings come first, then decided ones (defended → addressed → overridden).
  const STATUS_ORDER: Record<string, number> = {
    open: 0,
    defended: 1,
    addressed: 2,
    overridden: 3,
  };
  const findings = [...plan.findings].sort(
    (a, b) =>
      (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99),
  );
  const openCount = findings.filter((f) => f.status === "open").length;
  const decidedCount = findings.length - openCount;
  const blockOpen = findings.filter(
    (f) => f.status === "open" && f.severity === "block",
  ).length;
  const warnOpen = findings.filter(
    (f) => f.status === "open" && f.severity === "warn",
  ).length;
  const canSign = !plan.signedAt && openCount === 0 && findings.length > 0;
  const firstDecidedIndex = findings.findIndex((f) => f.status !== "open");

  function refresh() {
    startTransition(() => {
      router.refresh();
    });
  }

  function startVoice(findingId: string) {
    setDefending(null);
    setVoicingFindingId(findingId);
  }

  function startTyping(findingId: string) {
    setVoicingFindingId(null);
    setDefending({ findingId, text: "" });
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

  async function handleSign() {
    if (!canSign) return;
    setError(null);
    setSigning(true);
    try {
      await callMcp("sign_plan", {
        planId: plan.id,
        authorName: "Martin Brian",
      });
      router.push("/manager");
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed to sign");
      setSigning(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-sm lowercase text-zinc-900">findings</h2>
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-[4px] border border-zinc-200 px-1.5 font-mono text-xs text-zinc-700">
            {findings.length}
          </span>
        </div>
        {findings.length > 0 ? (
          <div className="flex items-center gap-4 font-mono text-[11px]">
            {blockOpen > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-zinc-700">
                <span
                  aria-hidden
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: "#B91C1C" }}
                />
                {blockOpen} block
              </span>
            ) : null}
            {warnOpen > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-zinc-700">
                <span
                  aria-hidden
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: "#B45309" }}
                />
                {warnOpen} warn
              </span>
            ) : null}
            {openCount > 0 ? (
              <span className="text-zinc-500">{openCount} open</span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-emerald-700">
                <span
                  aria-hidden
                  className="inline-block h-2 w-2 rounded-full bg-emerald-600"
                />
                all clear
              </span>
            )}
            {decidedCount > 0 ? (
              <span className="text-zinc-400">· {decidedCount} decided</span>
            ) : null}
          </div>
        ) : null}
      </div>

      {findings.length === 0 ? (
        <div className="rounded-[4px] border border-zinc-200 p-6 text-sm text-zinc-500">
          No findings yet. The audit is in progress.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {findings.map((f, idx) => {
            const isOpen = f.status === "open";
            const isTyping = defending?.findingId === f.id;
            const isVoicing = voicingFindingId === f.id;
            const showActions = isOpen && !isTyping && !isVoicing;
            const showDecidedHeader =
              decidedCount > 0 && openCount > 0 && idx === firstDecidedIndex;

            return (
              <Fragment key={f.id}>
                {showDecidedHeader ? (
                  <li
                    aria-hidden
                    className="flex items-center gap-3 pt-2"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                      decided
                    </span>
                    <span className="h-px flex-1 bg-zinc-100" />
                    <span className="font-mono text-[10px] tabular-nums text-zinc-400">
                      {decidedCount}
                    </span>
                  </li>
                ) : null}
              <li
                className={`rounded-[4px] border p-4 ${
                  isOpen ? "border-zinc-200" : "border-zinc-100 bg-zinc-50/40"
                }`}
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
                      {!isOpen ? (
                        <span className="ml-auto font-mono text-[10px] uppercase tracking-wide text-zinc-500">
                          {f.status}
                        </span>
                      ) : null}
                    </div>
                    <div className="text-sm font-semibold text-zinc-900">
                      {f.title}
                    </div>
                    <div className="text-sm text-zinc-500 leading-relaxed">
                      {f.detail}
                    </div>

                    {f.learn ? (
                      <div
                        className={`mt-2 rounded-[4px] border-l-2 px-3 py-2 ${
                          isOpen
                            ? "border-l-zinc-900 bg-zinc-50 border border-zinc-200"
                            : "border-l-zinc-300 bg-white/60 border border-zinc-100"
                        }`}
                      >
                        <div className="font-mono text-[10px] uppercase tracking-wide text-zinc-500 mb-1">
                          why x and not y
                        </div>
                        <div className="text-sm text-zinc-700 leading-relaxed">
                          {f.learn}
                        </div>
                      </div>
                    ) : null}

                    {f.status === "addressed" ? (
                      <div className="mt-2 flex items-start gap-2 text-sm italic text-zinc-600">
                        <span aria-hidden className="text-[#15803D]">
                          ✓
                        </span>
                        <span>{f.defense ?? "addressed"}</span>
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

                    {isTyping ? (
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

                    {isVoicing ? (
                      <div className="mt-3">
                        <VoiceDefend
                          planId={plan.id}
                          finding={f}
                          onClose={() => setVoicingFindingId(null)}
                        />
                      </div>
                    ) : null}
                  </div>

                  {showActions ? (
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
                        onClick={() => startTyping(f.id)}
                        disabled={busyFindingId === f.id || isPending}
                        className="rounded-[4px] border border-zinc-200 px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50 disabled:opacity-40"
                      >
                        Defend
                      </button>
                      <button
                        type="button"
                        onClick={() => startVoice(f.id)}
                        disabled={busyFindingId === f.id || isPending}
                        className="rounded-[4px] border border-zinc-900 bg-zinc-900 px-3 py-1.5 text-xs text-white hover:bg-zinc-800 disabled:opacity-40 inline-flex items-center gap-1.5"
                      >
                        <span aria-hidden>●</span>
                        Voice
                      </button>
                    </div>
                  ) : null}
                </div>
              </li>
              </Fragment>
            );
          })}
        </ul>
      )}

      {error ? (
        <div className="rounded-[4px] border border-[#B91C1C]/30 bg-red-50 p-3 text-xs text-[#B91C1C] font-mono">
          {error}
        </div>
      ) : null}

      <div className="fixed bottom-6 right-6 z-10">
        <div className="flex items-center gap-3 rounded-[6px] border border-zinc-200 bg-white/90 p-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.12)] backdrop-blur">
          {!plan.signedAt ? (
            <span className="pl-3 font-mono text-[11px] lowercase text-zinc-500">
              {openCount > 0
                ? `${openCount} open · cannot sign`
                : "ready to sign"}
            </span>
          ) : null}
          <button
            type="button"
            onClick={handleSign}
            disabled={!canSign || signing}
            className="inline-flex items-center gap-2 rounded-[4px] border border-zinc-900 bg-zinc-900 px-4 py-2 font-mono text-xs lowercase text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:bg-zinc-100 disabled:text-zinc-400"
          >
            {signing ? (
              <>
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-current"
                />
                signing...
              </>
            ) : plan.signedAt ? (
              <>
                <span aria-hidden>✓</span>
                signed
              </>
            ) : (
              <>
                sign plan
                <span aria-hidden>→</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
