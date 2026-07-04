import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n/config";

// next-intl's built-in `localePrefix: "as-needed"` middleware has a known
// quirk: when the user has the cookie pinned to the default locale (en),
// every request for an unprefixed URL still gets internally rewritten to
// `/en/<path>`, and if a client ever requests that prefixed path the
// canonical 307 back to the unprefixed one plus the rewrite combine into
// a redirect loop. Fix: only invoke next-intl when the URL/cookie state
// actually requires it. Otherwise pass straight through so Next.js serves
// the route natively with no rewrite and no redirect.

const SKIP_PREFIXES = ["/api", "/_next", "/_vercel", "/auth"];

function shouldSkip(pathname: string): boolean {
  return (
    SKIP_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  );
}

// Tiny copy of `negotiator`/locale matching that next-intl uses, only for
// the "is Accept-Language non-default" question.
function pickFromAcceptLanguage(header: string | null): string | undefined {
  if (!header) return undefined;
  const tags = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith("q="));
      const quality = q ? parseFloat(q.slice(2)) : 1;
      return { tag: tag.toLowerCase(), quality: Number.isFinite(quality) ? quality : 1 };
    })
    .sort((a, b) => b.quality - a.quality);
  for (const { tag } of tags) {
    const exact = (locales as readonly string[]).find((l) => l.toLowerCase() === tag);
    if (exact) return exact;
    // Try base language (e.g. zh-CN from zh-CN, zh)
    const base = tag.split("-")[0];
    const partial = (locales as readonly string[]).find(
      (l) => l.toLowerCase().split("-")[0] === base,
    );
    if (partial) return partial;
  }
  return undefined;
}

const intl = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});

export default function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (shouldSkip(pathname)) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const firstSeg = segments[0];
  const urlHasLocalePrefix =
    firstSeg != null && (locales as readonly string[]).includes(firstSeg);

  const cookieLocale =
    request.cookies?.has?.("NEXT_LOCALE") && request.cookies.get("NEXT_LOCALE")?.value;
  const cookieIsDefault =
    !cookieLocale || cookieLocale === defaultLocale;

  // If the URL has a locale prefix:
  //   - For non-default prefixes (e.g. /zh-CN/...) hand off to next-intl
  //     so it serves that locale's content (these are fine — only the
  //     default-locale prefix has the canonical-redirect loop problem).
  //   - For the default-locale prefix (e.g. /en, /en/companies), let
  //     Next.js serve the [locale]/... route directly. Otherwise next-intl
  //     would 307 the user to the unprefixed form (/companies), which
  //     loses the visible locale marker in the URL — even though we can
  //     reconstruct it from the cookie. The user explicitly navigated
  //     here via the language switcher, so honor the prefixed URL.
  if (urlHasLocalePrefix) {
    if (firstSeg === defaultLocale) {
      return NextResponse.next();
    }
    return intl(request);
  }

  // URL has no prefix. next-intl would normally rewrite to /en/<path>
  // and set a cookie. The rewrite is invisible to browsers but the
  // canonical 307 loop is real. So only invoke next-intl if the cookie
  // disagrees with the default — i.e. the user explicitly chose a
  // non-default locale and needs to be redirected to the prefixed URL.
  if (cookieIsDefault) {
    // Cookie says default (or no cookie). next-intl's Accept-Language
    // detection would also want to redirect zh-CN visitors to /zh-CN/...
    // Do that ourselves to avoid the rewrite+redirect combination.
    const accept = pickFromAcceptLanguage(request.headers.get("accept-language"));
    if (accept && accept !== defaultLocale) {
      return intl(request);
    }
    return NextResponse.next();
  }

  // Cookie is non-default but URL is unprefixed. Hand off so next-intl
  // redirects the user to /<locale>/<path>.
  return intl(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|auth|.*\\..*).*)"],
};
