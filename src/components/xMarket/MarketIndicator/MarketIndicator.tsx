"use client";

import { useCallback, useState } from "react";

// importing ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomTooltip from "@/components/ui/customTooltip";

// importing custom functions
import Filter from "@/components/charts/filter";
import { filterChartDataByTime } from "@/lib/utils";
import BullishTMGrades from "../Charts/BullishTMGrades/BullishTMGrades";
import GradeSignal from "../Charts/GradeSignal/GradeSignal";

// importing multilanguage
import { useTranslation } from "@/components/translation/TranslationsProvider";

// importing types
import { MarketMetric } from "@/types/market";

// importing icons
import { AiOutlineInfoCircle } from "react-icons/ai";
import ResponsiveTabs from "./ResponsiveTabs";

const MarketIndicator = ({ data: dataProp }: { data: MarketMetric[] }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("TM Grade Signal");

  const [roiFilter, setROIFilter] = useState({
    filter: "MAX",
    filterValue: 0,
  });

  const data = filterChartDataByTime(dataProp, roiFilter.filterValue);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  return (
    <Card
      className={`mb-[20px] border border-[#E1E0E0] dark:border-[#414249] xl:mb-0 xl:mr-[10px] xnl:mr-[20px]`}
      style={{ flex: "1 1 auto" }}
    >
      <CardHeader className="flex flex-row flex-col justify-between px-[10px] py-[10px] md:flex-row md:items-end lg:px-[20px] laptop:h-[58px] laptop:items-center laptop:py-0">
        <div className="flex h-full flex-col laptop:flex-row laptop:items-center">
          <CardTitle
            className="item-center flex text-[16px] font-[500]"
            tag="h2"
          >
            {t("market:tmMarketIndicator")}

            <CustomTooltip
              message={<p>{t("market:tmMarketIndicatorTooltip")}</p>}
              className="top-[25px] z-[18] w-[250px]"
            >
              <AiOutlineInfoCircle className="mx-[4px] mt-[5px] cursor-pointer text-[14px] text-[#71717A] dark:text-[#A1A1AA]" />
            </CustomTooltip>
          </CardTitle>
          <ResponsiveTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            defaultValue="TM Grade Signal"
          />
        </div>
        <Filter
          onChange={(filter: string, filterValue: number) =>
            setROIFilter({ filter, filterValue })
          }
          defaultFilter={roiFilter?.filter}
          displayBlur={false}
          className="ml-auto py-[7px]"
          data={data}
        />
      </CardHeader>
      <CardContent
        className={`py-[20px] pl-0 ${activeTab === "TM Grade Signal" ? "pr-[10px] sm:pr-[20px]" : "px-0 sm:pr-[12px]"} flex`}
      >
        {activeTab === "TM Grade Signal" && <GradeSignal data={data} />}
        {activeTab === "Percentage of Bullish TM Grades" && (
          <BullishTMGrades data={data} />
        )}
      </CardContent>
    </Card>
  );
};

export default MarketIndicator;
