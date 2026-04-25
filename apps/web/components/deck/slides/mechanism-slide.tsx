import type { MechanismSlide as T } from "../slides";

export function MechanismSlide({ slide }: { slide: T }) {
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
        {slide.body ? (
          <p className="max-w-3xl text-balance font-serif text-lg italic leading-relaxed text-zinc-600 md:text-xl">
            {slide.body}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        {slide.parts.map((p, i, all) => (
          <div key={p.label} className="contents">
            <div className="group relative flex flex-col gap-4 overflow-hidden rounded-[10px] border border-zinc-200 bg-white/85 p-6 shadow-[0_1px_0_rgba(0,0,0,0.03)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)]">
              <span
                aria-hidden
                className="absolute right-0 top-0 h-12 w-12 bg-gradient-to-bl from-amber-200/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 font-mono text-xs lowercase text-zinc-900">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
                  {p.label}
                </span>
                <span className="font-serif text-xl tabular-nums text-zinc-300">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="text-balance text-xl font-medium lowercase leading-tight tracking-[-0.01em] text-zinc-900 md:text-2xl">
                {p.headline}
              </h3>
              <p className="text-balance text-sm lowercase leading-relaxed text-zinc-600">
                {p.body}
              </p>
              <span aria-hidden className="h-px w-full bg-gradient-to-r from-zinc-200 to-transparent" />
              <span className="font-mono text-[11px] lowercase text-amber-600">
                {p.actor}
              </span>
            </div>
            {i < all.length - 1 ? (
              <div
                aria-hidden
                className="hidden items-center justify-center md:flex"
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="font-mono text-2xl text-amber-400">→</span>
                  <span className="h-[2px] w-6 rounded-full bg-amber-300/60" />
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
