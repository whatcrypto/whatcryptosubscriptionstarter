import Image from 'next/image';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import type { FC } from 'react';
import { memo, useEffect, useState } from 'react';

// importing context

// importing ui components
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/NavbarSheet';
import { Button } from '@/components/ui/button';

// importing custom functions
import UseScreenSize from '@/components/UseScreenSize/UseScreenSize';
import {
  getAdditionalResponsiveRoutes,
  getAnalyticsRoutes,
  getInitials,
  getMoreRoutes,
  getRoutes,
  getSupportRoutes,
} from '@/components/layout/Navbar/Utils/navUtils';
import { formatNumber } from '@/utils/formatNumber';

// importing types

// importing for translation
import { useTranslation } from '@/components/translation/TranslationsProvider';

// importing images
import BitcoinIcon from '@/public/images/navbar/Bitcoin.svg';
import EthereumIcon from '@/public/images/navbar/Ethereum.svg';
import TMLogoDark from '@/public/images/navbar/TM Logo Dark.svg';
import TMLogoLight from '@/public/images/navbar/TM Logo Light.svg';

// import icons from react-icons
import LanguageSelector from '@/components/languageSelector';
import componentIDs from '@/constants/componentIDs';
import useNavbarLivePrice from '@/hooks/useNavbarLivePrice';
import { USER } from '@/types/user';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import TokenDropdown from '../TokenDropdown/TokenDropdown';

// Define the type for the state
interface DropdownState {
  analytics: boolean;
  portfolio: boolean;
  learn: boolean;
  support: boolean;
}

interface Route {
  tabName: string;
  urlName: string;
  newTab?: boolean; // assuming newTab might be optional
}
interface RoutesVar {
  mainHeading: string;
  route: Route[];
}

interface EachDropdownRouterProps {
  routesVar: RoutesVar;
  dropDownBoolean: keyof DropdownState;
  locale: string | string[];
  currentPath: string;
}

const EachDropdownRouter: FC<EachDropdownRouterProps> = memo(
  ({ routesVar, dropDownBoolean, locale, currentPath }) => {
    const [showDropdown, setShowDropdown] = useState<DropdownState>({
      analytics: true,
      portfolio: false,
      learn: false,
      support: false,
    });

    const toggleDropdown = (dropdownName: keyof DropdownState) => {
      setShowDropdown((prevState) => ({
        ...prevState,
        [dropdownName]: !prevState[dropdownName],
      }));
    };

    return (
      <div
        className={`mx-2 text-[14px] font-[500] text-[#71717A] dark:text-[#A1A1AA] ${showDropdown[dropDownBoolean] ? 'mt-2' : 'my-2'}`}
      >
        <button
          data-testid="each-dropdown-router"
          className="flex w-full justify-between"
          onClick={() => toggleDropdown(dropDownBoolean)}
        >
          <span>{routesVar.mainHeading}</span>
          {!showDropdown[dropDownBoolean] ? (
            <IoMdArrowDropdown className="text-xl" />
          ) : (
            <IoMdArrowDropup className="text-xl" />
          )}
        </button>
        {showDropdown[dropDownBoolean] &&
          routesVar.route.map((route: Route, index: number) => {
            const href = `/${locale}${route.urlName}`;

            const isLast = index === routesVar.route.length - 1;

            return (
              <SheetClose asChild key={route.urlName}>
                <Link
                  href={route.urlName}
                  target={route.newTab ? '_blank' : undefined}
                  rel={route.newTab ? 'noopener noreferrer' : undefined}
                  className={`${currentPath === href || currentPath === route.urlName ? 'text-[#09090B] dark:text-[#FFFFFF]' : 'text-[#71717A] dark:text-[#A1A1AA]'} ${showDropdown[dropDownBoolean] && isLast ? 'mb-2 mt-4' : 'my-4'} mx-5 flex font-[400]`}
                >
                  {route.tabName}
                </Link>
              </SheetClose>
            );
          })}
      </div>
    );
  },
);
EachDropdownRouter.displayName = 'EachDropdownRouter';

interface SingleDropdownRouterProps {
  routes: Route[];
  locale: string | string[];
  currentPath: string;
}
const SingleDropdownRouter: FC<SingleDropdownRouterProps> = memo(
  ({ routes, locale, currentPath }) => {
    return (
      <>
        {routes.map((route: Route) => {
          const href = `/${locale}` + route.urlName;

          return (
            <div className="mx-2 my-2" key={href}>
              <SheetClose asChild>
                <Link
                  href={route.urlName}
                  target={route.newTab ? '_blank' : undefined}
                  rel={route.newTab ? 'noopener noreferrer' : undefined}
                  className={`${
                    href === currentPath
                      ? 'text-[#09090B] dark:text-[#FFFFFF]'
                      : 'text-[#71717A] dark:text-[#A1A1AA]'
                  } text-[14px] font-[500]`}
                >
                  {route.tabName}
                </Link>
              </SheetClose>
            </div>
          );
        })}
      </>
    );
  },
);
SingleDropdownRouter.displayName = 'SingleDropdownRouter';

interface ResponsiveNavbarProps {
  user: USER;
  isBelow350px: boolean;
}

const ResponsiveNavbar: FC<ResponsiveNavbarProps> = ({
  user,
  isBelow350px,
}) => {
  // const globalData = useGlobalDataContext();
  // const btc_eth_price: BTC_ETH_PRICE = globalData.price || { bitcoin: { usd: 0 }, ethereum: { usd: 0 } };
  // const btcETHPrice = (btc_eth_price || { bitcoin: { usd: 0 }, ethereum: { usd: 0 } });
  const { btc, eth } = useNavbarLivePrice();

  const currentPath = usePathname()!;
  const params = useParams()!;
  const locale = params.locale;

  const { t } = useTranslation();
  const analyticsRoutes = getAnalyticsRoutes(t);
  const routes = getRoutes(t);
  const supportRoutes = getSupportRoutes(t);
  const moreRoutes = getMoreRoutes(t);
  const additionalRoutes = getAdditionalResponsiveRoutes(t);

  const [sideBar, setSideBar] = useState(false);
  const isBelow767px = UseScreenSize({ screenSize: 767 });
  const isBelow1300px = UseScreenSize({ screenSize: 1300 });

  useEffect(() => {
    if (!(isBelow767px && !user?.isLoggedIn)) {
      setSideBar(false);
    }
  }, [isBelow767px, user]);

  useEffect(() => {
    if (!isBelow1300px && user?.isLoggedIn) {
      setSideBar(false);
    }
  }, [isBelow1300px, user]);

  return (
    <Sheet open={sideBar} onOpenChange={setSideBar}>
      <SheetTrigger
        onClick={() => setSideBar(true)}
        className={`ml-0 mr-3 sm:ml-[10px] xsl:mr-5 ${user?.isLoggedIn ? 'flex xsl:hidden' : 'flex lg:hidden'}`}
        id={componentIDs.header.openSidebarButton}
      >
        <span className="flex cursor-pointer flex-col justify-around">
          <AiOutlineMenu className="m-[1px] h-[28px] w-[25px]" />
        </span>
      </SheetTrigger>
      <SheetContent className="h-screen w-[256px] border-r border-[#E7E9EC] dark:border-[#27272a] dark:bg-[#111116]">
        <div className="h-full overflow-y-auto overflow-x-hidden text-[#121212] dark:text-white">
          <div className="sticky top-0 flex items-center justify-between bg-[#fff] px-2 py-2 dark:bg-[#111116]">
            <span
              className={`${user.isLoggedIn ? 'mx-2' : 'mx-3'} mb-1 mt-2 flex justify-between`}
            >
              {user.isLoggedIn ? (
                <div className="flex">
                  <div className="flex h-[42px] min-h-[42px] w-[42px] min-w-[42px] items-center justify-center rounded-[4px] bg-[#FFCF30]">
                    <span className="text-[16px] font-medium text-[#09090B]">
                      {getInitials(user?.name)}
                    </span>
                  </div>
                  <div className="mx-2">
                    <span className="block w-full text-left text-[14px] font-medium dark:font-[400]">
                      {user?.name}
                    </span>
                    <span className="block w-full text-left text-[14px] font-[400] text-[#FFCF30] dark:font-[300]">
                      {user?.plans === 'PLAN_CANCELLED'
                        ? t('navbar:homeHeaderPlanCancelled')
                        : user?.plans}
                    </span>
                  </div>
                </div>
              ) : (
                <a href="/" id={componentIDs.header.mobileHomeButton}>
                  <Image
                    src={TMLogoLight}
                    className="dark:hidden"
                    width={100}
                    height={49}
                    alt="TM Logo"
                  />
                  <Image
                    src={TMLogoDark}
                    priority={false}
                    className="hidden dark:block"
                    width={100}
                    height={49}
                    alt="TM Logo"
                  />
                </a>
              )}
            </span>
            <AiOutlineClose
              data-testid="close"
              className="my-3 mr-[4px] cursor-pointer text-base"
              onClick={() => setSideBar(false)}
              id={componentIDs.header.closeSidebarButton}
            />
          </div>
          <hr className="sticky top-[70px] border-[#E7E9EC] dark:border-[#2F3037]" />
          {user?.isLoggedIn ? (
            <>
              <div className="sticky top-[71px] flex h-[50px] items-center bg-[#fff] dark:bg-[#111116] lg:hidden">
                <span className="mx-1 flex items-center lg:hidden">
                  <span className="mx-1 flex">
                    <Image
                      src={BitcoinIcon}
                      alt="Bitcoin Icon"
                      height={20}
                      width={20}
                      className="mx-2"
                    />
                    <span>${formatNumber(btc, 0)}</span>
                  </span>
                  <span className="mx-1 flex">
                    <Image
                      src={EthereumIcon}
                      alt="Ethereum Icon"
                      height={20}
                      width={20}
                      className="mx-2"
                    />
                    <span>${formatNumber(eth, 0)}</span>
                  </span>
                </span>
                <div className="sm:hidden">
                  <LanguageSelector
                    userLoggedIn={user?.isLoggedIn}
                    closeSidebar={() => setSideBar(false)}
                  />
                </div>
              </div>
              <hr className="sticky top-[121px] mb-2 block border-[#E7E9EC] dark:border-[#2F3037] lg:hidden" />
              {isBelow350px && (
                <>
                  {isBelow350px && <TokenDropdown />}
                  <hr className="my-2 block border-[#E7E9EC] dark:border-[#2F3037] lg:hidden" />
                </>
              )}
              <div className="mx-2 flex w-[246px] flex-col overflow-auto pb-[5px]">
                <EachDropdownRouter
                  routesVar={analyticsRoutes}
                  dropDownBoolean="analytics"
                  locale={locale}
                  currentPath={currentPath}
                />
                <SingleDropdownRouter
                  routes={routes}
                  locale={locale}
                  currentPath={currentPath}
                />
                {/* <EachDropdownRouter routesVar={moreRoutes} dropDownBoolean='portfolio' locale={locale} currentPath={currentPath} /> */}
                <EachDropdownRouter
                  routesVar={supportRoutes?.routesVar}
                  dropDownBoolean="portfolio"
                  locale={locale}
                  currentPath={currentPath}
                />
                <EachDropdownRouter
                  routesVar={supportRoutes}
                  dropDownBoolean="portfolio"
                  locale={locale}
                  currentPath={currentPath}
                />
                <SingleDropdownRouter
                  routes={additionalRoutes}
                  locale={locale}
                  currentPath={currentPath}
                />
              </div>
            </>
          ) : (
            <>
              <div className="mx-2 flex h-[50px] items-center pt-2">
                <span className="mx-1 flex">
                  <Image
                    src={BitcoinIcon}
                    alt="Bitcoin Icon"
                    height={20}
                    width={20}
                    className="mx-2"
                  />
                  <span>${formatNumber(btc, 0)}</span>
                </span>
                <span className="mx-1 flex">
                  <Image
                    src={EthereumIcon}
                    alt="Ethereum Icon"
                    height={20}
                    width={20}
                    className="mx-2"
                  />
                  <span>${formatNumber(eth, 0)}</span>
                </span>
                <div className="block xms:hidden">
                  <LanguageSelector
                    userLoggedIn={user?.isLoggedIn}
                    closeSidebar={() => setSideBar(false)}
                  />
                </div>
              </div>
              <hr className="mb-2 border-[#E7E9EC] dark:border-[#2F3037]" />
              <div className="flex flex-col">
                <SheetClose asChild>
                  <Link
                    href="/signin"
                    className="mx-5 my-1 min-w-[100px]"
                    id={componentIDs.header.mobileSignInButton}
                  >
                    <Button className="h-[38px] min-w-[100px] rounded-[4px] border border-[#E6E9EF] bg-[#F2F4FA] text-sm dark:border-[#414249] dark:bg-[#111116]">
                      {t('navbar:homeHeaderSignin')}
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/signup"
                    className="mx-5 my-2 min-w-[100px]"
                    id={componentIDs.header.mobileSignUpButton}
                  >
                    <Button className="h-[38px] min-w-[100px] rounded-[4px] bg-[#FFCF30] text-sm text-[#09090B]">
                      {t('navbar:homeHeaderSignup')}
                    </Button>
                  </Link>
                </SheetClose>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ResponsiveNavbar;
