import type { TitleSlide as T } from "../slides";

export function TitleSlide({ slide }: { slide: T }) {
  return (
    <section className="flex w-full flex-col items-start gap-10">
      <div className="flex items-center gap-3">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-zinc-900" />
        <span className="font-mono text-xs lowercase tracking-[0.2em] text-zinc-500">
          {slide.eyebrow}
        </span>
      </div>
      <h1 className="max-w-5xl text-balance text-6xl font-medium lowercase leading-[1.02] tracking-tight text-zinc-900 md:text-8xl">
        {slide.title}
      </h1>
      <p className="max-w-2xl text-balance text-lg lowercase leading-relaxed text-zinc-500 md:text-xl">
        {slide.subtitle}
      </p>
      <div className="mt-4 flex items-center gap-3 font-mono text-xs lowercase text-zinc-400">
        <span className="h-px w-8 bg-zinc-300" />
        <span>press → to begin</span>
      </div>
    </section>
  );
}
