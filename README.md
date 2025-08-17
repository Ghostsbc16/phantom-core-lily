# Lily Chat — Phantom Core
Full-stack web chat for Lily with a playful UI and pluggable backend provider.

## Quick Start
1) Unzip the project.
2) In the folder, run:
   ```bash
   npm install
   cp .env.example .env   # then edit .env
   npm run dev            # or: npm start
   ```
3) Open http://localhost:3000

## Configure Lily
- **Mock (default):** works out of the box, echoes back what you say.
- **OpenAI-compatible:** set `LILY_PROVIDER=openai`, `OPENAI_API_KEY=...`, `OPENAI_MODEL=gpt-4o-mini` in `.env`.
- **Webhook (your own model):** set `LILY_PROVIDER=webhook`, `LILY_API_URL=https://...`, optional `LILY_API_KEY=...`.
  Your endpoint should accept `{ messages: [{role, content}, ...] }` and return `{ reply: "..." }` or an OpenAI-style response.

## Files
- `server.js` — Express server, serves UI and handles `/api/chat`.
- `server/lilyClient.js` — Provider adapter (openai/webhook/mock).
- `public/index.html` — UI with Tailwind.
- `public/app.js` — Chat logic, animations, Easter eggs.
- `.env.example` — Copy to `.env` and configure.
