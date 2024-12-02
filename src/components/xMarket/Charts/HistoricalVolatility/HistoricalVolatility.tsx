"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";

// importing ui components
import { Button } from "@/components/ui/button";

// importing chart library
import { createChart } from "lightweight-charts";

// importing functions
import { dateToString } from "@/utils/date";
import { formatNumber } from "@/utils/formatNumber";

// importing charts functions
import {
    addWatermark,
    applyTimeScaleOptions,
    loopValueForCharts,
    positionTooltip,
    createTooltipForCharts,
    showHideTooltip,
    createTooltipBase,
    createLineSeries,
    useChartTheme,
    handleChartRendering,
} from "@/utils/chart";

// importing for translation
import { useTranslation } from "@/components/translation/TranslationsProvider";

// importing types
import { MarketMetric } from "@/types/market";
import clsx from "clsx";

const HistoricalVolatility = ({ marketMetrics }: { marketMetrics: MarketMetric[] }) => {
    const { t } = useTranslation();
    const { theme } = useTheme();

    const historicalVolatilityContainer = useRef<any>();
    const historicalVolatilityChartRef: any = useRef();

    const [chartLegend, setChartLegend]: any = useState({
        totalMarketCap: true,
        volatilityCap: true,
        ninetyPer: true,
        tenPer: true,
    });

    const chartTheme = useChartTheme({
        leftPriceScale: false,
        rightPriceScale: false,
        theme,
        localization: {
            priceFormatter: (number: number) => formatNumber(number, 2, true, false, false) ?? "",
        },
    });

    useEffect(() => {
        const market_cap: any[] = [];
        const vol_index: any[] = [];
        const high_bar: any[] = [];
        const low_bar: any[] = [];

        if (marketMetrics?.length > 0) {
            for (const data of marketMetrics) {
                loopValueForCharts(data.DATE, data?.TOTAL_CRYPTO_MCAP, market_cap);

                loopValueForCharts(data.DATE, data.VOL_INDEX, vol_index);

                loopValueForCharts(data.DATE, data.VOL_90, high_bar);

                loopValueForCharts(data.DATE, data.VOL_10, low_bar);
            }

            let temp: any = document.getElementById("historical-volatility-container");

            if (temp) {
                temp.innerHTML = "";

                const hasTruthyValue = Object.values(chartLegend).some((value) => value);

                // Create and style the tooltip html element
                let toolTip: any = createTooltipBase("220px");
                if (hasTruthyValue) {
                    temp.appendChild(toolTip);
                }

                historicalVolatilityChartRef.current = createChart(historicalVolatilityContainer.current, chartTheme());

                // creating line or area colors
                let totalMarketCapColors = theme === "dark" ? "rgba(238, 238, 238, 1)" : "rgba(121, 121, 121, 1)";

                const areaSeries1 = createLineSeries(
                    historicalVolatilityChartRef.current,
                    chartLegend.totalMarketCap,
                    "left",
                    2,
                    totalMarketCapColors,
                    "rgba(0,0,0,0)",
                    "rgba(0,0,0,0)",
                );
                areaSeries1.setData(market_cap);

                const areaSeries2 = createLineSeries(
                    historicalVolatilityChartRef.current,
                    chartLegend.volatilityCap,
                    "right",
                    2,
                    "#DCAF1A",
                    "rgba(0,0,0,0)",
                    "rgba(0,0,0,0)",
                );
                areaSeries2.setData(vol_index);

                const areaSeries3 = createLineSeries(
                    historicalVolatilityChartRef.current,
                    chartLegend.ninetyPer,
                    "right",
                    2,
                    "#1DB66C",
                    "rgba(0,0,0,0)",
                    "rgba(0,0,0,0)",
                );
                areaSeries3.setData(high_bar);
                historicalVolatilityChartRef.current.applyOptions({ 
                    rightPriceScale: { visible: chartLegend.volatilityCap },
                    leftPriceScale: { 
                        visible: chartLegend.totalMarketCap ||  chartLegend.ninetyPer || chartLegend.tenPer
                    }
                });

                const areaSeries4 = createLineSeries(
                    historicalVolatilityChartRef.current,
                    chartLegend.tenPer,
                    "right",
                    2,
                    "#FF4242",
                    "rgba(0,0,0,0)",
                    "rgba(0,0,0,0)",
                );
                areaSeries4.setData(low_bar);

                areaSeries2.priceScale("right").applyOptions({
                    scaleMargins: {
                        top: 0.1,
                        bottom: 0,
                    },
                });

                // Add watermark
                addWatermark(temp);

                // applying time scale on x-axis
                applyTimeScaleOptions(historicalVolatilityChartRef.current.timeScale(), theme);

                historicalVolatilityChartRef.current.subscribeCrosshairMove(function (param: any) {
                    showHideTooltip(param, historicalVolatilityChartRef.current, toolTip);
                    if (toolTip.style.display === "block") {
                        const dateStr = dateToString(param.time);

                        const data = param.seriesData.get(areaSeries1);
                        let value = data?.value !== undefined ? data?.value : data?.close;

                        const data2 = param.seriesData.get(areaSeries2);
                        let value2 = data2?.value !== undefined ? data2?.value : data2?.close;

                        const data3 = param.seriesData.get(areaSeries3);
                        let value3 = data3?.value !== undefined ? data3?.value : data3?.close;

                        const data4 = param.seriesData.get(areaSeries4);
                        let value4 = data4?.value !== undefined ? data4?.value : data4?.close;

                        // creating array for tooltip values
                        const arrayValues = [
                            {
                                legend: chartLegend.totalMarketCap,
                                value: formatNumber(value, 2, true, false, false),
                                text: t("market:marketCap"),
                                sign: "",
                                colors: {
                                    light: "#000",
                                    dark: "#fff",
                                },
                            },
                            {
                                legend: chartLegend.volatilityCap,
                                value: formatNumber(value2, 2),
                                text: t("market:volatilityIndex"),
                                colors: {
                                    light: "#DCAF1A",
                                    dark: "",
                                },
                            },
                            {
                                legend: chartLegend.ninetyPer,
                                value: formatNumber(value3, 2),
                                text: t("market:90thPercentile"),
                                colors: {
                                    light: "#1DB66C",
                                    dark: "",
                                },
                            },
                            {
                                legend: chartLegend.tenPer,
                                value: formatNumber(value4, 2),
                                text: t("market:10thPercentile"),
                                colors: {
                                    light: "#FF4242",
                                    dark: "",
                                },
                            },
                        ];

                        // creating tooltip content
                        createTooltipForCharts(toolTip, dateStr, arrayValues);

                        // Position the tooltip
                        positionTooltip(param, toolTip, temp);
                    }
                });

                historicalVolatilityChartRef.current.timeScale().fitContent();
            }
        }
        // Delay for 500 milliseconds (adjust as needed)
    }, [historicalVolatilityContainer, theme, chartLegend, chartTheme, t, marketMetrics]);

    const toggleLegend = (key: string) => {
        setChartLegend((legendState: any) => ({
            ...legendState,
            [key]: !legendState[key],
        }));
    };

    return (
        <div className="flex relative flex-col w-full" data-testid="historical-volatility-container">
            {handleChartRendering(
                marketMetrics,
                <>
                    <div ref={historicalVolatilityContainer} id="historical-volatility-container" className="relative w-full" />
                    <div className="flex justify-center mx-auto flex-wrap mt-2">
                        <Button
                            type="button"
                            className={clsx("legendButton", chartLegend.totalMarketCap ? "" : "opacity-50")}
                            onClick={() => toggleLegend("totalMarketCap")}
                        >
                            <div className="h-[4px] w-[14px] bg-[#09090B] dark:bg-[#fff] mr-2 rounded-[4px]" />
                            <span>{t("market:marketCap")}</span>
                        </Button>
                        <Button
                            type="button"
                            className={clsx("legendButton", chartLegend.volatilityCap ? "" : "opacity-50")}
                            onClick={() => toggleLegend("volatilityCap")}
                        >
                            <div className="h-[4px] w-[14px] bg-[#DCAF1A] mr-2 rounded-[4px]" />
                            <span>{t("market:volatilityIndex")}</span>
                        </Button>
                        <Button
                            type="button"
                            className={clsx("legendButton", chartLegend.ninetyPer ? "" : "opacity-50")}
                            onClick={() => toggleLegend("ninetyPer")}
                        >
                            <div className="h-[4px] w-[14px] bg-[#1DB66C] mr-2 rounded-[4px]" />
                            <span>{t("market:90thPercentile")}</span>
                        </Button>
                        <Button
                            type="button"
                            className={clsx("legendButton", chartLegend.tenPer ? "" : "opacity-50")}
                            onClick={() => toggleLegend("tenPer")}
                        >
                            <div className="h-[4px] w-[14px] bg-[#FF4242] mr-2 rounded-[4px]" />
                            <span>{t("market:10thPercentile")}</span>
                        </Button>
                    </div>
                </>,
            )}
        </div>
    );
};

export default HistoricalVolatility;
