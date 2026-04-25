export function FindingsBar({
  value,
  max,
}: {
  value: number;
  max: number;
}) {
  const safeMax = max <= 0 ? 1 : max;
  const ratio = Math.min(1, Math.max(0, value / safeMax));
  const widthPct = Math.round(ratio * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-sm text-zinc-900 tabular-nums w-10">
        {value.toFixed(1)}
      </span>
      <div className="h-1.5 w-24 rounded-[2px] border border-zinc-200 overflow-hidden">
        <div
          className="h-full bg-zinc-900"
          style={{ width: `${widthPct}%` }}
        />
      </div>
    </div>
  );
}
