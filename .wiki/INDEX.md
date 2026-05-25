# LLM Wiki: Project Index

## Pages
- `src/pages/Index.tsx`: Main landing page.
- `src/pages/LegalPage.tsx`: Legal and compliance information.
- `src/pages/NotFound.tsx`: 404 handler.

## Components
- `src/components/`: Core UI and feature components (see COMPONENT_LIBRARY.md for details).
- `src/components/games/`: Game-specific components.
- `src/components/ui/`: Shared UI primitives (buttons, dialogs, etc.).

## Hooks
- `src/hooks/use-mobile.tsx`: Mobile device detection.
- `src/hooks/use-toast.ts`: Toast notification logic.

## Services
- `src/lib/supabase.ts`: Supabase client and backend integration.
- `supabase/functions/create-razorpay-order/index.ts`: Server-side Razorpay order creation and pricing control.
- `supabase/functions/razorpay-webhook/index.ts`: Payment confirmation webhook and pass activation.

## Utilities
- `src/lib/utils.ts`: General utility functions.
- `src/lib/gameTypes.ts`: Game type definitions.
- `src/lib/drunkInLoveTiles.ts`: Game tile data.

## State Management
- `src/state/GameContext.tsx`: React context for game state.

## Tests
- `src/test/`: Example and security tests.

## Legal And Compliance
- `src/content/legalContent.tsx`: Source of truth for legal copy and policy content shown in-app.
- Payment security note: Razorpay secret keys must remain only in Supabase Edge Function secrets. The public checkout key may appear client-side because Razorpay Checkout requires it.
- Minor safety note: The app now includes dedicated Age-Gating and Zero-Tolerance Minor Protection policies aligned to adult local multiplayer use on a shared device.

---
See SYSTEM.md for architecture and conventions.
