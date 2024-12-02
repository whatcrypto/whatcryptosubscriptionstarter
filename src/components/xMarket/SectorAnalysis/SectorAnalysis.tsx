"use client";

import React, { useState } from "react";
import clsx from "clsx";
import Image from "next/image";

// importing ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHeader, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { ColumnDef, SortingState, flexRender, getCoreRowModel, getSortedRowModel, useReactTable, getPaginationRowModel } from "@tanstack/react-table";

// importing custom function
import { formatNumber } from "@/utils/formatNumber";
import tokenLogo from "@/lib/tokenLogo";
import { renderHeader, renderColumn, renderColumnBadge, renderColumnGradeCell, renderColumnBars, TablePagination } from "@/utils/table";
import TooltipHovering from "../TooltipHovering/TooltipHovering";

// importing multilanguage
import { useTranslation } from "@/components/translation/TranslationsProvider";

// importing fake data
import { sectorAnalysisData } from "@/fakeData/market";
import { getTokenDetailsHref } from "@/lib/url";
import CustomTooltip from "@/components/ui/customTooltip";
import { AiOutlineInfoCircle } from "react-icons/ai";

type SectorAnalysisProps = {
    data: any;
};

const SectorAnalysis = ({ data }: SectorAnalysisProps) => {
    const { t } = useTranslation();

    const [sorting, setSorting] = useState<SortingState>([
        {
            id: "SECTOR_TM_GRADE",
            desc: true,
        },
    ]);

    const renderSectionGainer = (cg_id: any, coinName: any, value: any): React.ReactNode => {
        return (
            <CustomTooltip
                message={
                    <p>
                        <span className="text-[15px] font-[400] uppercase">{coinName}</span>
                    </p>
                }
                className="z-[18] top-[25px]"
            >
                <div className="flex items-center space-x-4">
                    <Image src={tokenLogo(cg_id)} alt="Icon" height={40} width={40} className="max-w-[40px] max-h-[40px]" />
                    <div className="flex flex-col">
                        <span className="text-[#71717A] dark:text-[#A1A1AA] font-[400] text-[15px] uppercase">{cg_id}</span>
                        {renderColumnGradeCell(formatNumber(value, 2))}
                    </div>
                </div>
            </CustomTooltip>
        );
    };

    const columns: ColumnDef<any, any>[] = [
        {
            accessorKey: "SECTOR_NAME",
            header: ({ column }) => renderHeader(column, t("market:sectorName")),
            cell: ({ row }) => renderColumn(row.original.SECTOR_NAME),
        },
        {
            accessorKey: "SECTOR_TM_GRADE",
            header: ({ column }) => renderHeader(column, t("market:sectorGrade")),
            cell: ({ row }) => renderColumnBadge(row.original.SECTOR_TM_GRADE),
            minSize: 140,
            size: 140,
        },
        {
            accessorKey: "AVG_SECTOR_RET",
            header: ({ column }) => renderHeader(column, t("market:avgPriceChange")),
            cell: ({ row }) => renderColumnGradeCell(formatNumber(row.original.AVG_SECTOR_RET, 2)),
            minSize: 100,
            size: 100,
        },
        {
            accessorKey: "COIN",
            header: ({ column }) => renderHeader(column, t("market:topSectorGainer")),
            cell: ({ row }) => renderSectionGainer(row.original.CG_ID, row.original.COIN, row.original.TOKEN_DAILY_PER_CHANGE),
        },
        {
            accessorKey: "SECTOR_MCAP",
            header: ({ column }) => renderHeader(column, t("market:sectorMcap")),
            cell: ({ row }) => renderColumn(`$${formatNumber(row.original.SECTOR_MCAP, 2, true, false, false)}`),
            minSize: 100,
            size: 100,
        },
        {
            accessorKey: "SECTOR_DOMINANCE",
            header: ({ column }) => renderHeader(column, t("market:sectorDominance")),
            cell: ({ row }) => renderColumn(`${formatNumber(row.original.SECTOR_DOMINANCE, 2)}%`),
            minSize: 100,
            size: 100,
        },
        {
            accessorKey: "SECTOR_24H_VOLUME",
            header: ({ column }) => renderHeader(column, t("market:sectorVolume")),
            cell: ({ row }) => renderColumn(`$${formatNumber(row.original.SECTOR_24H_VOLUME, 2, true, false, false)}`),
            minSize: 100,
            size: 100,
        },
        {
            accessorKey: "SECTOR_GAINERS",
            header: ({ column }) => renderHeader(column, t("market:numberofSectorGainers/Losers"), false),
            cell: ({ row }) => renderColumnBars(row.original.SECTOR_GAINERS, row.original.SECTOR_LOSERS),
            minSize: 230,
            size: 230,
            enableSorting: false,
        },
    ];

    const table = useReactTable({
        data,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 20,
            },
        },
        state: {
            sorting,
        },
    });

    return (
        <Card className={`my-[20px]`}>
            <CardHeader className="h-[58px] flex justify-center py-[20px] px-[10px] xnl:px-[20px]">
                <CardTitle className="text-[16px] font-[500] flex items-center">
                    {t("market:sectorAnalysis")}
                    <CustomTooltip
                        message={<p>{t("market:sectorAnalysisTooltipContent")}</p>}
                        className="w-[250px] z-[18] top-[25px]"
                        tooltipClassName="z-[20]"
                    >
                        <AiOutlineInfoCircle className="mx-[4px] text-[14px] text-[#71717A] dark:text-[#A1A1AA] cursor-pointer mt-0" />
                    </CustomTooltip>
                </CardTitle>
            </CardHeader>
            <CardContent className={`p-0 relative`}>
                <div className={`w-full overflow-x-scroll`}>
                    <div className="scrollFirst" />
                    <Table containerClassName="!static">
                        <TableHeader sticky={{ offset: 0 }} className="">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header, index) => {
                                        return (
                                            <TableHead
                                                key={header.id}
                                                className={`${clsx(index === 0 && "sticky left-0 z-[19]")} text-[#71717A] dark:text-[#A1A1AA]`}
                                                style={{
                                                    minWidth: `${header.getSize()}px`,
                                                    width: `${header.getSize()}px`,
                                                }}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody className="!bg-transparent">
                            {table?.getRowModel()?.rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="border-b-0"
                                        onClick={() => window.open(getTokenDetailsHref(row.original), "_blank")}
                                    >
                                        {row.getVisibleCells().map((cell, index) => (
                                            <TableCell
                                                key={cell.id}
                                                className={`
                                                        ${clsx(index === 0 && "sticky left-0 z-[17] bg-base-background ")}
                                                        ${
                                                            cell.column.id === "SECTOR_NAME"
                                                                ? "bg-white transition-colors group-hover:bg-[#F2F4FA] group-hover:dark:bg-[#111116] dark:bg-[#1a1a20]"
                                                                : ""
                                                        }
                                                        cursor-pointer
                                                    `}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={sectorAnalysisData?.length} className="h-24 text-center">
                                        {t("common:noResults")}.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                {!!table.getRowModel().rows?.length && TablePagination(table)}
            </CardContent>
        </Card>
    );
};

export default SectorAnalysis;
