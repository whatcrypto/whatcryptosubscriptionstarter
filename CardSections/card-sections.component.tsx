"use client";

import React, { FC, useEffect, useState } from "react";

// importing ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// importing components
import CardSectionsItem from "./CardSectionsItem";
import { getTokenDetailsHref } from "@/lib/url";
import Link from "next/link";
import useTokenPrice from "@/hooks/useTokenPrice";

type TokenData = {
    CG_ID: string;
    ONE_DAY_RET: number
    TOKEN_NAME: string;
    TOKEN_SYMBOL: string;
    LAST_TRADING_SIGNAL_TIMESTAMP: string;
    TOKEN_ID: string;
}
interface IMarketCardSectionsProps {
    title: React.ReactNode;
    data: Array<TokenData>;
    time?: boolean;
    negative?: boolean;
}

const MarketCardSections: React.FC<IMarketCardSectionsProps> = ({ title, data, time, negative }) => {

    const {getTokenPrice} = useTokenPrice(false);

    useEffect(() => {
        getTokenPrice(data.map(token => token.CG_ID), true);
    }, []);

    return (
        <Card className={`border border-[#E1E0E0] dark:border-[#414249] `}>
            <CardHeader className="h-[58px] flex justify-center py-[20px] px-[10px] xnl:px-[20px]">
                <CardTitle className="text-[16px] font-[500]">{title}</CardTitle>
            </CardHeader>
            <CardContent className={`flex flex-col py-[10px] px-0`}>
                {data?.map((item) => {
                  if (!item.CG_ID) {
                    return null;
                  }
                  
                    return (
                        <CardItem
                            key={item.TOKEN_SYMBOL}
                            item={item}
                            negative={negative}
                            time={time}
                        />
                    );
                })}
            </CardContent>
        </Card>
    );
};

type CardItemProps = {
    time?: boolean;
    negative?: boolean;
    item: TokenData;
}

const CardItem: FC<CardItemProps> = ({item, negative, time}) => {

    const {data} = useTokenPrice(item.CG_ID);
    const [value, setValue] = useState(item);


    useEffect(() => {
        if(data?.cgid === item.CG_ID) {
            setValue({
                ...item,
                ONE_DAY_RET: data.percentagechange,
            });
        }
    }, [data?.percentagechange]);

    return (
        <Link
            className="hover:bg-secondary-background transition-all px-[10px] xnl:px-[20px]"
            key={item.TOKEN_SYMBOL}
            href={getTokenDetailsHref(value)}
            target="_blank"
            rel="noopener noreferrer"
        >
            <CardSectionsItem item={value} time={time} negative={negative} />
        </Link>
    );
};

export default MarketCardSections;
