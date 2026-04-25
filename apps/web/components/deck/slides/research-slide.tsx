import type { ResearchSlide as T } from "../slides";

export function ResearchSlide({ slide }: { slide: T }) {
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
        <h2 className="relative max-w-4xl text-balance text-5xl font-medium lowercase leading-[1.0] tracking-[-0.025em] text-zinc-900 md:text-[5.5rem]">
          <span className="relative">
            {slide.title}
            <span
              aria-hidden
              className="absolute -bottom-2 left-0 h-[5px] w-24 origin-left rounded-full bg-amber-400/80 md:-bottom-3 md:w-40"
              style={{ animation: "underline-grow 900ms 500ms cubic-bezier(0.2, 0.7, 0.2, 1) both" }}
            />
          </span>
        </h2>
        <p className="max-w-3xl text-balance font-serif text-xl italic leading-relaxed text-zinc-600 md:text-2xl">
          {slide.body}
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">
            / a sample of the field
          </span>
          <span className="h-px flex-1 bg-zinc-200" />
          <span className="font-mono text-[11px] tabular-nums text-zinc-400">
            {String(slide.papers.length).padStart(2, "0")}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {slide.papers.map((p) => (
            <span
              key={p.venue}
              className="group inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-2 font-mono text-[11px] lowercase text-zinc-700 shadow-[0_1px_0_rgba(0,0,0,0.03)] backdrop-blur transition-all hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-50/60"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 transition-all group-hover:scale-125" />
              {p.venue}
              <span className="tabular-nums text-zinc-400">· {p.year}</span>
            </span>
          ))}
          <span className="inline-flex items-center rounded-full border border-dashed border-zinc-300 bg-transparent px-4 py-2 font-mono text-[11px] lowercase text-zinc-400">
            …and the list keeps growing.
          </span>
        </div>
      </div>
    </section>
  );
}
