import Image from "next/image";
import Link from "next/link";
import type { ContactSlide as T } from "../slides";

export function ContactSlide({ slide }: { slide: T }) {
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

      <div className="grid w-full grid-cols-1 items-center gap-12 md:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-6">
          <h2 className="relative max-w-3xl text-balance text-5xl font-medium lowercase leading-[0.98] tracking-[-0.03em] text-zinc-900 md:text-7xl">
            {slide.title}
          </h2>
          {slide.body ? (
            <p className="max-w-xl text-pretty text-lg leading-relaxed text-zinc-600 md:text-xl">
              {slide.body}
            </p>
          ) : null}
          <div className="flex flex-col gap-1.5 pt-2 font-mono text-sm lowercase text-zinc-700">
            <span className="text-[11px] tracking-[0.3em] text-zinc-400">
              {slide.handleLabel}
            </span>
            <Link
              href={slide.href}
              className="group inline-flex items-center gap-2 text-zinc-900 transition-colors hover:text-amber-600"
            >
              <span className="border-b border-dashed border-zinc-300 pb-0.5 group-hover:border-amber-500">
                {slide.handle}
              </span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>

        <Link
          href={slide.href}
          className="group relative flex flex-col items-center gap-3 rounded-[10px] border border-zinc-200 bg-white/90 p-5 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.18)] backdrop-blur transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-[0_14px_32px_-14px_rgba(0,0,0,0.28)]"
          aria-label={`open ${slide.handle}`}
        >
          <div className="relative h-[260px] w-[260px] md:h-[320px] md:w-[320px]">
            <Image
              src={slide.qrSrc}
              alt={`qr code linking to ${slide.handle}`}
              fill
              priority
              className="object-contain"
            />
          </div>
          <span className="font-mono text-[11px] lowercase tracking-[0.25em] text-zinc-500 group-hover:text-zinc-900">
            scan ↗
          </span>
        </Link>
      </div>
    </section>
  );
}
