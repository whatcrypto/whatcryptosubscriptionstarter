import React, { useEffect, useState } from "react";
import { useTranslation } from "../translation/TranslationsProvider";

type FilterKey = "1W" | "1M" | "3M" | "1Y" | "YTD" | "MAX";

interface FilterProps {
    className?: string;
    elementClassName?: string;
    onChange?: (filter: FilterKey, value: number) => void;
    defaultFilter: string;
    displayBlur?: boolean;
    data?: any[]; // Making data an optional prop
}
const filters = {
    "1W": 7,
    "1M": 30,
    "3M": 90,
    "1Y": 365,
    YTD: -1,
    MAX: 0,
};

const Filter = React.forwardRef<HTMLDivElement, FilterProps>(
    ({ className, elementClassName, onChange, defaultFilter, displayBlur, data = [], ...props }, ref) => {
        const [activeFilter, setActiveFilter] = useState<FilterKey>("MAX");
        const { t } = useTranslation();

        const filters: Record<FilterKey, number> = {
            "1W": 7,
            "1M": 30,
            "3M": 90,
            "1Y": 365,
            YTD: -1,
            MAX: 0,
        };

        const tooltips: Record<FilterKey, string> = {
            "1W": t("common:lastWeek"),
            "1M": t("common:lastMonth"),
            "3M": t("common:lastThreeMonths"),
            "1Y": t("common:lastYear"),
            YTD: t("common:yearToDate"),
            MAX: t("allAvailableData"),
        };

        useEffect(() => {
            if (defaultFilter in filters) {
                setActiveFilter(defaultFilter as FilterKey);
            } else {
                setActiveFilter("MAX");
            }
        }, [defaultFilter]);

        function clickFilter(filter: FilterKey) {
            if (!displayBlur) {
                const filterValue = filters[filter];
                setActiveFilter(filter);
                if (onChange && typeof onChange === "function") {
                    try {
                        onChange(filter, filterValue);
                    } catch (e) {
                        // error
                    }
                } else {
                    defaultValues();
                }
            }
        }

        function defaultValues() {
            setActiveFilter("MAX");
            if (onChange && typeof onChange === "function") {
                try {
                    onChange("MAX", 0);
                } catch (e) {
                    // error
                }
            }
        }

        const isOneWeekDataAvailable = data.length >= 7;

        return (
            <div
                className={"relative flex flex-wrap w-auto sm:flex-nowrap chart-filter-time " + (className || "")}
                {...props}
                ref={ref}
                style={{ marginTop: 0 }}
            >
                {Object.keys(filters).map(
                    (filter) =>
                        (filter !== "1W" || isOneWeekDataAvailable) && (
                            <span
                                key={filter}
                                className={
                                    "text-base mx-[1px] sm:mx-1 relative group " +
                                    (activeFilter === filter ? "active-filter h-[25px] !text-button-label" : "!text-primary-text") +
                                    " " +
                                    (elementClassName || "")
                                }
                                onClick={() => clickFilter(filter as FilterKey)}
                            >
                                {filter}
                                <div className="absolute hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 bottom-full mb-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                                    {tooltips[filter as FilterKey]}
                                </div>
                            </span>
                        ),
                )}
            </div>
        );
    },
);

Filter.displayName = "Filter";

export default Filter;
