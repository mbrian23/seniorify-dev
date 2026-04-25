# Seniorify.dev

> **Create the seniors of the future. Foster humans who can take responsibility.**

## One-liner

Seniorify trains juniors to take responsibility for their work, and gives managers proof of who's actually growing.

## Problem

AI hands juniors senior-level output without the reasoning. Expertise stops compounding. Companies end up with developers who can ship code but can't be trusted with outcomes — and managers can't tell the difference until something breaks in production.

## Thesis

A senior isn't someone who knows more answers. A senior is someone who can be **trusted with the outcome**. AI gives juniors output without ownership of that output. Seniorify puts ownership back into every AI-assisted task.

We do **not** block juniors from getting answers — that's paternalistic and gets routed around. We make sure every answer they ship is a decision *they* made, *they* explained, and *they* signed off on. The agent never owns the outcome. The human does.

## How it works

**Seniorify is a managed plugin installed on the AI coding agent the team already uses** (Cursor, Claude Code, Copilot, Windsurf). Distribution is solved — we attach to existing usage instead of competing for it. Implemented as an **MCP server** the agent calls before executing AI-generated work.

### For juniors (the wedge — adoption side)
1. Junior asks their AI agent to do something ("fix this bug," "add this feature").
2. Before the agent executes, it calls Seniorify with the proposed **plan**.
3. Seniorify runs an **audit**: surfaces gaps, missed edge cases, security/perf concerns, simpler alternatives. It does *not* hand the junior the answer — it points at what's missing.
4. Seniorify runs a short **"defend your demo" session**: 2–3 targeted questions tied to the highest-severity findings ("why are retries safe here without an idempotency key?").
5. Junior addresses or defends each finding. Defenses are recorded.
6. Plan is **signed** and frozen — the agent now executes against the signed plan.
7. The signed plan + audit + defense session attaches to the PR.

The framing for the junior is **gap-finding**, not refusal. Seniorify is the on-call senior who asks the questions a real senior would ask before approving the work. The junior keeps moving — they just leave a paper trail behind.

### For managers (the buyer — revenue side)
A dashboard over the audit trails:
- **Plan quality over time** per junior: how many audit findings on first draft, how many on revision, in what categories.
- **Growth signal**: is Ana getting fewer findings on edge cases? Is Pablo making the same mistake monthly?
- **Readiness signal**: who's ready for bigger ownership — surfaces juniors whose plans hold up cleanly.
- **Audit trail per PR**: click any merged PR, see the plan, the findings, the defenses, the sign-off.

## Users

- **Wedge:** junior devs at 10–500-person engineering teams — adoption side, low/free per-seat.
- **Buyer:** engineering managers and CTOs at the same companies — pay per seat.
- **Future market (not for tonight):** universities and CS programs — same loop, different buyer (department heads, ABET-style outcomes evidence). Strong "future potential" story; off-roadmap for the hackathon.

## Track

**Track 2 — v0 + MCPs.** Seniorify *is* an MCP server — that's the product, not a feature. Any AI coding agent installs it; the agent calls `submit_plan_for_audit` and `defend` tools before shipping work. v0 builds the manager dashboard. MCP is non-decorative — it's the entire integration surface and the moat.

## The wow moment (≤30 sec)

Live in Claude Code (or Cursor): junior asks the agent to fix a real bug. The agent pauses and calls Seniorify. On a second screen, audit findings stream in:

- ⚠ *No idempotency guard — the retry could double-charge.*
- ⚠ *No timeout — retries can stack and bring down the worker.*
- ✅ *Backoff strategy is correct.*

The agent then runs the **defend** session: *"Why are retries safe without an idempotency key?"* Junior types one sentence: *"Idempotency is enforced upstream — verified in service X."* Defense is accepted, logged. Plan is signed. The agent proceeds with the now-audited plan.

Closing flip to the **manager dashboard**: *"Ana defended a real edge case live. Pablo got the same retry finding 3 weeks running. The plugin runs everywhere your team already uses AI. This is what the CTO buys."*

## Business plan

- **Pricing:** Free for individual juniors. **$15/seat/mo** for the manager dashboard at company tier.
- **Comp:** Pluralsight ($500M+ rev, but passive video), CodeSignal ($30M+ ARR, hiring assessments), Codecademy ($60M ARR). None close the responsibility loop on real work.
- **Wedge:** every other tool teaches abstract skills with toy problems. We attach to juniors' *actual tickets* and turn every AI interaction into an owned, logged decision the manager can see.
- **Future potential:** (a) the ownership-trace dataset becomes the source of truth for "who can be trusted with what" — defensible moat. (b) Universities are a parallel market: same loop, sold to CS departments as outcomes evidence.

## Demo plan (3 min)

1. **0:00–0:20** — Problem in one sentence: *"AI is producing juniors who ship code but can't take responsibility for it."*
2. **0:20–2:00** — Live ownership loop with a real bug from a GitHub repo (via MCP). Agent surfaces three options with tradeoffs → junior picks one → writes a one-line "why" → agent commits with the signed trace. Decision timeline updates on screen.
3. **2:00–2:30** — Flip to the manager dashboard. Ownership signal across the team. *"This is what their CTO buys from us."*
4. **2:30–3:00** — Business: market signal, price ($15/seat/mo), parallel market hint (universities), ask.

## Brand

- **Name:** Seniorify
- **Domain:** seniorify.dev (available, confirmed)
- **Tone:** serious, contrarian, slightly austere. *Anti-magic.* The product's whole pitch is that magic is the problem — ownership is the value.
- **Tagline candidates:**
  - *"Train the seniors of the future."*
  - *"Every AI answer needs an owner."*
  - *"AI built the code. You own the call."*
