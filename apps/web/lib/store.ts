import { randomUUID } from "node:crypto";
import type { Finding, Plan } from "@seniorify/core";
import { sql, ensureSchema } from "./db";

type Row = {
  id: string;
  author_id: string;
  ticket_ref: string;
  draft: string;
  findings: Finding[];
  signed_plan: string | null;
  signed_at: string | null;
  summary: string | null;
  status: string;
  created_at: string;
};

function rowToPlan(r: Row): Plan {
  return {
    id: r.id,
    authorId: r.author_id,
    ticketRef: r.ticket_ref,
    draft: r.draft,
    revisions: [],
    findings: r.findings ?? [],
    signedPlan: r.signed_plan ?? undefined,
    signedAt: r.signed_at ?? undefined,
    summary: r.summary ?? undefined,
    createdAt: r.created_at,
  };
}

export async function getAllPlans(): Promise<Plan[]> {
  await ensureSchema();
  const rows = (await sql`SELECT * FROM plans ORDER BY created_at DESC`) as Row[];
  return rows.map(rowToPlan);
}

export async function getPlan(id: string): Promise<Plan | null> {
  await ensureSchema();
  const rows = (await sql`SELECT * FROM plans WHERE id = ${id} LIMIT 1`) as Row[];
  return rows[0] ? rowToPlan(rows[0]) : null;
}

export async function createPlan(input: {
  authorId: string;
  ticketRef: string;
  draft: string;
}): Promise<Plan> {
  await ensureSchema();
  const id = `pln_${randomUUID().slice(0, 8)}`;
  const rows = (await sql`
    INSERT INTO plans (id, author_id, ticket_ref, draft, findings, status)
    VALUES (${id}, ${input.authorId}, ${input.ticketRef}, ${input.draft}, '[]'::jsonb, 'auditing')
    RETURNING *
  `) as Row[];
  return rowToPlan(rows[0]);
}

export async function setStatus(planId: string, status: string): Promise<void> {
  await ensureSchema();
  await sql`UPDATE plans SET status = ${status} WHERE id = ${planId}`;
}

export async function addFindings(
  planId: string,
  findings: Finding[],
): Promise<Plan> {
  await ensureSchema();
  const existing = await getPlan(planId);
  if (!existing) throw new Error(`plan not found: ${planId}`);
  const startIndex = existing.findings.length;
  const renumbered: Finding[] = findings.map((f, i) => ({
    ...f,
    id: f.id && f.id.length > 0 ? f.id : `f_${startIndex + i + 1}`,
  }));
  const merged = [...existing.findings, ...renumbered];
  const rows = (await sql`
    UPDATE plans
    SET findings = ${JSON.stringify(merged)}::jsonb,
        status   = 'awaiting_defense'
    WHERE id = ${planId}
    RETURNING *
  `) as Row[];
  return rowToPlan(rows[0]);
}

export async function updateFinding(
  planId: string,
  findingId: string,
  patch: {
    status?: "open" | "addressed" | "defended" | "overridden";
    defense?: string;
  },
): Promise<Plan> {
  await ensureSchema();
  const existing = await getPlan(planId);
  if (!existing) throw new Error(`plan not found: ${planId}`);
  const fIdx = existing.findings.findIndex((f) => f.id === findingId);
  if (fIdx === -1) throw new Error(`finding not found: ${findingId}`);
  const updated: Finding[] = existing.findings.map((f, i) =>
    i === fIdx
      ? {
          ...f,
          ...(patch.status !== undefined ? { status: patch.status } : {}),
          ...(patch.defense !== undefined ? { defense: patch.defense } : {}),
        }
      : f,
  );
  const rows = (await sql`
    UPDATE plans
    SET findings = ${JSON.stringify(updated)}::jsonb
    WHERE id = ${planId}
    RETURNING *
  `) as Row[];
  return rowToPlan(rows[0]);
}

export async function signPlan(
  planId: string,
  summary: string,
): Promise<Plan> {
  await ensureSchema();
  const existing = await getPlan(planId);
  if (!existing) throw new Error(`plan not found: ${planId}`);
  const rows = (await sql`
    UPDATE plans
    SET signed_at = now(),
        signed_plan = ${existing.draft},
        summary = ${summary},
        status = 'signed'
    WHERE id = ${planId}
    RETURNING *
  `) as Row[];
  return rowToPlan(rows[0]);
}

/**
 * Insert a fully-formed plan (used by the seed loader).
 */
export async function upsertSeedPlan(plan: Plan): Promise<void> {
  await ensureSchema();
  await sql`
    INSERT INTO plans (
      id, author_id, ticket_ref, draft, findings,
      signed_plan, signed_at, summary, status, created_at
    ) VALUES (
      ${plan.id}, ${plan.authorId}, ${plan.ticketRef}, ${plan.draft},
      ${JSON.stringify(plan.findings)}::jsonb,
      ${plan.signedPlan ?? null}, ${plan.signedAt ?? null},
      ${plan.summary ?? null},
      ${plan.signedAt ? "signed" : plan.findings.length > 0 ? "awaiting_defense" : "auditing"},
      ${plan.createdAt}
    )
    ON CONFLICT (id) DO NOTHING
  `;
}

export async function plansCount(): Promise<number> {
  await ensureSchema();
  const rows = (await sql`SELECT COUNT(*)::int AS c FROM plans`) as { c: number }[];
  return rows[0]?.c ?? 0;
}
