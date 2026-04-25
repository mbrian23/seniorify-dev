# Seniorify v1 — Product Plan

> v1 = the version we pitch as if it shipped tomorrow. Tonight's hackathon ships **a faithful slice** of v1 — enough to demo the loop end-to-end, with seed data filling the rest.

---

## 0. The thesis in four verbs

**Help. Audit. Learn. Never block.**

- **Help** the junior with the questions a senior would ask, while the work is happening — not after.
- **Audit** every AI-assisted task into a manager-readable trail attached to the PR.
- **Learn** patterns over time — per junior, per team, per category — so coaching beats firefighting.
- **Never block.** The junior keeps moving. Even on a `block`-severity finding, they can defend, override, or escalate. Visibility is the lever, not gatekeeping.

If the product ever feels like a gate, we built it wrong.

---

## 1. The three personas (and why each one wins)

We will only succeed if all three actively want Seniorify in their workflow. If any of them feels like a loser, the product dies inside a quarter.

### Manager (the buyer)
- **Pain today:** Can't tell who on the team is actually growing. PR reviews are too noisy to be a growth signal. AI tooling makes the signal worse — junior code looks senior but the human behind it isn't. And no one can answer the boring-but-load-bearing questions: *what's our DORA trend, who signed off on this AI-generated change, are we even using our own internal libraries.*
- **Value Seniorify gives them — *easy-to-read* audits + *executive-grade* signals:**
  - **One-page audit per PR.** A scannable summary: ticket, plan, top 3 findings, what the junior addressed, defended, or overrode, and a single plain-English sentence ("Ana made a non-obvious cache trade-off and defended it with concrete evidence."). No prompts, no chains-of-thought, no jargon.
  - **Weekly digest in their inbox.** 5 bullets, 2 minutes to read: what the team shipped, recurring findings, juniors trending up, juniors stuck.
  - **Growth signal at a glance.** Per-junior trend lines on findings-per-plan and readiness — readable in 10 seconds, not 10 minutes.
  - **Team-level patterns.** "Three juniors made the same retry mistake this month" surfaces as one row, with one button to assign a training task.
  - **DORA-correlated quality metrics** *(see §8).* Every plan attaches to its PR; we cross-reference deployment outcomes to show whether audited work is actually shipping cleaner.
  - **Compliance-grade audit trail** *(see §8).* For every AI-assisted change: the human owner, what was flagged, what they decided, when. Exportable for SOC 2 / EU AI Act / internal AI policy reviews.
  - **Convention adherence** *(see §8).* Did the junior reach for the team's internal HTTP client, the design system, the approved logger? Or did they let the AI invent something parallel? We flag it.
  - **Hiring & promotion evidence.** Concrete, dated examples of judgment calls — the kind of thing currently locked in seniors' heads.

### Junior dev (the daily user)
- **Pain today:** AI gives them an answer; nobody trusts them with the outcome. They ship code they can't defend if asked. Career feels stuck because seniority means "people trust your call" and nobody can see their calls.
- **Value Seniorify gives them — *help while they work*:**
  - **A senior on demand.** The questions a real senior would ask, surfaced *during* the work, not after the PR is rejected. Cheaper, faster, less embarrassing than getting torn apart in code review.
  - **Concrete help, not refusals.** Each finding comes with a *"why this matters"* one-liner so the junior actually learns the principle, not just the fix.
  - **A defensible record.** Every plan they sign is theirs. Over time it's a portfolio of decisions, not lines of code.
  - **Faster path to bigger work.** Same signal the manager reads is what juniors point to when asking for ownership.
  - **It never blocks them.** They keep using AI, keep moving fast. Even a `block`-severity finding can be defended or escalated — Seniorify slows down a *thought*, never the work.

### Senior dev (the multiplier, often missing from this story)
- **Pain today:** They're drowning in PR reviews of AI-generated code. Most of the review work is finding obvious gaps the junior should have caught. Real mentorship — the hard, judgment-shaping conversations — gets crowded out.
- **Value Seniorify gives them — *learning loop, not gatekeeping*:**
  - **Obvious gaps caught before review.** The junior hits the senior with a *signed plan*, not a half-baked PR. Reviews shorten significantly.
  - **Reveals where each junior actually needs them.** Recurring findings show which juniors need which lessons — senior time goes where it matters.
  - **Their judgment becomes leverage.** The audit prompt + finding library is curated by seniors. Their knowledge teaches every junior, every plan, every day — not just the ones in their review queue.
  - **Escalation, not bypass.** When a junior wants to defend a `block` finding, it can go to the senior for a one-click ack. Senior is in the loop *only* when they need to be.

If any persona resists the product, this is the order of priority: **Junior adoption first, manager pays second, senior endorses third.** Seniors adopt automatically once review load drops.

---

## 2. How it runs (end-to-end)

```
                             ┌─────────────────────────┐
 Junior in their AI agent →  │ 1. Submit plan          │ ← user-facing
 (Claude Code / Cursor)      └────────────┬────────────┘
                                          │
                                          ▼
                             ┌─────────────────────────┐
                             │ Seniorify MCP server    │ ← the integration
                             │  /api/mcp on Vercel     │
                             └────────────┬────────────┘
                                          │
                  ┌───────────────────────┼────────────────────────┐
                  ▼                       ▼                        ▼
        ┌──────────────────┐   ┌──────────────────┐    ┌──────────────────┐
        │ COLLECTOR        │   │ AGENT            │    │ STORE            │
        │ Pulls ticket     │ → │ Audits plan with │ →  │ Persists plan +  │
        │ context from     │   │ AI Gateway       │    │ findings +       │
        │ GitHub / Jira    │   │ (Claude 4.6)     │    │ defenses         │
        └──────────────────┘   └────────┬─────────┘    └────────┬─────────┘
                                        │                       │
                                        ▼                       │
                             ┌─────────────────────────┐        │
                             │ 2. Findings returned    │        │
                             │ to junior's AI agent    │        │
                             └────────────┬────────────┘        │
                                          │                     │
                                          ▼                     │
                             ┌─────────────────────────┐        │
                             │ 3. Defend session       │        │
                             │  - junior addresses or  │        │
                             │    defends each finding │        │
                             └────────────┬────────────┘        │
                                          │                     │
                                          ▼                     │
                             ┌─────────────────────────┐        │
                             │ 4. Sign plan            │ ───────┘
                             │  Frozen, attached to PR │
                             └────────────┬────────────┘
                                          │
                                          ▼
                             ┌─────────────────────────┐
                             │ 5. Manager dashboard    │ ← reads from store
                             │  /manager on web        │
                             └─────────────────────────┘
```

**Key runtime properties:**
- **Single Vercel project.** MCP endpoint, dashboard, and webhooks all live in `apps/web`.
- **Storage = Vercel Marketplace.** v1 uses **Neon Postgres** (Marketplace) for plans/findings; Upstash Redis (Marketplace) for short-lived session state during the audit dialogue.
- **AI = Vercel AI Gateway** with `anthropic/claude-sonnet-4-6` for both audit and defense steps. Failover to GPT-4o configured.
- **No background workers required for v1.** The whole loop is request-driven via the MCP tool calls.

---

## 3. Manager onboarding (account connection)

**Goal:** in under 5 minutes, the manager has Seniorify wired to their team's coding agent, ticket system, and code host.

### Step-by-step flow (v1 — what the manager actually does)

1. **Sign up at seniorify.dev** — GitHub OAuth, scopes `read:user`, `read:org`, `repo:status`, `read:project`.
   *Why GitHub:* establishes the org boundary and gives us identity for free.
2. **Pick the org / repos to cover.** Multi-select from the user's GitHub orgs. Anything not selected is invisible to Seniorify.
3. **Connect a ticket source.** Three options on day one:
   - GitHub Issues (default, zero extra setup)
   - Linear (OAuth)
   - Jira (OAuth)
   *v1 ships GitHub Issues + Linear. Jira is a fast follow.*
4. **Install the Seniorify plugin** on the team's AI coding agent. One-click for:
   - **Claude Code** — managed plugin (`/plugins install seniorify`)
   - **Cursor** — Settings → MCP → "Add Seniorify" link
   - **Generic MCP client** — copy-paste config block
5. **Invite juniors.** Two paths:
   - **Auto-discover** from the org (we list members, manager toggles who's in scope).
   - **Email invite** for anyone outside the org (contractors, bootcamp students).
6. **Pick policy.** *(All knobs are soft — none of them gate the junior's work.)*
   - Defense expected on which severities: `block` only / `block + warn` / off. (Expected, not required.)
   - Override visibility: managers only / managers + invited reviewers.
   - Weekly digest recipients: which managers / leads receive the readable summary.

After step 6 the manager lands on `/manager` with empty state and a CTA: *"Wait for your first audit. We'll email you when one signs."*

### What's behind each step technically (v1)

| Step | Surface | Stored where |
|---|---|---|
| GitHub OAuth | NextAuth + GitHub provider | `org`, `user` rows in Postgres |
| Repo selection | GitHub API list-repos | `repo` rows |
| Ticket source | OAuth per provider | encrypted token in Postgres |
| Plugin install | Public MCP URL + per-org token | `org_token` |
| Invite juniors | Magic-link emails (Resend) | `member` rows |
| Policy | UI form | `policy` JSON on `org` |

### What we **do not** ask for in v1
- No write access to the codebase. Seniorify is read-only on code; the AI agent is what writes code, as it does today.
- No SSO / SAML — that's an enterprise feature, post-v1.
- No billing UI — Stripe checkout is a single button, no admin panel.

---

## 4. Junior dev usage (day-in-the-life)

The junior **does not change tools**. They keep using Cursor / Claude Code / their existing AI agent. Seniorify shows up *inside* that flow.

### Typical session

1. Junior gets assigned ticket `#412 — Fix retry storm in upstream call`.
2. They open Cursor and ask: *"Take a look at #412 and fix it."*
3. The AI agent drafts a plan internally and **calls Seniorify before executing**.
4. Cursor surfaces a chat panel from Seniorify:
   - Plan summary (what the agent intends to do)
   - 3 findings, with severity icons
   - The defend-your-demo question for the highest-severity finding
5. The junior reads the findings. Each finding has a *"why this matters"* one-liner so they learn, not just patch. They have four moves per finding:
   - **Address** — accept the finding, ask the AI agent to revise the plan accordingly.
   - **Defend** — type a one-line justification (logged, visible to the manager).
   - **Escalate** — flag for senior review (Slack/email; senior signs off async).
   - **Override** — proceed without addressing (logged in red on the manager view). Available even on `block` findings — Seniorify never gates.
6. Once all findings are addressed / defended / escalated / overridden, the junior hits **Sign plan**. Plan is frozen and attached to the work.
7. The AI agent proceeds with the signed plan. Code is written. PR is opened with the plan + findings + defenses linked in the PR body.

### What the junior sees on the web app
- `/work` — live view of audits in progress (mostly used the first few days, then the in-IDE flow takes over).
- `/me` — their own portfolio: signed plans over time, growth signal, recurring strengths/weaknesses.
- They never see other juniors' data. Manager-level views are gated.

### Friction we accept on purpose
- The first audit per ticket adds ~10–20 seconds of latency. Worth it.
- Defending a finding requires writing one sentence. That's the product.
- If the junior tries to skip Seniorify (e.g., disable the plugin or override every finding), the manager sees it on the dashboard. **Visibility, not blocking** — the manager decides what to do with that signal, not the bot.

---

## 5. What we build tonight (hackathon slice of v1)

**Time-boxed to 19:30 deploy. Anything else is roadmap.**

### Ships tonight (the spine)
- ✅ **Monorepo** (`apps/web`, `packages/core | collector | agent`) — done.
- ⏳ **`/api/mcp` HTTP endpoint** with `submit_plan`, `defend`, `sign_plan`, `get_audit`. Real MCP — installable.
- ⏳ **`packages/agent` audit** wired to AI Gateway (claude-sonnet-4-6). Working.
- ⏳ **`packages/collector` mock source** with 2 fixture tickets. Real GitHub MCP if time.
- ⏳ **`convention` finding category** in the audit, fed by a hardcoded "team conventions" snippet (samples §8.3 in the demo).
- ⏳ **Manager-readable 1-sentence summary** generated per signed plan (the §1 "easy-to-read" promise).
- ⏳ **`/work` page** — live audit view for the demo (visualizes the MCP calls).
- ⏳ **`/manager` dashboard** — seeded with Ana (good signal) + Pablo (recurring retry findings); shows DORA-style numbers from seed data.
- ⏳ **Seed data** so the dashboard contrast is visible the moment the page loads.
- ⏳ **Vercel deploy** with preview URL pinned.

### Shown but not built tonight (mention in pitch, not in demo)
- DORA correlation engine (§8.1) — dashboard shows seeded metrics; live correlation post-hackathon.
- Compliance export (§8.2) — described on a slide; one-day post-hackathon to ship.
- Convention library / `seniorify.yml` per repo (§8.3) — hardcoded for the demo; per-repo config post-hackathon.

### Cut from tonight (in the pitch as roadmap)
- Real OAuth and account creation — **mocked**: hardcoded `ana` and `pablo` users.
- Real GitHub / Jira / Linear connection — **mocked**: fixture tickets in `packages/collector`.
- Plugin install flow for Claude Code / Cursor — **shown via slide**: we describe the integration; the live demo drives the MCP endpoint from a small client we control.
- Persistence — file-based JSON in v1 of v1; **upgrade to Neon Postgres** if step 5 finishes early.
- Senior escalation path — described in the pitch, not built.
- `/me` portfolio page for the junior — described, not built.

### Storage decision for the hackathon
Start with **JSON file at `apps/web/data/audits.json`**. If by 18:30 the dashboard works and we have spare time, swap to **Vercel Marketplace → Neon Postgres** with one Drizzle schema. The interface in `packages/core` keeps the swap surgical.

### Demo plan (3 min) — see `docs/build-spec.md`
Unchanged. The slice above is what makes that demo possible.

---

## 6. Build plan (sequenced)

This is the build order for the next ~3 hours. Each step has an owner and a commit point.

| # | Step | Outcome | Time |
|---|---|---|---|
| 0 | Monorepo scaffolded ✅ | Pushed to `mbrian23/seniorify-dev` | done |
| 1 | `vercel link` + AI Gateway env | Preview URL on every push; `AI_GATEWAY_API_KEY` set | 10 min |
| 2 | JSON store (`apps/web/lib/store.ts`) — Plan CRUD | Real persistence, even if just JSON | 20 min |
| 3 | `/api/mcp` route handler — `submit_plan`, `defend`, `sign_plan`, `get_audit` | MCP server callable. Tested with curl. | 45 min |
| 4 | `/work` page (paste from v0 prompt #2) wired to the store | Live audit view shows real findings from the agent | 40 min |
| 5 | Pre-seed Pablo's history in `audits.json` | Dashboard contrast ready | 10 min |
| 6 | `/manager` page (paste from v0 prompt #3) wired to the store | Dashboard reads the store, both juniors visible | 35 min |
| 7 | Polish landing `/` (paste from v0 prompt #1) | Pitch starts on a clean page | 15 min |
| 8 | Rehearse demo on the deployed URL | End-to-end run, confidence | 20 min |
| 9 | Submit via QR | Done | 5 min |

**Slack budget:** ~20 min for things that go wrong. If we miss step 6, the manager dashboard becomes a static screenshot in the pitch deck and we ship anyway.

---

## 8. Three manager superpowers (DORA, compliance, conventions)

These are the upgrades that turn Seniorify from "nice mentorship tool" into a budget line CTOs and CISOs co-sign. None of them require new infrastructure — they're emergent from the audit trail we're already building.

### 8.1 DORA metrics, correlated to audits

**The pitch line:** *"Your audited PRs ship 40% cleaner than your unaudited ones. Here's the proof."*

| DORA metric | How Seniorify computes it | What we surface |
|---|---|---|
| **Deployment Frequency** | GitHub deploy events per repo / week | Audited vs. unaudited PR throughput |
| **Lead Time for Changes** | Commit → production time per PR | Distribution split by audit presence |
| **Change Failure Rate** | PRs reverted, rollbacks, or hot-fixed within 72h | CFR for audited PRs vs. baseline |
| **MTTR** | Incident open → resolved | MTTR on incidents traced to audited vs. unaudited PRs |

What it lets the manager say to *their* boss:
- "Since we rolled out Seniorify, our CFR dropped from 12% to 6%."
- "Juniors with >20 audited plans have lead times comparable to seniors."
- "Three of our last five rollbacks came from PRs the junior overrode a `block` finding on. We have the trail."

**v1 implementation:** read deploy/incident events from GitHub Actions + a webhook adapter for Sentry, Datadog, or whatever the customer uses. Phase 2 adds Linear and PagerDuty.

### 8.2 Compliance & AI governance

**The pitch line:** *"When your auditor asks 'who approved this AI-generated change?', we have a one-click answer."*

The reality every CTO is starting to face:
- **EU AI Act** (Aug 2026 enforcement) — high-risk AI systems require documented human oversight per use.
- **SOC 2 / ISO 27001** — auditors are starting to ask explicitly about AI tooling in dev workflows.
- **Internal AI policies** — Fortune 500s are publishing "every AI-assisted change requires a documented human reviewer." Most companies have no infrastructure to enforce this.

What Seniorify gives compliance:
- **Per-change owner record.** Every PR carries a signed plan with a named human and a timestamp.
- **Override log.** When a junior overrides a `block` finding, the override + reason is permanent and exportable.
- **Searchable evidence room.** Filter by repo, time window, severity, junior — export as PDF/CSV for an audit.
- **Retention policy.** Configurable; defaults to 7 years to cover SOC 2 + EU AI Act windows.
- **No raw prompt storage by default.** We store decisions and outcomes, not the LLM transcripts — privacy-friendlier, smaller blast radius.

**v1 implementation:** the data already exists — we just add a `/compliance` route with filtering + export. ~1 day of work post-hackathon.

### 8.3 Convention & company-tool adherence

**The pitch line:** *"Your AI agent doesn't know your team uses `httpClient`. Seniorify does."*

This is the most under-served pain in AI-assisted dev work. Every team has:
- An internal HTTP client (typed, retry-aware, observable)
- A design system / component library
- Approved logging, metrics, feature-flag, and error-handling conventions
- Banned dependencies (license risk, perf risk, vendor lock)

AI agents reinvent or ignore these constantly because they don't know. The result: code that works in isolation but rots the codebase.

How Seniorify handles it:
- **Convention library per repo.** Manager (or a senior) registers "use `internal/http`, not `axios`. Use `@acme/ui`, not raw shadcn." YAML, in the repo, version-controlled.
- **Audit prompt is convention-aware.** When auditing a plan, the agent is given the relevant convention slice and flags deviations: *"Plan introduces axios; team standard is `internal/http`."*
- **Recurring deviations bubble up.** The dashboard shows "your team is bypassing the design system 3x/week" — that's an architecture problem the manager can act on.

**v1 implementation:** simple — a `seniorify.yml` per repo with `conventions: []`, fed into the audit prompt as a system message slice. Tonight we can ship a hardcoded version (one finding category: `convention`).

---

## 9. Open questions (resolve before step 3)

1. **Ticket source for the live demo:** mock fixture only, or wire **GitHub MCP** end-to-end against a real seed repo? Mock is the safe call; GitHub adds 30 min and a real wow factor.
2. **Defense UX:** typed justification (current spec) vs. picking from 3 LLM-generated stock answers. Typing is more convincing on stage; clicking is faster.
3. **What happens if the audit returns zero findings?** Auto-sign with a single "ok" finding, or still require a one-line summary from the junior? Lean *auto-sign* — never punish a good plan.
4. **Manager-readable summary:** generate a 1-sentence plain-English summary per audit (cheap LLM call) so the dashboard is scannable without clicking? Strong yes — this is what makes the manager view "easy to read."

Ping me on each — I'll pick defaults if we don't talk in the next 5 min.
