import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n/config";

const intl = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});

// Search engine crawlers: skip locale redirect. They should see the
// default-locale version of unprefixed URLs (e.g. "/") without a 307.
// We rewrite internally to /<defaultLocale>/<path> so the [locale] page
// handler receives the correct locale param without a visible redirect.
const BOT_PATTERN = /(googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|sogou|exabot|facebot|ia_archiver)/i;

export default function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") || "";
  const { pathname } = request.nextUrl;

  // For known crawlers hitting an unprefixed path, rewrite (not redirect)
  // to the default locale. The browser URL stays unchanged, but Next.js
  // routes the request to app/[locale]/<path> internally.
  const hasLocalePrefix = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (!hasLocalePrefix && BOT_PATTERN.test(ua)) {
    const rewritten = pathname === "/" ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
    return NextResponse.rewrite(new URL(rewritten, request.url));
  }

  return intl(request);
}

export const config = {
  matcher: [
    "/",
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
