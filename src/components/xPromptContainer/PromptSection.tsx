"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import clsx from "clsx";
import Cookies from "js-cookie";

// importing context
import { useChatbotContext } from "@/contexts/ChatbotContext";

// importing ui
import { Button } from "@/components/ui/button";

// importing third party library
import TextareaAutosize from "react-textarea-autosize";

// importing functions
import useUser from "@/components/useUser";

// importing api
import config from "@/config/api";

// importing images
import SendIcon from "@/public/images/market/send-2.svg";

// importing multilanguage
import { useTranslation } from "@/components/translation/TranslationsProvider";

import DisclaimerModal from "@/components/chatbot/DisclaimerModal/DisclaimerModal";

interface PromptProps {
    widgetContainer?: boolean;
    isMarketOpen?: boolean;
}

export default function PromptSection({ widgetContainer = false, isMarketOpen = false }: Readonly<PromptProps>) {
    const user = useUser();
    const { t } = useTranslation();
    const { inputValue, startTime, isLocked, messages, setInputValue, setIsLocked, updateMessages, handleChatRequest, setStartTime } = useChatbotContext();

    const [isShowDisclaimer, setIsShowDisclaimer] = useState<boolean>(false);
    const [isDisclaimerAccepted, setIsDisclaimerAccepted] = useState<boolean>(Cookies.get("disclaimerSeen") === "true");
    const [isFirstClick, setIsFirstClick] = useState<boolean>(true);

    useEffect(() => {
        if (Cookies.get("disclaimerSeen") !== "true") {
            setIsDisclaimerAccepted(true);
        }
    }, []);

    const handleSendClick = () => {
        if (!isDisclaimerAccepted && isFirstClick) {
            setIsShowDisclaimer(true);
        } else {
            handleChatRequest(inputValue);
        }
        setIsFirstClick(false);
    };

    const handleAcceptDisclaimer = () => {
        Cookies.set("disclaimerSeen", "true", { expires: 365 });
        setIsDisclaimerAccepted(true);
        setIsShowDisclaimer(false);
        handleChatRequest(inputValue);
    };

    async function clearAndSaveChat() {
        if (!messages.length) {
            return;
        }

        if (user?.isLoggedIn) {
            const params = { messages: [] };
            setIsLocked(true);
            try {
                await fetch(`${config.chatbot.save_chat_history}`, {
                    method: "POST",
                    headers: { "content-Type": "application/json" },
                    body: JSON.stringify(params),
                });
                updateMessages([]);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setIsLocked(false);
            }
        } else {
            updateMessages([]);
        }
        setStartTime(null);
    }

    return (
        <div className="sticky bottom-0 bg-[#ffffff] dark:bg-[#1a1a20] pt-[15px]" data-testid="prompt-section">
            <div className={clsx("flex items-end", isMarketOpen && "mx-[10px] lg:mx-[20px] mb-[20px]", widgetContainer && "mx-[15px] mb-[15px]")}>
                {messages.length > 0 && (
                    <Button
                        className={clsx(
                            "py-[14px] px-[10px] text-[15px] font-[400] rounded-[4px] bg-[#F2F4FA] dark:bg-[#111116] border border-[#E6E9EF] dark:border-[#414249] mr-[5px] sm:mr-[10px] xsl:mr-[16px] h-[46px]",
                        )}
                        onClick={clearAndSaveChat}
                        disabled={isLocked}
                        aria-label="Clear Chat"
                        data-testid="clear-chat-button"
                    >
                        <span className={clsx("inline-block text-[#71717A] dark:text-[#A1A1AA]")}>
                            <svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M1.91481 9.14324H1.39481V8.62324C1.39481 7.93368 1.66874 7.27236 2.15633 6.78476C2.64393 6.29717 3.30525 6.02324 3.99481 6.02324H6.59481V2.38324C6.59481 1.9695 6.75917 1.57271 7.05172 1.28016C7.34428 0.987599 7.74107 0.823242 8.15481 0.823242C8.56855 0.823242 8.96534 0.987599 9.2579 1.28016C9.55046 1.57271 9.71481 1.9695 9.71481 2.38324V6.02324H12.3148C13.0044 6.02324 13.6657 6.29717 14.1533 6.78476C14.6409 7.27236 14.9148 7.93368 14.9148 8.62324V9.14324H1.91481ZM14.9876 10.1832H1.32201L0.354811 17.9208C0.342972 18.067 0.387638 18.2122 0.479611 18.3264C0.529633 18.3817 0.590596 18.4259 0.65863 18.4564C0.726663 18.4868 0.800281 18.5028 0.874811 18.5032H3.14201L3.23561 17.4632L3.47481 14.8112C3.48164 14.743 3.50185 14.6767 3.53429 14.6162C3.56674 14.5557 3.61077 14.5022 3.66389 14.4588C3.717 14.4153 3.77816 14.3827 3.84386 14.3629C3.90956 14.3431 3.97852 14.3364 4.04681 14.3432C4.1151 14.3501 4.18137 14.3703 4.24185 14.4027C4.30232 14.4352 4.35582 14.4792 4.39928 14.5323C4.44273 14.5854 4.47531 14.6466 4.49513 14.7123C4.51495 14.778 4.52164 14.847 4.51481 14.9152L4.27561 17.4632L4.18201 18.5032H10.5676L10.4116 17.4632L9.72521 12.856C9.71491 12.7888 9.71804 12.7202 9.73443 12.6541C9.75082 12.5881 9.78013 12.5259 9.82068 12.4713C9.86123 12.4167 9.91221 12.3706 9.97067 12.3358C10.0291 12.301 10.0939 12.2781 10.1613 12.2685C10.2286 12.2588 10.2972 12.2627 10.3631 12.2797C10.429 12.2968 10.4908 12.3267 10.545 12.3678C10.5993 12.4089 10.6448 12.4604 10.679 12.5192C10.7132 12.578 10.7355 12.643 10.7444 12.7104L11.462 17.4632L11.618 18.5032H13.282L13.0948 17.4632L12.8452 15.9968C12.8316 15.9298 12.8316 15.8607 12.8453 15.7937C12.859 15.7267 12.8861 15.6631 12.9249 15.6068C12.9638 15.5504 13.0136 15.5025 13.0713 15.4659C13.1291 15.4293 13.1937 15.4047 13.2612 15.3936C13.3282 15.3807 13.3971 15.3813 13.4638 15.3953C13.5306 15.4093 13.5939 15.4365 13.65 15.4752C13.7062 15.5139 13.754 15.5634 13.7908 15.6209C13.8277 15.6783 13.8527 15.7425 13.8644 15.8096L14.1556 17.4632L14.3324 18.5032H15.4348C15.5093 18.5028 15.583 18.4868 15.651 18.4564C15.719 18.4259 15.78 18.3817 15.83 18.3264C15.922 18.2122 15.9667 18.067 15.9548 17.9208L14.9876 10.1832Z"
                                    fill="#A1A1AA"
                                />
                            </svg>
                        </span>
                    </Button>
                )}
                <div
                    className="border border-[#E6E9EF] dark:border-[#414249] rounded-[4px] py-[6px] bg-[#fff] dark:bg-[#1A1A20] flex items-center flex-1 pl-[12px] md:pl-[16px] pr-[7px] "
                    data-testid="input-section"
                >
                    <TextareaAutosize
                        data-testid="chat-input"
                        className="flex-1 mr-1 bg-transparent outline-none resize-none"
                        minRows={1}
                        maxRows={8}
                        placeholder={t("tmai:askMeAnything")}
                        disabled={isLocked}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDownCapture={(e) => {
                            if (e.key === "Enter" && !isLocked) {
                                handleSendClick();
                            }
                        }}
                    />
                    <Button
                        disabled={isLocked}
                        className="p-2 h-[32px] bg-[#FFCF30] text-[18px] rounded-[4px] mt-auto"
                        onClick={handleSendClick}
                        data-testid="send-button"
                    >
                        <Image src={SendIcon} alt="Send Icon" height={18} width={18} />
                    </Button>
                </div>
            </div>
            {!isMarketOpen && !widgetContainer && (
                <p data-testid="input-caution" className="text-[#71717A] dark:text-[#A1A1AA] text-[12px] font-[400] text-center my-[10px] lg:my-[14px]">
                    {t("tmai:inputCautionText")}
                </p>
            )}
            <DisclaimerModal isOpen={isShowDisclaimer} onClose={() => setIsShowDisclaimer(false)} onAccept={handleAcceptDisclaimer} />
        </div>
    );
}
