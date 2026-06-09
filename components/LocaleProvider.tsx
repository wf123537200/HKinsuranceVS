"use client";

import { NextIntlClientProvider } from "next-intl";
import { useParams } from "next/navigation";

export default function LocaleProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  return (
    <NextIntlClientProvider locale={locale} messages={{}}>
      {children}
    </NextIntlClientProvider>
  );
}
