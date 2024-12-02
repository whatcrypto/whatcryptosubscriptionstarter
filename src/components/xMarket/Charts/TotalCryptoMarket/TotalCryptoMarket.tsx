"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";

// importing ui components
import { Button } from "@/components/ui/button";

// importing chart library
import { createChart } from "lightweight-charts";

// importing functions
import { dateToString } from "@/utils/date";
import { convertToShortNum, formatNumber } from "@/utils/formatNumber";

// importing charts functions
import {
    addWatermark,
    applyTimeScaleOptions,
    loopValueForCharts,
    positionTooltip,
    showHideTooltip,
    createTooltipForCharts,
    createTooltipBase,
    createLineSeries,
    useChartTheme,
    handleChartRendering,
} from "@/utils/chart";

// importing for translation
import { useTranslation } from "@/components/translation/TranslationsProvider";
import { MarketMetric } from "@/types/market";
import clsx from "clsx";

const TotalCryptoMarket = ({ marketMetrics }: { marketMetrics: MarketMetric[] }) => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const [width, height] = [900, 450];

    const totalCryptoContainer = useRef<any>();
    const totalCryptoChartRef: any = useRef();

    const [chartLegend, setChartLegend]: any = useState({
        cryptoCap: true,
        altCoin: true,
        bitcoin: true,
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
        // creating loop to pass through data
        function loopingthroughArray(marketMetrics: MarketMetric[], totalMarketCapChart: any, alts_cap: any, btc_cap: any, signalGreen: any, signalRed: any) {
            for (const data of marketMetrics) {
                loopValueForCharts(data.DATE, data.TOTAL_CRYPTO_MCAP, totalMarketCapChart);

                loopValueForCharts(data.DATE, data.ALTS_MARKET_CAP, alts_cap);

                loopValueForCharts(data.DATE, data.BTC_MARKET_CAP, btc_cap);

                if (data.RECT_SIGNAL) {
                    signalGreen.push({
                        time: data.DATE,
                        value: data.RECT_SIGNAL >= 0 ? 1 : 0,
                    });
                    signalRed.push({
                        time: data.DATE,
                        value: data.RECT_SIGNAL < 0 ? 1 : 0,
                    });
                }
            }
        }

        // useEffect start from here
        const totalMarketCapChart: any = [];
        const alts_cap: any = [];
        const btc_cap: any = [];
        const signalGreen: any = [];
        const signalRed: any = [];

        if (marketMetrics?.length > 0) {
            // looping through Array data and passing variables
            loopingthroughArray(marketMetrics, totalMarketCapChart, alts_cap, btc_cap, signalGreen, signalRed);

            let temp: any = document.getElementById("total-crypto-market-container");

            if (temp) {
                temp.innerHTML = "";

                const hasTruthyValue = Object.values(chartLegend).some((value) => value);

                // Create and style the tooltip html element
                let toolTip: any = createTooltipBase("250px");
                if (hasTruthyValue) {
                    temp.appendChild(toolTip);
                }

                totalCryptoChartRef.current = createChart(totalCryptoContainer.current, chartTheme());

                // Creating theme colors
                let signalGreenColor = theme === "dark" ? "#1b3930" : "#d2f0e2";
                let signalRedColor = theme === "dark" ? "#482227" : "#ffd9d9";
                let lineSeriesColor = theme === "dark" ? "#fff" : "#09090B";

                const areaSeries = createLineSeries(totalCryptoChartRef.current, "true", "right", 0, signalGreenColor, signalGreenColor, signalGreenColor);
                areaSeries.setData(signalGreen);

                const areaSeries2 = createLineSeries(totalCryptoChartRef.current, "true", "right", 0, signalRedColor, signalRedColor, signalRedColor);
                areaSeries2.setData(signalRed);

                areaSeries2.priceScale("right").applyOptions({
                    scaleMargins: {
                        top: 0.1,
                        bottom: 0,
                    },
                });

                const lineSeries = createLineSeries(
                    totalCryptoChartRef.current,
                    chartLegend.cryptoCap,
                    "left",
                    2,
                    lineSeriesColor,
                    "rgba(0,0,0,0)",
                    "rgba(0,0,0,0)",
                );
                lineSeries.setData(totalMarketCapChart);

                const lineSeries2 = createLineSeries(totalCryptoChartRef.current, chartLegend.altCoin, "left", 2, "#1DB66C", "rgba(0,0,0,0)", "rgba(0,0,0,0)");
                lineSeries2.setData(alts_cap);

                const lineSeries3 = createLineSeries(totalCryptoChartRef.current, chartLegend.bitcoin, "left", 2, "#DCAF1A", "rgba(0,0,0,0)", "rgba(0,0,0,0)");
                lineSeries3.setData(btc_cap);

                // Add watermark
                addWatermark(temp);

                // applying time scale on x-axis
                applyTimeScaleOptions(totalCryptoChartRef.current.timeScale(), theme);

                totalCryptoChartRef.current.subscribeCrosshairMove(function (param: any) {
                    showHideTooltip(param, totalCryptoChartRef.current, toolTip);
                    if (toolTip.style.display === "block") {
                        const dateStr = dateToString(param.time);

                        const data = param.seriesData.get(lineSeries);
                        let totalCryptoMarket = data?.value !== undefined ? data?.value : data?.close;

                        const data2 = param.seriesData.get(lineSeries2);
                        let altMarketCap = data2?.value !== undefined ? data2?.value : data2?.close;

                        const data3 = param.seriesData.get(lineSeries3);
                        let bitMarketCap = data3?.value !== undefined ? data3?.value : data3?.close;

                        // creating array for tooltip values
                        const arrayValues = [
                            {
                                legend: chartLegend.cryptoCap,
                                value: formatNumber(totalCryptoMarket, 2, true, false, false),
                                text: t("market:totalMarketCap"),
                                sign: "",
                                colors: {
                                    light: "#000",
                                    dark: "#fff",
                                },
                            },
                            {
                                legend: chartLegend.altCoin,
                                value: formatNumber(altMarketCap, 2, true, false, false),
                                text: t("market:altcoinMarketCap"),
                                colors: {
                                    light: "#1DB66C",
                                    dark: "",
                                },
                            },
                            {
                                legend: chartLegend.bitcoin,
                                value: formatNumber(bitMarketCap, 2, true, false, false),
                                text: t("market:btcMatrketCap"),
                                colors: {
                                    light: "#DCAF1A",
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

                totalCryptoChartRef.current.timeScale().fitContent();
            }
        }
        // Delay for 500 milliseconds (adjust as needed)
    }, [totalCryptoContainer, theme, chartLegend, height, width, chartTheme, t, marketMetrics]);

    const toggleLegend = (key: string) => {
        setChartLegend((legendState: any) => ({
            ...legendState,
            [key]: !legendState[key],
        }));
    };

    return (
        <div className="flex relative flex-col w-full" data-testid="total-crypto-market-container">
            {handleChartRendering(
                marketMetrics,
                <>
                    <div ref={totalCryptoContainer} id="total-crypto-market-container" className="relative w-full" />
                    <div className="flex justify-center mx-auto flex-wrap mt-2">
                        <Button
                            type="button"
                            className={clsx("legendButton", chartLegend.cryptoCap ? "" : "opacity-50")}
                            onClick={() => toggleLegend("cryptoCap")}
                        >
                            <div className="h-[4px] w-[14px] bg-[#09090B] dark:bg-[#fff] mr-2 rounded-[4px]" />
                            <span>{t("market:totalMarketCap")}</span>
                        </Button>

                        <Button
                            type="button"
                            className={clsx("legendButton", chartLegend.altCoin ? "" : "opacity-50")}
                            onClick={() => toggleLegend("altCoin")}>
                            <div className="h-[4px] w-[14px] bg-[#1DB66C] mr-2 rounded-[4px]" />
                            <span>{t("market:altcoinMarketCap")}</span>
                        </Button>
                        <Button
                            type="button"
                            className={clsx("legendButton", chartLegend.bitcoin ? "" : "opacity-50")}
                            onClick={() => toggleLegend("bitcoin")}>
                            <div className="h-[4px] w-[14px] bg-[#DCAF1A] mr-2 rounded-[4px]" />
                            <span>{t("market:btcMatrketCap")}</span>
                        </Button>
                    </div>
                </>,
            )}
        </div>
    );
};

export default TotalCryptoMarket;
