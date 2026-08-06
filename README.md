# API Interface Console

A React dashboard showcasing 9 different APIs — live data tiles (weather, quotes,
trivia, products, football scores) alongside auth-gated demo interfaces (TMDB,
Spotify, Gemini AI chat, The Guardian).

## Setup

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
api-showcase/
├── index.html          # Vite entry HTML
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx         # Mounts the React app
    └── ApiShowcase.jsx  # The full dashboard component
```

## Notes

- Live cards (Open-Meteo, Quotable, DummyJSON, TheSportsDB, Open Trivia DB) call
  their public APIs directly from the browser — no backend or API key needed.
- The Gemini AI chat is a local canned-response demo (no model key wired in).
- Spotify's play button plays a demo tone via the Web Audio API, since streaming
  real Spotify audio requires OAuth.
