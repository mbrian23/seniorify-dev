# Build Tasks — Parallel Execution

Four streams, owned by separate agents, written to non-overlapping files.

## Stream 1 — Data path (storage + seed + MCP endpoint)
**Owns:**
- `apps/web/lib/store.ts`
- `apps/web/data/audits.json`
- `apps/web/lib/seed.ts`
- `apps/web/lib/conventions.ts`
- `apps/web/app/api/mcp/route.ts`
- `apps/web/app/api/audits/route.ts` (read-only list for the dashboard)
- `apps/web/app/api/audits/[id]/route.ts` (single audit)

**Output:** real persistence + four MCP tools wired to AI Gateway via `@seniorify/agent`.

## Stream 2 — `/work` page (live audit demo)
**Owns:**
- `apps/web/app/work/page.tsx`
- `apps/web/components/work/*`

**Reads but does not modify:** `@seniorify/core` types.

**Output:** the wow-moment view — plan card, findings stream, defend panel, sign button.

## Stream 3 — `/manager` page (dashboard with DORA tiles)
**Owns:**
- `apps/web/app/manager/page.tsx`
- `apps/web/components/manager/*`

**Reads but does not modify:** `@seniorify/core` types.

**Output:** four KPI tiles, team table, recurring findings panel, recent signed plans feed.

## Stream 4 — Landing + demo script
**Owns:**
- `apps/web/app/page.tsx`
- `apps/web/app/layout.tsx`
- `apps/web/components/landing/*`
- `apps/web/app/globals.css` (aesthetic pass)
- `docs/build-spec.md` (demo script update)

**Output:** brand-anchor landing page (Help / Audit / Learn / Never block), updated 3-min demo script.

---

## Coordination contract

All four streams agree on:
- **Data shapes:** `Plan`, `Finding`, `TicketContext`, `TeamConventions` from `@seniorify/core` (already defined). Streams 2/3 import these and consume them; Stream 1 produces them.
- **Stream 1 publishes** `getAllPlans()`, `getPlan(id)`, `createPlan()`, `addFinding()`, `updateFindingStatus()`, `signPlan()` from `apps/web/lib/store.ts`. Streams 2/3 read via fetch from `/api/audits`.
- **Aesthetic:** monochrome (white bg, near-black text), Geist Sans + Geist Mono (already loaded by Next 16 default font), 4px corners, lowercase metadata labels, severity colors only on actual findings (warn=amber, block=red, ok=green). Stream 4 sets the tone in `globals.css`; others inherit.
- **No commits from agents.** They edit files only. I commit and push at the end.
- **No package installs from agents.** If they want a missing dep they flag it in the response — I install centrally.
