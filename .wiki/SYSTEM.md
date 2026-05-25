# SYSTEM.md: Frontend Contract & Conventions

## Vite Configuration
- Uses `vite.config.ts` for build and dev server.
- TypeScript support via `tsconfig.json` and `tsconfig.app.json`.
- PostCSS and Tailwind CSS for styling (`postcss.config.js`, `tailwind.config.ts`).

## TypeScript Standards
- Strict typing enforced.
- Use of interfaces/types for props and state.
- Prefer functional components and hooks.

## State Management
- Main state via React Context (`src/state/GameContext.tsx`).
- No evidence of Zustand or TanStack Query; context and props are primary.

## Styling Approach
- Tailwind CSS utility classes.
- Custom CSS in `App.css` and `index.css`.

## Self-Maintenance Rule
**Whenever a component, hook, build setting, or state pattern changes, this wiki must be updated to reflect the new architecture. This is mandatory for all contributors and AI agents.**