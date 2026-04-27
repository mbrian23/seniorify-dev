import { headers } from "next/headers";
import { isDemoMode } from "@/lib/demo";

const SUPPRESS_HOSTS = new Set(["teams.seniorify.dev"]);

export async function DemoBanner() {
  if (!isDemoMode()) return null;
  const host = (await headers()).get("host")?.toLowerCase() ?? "";
  if (SUPPRESS_HOSTS.has(host)) return null;
  return (
    <div className="border-b border-amber-200 bg-amber-50/70 text-amber-900">
      <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center gap-x-4 gap-y-1 px-6 py-2.5 font-mono text-[11px] md:text-xs">
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500"
          />
          <span className="font-semibold uppercase tracking-[0.14em]">
            demo mode
          </span>
        </span>
        <span className="text-amber-900/90">
          AI calls are disabled on this public site to keep it free. The
          plans, findings, and audits shown are mock examples — the product is
          real, this surface is just a static walkthrough.
        </span>
        <a
          href="https://www.linkedin.com/in/martinbrianmdbn/"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto inline-flex items-center gap-1 font-semibold underline decoration-amber-300 underline-offset-2 hover:decoration-amber-700"
        >
          DM me for a live pilot
          <span aria-hidden>→</span>
        </a>
      </div>
    </div>
  );
}
