# Build Spec — Seniorify (hackathon edition)

Single-evening scope. Must deploy to Vercel before 19:30. Pitch at 19:45.

## Stack

- **Framework:** Next.js (App Router) — `npx create-next-app@latest --no-src-dir`. Single Vercel project hosts both the MCP server and the dashboard.
- **MCP server:** an HTTP MCP endpoint at `/api/mcp` exposing tools `submit_plan`, `defend`, `sign_plan`, `get_audit`. This is the product surface — what AI agents install.
- **Dashboard UI:** v0-generated (shadcn) — `/work` (live audit feed for the junior) + `/manager` (dashboard).
- **AI:** AI SDK 6 via Vercel AI Gateway (`anthropic/claude-sonnet-4-6`). Two LLM calls per audit: (1) generate findings, (2) generate defense questions from findings.
- **Persistence:** start with file-based JSON in `data/audits.json` for the demo. Upgrade to Vercel KV if step 5 finishes early.
- **Auth:** mocked — one hardcoded `ana` user for the live demo, `pablo` pre-seeded for the dashboard contrast.
- **Track alignment:** Track 2. Seniorify *is* an MCP server. The integration is the product — not a decorative tool call.

## How an AI agent uses Seniorify (the integration story)

```
Junior in Claude Code: "Fix the retry bug in worker.ts"
  ↓
Claude Code drafts a plan internally, then calls Seniorify MCP:
  → submit_plan({ user: "ana", task: "fix retry bug", plan: "...", repo: "acme/worker" })
  ← { audit_id, findings: [...] }
  ↓
If findings have severity=warn|block, Claude Code calls:
  → defend({ audit_id, finding_id, defense: "idempotency enforced upstream..." })
  ← { accepted: true | false, follow_up?: "..." }
  ↓
Once all findings are addressed/defended:
  → sign_plan({ audit_id })
  ← { signed_at, signed_plan_url }
  ↓
Claude Code proceeds with the signed plan.
```

For the hackathon demo, we'll drive this from a small client we control (no real Cursor/Claude Code integration needed) — the MCP tools are real, the client that calls them is a script with a UI. The pitch makes the integration story explicit.

## Routes

- `/` — Landing: logo, tagline, *"Install on your AI agent"* (placeholder), *"See the demo"* CTA → `/work`
- `/api/mcp` — MCP HTTP endpoint (the product). Tools: `submit_plan`, `defend`, `sign_plan`, `get_audit`.
- `/work` — Live junior view (the visualization for the demo)
  - Shows the running audit as the AI agent calls Seniorify in real time: plan submitted → findings stream → defend session → sign-off
  - Effectively a live console of MCP calls, presented as a chat
- `/manager` — Manager dashboard
  - Per-junior cards (Ana, Pablo) with plan-quality metrics
  - Findings-by-category breakdown (edge case / security / performance / simplicity / ownership)
  - Click any signed plan → see the full audit + defense replay

Three routes + an MCP endpoint. That's the entire hackathon surface.

## Data model

```ts
type Plan = {
  id: string
  authorId: 'ana' | 'pablo'
  ticketRef: string   // e.g. owner/repo#123
  draft: string       // junior's plan text
  revisions: Array<{ text: string; at: string }>
  findings: Array<{
    id: string
    severity: 'warn' | 'block' | 'ok'
    category: 'edge-case' | 'security' | 'performance' | 'simplicity' | 'ownership'
    title: string
    detail: string
    status: 'open' | 'addressed' | 'defended'
    defense?: string
  }>
  signedAt?: string
  signedPlan?: string  // frozen text at sign time
}
```

`data/audits.json` = `{ plans: Plan[] }`. Read/write via tiny server actions.

## The audit prompt (the product's brain)

Single LLM call, structured output. Tool-augmented with:

- `read_ticket(ref)` — GitHub MCP: title, body, comments
- `read_file(path)` — GitHub MCP: relevant code
- `search_repo(query)` — GitHub MCP: find related code

System prompt (sketch):

> You are a senior engineer auditing a junior's plan. You do **not** write the plan for them. You do not give them code. You audit.
>
> For the given plan and the linked ticket, output an array of findings. Categories: edge-case, security, performance, simplicity, ownership. Severity: warn / block / ok. Each finding has a one-line title and a 1–3 sentence detail. **Be specific to the code in the repo, not generic best-practice noise** — use your tools to read the actual files mentioned in the ticket.
>
> Do not exceed 5 findings. Prefer the most important ones. If the plan is solid, return a single `ok` finding affirming what's strong. Never tell the junior what to do — describe what's missing or risky and let them decide.

Output schema enforced by AI SDK `generateObject`. Streaming optional.

## Build order (strict)

1. `create-next-app` + deploy empty repo to Vercel. Get the preview URL pinned. **(15 min)**
2. Wire AI Gateway. Hardcoded audit prompt + structured-output schema (`generateObject`). Test from a local script with a fake plan. **(40 min)**
3. Build `/api/mcp` endpoint exposing `submit_plan`, `defend`, `sign_plan`, `get_audit`. JSON persistence. **(45 min)**
4. Build `/work` — connects to the MCP endpoint with a small demo client; renders findings + defense streaming. v0 for the layout. **(45 min)**
5. Build `/manager` dashboard. v0 for the layout. Wire to the JSON. **(30 min)**
6. Pre-seed Pablo's data so the dashboard contrast pops. **(15 min)**
7. Rehearse demo end-to-end on the deployed URL. **(20 min)**
8. Submit via QR. **Before 19:30.**

If any step blows budget, drop scope. **The MCP endpoint + `/work` is the spine** — keep it real at all costs. `/manager` can degrade to a static screenshot in the pitch slides.

GitHub MCP integration (read-only ticket / file context) is **stretch**, not core. Land it only if step 5 finishes with time to spare. Without it, the audit prompt works on the plan text alone.

## Demo script (3 min)

The pitch arc: problem → live agent loop → manager view → business. Three minutes, no slides until the close.

| Time | What's on screen | What you say |
|---|---|---|
| 0:00–0:20 | Landing slide | "AI lets juniors ship code they don't own. Seniorify is the plugin that fixes it without blocking them. Help, audit, learn, never block." |
| 0:20–0:40 | Live: AI agent terminal (left) + `/work` (right) | "Ana asks her AI agent to fix a real retry bug. Before the agent executes, it calls Seniorify." |
| 0:40–1:30 | `/work` — findings stream in | "Three findings: idempotency, timeout, convention deviation — they tried to use axios, our team uses internal/http. Each finding includes the why, not just the what." |
| 1:30–2:00 | `/work` — defend + sign | "Ana defends one finding with a one-liner. Seniorify accepts. She signs the plan. The signed plan attaches to her PR with a one-sentence summary for her manager." |
| 2:00–2:30 | Flip to `/manager` | "Her manager sees the audit. Plain English. DORA-correlated. Pablo got the same retry finding three weeks running — now they know who to coach. SOC 2-ready trail underneath all of it." |
| 2:30–3:00 | Closing slide | "Plugin to the AI agents your team already uses. Free for juniors. $15 a seat for managers. Universities next. seniorify.dev" |

## Risk register

- **MCP setup eats time.** Mitigation: stub the MCP layer with a fake `read_ticket` that returns hardcoded text. Replace with real MCP only if step 4 goes fast.
- **Latency on stage.** Mitigation: pre-warm the audit on the demo ticket once before pitching. Cache the response.
- **The audit feels generic.** Mitigation: the prompt explicitly forbids generic best-practice. Test with at least 3 different plans before stage; tune.
- **WiFi drops.** Mitigation: deployed URL + cached findings; localhost as backup.

## Out of scope (do not build)

- Real auth, login, accounts
- Billing / Stripe
- Multi-tenant isolation
- Email notifications
- The college/university workflow
- Any UI for managers to *write* feedback (read-only dashboard)
- Plan templates, libraries, sharing
