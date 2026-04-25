import Link from "next/link";

export function Hero() {
  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-5">
        <h1 className="text-5xl font-medium lowercase tracking-tight text-zinc-900 md:text-6xl">
          train the seniors of the future.
        </h1>
        <p className="max-w-2xl text-base leading-relaxed lowercase text-zinc-500">
          a managed plugin for your ai coding agents. helps juniors take
          responsibility for their work, gives managers a readable audit trail,
          and learns from every plan your team ships.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/work"
          className="inline-flex h-9 items-center justify-center rounded-[4px] border border-zinc-900 bg-zinc-900 px-4 font-mono text-xs lowercase text-white transition-colors hover:bg-zinc-800"
        >
          see the live demo
        </Link>
        <Link
          href="/manager"
          className="inline-flex h-9 items-center justify-center rounded-[4px] border border-zinc-200 bg-white px-4 font-mono text-xs lowercase text-zinc-900 transition-colors hover:border-zinc-300"
        >
          manager view
        </Link>
      </div>
    </section>
  );
}
