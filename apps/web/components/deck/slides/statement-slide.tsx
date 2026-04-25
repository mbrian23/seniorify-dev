import type { StatementSlide as T } from "../slides";

type Props = {
  slide: T;
};

export function StatementSlide({ slide }: Props) {
  return (
    <section className="relative flex w-full flex-col items-start gap-10">
      {/* eyebrow row */}
      <div className="flex items-center gap-3">
        <span aria-hidden className="inline-block h-1 w-1 rotate-45 bg-amber-500" />
        <span className="font-mono text-xs lowercase tracking-[0.3em] text-zinc-700">
          {slide.eyebrow}
        </span>
        <span className="h-px w-12 bg-zinc-300" />
      </div>

      {/* the headline — oversize with a soft amber stroke under the last line */}
      <h2 className="relative max-w-5xl text-balance text-5xl font-medium lowercase leading-[1.0] tracking-[-0.025em] text-zinc-900 md:text-[6rem]">
        <span className="relative">
          {slide.title}
          <span
            aria-hidden
            className="absolute -bottom-3 left-0 h-[6px] w-32 origin-left rounded-full bg-amber-400/80 md:-bottom-4 md:w-48"
            style={{ animation: "underline-grow 900ms 500ms cubic-bezier(0.2, 0.7, 0.2, 1) both" }}
          />
        </span>
      </h2>

      {slide.body ? (
        <div className="flex max-w-3xl items-start gap-4">
          <span aria-hidden className="mt-3 h-px w-8 shrink-0 bg-zinc-400" />
          <p className="text-balance font-serif text-xl italic leading-relaxed text-zinc-600 md:text-2xl">
            {slide.body}
          </p>
        </div>
      ) : null}
    </section>
  );
}
