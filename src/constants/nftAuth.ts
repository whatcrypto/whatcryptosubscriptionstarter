export const DEFAULT_NFT_PASSWORD = "nftuserpassword1234@";
export const SIGN_MESSAGE =
  "Sign this message to verify your ownership of this address.";

// we treat staging as production
export const IS_PRODUCTION = ["production", "staging"].includes(
  process.env.NEXT_PUBLIC_TM_ENV || "local",
);
// we need this to disable some features on staging specifically
export const IS_STAGING = process.env.NEXT_PUBLIC_TM_ENV === "staging";
