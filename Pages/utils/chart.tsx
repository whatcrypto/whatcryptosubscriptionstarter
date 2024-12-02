import { getMonthAbbreviation } from "@/utils/date";
import clsx from "clsx";
import {
  Background,
  ChartOptions,
  ColorType,
  DeepPartial,
  PriceFormat,
} from "lightweight-charts";
import { useCallback } from "react";

interface ChartThemeParams {
  leftPriceScale: boolean;
  rightPriceScale: boolean;
  theme: string | undefined;
  localization?: {
    priceFormatter: (number: number) => string;
  };
  leftPriceScaleMode?: number;
  extraOptions?: DeepPartial<ChartOptions>;
  height?: number; // Add height to the interface
}

export const useChartTheme = ({
  leftPriceScale,
  rightPriceScale,
  theme,
  localization,
  leftPriceScaleMode,
  extraOptions = {},
  height = 300,
}: ChartThemeParams) => {
  return useCallback(() => {
    return {
      height: height,
      rightPriceScale: {
        visible: rightPriceScale,
        ticksVisible: true,
        borderColor: theme === "dark" ? "#414249" : "#E6E9EF",
        entireTextOnly: true,
      },
      leftPriceScale: {
        visible: leftPriceScale,
        ticksVisible: true,
        borderColor: theme === "dark" ? "#414249" : "#E6E9EF",
        mode: leftPriceScaleMode ?? 0,
        entireTextOnly: true,
      },
      layout: {
        background: {
          type: ColorType.Solid,
          color: "transparent",
        } as Background,
        textColor: theme === "dark" ? "#A1A1AA" : "#71717A",
      },
      crosshair: {
        horzLine: {
          labelVisible: false,
        },
        vertLine: {
          labelVisible: false,
        },
      },
      grid: {
        horzLines: {
          color: "rgba(0,0,0,0)",
        },
        vertLines: {
          color: "rgba(0,0,0,0)",
        },
      },
      localization,
      ...extraOptions,
    };
  }, [
    rightPriceScale,
    theme,
    leftPriceScale,
    leftPriceScaleMode,
    localization,
    extraOptions,
    height,
  ]);
};

export function createTooltipBase(width: string): HTMLElement {
  const toolTip: HTMLElement = document.createElement("div");
  toolTip.classList.add(
    `w-[${width}]`,
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
    "box-shadow-tooltip",
  );
  return toolTip;
}

export function loopValueForCharts(date: any, value: any, arrayName: any[]) {
  if (value) {
    arrayName.push({
      time: date,
      value: value,
    });
  }
  return arrayName;
}

// creating line series
export function createLineSeries(
  container: any,
  legend: string | boolean,
  priceScaleId: string,
  lineWidth: number,
  lineColor: string,
  bottomColor: string,
  topColor: string,
  priceFormatter?: Partial<PriceFormat>,
) {
  return container.addAreaSeries({
    visible: legend,
    priceScaleId: priceScaleId,
    lineColor: lineColor,
    lineWidth: lineWidth,
    bottomColor: bottomColor,
    topColor: topColor,
    priceFormat: priceFormatter,
  });
}
export function createBaselineSeries({
  container,
  ...restParams
}: {
  container: any;
  legend: string | boolean;
  priceScaleId: string;
  baseValue: any;
  topLineColor?: string;
  topFillColor1?: string;
  topFillColor2?: string;
  bottomLineColor?: string;
  bottomFillColor1?: string;
  bottomFillColor2?: string;
  lineWidth?: number;
}) {
  return container.addBaselineSeries(restParams);
}

// creating candle series
export function createCandlestickSeries(
  container: any,
  upColor: string,
  downColor: string,
  wickUpColor: string,
  wickDownColor: string,
  borderVisible: boolean,
) {
  return container.addCandlestickSeries({
    upColor: upColor,
    downColor: downColor,
    wickUpColor: wickUpColor,
    wickDownColor: wickDownColor,
    borderVisible: borderVisible,
  });
}

// setting x-axis for time scale formatting and important properties
export function applyTimeScaleOptions(
  timeScale: any,
  theme: string | undefined,
) {
  try {
    timeScale.applyOptions({
      borderColor: theme === "dark" ? "#414249" : "#E6E9EF",
      visible: true,
      timeVisible: true,
      ticksVisible: true,
      rightOffset: 0,
      fixLeftEdge: true,
      fixRightEdge: true,
      tickMarkFormatter: (time: any) => {
        const dateObject = new Date(time);
        const formattedDate = `${dateObject.getDate()} ${getMonthAbbreviation(dateObject)} ${dateObject.getFullYear().toString().slice(-2)}`;
        return `${formattedDate}`;
      },
    });
  } catch (error) {
    global.console.error("Failed to apply time scale options", error);
  }
}

// adding watermark in charts
export function addWatermark(container: HTMLElement) {
  const watermark = document.createElement("div");
  watermark.className = "watermark";
  container.appendChild(watermark);
}

export function showHideTooltip(
  param: any,
  chartContainer: HTMLElement,
  toolTip: HTMLElement,
) {
  if (
    param === undefined ||
    param.time === undefined ||
    param.point.x < 0 ||
    param.point.x > chartContainer?.clientWidth ||
    param.point.y < 0 ||
    param.point.y > chartContainer?.clientWidth
  ) {
    toolTip.style.display = "none";
  } else {
    toolTip.style.display = "block";
  }
}

export function createTooltipForCharts(
  tooltipContainer: HTMLElement,
  dateStr: string,
  arrayValue: any[],
) {
  tooltipContainer.innerHTML = `  
        <div class="mb-[8px] px-[8px]">${dateStr}</div>
        <div class="px-[8px] border-b border-[#E7E9EC] dark:border-[#2F3037] ml-[-8px] mb-[5px]"></div>

        <div class="px-[8px]">
            ${arrayValue
              .filter(
                (item) =>
                  item.legend !== false &&
                  item.value !== undefined &&
                  item.value !== null,
              )
              .map(
                (item) => `
                <div>
                    <div class="inline-block h-[2px] w-[14px] mr-[4px] mb-[4px] bg-[${item?.colors?.light}] dark:bg-[${
                      item?.colors?.dark
                    }] rounded-full pointer-events-none" style="word-wrap:break-word; overflow-wrap: break-word;"></div>
                    <div class="inline text-[14px] text-[#000] dark:text-[#fff]" style="line-height:27px;word-wrap:break-word; overflow-wrap: break-word;">  
                        ${item?.text} : <span class="text-[#000] dark:text-[#fff]">${item?.sign === "$" ? "$" : ""}${item?.value}${
                          item?.sign === "%" ? "%" : ""
                        }</span>
                    </div>
                    <br style="display:inline-block">
                </div>
            `,
              )
              .join("")}
        </div>
    `;
}

export function positionTooltip(
  param: any,
  tooltipContainer: HTMLElement,
  chartContainer: HTMLElement,
) {
  // positioning the tooltip
  let top = param.point.y;
  let left = param.point.x;
  if (left > chartContainer?.offsetWidth - tooltipContainer?.offsetWidth) {
    left = chartContainer?.offsetWidth - tooltipContainer?.offsetWidth;
  }
  tooltipContainer.style.left = left + "px";
  tooltipContainer.style.top = top + "px";
}

export function handleChartRendering(
  chartData: any,
  children: React.ReactNode,
  className: string = "",
) {
  return (
    <>
      {chartData?.length > 0 ? (
        children
      ) : (
        <div
          className={clsx(
            "flex h-[300px] items-center justify-center",
            className,
          )}
        >
          <span className="text-[14px] text-[#71717A] dark:text-[#A1A1AA]">
            Not enough data available to create the graph.
          </span>
        </div>
      )}
    </>
  );
}

export function destroyChart(chartContainer: any) {
  if (chartContainer) {
    try {
      chartContainer?.remove();
      chartContainer = null;
    } catch (error) {
      global.console.log("Chart Unrendering Error :", error);
    }
  }
}
