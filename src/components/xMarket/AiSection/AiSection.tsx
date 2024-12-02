"use client";

import React from "react";

// importing context
import { useChatbotContext } from "@/contexts/ChatbotContext";

// importing ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// importing multilanguage
import { useTranslation } from "@/components/translation/TranslationsProvider";

// importing fake data
import HomeContainer from "@/components/chatbot/HomeContainer/HomeContainer";
import CustomTooltip from "@/components/ui/customTooltip";
import { AiOutlineInfoCircle } from "react-icons/ai";

const AISection: React.FC = () => {
  const { t } = useTranslation();
  const { messages } = useChatbotContext();

  return (
    <Card className={`my-[10px]`} data-testid="ai-section">
      <CardHeader className="flex h-[58px] justify-center px-[10px] py-[20px] lg:px-[20px]">
        <CardTitle
          data-testid="aiChatbotAnswers"
          className="flex items-center gap-1 text-[16px] font-[500]"
          tag="h2"
        >
          {t("market:aiChatbotAnswers")}
          <CustomTooltip
            message={<p>{t("market:aiChatbotAnswersTooltip")}</p>}
            className="top-[25px] z-[18] w-[250px]"
          >
            <AiOutlineInfoCircle className="mx-[4px] cursor-pointer text-[14px] text-[#71717A] dark:text-[#A1A1AA]" />
          </CustomTooltip>
        </CardTitle>
      </CardHeader>
      <CardContent
        data-testid="market-chatContainer"
        className={`p-0 ${messages?.length > 0 ? "h-[450px]" : "h-auto sm:h-[450px]"}`}
      >
        <HomeContainer isMarketOpen={true} />
      </CardContent>
    </Card>
  );
};

export default AISection;
