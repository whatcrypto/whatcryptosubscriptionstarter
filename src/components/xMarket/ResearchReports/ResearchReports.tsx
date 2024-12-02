"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

// importing ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// importing components
import SanitizedHtmlContent from "@/components/SanitizedHtmlContent";

// importing multilanguage
import { useTranslation } from "@/components/translation/TranslationsProvider";

// importing types
import { ResearchReport } from "@/types/research";

interface IResearchReportsCardProps {
    readonly data: ResearchReport;
}

export function ResearchReportsCard({ data }: IResearchReportsCardProps) {
    const { t } = useTranslation();
    return (
        <Card className={``}>
            <CardContent className={`p-[10px] xnl:p-[14px] flex flex-col h-full`}>
                <div className="mb-[14px] shrink-0">
                    <Image
                        src={data?.thumb}
                        alt="Icons"
                        className="xl:h-[170px] w-full xl:w-[350px] rounded"
                        height={170}
                        width={350}
                        onError={(e: any) => (e.target.style.visibility = "hidden")}
                    />
                </div>
                <div className="flex flex-col flex-1">
                    <Badge className="text-[#71717A] dark:text-[#A1A1AA] font-[400] text-[12px] w-[fit-content] p-[4px] flex justify-center bg-[#F2F4FA] dark:bg-[#111116] rounded-[4px]">
                        {data?.categories?.[0]}
                    </Badge>
                    <h6 className="my-[8px] text-[16px] font-[500]">{data?.title}</h6>
                    <SanitizedHtmlContent
                        className="text-[#71717A] dark:text-[#A1A1AA] text-[14px] font-[400] my-0 line-clamp-3 mb-[14px] flex-1"
                        html={data?.description}
                    ></SanitizedHtmlContent>
                    <Link href={data?.link} target="_blank">
                        <Button className="bg-[#FFCF30] min-w-[116px] h-[34px] text-[#09090B] font-[500] text-[15px] mt-auto">{t("common:readMore")}</Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

const MarketResearchReports = ({ data }: { data: ResearchReport[] }) => {
    const { t } = useTranslation();
    return (
        <Card className={`my-[20px]`}>
            <CardHeader className="h-[58px] flex justify-center py-[20px] px-[10px] xnl:px-[20px]">
                <CardTitle className="text-[16px] font-[500]">{t("market:tokenMetricsResearchReports")}</CardTitle>
            </CardHeader>
            <CardContent className={`px-[10px] xnl:p-[20px] grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[15px] xl:gap-[10px] xnl:gap-[20px]`}>
                {data?.map((item) => {
                    return (
                        <React.Fragment key={item?.id}>
                            <ResearchReportsCard data={item} />
                        </React.Fragment>
                    );
                })}
            </CardContent>
        </Card>
    );
};

export default MarketResearchReports;
