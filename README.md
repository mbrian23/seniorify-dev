# Seniorify

> **Train the seniors of the future.** A managed plugin for AI coding agents that helps juniors take responsibility for their work and gives managers a readable audit trail.

**Live:** https://seniorify.dev
**Manager dashboard:** https://seniorify.dev/manager
**Live audit demo:** https://seniorify.dev/work

## Thesis — four verbs

**Help. Audit. Learn. Never block.**

- **Help** the junior with the questions a senior would ask, while the work is happening — not after.
- **Audit** every AI-assisted plan into a manager-readable trail attached to the PR.
- **Learn** patterns over time so coaching beats firefighting.
- **Never block.** Even on a `block`-severity finding, the user can defend, escalate, or override. Visibility is the lever, not gatekeeping.

## Install

### Claude Code

```bash
claude plugins marketplace add mbrian23/seniorify-dev
claude plugins install seniorify
```

That installs the Seniorify skill so Claude consistently runs the audit loop on non-trivial coding work, and registers the MCP server pointing at `https://seniorify.dev/api/mcp`.

### Cursor

Two-step: register the rule and add the MCP server.

1. Drop `plugins/seniorify/cursor/seniorify.mdc` into your project's `.cursor/rules/` directory.
2. **Settings → MCP → Add server →** type `http`, URL `https://seniorify.dev/api/mcp`.

### Generic MCP-capable client

Add to your client's MCP config:

```json
{
  "mcpServers": {
    "seniorify": {
      "type": "http",
      "url": "https://seniorify.dev/api/mcp"
    }
  }
}
```

Tools exposed:

| Tool | What it does |
|---|---|
| `submit_plan` | Audits a plain-English plan against the team's conventions; returns findings |
| `defend` / `update_finding` | Records the user's decision per finding (addressed / defended / overridden) |
| `sign_plan` | Freezes the plan, generates the manager-readable summary |
| `get_audit` | Reads back a plan + findings + decisions |

## Architecture

Three-part monorepo, single Vercel deploy, all-Vercel stack.

```
apps/web                 ← Next.js 16 — landing, /work, /manager, /api/mcp
packages/core            ← Plan, Finding, TicketContext, TeamConventions (zod)
packages/collector       ← ticket adapters (mock + real GitHub Issues API)
packages/agent           ← AI SDK 6 → AI Gateway → claude-sonnet-4-6
plugins/seniorify        ← the installable Claude Code / Cursor plugin
```

| Concern | Tech |
|---|---|
| Hosting | Vercel (single project, monorepo via Root Directory) |
| Storage | **Neon Postgres** via Vercel Marketplace |
| LLM | **AI Gateway** with `anthropic/claude-sonnet-4-6` |
| Audit decoupling | Next.js `after()` — `submit_plan` returns in ~250 ms, audit runs async |
| Ticket sources | Real GitHub Issues API (graceful fallback to mock fixtures) |

## Development

```bash
pnpm install
pnpm dev   # → http://localhost:3000

# pull env vars (Neon, AI Gateway) into apps/web/.env.local:
vercel env pull apps/web/.env.local
```

## Track

This project is a submission to **Zero to Agent: Montevideo 2026** under the **v0 + MCPs** track. Seniorify *is* an MCP server — that's the product, not a feature.
