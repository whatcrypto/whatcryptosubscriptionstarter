import { useCallback, useEffect, useRef, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

const cachedValue = new Map<string, Token>();

export type Token = {
  eventtimestamp: string;
  price: number;
  epoch: number;
  sequence: number;
  exchangerank: number;
  arrivaltimestamp: string;
  exchange: string;
  instrument: string;
  volume: number;
  isbid: boolean;
  cgid: string;
  tokenid: number;
  tokenname: string;
  percentagechange: number;
};

// we don't want to override these tokens
const ALWAYS_ON_TOKENS = ["bitcoin", "ethereum"];

export type UseTokenPrice = {
  getTokenPrice: (tokensCgi: Array<string>, append?: boolean) => void;
  state: ReadyState;
  data?: Token;
  lastJsonMessage?: Token;
};

const useTokenPrice = (tokenCgId?: string | false): UseTokenPrice => {
  const oldToken = useRef("");
  const [value, setValue] = useState<Token | undefined>(
    tokenCgId ? cachedValue.get(tokenCgId) : undefined,
  );
  const socketUrl = process.env.NEXT_PUBLIC_PRICE_URL!;
  const apiKey = process.env.NEXT_PUBLIC_PRICE_API_KEY!;
  // filter is used to determine if new message should trigger rendering in the implementing Component
  // false should be passed for useTokenPrice in parent class to prevent the parent from rerendering
  const filter = useCallback(
    (message: MessageEvent<string>) => {
      if (tokenCgId === false) {
        return false;
      } else if (typeof tokenCgId === "string") {
        const data = JSON.parse(message.data) as Token;
        return tokenCgId === data.cgid;
      }
      return true;
    },
    [tokenCgId],
  );

  const { sendJsonMessage, readyState, lastJsonMessage } = useWebSocket<Token>(
    socketUrl,
    {
      share: true,
      filter,
      queryParams: {
        "x-api-key": apiKey,
      },
      // sh: false,
      reconnectAttempts: 10,
      //attemptNumber will be 0 the first time it attempts to reconnect, so this equation results in a reconnect pattern of 1 second, 2 seconds, 4 seconds, 8 seconds, and then caps at 10 seconds until the maximum number of attempts is reached
      reconnectInterval: (attemptNumber) =>
        Math.min(Math.pow(2, attemptNumber) * 1000, 10000),
    },
  );

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      setValue(lastJsonMessage);
      if (lastJsonMessage?.cgid === tokenCgId) {
        cachedValue.set(tokenCgId, lastJsonMessage);
      }
    }
  }, [lastJsonMessage, tokenCgId, readyState]);

  const getTokenPrice = useCallback(
    (tokensCgi: Array<string> = [], append = false) => {
      const newTokens = tokensCgi.join(",");
      // make values uniq
      const uniqueToken = new Set([...tokensCgi, ...ALWAYS_ON_TOKENS]);
      // skip sending message if previous sent token is same as new
      if (newTokens !== oldToken.current) {
        sendJsonMessage({
          tokens: Array.from(uniqueToken),
          is_append: append ? 1 : 0,
        });
      }
      oldToken.current = newTokens;
    },
    [sendJsonMessage],
  );

  return {
    getTokenPrice,
    state: readyState,
    data: value,
    lastJsonMessage,
  } as UseTokenPrice;
};

export default useTokenPrice;
