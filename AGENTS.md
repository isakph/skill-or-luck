# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# Project: Skill and Luck Simulation

Interactive simulation of Robert Frank's *Success and Luck* model.
Next.js app with TypeScript, Tailwind, Recharts.

## Architecture

- See `plan.md` for the full project plan and build phases
- Simulation logic: `src/lib/simulation.ts` (pure functions, no React imports)
- Charts: Recharts only
- State: plain useState — no Redux, Zustand, or similar
- Styling: Tailwind only — no CSS modules or styled-components

## Conventions

- App Router (no Pages Router)
- Keep components small; extract hooks when state logic gets complex
- No tests yet — don't create test files unless asked