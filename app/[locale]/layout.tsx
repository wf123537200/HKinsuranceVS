import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { GoogleAnalytics } from "@next/third-parties/google";
import { locales, defaultLocale, type Locale } from "@/i18n/config";
import { localizedUrl, ogLocale, siteUrl } from "@/lib/seo";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale =
    rawLocale && (locales as readonly string[]).includes(rawLocale)
      ? rawLocale
      : defaultLocale;
  const localeTyped = locale as Locale;
  const t = await getTranslations({ locale, namespace: "seo" });
  const homeTitle = t("homeTitle");
  const homeDescription = t("homeDescription");
  const url = localizedUrl(localeTyped, "/");
  return {
    title: { default: homeTitle, template: "%s" },
    description: homeDescription,
    alternates: {
      canonical: url,
      languages: {
        en: localizedUrl("en", "/"),
        "zh-CN": localizedUrl("zh-CN", "/"),
        "zh-TW": localizedUrl("zh-TW", "/"),
      },
    },
    openGraph: {
      type: "website",
      locale: ogLocale(localeTyped),
      url,
      siteName: "Policy Vector",
      title: homeTitle,
      description: homeDescription,
    },
    twitter: {
      card: "summary",
      title: homeTitle,
      description: homeDescription,
    },
    other: {
      "google-adsense-account": "ca-pub-5757270339896246",
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: rawLocale } = await params;
  // With next-intl `localePrefix: "as-needed"`, the user can hit an
  // unprefixed URL like /companies while their cookie is set to the
  // default locale (en). Next.js will route that to /[locale]/companies
  // but `params.locale` is undefined. Fall back to defaultLocale so
  // every downstream `locale as Locale` cast gets a real value.
  const locale =
    rawLocale && (locales as readonly string[]).includes(rawLocale)
      ? rawLocale
      : defaultLocale;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
      {process.env.NEXT_PUBLIC_GA_ID ? (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      ) : null}
    </html>
  );
}
