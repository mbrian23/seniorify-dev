import type { TitleSlide as T } from "../slides";

export function TitleSlide({ slide }: { slide: T }) {
  return (
    <section className="relative flex w-full flex-col items-start gap-10">
      {/* eyebrow row with rotating spark */}
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="inline-block animate-[spin_8s_linear_infinite] text-amber-500"
          style={{ animation: "spin 12s linear infinite" }}
        >
          ✦
        </span>
        <span className="font-mono text-xs lowercase tracking-[0.3em] text-zinc-500">
          {slide.eyebrow}
        </span>
        <span className="h-px w-12 bg-zinc-300" />
      </div>

      {/* the headline — big sans with the punchline marked by an amber highlighter */}
      <h1 className="relative max-w-5xl text-balance text-6xl font-medium lowercase leading-[0.95] tracking-[-0.03em] text-zinc-900 md:text-[7.5rem]">
        <span className="relative inline-block">
          <span className="relative z-10">{slide.title}</span>
          <span
            aria-hidden
            className="absolute -bottom-1 left-0 right-0 z-0 h-[0.18em] origin-left bg-gradient-to-r from-amber-300/80 via-amber-300/80 to-transparent"
            style={{ animation: "underline-grow 900ms 600ms cubic-bezier(0.2, 0.7, 0.2, 1) both" }}
          />
        </span>
      </h1>

      <p className="max-w-2xl text-balance text-lg lowercase leading-relaxed text-zinc-600 md:text-2xl">
        {slide.subtitle}
      </p>

      <div className="mt-2 flex items-center gap-3 font-mono text-xs lowercase text-zinc-500">
        <span className="h-px w-10 bg-zinc-400" />
        <span>press</span>
        <kbd className="rounded border border-zinc-300 bg-white/80 px-1.5 py-0.5 shadow-sm">→</kbd>
        <span>to begin</span>
      </div>
    </section>
  );
}
