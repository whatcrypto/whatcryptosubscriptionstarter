"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import clsx from "clsx";

// importing ui components
import { Button } from "@/components/ui/button";

// importing chart library
import { createChart } from "lightweight-charts";

// importing functions
import { dateToString } from "@/utils/date";
import { convertToShortNum, formatNumber, customFormatting } from "@/utils/formatNumber";

// importing charts functions
import {
    addWatermark,
    applyTimeScaleOptions,
    createTooltipForCharts,
    loopValueForCharts,
    positionTooltip,
    showHideTooltip,
    createLineSeries,
    useChartTheme,
    handleChartRendering,
} from "@/utils/chart";

// importing for translation
import { useTranslation } from "@/components/translation/TranslationsProvider";
import { MarketMetric } from "@/types/market";

const BullishTMGrades = ({ data }: { data: MarketMetric[] }) => {
    const { t } = useTranslation();
    const { theme } = useTheme();

    const bullishGradeContainer = useRef<HTMLDivElement>(null!);
    const bullishGradeChartRef: any = useRef();

    const [chartLegend, setChartLegend] = useState({
        totalCryptoMarketCap: true,
        percentofBullishGrades: false,
    });

    const chartTheme = useChartTheme({
        leftPriceScale: chartLegend?.totalCryptoMarketCap,
        rightPriceScale: chartLegend?.percentofBullishGrades,
        theme,
        // localization: {
        //     priceFormatter: (number) => {
        //         if (number?.toString()?.split(".")[0]?.length === 1 || number?.toString()?.split(".")[0]?.length === 2 || number?.toString()?.split(".")[0]?.length === 3) {
        //             return customFormatting(number, false, 2) || "";
        //         } else {
        //             return convertToShortNum(number);
        //         }
        //     },
        // },
    });

    useEffect(() => {
        function loopthroughArray(marketChartsData: any, percentChart: any, percentagesData: any) {
            for (const data of marketChartsData) {
                // looping data for chart
                loopValueForCharts(data.DATE, data.TOTAL_CRYPTO_MCAP, percentChart);

                // looping data for chart
                loopValueForCharts(data.DATE, data.TM_GRADE_PERC_HIGH_COINS, percentagesData);
            }
        }

        // starting point of useEffect
        const percentChart: any = [];
        const percentagesData: any = [];

        if (data?.length > 0) {
            // looping through Array data and passing variables
            loopthroughArray(data, percentChart, percentagesData);

            let temp: any = document.getElementById("bullish_grade_chart_container");

            if (temp) {
                temp.innerHTML = "";

                const hasTruthyValue = Object.values(chartLegend).some((value) => value);

                // Create and style the tooltip html element
                let toolTip: any = document.createElement("div");
                if (hasTruthyValue) {
                    toolTip.classList.add(
                        `w-[300px]`,
                        `h-[auto]`,
                        `bg-[#fff]`,
                        `dark:bg-[#1a1a20]`,
                        `border`,
                        `border-[#E6E9EF]`,
                        `dark:border-[#414249]`,
                        `text-[#000]`,
                        `dark:text-[#fff]`,
                        `overflow-hidden`,
                        `absolute`,
                        `py-[8px]`,
                        `text-[14px]`,
                        `text-left`,
                        `z-[18]`,
                        `rounded-[4px]`,
                        `pointer-events-none`,
                        `hidden`,
                    );
                    toolTip.style = `box-shadow:5px 11px 70px rgba(18, 18, 18, 0.08);`;
                    temp.appendChild(toolTip);
                }

                bullishGradeChartRef.current = createChart(bullishGradeContainer.current, chartTheme());

                const lineSeries2 = createLineSeries(
                    bullishGradeChartRef.current,
                    chartLegend.percentofBullishGrades,
                    "right",
                    2,
                    "#DCAF1A",
                    theme === "dark" ? "#1a1a20" : "rgba(252, 225, 131, 0)",
                    theme === "dark" ? "#352e1f" : "rgba(252, 225, 131, 0.26)",
                    { 
                        type: 'percent',
                    }
                );
                lineSeries2.setData(percentagesData);

                const lineSer = createLineSeries(
                    bullishGradeChartRef.current,
                    chartLegend.totalCryptoMarketCap,
                    "left",
                    2,
                    theme === "dark" ? "rgba(238, 238, 238, 1)" : "rgba(121, 121, 121, 1)",
                    "rgba(0,0,0,0)",
                    "rgba(0,0,0,0)",
                    { 
                        type: 'custom',
                        formatter:  (number: number) => {
                            if (number?.toString()?.split(".")[0]?.length === 2 || number?.toString()?.split(".")[0]?.length === 3) {
                                return customFormatting(number, true, 2) || "";
                            } else {
                                return convertToShortNum(number);
                            }
                        }
                    }
                );
                lineSer.setData(percentChart);

                // Add watermark
                addWatermark(temp);

                // applying time scale on x-axis
                applyTimeScaleOptions(bullishGradeChartRef.current.timeScale(), theme);

                bullishGradeChartRef.current.subscribeCrosshairMove(function (param: any) {
                    // checking condition for tooltip
                    showHideTooltip(param, bullishGradeChartRef.current, toolTip);
                    if (toolTip.style.display === "block") {
                        const dateStr = dateToString(param.time);

                        const data = param.seriesData.get(lineSer);
                        let totalCryptoMarket = data?.value !== undefined ? data?.value : data?.close;

                        const data2 = param.seriesData.get(lineSeries2);
                        let bullishTMGrades = data2?.value !== undefined ? data2?.value : data2?.close;

                        // creating array for tooltip values
                        const arrayValues = [
                            {
                                legend: chartLegend.totalCryptoMarketCap,
                                value: chartLegend.totalCryptoMarketCap ? convertToShortNum(totalCryptoMarket) : null,
                                text: t("market:totalCryptoMarketCap"),
                                sign: "",
                                colors: {
                                    light: "#000",
                                    dark: "#fff",
                                },
                            },
                            {
                                legend: chartLegend.percentofBullishGrades,
                                value: chartLegend.percentofBullishGrades ? formatNumber(bullishTMGrades, 2) : null,
                                text: t("market:percentofBullishTMGrades"),
                                sign: "%",
                                colors: {
                                    light: "#DCAF1A",
                                    dark: "",
                                },
                            },
                        ].filter((item) => item.value !== null);

                        // creating tooltip content
                        createTooltipForCharts(toolTip, dateStr, arrayValues);

                        // Position the tooltip automatically
                        positionTooltip(param, toolTip, temp);
                    }
                });

                bullishGradeChartRef.current.timeScale().fitContent();
            }
        }
    }, [bullishGradeContainer, theme, chartLegend, chartTheme, t, data]);

    return (
        <div className="flex relative flex-col w-full" data-testid="bullish-grade-chart-container">
            {handleChartRendering(
                data,
                <>
                    <div 
                        ref={bullishGradeContainer} 
                        id="bullish_grade_chart_container" 
                        className={
                            clsx(
                                "relative w-full",
                                !chartLegend.totalCryptoMarketCap && "pl-[20px]",
                                !chartLegend.percentofBullishGrades && "pr-[20px]",
                            )
                        }
                    />
                    <div className="flex justify-center mx-auto flex-wrap mt-2">
                        <Button
                            type="button"
                            className={clsx("legendButton", chartLegend.totalCryptoMarketCap ? "" : "opacity-50")}
                            onClick={() => {
                                setChartLegend((legendState: any) => ({
                                    ...legendState,
                                    ...{ totalCryptoMarketCap: !legendState.totalCryptoMarketCap },
                                }));
                            }}
                        >
                            <div className="h-[4px] w-[14px] bg-[#09090B] dark:bg-[#fff] mr-2 rounded-[4px]"></div>
                            <span>{t("market:totalCryptoMarketCap")}</span>
                        </Button>
                        <Button
                            type="button"
                            className={clsx("legendButton", chartLegend.percentofBullishGrades ? "" : "opacity-50")}
                            onClick={() => {
                                setChartLegend((legendState: any) => ({
                                    ...legendState,
                                    ...{ percentofBullishGrades: !legendState.percentofBullishGrades },
                                }));
                            }}
                        >
                            <div className="h-[4px] w-[14px] bg-[#DCAF1A] mr-2 rounded-[4px]"></div>
                            <span>{t("market:percentofBullishTMGrades")}</span>
                        </Button>
                    </div>
                </>,
            )}
        </div>
    );
};

export default BullishTMGrades;
