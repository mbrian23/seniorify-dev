import type { ExampleSlide as T } from "../slides";

const ROLE_STYLES: Record<
  T["steps"][number]["role"],
  {
    dot: string;
    chrome: string;
    border: string;
    bg: string;
    mono: boolean;
    glyph: string;
  }
> = {
  junior: {
    dot: "bg-zinc-400",
    chrome: "bg-zinc-100",
    border: "border-zinc-200",
    bg: "bg-white/85",
    mono: false,
    glyph: "→",
  },
  ai: {
    dot: "bg-zinc-900",
    chrome: "bg-zinc-900",
    border: "border-zinc-900",
    bg: "bg-zinc-950",
    mono: true,
    glyph: "▶",
  },
  seniorify: {
    dot: "bg-amber-500",
    chrome: "bg-amber-100",
    border: "border-amber-300",
    bg: "bg-gradient-to-br from-amber-50/80 via-amber-50/40 to-white/80",
    mono: false,
    glyph: "✦",
  },
};

export function ExampleSlide({ slide }: { slide: T }) {
  return (
    <section className="relative flex w-full flex-col gap-9">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <span aria-hidden className="inline-block h-1 w-1 rotate-45 bg-amber-500" />
          <span className="font-mono text-xs lowercase tracking-[0.3em] text-zinc-700">
            {slide.eyebrow}
          </span>
          <span className="h-px w-12 bg-zinc-300" />
        </div>
        <h2 className="max-w-4xl text-balance text-4xl font-medium lowercase leading-[1.0] tracking-[-0.025em] text-zinc-900 md:text-[4.5rem]">
          {slide.title}
        </h2>
      </div>
      <div className="flex flex-col gap-3">
        {slide.steps.map((s, i) => {
          const style = ROLE_STYLES[s.role];
          const isAI = s.role === "ai";
          const isSeniorify = s.role === "seniorify";
          return (
            <div
              key={i}
              className={`relative overflow-hidden rounded-[10px] border ${style.border} ${style.bg} shadow-[0_1px_0_rgba(0,0,0,0.04)] ${isSeniorify ? "ring-4 ring-amber-200/40" : ""}`}
            >
              {/* chrome bar — IDE/terminal style */}
              <div
                className={`flex items-center justify-between px-4 py-2 ${style.chrome} ${isAI ? "border-b border-zinc-800" : "border-b border-zinc-200/80"}`}
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className={`inline-block h-2 w-2 rounded-full ${isAI ? "bg-zinc-700" : "bg-zinc-300"}`} />
                    <span className={`inline-block h-2 w-2 rounded-full ${isAI ? "bg-zinc-700" : "bg-zinc-300"}`} />
                    <span className={`inline-block h-2 w-2 rounded-full ${isAI ? "bg-zinc-700" : "bg-zinc-300"}`} />
                  </div>
                  <span className="ml-2 inline-flex items-center gap-2">
                    <span className={`inline-block h-1.5 w-1.5 rounded-full ${style.dot}`} />
                    <span className={`font-mono text-xs lowercase ${isAI ? "text-zinc-400" : "text-zinc-700"}`}>
                      {s.label}
                    </span>
                  </span>
                </div>
                <span className={`font-mono text-[10px] tabular-nums ${isAI ? "text-zinc-500" : "text-zinc-400"}`}>
                  {String(i + 1).padStart(2, "0")} {style.glyph}
                </span>
              </div>
              {/* content */}
              <div className="px-5 py-5 md:px-6 md:py-5">
                <p
                  className={`whitespace-pre-wrap text-balance leading-relaxed ${
                    style.mono
                      ? "font-mono text-[13px] text-emerald-300 md:text-sm"
                      : isSeniorify
                        ? "text-base lowercase text-zinc-900 md:text-lg"
                        : "text-base lowercase text-zinc-800 md:text-lg"
                  }`}
                >
                  {s.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
