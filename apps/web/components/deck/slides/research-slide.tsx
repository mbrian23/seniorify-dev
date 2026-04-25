import type { ResearchSlide as T } from "../slides";

export function ResearchSlide({ slide }: { slide: T }) {
  return (
    <section className="flex w-full flex-col gap-10">
      <div className="flex flex-col gap-4">
        <span className="font-mono text-xs lowercase tracking-[0.2em] text-zinc-500">
          {slide.eyebrow}
        </span>
        <h2 className="max-w-4xl text-balance text-5xl font-medium lowercase leading-[1.05] tracking-tight text-zinc-900 md:text-7xl">
          {slide.title}
        </h2>
        <p className="max-w-3xl text-balance text-lg lowercase leading-relaxed text-zinc-500 md:text-xl">
          {slide.body}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs lowercase text-zinc-500">
            / a sample of the field
          </span>
          <span className="h-px flex-1 bg-zinc-200" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {slide.papers.map((p) => (
            <span
              key={p.venue}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 font-mono text-[11px] lowercase text-zinc-700"
            >
              <span className="inline-block h-1 w-1 rounded-full bg-amber-400" />
              {p.venue}
              <span className="tabular-nums text-zinc-400">· {p.year}</span>
            </span>
          ))}
          <span className="inline-flex items-center rounded-full border border-dashed border-zinc-300 bg-white px-3.5 py-1.5 font-mono text-[11px] lowercase text-zinc-400">
            …and the list keeps growing.
          </span>
        </div>
      </div>
    </section>
  );
}
