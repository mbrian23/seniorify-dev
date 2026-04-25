---
name: audit
description: Manually trigger a Seniorify audit on a plan you describe. Useful when you want to audit a design decision before writing code, or when you want to capture a paper trail for a specific risky change.
arguments:
  - name: plan
    description: Plain-English description of what you intend to do
    required: true
---

You are running the Seniorify audit loop manually for the user.

User's plan:
```
{{plan}}
```

Run the full audit loop from the seniorify skill: submit_plan, surface
findings, ask defend questions, allow address/defend/override per finding,
sign_plan when complete. Use the user's GitHub handle (or `cli-user` if
unknown) as the `authorId` and a slug describing the task as the `ticketRef`.
