# Hackathon Best Practices

Distilled from the official Vercel hackathon resources page.

## Build & ship habits

- **Deploy early, iterate fast.** Push to Vercel after the first working slice. Every git push = a preview URL you can share with teammates and judges.
- **Start from a template if stuck.** Clone the Chatbot template, Knowledge Agent template, or a WDK example and customize — don't scaffold from scratch unless the design demands it.
- **Use AI SDK DevTools** for multi-step debugging — full visibility into LLM calls, tool use, and trajectories in AI SDK 6.

## Model & API access

- **Use the AI Gateway, not per-provider keys.** One endpoint, built-in fallbacks, multi-provider. Pass plain strings:
  ```ts
  // good
  model: 'anthropic/claude-sonnet-4-6'
  model: 'openai/gpt-4o'
  ```
  Don't reach for `@ai-sdk/anthropic` etc. unless you specifically need direct provider wiring.
- **Default models on Vercel:** prefer the latest Claude/GPT through the gateway. AI SDK 6 is the current major.

## Coding-agent setup (this session)

- The **Vercel plugin and skills are already loaded** in this Claude Code session — lean on them instead of guessing APIs.
- For library-specific docs (AI SDK, ChatSDK, Workflow), use `mcp__plugin_context7_context7__query-docs` rather than memory or web search.
- **Feed `https://ai-sdk.dev/llms.txt`** to the LLM when generating AI SDK code — it's the full docs as one Markdown file, kept current.
- **Reference docs feed:** `https://vercel.com/docs/agent-resources` (Agent Skills & Resources).

## Track-specific patterns

### Track 1 — Workflow (WDK)
- Mark async functions with `"use workflow"` to make them durable.
- Wrap retry-able / memoizable inner work with `"use step"`.
- Use `DurableAgent` from `@workflow/ai/agent` for AI-powered workflows — built-in streaming, retries, observability.
- Wrap Next.js config: `export default withWorkflow(nextConfig)`.
- On deploy, Vercel auto-provisions queues, persistence, routing — don't set those up manually.

### Track 2 — v0 + MCP
- Drive UI generation in `v0.app` with natural-language prompts; iterate visually before wiring logic.
- Connect at least one MCP server (Vercel MCP, GitHub MCP, or a custom one) — that's the requirement.
- For custom MCP, see `vercel.com/docs/mcp/deploy-mcp-servers-to-vercel`.
- AI SDK exposes MCP tools natively: `ai-sdk.dev/docs/ai-sdk-core/mcp`.

### Track 3 — ChatSDK
- One codebase, multiple platforms via swappable adapters (`@chat-adapter/slack`, `/discord`, `/teams`, `/github`, …).
- State adapter: `@chat-adapter/state-redis` for prod, `@chat-adapter/state-memory` for dev.
- Core handlers: `bot.onNewMention`, `bot.onSubscribedMessage`, `bot.onReaction`.
- `thread.post()` accepts AI SDK text streams natively — pipe LLM output straight to chat.
- Adapters auto-detect credentials from env vars; don't pass tokens manually.

## Judging-aware tactics

The rubric weights **technical implementation (20)** and **solution quality (20)** highest, with **demo (15)** and **UX (15)** close behind.

- **Show, don't tell.** A 3-minute pitch is short — open with the live demo, not slides. The deployed Vercel URL is your strongest exhibit.
- **Make the agent loop visible.** Stream tool calls / steps in the UI so judges can see *how* the agent reasons, not just the final answer. Boosts technical-impl + UX scores simultaneously.
- **Pick one wow moment.** Multi-month pause resuming (WDK), live MCP write action (v0), or cross-platform same-bot (ChatSDK). Build the demo around it.
- **Cite real numbers in the pitch.** "Vendr does $X ARR" / "Geekbot does $Y" beats "huge market" — feeds the *future potential* and *opportunity* scores.

## Submission checklist (before 19:30)

- [ ] Project deployed to Vercel (preview URL works in incognito)
- [ ] Demo flow rehearsed end-to-end (golden path + one edge case)
- [ ] README in repo: 1-paragraph what + 3-bullet how + deployed URL
- [ ] 3-minute pitch outline written (problem → demo → business → ask)
- [ ] QR submission completed
