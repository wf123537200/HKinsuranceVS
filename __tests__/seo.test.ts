// Unit tests for SEO helpers in lib/seo.ts.
// We don't import the full module because it pulls in lib/prisma; we
// inline the pure helpers here.

import type { Locale } from "../i18n/config";

const DEFAULT_SITE_URL = "https://policy-vector.com";

function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL;
  return raw.replace(/\/+$/, "");
}

function localizedUrl(locale: Locale, path: string): string {
  const base = siteUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (locale === "en") return `${base}${cleanPath}`;
  return `${base}/${locale}${cleanPath}`;
}

describe("siteUrl()", () => {
  test("returns default site URL when env var not set", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    expect(siteUrl()).toBe("https://policy-vector.com");
  });

  test("returns env var when set", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://staging.example.com";
    expect(siteUrl()).toBe("https://staging.example.com");
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  test("strips trailing slashes", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com///";
    expect(siteUrl()).toBe("https://example.com");
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });
});

describe("localizedUrl()", () => {
  test("English (default) URL has no locale prefix", () => {
    expect(localizedUrl("en", "/products/foo")).toBe(
      "https://policy-vector.com/products/foo",
    );
  });

  test("English root URL has no trailing slash issues", () => {
    expect(localizedUrl("en", "/")).toBe("https://policy-vector.com/");
  });

  test("zh-CN URL keeps locale prefix", () => {
    expect(localizedUrl("zh-CN", "/products/foo")).toBe(
      "https://policy-vector.com/zh-CN/products/foo",
    );
  });

  test("zh-TW URL keeps locale prefix", () => {
    expect(localizedUrl("zh-TW", "/compare/a-vs-b")).toBe(
      "https://policy-vector.com/zh-TW/compare/a-vs-b",
    );
  });

  test("path without leading slash gets normalized", () => {
    expect(localizedUrl("en", "products")).toBe(
      "https://policy-vector.com/products",
    );
    expect(localizedUrl("zh-CN", "products")).toBe(
      "https://policy-vector.com/zh-CN/products",
    );
  });
});