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
    <main className="relative h-screen w-screen overflow-hidden bg-white text-zinc-900 selection:bg-amber-100">
      {/* ambient grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      {/* soft radial highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[720px] w-[720px] -translate-x-1/2 rounded-full bg-amber-50 blur-3xl"
      />

      {/* slide — pointer-events disabled so empty area falls through to edge click zones; links/buttons re-enable */}
      <div className="pointer-events-none relative z-20 flex h-full w-full items-center justify-center px-6 md:px-12 [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
        <SlideFrame key={index} slide={current} index={index} />
      </div>

      {/* top bar */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5 md:px-10">
        <div className="pointer-events-auto flex items-center gap-2 font-mono text-xs lowercase text-zinc-700">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-zinc-900" />
          seniorify · deck
        </div>
        <div className="pointer-events-auto font-mono text-xs lowercase tabular-nums text-zinc-500">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>
      </header>

      {/* progress + dots */}
      <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col gap-3 px-6 py-5 md:px-10">
        <div className="flex items-center justify-between">
          <div className="pointer-events-auto flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index
                    ? "w-6 bg-zinc-900"
                    : "w-1.5 bg-zinc-300 hover:bg-zinc-500"
                }`}
              />
            ))}
          </div>
          <div className="pointer-events-auto flex items-center gap-2 font-mono text-[11px] lowercase text-zinc-500">
            <kbd className="rounded border border-zinc-200 bg-white px-1.5 py-0.5">←</kbd>
            <kbd className="rounded border border-zinc-200 bg-white px-1.5 py-0.5">→</kbd>
            <span>navigate</span>
          </div>
        </div>
        <div className="h-px w-full overflow-hidden bg-zinc-100">
          <div
            className="h-full bg-zinc-900 transition-all duration-500 ease-out"
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
