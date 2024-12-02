"use client";

import Image from "next/image";
import { useState } from "react";

// importing ui components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

// importing custom functions
import { cn } from "@/lib/utils";

// importing multi-lang context
import { useTranslation } from "./translation/TranslationsProvider";

// importing images
import ArabicFlag from "@/public/images/multi-lang/ar-100.png";
import GermanFlag from "@/public/images/multi-lang/de-100.png";
import EnglishFlag from "@/public/images/multi-lang/en-100.png";
import SpanishFlag from "@/public/images/multi-lang/es-100.png";
import FranceFlag from "@/public/images/multi-lang/fr-100.png";
import ItalianFlag from "@/public/images/multi-lang/it-100.png";
import KoreanFlag from "@/public/images/multi-lang/ko-100.png";
import DutchFlag from "@/public/images/multi-lang/nl-100.png";
import PortugueseFlag from "@/public/images/multi-lang/pt-100.png";
import RussianFlag from "@/public/images/multi-lang/ru-100.png";
import TurkishFlag from "@/public/images/multi-lang/tr-100.png";
import MandarinFlag from "@/public/images/multi-lang/zh-100.png";

// importing icons
import componentIDs from "@/constants/componentIDs";
import { AiOutlineClose } from "react-icons/ai";

const LanguageSelector = ({
  userLoggedIn,
  closeSidebar,
}: {
  userLoggedIn: boolean;
  closeSidebar?: () => void;
}) => {
  const { t, locale: currentLocale, changeLocale } = useTranslation();

  const languages: { [key: string]: any } = [
    {
      id: "en",
      name: t("navbar:multiLangEnglish"),
      currency: "$",
      asset: EnglishFlag,
    },
    {
      id: "fr",
      name: t("navbar:multiLangFrench"),
      currency: "₣",
      asset: FranceFlag,
    },
    {
      id: "nl",
      name: t("navbar:multiLangDutch"),
      currency: "€",
      asset: DutchFlag,
    },
    {
      id: "pt",
      name: t("navbar:multiLangPortuguese"),
      currency: "€",
      asset: PortugueseFlag,
    },
    {
      id: "de",
      name: t("navbar:multiLangGerman"),
      currency: "€",
      asset: GermanFlag,
    },
    {
      id: "es",
      name: t("navbar:multiLangSpanish"),
      currency: "€",
      asset: SpanishFlag,
    },
    {
      id: "tr",
      name: t("navbar:multiLangTurkish"),
      currency: "₺",
      asset: TurkishFlag,
    },
    {
      id: "ar",
      name: t("navbar:multiLangArabic"),
      currency: "",
      asset: ArabicFlag,
    },
    {
      id: "it",
      name: t("navbar:multiLangItalian"),
      currency: "€",
      asset: ItalianFlag,
    },
    {
      id: "zh",
      name: t("navbar:multiLangMandarin"),
      currency: "",
      asset: MandarinFlag,
    },
    {
      id: "ko",
      name: t("navbar:multiLangKorean"),
      currency: "",
      asset: KoreanFlag,
    },
    {
      id: "ru",
      name: t("navbar:multiLangRussian"),
      currency: "",
      asset: RussianFlag,
    },
  ];

  const [languageWebDrawerOpen, setLanguageWebDrawerOpen] = useState(false);
  const [languageResponsiveDrawerOpen, setLanguageResponsiveDrawerOpen] =
    useState(false);

  const language = languages.find((item: any) => item.id === currentLocale);

  return (
    <div>
      <DropdownMenu
        open={languageWebDrawerOpen}
        onOpenChange={setLanguageWebDrawerOpen}
      >
        <DropdownMenuTrigger asChild>
          <Button
            id={componentIDs.header.languageDropdownButton}
            className={cn(
              !userLoggedIn &&
                "mr-3 hidden h-[35px] w-[35px] xms:block sm:mr-0 lg:mr-3 lg:h-[40px] lg:w-[40px] xl:mr-5",
              userLoggedIn &&
                "hidden h-[30px] w-[30px] sm:block xsl:h-[40px] xsl:w-[40px]",
              "rounded-[4px] border border-[#E6E9EF] bg-[#ffffff] p-0 dark:border-[#414249] dark:bg-[#1a1a20]",
            )}
            data-testid="language-web-selector-button"
            onClick={() => setLanguageWebDrawerOpen(true)}
          >
            {language?.asset && (
              <Image
                src={language?.asset}
                alt="Lang images"
                className="inline-block"
                height={15}
                width={20}
              />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="min-w-[35px]"
          align="end"
          data-testid="dropdown-menu-content"
        >
          <span className="flex w-auto flex-col">
            {languages.map((item: any) => {
              const isSelected = item.id === currentLocale;
              return (
                <DropdownMenuItem
                  onClick={() => {
                    changeLocale(item.id);
                    if (closeSidebar) closeSidebar();
                  }}
                  key={item?.id}
                  className={`h-10 px-4 py-2 ${isSelected ? "border border-[#FFCF2E] bg-[#FFCF2E]/20" : ""}`}
                  data-testid={`dropdown-menu-item-${item.id}`}
                >
                  <Image
                    src={item?.asset}
                    alt="Lang images"
                    className="inline-block"
                    height={15}
                    width={20}
                  />
                  <span className="whitespace-no-wrap ml-[10px] inline-block w-[70px] min-w-[70px] overflow-hidden truncate overflow-ellipsis text-left text-sm font-normal dark:font-[300]">
                    {item?.name}
                  </span>
                </DropdownMenuItem>
              );
            })}
          </span>
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet open={languageResponsiveDrawerOpen}>
        <SheetTrigger
          className={cn(
            !userLoggedIn && "xms:hidden",
            userLoggedIn && "sm:hidden",
            "mx-1 flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[4px] border px-1 py-1 pt-2 dark:border-[#565656]",
          )}
          onClick={() => setLanguageResponsiveDrawerOpen(true)}
          data-testid="language-selector-responsive-button"
        >
          {language?.asset && (
            <Image
              src={language?.asset}
              alt="Lang images"
              className="mt-[-2px] inline-block"
              height={18}
              width={18}
            />
          )}
        </SheetTrigger>
        <SheetContent
          className="mr-[55px] h-[50vh] w-screen dark:bg-[#111116] xsl:mr-0"
          side="bottom"
          data-testid="sheet-menu-content"
        >
          <SheetHeader className="h-full">
            <SheetDescription className="h-full">
              <span className="flex w-full items-center justify-between border-b border-[#F0F0F0] px-5 py-4 dark:border-[#565656]">
                <span className="text-base font-medium text-[#121212] dark:text-[#eee]">
                  {t("navbar:homeHeaderLanguage")}
                </span>
                <AiOutlineClose
                  className="cursor-pointer text-base text-[#121212] dark:text-[#fff]"
                  data-testid="language-selector-responsive-close-button"
                  onClick={() => setLanguageResponsiveDrawerOpen(false)}
                />
              </span>
              <span className="flex h-full flex-col items-start overflow-auto pb-2 pb-[70px] pt-2">
                {languages.map((item: any) => {
                  const isSelected = item.id === currentLocale;
                  return (
                    <button
                      type="button"
                      onClick={() => changeLocale(item.id)}
                      key={item.id}
                      className={`my-2 cursor-pointer px-5 ${isSelected ? "h-full w-full border border-[#FFCF2E] bg-[#FFCF2E]/20 py-[5px] text-left" : ""}`}
                      data-testid={`sheet-menu-item-${item.id}`}
                    >
                      <Image
                        src={item?.asset}
                        alt="Lang images"
                        className="mt-[-6px] inline-block"
                        height={20}
                        width={33}
                      />
                      <span className="mx-2 mt-[2px] inline-block text-base font-medium sm:text-[18px]">
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </span>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default LanguageSelector;
