"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
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

  const findings = plan.findings;
  const openCount = findings.filter((f) => f.status === "open").length;
  const canSign = !plan.signedAt && openCount === 0 && findings.length > 0;

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
      <div className="flex items-center gap-3">
        <h2 className="text-sm text-zinc-900">findings</h2>
        <span className="font-mono inline-flex h-5 min-w-5 items-center justify-center rounded-[4px] border border-zinc-200 px-1.5 text-xs text-zinc-700">
          {findings.length}
        </span>
        {openCount > 0 ? (
          <span className="font-mono text-[11px] text-zinc-500">
            {openCount} open
          </span>
        ) : null}
      </div>

      {findings.length === 0 ? (
        <div className="rounded-[4px] border border-zinc-200 p-6 text-sm text-zinc-500">
          No findings yet. The audit is in progress.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {findings.map((f) => {
            const isOpen = f.status === "open";
            const isTyping = defending?.findingId === f.id;
            const isVoicing = voicingFindingId === f.id;
            const showActions = isOpen && !isTyping && !isVoicing;

            return (
              <li
                key={f.id}
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
