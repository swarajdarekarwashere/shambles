# COMPONENT_HIERARCHY.md: Component Map & Responsibilities

## Top-Level
- `App.tsx`: Root component, sets up providers and routes.
- `ScreenRouter.tsx`: Handles navigation between main screens.

## Main Screens
- `Landing.tsx`: Landing page UI.
- `GameDiscovery.tsx`: Game selection.
- `PlayerSetup.tsx`: Player configuration.
- `Profile.tsx`: User profile.
- `Scoreboard.tsx`: Game scores.
- `WinnerScreen.tsx`: End-of-game summary.

## Modals
- `AuthModal.tsx`: Authentication.
- `PaywallModal.tsx`: Monetization/paywall.
- `GameRulesModal.tsx`: Game rules.

## Games
- Each game in `components/games/` is a self-contained feature.

## UI Primitives
- All components in `components/ui/` are shared and composable.

## Hooks
- `use-mobile.tsx`: Detects mobile devices.
- `use-toast.ts`: Toast notification logic.

## Responsibility & Usage
- Each complex component is responsible for a single feature or UI section.
- Hooks are used for cross-cutting concerns (device, notifications).
- All components are functional and typed.
