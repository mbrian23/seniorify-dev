import type { PillarsSlide as T } from "../slides";

export function PillarsSlide({ slide }: { slide: T }) {
  return (
    <section className="flex w-full flex-col gap-12">
      <div className="flex flex-col gap-4">
        <span className="font-mono text-xs lowercase tracking-[0.2em] text-zinc-500">
          {slide.eyebrow}
        </span>
        <h2 className="max-w-4xl text-balance text-4xl font-medium lowercase leading-[1.05] tracking-tight text-zinc-900 md:text-6xl">
          {slide.title}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[6px] border border-zinc-200 bg-zinc-200 md:grid-cols-3">
        {slide.pillars.map((p, i) => (
          <div
            key={p.label}
            className="flex flex-col gap-5 bg-white p-8"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs lowercase text-zinc-900">
                {p.label}
              </span>
              <span className="font-mono text-[11px] tabular-nums text-zinc-400">
                0{i + 1}
              </span>
            </div>
            <p className="text-balance text-lg lowercase leading-relaxed text-zinc-700">
              {p.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
