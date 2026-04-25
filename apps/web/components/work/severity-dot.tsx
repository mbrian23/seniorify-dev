import type { Severity } from "@seniorify/core";

const COLORS: Record<Severity, string> = {
  block: "#B91C1C",
  warn: "#B45309",
  ok: "#15803D",
};

export function SeverityDot({
  severity,
  size = 8,
}: {
  severity: Severity;
  size?: number;
}) {
  return (
    <span
      aria-hidden
      className="inline-block shrink-0 rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: COLORS[severity],
      }}
    />
  );
}
