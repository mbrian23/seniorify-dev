import type { StackSlide as T } from "../slides";

export function StackSlide({ slide }: { slide: T }) {
  return (
    <section className="relative flex w-full flex-col gap-10">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="inline-block h-0 w-0 border-y-[6px] border-l-[10px] border-y-transparent border-l-zinc-900"
          />
          <span className="font-mono text-xs lowercase tracking-[0.3em] text-zinc-700">
            {slide.eyebrow}
          </span>
          <span className="h-px w-12 bg-zinc-300" />
        </div>
        <h2 className="max-w-4xl text-balance text-4xl font-medium lowercase leading-[1.0] tracking-[-0.025em] text-zinc-900 md:text-[4.5rem]">
          {slide.title}
        </h2>
        {slide.body ? (
          <p className="max-w-3xl text-balance font-serif text-lg italic leading-relaxed text-zinc-600 md:text-xl">
            {slide.body}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
        {slide.tools.map((t, i) => (
          <div
            key={t.name}
            className="group relative flex flex-col gap-2 overflow-hidden rounded-[8px] border border-zinc-200 bg-white/85 p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-white"
          >
            <span
              aria-hidden
              className="absolute -bottom-px left-0 h-[2px] w-0 bg-amber-400 transition-all duration-300 group-hover:w-full"
            />
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs lowercase text-zinc-900">
                {t.name}
              </span>
              <span className="font-mono text-[10px] tabular-nums text-zinc-300">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <span className="text-xs lowercase leading-relaxed text-zinc-500">
              {t.note}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
