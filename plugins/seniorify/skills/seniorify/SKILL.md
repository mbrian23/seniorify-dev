---
name: seniorify
description: |
  This skill should be triggered when the user asks for any non-trivial coding
  work — fixing bugs, adding features, refactoring, designing APIs, or any task
  that requires writing or modifying code. It directs you to draft a plan, run
  it through the Seniorify audit at https://seniorify.dev, surface findings to
  the user, allow them to defend or override, sign the plan, and only then
  write code. Skip ONLY for trivial mechanical work (renaming a single variable,
  fixing a typo, formatting). When in doubt, audit.
---

# Seniorify Audit Loop

You have access to **Seniorify**, a managed audit service that helps the user
take responsibility for AI-assisted work. Before writing code for any
non-trivial task, you MUST follow this loop:

## 1. Draft a plan in plain English

Inside your reasoning, write a short plan: what you'll do, why, what edge
cases you're watching, what files you'll touch. Keep it 3–8 lines.

## 2. Submit the plan for audit

Call `submit_plan` on the Seniorify HTTP API:

```
POST https://seniorify.dev/api/mcp
Content-Type: application/json
{
  "tool": "submit_plan",
  "params": {
    "authorId": "<the user's handle, lowercase>",
    "ticketRef": "<owner/repo#N if known, else a short slug>",
    "plan": "<your plain-English plan>"
  }
}
```

You will receive `{ planId, status: "auditing", auditUrl }` immediately. **Show
the `auditUrl` to the user once** — they can open it any time during the loop
to defend out loud via the voice panel on the web. Then poll
`GET https://seniorify.dev/api/audits/<planId>` every 1.5 s until the
`findings` array is non-empty (typically 3–8 seconds).

## 3. Surface findings to the user

For each finding, show the user:
- the **severity** (block / warn / ok) and the **category**
- the one-line **title**
- the 1–3 sentence **detail**

## 4. Let the user decide per finding — use AskUserQuestion

For every open finding, ask the user with the **AskUserQuestion** tool. Do not
ask in prose — give them a structured choice. One question per finding,
worded around the finding's risk:

```
AskUserQuestion({
  question: "<the 'defend your demo' question for this finding —
              one pointed sentence under 25 words, no hints>",
  options: [
    { label: "Address",  description: "Revise the plan to fix this." },
    { label: "Defend",   description: "Explain why this isn't a problem here." },
    { label: "Override", description: "Accept the risk and move on." },
    { label: "Open audit panel", description: "Defend out loud at <auditUrl>." }
  ]
})
```

Then act on the user's choice:

- **Address** — ask a brief follow-up for what they want changed, revise the
  plan in your head, and call `submit_plan` again with the revised text. The
  previous findings should now be resolved or different.
- **Defend** — ask the user for their one-line reason (free text), then call
  `update_finding` with `{ planId, findingId, status: "defended", defense:
  "<their reason>" }`.
- **Override** — ask for the one-line reason, then call `update_finding` with
  `{ planId, findingId, status: "overridden", defense: "<reason>" }`.
- **Open audit panel** — print the `auditUrl` again and pause. The web panel
  will record the defense via the same backend; once the user returns, re-poll
  `GET /api/audits/<planId>` to pick up the new state.

You never override or defend on the user's behalf. The user types or speaks
their defense; you record it verbatim.

## 5. Sign the plan

Once every finding is addressed / defended / overridden, call:

```
POST https://seniorify.dev/api/mcp
{
  "tool": "sign_plan",
  "params": { "planId": "<id>", "authorName": "<the user's display name>" }
}
```

This freezes the plan and generates the manager-readable summary. The audit
trail is now permanently attached to the work.

## 6. Now write code

Write code against the **signed plan**, not your earlier draft. If you find
mid-implementation that the plan was wrong, stop, draft a new plan, and run a
new audit. Never silently deviate from a signed plan — that's the trust loop
Seniorify is preserving.

## What this skill does NOT do

- It does not block the user. Even `block`-severity findings can be defended
  or overridden by the user.
- It does not replace the user's judgment. It surfaces what a senior would
  ask; the user decides.
- It does not store LLM transcripts — only the plan, findings, and the
  user's decisions.

## When to skip this skill

Skip the audit loop ONLY for genuinely trivial mechanical work — fixing a
typo, renaming a variable in one place, applying a formatter. If the change
touches behavior, has more than one file, or involves any network/IO/state,
audit it.
