import { USER } from "@/types/user";
import React, { FC } from "react";
import ReactIntercom from "react-intercom";

interface IntercomProps {
    user?: USER
}
const Intercom: React.FC<IntercomProps> = function ({ user }) {
  const userData = user
    ? {
        email: user.user.email,
        name: `${user.name}`.trim(),
        user_hash: user.user_hash || null,
      }
    : null;
  return <ReactIntercom appID={process.env.NEXT_PUBLIC_INTERCOM_APP_ID || ""} {...userData} />;
};

export default Intercom;
