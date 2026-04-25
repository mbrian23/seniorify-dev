# Zero to Agent: Montevideo 2026

Vercel hackathon focused on building AI agents.

## Logistics

- **WiFi:** Cubo / `cubolatam`
- **Resources hub:** https://vercel.notion.site/02agentresources
- **Vercel credits:** via on-site QR code

## Judging Criteria

| Criterion | Points |
|---|---|
| Problema y Oportunidad (Problem & Opportunity) | 15 |
| Calidad de la solución (Solution Quality) | 20 |
| Implementación técnica (Technical Implementation) | 20 |
| Demo funcional (Working Demo) | 15 |
| UX / Experiencia de usuario | 15 |
| Innovación | 10 |
| Potencial futuro (Future Potential) | 10 |
| Presentación | 5 |

Highest weights: **technical implementation** and **solution quality** (20 each), followed by problem/opportunity, demo, and UX (15 each). Innovation and future potential reward business-plan thinking.

## Submission (Entrega)

- Submit demo via on-site QR and **deploy your project on Vercel** before **19:30**.
- Jury evaluates **asynchronously**.
- Live presentation at **19:45** — **3 minutes per team**.

## What this implies for our build

- Must ship a working, deployed Vercel demo (not slides).
- The 3-minute pitch carries the business plan; the deployed app carries technical/UX scores.
- Technical depth matters as much as the problem story — pick a track where we can show real agent capability, not a thin GPT wrapper.

## Tracks

See `tracks.md` for full details.

1. **Vercel Workflow (WDK)** — durable, long-running agents (`"use workflow"`, `DurableAgent`). Pause for minutes-to-months, survive crashes/deploys.
2. **v0 + MCPs** — build with v0, connect ≥1 MCP server (Vercel/GitHub/custom).
3. **ChatSDK Agents** — one codebase, deploys to Slack/Discord/Teams/GitHub via swappable adapters.
