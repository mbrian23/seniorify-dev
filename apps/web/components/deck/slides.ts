export type TitleSlide = {
  kind: "title";
  eyebrow: string;
  title: string;
  subtitle: string;
};

export type StatementSlide = {
  kind: "statement";
  eyebrow: string;
  title: string;
  body?: string;
};

export type QuoteSlide = {
  kind: "quote";
  eyebrow: string;
  quote: string;
  attribution: string;
  source: string;
  year: string;
};

export type PillarsSlide = {
  kind: "pillars";
  eyebrow: string;
  title: string;
  pillars: ReadonlyArray<{ label: string; body: string }>;
};

export type ResearchSlide = {
  kind: "research";
  eyebrow: string;
  title: string;
  body: string;
  papers: ReadonlyArray<{ venue: string; year: string }>;
};

export type AudienceSlide = {
  kind: "audience";
  eyebrow: string;
  title: string;
  sides: readonly [
    { label: string; headline: string; body: string },
    { label: string; headline: string; body: string },
  ];
};

export type ExampleSlide = {
  kind: "example";
  eyebrow: string;
  title: string;
  steps: ReadonlyArray<{
    role: "junior" | "ai" | "seniorify";
    label: string;
    content: string;
  }>;
};

export type MechanismSlide = {
  kind: "mechanism";
  eyebrow: string;
  title: string;
  body?: string;
  parts: ReadonlyArray<{
    label: string;
    headline: string;
    body: string;
    actor: string;
  }>;
};

export type StackSlide = {
  kind: "stack";
  eyebrow: string;
  title: string;
  body?: string;
  tools: ReadonlyArray<{ name: string; note: string }>;
};

export type CatchesSlide = {
  kind: "catches";
  eyebrow: string;
  title: string;
  catches: ReadonlyArray<{ label: string; body: string }>;
};

export type ClosingSlide = {
  kind: "closing";
  eyebrow: string;
  title: string;
  cta: string;
  href: string;
};

export type Slide =
  | TitleSlide
  | StatementSlide
  | QuoteSlide
  | PillarsSlide
  | ResearchSlide
  | AudienceSlide
  | ExampleSlide
  | MechanismSlide
  | StackSlide
  | CatchesSlide
  | ClosingSlide;

export const SLIDES: ReadonlyArray<Slide> = [
  {
    kind: "title",
    eyebrow: "seniorify.dev",
    title: "train the seniors of the future.",
    subtitle:
      "ai agents write the code. somebody still has to learn how to think.",
  },
  {
    kind: "statement",
    eyebrow: "the shift",
    title: "every junior has a senior in their pocket.",
    body: "and they are shipping faster than ever — without ever asking why.",
  },
  {
    kind: "statement",
    eyebrow: "the cost",
    title: "fluency is rising. judgment is not.",
    body: "the muscle that becomes a senior engineer is the one we are quietly atrophying.",
  },
  {
    kind: "quote",
    eyebrow: "research · 01",
    quote:
      "higher confidence in genai is associated with less critical thinking, while higher self-confidence is associated with more critical thinking.",
    attribution: "lee, sarkar, et al.",
    source: "the impact of generative ai on critical thinking — microsoft research / cmu, chi 2025",
    year: "2025",
  },
  {
    kind: "quote",
    eyebrow: "research · 02",
    quote:
      "llm users showed the weakest neural connectivity and consistently underperformed at the linguistic, behavioral, and neural levels.",
    attribution: "kosmyna et al.",
    source: "your brain on chatgpt — mit media lab",
    year: "2025",
  },
  {
    kind: "quote",
    eyebrow: "research · 03",
    quote:
      "frequent ai use was significantly associated with reduced critical thinking abilities, mediated by increased cognitive offloading.",
    attribution: "gerlich",
    source: "ai tools in society: impacts on cognitive offloading and the future of critical thinking — societies",
    year: "2025",
  },
  {
    kind: "research",
    eyebrow: "the evidence",
    title: "this isn't a hunch.",
    body: "across labs, journals, and conferences — the same finding keeps surfacing: heavy ai assistance correlates with cognitive offloading, weaker judgment, and shallower learning.",
    papers: [
      { venue: "microsoft research / cmu — chi", year: "2025" },
      { venue: "mit media lab", year: "2025" },
      { venue: "societies", year: "2025" },
      { venue: "github / mit (peng et al.)", year: "2023" },
      { venue: "chi (vaithilingam et al.)", year: "2022" },
      { venue: "iticse (prather et al.)", year: "2024" },
      { venue: "sigcse (becker et al.)", year: "2023" },
      { venue: "stack overflow developer survey", year: "2024" },
    ],
  },
  {
    kind: "statement",
    eyebrow: "the gap",
    title: "the senior was never just the typist.",
    body: "the senior was the one who paused, asked a harder question, named a tradeoff.",
  },
  {
    kind: "statement",
    eyebrow: "what we built",
    title: "seniorify is a senior in the loop.",
    body: "a managed plugin for ai coding agents — sitting between the junior and the merge button.",
  },
  {
    kind: "statement",
    eyebrow: "the objective",
    title: "the junior understands what's being shipped.",
    body: "not approves. understands. can defend the change in standup, in review, six months from now in a postmortem.",
  },
  {
    kind: "mechanism",
    eyebrow: "the mechanism",
    title: "three surfaces. one loop.",
    body: "a plugin where the junior works, an mcp server where the agent thinks, and a dashboard where the manager watches.",
    parts: [
      {
        label: "plugin",
        headline: "in the editor.",
        body: "a plugin sits in the junior's coding agent — codex, claude code, cursor — and surfaces the senior's questions before the merge.",
        actor: "for the junior",
      },
      {
        label: "mcp server",
        headline: "in the agent.",
        body: "the agent reads conventions, internal libraries, and prior audits over mcp — context the model would never have on its own.",
        actor: "for the ai",
      },
      {
        label: "dashboard",
        headline: "for the manager.",
        body: "every plan, every override, every recurring finding — observability over the team's ai-assisted work.",
        actor: "for the manager",
      },
    ],
  },
  {
    kind: "audience",
    eyebrow: "the customer",
    title: "one product. two people.",
    sides: [
      {
        label: "for the junior",
        headline: "they understand what they ship.",
        body: "the questions a senior would ask — surfaced while the work is still in flight. by the time the PR opens, the junior owns the answer.",
      },
      {
        label: "for the manager",
        headline: "signal, finally.",
        body: "every ai-assisted plan becomes a signed, dated, plain-english record. patterns surface. risk gets a name.",
      },
    ],
  },
  {
    kind: "example",
    eyebrow: "in practice",
    title: "your stack has rules. the ai doesn't know them.",
    steps: [
      {
        role: "junior",
        label: "junior",
        content: "add an endpoint that fetches the user's recent invoices.",
      },
      {
        role: "ai",
        label: "ai agent",
        content:
          'import axios from "axios";\nconst res = await axios.get(`/api/users/${id}/invoices`);',
      },
      {
        role: "seniorify",
        label: "seniorify",
        content:
          "this team uses `@acme/internal-http`. it adds tracing, retries, and the auth header. invoices live behind `/v2/billing/invoices`. see `packages/http/README.md` and `docs/billing.md`.",
      },
    ],
  },
  {
    kind: "catches",
    eyebrow: "what it catches",
    title: "the things a junior wouldn't know to flag.",
    catches: [
      {
        label: "non-backward-compatible migrations",
        body: "a migration that drops a column on a table the api still reads. seniorify reads your schema diff against the deploy plan, and asks: who's reading this in prod?",
      },
      {
        label: "internal-only libraries",
        body: "the agent reaches for `axios`. your team uses `@acme/internal-http` because it carries tracing, retries, and the auth header.",
      },
      {
        label: "silent fallbacks hiding errors",
        body: "a try/catch that swallows a 500 and returns `[]`. seniorify flags the swallowed error and asks for a real handling path.",
      },
      {
        label: "secrets in source",
        body: "a key inlined into a config to make a test pass. caught before the commit, surfaced in the audit.",
      },
      {
        label: "breaking public api shape",
        body: "renaming or removing a field on a response that mobile clients are pinned to. seniorify asks for a version, a deprecation, or a migration.",
      },
      {
        label: "skipping an internal middleware",
        body: "a new route that bypasses the team's auth or rate-limit layer because the agent didn't know it existed.",
      },
    ],
  },
  {
    kind: "stack",
    eyebrow: "built on vercel",
    title: "the stack.",
    body: "every piece runs on vercel — from the agent loop to the manager dashboard.",
    tools: [
      { name: "next.js 16", note: "app router, server components, the dashboard." },
      { name: "vercel functions", note: "the api routes — audits, conventions, mcp." },
      { name: "fluid compute · after()", note: "audits run as deferred work; the mcp response stays fast." },
      { name: "routing middleware", note: "host-based routing — the deck subdomain lives here." },
      { name: "vercel ai gateway", note: "model routing, key rotation, spend control." },
      { name: "ai sdk", note: "structured agent output via generateObject." },
      { name: "neon (marketplace)", note: "postgres for plans, audits, conventions." },
      { name: "vercel oidc", note: "service-to-service auth without long-lived keys." },
      { name: "vercel cli", note: "every deploy of this very deck." },
      { name: "vercel domains", note: "seniorify.dev + deck.seniorify.dev." },
    ],
  },
  {
    kind: "statement",
    eyebrow: "the bet",
    title: "the next decade of software has a staffing problem.",
    body: "we still need people who can think. let's not wait ten years to find out we forgot to train them.",
  },
  {
    kind: "closing",
    eyebrow: "seniorify.dev",
    title: "train the seniors of the future.",
    cta: "see the live demo",
    href: "https://seniorify.dev/work",
  },
];
