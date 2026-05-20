# Turn on - Project Overview

Turn on is a vibrant, interactive web application featuring a collection of party and couple games. It's built with a modern tech stack focused on high-quality animations, responsiveness, and a "playful" aesthetic.

## Tech Stack

- **Framework:** React (Vite-based)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn UI
- **Animations:** Framer Motion (for screen transitions) + GSAP (for scroll-based discovery)
- **State Management:** React Context (native)
- **Routing:** Custom `ScreenRouter` for internal app flow, `react-router-dom` for top-level entry.
- **Data Fetching:** TanStack Query (React Query)
- **Testing:** Vitest + React Testing Library

## Project Structure

- `src/components`: Contains core UI components and game-specific modules.
  - `games/`: Individual game implementations (e.g., `DrunkInLove`, `SpinTheWheel`).
  - `ui/`: Shared UI components (mostly Shadcn).
  - `ScreenRouter.tsx`: Manages the internal navigation state of the app.
- `src/pages`: Top-level page components.
  - `Index.tsx`: Main entry point that sets up the `GameProvider` and `ScreenRouter`.
- `src/state`: State management logic.
  - `GameContext.tsx`: Holds the global game state, including current screen, players, and scores.
- `src/lib`: Utility functions, constants, and type definitions.
  - `gameTypes.ts`: Central source of truth for game modes, screens, and game metadata.
- `src/hooks`: Custom React hooks.
- `src/assets`: Static assets like images and fonts.

## Building and Running

- **Development:** `npm run dev` (runs on port 8080)
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Test:** `npm run test`
- **Preview Build:** `npm run preview`

## Development Conventions

### Component Architecture
- Use functional components with TypeScript.
- Prefer `src/components/ui` for primitive components.
- Keep game logic within the respective game component in `src/components/games`.

### State Management
- Global game state (players, current screen, scoring) is managed in `src/state/GameContext.tsx`.
- Use the `useGame()` hook to access and update game state.
- For local component state, use standard `useState` or `useReducer`.

### Navigation
- Internal application flow is handled by the `go(screen)` function from `useGame()`.
- Avoid direct `react-router-dom` navigation for internal game screens unless adding a new top-level page.

### Styling & Animations
- Use Tailwind CSS for all styling.
- Custom fonts (Pixel, Display, Script, etc.) are defined in `tailwind.config.ts`.
- Use Framer Motion for component-level animations and screen transitions.
- GSAP is used specifically in `GameDiscovery.tsx` for scroll-triggered effects.

### Testing
- Unit and integration tests are located in `src/test`.
- Use `vitest` for running tests.
