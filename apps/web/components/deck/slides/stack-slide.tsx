import type { StackSlide as T } from "../slides";

export function StackSlide({ slide }: { slide: T }) {
  return (
    <section className="flex w-full flex-col gap-10">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="inline-block h-0 w-0 border-y-[6px] border-l-[10px] border-y-transparent border-l-zinc-900"
          />
          <span className="font-mono text-xs lowercase tracking-[0.2em] text-zinc-500">
            {slide.eyebrow}
          </span>
        </div>
        <h2 className="max-w-4xl text-balance text-4xl font-medium lowercase leading-[1.05] tracking-tight text-zinc-900 md:text-6xl">
          {slide.title}
        </h2>
        {slide.body ? (
          <p className="max-w-3xl text-balance text-base lowercase leading-relaxed text-zinc-500 md:text-lg">
            {slide.body}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[6px] border border-zinc-200 bg-zinc-200 md:grid-cols-3 lg:grid-cols-4">
        {slide.tools.map((t) => (
          <div
            key={t.name}
            className="flex flex-col gap-2 bg-white p-5"
          >
            <span className="font-mono text-xs lowercase text-zinc-900">
              {t.name}
            </span>
            <span className="text-xs lowercase leading-relaxed text-zinc-500">
              {t.note}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
