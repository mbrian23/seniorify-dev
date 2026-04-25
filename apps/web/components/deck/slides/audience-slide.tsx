import type { AudienceSlide as T } from "../slides";

export function AudienceSlide({ slide }: { slide: T }) {
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
        <h2 className="max-w-4xl text-balance text-5xl font-medium lowercase leading-[1.0] tracking-[-0.025em] text-zinc-900 md:text-[5.5rem]">
          {slide.title}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {slide.sides.map((s, i) => (
          <div
            key={s.label}
            className={`group relative flex flex-col gap-5 overflow-hidden rounded-[10px] border p-8 shadow-[0_1px_0_rgba(0,0,0,0.03)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 md:p-10 ${
              i === 0
                ? "border-zinc-200 bg-white/85 hover:border-zinc-300"
                : "border-amber-200/80 bg-gradient-to-br from-amber-50/70 via-amber-50/30 to-white/70 hover:border-amber-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 font-mono text-xs lowercase text-zinc-700">
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full ${
                    i === 0 ? "bg-zinc-900" : "bg-amber-500"
                  }`}
                />
                / {s.label}
              </span>
              <span className="font-serif text-2xl tabular-nums text-zinc-300">
                0{i + 1}
              </span>
            </div>
            <h3 className="text-balance text-2xl font-medium lowercase leading-[1.1] tracking-[-0.015em] text-zinc-900 md:text-[2rem]">
              {s.headline}
            </h3>
            <span aria-hidden className={`h-px w-full bg-gradient-to-r ${i === 0 ? "from-zinc-300" : "from-amber-300"} via-transparent to-transparent`} />
            <p className="text-balance text-base lowercase leading-relaxed text-zinc-700 md:text-lg">
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
