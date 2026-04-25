import type { AudienceSlide as T } from "../slides";

export function AudienceSlide({ slide }: { slide: T }) {
  return (
    <section className="flex w-full flex-col gap-12">
      <div className="flex flex-col gap-4">
        <span className="font-mono text-xs lowercase tracking-[0.2em] text-zinc-500">
          {slide.eyebrow}
        </span>
        <h2 className="max-w-4xl text-balance text-5xl font-medium lowercase leading-[1.05] tracking-tight text-zinc-900 md:text-7xl">
          {slide.title}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[6px] border border-zinc-200 bg-zinc-200 md:grid-cols-2">
        {slide.sides.map((s) => (
          <div key={s.label} className="flex flex-col gap-4 bg-white p-8 md:p-10">
            <span className="font-mono text-xs lowercase text-zinc-500">
              / {s.label}
            </span>
            <h3 className="text-balance text-2xl font-medium lowercase leading-tight text-zinc-900 md:text-3xl">
              {s.headline}
            </h3>
            <p className="text-balance text-base lowercase leading-relaxed text-zinc-700 md:text-lg">
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
