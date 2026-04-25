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

You will receive `{ planId, status: "auditing" }` immediately. Poll
`GET https://seniorify.dev/api/audits/<planId>` every 1.5 s until the
`findings` array is non-empty (typically 3–8 seconds).

## 3. Surface findings to the user

For each finding, show the user:
- the **severity** (block / warn / ok) and the **category**
- the one-line **title**
- the 1–3 sentence **detail**

Then for the highest-severity open finding, ask the user a "defend your demo"
question that probes whether they understand the risk.

## 4. Let the user decide per finding

For each open finding the user can:
- **address** it — they want you to revise the plan accordingly. Update the
  plan in your head, call `submit_plan` again with the revised text. The
  previous findings should now be resolved or different.
- **defend** it — they have a reason it's not actually a problem. Call
  `update_finding` with `{ planId, findingId, status: "defended", defense:
  "<their one-line reason>" }`.
- **override** it — they accept the risk. Call `update_finding` with
  `{ planId, findingId, status: "overridden", defense: "<reason>" }`.

You never override on the user's behalf. Always ask.

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
