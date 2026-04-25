type Verb = {
  label: string;
  body: string;
};

const VERBS: ReadonlyArray<Verb> = [
  {
    label: "help",
    body: "the questions a senior would ask, surfaced while the junior is working — not after the PR is rejected.",
  },
  {
    label: "audit",
    body: "every ai-assisted plan becomes a signed, dated record. one page, plain english, attached to the PR.",
  },
  {
    label: "learn",
    body: "patterns surface across the team. recurring findings become coaching opportunities, not repeated review comments.",
  },
  {
    label: "never block",
    body: "even on a block-severity finding, the junior can defend, escalate, or override. visibility is the lever, not gatekeeping.",
  },
];

export function VerbStrip() {
  return (
    <section className="grid grid-cols-1 gap-px overflow-hidden rounded-[4px] border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-4">
      {VERBS.map((verb) => (
        <div
          key={verb.label}
          className="flex flex-col gap-3 bg-white p-6"
        >
          <span className="font-mono text-xs lowercase text-zinc-900">
            {verb.label}
          </span>
          <p className="text-sm leading-relaxed lowercase text-zinc-500">
            {verb.body}
          </p>
        </div>
      ))}
    </section>
  );
}
