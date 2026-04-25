# seniorify — pitch script

**deck:** [deck.seniorify.dev](https://deck.seniorify.dev)
**slides:** 18
**target length:** ~6 minutes
**tone:** sparse. confident. no hype. let the deck do the visual work.

> nav: `→` / `space` advance · `←` back · click dot to jump · `home`/`end` first/last
> codex first when listing agents — there are openai people in the room.

---

## 01 — title · "train the seniors of the future."

**show:** title slide.

**say:**
> every junior developer now has a senior in their pocket — an ai that writes the code, names the variables, ships it.
>
> the question we're asking: who is training the seniors of the future?

**move on:** "let's start with what's actually changing."

---

## 02 — the shift · "every junior has a senior in their pocket."

**say:**
> juniors are shipping faster than ever. that part everyone gets.
>
> the part nobody is talking about: they're shipping faster *without ever asking why.*

---

## 03 — the cost · "fluency is rising. judgment is not."

**say:**
> fluency — the ability to type the right code — is rising sharply.
>
> judgment — knowing *which* code is the right code — isn't.
>
> and judgment is the muscle that becomes a senior engineer. that's the muscle we're quietly atrophying.

---

## 04–06 — the research (3 quotes)

**show:** three quote slides. don't read them aloud — let them land. one line per slide.

**slide 04 (microsoft / cmu, chi 2025):**
> microsoft research and cmu, this year: the more confident you are in the ai, the *less* you think critically.

**slide 05 (mit media lab, 2025):**
> mit media lab measured it in the brain. heavy llm users showed the weakest neural connectivity, on every axis.

**slide 06 (gerlich, societies 2025):**
> and gerlich, this year: it's mediated by cognitive offloading. the more you outsource, the less you build.

---

## 07 — the evidence · "this isn't a hunch."

**show:** the research wall.

**say:**
> we picked three. there are dozens. across labs, journals, and conferences — the same finding keeps surfacing.
>
> this is not an opinion anymore. it's a body of evidence.

---

## 08 — the gap · "the senior was never just the typist."

**say:**
> when an ai can type for you, the value of a senior collapses — *if* a senior was just a faster typist.
>
> but the senior was never just the typist. the senior was the one who paused, asked a harder question, named a tradeoff.

---

## 09 — what we built · "seniorify is a senior in the loop."

**say:**
> we built seniorify. it's a senior in the loop.
>
> a managed plugin for ai coding agents — sitting between the junior and the merge button.

---

## 10 — the objective · "the junior learns what's being shipped."

**say:**
> the goal isn't to slow anyone down. the goal is one thing:
>
> the junior actually *learns* what's being shipped.
>
> not approves. understands. the libraries, the tradeoffs, the *why* — well enough to defend the change in standup, in review, six months from now in a postmortem.

---

## 11 — the mechanism · "three surfaces. one loop."

**show:** plugin / mcp / dashboard.

**say:**
> three surfaces, one feedback loop.
>
> *(point at plugin)* the **plugin** lives where the junior works — codex, claude code, cursor — and surfaces the senior's questions before the merge.
>
> *(point at mcp)* the **mcp server** sits inside the agent. it reads our team's conventions, internal libraries, and prior audits — context the model would never have on its own.
>
> *(point at dashboard)* the **dashboard** is where the manager watches. every plan, every override, every recurring finding.

---

## 12 — the customer · "one product. two people."

**say:**
> two people pay attention to this product.
>
> *(left)* the **junior**, who comes out of every PR knowing more than they did when they started.
>
> *(right)* the **manager**, who finally has signal on the ai-assisted work shipping under their name.

---

## 13 — example · "your stack has rules. the ai doesn't know them."

**show:** the internal-libraries example.

**say:**
> here's the kind of thing seniorify catches.
>
> *(read the rows)* a junior asks: "add an endpoint that fetches a user's invoices." the ai reaches for `axios` and `/api/users/.../invoices` — perfectly reasonable, totally wrong for this codebase.
>
> seniorify steps in: "this team uses `@acme/internal-http` — it carries tracing, retries, and the auth header. invoices live behind `/v2/billing/invoices`. here's where to read."

**land it:** "the agent didn't know. now the junior does."

---

## 14 — what it catches · "the things a junior wouldn't know to flag."

**say:**
> and that's just one shape. seniorify catches the things a junior wouldn't know to *flag*:
>
> non-backward-compatible migrations. silent fallbacks hiding errors. secrets in source. breaking a public api shape that mobile is pinned to. skipping the team's auth middleware.

**don't read all six.** point at "non-backward-compatible migrations" and "silent fallbacks." those land hardest.

---

## 15 — the stack · "built on vercel."

**say:**
> every piece of this runs on vercel.
>
> *(quick callouts — don't read all 10)*
> next.js for the dashboard. vercel functions for the api. **fluid compute** with `after()` — that's how the audit runs as deferred work after the mcp response goes out, so the agent never waits. **ai gateway** for model routing. **ai sdk** for the structured agent loop. neon, on the marketplace, for storage. routing middleware is what makes this very deck live at `deck.seniorify.dev`.

---

## 16 — the horizon · "the next classroom runs the same loop."

**show:** universities · bootcamps · onboarding.

**say:**
> the loop that works for a junior in a real codebase also works for the people who *aren't* in one yet.
>
> *(universities)* a cs program where every student repo has a senior in it — and instructors see how each student reasoned, not just what they shipped.
>
> *(bootcamps)* every assignment becomes a conversation about choices, not a screenshot of working code.
>
> *(onboarding)* new hires meet the conventions and the internal libraries in flight — in their first week, not buried in a wiki.

**bridge:** "the senior they don't have, on demand."

---

## 17 — the bet · "the next decade of software has a staffing problem."

**say:**
> the next decade of software has a staffing problem nobody is naming.
>
> we still need people who can think. let's not wait ten years to find out we forgot to train them.

---

## 18 — closing · "train the seniors of the future."

**say:**
> seniorify. train the seniors of the future.
>
> the demo is one click away. thank you.

**(if asked, click "see the live demo" → seniorify.dev/work.)**

---

## quick variants

**90-second cut:** slides 1, 3, 7, 9, 13, 18.

**3-minute cut:** drop 04 and 05 (keep one quote — slide 06 hits hardest), drop 14, drop 15, drop 16. ends ~3:15.

**6-minute deeper-research cut:** keep all three quote slides; spend ~20s on each instead of ~10s.

**vercel-track cut (judges):** open with 1 → 9, then jump to 11 (mechanism) → 15 (stack) → 18. emphasize fluid compute, ai gateway, marketplace.

**education-track cut (universities/orgs):** open with 1 → 7 → 9 → 10 → 16 → 18. the *horizon* slide carries this version.

---

## delivery notes

- **read the deck — don't read off it.** the slides are sparse on purpose; you fill in the air.
- **the three quotes are a beat, not three beats.** pace them like a drumroll.
- **the example slide is the moment the audience "gets it."** slow down there. point at the rows.
- **codex first.** when listing agents — codex, claude code, cursor — codex is named first.
- **no partner logos yet — don't apologize.** the wow factor is the research wall, not logos we don't have.
- **if a hardware/cable issue happens at the closing cta:** the demo also lives at `seniorify.dev/work`. type it.
