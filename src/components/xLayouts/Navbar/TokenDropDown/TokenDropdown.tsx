import Image from "next/image";
import { SyntheticEvent, useEffect, useMemo, useState } from "react";

// importing context
import { useGlobalDataContext } from "@/contexts/GlobalDataContext";

// importing ui
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// importing custom components
import UseScreenSize from "@/components/UseScreenSize/UseScreenSize";
import { getTokenDetailsHref } from "@/lib/url";

// importing types
import { tokenListResponse, trendingTokenResponse } from "@/types/token";

// importing for translation
import { useTranslation } from "@/components/translation/TranslationsProvider";

// importing icons
import componentIDs from "@/constants/componentIDs";
import getTokenLogo from "@/utils/getTokenLogo";
import { AiOutlineClose, AiOutlineSketch } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";

// Debounce function to limit the rate at which a function can fire
const debounce = (func: any, wait = 500) => {
  let timerId: any;
  return (...args: any[]) => {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

const TokenDropdown = () => {
  const { t } = useTranslation();
  const globalData = useGlobalDataContext();

  const wholeTokenList: tokenListResponse[] = globalData.tokenList || [];

  const trendingTokenList: trendingTokenResponse[] = useMemo(
    () => globalData.trendingTokens || [],
    [globalData.trendingTokens],
  );

  const tokenList = wholeTokenList || [];
  const [searchedTokens, setSearchedTokens] = useState<
    tokenListResponse[] | trendingTokenResponse[]
  >(trendingTokenList || []);

  const [tokenModalOpen, setTokenModalOpen] = useState(false);

  const [searchTokenText, setSearchTokenText] = useState("");

  const isBelow350px = UseScreenSize({ screenSize: 350 });

  useEffect(() => {
    setSearchedTokens(trendingTokenList);
  }, [trendingTokenList]);

  function normalizeString(str: string) {
    return str.replace(/[\s\-]/g, "").toLowerCase();
  }

  function searchToken(e: any) {
    const searchValue = escapeRegexCharacters(e.target.value.trim());
    setSearchTokenText(searchValue);

    if (searchValue === "") {
      setSearchedTokens(trendingTokenList);
    } else {
      const normalizedSearchValue = normalizeString(searchValue);
      const regex = new RegExp(normalizedSearchValue, "i");
      
      const searchedTokenList =
         tokenList?.filter((token: any) => {
           const normalizedTokenName = normalizeString(token.NAME);
           const normalizedTokenSymbol = normalizeString(token.SYMBOL);
           return (
             regex.test(normalizedTokenName) || regex.test(normalizedTokenSymbol)
           );
         }) || [];

      const sortedTokenList = searchedTokenList.sort(
        (a: tokenListResponse, b: tokenListResponse) => {
          if (a.MARKET_CAP_RANK === null && b.MARKET_CAP_RANK !== null) {
            return 1;
          } else if (a.MARKET_CAP_RANK !== null && b.MARKET_CAP_RANK === null) {
            return -1;
          } else if (a.MARKET_CAP_RANK === null && b.MARKET_CAP_RANK === null) {
            return 0;
          }

          // Normal sorting if both have a MARKET_CAP_RANK
          return a.MARKET_CAP_RANK - b.MARKET_CAP_RANK;
        },
      );

      setSearchedTokens(sortedTokenList.slice(0, 10));
    }
  }

  // Regex handling to escape special characters in search input
  function escapeRegexCharacters(str: string) {
    return str.replace(/[*+?^${}()|[\]\\]/g, "\\$&");
  }

  return (
    <Dialog open={tokenModalOpen}>
      <DialogTrigger asChild onClick={() => setTokenModalOpen(true)}>
        <Button
          className={`${
            isBelow350px ? "w-[90%]" : "w-[45px]"
          } focused-input ml-3 mr-1 flex h-[32px] items-center justify-center border border-[#E6E9EF] bg-[#fff] px-0 dark:border-[#414249] dark:bg-[#1a1a20] sm:mx-0 sm:w-[180px] sm:justify-start sm:px-2 md:w-[200px] lg:w-[17vw] xsl:h-[42px]`}
          aria-label="open-icon"
          data-testid="open-icon"
          id={componentIDs.header.tokenDropdownButton}
        >
          <CiSearch className="h-[17px] w-[17px] sm:mr-2 xsl:h-[20px] xsl:w-[20px]" />
          <span
            className={`${
              isBelow350px ? "inline-block" : "hidden sm:inline-block"
            } truncate text-[14px] font-[400] text-[#71717A] dark:font-[300] dark:text-[#A1A1AA]`}
          >
            {t("navbar:homeHeaderSearchToken")}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="mx-auto max-h-[50vh] w-[95%] overflow-y-scroll rounded-[4px] p-0 outline-none sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="sticky top-[-1px] flex h-[45px] items-center justify-between border-b border-[#E6E9EF] bg-[#fff] px-2 dark:border-[#414249] dark:bg-[#1a1a20]">
            <span className="flex items-center">
              <CiSearch className="mr-2 h-[20px] w-[20px] text-[#71717A] dark:text-[#A1A1AA]" />
              <Input
                className="h-[40px] w-[200px] border-0 bg-[#fff] px-0 text-[14px] font-[400] outline-none dark:bg-[#1a1a20] dark:font-[300]"
                placeholder={t("navbar:homeHeaderSearchToken")}
                onChange={debounce((v: any) => searchToken(v), 500)}
                id={componentIDs.header.tokenDropdownSearchInput}
              />
            </span>
            <button
              onClick={() => {
                setTokenModalOpen(false);
                setSearchTokenText("");
                setSearchedTokens(trendingTokenList || []);
              }}
              aria-label="close-icon"
              data-testid="close-icon"
              id={componentIDs.header.tokenDropdownCloseIcon}
            >
              <AiOutlineClose className="my-3 mr-[4px] cursor-pointer text-base font-[400] dark:font-[300]" />
            </button>
          </DialogTitle>
          <DialogDescription className="" asChild>
            <div>
              {searchTokenText.trim() === "" && (
                <div className="flex min-h-[32px] items-center pl-1">
                  <div className="flex items-center">
                    <span className="ml-2 mr-1 text-[12px] font-normal text-[#121212] dark:font-[300] dark:text-[#fff]">
                      {t("navbar:homeHeaderTrendingSearch")}
                    </span>
                    <AiOutlineSketch className="text-[14px]" />
                  </div>
                </div>
              )}
              {searchedTokens?.map((token, index) => (
                <a
                  href={getTokenDetailsHref(token)}
                  className="flex h-[35px] cursor-pointer items-center pl-3 hover:bg-[#ffcf30] dark:hover:text-[#000]"
                  key={`${token.CG_ID} - ${index}`}
                  onClick={() => setTokenModalOpen(false)}
                >
                  <div className="w-[20px]">
                    <Image
                      src={getTokenLogo(token)}
                      alt="Token Icon"
                      className="mt-[-3px] inline-block"
                      height={18}
                      width={18}
                      onError={(e: SyntheticEvent<HTMLImageElement>) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                  <span className="whitespace-no-wrap ml-2 overflow-hidden truncate overflow-ellipsis text-sm">
                    {token.NAME} ({token.SYMBOL})
                  </span>
                </a>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default TokenDropdown;
