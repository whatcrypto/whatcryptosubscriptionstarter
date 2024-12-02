import tokenLogo from "@/lib/tokenLogo";
import { tokenListResponse, trendingTokenResponse } from "@/types/token";

const getTokenLogo = (token: tokenListResponse | trendingTokenResponse) => {
  let imageLogo = tokenLogo(token?.CG_ID);

  if (token?.IMAGES?.thumb && token?.IMAGES?.thumb !== "missing_thumb.png") {
    imageLogo = token?.IMAGES?.thumb;
  }

  return imageLogo;
};

export default getTokenLogo;
