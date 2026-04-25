# Constraints for Hackathon Ideas

Every candidate idea must clear all of these. If it fails a hard constraint, kill it.

## Hard (non-negotiable)

1. **Deployable to Vercel by 19:30.** No on-prem, no GPU servers, no native mobile binary. Must run on Fluid Compute / standard Vercel.
2. **Fits exactly one of the 3 tracks** — and uses that track's signature primitive non-trivially:
   - Track 1 → at least one `"use workflow"` function with a meaningful pause/retry/long-running step (not just async).
   - Track 2 → built in v0 *and* connects to **≥1 MCP server** that actually drives behavior (not a decorative tool call).
   - Track 3 → uses ChatSDK with **≥1 platform adapter** (Slack/Discord/Teams/etc.); cross-platform is a bonus, not required.
3. **Live demo runs in 3 minutes** start to finish, on hackathon WiFi, with no manual data seeding mid-demo.
4. **No credentials we can't get tonight.** If the idea needs OAuth approval from Google, Stripe, etc. that takes >24h — kill it. Sandbox/dev keys only.
5. **Zero PII / regulated data in the demo.** No real customer data, no medical, no banking. Use synthetic.
6. **Buildable by our team in the remaining time** with the AI SDK + Vercel primitives. If it requires a custom model, fine-tune, or vector store we don't have, kill it.

## Demo constraints (worth 15 pts on rubric)

7. **One "wow moment"** the audience can see in <30 seconds. If we can't name it in one sentence, the idea is too diffuse.
8. **Visible agent loop.** Tool calls / steps stream in the UI so judges *see* the agent reasoning. Hidden magic loses technical-impl points.
9. **Demo works offline-ish.** If the WiFi blips, the core path still runs (cache responses, prerecord one fallback if needed — but prefer real).
10. **No login on stage.** Pre-authenticated session, deep link, or guest mode. Logging in eats 30s of a 3-minute pitch.

## Business-plan constraints (Innovation 10 + Future Potential 10 + Problem 15 = 35 pts)

11. **Name a paying customer archetype.** "SMB legal ops manager," "Series A CTO," "Discord community manager." Not "businesses" or "developers."
12. **Name a price.** $/seat/mo, $/run, or $/contract. If we can't price it, we don't understand it.
13. **Name an existing company doing the manual version.** Vendr, Geekbot, Glean, Linear — proves the wedge. If no comp exists, explain why now.
14. **Wedge fits in one sentence** — what we do that the incumbent can't, and why.
15. **Total addressable signal, not TAM theater.** One stat: "Geekbot is $3M ARR" beats "$50B opportunity."

## Technical-implementation constraints (20 pts — biggest single bucket)

16. **At least one non-trivial tool call** the LLM has to choose to make — not a hardcoded chain.
17. **Use the AI Gateway** (`'anthropic/claude-sonnet-4-6'` style strings), not direct provider SDKs.
18. **Real persistence somewhere** — workflow state, MCP-backed store, Redis state for ChatSDK. In-memory only = looks like a toy.
19. **Error path exists.** What happens when the model hallucinates / a tool fails? At minimum, a graceful retry or human-handoff branch.
20. **Code is one repo, one `vercel deploy`.** No multi-service docker-compose.

## Scope discipline (the real killer)

21. **One agent, one job.** No "platform for X." A single workflow done well > three half-built ones.
22. **No auth system, no billing, no admin panel** unless it's the product. Mock them.
23. **No new UI components we can't get from v0 / shadcn in 10 min.**
24. **If it needs a dataset, it's <100 rows of synthetic JSON checked into the repo.**
25. **Cut features that don't appear in the 3-minute demo.** If the judge won't see it, don't build it.

## Anti-patterns (auto-disqualify)

- "ChatGPT for X" with no agent loop — just a system prompt + a textbox.
- A wrapper around one API call dressed up as an agent.
- Anything where the demo is a Loom video instead of the live URL.
- "We'll add the AI part after the MVP."
- Using Track 1 (WDK) but the workflow is just `await fetch()` — no durability story.
- Using Track 2 (MCP) where the MCP server is called once for show, then ignored.
- Using Track 3 (ChatSDK) but only on one platform with nothing the chat layer specifically enables.
