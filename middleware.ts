import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n/config";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});

export const config = {
  // Locale routing applies to every page except:
  //   api         — Next.js / route handlers
  //   _next/*     — Next.js internals
  //   _vercel/*   — Vercel internals
  //   auth/*      — Supabase email-link / OAuth callback (must be
  //                 reachable without a locale prefix)
  //   anything with a file extension (assets, .well-known, etc.)
  matcher: ["/((?!api|_next|_vercel|auth|.*\\..*).*)"],
};
