// i18n completeness tests.
//
// These tests catch two kinds of regressions:
//   1. Messages files for different locales drift apart (key added to
//      en.json but not zh-CN.json).
//   2. Pages or components have hard-coded English strings instead of
//      using the t() / getTranslations() helpers.
//
// Strategy:
//   - Parse every messages/<locale>.json into a flat key->value map.
//   - For each non-default locale, assert it has the same set of leaf
//     keys as en.json (the source of truth).
//   - Scan every page.tsx / component .tsx under app/[locale]/ and
//     components/ for JSX text content (e.g. <h1>Hello</h1>) and flag
//     any that look like English prose rather than i18n references.
//
// The English-text scan is heuristic: it looks for capitalized words
// inside JSX text nodes. False positives are possible (logos, brand
// names like "Policy Vector") but the developer can review the diff.

import * as fs from "fs";
import * as path from "path";

const ROOT = path.join(__dirname, "..");
const MESSAGES_DIR = path.join(ROOT, "messages");
const LOCALES = ["en", "zh-CN", "zh-TW"] as const;
type Locale = (typeof LOCALES)[number];

type Messages = Record<string, any>;

function loadMessages(locale: Locale): Messages {
  const file = path.join(MESSAGES_DIR, `${locale}.json`);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function flattenKeys(
  obj: Messages,
  prefix = "",
  out: string[] = [],
): string[] {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      flattenKeys(v, key, out);
    } else {
      out.push(key);
    }
  }
  return out;
}

describe("i18n message file completeness", () => {
  test("every locale file exists", () => {
    for (const locale of LOCALES) {
      const file = path.join(MESSAGES_DIR, `${locale}.json`);
      expect(fs.existsSync(file)).toBe(true);
    }
  });

  test("every locale file is valid JSON", () => {
    for (const locale of LOCALES) {
      expect(() => loadMessages(locale)).not.toThrow();
    }
  });

  test("zh-CN has every key that en has (en is source of truth)", () => {
    const enKeys = new Set(flattenKeys(loadMessages("en")));
    const zhCnKeys = new Set(flattenKeys(loadMessages("zh-CN")));
    const missing = [...enKeys].filter((k) => !zhCnKeys.has(k));
    expect(missing).toEqual([]);
  });

  test("zh-TW has every key that en has", () => {
    const enKeys = new Set(flattenKeys(loadMessages("en")));
    const zhTwKeys = new Set(flattenKeys(loadMessages("zh-TW")));
    const missing = [...enKeys].filter((k) => !zhTwKeys.has(k));
    expect(missing).toEqual([]);
  });

  test("no locale has extra keys not present in en (catches drift)", () => {
    const enKeys = new Set(flattenKeys(loadMessages("en")));
    for (const locale of LOCALES) {
      if (locale === "en") continue;
      const keys = new Set(flattenKeys(loadMessages(locale)));
      const extra = [...keys].filter((k) => !enKeys.has(k));
      expect({ locale, extra }).toEqual({ locale, extra: [] });
    }
  });

  test("no empty-string values in any locale (excluding locale-specific overrides)", () => {
    // Some keys are intentionally locale-specific and may be empty in
    // other locales (e.g. footer.disclaimerZH is empty in en.json).
    // This test catches truly missing translations, not design choices.
    const allowEmpty = new Set([
      "footer.disclaimerZH", // Chinese-only disclaimer in en.json
      "footer.disclaimerTW", // Traditional-Chinese-only disclaimer
    ]);
    for (const locale of LOCALES) {
      const flat = flattenKeys(loadMessages(locale));
      for (const key of flat) {
        if (allowEmpty.has(key)) continue;
        const value = key
          .split(".")
          .reduce(
            (o: any, k) => (o ? o[k] : undefined),
            loadMessages(locale),
          );
        expect({ locale, key, value }).not.toEqual({
          locale,
          key,
          value: "",
        });
      }
    }
  });
});

describe("page-level i18n usage", () => {
  // Files that should always use getTranslations / useTranslations.
  function walkPages(dir: string, out: string[] = []): string[] {
    if (!fs.existsSync(dir)) return out;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkPages(full, out);
      } else if (entry.isFile() && /\.(tsx|ts)$/.test(entry.name)) {
        out.push(full);
      }
    }
    return out;
  }

  const appPages = walkPages(path.join(ROOT, "app", "[locale]"));
  const components = walkPages(path.join(ROOT, "components"));

  // Components that legitimately don't need i18n because they render
  // non-translatable content (logos, badges, PDF gates, providers, etc.).
  const I18N_OPT_OUT = new Set([
    "components\\CompanyLogo.tsx",
    "components\\HotBadge.tsx",
    "components\\SupabaseSessionProvider.tsx",
    "components\\ClientPdfGate.tsx",
    "components\\CompareTable.tsx",
    "components\\Providers.tsx",
  ]);

  // Pages that are noindex or stub/WIP and don't need full i18n.
  // Add to this set if a page is intentionally English-only or hard-coded.
  const NOINDEX_PAGE_OPT_OUT = new Set([
    "app\\[locale]\\admin\\page.tsx",
    "app\\[locale]\\rankings\\page.tsx",
    "app\\[locale]\\rankings\\critical-illness\\page.tsx",
    "app\\[locale]\\rankings\\savings\\page.tsx",
  ]);

  test("every page.tsx under app/[locale] imports a translation helper", () => {
    const pageFiles = appPages.filter((f) => f.endsWith("page.tsx"));
    expect(pageFiles.length).toBeGreaterThan(0);

    const offenders: { file: string; reason: string }[] = [];
    for (const file of pageFiles) {
      const rel = path.relative(ROOT, file);
      if (NOINDEX_PAGE_OPT_OUT.has(rel)) continue;

      const src = fs.readFileSync(file, "utf8");
      const hasIntl = /getTranslations|useTranslations|useTranslationsAsync/.test(
        src,
      );
      if (!hasIntl) {
        offenders.push({
          file: rel,
          reason: "no getTranslations/useTranslations import",
        });
      }
    }
    expect(offenders).toEqual([]);
  });

  test("every component (unless opted out) uses useTranslations when rendering UI", () => {
    const offenders: { file: string; reason: string }[] = [];
    for (const file of components) {
      const rel = path.relative(ROOT, file);
      if (I18N_OPT_OUT.has(rel)) continue;

      const src = fs.readFileSync(file, "utf8");
      if (
        /\.(test|spec)\./.test(file) ||
        !/from\s+["']react["']/.test(src) ||
        !/return\s*\(/.test(src)
      ) {
        continue;
      }

      const hasIntl = /useTranslations|useTranslationsAsync/.test(src);
      const hasTCall = /\bt\(/.test(src);
      const hasOverride = /\/\/\s*i18n-ok/.test(src);

      if (!hasIntl && !hasTCall && !hasOverride) {
        offenders.push({
          file: rel,
          reason: "renders JSX but does not call useTranslations",
        });
      }
    }
    expect(offenders).toEqual([]);
  });

  test("no English-looking JSX text in page.tsx files", () => {
    // Heuristic: look for text nodes that look like English prose.
    // The `// i18n-ok` marker comment can be used to silence false
    // positives on a specific line.
    const patterns: RegExp[] = [
      // JSX text node with multiple English words
      />\s*[A-Z][a-z]+(?:\s+[A-Za-z]+){1,}\s*</,
      // String literal with English-looking content (not paths, not i18n)
      /["'](?:[A-Z][a-z]+\s+){2,}[a-z]+["']/,
    ];

    const offenders: { file: string; line: number; text: string }[] = [];
    for (const file of appPages) {
      if (!file.endsWith(".tsx")) continue;
      const src = fs.readFileSync(file, "utf8").split("\n");
      for (let i = 0; i < src.length; i++) {
        const line = src[i];
        if (/\/\/\s*i18n-ok/.test(line)) continue;
        if (/href=|src=|className=|\{\{|t\(/.test(line)) continue;
        for (const pattern of patterns) {
          const match = line.match(pattern);
          if (match) {
            offenders.push({
              file: path.relative(ROOT, file),
              line: i + 1,
              text: match[0].trim(),
            });
            break;
          }
        }
      }
    }
    if (offenders.length > 0) {
      // eslint-disable-next-line no-console
      console.warn(
        "Possible English text in JSX:\n" +
          offenders
            .map((o) => `  ${o.file}:${o.line}  ${o.text}`)
            .join("\n"),
      );
    }
    expect(offenders).toEqual([]);
  });
});