/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import LogRocket from "logrocket";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React, { useEffect, useRef } from "react";

// importing context
import { useGlobalDataContext } from "@/contexts/GlobalDataContext";

// importing ui components
import { Button } from "@/components/ui/button";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import * as Tooltip from "@/components/ui/tooltip";

// importing components
import ImageWithFallback from "@/components/common/ImageWithFallback";
import LanguageSelector from "@/components/languageSelector";
import {
  getAnalyticsRoutes,
  getInitials,
  getRoutes,
  getSupportRoutes,
} from "@/components/layout/Navbar/Utils/navUtils";
import UseScreenSize from "@/components/UseScreenSize/UseScreenSize";
import useUser from "@/components/useUser";
import { getTokenDetailsHref } from "@/lib/url";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/utils/formatNumber";
import ResponsiveNavbar from "./ResponsiveNavbar/ResponsiveNavbar";
import ThemeSwitcher from "./ThemeSwitcher/ThemeSwitcher";
import TokenDropdown from "./TokenDropdown/TokenDropdown";

// importing types
import { MARKET_DETAILS } from "@/types/coingecko";
import { trendingTokenResponse } from "@/types/token";

// importing for translation
import { useTranslation } from "@/components/translation/TranslationsProvider";

// importing images
import { IS_PRODUCTION } from "@/constants/auth";
import componentIDs from "@/constants/componentIDs";
import { constants } from "@/constants/constants";
import useNavbarLivePrice from "@/hooks/useNavbarLivePrice";
import BitcoinIcon from "@/public/images/navbar/Bitcoin.svg";
import EthereumIcon from "@/public/images/navbar/Ethereum.svg";
import TMLogoDark from "@/public/images/navbar/TM Logo Dark.svg";
import TMLogoLight from "@/public/images/navbar/TM Logo Light.svg";
import getTokenLogo from "@/utils/getTokenLogo";
import NotificationFeed from "./NotificationFeed";

const NavigationRouter = ({
  routesVar,
  locale,
  currentPath,
  triggerClassName = "",
  nestedRouting = false,
  extraWidth = false,
}: {
  routesVar: any;
  locale: any;
  currentPath: any;
  triggerClassName?: string;
  nestedRouting?: boolean;
  extraWidth?: boolean;
}) => {
  return (
    <NavigationMenu className="h-[17px]">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              "text-[#71717A] data-[state=open]:text-[#000] dark:text-[#A1A1AA] dark:data-[state=open]:text-[#fff]",
              triggerClassName,
              nestedRouting && "flex justify-between",
            )}
            horizontal={extraWidth}
          >
            {routesVar.mainHeading}
          </NavigationMenuTrigger>
          <NavigationMenuContent
            className={cn("py-0", extraWidth ? `left-[110px] top-[-5px]` : "")}
            style={{
              minWidth: `${extraWidth ? routesVar.minWidth + "px" : "116px"}`,
            }}
          >
            <ul className="w-full pr-[5px]">
              {nestedRouting && (
                <li className="my-[14px] w-full">
                  <NavigationRouter
                    routesVar={routesVar.routesVar}
                    locale={locale}
                    currentPath={currentPath}
                    extraWidth={true}
                  />
                </li>
              )}
              {routesVar.route.map((route: any) => {
                const href = `/${locale}` + route.urlName;

                return (
                  <li
                    key={route.urlName}
                    className={cn(
                      "my-[14px]",
                      nestedRouting ? "pl-[3px]" : "pl-[0px]",
                    )}
                  >
                    <NavigationMenuLink asChild>
                      <Link
                        href={route.urlName}
                        target={route.newTab && "_blank"}
                        rel={route.newTab && "noopener noreferrer"}
                        passHref
                        className={`${
                          currentPath === href || currentPath === route.urlName
                            ? "text-[#09090B] dark:text-[#FFFFFF]"
                            : "text-[#71717A] dark:text-[#A1A1AA]"
                        } mx-[5px] flex`}
                      >
                        {route.tabName}
                      </Link>
                    </NavigationMenuLink>
                  </li>
                );
              })}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

interface NavbarProps {
  onHeightChange: (height: number) => void;
  className?: string;
}

// eslint-disable-next-line react/display-name
const Navbar = React.forwardRef<HTMLDivElement, NavbarProps>(
  ({ onHeightChange, className, ...props }, ref) => {
    const globalData = useGlobalDataContext();
    // const btc_eth_price: BTC_ETH_PRICE = globalData.price || { bitcoin: { usd: 0 }, ethereum: { usd: 0 } };
    // const btcETHPrice = (btc_eth_price || { bitcoin: { usd: 0 }, ethereum: { usd: 0 } });
    const { btc, eth } = useNavbarLivePrice();
    const market_details: MARKET_DETAILS = globalData?.marketDetails?.data || {
      total_market_cap: { usd: 0 },
      total_volume: { usd: 0 },
      market_cap_percentage: { btc: 0, eth: 0 },
    };

    const trendingTokenList: trendingTokenResponse[] =
      globalData.trendingTokens || [];

    const trendingToken: trendingTokenResponse[] | [] = trendingTokenList.slice(
      0,
      4,
    );

    // variables
    const currentPath = usePathname()!;
    const params = useParams()!;
    const { t } = useTranslation();
    const user = useUser();
    const locale = params.locale;

    const homeRoute = `/${locale}/market`;

    const ref1 = useRef<HTMLDivElement>(null);
    const ref2 = useRef<HTMLDivElement>(null);

    const analyticsRoutes = getAnalyticsRoutes(t);
    const routes = getRoutes(t);

    const supportRoutesObject = getSupportRoutes(t);
    const supportRoutesArray = supportRoutesObject.route;
    supportRoutesArray.push({
      tabName: t("navbar:homeHeaderAffiliates"),
      newTab: true,
      urlName:
        "https://affiliate.tokenmetrics.com/signup/?_ga=2.215169623.1719762614.1701035992-1625637914.1700550321&_gl=1*2wos3i*_ga*MTYyNTYzNzkxNC4xNzAwNTUwMzIx*_ga_WW36F3TJ75*MTcwMTA4ODA4OC4xOC4xLjE3MDEwODgxMDMuNDUuMC4w",
    });

    const isBelow350px = UseScreenSize({ screenSize: 350 });

    // handling sticky top bar on each pages
    useEffect(() => {
      const updateHeights = () => {
        if (ref1.current && ref2.current) {
          const height1 = ref1.current.getBoundingClientRect().height;
          const height2 = ref2.current.getBoundingClientRect().height;
          const combinedHeight = height1 + height2;

          onHeightChange(combinedHeight);
        }
      };

      const resizeObserver = new ResizeObserver(updateHeights);

      if (ref1.current) {
        resizeObserver.observe(ref1.current);
      }

      if (ref2.current) {
        resizeObserver.observe(ref2.current);
      }

      updateHeights();

      return () => {
        resizeObserver.disconnect();
      };
    }, [ref1, ref2, onHeightChange]);

    useEffect(() => {
      if (IS_PRODUCTION && user.plans && user.plans !== "BASIC") {
        LogRocket.init(process.env.NEXT_PUBLIC_LOGROCKET as string);
        LogRocket.identify(`${user.userID}`, {
          name: user.userName,
          email: user.user.email,
          subscriptionType: user.plans,
        });
      }
    }, []);

    return (
      <>
        <nav
          ref={ref1}
          className={`sticky top-0 z-[50] flex h-[65px] min-h-[65px] w-full items-center border-b border-[#E7E9EC] bg-[#fff] dark:border-[#2F3037] dark:bg-[#1a1a20] xsl:h-[78px] xsl:min-h-[78px] ${
            user.isLoggedIn
              ? "justify-between xsl:justify-normal"
              : "justify-between"
          } ${className}`}
        >
          <div
            className={`flex h-[100%] items-center border-r border-[#E7E9EC] dark:border-[#2F3037] ${
              user.isLoggedIn
                ? "min-w-[145px] pl-2 xsl:min-w-[170px] xsl:justify-center xsl:pl-0"
                : "min-w-[150px] justify-center sm:min-w-[170px] xl:w-[200px]"
            }`}
          >
            <Link href={homeRoute} id={componentIDs.header.homeButton}>
              <Image
                src={TMLogoLight}
                alt="TM Logo"
                className="h[42px] w-[120px] dark:hidden"
              />
              <Image
                src={TMLogoDark}
                alt="TM Logo"
                className="h[42px] hidden w-[120px] dark:block"
              />
            </Link>
          </div>
          <div
            className={`flex h-full items-center ${user?.isLoggedIn ? "mr-[10px] w-auto justify-between sm:mr-[22px] xsl:mr-0 xsl:w-full" : ""}`}
          >
            {user?.isLoggedIn ? (
              <div className="hidden h-full w-full items-center justify-between xsl:flex">
                <div className="flex items-baseline gap-4">
                  <NavigationRouter
                    routesVar={analyticsRoutes}
                    locale={locale}
                    currentPath={currentPath}
                  />
                  {routes.map((route: any) => {
                    const href = `/${locale}` + route.urlName;

                    return (
                      <Link
                        key={href}
                        href={route.urlName}
                        target={route.newTab && "_blank"}
                        className={cn(
                          "text-[14px] font-[500] dark:font-[400]",
                          currentPath === href
                            ? "text-[#09090B] dark:text-[#FFFFFF]"
                            : "text-[#71717A] dark:text-[#A1A1AA]",
                        )}
                      >
                        {route.tabName}
                      </Link>
                    );
                  })}
                  <NavigationRouter
                    routesVar={supportRoutesObject}
                    locale={locale}
                    currentPath={currentPath}
                    nestedRouting={true}
                  />
                </div>
                <div className="flex h-full items-center">
                  <TokenDropdown />
                  <ThemeSwitcher userLoggedIn={user?.isLoggedIn} />
                  <NotificationFeed className="mr-4" />
                  <LanguageSelector userLoggedIn={user?.isLoggedIn} />
                  <div className="ml-[3%] flex h-full w-[6vw] items-center justify-center border-l border-[#E7E9EC] dark:border-[#2F3037]">
                    <NavigationMenu className="h-[17px]">
                      <NavigationMenuList>
                        <NavigationMenuItem>
                          <NavigationMenuTrigger
                            className="min-h-[40px] min-w-[40px] rounded-full bg-[#FFCF30]"
                            showChevron={false}
                            id={componentIDs.header.userDropdownButton}
                          >
                            <span className="text-[16px] font-medium text-[#09090B]">
                              {getInitials(user?.name)}
                            </span>
                          </NavigationMenuTrigger>
                          <NavigationMenuContent
                            className={`left-[-122px] mt-[5px] min-w-[166px] px-0 py-0`}
                          >
                            <ul className="">
                              <li className="px-3 py-2">
                                <span className="flex flex-col">
                                  <span className="block w-full text-left text-[14px] font-medium dark:font-[400]">
                                    {user?.name}
                                  </span>
                                  <span className="block w-full text-left text-[14px] font-[400] text-[#FFCF30] dark:font-[300]">
                                    {user?.plans === "PLAN_CANCELLED"
                                      ? t("navbar:homeHeaderPlanCancelled")
                                      : user?.plans}
                                  </span>
                                </span>
                              </li>
                              <DropdownMenuSeparator />
                              <li className="my-[10px] px-2">
                                <NavigationMenuLink asChild>
                                  <Link
                                    id={componentIDs.header.settingsButton}
                                    href={`/settings`}
                                    passHref
                                    className={`${
                                      currentPath === "/" + locale + "/settings"
                                        ? "text-[#09090B] dark:text-[#FFFFFF]"
                                        : "text-[#71717A] dark:text-[#A1A1AA]"
                                    } mx-[5px]`}
                                  >
                                    {t("navbar:homeHeaderSettings")}
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                              <DropdownMenuSeparator />
                              <li className="my-[10px] px-2">
                                <NavigationMenuLink asChild>
                                  <Link
                                    id={componentIDs.header.logoutButton}
                                    href={`/logout`}
                                    passHref
                                    className={`mx-[5px] text-[#71717A] dark:text-[#A1A1AA]`}
                                  >
                                    {t("navbar:homeHeaderSignOut")}
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            </ul>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      </NavigationMenuList>
                    </NavigationMenu>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="hidden items-center lg:flex">
                  <div className="mx-1 flex">
                    <Image
                      src={BitcoinIcon}
                      alt="Bitcoin Icon"
                      height={20}
                      width={20}
                      className="mx-2"
                    />
                    <span>${formatNumber(btc, 2)}</span>
                  </div>
                  <div className="mx-1 flex">
                    <Image
                      src={EthereumIcon}
                      alt="Ethereum Icon"
                      height={20}
                      width={20}
                      className="mx-2"
                    />
                    <span>${formatNumber(eth, 2)}</span>
                  </div>
                </div>
                <ThemeSwitcher userLoggedIn={user?.isLoggedIn} />
                <div className="hidden xms:block">
                  <LanguageSelector userLoggedIn={user?.isLoggedIn} />
                </div>
                <div className="hidden items-center lg:flex">
                  <Link
                    href="/signin"
                    className="mx:mr-6 mr-3"
                    id={componentIDs.header.signInButton}
                  >
                    <Button className="h-[38px] w-auto rounded-[4px] border border-[#E6E9EF] bg-[#F2F4FA] text-sm dark:border-[#414249] dark:bg-[#111116] lg:min-w-[100px]">
                      {t("navbar:homeHeaderSignin")}
                    </Button>
                  </Link>
                  <Link
                    href="/signup"
                    className="mx:mr-10 mr-6"
                    id={componentIDs.header.signUpButton}
                  >
                    <Button className="h-[38px] w-auto rounded-[4px] bg-[#FFCF30] text-sm text-[#09090B] lg:min-w-[100px]">
                      {t("navbar:homeHeaderSignup")}
                    </Button>
                  </Link>
                </div>
              </>
            )}
            {user.isLoggedIn && (
              <>
                {!isBelow350px && (
                  <div className="xsl:hidden">
                    <TokenDropdown />
                  </div>
                )}
                <div
                  className={cn(
                    "xsl:hidden",
                    user?.isLoggedIn ? "mx-[3%]" : "md:mx-3 xl:mx-5",
                  )}
                >
                  <ThemeSwitcher userLoggedIn={user?.isLoggedIn} />
                </div>
                <div className="hidden sm:inline-block xsl:hidden">
                  <LanguageSelector userLoggedIn={user?.isLoggedIn} />
                </div>
              </>
            )}
            <ResponsiveNavbar user={user} isBelow350px={isBelow350px} />
          </div>
        </nav>
        <div
          ref={ref2}
          className={`${
            user?.isLoggedIn ? "hidden sm:flex" : "hidden"
          } sticky top-[65px] z-[19] h-auto w-full flex-wrap items-center justify-between border-b border-[#E7E9EC] bg-[#F2F4FA] px-4 py-1 dark:border-[#2F3037] dark:bg-[#111116] xsl:top-[78px]`}
        >
          <div className="flex items-center py-2">
            <div className="text-[14px]">
              {t("navbar:homeHeaderMarketCap")} :{" "}
              <span className="text-[#71717A] dark:text-[#A1A1AA]">
                ${formatNumber(market_details?.total_market_cap?.usd, 2, true)}
              </span>
            </div>
            <div className="mx-3 self-stretch border-l border-separator laptop:mx-5"></div>
            <div className="text-[14px]">
              {t("navbar:homeHeader24hVol")} :{" "}
              <span className="text-[#71717A] dark:text-[#A1A1AA]">
                ${formatNumber(market_details?.total_volume?.usd, 2, true)}{" "}
              </span>
            </div>
            <div className="mx-3 self-stretch border-l border-separator laptop:mx-5"></div>
            <div className="text-[14px]">
              {t("navbar:homeHeaderDominance")} :
              <span className="ml-[5px] text-[#71717A] dark:text-[#A1A1AA]">
                BTC:{" "}
                {formatNumber(market_details?.market_cap_percentage?.btc, 2)}
                %&nbsp;&nbsp;&nbsp;ETH:{" "}
                {formatNumber(market_details?.market_cap_percentage?.eth, 2)}%
              </span>
            </div>
            <div className="mx-3 hidden self-stretch border-l border-separator lg:block laptop:ml-5"></div>
            <span className="hidden items-center lg:flex laptop:mx-2">
              <span className="flex laptop:mx-1">
                <Image
                  src={BitcoinIcon}
                  alt="Bitcoin Icon"
                  height={20}
                  width={20}
                  className="mr-2 laptop:mx-2"
                />
                <span>${formatNumber(btc, 2)}</span>
              </span>
              <span className="ml-2 flex laptop:mx-1">
                <Image
                  src={EthereumIcon}
                  alt="Ethereum Icon"
                  height={20}
                  width={20}
                  className="mr-2 laptop:mx-2"
                />
                <span>${formatNumber(eth, 2)}</span>
              </span>
            </span>
          </div>
          <div className="ml-auto flex py-2">
            <div className="mr-5 self-stretch border-separator laptop:border-l"></div>
            <div className="flex flex-wrap items-center justify-center text-[14px]">
              {t("navbar:homeHeaderMostTrending")} :
              {trendingToken.map((token: trendingTokenResponse) => (
                <Tooltip.Tooltip delayDuration={300} key={token.CG_ID}>
                  <Tooltip.TooltipTrigger asChild>
                    <Link
                      className="mx-2 flex cursor-pointer flex-wrap items-center justify-center"
                      href={getTokenDetailsHref(token)}
                      target="_blank"
                      key={token.TOKEN_ID}
                    >
                      <ImageWithFallback
                        src={getTokenLogo(token)}
                        alt={token?.SYMBOL}
                        height={20}
                        width={20}
                        className="mr-2 laptop:mx-2"
                        fallBackImg={constants.placeholderIconUrls.color}
                      />
                      <span className="text-[14px] text-[#71717A] dark:text-[#A1A1AA]">
                        {token?.SYMBOL}
                      </span>
                    </Link>
                  </Tooltip.TooltipTrigger>
                  <Tooltip.TooltipPortal>
                    <Tooltip.TooltipContent className="mb-[55px]">
                      <span className="text-[14px] text-[#71717A] dark:text-[#A1A1AA]">
                        {token?.NAME}
                      </span>
                    </Tooltip.TooltipContent>
                  </Tooltip.TooltipPortal>
                </Tooltip.Tooltip>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  },
);

export default Navbar;
