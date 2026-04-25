export function KpiTile({
  label,
  value,
  delta,
  badge,
}: {
  label: string;
  value: string;
  delta?: string;
  badge?: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-[4px] border border-zinc-200 p-6">
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-zinc-500 lowercase">{label}</span>
        {badge ? (
          <sup className="font-mono text-[9px] uppercase tracking-wide text-zinc-400">
            {badge}
          </sup>
        ) : null}
      </div>
      <span className="font-mono text-3xl text-zinc-900 tabular-nums">
        {value}
      </span>
      <span className="text-xs text-zinc-500 min-h-[1rem]">
        {delta ?? ""}
      </span>
    </div>
  );
}
