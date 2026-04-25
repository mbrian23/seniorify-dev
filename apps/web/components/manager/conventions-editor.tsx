"use client";

import { useState, useTransition } from "react";

type SaveState = "idle" | "saving" | "saved" | "error";

export function ConventionsEditor({ initialRules }: { initialRules: string[] }) {
  const [text, setText] = useState(initialRules.join("\n"));
  const [state, setState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const lineCount = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0).length;

  async function save() {
    setState("saving");
    setError(null);
    const rules = text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    try {
      const res = await fetch("/api/conventions", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ rules }),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`save failed: ${res.status} ${body}`);
      }
      setState("saved");
      startTransition(() => {
        // No router.refresh needed — the SSR view re-reads on next nav.
      });
      setTimeout(() => setState("idle"), 2000);
    } catch (e) {
      setState("error");
      setError(e instanceof Error ? e.message : "unknown error");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-zinc-500">
          rules · one per line · {lineCount}/50
        </span>
        {state === "saved" ? (
          <span className="font-mono text-[11px] text-[#15803D]">
            ✓ saved
          </span>
        ) : null}
        {state === "error" ? (
          <span className="font-mono text-[11px] text-[#B91C1C]">
            ! {error}
          </span>
        ) : null}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={12}
        spellCheck={false}
        className="w-full rounded-[4px] border border-zinc-200 bg-white p-4 font-mono text-[13px] leading-relaxed text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 resize-y"
        placeholder={`Use the internal http client at @acme/http for outbound calls; never axios.\nLogger: @acme/log only. No console.log in committed code.\nRetries: must use @acme/retry with idempotency-key header.`}
      />

      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-500 max-w-[60%]">
          Saved rules apply to every audit on this team. Existing signed plans
          are not re-audited.
        </p>
        <button
          type="button"
          onClick={save}
          disabled={state === "saving"}
          className="rounded-[4px] border border-zinc-900 bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {state === "saving" ? "saving..." : "save guidelines"}
        </button>
      </div>
    </div>
  );
}
