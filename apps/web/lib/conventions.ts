import type { TeamConventions } from "@seniorify/core";
import { sql, ensureSchema } from "./db";

/**
 * Default rules used to seed the team_settings row on first read. The
 * manager edits these from /manager/settings; this file just ships a
 * sensible starting point so empty DBs aren't useless.
 */
const DEFAULT_RULES: string[] = [
  "Use the internal http client at @acme/http for outbound calls; never axios or fetch directly.",
  "All new endpoints must register with @acme/observability for tracing.",
  "Logger: @acme/log only. No console.log in committed code.",
  "Retries: must use @acme/retry with idempotency-key header.",
  "PII: never log request bodies that may contain PII (compliance).",
];

const DEFAULT_ID = "default";

type Row = { id: string; rules: string[]; updated_at: string };

export async function getTeamConventions(): Promise<TeamConventions> {
  await ensureSchema();
  const rows = (await sql`
    SELECT id, rules, updated_at
    FROM team_settings
    WHERE id = ${DEFAULT_ID}
    LIMIT 1
  `) as Row[];

  if (rows[0]) {
    return { rules: rows[0].rules ?? [] };
  }

  // First read: seed and return.
  await sql`
    INSERT INTO team_settings (id, rules)
    VALUES (${DEFAULT_ID}, ${JSON.stringify(DEFAULT_RULES)}::jsonb)
    ON CONFLICT (id) DO NOTHING
  `;
  return { rules: DEFAULT_RULES };
}

export async function setTeamConventions(
  rules: string[],
): Promise<TeamConventions> {
  await ensureSchema();
  const cleaned = rules
    .map((r) => r.trim())
    .filter((r) => r.length > 0)
    .slice(0, 50);
  await sql`
    INSERT INTO team_settings (id, rules, updated_at)
    VALUES (${DEFAULT_ID}, ${JSON.stringify(cleaned)}::jsonb, now())
    ON CONFLICT (id) DO UPDATE
    SET rules = EXCLUDED.rules,
        updated_at = EXCLUDED.updated_at
  `;
  return { rules: cleaned };
}

/**
 * Synchronous default export retained for callers that want the starter
 * set without DB I/O (tests, local scripts, fallback paths).
 */
export const teamConventions: TeamConventions = { rules: DEFAULT_RULES };
