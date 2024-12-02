"use client";

import Image from "next/image";

// importing ui
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as Tooltip from "@/components/ui/tooltip";
import clsx from "clsx";

// importing library
import scrollIntoView from "scroll-into-view";

// importing custom functions
import SortingContainer from "@/components/TableFilters/SortContainer";
import tokenLogo from "@/lib/tokenLogo";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/utils/formatNumber";

// importing multilanguage
import { useTranslation } from "@/components/translation/TranslationsProvider";

// importing icons
import { FaInfoCircle } from "react-icons/fa";
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoMdArrowDown,
  IoMdArrowDropdown,
  IoMdArrowDropup,
  IoMdArrowForward,
  IoMdArrowUp,
} from "react-icons/io";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

export const renderHeader = (
  column: any,
  columnName: string,
  sortable: boolean = true,
): React.ReactNode => {
  const content = renderColumn(columnName);
  return (
    <>
      {sortable ? (
        <SortingContainer column={column} className="w-20">
          {content}
        </SortingContainer>
      ) : (
        <>{content}</>
      )}
    </>
  );
};

export const renderColumn = (value: any): React.ReactNode => {
  return <span className="text-[15px] font-[400]">{value}</span>;
};

export const renderColumnBadge = (
  value: any,
  factor?: number,
): React.ReactNode => {
  let badgeVariant: "secondary" | "success" | "danger" = "secondary";
  const trigger = factor ?? value;
  if (trigger > 0) {
    badgeVariant = "success";
  } else if (trigger < 0) {
    badgeVariant = "danger";
  }
  return (
    <div className="flex items-center">
      <Badge
        variant={badgeVariant}
        className={cn(
          "mx-0 flex h-[30px] w-auto items-center justify-center rounded-[4px] px-1 text-[15px] font-normal",
          value === null && "ml-[26px]",
        )}
      >
        {value !== null
          ? formatNumber(Number(value), 2, true, true, false)
          : "-"}
      </Badge>
      {trigger > 0 && (
        <IoMdArrowUp className={`ml-[7px] text-[15px] text-[#1DB66C]`} />
      )}
      {trigger < 0 && (
        <IoMdArrowDown className={`ml-[7px] text-[15px] text-[#FF4242]`} />
      )}
    </div>
  );
};

export const renderColumnGradeCell = (value: any): React.ReactNode => {
  return (
    <div className="flex items-center">
      {value !== null ? (
        <>
          <Badge
            variant={value >= 0 ? "success" : "danger"}
            className="mr-1 h-[18px] w-[16px] rounded-full p-0"
          >
            {value >= 0 ? (
              <IoMdArrowDropup className="text-[14px]" />
            ) : (
              <IoMdArrowDropdown className="text-[14px]" />
            )}
          </Badge>
          <span
            className={`mx-2 inline-block text-[15px] ${value >= 0 ? "text-[#1DB66C]" : "text-[#FF4242]"}`}
          >
            {value}%
          </span>
        </>
      ) : (
        <span className={`mx-2 ml-[20px] inline-block text-[15px]`}>-</span>
      )}
    </div>
  );
};

export const renderColumnBars = (
  SECTOR_GAINERS: any,
  SECTOR_LOSERS: any,
): React.ReactNode => {
  const renderBar = (percent: any, color: string) => (
    <div
      className={`bg-[${color}] h-[8px] rounded-[4px]`}
      style={{ width: `${percent}%` }}
    ></div>
  );

  const loserPercent = formatNumber(
    (SECTOR_LOSERS / (SECTOR_GAINERS + SECTOR_LOSERS)) * 100,
    0,
  );
  const gainerPercent = formatNumber(
    (SECTOR_GAINERS / (SECTOR_GAINERS + SECTOR_LOSERS)) * 100,
    0,
  );

  const validGainerPercent = gainerPercent ?? 0; //
  const validLoserPercent = loserPercent ?? 0;

  return (
    <div className="w-full">
      <div className="flex h-[8px] w-full items-center justify-between rounded-[4px] bg-[#e7e9ec] dark:bg-[#2f3037]">
        {validGainerPercent !== "" && renderBar(validGainerPercent, "#1DB66C")}
        {validLoserPercent !== "" && renderBar(validLoserPercent, "#FF4242")}
      </div>
      <div className="mt-[4px] flex justify-between">
        <span className="text-[14px] font-[400]">
          {SECTOR_GAINERS} ({gainerPercent}%)
        </span>
        <span className="text-[14px] font-[400]">
          ({loserPercent}%) {SECTOR_LOSERS}
        </span>
      </div>
    </div>
  );
};

export const NameCell = (
  cg_id: string,
  tokenName: string,
  tokenSymbol: string,
): React.ReactNode => {
  return (
    <div className="flex">
      <Image
        src={tokenLogo(cg_id)}
        alt={cg_id}
        className="h-[20px] w-[20px]"
        height={20}
        width={20}
        onError={(e: any) => (e.target.style.visibility = "hidden")}
      />
      <span className="mx-0 flex items-start truncate text-[15px]">
        <span className="ml-[10px] mr-[6px] hidden max-w-[150px] truncate sm:inline-block">
          {tokenName}
        </span>
        <span className="inline-block text-[15px] text-[#71717A] dark:text-[#A1A1AA]">
          {tokenSymbol?.toUpperCase()}
        </span>
      </span>
    </div>
  );
};

export const renderValueWithTooltip = (
  trigger: React.ReactNode,
  message: React.ReactNode,
): React.ReactNode => {
  return (
    <Tooltip.Tooltip delayDuration={300}>
      <Tooltip.TooltipTrigger>{trigger}</Tooltip.TooltipTrigger>
      <Tooltip.TooltipPortal>
        <Tooltip.TooltipContent>
          <p className="font-normal">{message}</p>
        </Tooltip.TooltipContent>
      </Tooltip.TooltipPortal>
    </Tooltip.Tooltip>
  );
};
export const TablePagination = (
  transactionsTable: any,
  closeList: any = () => {},
  tokenDetails: boolean = false,
): React.ReactNode => {
  const { t } = useTranslation();
  const scrollToFirstRow = () => {
    // Scroll to the first row when pagination is clicked
    setTimeout(() => {
      const scrollFirstRow: any = document.querySelector(".scrollFirst");
      if (scrollFirstRow) {
        scrollIntoView(scrollFirstRow, { time: 0 });
      }
    }, 100);
  };
  return (
    <div
      className={clsx(
        "flex border-t border-[#E7E9EC] bg-[#fff] px-2 py-2 dark:border-[#2F3037] dark:bg-[#1a1a20] sm:px-4",
        tokenDetails
          ? "justify-end sm:justify-between md:h-[60px] md:items-center"
          : "items-center justify-end sm:h-[60px]",
      )}
    >
      {tokenDetails && (
        <button
          className="mt-2 hidden h-[20px] w-[80px] border-b border-dotted border-[#FFCF30] text-[13px] font-[400] text-[#FFCF30] sm:inline-block md:mt-0"
          onClick={closeList}
        >
          {t("tokenDetails:viewLess")}
        </button>
      )}
      <div
        className={clsx(
          tokenDetails ? "md:flex-row" : "sm:flex-row",
          "flex flex-col items-center",
        )}
      >
        {tokenDetails && (
          <button
            className="mb-3 ml-auto mt-2 inline-block h-[20px] w-[80px] border-b border-dotted border-[#FFCF30] text-[13px] font-[400] text-[#FFCF30] sm:hidden"
            onClick={closeList}
          >
            {t("tokenDetails:viewLess")}
          </button>
        )}
        <div
          className={clsx(
            "mb-2 ml-auto flex",
            tokenDetails ? "md:mb-0 md:ml-0" : "sm:mb-0 sm:ml-0",
          )}
        >
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">{t("common:rowsPerPage")}</p>
            <Select
              value={`${transactionsTable.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                transactionsTable.setPageSize(Number(value));
                scrollToFirstRow();
              }}
            >
              <SelectTrigger
                className="h-8 w-[70px]"
                aria-label={t("common:rowsPerPage")}
              >
                <SelectValue
                  placeholder={transactionsTable.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent
                side="top"
                className="w-[90px] min-w-[90px]"
                ref={(ref) => {
                  if (!ref) return;

                  ref.ontouchstart = (e) => {
                    e.preventDefault();
                  };
                }}
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className={`ml-0 flex space-x-2 ${"flex-row items-center"}`}>
          <div
            className={`flex w-[100px] items-center justify-center text-sm font-medium sm:mx-[13px] md:mx-[25px] xl:mx-[50px]`}
          >
            {t("common:Page")}{" "}
            {transactionsTable.getState().pagination.pageIndex + 1}{" "}
            {t("common:of")} {transactionsTable.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={`${!transactionsTable.getCanPreviousPage() ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              <Button
                variant="outline"
                className="flex h-9 w-9 border border-[#E7E9EC] p-0 dark:border-[#414249] dark:bg-[#1a1a20]"
                onClick={() => {
                  transactionsTable.setPageIndex(0);
                  scrollToFirstRow();
                }}
                disabled={!transactionsTable.getCanPreviousPage()}
                aria-label={t("common:firstRow")}
              >
                <MdKeyboardDoubleArrowLeft
                  className={`h-[18px] w-[18px] ${!transactionsTable.getCanPreviousPage() && "text-[#E6E9EF] dark:text-[#414249]"}`}
                />
              </Button>
            </div>
            <div
              className={`${!transactionsTable.getCanPreviousPage() ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              <Button
                variant="outline"
                className="h-9 w-9 border border-[#E7E9EC] p-0 dark:border-[#414249] dark:bg-[#1a1a20]"
                onClick={() => {
                  transactionsTable.previousPage();
                  scrollToFirstRow();
                }}
                disabled={!transactionsTable.getCanPreviousPage()}
                aria-label={t("common:previousRow")}
              >
                <IoIosArrowBack
                  className={`h-[14x] w-[14px] ${!transactionsTable.getCanPreviousPage() && "text-[#E6E9EF] dark:text-[#414249]"}`}
                />
              </Button>
            </div>
            <div
              className={`${!transactionsTable.getCanNextPage() ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              <Button
                variant="outline"
                className="h-9 w-9 border border-[#E7E9EC] p-0 dark:border-[#414249] dark:bg-[#1a1a20]"
                onClick={() => {
                  transactionsTable.nextPage();
                  scrollToFirstRow();
                }}
                disabled={!transactionsTable.getCanNextPage()}
                aria-label={t("common:nextRow")}
              >
                <IoIosArrowForward
                  className={`h-[14px] w-[14px] ${!transactionsTable.getCanNextPage() && "text-[#E6E9EF] dark:text-[#414249]"}`}
                />
              </Button>
            </div>
            <div
              className={`${!transactionsTable.getCanNextPage() ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              <Button
                variant="outline"
                className="flex h-9 w-9 border border-[#E7E9EC] p-0 dark:border-[#414249] dark:bg-[#1a1a20]"
                onClick={() => {
                  transactionsTable.setPageIndex(
                    transactionsTable.getPageCount() - 1,
                  );
                  scrollToFirstRow();
                }}
                disabled={!transactionsTable.getCanNextPage()}
                aria-label={t("common:lastRow")}
              >
                <MdKeyboardDoubleArrowRight
                  className={`h-[18px] w-[18px] ${!transactionsTable.getCanNextPage() && "text-[#E6E9EF] dark:text-[#414249]"}`}
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ITMGradeCell {
  stableCoin: any;
  gradeValue: any;
  dailyPercentChange: any;
  tokenId: any;
  idExist: any;
}

export const TMGradeCell: React.FC<ITMGradeCell> = ({
  stableCoin,
  gradeValue,
  dailyPercentChange,
  tokenId,
  idExist,
}) => {
  const { t } = useTranslation();
  let badgeVariant:
    | "secondary"
    | "success"
    | "danger"
    | "lessSuccess"
    | "neutral"
    | "lessDanger" = "secondary";
  if (gradeValue > 80) {
    badgeVariant = "success";
  } else if (gradeValue > 60 && gradeValue <= 80) {
    badgeVariant = "lessSuccess";
  } else if (gradeValue > 40 && gradeValue <= 60) {
    badgeVariant = "neutral";
  } else if (gradeValue > 20 && gradeValue <= 40) {
    badgeVariant = "lessDanger";
  } else if (gradeValue >= 0 && gradeValue <= 20) {
    badgeVariant = "danger";
  }

  return (
    <div className="flex items-center">
      {stableCoin === 1 ? (
        <div>
          N/A&nbsp;
          <Tooltip.Tooltip delayDuration={300}>
            <Tooltip.TooltipTrigger>
              <FaInfoCircle />
            </Tooltip.TooltipTrigger>
            <Tooltip.TooltipPortal>
              <Tooltip.TooltipContent className="w-[250px]">
                {t("rating:tmGradeForStablecoin")}
              </Tooltip.TooltipContent>
            </Tooltip.TooltipPortal>
          </Tooltip.Tooltip>
        </div>
      ) : !gradeValue || gradeValue === 0 ? (
        <div>
          N/A&nbsp;
          <Tooltip.Tooltip delayDuration={300}>
            <Tooltip.TooltipTrigger>
              <FaInfoCircle />
            </Tooltip.TooltipTrigger>
            <Tooltip.TooltipPortal>
              <Tooltip.TooltipContent className="w-[250px]">
                {idExist[tokenId] !== null && idExist[tokenId] !== undefined
                  ? t("rating:notEnoughDataToLaunchGrade")
                  : t("rating:notEnoughLiquidityToComputeGrade")}
              </Tooltip.TooltipContent>
            </Tooltip.TooltipPortal>
          </Tooltip.Tooltip>
        </div>
      ) : (
        <>
          <Badge
            variant={badgeVariant}
            className="mr-2 flex h-[30px] w-auto items-center rounded-[4px] px-1 text-[15px] font-normal"
          >
            {gradeValue > 0
              ? formatNumber(Number(gradeValue), 2, true, true, false)
              : "-"}
          </Badge>
          <Tooltip.Tooltip delayDuration={300}>
            <Tooltip.TooltipTrigger>
              {dailyPercentChange > 0 ? (
                <IoMdArrowUp className={`text-[15px] text-[#1DB66C]`} />
              ) : dailyPercentChange < 0 ? (
                <IoMdArrowDown className={`text-[15px] text-[#FF4242]`} />
              ) : (
                <IoMdArrowForward className={`text-[15px] text-[#A1A1AA]`} />
              )}
            </Tooltip.TooltipTrigger>
            <Tooltip.TooltipPortal>
              <Tooltip.TooltipContent>
                {t("rating:changeSinceLastDay")}:{" "}
                {formatNumber(dailyPercentChange)}%
              </Tooltip.TooltipContent>
            </Tooltip.TooltipPortal>
          </Tooltip.Tooltip>
        </>
      )}
    </div>
  );
};
