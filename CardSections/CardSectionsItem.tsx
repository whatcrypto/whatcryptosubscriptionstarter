"use client";

import Image from "next/image";

// importing ui components
import { Badge } from "@/components/ui/badge";

// importing external libraries
import moment from "moment";

// importing functions
import UseScreenSize from '@/components/UseScreenSize/UseScreenSize';
import tokenLogo from "@/lib/tokenLogo";

// importing icons
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import Ticker from "@/components/common/Ticker";

type CardSectionsItem = {
    CG_ID: string;
    TOKEN_NAME: string;
    TOKEN_SYMBOL: string;
    ONE_DAY_RET: number;
    LAST_TRADING_SIGNAL_TIMESTAMP: string;
};

export type CardSectionsItemProps = Readonly<{
    item: CardSectionsItem;
    time?: boolean;
    negative?: boolean;
}>;

export default function CardSectionsItem({ item, time, negative }: CardSectionsItemProps) {
    const isBelow350px = UseScreenSize({ screenSize: 350 });
    const renderTime = () => {
        const now = new Date();

        // convert time to 00:00:00Z
        const lastTradingSignalTimestamp = moment(item.LAST_TRADING_SIGNAL_TIMESTAMP).utc();
        lastTradingSignalTimestamp.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

        const diff = now.getTime() - lastTradingSignalTimestamp.toDate().getTime();

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) {
            return `1 min ago`;
        }

        if (minutes < 60) {
            return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
        }

        if (hours < 24) {
            return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        }

        return `${days} day${days > 1 ? "s" : ""} ago`;
    };

    return (
        <div className="py-[12px] flex justify-between">
            <div className="flex items-center">
                <Image
                    src={tokenLogo(item.CG_ID)}
                    alt={item.CG_ID}
                    className="rounded-full h-[20px] w-[20px] mr-[10px]"
                    height={20}
                    width={20}
                    onError={(e: any) => (e.target.style.visibility = "hidden")}
                />
                <span className="text-[15px] font-[400] flex items-center">
                    <span className={`truncate ${isBelow350px ? 'max-w-[50px]' : 'max-w-[130px]'} md:max-w-[150px] xl:max-w-[85px] w-auto inline-block`}>{item?.TOKEN_NAME}</span>
                    <span className="text-[#71717A] dark:text-[#A1A1AA] text-[15px] font-[400] uppercase inline-block ml-[6px]">{item?.TOKEN_SYMBOL}</span>
                </span>
            </div>
            <div className="flex items-center">
                {time ? (
                    <span className={`${!negative ? "text-[#1DB66C]" : "text-[#FF4242]"} text-[15px] font-[400]`}>{renderTime()}</span>
                ) : (
                    <>
                        <Badge variant={item?.ONE_DAY_RET >= 0 ? "success" : "danger"} className="rounded-full p-0 mr-[4px]">
                            {item?.ONE_DAY_RET >= 0 ? <IoMdArrowDropup className="text-[14px]" /> : <IoMdArrowDropdown className="text-[14px]" />}
                        </Badge>
                        <Ticker as="span" currentValue={item?.ONE_DAY_RET} className={`${item?.ONE_DAY_RET >= 0 ? "text-[#1DB66C]" : "text-[#FF4242]"} text-[15px] font-[400]`}>
                            {item?.ONE_DAY_RET?.toFixed(2)}%
                        </Ticker>
                    </>
                )}
            </div>
        </div>
    );
}
