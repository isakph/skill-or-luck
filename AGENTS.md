<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
<!-- BEGIN:project-specific-agent-rules -->
# Project: Skill and Luck Simulation

See @plan.md for the full project plan and build phases.

- Simulation logic lives in `src/lib/simulation.ts`, kept pure (no React imports)
- Use Recharts for all charts
- Use plain useState for state management — no Redux, Zustand, or similar
- Tailwind for all styling — no CSS modules or styled-components
<!-- END:project-specific-agent-rules -->