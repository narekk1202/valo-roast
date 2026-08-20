# ValoRoast

Enter a Riot ID. Get roasted for how you actually play Valorant.

Looks up competitive matches, scores the account, then streams a salty all-chat roast. Unofficial fan project — not affiliated with Riot Games. Roasts are jokes, not facts.

## How it works

1. Submit `Name#TAG`.
2. HenrikDev returns the account and recent competitive matches.
3. Those matches become stats (record, K/D, ACS, HS%, openings, AFK, friendly fire, main agent, worst map) and a set of 0–100 scores, including ego.
4. Groq streams a roast from those numbers.
5. Copy a share link at `/roast/{name}/{tag}`.

Lookups are rate-limited (20 per IP / 10 min). Roasts are rate-limited (5 per IP / 10 min). Player data is cached for 10 minutes; finished roasts for 24 hours.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4 + shadcn/ui
- [HenrikDev](https://docs.henrikdev.xyz/) for Valorant data
- [Groq](https://console.groq.com/) (`openai/gpt-oss-20b`) for the roast
- Vitest for tests

## Setup

Requires [pnpm](https://pnpm.io/).

```bash
pnpm install
cp .env.example .env
```

Fill in `.env`:

| Variable | What |
| --- | --- |
| `RIOT_API_URL` | HenrikDev API base URL (e.g. `https://api.henrikdev.xyz`) |
| `RIOT_API_KEY` | HenrikDev API key |
| `GROQ_API_KEY` | Groq API key |

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | What |
| --- | --- |
| `pnpm dev` | Dev server |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint |
| `pnpm test` | Vitest |

Match data via HenrikDev. Not affiliated with Riot Games.
