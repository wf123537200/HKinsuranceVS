// Unit tests for middleware i18n routing logic.
//
// We don't test the middleware function directly (it pulls in next-intl
// which requires the Next.js runtime). Instead we extract the pure logic
// into a helper that's trivial to test.

import { locales, defaultLocale } from "../i18n/config";

const BOT_PATTERN = /(googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|sogou|exabot|facebot|ia_archiver)/i;

// Mirror of the logic in middleware.ts. If the upstream logic changes,
// update this too.
function decideRoute(userAgent: string, pathname: string): {
  action: "rewrite" | "delegate";
  rewriteTo?: string;
} {
  const hasLocalePrefix = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (!hasLocalePrefix && BOT_PATTERN.test(userAgent)) {
    const rewritten = pathname === "/" ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
    return { action: "rewrite", rewriteTo: rewritten };
  }
  return { action: "delegate" };
}

describe("middleware routing decisions", () => {
  describe("search engine crawlers", () => {
    test("Googlebot hitting / is rewritten (no visible redirect)", () => {
      const r = decideRoute("Mozilla/5.0 (compatible; Googlebot/2.1)", "/");
      expect(r.action).toBe("rewrite");
      expect(r.rewriteTo).toBe("/en");
    });

    test("Googlebot hitting /products is rewritten to /en/products", () => {
      const r = decideRoute("Mozilla/5.0 (compatible; Googlebot/2.1)", "/products");
      expect(r.action).toBe("rewrite");
      expect(r.rewriteTo).toBe("/en/products");
    });

    test("Bingbot hitting / is rewritten", () => {
      const r = decideRoute("Mozilla/5.0 (compatible; bingbot/2.0)", "/");
      expect(r.action).toBe("rewrite");
    });

    test("Baiduspider hitting /products/critical-illness is rewritten", () => {
      const r = decideRoute(
        "Mozilla/5.0 (compatible; Baiduspider/2.0)",
        "/products/critical-illness",
      );
      expect(r.action).toBe("rewrite");
      expect(r.rewriteTo).toBe("/en/products/critical-illness");
    });

    test("Bot hitting /zh-CN/products is NOT rewritten (already prefixed)", () => {
      const r = decideRoute(
        "Mozilla/5.0 (compatible; Googlebot/2.1)",
        "/zh-CN/products",
      );
      expect(r.action).toBe("delegate");
    });

    test("Bot hitting /en is NOT rewritten (already prefixed)", () => {
      const r = decideRoute(
        "Mozilla/5.0 (compatible; Googlebot/2.1)",
        "/en",
      );
      expect(r.action).toBe("delegate");
    });
  });

  describe("regular users", () => {
    test("Chrome user hitting / is delegated to next-intl", () => {
      const r = decideRoute(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "/",
      );
      expect(r.action).toBe("delegate");
    });

    test("Safari user hitting /products is delegated", () => {
      const r = decideRoute(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15",
        "/products",
      );
      expect(r.action).toBe("delegate");
    });

    test("User hitting /zh-CN is delegated", () => {
      const r = decideRoute(
        "Mozilla/5.0 (Windows NT 10.0)",
        "/zh-CN",
      );
      expect(r.action).toBe("delegate");
    });
  });

  describe("matcher config", () => {
    // The matcher strings we ship to Next.js. These must stay in sync
    // with the actual export in middleware.ts.
    test("matcher config is exported with the expected patterns", () => {
      // Read the file and look for the config export. Lightweight but
      // catches accidental deletion.
      const fs = require("fs");
      const src = fs.readFileSync(
        require("path").join(__dirname, "..", "middleware.ts"),
        "utf8",
      );
      expect(src).toMatch(/matcher:\s*\[/);
      expect(src).toMatch(/"\/"/);
      expect(src).toMatch(/"\/\(\(\?!api/);
    });
  });
});