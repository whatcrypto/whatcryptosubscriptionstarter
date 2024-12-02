import { tokenListResponse } from "@/types/token";

export const getTokenDetailsHref = (
  token:
    | Pick<tokenListResponse, "CG_ID" | "TOKEN_ID">
    | { data: Pick<tokenListResponse, "CG_ID" | "TOKEN_ID"> },
): string => {
  if (!token) {
    throw new Error("Token is undefined");
  }

  let cgId;

  if ("CG_ID" in token) {
    cgId = token.CG_ID;
  } else if ("data" in token && token.data.CG_ID) {
    cgId = token.data.CG_ID;
  }

  if (!cgId) {
    throw new Error("CG_ID is undefined");
  }

  if (cgId.length === 2) {
    return `/en/${cgId}`;
  }

  return `/${cgId}`;
};
