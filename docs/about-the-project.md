## Inspiration

Every junior developer now has a senior in their pocket. The AI types the code, names the variables, ships the PR. Fluency is rising fast — but **judgment** isn't.

Three studies landed in 2025 that pushed us to build this:

- **Microsoft Research & CMU (CHI 2025):** the more confident developers are in AI, the *less* they think critically.
- **MIT Media Lab (2025):** heavy LLM users showed the weakest neural connectivity across every measured axis.
- **Gerlich (Societies, 2025):** the effect is mediated by cognitive offloading — the more you outsource, the less you build.

Judgment is the muscle that turns a junior into a senior. We're quietly atrophying it. So we asked the question nobody was asking: **who is training the seniors of the future?**

## What it does

**Seniorify is a senior in the loop.** A managed plugin for AI coding agents — Codex, Claude Code, Cursor — that sits between the junior and the merge button.

Before code gets written, Seniorify audits the *plan*. It reads the team's conventions, internal libraries, and prior audits, then surfaces the questions a real senior would ask:

> *"You're reaching for `axios` and `/api/users/.../invoices`. This codebase uses `@acme/internal-http` (it carries tracing, retries, and the auth header), and invoices live behind `/v2/billing/invoices`."*

The agent didn't know. **Now the junior does.**

Two people pay attention to the product:

- **The junior**, who comes out of every PR knowing more than when they started.
- **The manager**, who finally has signal on the AI-assisted work shipping under their name.

## What we learned

- **The bottleneck isn't typing — it's understanding.** Once we accepted that, the product shape clicked: don't review the diff, audit the *plan*.
- **Context the model doesn't have is where the value is.** Internal libraries, deprecated patterns, prior decisions, the migration that bit you last quarter — none of that is in the model's weights. An MCP server that injects it is a force multiplier.
- **Async is a UX feature.** A blocking audit is a slower agent. With Vercel's `after()` we let the agent return immediately and run the heavy audit as deferred work. The junior keeps moving; the senior is still in the loop.
- **Sparse beats hypey.** The research wall does more persuasion than any tagline we tried.

## How we built it

Every piece runs on Vercel.

- **Next.js + App Router** for the dashboard at `seniorify.dev` and the live deck at `deck.seniorify.dev`.
- **Vercel Functions on Fluid Compute** for the API. The audit runs inside `after()` — deferred work that fires *after* the MCP response goes back to the agent, so the agent never waits on us.
- **AI Gateway** for model routing and provider failover.
- **AI SDK** for the structured agent loop that powers each audit pass.
- **MCP server** embedded in the agent runtime — exposes `submit_plan`, `sign_plan`, `defend`, `update_finding`, `get_audit` and feeds team context back to the model.
- **Neon Postgres (via the Vercel Marketplace)** for plans, audits, findings, and overrides.
- **Vercel Routing Middleware** so `deck.seniorify.dev` and the dashboard share one project with one deploy.
- **Plugin distribution** for Codex, Claude Code, and Cursor — one install, three surfaces.

The loop:

1. Junior describes the change in plain English inside their agent.
2. The agent calls `submit_plan` via MCP.
3. Seniorify spawns the audit (Fluid Compute + `after()`), checking the plan against team conventions, internal libraries, and prior decisions.
4. Findings stream back into the agent — questions, library suggestions, risks.
5. The junior addresses, defends, or overrides each one. Then `sign_plan`.
6. The manager sees every plan, every override, and every recurring finding in the dashboard.

## Challenges we ran into

- **Latency vs. depth.** A real audit takes seconds; an agent loop wants milliseconds. Splitting the response into a fast acknowledgement and an `after()`-driven deep audit was the unlock — and it only became practical because Fluid Compute keeps the function warm long enough to finish the work.
- **MCP shape design.** Getting the tool surface small enough to be obvious to the model, but rich enough to capture *why* a finding was overridden, took several rewrites. The final five tools (`submit_plan`, `sign_plan`, `defend`, `update_finding`, `get_audit`) are the smallest set we couldn't shrink further.
- **Avoiding the false-positive trap.** A senior who flags everything gets ignored. We tuned heavily against noise — every finding has to point to a concrete team rule, library, or prior decision, not vibes.
- **Three agents, one experience.** Codex, Claude Code, and Cursor all expose tools differently. We pushed the divergence into thin adapters and kept one canonical audit pipeline behind them.
- **Telling the story.** The product is about something the audience can't see — the *judgment* that isn't being trained. The deck went through more revisions than the code; the research wall is what finally made it land.
