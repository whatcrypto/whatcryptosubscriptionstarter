"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import DOMPurify from "dompurify";

// importing ui components
import { Button } from "@/components/ui/button";

// chart library
import { createChart } from "lightweight-charts";

// required functions for chart
import {
    addWatermark,
    applyTimeScaleOptions,
    loopValueForCharts,
    positionTooltip,
    showHideTooltip,
    createTooltipBase,
    createLineSeries,
    useChartTheme,
    createBaselineSeries,
    handleChartRendering,
} from "@/utils/chart";

// importing custom functions 
import { dateToString } from "@/utils/date";
import { customFormatting, formatNumber } from "@/utils/formatNumber";

// importing translation
import { useTranslation } from "@/components/translation/TranslationsProvider";

// importing types
import { MarketMetric } from "@/types/market";
import clsx from "clsx";

export function createTooltipForCharts(toolTip: HTMLElement, dateStr: string, altcoinIndicator: any, legendState: boolean, t: Function) {
    const sanitizedHTML = DOMPurify.sanitize(`
        <div class="mb-[8px] px-[8px]">${dateStr}</div>
        <div class="px-[8px] border-b border-[#E7E9EC] dark:border-[#2F3037] ml-[-8px] mb-[5px]"></div>
        <div style="padding: 0 8px;">
            <div class="${altcoinIndicator !== undefined && altcoinIndicator !== null && legendState ? "block" : "hidden"}">
                <span class="inline-block bg-[#DCAF1A] rounded-full h-[2px] w-[14px] mr-[4px] mb-[4px]" style="word-wrap:break-word; overflow-wrap: break-word;"></span>
                <span class="inline-block text-[14px]" style="line-height:27px;word-wrap:break-word; overflow-wrap: break-word;">
                    ${t("market:altcoinIndicator")}: <span>${formatNumber(altcoinIndicator, 2)}%</span>
                </span>
            </div>
        </div>
    `);
    toolTip.innerHTML = sanitizedHTML;
}

const BitcoinAltcoin = ({ marketMetrics }: { marketMetrics: MarketMetric[] }) => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const [width, height] = [900, 450];

    const altVsBitcoinChart = useRef<any>();
    const altVsBitcoinRef: any = useRef();

    const [chartLegend, setChartLegend] = useState({
        altcoinIndicator: true,
        bitcoinSeason: true,
        altcoinSeason: true,
    });

    const chartTheme = useChartTheme({
        leftPriceScale: true,
        rightPriceScale: false,
        theme,
        localization: {
            priceFormatter: (number: number) => customFormatting(number, false, 0) ?? "",
        },
    });

    useEffect(() => {
        function loopingthroughArray(marketMetrics: MarketMetric[], alts_cap: any, alts_cap_fortyFive: any, alts_cap_hundred: any) {
            for (const data of marketMetrics) {
                loopValueForCharts(data.DATE, data.ALTS_INDICATOR, alts_cap);
                loopValueForCharts(data.DATE, 0.0000000001, alts_cap_fortyFive);
                loopValueForCharts(data.DATE, 100, alts_cap_hundred);
            }
        }

        const alts_cap: any[] = [];
        const alts_cap_fortyFive: any[] = [];
        const alts_cap_hundred: any[] = [];

        if (marketMetrics?.length > 0) {
            loopingthroughArray(marketMetrics, alts_cap, alts_cap_fortyFive, alts_cap_hundred);

            const temp = document.getElementById("bit-alt-container");

            if (temp) {
                temp.innerHTML = "";

                let toolTip: any = createTooltipBase("220px");
                if (chartLegend.altcoinIndicator) {
                    temp.appendChild(toolTip);
                }

                altVsBitcoinRef.current = createChart(altVsBitcoinChart.current, chartTheme());

                let altcoinSeasonColor = theme === "dark" ? "#1b3930" : "#d2f0e2";
                let bitcoinSeason = theme === "dark" ? "#482227" : "#ffd9d9";

                if (chartLegend.altcoinSeason) {
                    const areaSeries = createBaselineSeries({
                        container: altVsBitcoinRef.current,
                        legend: chartLegend.altcoinSeason,
                        baseValue: { type: "price", price: 65 },
                        priceScaleId: "left",
                        topFillColor1: altcoinSeasonColor,
                        topFillColor2: altcoinSeasonColor,
                        lineWidth: 0,
                    });
                    areaSeries.setData(alts_cap_hundred);
                }

                if (chartLegend.bitcoinSeason) {
                    const areaSeries2 = createBaselineSeries({
                        container: altVsBitcoinRef.current,
                        baseValue: { type: "price", price: 45 },
                        legend: chartLegend.bitcoinSeason,
                        priceScaleId: "left",
                        bottomFillColor1: bitcoinSeason,
                        bottomFillColor2: bitcoinSeason,
                        lineWidth: 0,
                    });
                    areaSeries2.setData(alts_cap_fortyFive);
                }

                const lineSeries = createLineSeries(
                    altVsBitcoinRef.current,
                    chartLegend.altcoinIndicator,
                    "left",
                    2,
                    "#DCAF1A",
                    "rgba(0,0,0,0)",
                    "rgba(0,0,0,0)",
                );
                lineSeries.setData(alts_cap);

                addWatermark(temp);
                applyTimeScaleOptions(altVsBitcoinRef.current.timeScale(), theme);

                altVsBitcoinRef.current.subscribeCrosshairMove((param: any) => {
                    showHideTooltip(param, altVsBitcoinRef.current, toolTip);
                    if (toolTip.style.display === "block") {
                        const dateStr = dateToString(param.time);

                        const data = param.seriesData.get(lineSeries);
                        let altcoinIndicator = data?.value !== undefined ? data?.value : data?.close;

                        createTooltipForCharts(toolTip, dateStr, altcoinIndicator, chartLegend.altcoinIndicator, t);
                        positionTooltip(param, toolTip, temp);
                    }
                });

                altVsBitcoinRef.current.timeScale().fitContent();
            }
        }
    }, [altVsBitcoinChart, theme, chartLegend, height, width, chartTheme, t, marketMetrics]);

    const toggleLegend = (key: string) => {
        setChartLegend((legendState: any) => ({
            ...legendState,
            [key]: !legendState[key],
        }));
    };

    return (
        <div className="flex relative flex-col w-full" data-testid="bit-alt-parent-container">
            {handleChartRendering(
                marketMetrics,
                <>
                    <div ref={altVsBitcoinChart} id="bit-alt-container" className="relative w-full"></div>
                    <div className="flex justify-center mx-auto flex-wrap mt-2">
                        <Button
                            type="button"
                            className={clsx("legendButton", chartLegend.altcoinIndicator ? "" : "opacity-50")}
                            onClick={() => toggleLegend("altcoinIndicator")}
                        >
                            <div className="h-[4px] w-[14px] bg-[#DCAF1A] mr-2 rounded-[4px]"></div>
                            <span>{t("market:altcoinIndicator")}</span>
                        </Button>

                        <Button
                            type="button"
                            className={clsx("legendButton", chartLegend.altcoinSeason ? "" : "opacity-50")}
                            onClick={() => toggleLegend("altcoinSeason")}
                        >
                            <div className="h-[7px] w-[7px] rounded-full bg-[#52c41a] mr-2"></div>
                            <span>{t("market:altcoinSeason")}</span>
                        </Button>
                        <Button
                            type="button"
                            className={clsx("legendButton", chartLegend.bitcoinSeason ? "" : "opacity-50")}
                            onClick={() => toggleLegend("bitcoinSeason")}
                        >
                            <div className="h-[7px] w-[7px] rounded-full bg-[#ff4d4f] mr-2"></div>
                            <span>{t("market:bitcoinSeason")}</span>
                        </Button>
                    </div>
                </>,
            )}
        </div>
    );
};

export default BitcoinAltcoin;
