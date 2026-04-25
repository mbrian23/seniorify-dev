export function ReadinessMeter({
  filled,
  total = 5,
}: {
  filled: number;
  total?: number;
}) {
  const cells = Array.from({ length: total }, (_, i) => i < filled);
  return (
    <div className="flex items-center gap-1">
      {cells.map((on, i) => (
        <div
          key={i}
          className={
            on
              ? "h-3 w-3 rounded-[2px] bg-zinc-900"
              : "h-3 w-3 rounded-[2px] border border-zinc-200"
          }
        />
      ))}
      <span className="ml-2 font-mono text-xs text-zinc-500 tabular-nums">
        {filled}/{total}
      </span>
    </div>
  );
}
