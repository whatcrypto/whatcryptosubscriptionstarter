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

const ResponsiveTabs: FC<Props> = ({activeTab, onTabChange, defaultValue, className}) => {
    const { t } = useTranslation();
    const values = {
        'TM Grade Signal': t("market:tmGradeSignal"),
        'Percentage of Bullish TM Grades': t("market:percentageBullishTMGrades")
    };

    type ValueKey = keyof typeof values;

    return (
        <>
            <Tabs
                defaultValue={defaultValue}
                value={activeTab}
                className={twMerge("my-[5px] sm:mb-[10px] md:mb-0 sm:mt-[10px] laptop:mt-0 laptop:ml-[15px] md:flex hidden", className)}
                onValueChange={onTabChange}
            >
                <TabsList className="w-[240px] sm:w-auto sm:min-w-[438px] h-[80px] sm:h-[40px] flex flex-col sm:flex-row">
                    <TabsTrigger value="TM Grade Signal" className={`text-[14px] w-full sm:w-[166px]`}>
                        {t("market:tmGradeSignal")}
                    </TabsTrigger>
                    <TabsTrigger value="Percentage of Bullish TM Grades" className={`text-[14px] w-full sm:w-auto sm:min-w-[261px] truncate`}>
                        {t("market:percentageBullishTMGrades")}
                    </TabsTrigger>
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
                    <DropdownMenuItem
                        onClick={() => {
                            onTabChange('TM Grade Signal');
                        }}
                        className="h-10 px-4 py-2"
                        data-testid="tmGradeSignal"
                    >
                        <span className="ml-[10px] font-normal dark:font-[300] text-sm text-left  inline-block">{t("market:tmGradeSignal")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            onTabChange('Percentage of Bullish TM Grades');
                        }}
                        className="h-10 px-4 py-2"
                        data-testid="percentageBullishTMGrades"
                    >
                        <span className="ml-[10px] font-normal dark:font-[300] text-sm text-left  inline-block">{t("market:percentageBullishTMGrades")}</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
        </>
    );
};

export default ResponsiveTabs;