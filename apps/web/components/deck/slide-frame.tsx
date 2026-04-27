"use client";

import type { Slide } from "./slides";
import { TitleSlide } from "./slides/title-slide";
import { StatementSlide } from "./slides/statement-slide";
import { QuoteSlide } from "./slides/quote-slide";
import { PillarsSlide } from "./slides/pillars-slide";
import { ResearchSlide } from "./slides/research-slide";
import { AudienceSlide } from "./slides/audience-slide";
import { ExampleSlide } from "./slides/example-slide";
import { MechanismSlide } from "./slides/mechanism-slide";
import { StackSlide } from "./slides/stack-slide";
import { CatchesSlide } from "./slides/catches-slide";
import { ClosingSlide } from "./slides/closing-slide";
import { HorizonSlide } from "./slides/horizon-slide";
import { ContactSlide } from "./slides/contact-slide";

type Props = {
  slide: Slide;
  index: number;
  total: number;
};

export function SlideFrame({ slide, index, total }: Props) {
  return (
    <div
      key={index}
      className="animate-slide-in relative flex h-full w-full max-w-[1200px] items-center justify-center"
    >
      {/* giant background chapter numeral — cinematic anchor */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-4 top-2 select-none font-serif text-[18rem] font-light leading-none tracking-tighter text-zinc-900/[0.025] md:-right-8 md:text-[28rem]"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="relative w-full">{render(slide, index, total)}</div>
      <style>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(16px); filter: blur(8px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0); }
        }
        @keyframes word-rise {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes underline-grow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .animate-slide-in { animation: slide-in 560ms cubic-bezier(0.2, 0.7, 0.2, 1) both; }
        .animate-slide-in > div > * > * { animation: slide-in 720ms cubic-bezier(0.2, 0.7, 0.2, 1) both; }
        .animate-slide-in > div > * > *:nth-child(2) { animation-delay: 90ms; }
        .animate-slide-in > div > * > *:nth-child(3) { animation-delay: 180ms; }
        .animate-slide-in > div > * > *:nth-child(4) { animation-delay: 270ms; }
        .animate-slide-in > div > * > *:nth-child(5) { animation-delay: 360ms; }
        .animate-slide-in > div > * > *:nth-child(6) { animation-delay: 440ms; }
      `}</style>
    </div>
  );
}

function render(slide: Slide, _index: number, _total: number) {
  switch (slide.kind) {
    case "title":
      return <TitleSlide slide={slide} />;
    case "statement":
      return <StatementSlide slide={slide} />;
    case "quote":
      return <QuoteSlide slide={slide} />;
    case "pillars":
      return <PillarsSlide slide={slide} />;
    case "research":
      return <ResearchSlide slide={slide} />;
    case "audience":
      return <AudienceSlide slide={slide} />;
    case "example":
      return <ExampleSlide slide={slide} />;
    case "mechanism":
      return <MechanismSlide slide={slide} />;
    case "stack":
      return <StackSlide slide={slide} />;
    case "catches":
      return <CatchesSlide slide={slide} />;
    case "closing":
      return <ClosingSlide slide={slide} />;
    case "horizon":
      return <HorizonSlide slide={slide} />;
    case "contact":
      return <ContactSlide slide={slide} />;
  }
}
