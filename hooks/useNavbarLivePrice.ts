import { useGlobalDataContext } from "@/contexts/GlobalDataContext";
import { BTC_ETH_PRICE } from "@/types/coingecko";
import { useEffect, useState } from "react";
import useTokenPrice from "./useTokenPrice";

const ALLOWED_TOKENS = ["bitcoin", "ethereum"];

const useNavbarLivePrice = () => {
  const globalData = useGlobalDataContext();
  const btc_eth_price: BTC_ETH_PRICE = globalData.price || {
    bitcoin: { usd: 0 },
    ethereum: { usd: 0 },
  };
  const btcETHPrice = btc_eth_price || {
    bitcoin: { usd: 0 },
    ethereum: { usd: 0 },
  };
  const [btcEthLivePrice, setBtcEthLivePrice] =
    useState<BTC_ETH_PRICE>(btcETHPrice);

  const { getTokenPrice, data } = useTokenPrice();

  useEffect(() => {
    getTokenPrice(ALLOWED_TOKENS, true);
  }, [getTokenPrice]);

  useEffect(() => {
    if (data && ALLOWED_TOKENS.includes(data.cgid)) {
      setBtcEthLivePrice((oldBtcEthPrice) => ({
        ...oldBtcEthPrice,
        [data.cgid]: {
          usd: data.price,
        },
      }));
    }
  }, [data]);

  return {
    btc: btcEthLivePrice.bitcoin.usd,
    eth: btcEthLivePrice.ethereum.usd,
  };
};

export default useNavbarLivePrice;
