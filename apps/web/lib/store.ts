import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { Finding, Plan } from "@seniorify/core";

// Vercel serverless functions have a read-only root filesystem; only /tmp
// is writable. Locally, persist next to the app for easy inspection.
const ON_VERCEL = !!process.env.VERCEL;
const DATA_DIR = ON_VERCEL ? "/tmp/seniorify" : path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "audits.json");

type Store = { plans: Plan[] };

async function ensureFile(): Promise<void> {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify({ plans: [] }, null, 2), "utf8");
  }
}

async function readStore(): Promise<Store> {
  await ensureFile();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw) as Store;
    if (!parsed.plans) return { plans: [] };
    return parsed;
  } catch {
    return { plans: [] };
  }
}

async function writeStore(store: Store): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2), "utf8");
}

export async function getAllPlans(): Promise<Plan[]> {
  const { plans } = await readStore();
  return plans;
}

export async function getPlan(id: string): Promise<Plan | null> {
  const { plans } = await readStore();
  return plans.find((p) => p.id === id) ?? null;
}

export async function createPlan(input: {
  authorId: string;
  ticketRef: string;
  draft: string;
}): Promise<Plan> {
  const store = await readStore();
  const id = `pln_${randomUUID().slice(0, 8)}`;
  const plan: Plan = {
    id,
    authorId: input.authorId,
    ticketRef: input.ticketRef,
    draft: input.draft,
    revisions: [],
    findings: [],
    createdAt: new Date().toISOString(),
  };
  store.plans.push(plan);
  await writeStore(store);
  return plan;
}

export async function addFindings(
  planId: string,
  findings: Finding[],
): Promise<Plan> {
  const store = await readStore();
  const idx = store.plans.findIndex((p) => p.id === planId);
  if (idx === -1) throw new Error(`plan not found: ${planId}`);
  const existing = store.plans[idx];
  const startIndex = existing.findings.length;
  const renumbered: Finding[] = findings.map((f, i) => ({
    ...f,
    id: f.id && f.id.length > 0 ? f.id : `f_${startIndex + i + 1}`,
  }));
  const updated: Plan = {
    ...existing,
    findings: [...existing.findings, ...renumbered],
  };
  store.plans[idx] = updated;
  await writeStore(store);
  return updated;
}

export async function updateFinding(
  planId: string,
  findingId: string,
  patch: {
    status?: "open" | "addressed" | "defended" | "overridden";
    defense?: string;
  },
): Promise<Plan> {
  const store = await readStore();
  const idx = store.plans.findIndex((p) => p.id === planId);
  if (idx === -1) throw new Error(`plan not found: ${planId}`);
  const plan = store.plans[idx];
  const fIdx = plan.findings.findIndex((f) => f.id === findingId);
  if (fIdx === -1) throw new Error(`finding not found: ${findingId}`);
  const updatedFinding: Finding = {
    ...plan.findings[fIdx],
    ...(patch.status !== undefined ? { status: patch.status } : {}),
    ...(patch.defense !== undefined ? { defense: patch.defense } : {}),
  };
  const updatedPlan: Plan = {
    ...plan,
    findings: plan.findings.map((f, i) => (i === fIdx ? updatedFinding : f)),
  };
  store.plans[idx] = updatedPlan;
  await writeStore(store);
  return updatedPlan;
}

export async function signPlan(
  planId: string,
  summary: string,
): Promise<Plan> {
  const store = await readStore();
  const idx = store.plans.findIndex((p) => p.id === planId);
  if (idx === -1) throw new Error(`plan not found: ${planId}`);
  const plan = store.plans[idx];
  const updated: Plan = {
    ...plan,
    signedAt: new Date().toISOString(),
    signedPlan: plan.draft,
    summary,
  };
  store.plans[idx] = updated;
  await writeStore(store);
  return updated;
}
