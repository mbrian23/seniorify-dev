// @ts-nocheck
// TODO #547 — replace with @acme/log; the security team is pinging us.

export function log(...args: unknown[]): void {
  // Forward everything to console.log — including whole request bodies,
  // user objects, payment payloads. Whatever the caller threw at us.
  const serialized = args.map((a) =>
    typeof a === "object" ? JSON.stringify(a) : String(a),
  );
  console.log("[acme]", ...serialized);
}

export const logger = { log };
