// ProductVector v2.4 formatters.
// Rules: null / undefined / "" / [] / {} -> "暂无数据"
//        true -> "支持"/"有"
//        false -> "暂无"
//        string[] -> joined with " / "
//        number -> as-is
//        object -> human readable summary (no [object Object])
// Forbidden to render: null, undefined, [object Object], {}, []

const MISSING = "暂无数据";
const NO = "暂无";

export function formatVectorValue(value: unknown): string {
  if (value === null || value === undefined) return MISSING;
  if (typeof value === "string") {
    if (value.trim() === "") return MISSING;
    return value.trim();
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return MISSING;
    return String(value);
  }
  if (typeof value === "boolean") {
    return value ? "支持" : NO;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return MISSING;
    const parts = value
      .map((v) => formatVectorValue(v))
      .filter((s) => s && s !== MISSING);
    return parts.length ? parts.join(" / ") : MISSING;
  }
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj);
    if (keys.length === 0) return MISSING;
    // try to find a primary text/label field
    const primary =
      (obj.label as string) ??
      (obj.name as string) ??
      (obj.title as string) ??
      (obj.text as string) ??
      (obj.summary as string) ??
      (obj.value as unknown);
    if (typeof primary === "string" && primary.trim()) return primary.trim();
    if (typeof primary === "number") return String(primary);
    if (typeof primary === "boolean") return primary ? "支持" : NO;
    // summarize key=value pairs
    const summary = keys
      .slice(0, 4)
      .map((k) => {
        const v = obj[k];
        if (v === null || v === undefined) return null;
        if (typeof v === "object") return null;
        return `${k}=${String(v)}`;
      })
      .filter(Boolean)
      .join(", ");
    return summary || MISSING;
  }
  return MISSING;
}

export function formatArray(value: unknown): string {
  return formatVectorValue(value);
}

/** Safe path getter: returns undefined when any segment is missing. */
export function getByPath(obj: unknown, path: string): unknown {
  if (obj == null || !path) return undefined;
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return cur;
}

/** Truncate text to a max length, ending at a word boundary. */
export function truncate(text: string, maxLen: number): string {
  if (!text) return MISSING;
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLen) return cleaned;
  return cleaned.slice(0, maxLen).replace(/[,，。.;；:：\s]+$/, "") + "…";
}

/**
 * Format a long Chinese text field for the compare table.
 * - null/empty -> "暂无数据"
 * - <= MAX_CHARS -> as-is
 * - > MAX_CHARS -> truncated to MAX_CHARS + "…"
 *
 * Returns the visible text. Components can use isLongText() / fullText()
 * pattern to add an "展开" / "收起" button.
 */
export const LONG_TEXT_MAX_CHARS = 60;

export function isLongText(text: string): boolean {
  if (!text) return false;
  return text.length > LONG_TEXT_MAX_CHARS;
}

export function formatLongText(text: unknown): string {
  if (text === null || text === undefined) return MISSING;
  const s = typeof text === "string" ? text : formatVectorValue(text);
  if (!s || s === MISSING) return MISSING;
  return truncate(s, LONG_TEXT_MAX_CHARS);
}

/**
 * Returns true when the value is "empty" in a user-visible sense:
 * null / undefined / "" / [] / {}.
 */
export function isEmptyValue(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value as object).length === 0;
  if (typeof value === "number") return !Number.isFinite(value);
  return false;
}

/**
 * Boolean -> Chinese display.
 *   true  -> "是"
 *   false -> "否"
 *   null/undefined -> "暂无数据"
 */
export function formatBoolean(value: boolean | null | undefined): string {
  if (value === true) return "是";
  if (value === false) return "否";
  return "暂无数据";
}

/**
 * Category code -> localized label. Never return raw "critical_illness" / "savings".
 */
export function formatCategory(category: string | undefined | null): string {
  if (!category) return "暂无数据";
  const c = category.toLowerCase();
  if (c === "critical_illness") return "重疾险";
  if (c === "savings") return "储蓄险";
  if (c === "health") return "健康险";
  return category;
}
