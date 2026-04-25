import type { StatementSlide as T } from "../slides";

export function StatementSlide({ slide }: { slide: T }) {
  return (
    <section className="flex w-full flex-col items-start gap-10">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs lowercase tracking-[0.2em] text-zinc-500">
          {slide.eyebrow}
        </span>
      </div>
      <h2 className="max-w-5xl text-balance text-5xl font-medium lowercase leading-[1.05] tracking-tight text-zinc-900 md:text-7xl">
        {slide.title}
      </h2>
      {slide.body ? (
        <p className="max-w-3xl text-balance text-lg lowercase leading-relaxed text-zinc-500 md:text-2xl">
          {slide.body}
        </p>
      ) : null}
    </section>
  );
}
