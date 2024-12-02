"use client";

// importing ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const TableCellRender = () => {
    const iterations = [0, 1, 2, 3, 4, 5, 6, 7];
    return (
        <>
            {iterations.map((index) => (
                <TableCell key={index}>
                    <Skeleton className={`${index === 3 && "w-[300px]"} ${index === 7 && "w-[200px]"} h-[20px]`} />
                </TableCell>
            ))}
        </>
    );
};

export default function SectorAnalysisLoading() {
    const iterations = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const columniterations = [0, 1, 2, 3, 4, 5, 6, 7];

    return (
        <Card className={`my-[20px]`} data-testid="sector-analysis-loading">
            <CardHeader className="h-[58px] flex justify-center py-[20px] px-[10px] xnl:px-[20px]">
                <CardTitle className="flex items-center">
                    <Skeleton className="h-[20px] w-[200px]" />
                    <Skeleton className="mx-[4px] h-[14px] w-[14px]" />
                </CardTitle>
            </CardHeader>
            <CardContent className={`p-0 relative`}>
                <div className={`w-full overflow-x-scroll`}>
                    <Table containerClassName="!static">
                        <TableHeader>
                            <TableRow>
                                {columniterations.map((index) => (
                                    <TableHead key={index}>
                                        <Skeleton
                                            className={`${index === 3 && "w-[150px]"} ${index === 7 && "w-[200px]"} ${
                                                index !== 3 && index !== 7 && "w-[100px]"
                                            } h-[20px]`}
                                        />
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {iterations.map((invoice) => (
                                <TableRow key={invoice}>
                                    <TableCellRender />
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
