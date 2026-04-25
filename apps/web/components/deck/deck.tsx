"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Slide } from "./slides";
import { SlideFrame } from "./slide-frame";

type DeckProps = {
  slides: ReadonlyArray<Slide>;
};

export function Deck({ slides }: DeckProps) {
  const [index, setIndex] = useState(0);
  const total = slides.length;

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => {
        const next = i + delta;
        if (next < 0) return 0;
        if (next >= total) return total - 1;
        return next;
      });
    },
    [total],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "Home") {
        setIndex(0);
      } else if (e.key === "End") {
        setIndex(total - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, total]);

  // Hash sync: /deck#3 jumps to slide 3
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.replace("#", "");
      const n = Number(h);
      if (!Number.isNaN(n) && n >= 1 && n <= total) {
        setIndex(n - 1);
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [total]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const target = `#${index + 1}`;
    if (window.location.hash !== target) {
      window.history.replaceState(null, "", target);
    }
  }, [index]);

  const current = slides[index];
  const progress = useMemo(
    () => Math.round(((index + 1) / total) * 100),
    [index, total],
  );

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#fafaf7] text-zinc-900 selection:bg-amber-200/70">
      {/* paper texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, rgba(251, 191, 36, 0.18), transparent 40%), radial-gradient(circle at 80% 90%, rgba(244, 114, 182, 0.10), transparent 45%), radial-gradient(circle at 90% 10%, rgba(99, 102, 241, 0.08), transparent 50%)",
        }}
      />
      {/* dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.10) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      {/* film grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* corner ornaments */}
      <div aria-hidden className="pointer-events-none absolute left-6 top-6 h-3 w-3 border-l border-t border-zinc-900/30 md:left-10 md:top-10" />
      <div aria-hidden className="pointer-events-none absolute right-6 top-6 h-3 w-3 border-r border-t border-zinc-900/30 md:right-10 md:top-10" />
      <div aria-hidden className="pointer-events-none absolute bottom-6 left-6 h-3 w-3 border-b border-l border-zinc-900/30 md:bottom-10 md:left-10" />
      <div aria-hidden className="pointer-events-none absolute bottom-6 right-6 h-3 w-3 border-b border-r border-zinc-900/30 md:bottom-10 md:right-10" />

      {/* slide — pointer-events disabled so empty area falls through to edge click zones; links/buttons re-enable */}
      <div className="pointer-events-none relative z-20 flex h-full w-full items-center justify-center px-6 md:px-12 [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
        <SlideFrame key={index} slide={current} index={index} total={total} />
      </div>

      {/* top bar */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5 md:px-12">
        <div className="pointer-events-auto flex items-center gap-2.5 font-mono text-xs lowercase text-zinc-700">
          <span className="relative inline-flex">
            <span className="absolute inline-block h-2 w-2 animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-block h-2 w-2 rounded-full bg-amber-500" />
          </span>
          <span className="tracking-wider">seniorify</span>
          <span className="text-zinc-300">/</span>
          <span className="text-zinc-500">deck</span>
        </div>
        <div className="pointer-events-auto flex items-center gap-3 font-mono text-xs lowercase tabular-nums text-zinc-500">
          <span className="text-zinc-900">{String(index + 1).padStart(2, "0")}</span>
          <span className="text-zinc-300">—</span>
          <span>{String(total).padStart(2, "0")}</span>
        </div>
      </header>

      {/* progress + dots */}
      <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col gap-3 px-6 py-5 md:px-12">
        <div className="flex items-center justify-between">
          <div className="pointer-events-auto flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
                  i === index
                    ? "w-8 bg-zinc-900"
                    : i < index
                      ? "w-1.5 bg-zinc-400 hover:bg-zinc-600"
                      : "w-1.5 bg-zinc-300 hover:bg-zinc-500"
                }`}
              />
            ))}
          </div>
          <div className="pointer-events-auto flex items-center gap-2 font-mono text-[11px] lowercase text-zinc-500">
            <kbd className="rounded border border-zinc-300 bg-white/80 px-1.5 py-0.5 shadow-sm backdrop-blur">←</kbd>
            <kbd className="rounded border border-zinc-300 bg-white/80 px-1.5 py-0.5 shadow-sm backdrop-blur">→</kbd>
            <span>navigate</span>
          </div>
        </div>
        <div className="relative h-px w-full overflow-hidden bg-zinc-200">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-zinc-900 via-zinc-900 to-amber-500 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </footer>

      {/* invisible click zones to advance */}
      <button
        type="button"
        aria-label="previous slide"
        onClick={() => go(-1)}
        className="absolute inset-y-0 left-0 z-10 w-16 md:w-24 cursor-w-resize"
      />
      <button
        type="button"
        aria-label="next slide"
        onClick={() => go(1)}
        className="absolute inset-y-0 right-0 z-10 w-16 md:w-24 cursor-e-resize"
      />
    </main>
  );
}
