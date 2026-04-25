import type { HorizonSlide as T } from "../slides";

export function HorizonSlide({ slide }: { slide: T }) {
  return (
    <section className="relative flex w-full flex-col gap-10">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="inline-block text-amber-500"
            style={{ animation: "spin 14s linear infinite" }}
          >
            ✦
          </span>
          <span className="font-mono text-xs lowercase tracking-[0.3em] text-zinc-700">
            {slide.eyebrow}
          </span>
          <span className="h-px w-12 bg-zinc-300" />
        </div>
        <h2 className="relative max-w-4xl text-balance text-4xl font-medium lowercase leading-[1.0] tracking-[-0.025em] text-zinc-900 md:text-[5rem]">
          <span className="relative">
            {slide.title}
            <span
              aria-hidden
              className="absolute -bottom-2 left-0 h-[5px] w-32 origin-left rounded-full bg-amber-400/80 md:-bottom-3 md:w-48"
              style={{ animation: "underline-grow 900ms 500ms cubic-bezier(0.2, 0.7, 0.2, 1) both" }}
            />
          </span>
        </h2>
        {slide.body ? (
          <p className="max-w-3xl text-balance font-serif text-lg italic leading-relaxed text-zinc-600 md:text-xl">
            {slide.body}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {slide.contexts.map((c, i) => (
          <div
            key={c.label}
            className="group relative flex flex-col gap-4 overflow-hidden rounded-[10px] border border-zinc-200 bg-white/85 p-7 shadow-[0_1px_0_rgba(0,0,0,0.03)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-300 hover:bg-white hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)]"
          >
            <span
              aria-hidden
              className="absolute right-0 top-0 h-12 w-12 bg-gradient-to-bl from-amber-200/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 font-mono text-xs lowercase text-zinc-900">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
                {c.label}
              </span>
              <span className="font-serif text-2xl tabular-nums text-zinc-300">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="text-balance text-lg font-medium lowercase leading-tight tracking-[-0.01em] text-zinc-900 md:text-xl">
              {c.headline}
            </h3>
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
