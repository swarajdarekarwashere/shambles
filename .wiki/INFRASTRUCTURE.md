# INFRASTRUCTURE.md: Project Infrastructure

## Build Process
- Vite (`vite.config.ts`) is the primary build tool.
- TypeScript for static typing.
- PostCSS and Tailwind CSS for styling pipeline.
- ESLint for linting (`eslint.config.js`).

## Environment Variables
- `.env` file at project root.
- Used for API keys, Supabase config, and other secrets.
- Example structure:
  ```env
  VITE_SUPABASE_URL=...
  VITE_SUPABASE_ANON_KEY=...
  # Add other VITE_ prefixed variables as needed
  ```

## Deployment Targets
- Likely targets: Vercel (see `vercel.json`), Cloudflare Pages possible.
- Static assets in `public/`.
- Edge/serverless functions in `supabase/functions/` (e.g., Razorpay integration).

## Global Configurations
- `vercel.json` for Vercel deployment settings.
- Tailwind and PostCSS configs for styling.
- TypeScript configs for build and IDE support.
