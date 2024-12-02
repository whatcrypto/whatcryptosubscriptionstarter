"use client";

import { useTranslation } from "@/components/translation/TranslationsProvider";
import { useEffect } from "react";

const PageTitle = ({ title }: { title: string }) => {
  const { t, locale } = useTranslation();

  useEffect(() => {
    document.title = t(title);
  }, [locale, t, title]);

  return null;
};

export default PageTitle;
