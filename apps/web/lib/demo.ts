/**
 * Demo mode = no paid AI keys configured. When true, LLM-calling endpoints
 * short-circuit with a friendly "this is a public showcase" response and the
 * UI displays the demo banner. The mock plans seeded by `lib/seed.ts` remain
 * fully browsable.
 */
export function isDemoMode(): boolean {
  return (
    !process.env.AI_GATEWAY_API_KEY &&
    !process.env.OPENAI_API_KEY &&
    !process.env.ANTHROPIC_API_KEY
  );
}

export const DEMO_NOTICE =
  "Demo mode — AI calls are disabled on this public site. The audits and findings shown are mock examples seeded for the showcase.";
