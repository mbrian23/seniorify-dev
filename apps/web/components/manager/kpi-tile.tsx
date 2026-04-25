type Direction = "up" | "down" | "neutral";

const DIRECTION_COLOR: Record<Direction, string> = {
  up: "text-emerald-700",
  down: "text-rose-700",
  neutral: "text-zinc-500",
};

const DIRECTION_GLYPH: Record<Direction, string> = {
  up: "↑",
  down: "↓",
  neutral: "·",
};

/**
 * Auto-detect direction from the delta string when not explicitly provided.
 * "-3pt", "-0.7d", "-8m" → improvement (down) for failure-rate / time metrics.
 * "+5%", "+12" → up. "steady" / no sign → neutral.
 *
 * Note: in DORA, lower is better for CFR / lead time / MTTR, so a `-` prefix
 * is a positive signal — we use a green ↓ to communicate that.
 */
function inferDirection(delta?: string): Direction {
  if (!delta) return "neutral";
  const trimmed = delta.trim();
  if (trimmed.startsWith("-")) return "down";
  if (trimmed.startsWith("+")) return "up";
  return "neutral";
}

export function KpiTile({
  label,
  value,
  delta,
  badge,
  direction,
  trend = "down-good",
}: {
  label: string;
  value: string;
  delta?: string;
  badge?: string;
  direction?: Direction;
  /**
   * For DORA-style metrics, a decrease is positive (down-good).
   * For most product metrics, an increase is positive (up-good).
   */
  trend?: "up-good" | "down-good";
}) {
  const inferred = direction ?? inferDirection(delta);
  // Color the arrow based on whether the movement is "good" given the trend.
  const semantic: Direction =
    inferred === "neutral"
      ? "neutral"
      : trend === "down-good"
        ? inferred === "down"
          ? "up" // green
          : "down" // red
        : inferred;

  return (
    <div className="group flex flex-col gap-3 rounded-[4px] border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-300">
      <div className="flex items-center gap-1.5">
        <span className="text-xs lowercase text-zinc-500">{label}</span>
        {badge ? (
          <sup className="font-mono text-[9px] uppercase tracking-wide text-zinc-400">
            {badge}
          </sup>
        ) : null}
      </div>
      <span className="font-mono text-3xl tabular-nums text-zinc-900">
        {value}
      </span>
      <span className="flex min-h-[1rem] items-center gap-1.5 text-xs">
        {delta ? (
          <span
            aria-hidden
            className={`font-mono text-[10px] ${DIRECTION_COLOR[semantic]}`}
          >
            {DIRECTION_GLYPH[semantic]}
          </span>
        ) : null}
        <span className="text-zinc-500">{delta ?? ""}</span>
      </span>
    </div>
  );
}
