import clsx from "clsx";

// importing ui components
import * as Tooltip from "@/components/ui/tooltip";

// importing icons
import { FaSortDown, FaSortUp } from "react-icons/fa";
import { useTranslation } from "@/components/translation/TranslationsProvider";

export type SortContainerProps = {
    readonly column: any;
    readonly children: React.ReactNode;
    readonly className?: string;
};

export default function SortingContainer({ column, children, className }: SortContainerProps) {
    const { t } = useTranslation();

    return (
        <Tooltip.Tooltip delayDuration={300}>
            <Tooltip.TooltipTrigger asChild>
                <button
                    className={clsx("relative flex items-center text-left justify-start cursor-pointer z-5 w-[fit-content]", className)}
                    onClick={column.getToggleSortingHandler()}
                >
                    {children}
                    <div>
                        <FaSortUp
                            className={
                                column.getIsSorted() === "asc"
                                    ? "mx-[2px] cursor-pointer min-w-[12px] min-h-[12px] -mb-3 text-yellow-300 dark:text-yellow-600"
                                    : "mx-[2px] cursor-pointer min-w-[12px] min-h-[12px] -mb-3"
                            }
                        />
                        <FaSortDown
                            className={
                                column.getIsSorted() === "desc"
                                    ? "mx-[2px] cursor-pointer min-w-[12px] min-h-[12px] -mt-3 text-yellow-300 dark:text-yellow-600"
                                    : "mx-[2px] cursor-pointer min-w-[12px] min-h-[12px] -mt-3"
                            }
                        />
                    </div>
                </button>
            </Tooltip.TooltipTrigger>
            <Tooltip.TooltipContent className="mb-[5px]">
                {/* @ts-ignore */}
                {{
                    ["asc"]: t("clickSortAscending"),
                    ["desc"]: t("clickSortDescending"),
                }[column?.getNextSortingOrder()] ?? t("clickCancelSorting")}
            </Tooltip.TooltipContent>
        </Tooltip.Tooltip>
    );
}
