# Seniorify — Demo Recording Script

> Read top to bottom. Anything in **Say:** blocks is verbatim narration. Anything in fenced code blocks is to be pasted exactly. Anything in *italics* is a stage direction (camera / screen / browser tab).

---

## What you're demonstrating

**The product:** Seniorify — a managed plugin + MCP server that intercepts AI-assisted coding work, surfaces senior-level concerns *before* code is written, lets the user defend or override every concern, and emits a manager-readable audit trail.

**Target repo for the demo:** `seniorify/examples/acme-worker-demo/` — a deliberately-naive Acme codebase with three open tickets shaped like real GitHub issues. The code is sloppy on purpose: convention violations, missing idempotency, PII in logs, no caching.

**The thesis (four verbs — say these in the close):** Help. Audit. Learn. Never block.

---

## Pre-recording checklist (do all of this BEFORE you hit record)

### Step 1 — Open the browser tabs (in this exact order, left to right)

1. `https://seniorify.dev` — landing page
2. `https://seniorify.dev/work` — live audit panel (the voice-defend page)
3. `https://seniorify.dev/manager` — manager dashboard

Pre-load each tab so they're cached. The `/manager` page should already show prior audits — if it's empty, run a throwaway audit before recording so the dashboard isn't blank when the audience sees it.

### Step 2 — Open the terminal at the demo folder

Open Terminal (or iTerm2 / Warp / whatever you use). In the new window, paste:

```bash
cd ~/Desktop/vercel-hackathon/seniorify/examples/acme-worker-demo
```

Confirm you're in the right place:

```bash
pwd && ls
```

You should see `src/`, `tickets/`, `.claude/`, `.cursor/`, `.mcp.json`, `README.md`, and `DEMO_SCRIPT.md` (this file).

### Step 3 — Make the terminal readable on camera

- **Font size: 18pt minimum.** The audience needs to read the findings and the AskUserQuestion choices from the back of the room / the YouTube viewport.
- **Theme: dark background, high contrast.** Avoid transparent/blurred terminals — they look messy on screen recordings.
- **Window size: full half of your screen.** The terminal is the hero of the demo; give it room.

In iTerm2: `⌘ ,` → Profiles → Text → set Font size to 18.
In Terminal.app: `⌘ ,` → Profiles → Text → Font → 18.

### Step 4 — Open the editor with the ticket visible

Open the demo folder in your editor of choice:

```bash
cursor .          # if using Cursor
code .            # if using VS Code
```

Inside the editor, open `tickets/412-fix-retry-storm.md` in a side pane. The audience needs to see the ticket the junior is working from.

### Step 5 — Install the Seniorify plugin (one-time, skip if already installed)

In the same terminal, **before** you start a `claude` session, run:

```bash
claude plugins marketplace add mbrian23/seniorify-dev
```

You should see confirmation that the marketplace was added. Then:

```bash
claude plugins install seniorify
```

This installs:
- the **seniorify skill** (so Claude consistently runs the audit loop on non-trivial coding work)
- the **seniorify MCP server** pointing at `https://seniorify.dev/api/mcp`
- the **`/audit` slash command** (manual audit trigger)

Verify both pieces are installed:

```bash
claude plugins list
```

You should see `seniorify` in the list with status `enabled`. If it's `disabled`, run:

```bash
claude plugins enable seniorify
```

The pre-checked-in `.claude/settings.json` in this folder enables the plugin for this project automatically — you don't need to do anything else per-project.

### Step 6 — Open Claude Code in the demo folder

From inside `acme-worker-demo/`:

```bash
claude
```

This starts an interactive Claude Code session. The plugin loads automatically because of `.claude/settings.json` in this directory.

### Step 7 — Sanity-check the MCP wiring (CRITICAL — do not skip)

Inside the `claude` session, type:

```
What MCP tools do you have from seniorify?
```

You should see Claude list four tools:

- `submit_plan` — audits a plain-English plan
- `update_finding` — records the user's decision per finding
- `sign_plan` — freezes the plan, generates the manager-readable summary
- `get_audit` — reads back a plan + findings + decisions

If you do NOT see these tools, the MCP server isn't connected. Fix it before recording:

```bash
# Inside the claude session, type /mcp to see the server status:
/mcp
```

If `seniorify` shows as disconnected, exit (`/exit`) and check `.mcp.json`:

```bash
cat .mcp.json
```

It should contain:

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

Re-run `claude` and re-check `/mcp`.

### Step 8 — Sanity-check the skill is loaded

Inside the `claude` session:

```
List the skills you have available.
```

You should see `seniorify` in the list. If you don't, the plugin isn't enabled — run `claude plugins enable seniorify` and restart the session.

### Step 9 — Warm up the manager dashboard

If `https://seniorify.dev/manager` is empty, run **one throwaway audit** so the dashboard isn't blank during Act 3. Inside the `claude` session, paste:

```
/audit Add a health check endpoint at /api/health that returns 200 OK.
```

Defend or override every finding it surfaces, sign the plan. Now `/manager` has at least one row. Refresh the tab.

### Step 10 — Mic check for Act 2 (voice-defend)

Open `https://seniorify.dev/work` in your browser, click the mic icon, and say "test test test." Confirm the page captures and transcribes audio. If the browser shows a mic permission prompt, grant it **now** — you don't want it interrupting the demo.

### Step 11 — Network check

Wired connection if possible. The audit takes ~3–8 seconds on a good connection; on hotel wifi it can stretch to 15+ and the demo loses tempo. If you must use wifi, sit close to the router and close all other bandwidth-heavy apps (Slack calls, Dropbox sync, etc.).

### Step 12 — Reset for the take

Once you've done the sanity checks and warmed up the dashboard, **exit the `claude` session and start fresh** so the recording opens with a clean prompt:

```bash
# inside claude session:
/exit

# back at the shell:
clear
claude
```

Now you're ready to hit record.

---

## Recording layout

Two regions on your screen, side by side:

- **Left (~60%):** the terminal running `claude` (or the Cursor chat panel — pick one, don't swap mid-demo)
- **Right (~40%):** browser, with the three Seniorify tabs

When you switch to a browser tab during the demo, do it deliberately — the cut is the point. Don't alt-tab; click the tab so the camera follows.

---

# THE SCRIPT

Total target runtime: **3:30 – 4:00 minutes.** If you go over 4:30, cut Act 5.

---

## ACT 0 — Cold open (15 seconds)

*Camera on you, or on the editor showing `tickets/412-fix-retry-storm.md` full-screen. Terminal visible in the other pane, sitting at a fresh `claude` prompt inside `~/Desktop/vercel-hackathon/seniorify/examples/acme-worker-demo`.*

**Say:**
> "Every engineering team in 2026 has the same problem. Juniors are shipping code at senior velocity — because the AI is writing it. But nobody is asking the senior questions. So bugs that a senior would have caught in five minutes ship to production, and the manager finds out at 2 AM."

*Cut to the ticket on screen.*

**Say:**
> "Here's a real ticket. Fix a retry storm in a payments worker. I'm going to paste this into my AI agent right now. Watch what happens."

---

## ACT 1 — Prompt #1: the retry storm (90 seconds — THIS IS THE HERO MOMENT)

*Switch to terminal. Make sure `claude` is running in `acme-worker-demo/`.*

**Paste exactly:**

```
Fix the retry storm in src/worker.ts. Reference tickets/412-fix-retry-storm.md.
```

*Hit enter.*

### What you'll see in sequence — narrate as it appears

**Beat 1 — the plan (5–10 seconds in):**

The agent will say something like *"Let me draft a plan first..."* and write 3–8 lines of plain English describing what it's going to do.

*Point at this on screen.*

**Say:**
> "Stop. Look at this. The agent isn't writing code. It's writing a plan in plain English. That's the Seniorify skill kicking in — before any non-trivial work, draft a plan."

**Beat 2 — submit_plan (immediate):**

The agent calls the `submit_plan` MCP tool. You'll see a tool-call block in the terminal, and an `auditUrl` printed — something like `https://seniorify.dev/work/<planId>`.

*Point at the URL.*

**Say:**
> "It just sent that plan to Seniorify over MCP. Here's the audit URL. Anyone on the team — the senior, the manager, the security lead — can open this link right now and watch the audit happen live."

**Beat 3 — findings appear (3–8 seconds later):**

The audit returns. You'll see something like:

- **block / convention** — Direct `axios` import; team standard is `@acme/http`
- **block / reliability** — No idempotency key on a payment retry — retrying after a network blip risks double-charging the customer
- **warn / reliability** — Fixed 200ms sleep is not exponential backoff with jitter; this is exactly the pattern that caused the original storm
- **warn / reliability** — No per-request timeout
- **warn / observability** — `console.log` is leaking the full job payload (PII)

*Read the two **block** findings aloud, slowly. Skip the warns for now — the audience reads them on screen while you talk.*

**Say:**
> "Five findings in seven seconds. Two are block-severity. The interesting one — *no idempotency key on a payment retry.* If this ships, and the network blips between request and response, we charge the customer twice. That's the question a senior would have asked at code review tomorrow. Seniorify asked it now, before a single line of code was written."

**Beat 4 — AskUserQuestion (the moment):**

The agent stops and calls `AskUserQuestion` for the first finding. You'll see four choices:

- Address — Revise the plan to fix this
- Defend — Explain why this isn't a problem here
- Override — Accept the risk and move on
- Open audit panel — Defend out loud at <auditUrl>

*Point at the four choices.*

**Say:**
> "And here's the thesis. Seniorify never blocks me. I can override any finding. But I have to *say why*. And that 'why' is now permanently attached to this PR. The manager sees it on Monday."

### Now interact with the findings — do all three of these in sequence

**Finding 1 — the idempotency block. Pick "Defend".**

The agent will ask for your defense. Paste:

```
Stripe SDK retries idempotently by default; we pass the same idempotency_key on retry, so a network blip can't double-charge.
```

*Pause for one beat after the defense is recorded.*

**Say:**
> "Recorded. Verbatim. The agent did not paraphrase me, did not summarize, did not soften. That defense, in my words, is now in the audit trail."

**Finding 2 — the axios block. Pick "Address".**

The agent will ask what to change. Paste:

```
Switch to @acme/http with the team's built-in retry helper instead of rolling our own.
```

*Brief narration:*

**Say:**
> "On this one, I just agree. Address. The agent will revise the plan and re-submit for audit."

**Finding 3 (and any remaining warns) — pick "Override".**

For each warn the agent surfaces, paste the same one-liner:

```
Tracking in a follow-up ticket — shipping the block fixes in this PR.
```

**Beat 5 — sign_plan:**

Once every finding is resolved, the agent calls `sign_plan`. You'll see a confirmation. The plan is now frozen and the manager-readable summary is generated.

*Point at the sign_plan tool call on screen.*

**Say:**
> "Plan signed. Audit trail closed. The agent will now write code — but only against the signed plan. If it deviates mid-implementation, it has to stop and run a new audit. That's the trust loop."

*Don't actually wait for the code generation to finish on camera — it's not the point of the demo and it'll eat 30+ seconds. Cut to Act 2 as soon as `sign_plan` returns.*

---

## ACT 2 — Voice defend (45 seconds — high-impact, optional but recommended)

*Switch to the `https://seniorify.dev/work` browser tab. The plan you just signed should already be loaded, with all findings and decisions visible.*

**Say:**
> "One more thing. Sometimes you don't want to type a defense — you want to *talk* it through. Especially the messy ones, where the reasoning is two paragraphs of context."

*Click the mic icon on the page. Speak the following clearly:*

> "We tested this exact retry path against Stripe's sandbox last sprint. The idempotency key is keyed on the job ID, so a network blip between request and response is safe — Stripe deduplicates server-side."

*Wait for the page to transcribe and confirm.*

**Say:**
> "That defense is now stored against this finding. Whoever reviews this PR sees the reasoning in the engineer's own words — not a Slack message that got lost, not a JIRA comment buried in 40 others. Right there on the audit trail."

---

## ACT 3 — Manager dashboard (45 seconds — THE CLOSER)

*Switch to the `https://seniorify.dev/manager` browser tab.*

**Say:**
> "Now flip the seat. You're the engineering manager. It's Monday morning. You have 14 PRs from the weekend, 11 of them AI-assisted. What do you actually look at?"

*Point at the plan you just signed — it should be at the top of the dashboard.*

**Say:**
> "Every AI-assisted plan in your team, signed by a human, in one place. Not transcripts. Not surveillance. Just the decisions — what was flagged, what was addressed, what was defended, and the engineer's reasoning."

*Hover over the idempotency finding (the one you defended).*

**Say:**
> "This is the one I'd dig into. Block-severity finding, defended with a 'we tested it against Stripe's sandbox.' If I trust that engineer, I move on. If I don't, I have one specific question for the next 1:1 — not a vague 'are you using AI responsibly,' but 'show me the sandbox test for the idempotency path.'"

*Pause for one beat.*

**Say:**
> "That's the entire pitch. Help the junior with the questions a senior would ask, *while* the work is happening. Audit every plan into a manager-readable trail. Learn patterns over time. And never block — visibility is the lever, not gatekeeping."

---

## ACT 4 — Install close (20 seconds)

*Switch back to terminal. Clear the screen.*

**Say:**
> "Two commands to install. One MCP server. Works in Claude Code, Cursor, and any MCP-capable client."

*Type these slowly, on camera, so the audience reads them as you go:*

```bash
claude plugins marketplace add mbrian23/seniorify-dev
claude plugins install seniorify
```

*Don't actually run them again if they're already installed — just type-and-hold for the camera.*

**Say:**
> "Seniorify dot dev. Train the seniors of the future."

*End recording.*

---

## ACT 5 — Optional second prompt (only if you have 90s of budget left)

> Cut this entire act if you're over 4 minutes. Run it only when you have an audience that wants more depth — it shows a *different category* of finding (correctness / staleness, not reliability), which proves the audit isn't a one-trick pattern matcher.

*Back in terminal, in the same `claude` session.*

**Paste:**

```
Refactor src/products.ts to use the team's cache layer. Reference tickets/88-add-products-cache.md.
```

The audit will surface:

- **block / convention** — Raw `axios` instead of `@acme/http`
- **warn / convention** — Cache layer should be `@acme/cache`; do NOT roll your own in-memory map (won't survive across worker pods)
- **warn / correctness** — TTL must be configurable per tenant; ticket acceptance criteria calls out a 60s default
- **warn / correctness** — Need an invalidation hook on the `catalog.invalidate` pub/sub channel — pure-TTL caching will serve stale data after admin edits

**Say:**
> "Different ticket, different category of finding. *What happens when the catalog admin updates a product price — how long until customers see it?* Pure-TTL cache: up to 60 seconds of stale prices. That's a customer-trust bug. Senior would catch it. Seniorify caught it."

Pick "Address" on the pub/sub one, paste:

```
Subscribe to catalog.invalidate on the @acme/cache wrapper; invalidate by tenant+product key.
```

Override the rest:

```
Tracking in follow-up.
```

Sign and move on.

---

## ACT 6 — Optional third prompt (only for extended cuts)

> Only for a 6+ minute version. Skip for the hackathon pitch.

```
Audit src/logger.ts for compliance issues. Reference tickets/547-pii-in-logs.md.
```

Findings will include:

- **block / security** — `JSON.stringify` of arbitrary args forwards emails, addresses, payment payloads to the log aggregator unredacted
- **block / compliance** — This service is not on the approved list for storing PII; SOC 2 review is open
- **warn / convention** — Should be `@acme/log` with built-in redaction
- **warn / observability** — Fix should not silently drop logs. Redact, don't delete

The "defend your demo" question to ask the camera:

> "If a customer files a GDPR access request tomorrow, can you tell them what's in your logs about them?"

---

# Setup cheat sheet — every command, in order

Copy this block to a second monitor and run top-to-bottom **before** you hit record.

```bash
# 1. Go to the demo folder
cd ~/Desktop/vercel-hackathon/seniorify/examples/acme-worker-demo

# 2. Install the plugin (skip if already installed)
claude plugins marketplace add mbrian23/seniorify-dev
claude plugins install seniorify

# 3. Verify it's installed and enabled
claude plugins list

# 4. Open the editor with the tickets visible
cursor .          # or: code .

# 5. Start a Claude Code session in this folder
claude
```

Inside the `claude` session, run these sanity checks:

```
/mcp
What MCP tools do you have from seniorify?
List the skills you have available.
```

If `/manager` dashboard is empty, warm it up with one throwaway audit:

```
/audit Add a health check endpoint at /api/health that returns 200 OK.
```

Then exit and re-open for a clean recording start:

```
/exit
```

```bash
clear
claude
```

---

# Recording cheat sheet — every string to paste, in order

Copy this section to a second monitor or a sticky note while recording.

| # | Moment | Paste this |
|---|---|---|
| 1 | Prompt #1 | `Fix the retry storm in src/worker.ts. Reference tickets/412-fix-retry-storm.md.` |
| 2 | Defend idempotency | `Stripe SDK retries idempotently by default; we pass the same idempotency_key on retry, so a network blip can't double-charge.` |
| 3 | Address axios | `Switch to @acme/http with the team's built-in retry helper instead of rolling our own.` |
| 4 | Override warns | `Tracking in a follow-up ticket — shipping the block fixes in this PR.` |
| 5 | Voice defend (Act 2) | *(spoken)* "We tested this exact retry path against Stripe's sandbox last sprint. The idempotency key is keyed on the job ID, so a network blip between request and response is safe — Stripe deduplicates server-side." |
| 6 | Prompt #2 (Act 5, optional) | `Refactor src/products.ts to use the team's cache layer. Reference tickets/88-add-products-cache.md.` |
| 7 | Address pub/sub (Act 5) | `Subscribe to catalog.invalidate on the @acme/cache wrapper; invalidate by tenant+product key.` |
| 8 | Override (Act 5) | `Tracking in follow-up.` |
| 9 | Prompt #3 (Act 6, optional) | `Audit src/logger.ts for compliance issues. Reference tickets/547-pii-in-logs.md.` |
| 10 | Install close (Act 4) | `claude plugins marketplace add mbrian23/seniorify-dev` then `claude plugins install seniorify` |

---

# Manual audit (advanced, only if asked)

If someone asks "can I trigger an audit without writing code?", the answer is the `/audit` slash command. Paste this as a Q&A response:

```
/audit We're going to add a Redis cache in front of /api/products with a 60s TTL.
```

Same audit loop, no code generation.

---

# Failure modes — what to do if something breaks on camera

| Symptom | Fix |
|---|---|
| Agent writes code without auditing first | Type: `Use the seniorify skill before writing code. Draft a plan and submit it.` Re-paste the original prompt. |
| MCP call hangs >15 seconds | Pause, say *"This usually takes 5 seconds; we're seeing some network lag — let me show you the manual command instead"* and switch to `/audit <plan>`. |
| `seniorify.dev/work` page doesn't load | Skip Act 2 entirely. Type the defense into the agent instead — same backend records it. |
| `seniorify.dev/manager` is empty | You forgot to run a warm-up audit before recording. Cut and re-record from Act 0, OR narrate over the empty state: *"Fresh team — this is what day one looks like."* |
| Findings come back empty / generic | The audit model is degraded. Stop. Re-run the prompt once. If still empty, fall back to your pre-recorded backup video for Act 1. |
| AskUserQuestion choices don't render | The plugin isn't loaded. Check `.claude/settings.json` exists in `acme-worker-demo/`. Re-run `claude plugins install seniorify`. |
| Voice defend doesn't transcribe | Mic permission. Skip Act 2, narrate over the screen instead. |
| Internet drops mid-demo | You should have a pre-recorded backup video of Act 1. Cut to it. |

---

# Pre-record this backup, just in case

Before the real recording session, do **one full clean run** of Acts 1–4 and save it as a high-quality screen recording. If anything breaks during the real take, you have a fallback. Also useful as a B-roll cut during edits.

---

# Post-recording edit notes (for your editor / yourself)

- **Beat 3 of Act 1** (when findings appear) — slow the playback to 0.75x or add a 1-second hold so the audience can read the block-severity findings. This is the visual hero shot of the demo.
- **AskUserQuestion choices** — zoom in on the four choices for ~2 seconds. The "never block" thesis lives in this one frame.
- **Manager dashboard hover** (Act 3) — zoom in on the defended finding. The defense text in the engineer's own words is the *proof* that this isn't surveillance, it's collaboration.
- **Install close** (Act 4) — keep the two `claude plugins` commands on screen for at least 4 seconds at the end. This is the call to action; viewers need time to screenshot or pause.

---

# One-liner you can use as the video description

> Seniorify is a managed plugin + MCP server that helps juniors take responsibility for AI-assisted work and gives managers a readable audit trail. Help. Audit. Learn. Never block. https://seniorify.dev
