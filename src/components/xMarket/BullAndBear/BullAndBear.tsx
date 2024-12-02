"use client";

import React from "react";

// importing ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// importing custom functions
import TooltipHovering from "../TooltipHovering/TooltipHovering";
import BullAndBearChart from "../Charts/BullBearTemplate/BullBearTemplate";
import CustomTooltip from "@/components/ui/customTooltip";
import { AiOutlineInfoCircle } from "react-icons/ai";

// importing multilanguage
import { useTranslation } from "@/components/translation/TranslationsProvider";

const BullAndBear = ({ percentage }: { percentage: number }) => {
	const { t } = useTranslation();

	const roundedPercentage = Math.round(percentage || 0);

	return (
		<Card className={"w-full xl:w-[350px] laptop:w-[382px] border border-[#E1E0E0] dark:border-[#414249]"}>
			<CardHeader className="h-[58px] flex justify-center py-[20px]">
				<CardTitle className="flex items-center gap-1 w-auto text-[16px] font-[500]">
					{t("market:bullAndBear")}
					<CustomTooltip message={<p>{t("market:bullAndBearTooltip")}</p>} className="w-[250px] z-[18] top-[25px]">
						<AiOutlineInfoCircle className="mx-[4px] text-[14px] text-[#71717A] dark:text-[#A1A1AA] cursor-pointer" />
					</CustomTooltip>
				</CardTitle>
			</CardHeader>
			<CardContent className={"py-[20px] px-[10px] flex justify-center h-[300px] xl:h-[350px] xnl:h-full"}>
				<BullAndBearChart percentage={roundedPercentage} />
			</CardContent>
		</Card>
	);
};

export default BullAndBear;
