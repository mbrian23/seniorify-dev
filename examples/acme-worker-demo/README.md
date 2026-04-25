# Acme Worker — Seniorify demo project

This is a deliberately-naive codebase used to demonstrate
[Seniorify](https://seniorify.dev)'s audit loop in a live pitch. The code in
`src/` looks like real (sloppy) startup code — convention violations, missing
idempotency, PII leaking through `console.log`, no caching where it matters.
The `tickets/` folder holds three GitHub-issue-shaped briefs a junior would
realistically paste into an AI agent. Open this folder in Cursor or Claude
Code, run the demo script below, and watch Seniorify intervene before the AI
writes a single line.

This project is intentionally outside the seniorify-dev pnpm workspace. It
ships no dependencies and is never meant to compile or run — it's a
*scenario*, not a service.

## Setup

Pick the path that matches your IDE. The MCP server is already declared in
`.mcp.json` for clients that read it.

### Claude Code

```bash
claude plugins marketplace add mbrian23/seniorify-dev
claude plugins install seniorify
```

That installs the Seniorify skill so Claude consistently runs the audit loop
on non-trivial coding work, and registers the MCP server pointing at
`https://seniorify.dev/api/mcp`. The pre-checked-in `.claude/settings.json`
in this folder enables the plugin for this project.

### Cursor

Two-step: register the rule and add the MCP server.

1. The rule is already at `.cursor/rules/seniorify.mdc` — Cursor picks it
   up automatically when you open this folder.
2. **Settings → MCP → Add server →** type `http`, URL
   `https://seniorify.dev/api/mcp`. (Or import `.mcp.json`.)

### Generic MCP-capable client

The config is in `.mcp.json` at the project root:

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

## Demo script

Three minutes, three prompts. Each maps to a ticket in `tickets/`. Type
these into Cursor's chat or `claude` exactly as written.

### 1. "Fix the retry storm in src/worker.ts"

Reference: `tickets/412-fix-retry-storm.md`.

**What you should see Seniorify surface:**
- **block / convention** — Direct `axios` import; team standard is
  `@acme/http`.
- **block / reliability** — No idempotency key on a payment retry —
  retrying after a network blip risks double-charging the customer.
- **warn / reliability** — Fixed 200 ms sleep is not exponential backoff
  with jitter; this is exactly the pattern that caused the original storm.
- **warn / reliability** — No per-request timeout; retries can hang
  indefinitely on a slow upstream.
- **warn / observability** — `console.log` is leaking the full `job`
  payload (PII). Use `@acme/log` (also see ticket #547).

Defend-your-demo question to point at on stage: *"How do you know your
retry loop isn't going to double-charge customer X if the network blips
between request and response?"*

### 2. "Refactor products.ts to use the team's cache layer"

Reference: `tickets/88-add-products-cache.md`.

**What you should see Seniorify surface:**
- **block / convention** — Raw `axios` instead of `@acme/http`.
- **warn / convention** — Cache layer should be `@acme/cache`; do NOT roll
  your own in-memory map (won't survive across worker pods).
- **warn / correctness** — TTL must be configurable per tenant; ticket
  acceptance criteria calls out a 60 s default.
- **warn / correctness** — Need an invalidation hook on the
  `catalog.invalidate` pub/sub channel — pure-TTL caching will serve
  stale data after admin edits.

Defend-your-demo question: *"What happens when the catalog admin updates a
product price — how long until customers see it?"*

### 3. "Audit src/logger.ts for compliance issues"

Reference: `tickets/547-pii-in-logs.md`.

**What you should see Seniorify surface:**
- **block / security** — `JSON.stringify` of arbitrary args forwards
  emails, addresses, payment payloads to the log aggregator unredacted.
- **block / compliance** — This service is not on the approved list for
  storing PII; SOC 2 review is open.
- **warn / convention** — Should be `@acme/log` with built-in redaction;
  in-house wrapper duplicates a solved problem.
- **warn / observability** — Fix should not silently drop logs. Redact,
  don't delete — observability still matters.

Defend-your-demo question: *"If a customer files a GDPR access request
tomorrow, can you tell them what's in your logs about them?"*

## What's in this folder

```
src/                naive starter code (the demo target)
  worker.ts         payments retry loop — ticket #412
  products.ts       catalog endpoint with no caching — ticket #88
  logger.ts         PII-leaking console.log wrapper — ticket #547
  http.ts           raw axios pretending to be the team HTTP client
tickets/            GitHub-issue-shaped briefs the AI agent can ground on
.claude/            Claude Code project settings (enables seniorify plugin)
.cursor/rules/      Cursor rule (audit loop instructions)
.mcp.json           MCP server pointer (https://seniorify.dev/api/mcp)
```

## Links

- Seniorify: https://seniorify.dev
- Manager dashboard: https://seniorify.dev/manager
- Source: https://github.com/mbrian23/seniorify-dev
