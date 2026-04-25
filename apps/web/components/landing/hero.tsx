import Link from "next/link";

const PROOF_STATS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "100%", label: "ai-assisted prs audited" },
  { value: "1 page", label: "plain-english trail per plan" },
  { value: "0", label: "review cycles for repeat findings" },
];

export function Hero() {
  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <span className="inline-flex w-fit items-center gap-2 rounded-[4px] border border-zinc-200 bg-white px-2.5 py-1 font-mono text-[10px] lowercase tracking-wide text-zinc-600">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-600"
          />
          managed plugin · v0.1 preview
        </span>
        <h1 className="text-balance text-5xl font-medium lowercase tracking-tight text-zinc-900 md:text-6xl">
          train the seniors of the future.
        </h1>
        <p className="max-w-2xl text-pretty text-base leading-relaxed lowercase text-zinc-500">
          a managed plugin for your ai coding agents. helps juniors take
          responsibility for their work, gives managers a readable audit trail,
          and learns from every plan your team ships.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/work"
          className="group inline-flex h-9 items-center justify-center gap-1.5 rounded-[4px] border border-zinc-900 bg-zinc-900 px-4 font-mono text-xs lowercase text-white transition-colors hover:bg-zinc-800"
        >
          see the live demo
          <span
            aria-hidden
            className="transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </Link>
        <Link
          href="/manager"
          className="group inline-flex h-9 items-center justify-center gap-1.5 rounded-[4px] border border-zinc-200 bg-white px-4 font-mono text-xs lowercase text-zinc-900 transition-colors hover:border-zinc-300"
        >
          manager view
          <span
            aria-hidden
            className="text-zinc-400 transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </Link>
      </div>

      <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-[4px] border border-zinc-200 bg-zinc-200 sm:grid-cols-3">
        {PROOF_STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-1.5 bg-white px-5 py-4"
          >
            <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
              {stat.label}
            </dt>
            <dd className="font-mono text-2xl tabular-nums text-zinc-900">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
