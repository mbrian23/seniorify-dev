type Pillar = {
  label: string;
  body: string;
};

const PILLARS: ReadonlyArray<Pillar> = [
  {
    label: "dora",
    body: "audited PRs ship cleaner. CFR, lead time, and MTTR correlated to your audit coverage.",
  },
  {
    label: "compliance",
    body: "every ai-assisted change has a named human owner and a reasoning trail. exportable for SOC 2 and EU AI Act.",
  },
  {
    label: "conventions",
    body: "your ai agent doesn't know your team uses internal/http. seniorify does.",
  },
];

export function PillarStrip() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
          manager superpowers
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
          {PILLARS.length} pillars
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {PILLARS.map((pillar, i) => (
          <div
            key={pillar.label}
            className="group flex flex-col gap-3 rounded-[4px] border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-300"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs lowercase text-zinc-900">
                {pillar.label}
              </span>
              <span className="font-mono text-[10px] tabular-nums text-zinc-400">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <p className="text-sm leading-relaxed lowercase text-zinc-500">
              {pillar.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
