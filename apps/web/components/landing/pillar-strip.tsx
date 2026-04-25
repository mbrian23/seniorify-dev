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
    <section className="flex flex-col gap-3">
      <span className="font-mono text-xs lowercase text-zinc-500">
        manager superpowers
      </span>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {PILLARS.map((pillar) => (
          <div
            key={pillar.label}
            className="flex flex-col gap-3 rounded-[4px] border border-zinc-200 bg-white p-6"
          >
            <span className="font-mono text-xs lowercase text-zinc-900">
              {pillar.label}
            </span>
            <p className="text-sm leading-relaxed lowercase text-zinc-500">
              {pillar.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
