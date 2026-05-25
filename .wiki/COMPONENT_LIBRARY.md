# COMPONENT_LIBRARY.md: Shared Components

## UI Primitives (`src/components/ui/`)
- **Button**: Standard button, customizable via props.
- **Dialog/Modal**: For overlays and modals (e.g., `alert-dialog.tsx`, `dialog.tsx`).
- **Form**: Form controls and validation.
- **Input, Select, Checkbox, RadioGroup, Switch, Slider, Tabs, Table, Toast, Tooltip, etc.**: Standardized, accessible UI elements.

## Feature Components (`src/components/`)
- **AuthModal**: Handles authentication flows.
- **PaywallModal**: Manages paywall and monetization logic.
- **GameDiscovery**: Game selection and discovery UI.
- **GameRulesModal**: Shows rules for games.
- **PlayerSetup**: Player configuration before game start.
- **Profile**: User profile display and editing.
- **Scoreboard**: Displays game scores.
- **ScreenRouter**: Handles screen navigation.
- **WinnerScreen**: End-of-game summary.

## Game Components (`src/components/games/`)
- **DrunkInLove, IntimacyCards, LetsGetWasted, ScratchCards, ShotsAndLadders, SpicyStarters, SpinTheWheel, ComingSoon**: Each implements a specific game UI/logic.

## Prop Interfaces
- All components use TypeScript interfaces for props (see source files for details).
- UI primitives are designed for composability and accessibility.
