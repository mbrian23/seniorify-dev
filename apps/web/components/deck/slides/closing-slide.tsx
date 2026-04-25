import Link from "next/link";
import type { ClosingSlide as T } from "../slides";

export function ClosingSlide({ slide }: { slide: T }) {
  return (
    <section className="flex w-full flex-col items-start gap-10">
      <div className="flex items-center gap-3">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-zinc-900" />
        <span className="font-mono text-xs lowercase tracking-[0.2em] text-zinc-500">
          {slide.eyebrow}
        </span>
      </div>
      <h2 className="max-w-5xl text-balance text-6xl font-medium lowercase leading-[1.02] tracking-tight text-zinc-900 md:text-8xl">
        {slide.title}
      </h2>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={slide.href}
          className="inline-flex h-11 items-center justify-center rounded-[4px] border border-zinc-900 bg-zinc-900 px-5 font-mono text-xs lowercase text-white transition-colors hover:bg-zinc-800"
        >
          {slide.cta}
        </Link>
        <Link
          href="https://seniorify.dev"
          className="inline-flex h-11 items-center justify-center rounded-[4px] border border-zinc-200 bg-white px-5 font-mono text-xs lowercase text-zinc-900 transition-colors hover:border-zinc-300"
        >
          back to seniorify.dev
        </Link>
      </div>
      <span className="font-mono text-xs lowercase text-zinc-400">
        thank you.
      </span>
    </section>
  );
}
