# Three Hackathon Tracks

Source: https://vercel.notion.site/02agentresources

---

## Track 1 — Vercel Workflow (WDK)

**What:** Long-running, durable async agents. Workflows survive crashes, resume after deploys, can pause for **minutes to months**.

**Core primitives:**
- `"use workflow"` directive on async functions → durable execution
- `"use step"` directive on inner functions → retried, memoized steps
- `DurableAgent` from `@workflow/ai/agent` → AI-powered workflows with streaming, retries, observability

**Quick start:**
```bash
npx create-next-app@latest --no-src-dir
npx workflow@latest
# wrap next config: export default withWorkflow(nextConfig)
# get AI Gateway key, deploy → queues/persistence/routing auto-provisioned
```

**Where it wins:** Multi-day human-in-the-loop, long polling, scheduled re-checks, retries across infra restarts, anything that has to *wait* reliably.

**Resources:** useworkflow.dev · useworkflow.dev/docs/ai · github.com/vercel/workflow · vercel.com/blog/introducing-workflow · aisdkagents.com/explore/ai-agent-frameworks

---

## Track 2 — v0 + MCPs

**What:** Use **v0** to rapidly build an AI app/agent that connects to **≥1 MCP server** (Vercel MCP, custom-built, or third-party).

**Core flow:**
1. Open `v0.app`, describe app in natural language
2. Iterate UI/logic with prompts
3. Add AI SDK features (v0 scaffolds the integration)
4. Wire up an MCP server (e.g. GitHub, Vercel, custom)
5. Deploy to Vercel

**Examples from the brief:** dashboard reading GitHub via MCP, assistant querying Vercel deployments, support agent wired to a knowledge base.

**Where it wins:** Polished UI fast (v0 generates React/Next), real backend power via MCP — looks production-grade in demo.

**Resources:** v0.app · vercel.com/docs/mcp · vercel.com/docs/agent-resources/vercel-mcp · vercel.com/docs/mcp/deploy-mcp-servers-to-vercel · ai-sdk.dev/docs/ai-sdk-core/mcp · vercel.com/templates/ai

---

## Track 3 — ChatSDK Agents

**What:** Agents that work across **Slack, Discord, Teams, GitHub, Linear, etc.** with one codebase. The SDK handles event routing, streaming, JSX cards, distributed state.

**Core install:**
```bash
npm install chat @chat-adapter/slack @chat-adapter/discord
# state: @chat-adapter/state-redis (prod) or state-memory (dev)
```

**Handlers:** `bot.onNewMention`, `bot.onSubscribedMessage`, `bot.onReaction`. `thread.post()` accepts AI SDK text streams natively. Adapters auto-detect credentials from env vars.

**Where it wins:** Demos beautifully (live chat in Slack), real distribution channel (you meet users where they work), AI Gateway gives multi-provider flexibility for free.

**Resources:** chat-sdk.dev · github.com/vercel/chat · vercel.com/blog/chat-sdk-brings-agents-to-your-users · vercel.com/templates/nuxt/chat-sdk-knowledge-agent · github.com/vercel-labs/community-agent-template

---

## Pro Tips (from the brief)

- **AI Gateway** instead of per-provider keys: pass `'anthropic/claude-sonnet-4-6'` etc. Built-in fallbacks.
- **Add the Vercel Plugin + Skills** to your coding agent (already loaded here).
- **Feed `ai-sdk.dev/llms.txt`** to the LLM for accurate, current AI SDK code.
- **Start from a template** if stuck (Chatbot, Knowledge Agent, WDK examples).
- **AI SDK DevTools** for multi-step debugging (LLM calls, tool use, trajectories).
- **Deploy early, iterate fast** — every push = preview URL to share with judges.
