# STATE_FLOW.md: Data Flow & Caching

## Data Fetching
- Backend integration via Supabase (`src/lib/supabase.ts`).
- API calls and auth handled in feature components and hooks.
- Edge/serverless functions for payment (Razorpay) in `supabase/functions/`.

## State Propagation
- Main state managed by React Context (`src/state/GameContext.tsx`).
- Props drilling for component-specific state.
- Toasts and notifications via custom hook (`use-toast.ts`).

## Caching Strategies
- No evidence of advanced caching (e.g., TanStack Query, SWR).
- Supabase client may cache some auth/session state internally.
- State is ephemeral; persisted only as needed via Supabase.

## Data Flow Example
1. User action triggers API call (e.g., login, game start).
2. Response updates context or local state.
3. UI components reactively update via props/context.
