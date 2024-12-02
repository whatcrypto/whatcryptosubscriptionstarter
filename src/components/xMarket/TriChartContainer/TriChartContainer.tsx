"use client";

import React, { useState } from "react";

// importing ui
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// importing custom functions
import TooltipHovering from "../TooltipHovering/TooltipHovering";
import Filter from "@/components/charts/filter";
import BitcoinAltcoin from "../Charts/BitcoinAltcoin/BitcoinAltcoin";
import TotalCryptoMarket from "../Charts/TotalCryptoMarket/TotalCryptoMarket";
import HistoricalVolatility from "../Charts/HistoricalVolatility/HistoricalVolatility";

// importing multilanguage
import { useTranslation } from "@/components/translation/TranslationsProvider";
import { MarketMetric } from "@/types/market";
import { filterChartDataByTime } from "@/lib/utils";
import CustomTooltip from "@/components/ui/customTooltip";
import { AiOutlineInfoCircle } from "react-icons/ai";
import ResponsiveTabs from "./ResponsiveTabs";

const TriChartContainer = ({ marketMetrics: marketMetricsProp }: { marketMetrics: MarketMetric[] }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("Bitcoin vs Altcoin Season");
    const [roiFilter, setROIFilter] = useState({
        filter: "MAX",
        filterValue: 0,
    });

    const marketMetrics = filterChartDataByTime(marketMetricsProp, roiFilter.filterValue);

    let tooltipContent = "";

    if (activeTab === "Bitcoin vs Altcoin Season") {
        tooltipContent = t("market:bitcoinVsAltcoinSeasonTooltip");
    } else if (activeTab === "Total Crypto Market Cap") {
        tooltipContent = t("market:totalCryptoMarketCapTooltip");
    } else {
        tooltipContent = t("market:historicalVolatilityTooltip");
    }

    return (
        <Card className={`my-[20px]`}>
            <CardHeader className="pb-[15px] px-[10px] xnl:px-[20px] ">
                <div className="flex items-center h-auto lg:h-[58px] py-3 lg:py-0">
                    <ResponsiveTabs activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} defaultValue="Bitcoin vs Altcoin Season" />
                </div>
                <div className="flex justify-between sm:items-center w-full flex-col sm:flex-row">
                    <div className="flex items-center mb-2 sm:mb-0">
                        <span className="text-[16px] font-[500]">
                            {activeTab === "Bitcoin vs Altcoin Season" && t("market:bitcoinVsAltcoinSeason")}
                            {activeTab === "Total Crypto Market Cap" && t("market:totalCryptoMarketCap")}
                            {activeTab === "Historical Volatility" && t("market:annualizedHistoricalVolatility")}
                        </span>
                        <CustomTooltip message={<p>{tooltipContent}</p>} className="w-[250px] z-[18] top-[25px]">
                            <AiOutlineInfoCircle className="mx-[4px] text-[14px] text-[#71717A] dark:text-[#A1A1AA] cursor-pointer" />
                        </CustomTooltip>
                    </div>
                    <Filter
                        onChange={(filter: string, filterValue: number) => setROIFilter({ filter, filterValue })}
                        defaultFilter={roiFilter?.filter}
                        displayBlur={false}
                        className="self-end"
                        data={marketMetrics}
                    />
                </div>
            </CardHeader>
            <CardContent className={`py-[20px] pl-0  pr-[12px] xnl:pr-[20px] flex`}>
                {activeTab === "Bitcoin vs Altcoin Season" && <BitcoinAltcoin marketMetrics={marketMetrics} />}
                {activeTab === "Total Crypto Market Cap" && <TotalCryptoMarket marketMetrics={marketMetrics} />}
                {activeTab === "Historical Volatility" && <HistoricalVolatility marketMetrics={marketMetrics} />}
            </CardContent>
        </Card>
    );
};

export default TriChartContainer;
