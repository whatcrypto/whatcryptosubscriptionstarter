"use client";

import { useState, useEffect, useRef } from "react";
import clsx from "clsx";

// importing external libraries
import Cookies from "js-cookie";
import scrollIntoView from "scroll-into-view";

// importing context
import { useChatbotContext } from "@/contexts/ChatbotContext";

// importing components
import PromptSection from "@/components/chatbot/InputContainer/PromptSection";
import useUser from "@/components/useUser";
import DisclaimerModal from "@/components/chatbot/DisclaimerModal/DisclaimerModal";
import QuickQuestionScreen from "@/components/chatbot/QuickQuestion/QuickQuestion";
import ChatScreen from "@/components/chatbot/ChatScreen/ChatScreen";
import { usePathname } from "next/navigation";

interface ChatContainerProps {
    widgetContainer?: boolean;
    isMarketOpen?: boolean;
}

export default function HomeContainer({ widgetContainer = false, isMarketOpen = false }: Readonly<ChatContainerProps>) {
    const [isShowDisclaimer, setIsShowDisclaimer] = useState<boolean>(false);
    const { messages } = useChatbotContext();
    const user = useUser();
    const userName = user?.name || "";
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    useEffect(() => {
        if (!isMarketOpen) {
            const disclaimerSeen = Cookies.get("disclaimerSeen");
            if (disclaimerSeen !== "true") {
                setIsShowDisclaimer(true);
            }
        }
    }, [isMarketOpen]);

    useEffect(() => {
        if (pathname?.includes("tmai")) {
            if (typeof window !== "undefined" && messages?.length > 0) {
                const scrollFirstRow: any = document.querySelector(".scrollToChat");
                scrollIntoView(scrollFirstRow, {
                    time: 0,
                });
            }
        } else {
            if (chatContainerRef.current && messages?.length > 0) {
                const scrollFirstRow: any = chatContainerRef.current.querySelector(".scrollToChat");
                if (scrollFirstRow) {
                    scrollIntoView(scrollFirstRow, {
                        time: 0,
                        align: {
                            top: 0,
                        },
                        validTarget: (target) => target === chatContainerRef.current,
                    });
                }
            }
        }
    }, [messages]);

    return (
        <div
            className={clsx(
                "mx-auto flex-1 flex flex-col justify-between h-full",
                widgetContainer && "w-full overflow-x-hidden",
                isMarketOpen && "w-full",
                !isMarketOpen && !widgetContainer && "w-full xsl:w-[1220px] px-[10px] md:px-[20px] xsl:px-0",
            )}
        >
            <div ref={chatContainerRef} className={clsx("flex-1 overflow-y-auto px-0", isMarketOpen && "w-full")}>
                {messages?.length ? (
                    <ChatScreen messages={messages} userName={userName} widgetContainer={widgetContainer} isMarketOpen={isMarketOpen} />
                ) : (
                    <QuickQuestionScreen widgetContainer={widgetContainer} isMarketOpen={isMarketOpen} />
                )}
                <div className="scrollToChat"></div>
            </div>
            <PromptSection widgetContainer={widgetContainer} isMarketOpen={isMarketOpen} />
            {!isMarketOpen && <DisclaimerModal isOpen={isShowDisclaimer} onClose={() => setIsShowDisclaimer(false)} />}
        </div>
    );
}
