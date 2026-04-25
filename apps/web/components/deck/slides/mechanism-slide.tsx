import type { MechanismSlide as T } from "../slides";

export function MechanismSlide({ slide }: { slide: T }) {
  return (
    <section className="flex w-full flex-col gap-10">
      <div className="flex flex-col gap-4">
        <span className="font-mono text-xs lowercase tracking-[0.2em] text-zinc-500">
          {slide.eyebrow}
        </span>
        <h2 className="max-w-4xl text-balance text-4xl font-medium lowercase leading-[1.05] tracking-tight text-zinc-900 md:text-6xl">
          {slide.title}
        </h2>
        {slide.body ? (
          <p className="max-w-3xl text-balance text-base lowercase leading-relaxed text-zinc-500 md:text-lg">
            {slide.body}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        {slide.parts.map((p, i, all) => (
          <div key={p.label} className="contents">
            <div className="flex flex-col gap-4 rounded-[6px] border border-zinc-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs lowercase text-zinc-900">
                  {p.label}
                </span>
                <span className="font-mono text-[10px] tabular-nums text-zinc-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="text-balance text-lg font-medium lowercase leading-tight text-zinc-900 md:text-xl">
                {p.headline}
              </h3>
              <p className="text-balance text-sm lowercase leading-relaxed text-zinc-600">
                {p.body}
              </p>
              <span className="mt-1 font-mono text-[11px] lowercase text-zinc-400">
                {p.actor}
              </span>
            </div>
            {i < all.length - 1 ? (
              <div
                aria-hidden
                className="hidden items-center justify-center font-mono text-zinc-300 md:flex"
              >
                →
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
