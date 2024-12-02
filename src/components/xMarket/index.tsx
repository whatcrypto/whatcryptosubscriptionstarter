"use client";

import React from "react";

// importing components
import Footer from "@/components/layout/Footer/footer";

type MarketHomeProps = {
    sectorAnalysisNode: React.ReactNode;
    bestDailyPerformersNode: React.ReactNode;
    worstDailyPerformersNode: React.ReactNode;
    recentlyTurnedBullishNode: React.ReactNode;
    recentlyTurnedBearishNode: React.ReactNode;
    marketResearchReportsNode: React.ReactNode;
    bullAndBearNode: React.ReactNode;
    marketIndicatorNode: React.ReactNode;
    triChartNode: React.ReactNode;
    aiSectionNode: React.ReactNode;
};

const MarketHome = ({
    sectorAnalysisNode,
    bestDailyPerformersNode,
    worstDailyPerformersNode,
    recentlyTurnedBearishNode,
    recentlyTurnedBullishNode,
    marketResearchReportsNode,
    bullAndBearNode,
    marketIndicatorNode,
    triChartNode,
    aiSectionNode,
}: MarketHomeProps) => {

    return (
        <div className="w-full">
            <div className="max-w-[1614px] mx-auto px-2 pt-[10px] pb-[0 px] lg:pb-[15px]" >
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[15px] xl:gap-[10px] xnl:gap-[20px] w-full py-[10px]">
                    {bestDailyPerformersNode}
                    {worstDailyPerformersNode}
                    {recentlyTurnedBullishNode}
                    {recentlyTurnedBearishNode}
                </div>
                <div className="flex w-full py-[10px] flex-col xl:flex-row">
                    {marketIndicatorNode}
                    {bullAndBearNode}
                </div>
                {aiSectionNode}
                {triChartNode}
                {sectorAnalysisNode}
                {marketResearchReportsNode}
            </div>
            <Footer fullWidth={true} />
        </div>
    );
};

export default MarketHome;
