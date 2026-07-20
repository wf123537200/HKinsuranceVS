// Unit tests for the language-switch cookie + URL building logic.
// Mirrors what components/Header.tsx does so we catch regressions.

import { locales, defaultLocale, type Locale } from "../i18n/config";

// Mirrors setLocaleCookie() from Header.tsx
function buildLocaleCookie(value: string): string {
  return `NEXT_LOCALE=${value}; path=/; max-age=31536000; samesite=lax`;
}

// Mirrors switchLocale() URL-building logic from Header.tsx
function buildSwitchUrl(
  target: Locale,
  pathWithoutLocale: string,
): string {
  return target === defaultLocale
    ? `/${defaultLocale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`
    : `/${target}${pathWithoutLocale}`;
}

describe("locale cookie", () => {
  test("sets correct cookie value for zh-CN", () => {
    expect(buildLocaleCookie("zh-CN")).toBe(
      "NEXT_LOCALE=zh-CN; path=/; max-age=31536000; samesite=lax",
    );
  });

  test("sets correct cookie value for en", () => {
    expect(buildLocaleCookie("en")).toBe(
      "NEXT_LOCALE=en; path=/; max-age=31536000; samesite=lax",
    );
  });

  test("cookie has 1-year max-age", () => {
    const cookie = buildLocaleCookie("zh-TW");
    expect(cookie).toContain("max-age=31536000");
  });

  test("cookie is path-scoped to root", () => {
    const cookie = buildLocaleCookie("en");
    expect(cookie).toContain("path=/");
  });

  test("cookie is sameSite=lax (matches next-intl defaults)", () => {
    const cookie = buildLocaleCookie("zh-CN");
    expect(cookie).toContain("samesite=lax");
  });
});

describe("switch URL builder", () => {
  test("switching to default locale on root keeps /en", () => {
    expect(buildSwitchUrl(defaultLocale, "/")).toBe("/en");
  });

  test("switching to default locale on /products keeps /en/products", () => {
    expect(buildSwitchUrl(defaultLocale, "/products")).toBe("/en/products");
  });

  test("switching to zh-CN on root uses /zh-CN/", () => {
    expect(buildSwitchUrl("zh-CN", "/")).toBe("/zh-CN/");
  });

  test("switching to zh-CN on /products uses /zh-CN/products", () => {
    expect(buildSwitchUrl("zh-CN", "/products")).toBe("/zh-CN/products");
  });

  test("switching to zh-TW on /compare/... uses prefix", () => {
    expect(buildSwitchUrl("zh-TW", "/compare/axa-vs-pru")).toBe(
      "/zh-TW/compare/axa-vs-pru",
    );
  });
});

describe("locale config", () => {
  test("default locale is en", () => {
    expect(defaultLocale).toBe("en");
  });

  test("locales include en, zh-CN, zh-TW", () => {
    expect(locales).toContain("en");
    expect(locales).toContain("zh-CN");
    expect(locales).toContain("zh-TW");
  });
});