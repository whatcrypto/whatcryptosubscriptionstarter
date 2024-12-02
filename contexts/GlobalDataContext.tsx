"use client";

import useUser from "@/components/useUser";
import { createContext, useContext, useMemo, useState } from "react";

type GlobalDataProviderValue = {
  user?: any;
  price: any;
  marketDetails?: any;
  trendingTokens?: any;
  tokenList?: any;
};

const GlobalDataContext = createContext<
  GlobalDataProviderValue & { setUser: (user: any) => void }
>(null as any);

export type GlobalDataProviderProps = React.PropsWithChildren &
  GlobalDataProviderValue & {
    //
  };
const GlobalDataProvider = ({ children, ...data }: GlobalDataProviderProps) => {
  const { user: currentUser } = data;
  const [user, setUser] = useState(currentUser);

  return (
    <GlobalDataContext.Provider value={{ ...data, user, setUser }}>
      {children}
    </GlobalDataContext.Provider>
  );
};

export default GlobalDataProvider;

export const useGlobalDataContext = () => useContext(GlobalDataContext) || {};
