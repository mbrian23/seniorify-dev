import type { QuoteSlide as T } from "../slides";

export function QuoteSlide({ slide }: { slide: T }) {
  return (
    <section className="relative flex w-full flex-col items-start gap-10">
      {/* eyebrow */}
      <div className="flex items-center gap-3">
        <span aria-hidden className="inline-block h-1 w-1 rotate-45 bg-amber-500" />
        <span className="font-mono text-xs lowercase tracking-[0.3em] text-zinc-700">
          {slide.eyebrow}
        </span>
        <span className="h-px w-12 bg-zinc-300" />
      </div>

      {/* the pull quote */}
      <div className="relative max-w-5xl pl-6 md:pl-10">
        {/* left rule + giant quote glyph */}
        <span
          aria-hidden
          className="absolute left-0 top-2 h-[calc(100%-1rem)] w-[3px] rounded-full bg-gradient-to-b from-amber-400 via-amber-300 to-transparent"
        />
        <span
          aria-hidden
          className="absolute -left-4 -top-16 select-none font-serif text-[12rem] font-light leading-none text-amber-300/60 md:-left-8 md:-top-24 md:text-[20rem]"
        >
          “
        </span>
        <blockquote className="relative font-serif text-3xl font-normal lowercase leading-[1.18] tracking-[-0.01em] text-zinc-900 md:text-[3.25rem]">
          {slide.quote}
        </blockquote>
      </div>

      {/* attribution as a card-like block */}
      <div className="ml-1 flex items-center gap-4 rounded-[6px] border border-zinc-200 bg-white/70 px-5 py-3 shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur md:ml-7">
        <span aria-hidden className="inline-block h-8 w-px bg-amber-400" />
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-sm lowercase font-medium text-zinc-900">
            {slide.attribution}
          </span>
          <span className="font-mono text-[11px] lowercase text-zinc-500">
            {slide.source} · {slide.year}
          </span>
        </div>
      </div>
    </section>
  );
}
