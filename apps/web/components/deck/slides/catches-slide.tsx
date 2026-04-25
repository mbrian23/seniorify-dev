import type { CatchesSlide as T } from "../slides";

export function CatchesSlide({ slide }: { slide: T }) {
  return (
    <section className="relative flex w-full flex-col gap-10">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <span aria-hidden className="inline-block h-1 w-1 rotate-45 bg-amber-500" />
          <span className="font-mono text-xs lowercase tracking-[0.3em] text-zinc-700">
            {slide.eyebrow}
          </span>
          <span className="h-px w-12 bg-zinc-300" />
        </div>
        <h2 className="max-w-4xl text-balance text-4xl font-medium lowercase leading-[1.0] tracking-[-0.025em] text-zinc-900 md:text-[4.5rem]">
          {slide.title}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {slide.catches.map((c, i) => (
          <div
            key={c.label}
            className="group relative flex flex-col gap-3 overflow-hidden rounded-[10px] border border-zinc-200 bg-white/85 p-6 shadow-[0_1px_0_rgba(0,0,0,0.03)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-300 hover:bg-white hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)]"
          >
            <span
              aria-hidden
              className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-amber-400 via-amber-300 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
            <div className="flex items-start justify-between gap-3">
              <span className="font-mono text-xs lowercase text-zinc-900">
                {c.label}
              </span>
              <span className="shrink-0 font-serif text-xl tabular-nums text-zinc-300">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <span aria-hidden className="h-px w-full bg-gradient-to-r from-zinc-200 to-transparent" />
            <p className="text-balance text-sm lowercase leading-relaxed text-zinc-600">
              {c.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
