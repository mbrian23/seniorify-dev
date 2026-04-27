import Image from "next/image";
import Link from "next/link";
import { CopyEmail } from "@/components/teams/copy-email";

const LINKEDIN_URL = "https://www.linkedin.com/in/martinbrianmdbn/";
const CONTACT_EMAIL = "hello@martinbrian.com";

const DIALOGUE: ReadonlyArray<{
  who: "Junior" | "Seniorify" | "Junior reply";
  text: string;
  tone?: "neutral" | "highlight" | "soft";
}> = [
  {
    who: "Junior",
    text: "Plan: install axios, fetch /api/users/.../invoices.",
    tone: "soft",
  },
  {
    who: "Seniorify",
    text: "This codebase uses @acme/internal-http — it carries tracing, retries, and the auth header. Why axios?",
    tone: "highlight",
  },
  {
    who: "Seniorify",
    text: "And invoices live behind /v2/billing/invoices, not /api/users. Defend your reasoning.",
    tone: "highlight",
  },
  {
    who: "Junior reply",
    text: "Got it — switching to @acme/internal-http and /v2/billing/invoices.",
    tone: "neutral",
  },
];

const OUTCOMES: ReadonlyArray<{
  kicker: string;
  title: string;
  body: string;
}> = [
  {
    kicker: "For your developers",
    title: "They learn the codebase, not just ship it.",
    body: "Every plan is checked against your team's conventions and prior decisions. Juniors come out of each PR knowing why, not just what.",
  },
  {
    kicker: "For your reviewers",
    title: "Fewer review cycles on the same mistakes.",
    body: "Repeated findings flag once and stay flagged across the team. Convention drift stops at the agent layer, not in code review.",
  },
  {
    kicker: "For you",
    title: "A readable trail of what AI is shipping.",
    body: "One audit page per PR — what was suggested, what was overridden, and the reasoning behind both. Real signal on AI-assisted work.",
  },
];

const RESEARCH: ReadonlyArray<{ source: string; finding: string }> = [
  {
    source: "Microsoft & CMU · CHI 2025",
    finding: "More AI confidence correlates with less critical thinking.",
  },
  {
    source: "MIT Media Lab · 2025",
    finding: "Heavy LLM users showed the weakest neural connectivity measured.",
  },
  {
    source: "Gerlich · Societies, 2025",
    finding: "The more we cognitively offload, the less we build the muscle.",
  },
];

export default function TeamsLanding() {
  return (
    <main className="relative flex min-h-screen w-full flex-col overflow-hidden bg-white text-zinc-900">
      {/* Ambient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[820px] bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.12),_transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_50%_30%,black_30%,transparent_75%)]"
      />

      <div className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-16 px-6 py-8 md:gap-24 md:px-10 md:py-12">
        <header className="flex w-full items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-mono text-sm lowercase text-zinc-900"
          >
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-zinc-900"
            />
            seniorify
            <span className="hidden font-mono text-[10px] text-zinc-400 sm:inline">
              for teams &amp; classrooms
            </span>
          </Link>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-zinc-900 bg-zinc-900 px-4 text-xs font-medium text-white shadow-[0_1px_0_rgba(0,0,0,0.04)] transition-all hover:bg-zinc-800 hover:shadow-md"
          >
            DM me
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </a>
        </header>

        {/* HERO */}
        <section className="flex flex-col items-start gap-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3.5 py-1.5 text-[12px] font-medium text-zinc-700 backdrop-blur">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-600"
            />
            Winner · Vercel Zero to Agent · Montevideo 2026
          </span>

          <h1 className="text-balance text-4xl font-semibold leading-[1.02] tracking-tight text-zinc-900 sm:text-6xl md:text-7xl lg:text-[88px]">
            Train engineers who actually
            <br className="hidden sm:block" />{" "}
            <span className="bg-gradient-to-br from-emerald-600 to-zinc-900 bg-clip-text text-transparent">
              understand their code.
            </span>
          </h1>

          <p className="max-w-2xl text-pretty text-lg leading-relaxed text-zinc-700 md:text-xl">
            Seniorify intercepts every AI-assisted PR before code is written,
            asks the developer to defend their reasoning, and gives you a
            readable trail of what was learned. Preinstalled in{" "}
            <span className="font-medium text-zinc-900">Codex</span>,{" "}
            <span className="font-medium text-zinc-900">Cursor</span>, and{" "}
            <span className="font-medium text-zinc-900">Claude Code</span>.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-zinc-900 px-8 text-base font-medium text-white shadow-[0_2px_0_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(16,185,129,0.4)] transition-all hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-[0_4px_0_rgba(0,0,0,0.08),0_16px_32px_-8px_rgba(16,185,129,0.5)] md:text-lg"
            >
              DM me on LinkedIn
              <span
                aria-hidden
                className="text-xl transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </a>
            <CopyEmail email={CONTACT_EMAIL} />
          </div>

          <p className="pt-2 text-sm text-zinc-500">
            Two lines is enough. I read every message and reply within 48
            hours.
          </p>
        </section>

        {/* DIALOGUE — the magic moment */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
              See it in action
            </span>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
              An audit looks like a conversation, not a linter.
            </h2>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-2 border-b border-zinc-100 bg-zinc-50/60 px-5 py-3">
              <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
              <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
              <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
              <span className="ml-2 font-mono text-[11px] text-zinc-500">
                claude code · seniorify plugin · plan #42
              </span>
            </div>
            <div className="flex flex-col gap-6 p-6 md:p-10">
              {DIALOGUE.map((line, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <span
                    className={`mt-1 inline-flex h-7 shrink-0 items-center justify-center rounded-full px-3 text-[11px] font-semibold ${
                      line.who === "Seniorify"
                        ? "bg-emerald-600 text-white"
                        : line.who === "Junior reply"
                          ? "border border-zinc-200 bg-white text-zinc-600"
                          : "bg-zinc-900 text-white"
                    }`}
                  >
                    {line.who}
                  </span>
                  <p
                    className={`text-base leading-relaxed md:text-lg ${
                      line.tone === "highlight"
                        ? "font-medium text-zinc-900"
                        : "text-zinc-600"
                    }`}
                  >
                    {line.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OUTCOMES — buyer-facing benefits */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
              What you get
            </span>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
              Three things change the day you turn it on.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {OUTCOMES.map((o) => (
              <article
                key={o.title}
                className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-7 transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  {o.kicker}
                </span>
                <h3 className="text-balance text-xl font-semibold leading-snug text-zinc-900">
                  {o.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-zinc-600">
                  {o.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* RESEARCH — proof / why now */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Why now
            </span>
            <h2 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
              The future has a senior staffing problem.
            </h2>
            <p className="max-w-2xl text-lg text-zinc-600">
              Three independent studies in 2025 show the same pattern:
              fluency rises with AI, but judgment doesn&apos;t.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-xl border border-zinc-200 bg-zinc-200 sm:grid-cols-3">
            {RESEARCH.map((item) => (
              <article
                key={item.source}
                className="flex flex-col gap-2 bg-white p-6"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  {item.source}
                </span>
                <p className="text-base leading-snug text-zinc-800">
                  {item.finding}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* FINAL CTA — personal, with QR */}
        <section className="relative flex flex-col gap-10 overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-900 p-8 text-white md:p-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.22),_transparent_60%)]"
          />

          <div className="relative grid gap-12 md:grid-cols-[1fr_auto] md:items-center">
            <div className="flex flex-col gap-6">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Piloting now · engineering teams &amp; CS programs
              </span>
              <h2 className="text-balance text-3xl font-semibold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
                Is your team actually growing,
                <br className="hidden md:block" /> or just copy-pasting?
              </h2>
              <p className="max-w-xl text-lg leading-relaxed text-zinc-300 md:text-xl">
                Send me a DM. Tell me your team or classroom size, the agents
                you use, and what you&apos;d want Seniorify to catch. I&apos;ll
                reply within 48 hours.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-white px-8 text-base font-semibold text-zinc-900 shadow-[0_2px_0_rgba(0,0,0,0.18),0_12px_32px_-8px_rgba(16,185,129,0.5)] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_0_rgba(0,0,0,0.18),0_20px_40px_-8px_rgba(16,185,129,0.65)] md:text-lg"
                >
                  DM me on LinkedIn
                  <span
                    aria-hidden
                    className="text-xl transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
                <CopyEmail
                  email={CONTACT_EMAIL}
                  className="text-sm text-zinc-300 underline decoration-zinc-600 underline-offset-4 transition-colors hover:text-white hover:decoration-emerald-400"
                />
              </div>
            </div>

            <div className="relative hidden flex-col items-center gap-3 md:flex">
              <div className="rounded-2xl border border-zinc-800 bg-white p-3 shadow-2xl">
                <Image
                  src="/linkedin-qr.svg"
                  alt="QR code linking to Martin's LinkedIn"
                  width={200}
                  height={200}
                  className="h-[200px] w-[200px]"
                  priority={false}
                />
              </div>
              <span className="text-center text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
                Scan to DM
              </span>
            </div>
          </div>

          <div className="relative flex items-center gap-3 border-t border-zinc-800 pt-6">
            <span
              aria-hidden
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 font-mono text-sm font-semibold text-emerald-300"
            >
              MB
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">
                Martin Brian
              </span>
              <span className="text-xs text-zinc-400">
                Solo founder · Built Seniorify at Vercel Zero to Agent
              </span>
            </div>
          </div>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-6 font-mono text-xs lowercase text-zinc-500">
          <span>built at zero to agent · montevideo 2026</span>
          <span className="text-zinc-400">teams.seniorify.dev</span>
        </footer>
      </div>
    </main>
  );
}
