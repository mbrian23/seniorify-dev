import Link from "next/link";
import type { ClosingSlide as T } from "../slides";

export function ClosingSlide({ slide }: { slide: T }) {
  return (
    <section className="relative flex w-full flex-col items-start gap-10">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="inline-block text-amber-500"
          style={{ animation: "spin 12s linear infinite" }}
        >
          ✦
        </span>
        <span className="font-mono text-xs lowercase tracking-[0.3em] text-zinc-500">
          {slide.eyebrow}
        </span>
        <span className="h-px w-12 bg-zinc-300" />
      </div>

      <h2 className="relative max-w-5xl text-balance text-6xl font-medium lowercase leading-[0.95] tracking-[-0.03em] text-zinc-900 md:text-[7.5rem]">
        <span className="relative inline-block">
          <span className="relative z-10">{slide.title}</span>
          <span
            aria-hidden
            className="absolute -bottom-1 left-0 right-0 z-0 h-[0.18em] origin-left bg-gradient-to-r from-amber-300/80 via-amber-300/60 to-transparent"
            style={{ animation: "underline-grow 900ms 600ms cubic-bezier(0.2, 0.7, 0.2, 1) both" }}
          />
        </span>
      </h2>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={slide.href}
          className="group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-[6px] border border-zinc-900 bg-zinc-900 px-6 font-mono text-xs lowercase text-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.4)] transition-all hover:bg-zinc-800 hover:shadow-[0_12px_28px_-12px_rgba(0,0,0,0.5)]"
        >
          <span
            aria-hidden
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"
          />
          <span className="relative">{slide.cta}</span>
          <span className="relative inline-block transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
        <Link
          href="https://seniorify.dev"
          className="inline-flex h-12 items-center justify-center rounded-[6px] border border-zinc-200 bg-white/80 px-6 font-mono text-xs lowercase text-zinc-900 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-white"
        >
          back to seniorify.dev
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <span aria-hidden className="h-px w-10 bg-zinc-300" />
        <span className="font-mono text-xs lowercase tracking-wider text-zinc-400">
          thank you.
        </span>
      </div>
    </section>
  );
}
