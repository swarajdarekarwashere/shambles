// Compliance review switches.
// Revert these after payment-gateway review to restore the full product catalog.
export const COMPLIANCE_REVIEW_MODE = true;

// Review-only filter: keeps higher-risk game surfaces out of the public catalog.
export const REVIEW_HIDDEN_GAME_IDS = ["drunk-in-love", "lets-get-wasted"] as const;

export function isReviewHiddenGame(gameId: string) {
  return REVIEW_HIDDEN_GAME_IDS.includes(gameId as (typeof REVIEW_HIDDEN_GAME_IDS)[number]);
}
