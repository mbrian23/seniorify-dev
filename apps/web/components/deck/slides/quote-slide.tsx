import type { QuoteSlide as T } from "../slides";

export function QuoteSlide({ slide }: { slide: T }) {
  return (
    <section className="flex w-full flex-col items-start gap-12">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs lowercase tracking-[0.2em] text-zinc-500">
          {slide.eyebrow}
        </span>
      </div>
      <div className="relative max-w-5xl">
        <span
          aria-hidden
          className="absolute -left-8 -top-12 select-none font-serif text-[10rem] leading-none text-amber-200/80 md:-left-16 md:-top-16 md:text-[16rem]"
        >
          “
        </span>
        <blockquote className="relative text-balance text-3xl font-medium lowercase leading-[1.2] tracking-tight text-zinc-900 md:text-5xl">
          {slide.quote}
        </blockquote>
      </div>
      <div className="flex flex-col gap-1 pl-1">
        <span className="font-mono text-sm lowercase text-zinc-900">
          — {slide.attribution}
        </span>
        <span className="font-mono text-xs lowercase text-zinc-500">
          {slide.source} · {slide.year}
        </span>
      </div>
    </section>
  );
}
