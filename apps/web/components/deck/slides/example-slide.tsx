import type { ExampleSlide as T } from "../slides";

const ROLE_STYLES: Record<
  T["steps"][number]["role"],
  { dot: string; ring: string; mono: boolean }
> = {
  junior: { dot: "bg-zinc-400", ring: "border-zinc-200", mono: false },
  ai: { dot: "bg-zinc-900", ring: "border-zinc-200", mono: true },
  seniorify: { dot: "bg-amber-400", ring: "border-amber-300", mono: false },
};

export function ExampleSlide({ slide }: { slide: T }) {
  return (
    <section className="flex w-full flex-col gap-10">
      <div className="flex flex-col gap-4">
        <span className="font-mono text-xs lowercase tracking-[0.2em] text-zinc-500">
          {slide.eyebrow}
        </span>
        <h2 className="max-w-4xl text-balance text-4xl font-medium lowercase leading-[1.05] tracking-tight text-zinc-900 md:text-6xl">
          {slide.title}
        </h2>
      </div>
      <div className="flex flex-col gap-3">
        {slide.steps.map((s, i) => {
          const style = ROLE_STYLES[s.role];
          const isHighlight = s.role === "seniorify";
          return (
            <div
              key={i}
              className={`flex flex-col gap-3 rounded-[6px] border bg-white p-5 md:p-6 ${
                isHighlight
                  ? "border-amber-300 bg-amber-50/60 shadow-[0_0_0_4px_rgba(251,191,36,0.08)]"
                  : style.ring
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`inline-block h-1.5 w-1.5 rounded-full ${style.dot}`} />
                <span className="font-mono text-xs lowercase text-zinc-700">
                  {s.label}
                </span>
              </div>
              <p
                className={`whitespace-pre-wrap text-balance text-base leading-relaxed text-zinc-900 md:text-lg ${
                  style.mono ? "font-mono text-sm md:text-[15px]" : "lowercase"
                }`}
              >
                {s.content}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
