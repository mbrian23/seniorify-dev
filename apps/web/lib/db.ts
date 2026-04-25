import { neon } from "@neondatabase/serverless";

const url =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL ??
  process.env.POSTGRES_PRISMA_URL;

if (!url) {
  throw new Error(
    "No Postgres connection string. Set DATABASE_URL or POSTGRES_URL.",
  );
}

export const sql = neon(url);

let migrated: Promise<void> | null = null;

/**
 * Idempotent schema bootstrap. Called lazily on the first store call per
 * cold start. Cheap because all statements are CREATE TABLE IF NOT EXISTS.
 */
export function ensureSchema(): Promise<void> {
  if (migrated) return migrated;
  migrated = (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS plans (
        id           TEXT        PRIMARY KEY,
        author_id    TEXT        NOT NULL,
        ticket_ref   TEXT        NOT NULL,
        draft        TEXT        NOT NULL,
        findings     JSONB       NOT NULL DEFAULT '[]'::jsonb,
        signed_plan  TEXT,
        signed_at    TIMESTAMPTZ,
        summary      TEXT,
        status       TEXT        NOT NULL DEFAULT 'auditing',
        created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS plans_author_id_idx ON plans(author_id)`;
    await sql`CREATE INDEX IF NOT EXISTS plans_signed_at_idx ON plans(signed_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS plans_created_at_idx ON plans(created_at DESC)`;
  })();
  return migrated;
}
