"use client";

import type { Slide } from "./slides";
import { TitleSlide } from "./slides/title-slide";
import { StatementSlide } from "./slides/statement-slide";
import { QuoteSlide } from "./slides/quote-slide";
import { PillarsSlide } from "./slides/pillars-slide";
import { ClosingSlide } from "./slides/closing-slide";

type Props = {
  slide: Slide;
  index: number;
};

export function SlideFrame({ slide, index }: Props) {
  return (
    <div
      key={index}
      className="animate-slide-in flex h-full w-full max-w-[1200px] items-center justify-center"
    >
      {render(slide)}
      <style>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(12px); filter: blur(6px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0); }
        }
        .animate-slide-in { animation: slide-in 480ms cubic-bezier(0.2, 0.7, 0.2, 1) both; }
        .animate-slide-in > * > * { animation: slide-in 640ms cubic-bezier(0.2, 0.7, 0.2, 1) both; }
        .animate-slide-in > * > *:nth-child(2) { animation-delay: 80ms; }
        .animate-slide-in > * > *:nth-child(3) { animation-delay: 160ms; }
        .animate-slide-in > * > *:nth-child(4) { animation-delay: 240ms; }
        .animate-slide-in > * > *:nth-child(5) { animation-delay: 320ms; }
      `}</style>
    </div>
  );
}

function render(slide: Slide) {
  switch (slide.kind) {
    case "title":
      return <TitleSlide slide={slide} />;
    case "statement":
      return <StatementSlide slide={slide} />;
    case "quote":
      return <QuoteSlide slide={slide} />;
    case "pillars":
      return <PillarsSlide slide={slide} />;
    case "closing":
      return <ClosingSlide slide={slide} />;
    // research / audience / example slide types exist in slides.ts but
    // their renderers haven't been wired yet — return null so the deck
    // builds. TODO: add the missing slide components.
    case "research":
    case "audience":
    case "example":
      return null;
  }
}
