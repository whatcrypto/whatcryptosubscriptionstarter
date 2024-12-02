// All events that are sent to PostHog are defined here

export const postHogEvents = {
  // User events
  SIGN_IN_FAILED: "signin_failed",
  SIGN_UP_FAILED: "signup_failed",
  SIGN_UP_SUCCESS: "signup_success",
  STARTED_FREE_TRIAL: "started_free_trial",
  PLAN_SELECTED: "plan_selected",
  PLAN_PURCHASE_SUCCESS: "plan_purchase_success",
  PLAN_PURCHASE_FAILED: "plan_purchase_failed",
  PLAN_CANCEL_SUCCESS: "plan_cancel_success",
  PLAN_CANCEL_FAILED: "plan_cancel_failed",
  PLAN_UPGRADE_SUCCESS: "plan_upgrade_success",
  PLAN_UPGRADE_FAILED: "plan_upgrade_failed",
} as const;
