# Democrisis

A browser-based political decision game set in Central Europe, where players face a series of populist politicians and must choose how to respond to their anti-democratic pitches — all while keeping both democracy and their own popularity intact.

## Gameplay

Each round presents a politician with a populist pitch. You pick one of four responses. Every choice shifts two meters:

- **Democrisis meter** — how far democracy has eroded. Let it reach 100% and it's game over.
- **Popularity meter** — how well-liked you are. If *this* hits 100%, the crowd has embraced the populist tide — also game over.

Good democratic choices lower the Democrisis meter but may cost you popularity. Crowd-pleasing but authoritarian choices do the opposite. Survive all politicians with both meters in check to win and post your time to the leaderboard.

## Features

- **Two country packs** — Slovensko and Česko, each with their own cast of pixel-art politicians
- **Four languages** — SK, EN, CZ, HU, switchable at any time
- **Leaderboard** — fastest runs are saved locally and synced to a server
- **Mobile-friendly** — responsive layout, safe-area support, tap-optimised controls
- **PWA-ready** — ships with a web manifest and favicon for home screen installation

## Structure

The game is a single self-contained `index.html` file with no external dependencies beyond a Google Font loaded at runtime. All game data (politicians, pitches, options, reactions, scores, copy strings) lives in inline JavaScript.

```
index.html          — everything: styles, markup, game logic, all content
manifest.json       — PWA manifest
favicon.png         — 32×32 icon
fonts/
  PixelifySans-Regular.ttf
politicians/
  slovakistan.png   — background image
sk_politicians/     — portrait PNGs for Slovak politicians
cz_politicians/     — portrait PNGs for Czech politicians
```

## Politicians

### Slovensko
Characters cover a range of policy areas — media freedom, electoral integrity, cultural funding, energy, housing, the judiciary, rural development, and more. Each has a populist pitch that frames democratic oversight as a threat to stability.

### Česko
Eleven characters with pitches touching on public transport, flood management, family policy, economics, data privacy, civic participation, housing, institutional oversight, agriculture, and public media.

## Scoring

Each response option carries a score. Positive scores reduce the Democrisis meter; negative scores increase it (and may boost popularity). The balance between the two meters determines whether you survive to the next politician.

## Localization

All player-facing strings — politician pitches, response options, reactions, UI labels, summary messages — are available in SK, EN, CZ, and HU. The language can be switched mid-game from the dropdown in the top-left corner. The country pack is selected from the dropdown in the top-right.

## Running Locally

No build step required. Serve the folder with any static file server:

```bash
npx serve .
# or
python3 -m http.server
```

Then open `http://localhost:3000` (or whichever port) in your browser.

## Leaderboard API

The game posts scores to a configurable endpoint (`LEADERBOARD_API_URL` near the top of the script block). If the server is unreachable, scores fall back to `localStorage`. The API expects:

```
POST  { username: string, elapsedMs: number }
GET   → { entries: [{ username, time }] }
```

## License

Content and code are project-specific. Politician portraits and background art are original assets.
