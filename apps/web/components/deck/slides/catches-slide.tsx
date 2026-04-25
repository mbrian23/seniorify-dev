import type { CatchesSlide as T } from "../slides";

export function CatchesSlide({ slide }: { slide: T }) {
  return (
    <section className="flex w-full flex-col gap-10">
      <div className="flex flex-col gap-4">
        <span className="font-mono text-xs lowercase tracking-[0.2em] text-zinc-500">
          {slide.eyebrow}
        </span>
        <h2 className="max-w-4xl text-balance text-4xl font-medium lowercase leading-[1.05] tracking-tight text-zinc-900 md:text-6xl">
          {slide.title}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[6px] border border-zinc-200 bg-zinc-200 md:grid-cols-2 lg:grid-cols-3">
        {slide.catches.map((c, i) => (
          <div
            key={c.label}
            className="flex flex-col gap-3 bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs lowercase text-zinc-900">
                {c.label}
              </span>
              <span className="font-mono text-[10px] tabular-nums text-zinc-400">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <p className="text-balance text-sm lowercase leading-relaxed text-zinc-600">
              {c.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
