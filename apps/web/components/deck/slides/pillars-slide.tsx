import type { PillarsSlide as T } from "../slides";

export function PillarsSlide({ slide }: { slide: T }) {
  return (
    <section className="relative flex w-full flex-col gap-12">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <span aria-hidden className="inline-block h-1 w-1 rotate-45 bg-amber-500" />
          <span className="font-mono text-xs lowercase tracking-[0.3em] text-zinc-700">
            {slide.eyebrow}
          </span>
          <span className="h-px w-12 bg-zinc-300" />
        </div>
        <h2 className="max-w-4xl text-balance text-4xl font-medium lowercase leading-[1.0] tracking-[-0.025em] text-zinc-900 md:text-7xl">
          {slide.title}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {slide.pillars.map((p, i) => (
          <div
            key={p.label}
            className="group relative flex flex-col gap-5 overflow-hidden rounded-[10px] border border-zinc-200 bg-white/80 p-7 shadow-[0_1px_0_rgba(0,0,0,0.03)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)]"
          >
            {/* corner accent */}
            <span
              aria-hidden
              className="absolute right-0 top-0 h-12 w-12 bg-gradient-to-bl from-amber-200/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 font-mono text-xs lowercase text-zinc-900">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
                {p.label}
              </span>
              <span className="font-serif text-2xl tabular-nums text-zinc-300">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <span aria-hidden className="h-px w-full bg-gradient-to-r from-zinc-200 via-zinc-200 to-transparent" />
            <p className="text-balance text-lg lowercase leading-relaxed text-zinc-700">
              {p.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
