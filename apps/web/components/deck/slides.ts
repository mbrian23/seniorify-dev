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

export type HorizonSlide = {
  kind: "horizon";
  eyebrow: string;
  title: string;
  body?: string;
  contexts: ReadonlyArray<{ label: string; headline: string; body: string }>;
};

export type ContactSlide = {
  kind: "contact";
  eyebrow: string;
  title: string;
  body?: string;
  handleLabel: string;
  handle: string;
  href: string;
  qrSrc: string;
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
  | ClosingSlide
  | HorizonSlide
  | ContactSlide;

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
    eyebrow: "the cost",
    title: "fluency is rising. judgment is not.",
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
  },
  {
    kind: "statement",
    eyebrow: "what we built",
    title: "seniorify is a senior in the loop.",
  },
  {
    kind: "statement",
    eyebrow: "the mechanism",
    title: "plugin. mcp. dashboard.",
  },
  {
    kind: "horizon",
    eyebrow: "the horizon",
    title: "the next classroom runs the same loop.",
    body: "what works for a junior in a real codebase works for a student in a coursework repo — the senior they don't have, on demand.",
    contexts: [
      {
        label: "universities",
        headline: "cs programs, with a senior in every repo.",
        body: "students push code; seniorify surfaces the libraries, the tradeoffs, the why. instructors see how each student reasoned — not just what they shipped.",
      },
      {
        label: "bootcamps",
        headline: "the missing senior in cohort learning.",
        body: "every assignment becomes a conversation about choices, not a screenshot of working code. the loop scales where mentors can't.",
      },
      {
        label: "onboarding",
        headline: "ramp onto a stack the way a senior would teach it.",
        body: "new hires meet the conventions, the internal libraries, and the team's hard-won tradeoffs in their first week — in flight, not in a wiki.",
      },
    ],
  },
  {
    kind: "statement",
    eyebrow: "the bet",
    title: "the next decade has a staffing problem.",
  },
  {
    kind: "contact",
    eyebrow: "let's talk",
    title: "find me on linkedin.",
    body: "scan the code, or follow the link. happy to talk seniors, juniors, or anything in between.",
    handleLabel: "linkedin",
    handle: "in/martinbrianmdbn",
    href: "https://www.linkedin.com/in/martinbrianmdbn/",
    qrSrc: "/linkedin-qr.svg",
  },
  {
    kind: "closing",
    eyebrow: "seniorify.dev",
    title: "train the seniors of the future.",
    cta: "see it run",
    href: "https://seniorify.dev/work",
  },
];
