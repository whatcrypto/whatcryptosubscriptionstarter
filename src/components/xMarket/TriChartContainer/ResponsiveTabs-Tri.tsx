import { FC } from "react";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";
import { twJoin, twMerge } from "tailwind-merge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useTranslation } from "@/components/translation/TranslationsProvider";

type Props = {
    activeTab: string;
    onTabChange: (tab: string) => void;
    defaultValue?: string;
    className?: string;
};

const ResponsiveTabs: FC<Props> = ({activeTab, onTabChange, defaultValue}) => {
    const { t } = useTranslation();
    const values = {
        'Bitcoin vs Altcoin Season': t("market:bitcoinVsAltcoinSeason"),
        'Total Crypto Market Cap': t("market:totalCryptoMarketCap"),
        'Historical Volatility': t("market:historicalVolatility"),
    };

    type ValueKey = keyof typeof values;

    return (
        <>
            <Tabs 
                defaultValue="Bitcoin vs Altcoin Season" 
                value={activeTab} 
                className="md:flex hidden"
                onValueChange={(tab) => onTabChange(tab)}>
                <TabsList className="flex h-auto flex-row overflow-x-hidden">
                    <TabsTrigger className="min-w-[193px]" value="Bitcoin vs Altcoin Season">{t("market:bitcoinVsAltcoinSeason")}</TabsTrigger>
                    <TabsTrigger className="min-w-[193px]" value="Total Crypto Market Cap">{t("market:totalCryptoMarketCap")}</TabsTrigger>
                    <TabsTrigger className="min-w-[193px]" value="Historical Volatility">{t("market:historicalVolatility")}</TabsTrigger>
                </TabsList>
            </Tabs>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button data-testid="dropdownTrigger" className="md:hidden mt-2 md:mt-0 group flex items-center px-5 py-0 w-full max-[460px]:max-w-full max-w-[300px] bg-[#ffffff] dark:bg-[#1a1a20] border border-[#E6E9EF] dark:border-[#414249] rounded-[4px]">
                        {values[activeTab as ValueKey] ?? values[defaultValue as ValueKey]}
                        <RiArrowDropDownLine className="text-xl rotate-0 group-data-[state=open]:rotate-180 transform" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-[35px] w-[var(--radix-dropdown-menu-trigger-width)] sm:mr-[44px] xl:mr-[55px] xsl:mr-[6vw] ">
                    {Object.keys(values).map((value) => (
                        <DropdownMenuItem
                            onClick={() => {
                                onTabChange(value);
                            }}
                            key={value}
                            data-testid={value}
                            className="h-10 px-4 py-2"
                        >
                            <span className="ml-[10px] font-normal dark:font-[300] text-sm text-left  inline-block">{values[value as ValueKey]}</span>
                        </DropdownMenuItem>

                    ))}
                </DropdownMenuContent>
                </DropdownMenu>
        </>
    );
};

export default ResponsiveTabs;