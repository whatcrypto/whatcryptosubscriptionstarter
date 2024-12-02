"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { createChart } from "lightweight-charts";
import { dateToString } from "@/utils/date";
import { convertToShortNum } from "@/utils/formatNumber";
import {
    addWatermark,
    applyTimeScaleOptions,
    loopValueForCharts,
    positionTooltip,
    showHideTooltip,
    createTooltipBase,
    createLineSeries,
    useChartTheme,
    handleChartRendering,
} from "@/utils/chart";
import { MarketMetric } from "@/types/market";
import { useTranslation } from "@/components/translation/TranslationsProvider";
import clsx from "clsx";

const GradeSignal = ({ data }: { data: MarketMetric[] }) => {
    const { t } = useTranslation();
    const { theme } = useTheme();

    const gradeSignalContainer = useRef<any>();
    const gradeSignalChartRef: any = useRef();

    const [chartLegend, setChartLegend]: any = useState({
        Bullish: true,
        Bearish: true,
    });

    const chartTheme = useChartTheme({
        leftPriceScale: true,
        rightPriceScale: false,
        theme,
        localization: {
            priceFormatter: convertToShortNum,
        },
    });

    useEffect(() => {
        function createTooltip(tooltipContainer: HTMLElement, dateStr: string, totalCryptoMarket: number) {
            let [markerType, markerValue]: any = "";

            markers.find((el: any) => {
                if (el.price === totalCryptoMarket) {
                    markerType = el.value;
                    markerValue = el.price;
                }
            });

            tooltipContainer.innerHTML = `  
            <div class="mb-[8px] px-[8px]">${dateStr}</div>
            <div class="px-[8px] border-b border-[#E7E9EC] dark:border-[#2F3037] ml-[-8px] mb-[5px]"></div>
    
            <div class="px-[8px]">
                <div class="inline-block">

                    <div class="inline-block h-[2px] w-[14px] mr-[4px] mb-[4px] pointer-events-none rounded-full bg-[#DCAF1A]" style="wordWrap:break-word; overflowWrap: break-word;"></div>

                    <div class="inline-block text-[#000] dark:text-[#fff]" style="line-height:27px;wordWrap:break-word; overflowWrap: break-word";">
                        ${t("market:totalCryptoMarketCap")} : <span>${convertToShortNum(totalCryptoMarket)}</span>
                    </div>
                </div>

                <div class="${markerValue !== undefined && markerType === "Bullish Signal" && chartLegend.Bullish ? "inline-block" : "hidden"}">

                    <div class="inline-block h-[14px] w-[14px] mr-[4px] mt-[8px] pointer-events-none rounded-full bg-[#52c41a]" style="wordWrap:break-word; overflowWrap: break-word;"></div>

                    <div class="inline-block text-[#000] dark:text-[#fff]" style="line-height:27px;wordWrap:break-word; overflowWrap: break-word";">
                        ${t("market:bullishMarket")} : <span>${convertToShortNum(markerValue)}</span>
                    </div>
                </div>

                <div class="${markerValue !== undefined && markerType === "Bearish Signal" && chartLegend.Bearish ? "inline-block" : "hidden"}">

                <div class="inline-block h-[14px] w-[14px] mr-[4px] mt-[8px] pointer-events-none rounded-full bg-[#ff4d4f]" style="wordWrap:break-word; overflowWrap: break-word;"></div>

                <div class="inline-block text-[#000] dark:text-[#fff]" style="line-height:27px;wordWrap:break-word; overflowWrap: break-word";">
                    ${t("market:bearishMarket")} : <span>${convertToShortNum(totalCryptoMarket)}</span>
                </div>

            </div>

            </div>
        `;
        }

        let dataRange = {
            min: Number.MAX_SAFE_INTEGER,
            max: Number.MIN_SAFE_INTEGER,
        };

        function loopingthroughArray(marketChartsData: any, gradeData: any, markers: any) {
            for (const data of marketChartsData) {
                loopValueForCharts(data.DATE, data.TOTAL_CRYPTO_MCAP, gradeData);

                if (data.TM_GRADE_SIGNAL === -1 && chartLegend.Bearish) {
                    markers.push({
                        value: "Bearish Signal",
                        price: data.TOTAL_CRYPTO_MCAP,
                        time: data.DATE,
                        position: "inBar",
                        color: "#e91e63",
                        shape: "circle",
                        size: 10 * 0.07,
                    });
                }

                if (data.TM_GRADE_SIGNAL === 1 && chartLegend.Bullish) {
                    markers.push({
                        value: "Bullish Signal",
                        price: data.TOTAL_CRYPTO_MCAP,
                        time: data.DATE,
                        position: "inBar",
                        color: "#52C41A",
                        shape: "circle",
                        size: 10 * 0.07,
                    });
                }
            }

            const values = [...gradeData.map((el: any) => el.value), ...markers.map((el: any) => el.price)];
            dataRange = {
                min: Math.min(dataRange.min, ...values),
                max: Math.max(dataRange.max, ...values),
            };
        }

        const gradeData: any = [];
        const markers: any = [];

        if (data?.length > 0) {
            loopingthroughArray(data, gradeData, markers);

            let temp: any = document.getElementById("grade-signal-container");

            if (temp) {
                temp.innerHTML = "";

                let toolTip: any = createTooltipBase("290px");
                temp.appendChild(toolTip);
                

                gradeSignalChartRef.current = createChart(gradeSignalContainer.current, chartTheme());

                let totalMarketBottomColor = theme === "dark" ? "#1a1a20" : "rgba(252, 225, 131, 0)";
                let totalMarketTopColor = theme === "dark" ? "#352e1f" : "rgba(252, 225, 131, 0.26)";

                const lineSeries = createLineSeries(
                    gradeSignalChartRef.current,
                    chartLegend.TMtotalMarketCap,
                    "left",
                    2,
                    "#DCAF1A",
                    totalMarketBottomColor,
                    totalMarketTopColor,
                );
                lineSeries.setData(gradeData);
                lineSeries.setMarkers(markers);

                lineSeries.priceScale("left").applyOptions({
                    autoScale: true,
                    scaleMargins: {
                        top: 0.2, // Adjusted top margin to prevent cutting off the topmost value
                        bottom: 0.1,
                    },
                });

                // Add watermark
                addWatermark(temp);

                applyTimeScaleOptions(gradeSignalChartRef.current.timeScale(), theme);

                gradeSignalChartRef.current.subscribeCrosshairMove(function (param: any) {
                    showHideTooltip(param, gradeSignalChartRef.current, toolTip);

                    if (toolTip.style.display === "block") {
                        const dateStr = dateToString(param.time);

                        const data = param.seriesData.get(lineSeries);
                        let totalCryptoMarket = data?.value !== undefined ? data?.value : data?.close;

                        createTooltip(toolTip, dateStr, totalCryptoMarket);

                        positionTooltip(param, toolTip, temp);
                    }
                });

                gradeSignalChartRef.current.timeScale().fitContent();
            }
        }
    }, [theme, chartLegend, chartTheme, t, data]);

    const toggleLegend = (key: string) => {
        setChartLegend((legendState: any) => ({
            ...legendState,
            [key]: !legendState[key],
        }));
    };

    return (
        <div className="flex relative flex-col w-full" data-testid="grade-signal-container">
            {handleChartRendering(
                data,
                <>
                    <div ref={gradeSignalContainer} id="grade-signal-container" className="relative w-full h-[300px]"></div>
                    <div className="flex justify-center mx-auto flex-wrap mt-2">
                        <Button type="button" className={clsx("legendButton", chartLegend.Bullish ? "" : "opacity-50")} onClick={() => toggleLegend("Bullish")}>
                            <div className="h-[7px] w-[7px] rounded-full bg-[#52c41a] mr-2 "></div>
                            <span>{t("market:bullishMarket")}</span>
                        </Button>
                        <Button type="button" className={clsx("legendButton", chartLegend.Bearish ? "" : "opacity-50")} onClick={() => toggleLegend("Bearish")}>
                            <div className="h-[7px] w-[7px] rounded-full bg-[#ff4d4f] mr-2 "></div>
                            <span>{t("market:bearishMarket")}</span>
                        </Button>
                    </div>
                </>,
            )}
        </div>
    );
};

export default GradeSignal;
