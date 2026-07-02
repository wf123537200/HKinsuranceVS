// Compare-format-utils — format raw vector values + compute advantage badges
// for the comparison table. Designed for ProductVector v2.11 with typed
// compare-profile fields (percentage, number, boolean, text, string_list,
// currency_list).
//
// Design rules (per spec):
//   - Display-only formatting (percent / number / boolean / text). Never
//     mutate the raw value stored in the vector JSON.
//   - Percentage fields get a "%" suffix appended at display time only.
//   - Advantage = one side is strictly better OR one side has data while
//     the other is empty. Empty on both sides -> no advantage and the row
//     is hidden by the caller.
//   - Text fields never trigger an auto advantage.

export type CompareAdvantage =
  | "left_better"
  | "right_better"
  | "left_has_data"
  | "right_has_data"
  | "same"
  | null;

/**
 * Loose compare-field type — matches the keys the registry adds on top of
 * the base `CompareField` (path / section / label / advantageRule).
 * Kept loose so we can read any registry shape without import cycles.
 */
export type CompareFieldLike = {
  path?: string;
  section?: string;
  label?: string;
  advantageRule?:
    | "higher_is_better"
    | "lower_is_better"
    | "more_options"
    | "true_is_better"
    | "no_auto_judgement";
  valueType?: string;
  maxLength?: number;
  fallbackPaths?: string[];
  format?: string;
  [key: string]: unknown;
};

/** True when the raw value is "empty" in a user-visible sense. */
export function isEmptyCompareValue(value: unknown): boolean {
  if (value === null || value === undefined || value === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.keys(value as Record<string, unknown>).length === 0
  ) {
    return true;
  }
  return false;
}

/** Coerce to a number for percentage/number comparison. Returns null when unparseable. */
export function toNumberCompareValue(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const cleaned = value.replace("%", "").trim();
    if (!cleaned) return null;
    const n = Number(cleaned);
    return Number.isNaN(n) ? null : n;
  }
  return null;
}

/**
 * Format a raw value for display. Honors field.valueType when present,
 * otherwise falls back to a string representation that never shows
 * "[object Object]" / "null" / "undefined".
 *
 * - percentage: appends "%" if missing (raw is e.g. 100 -> "100%")
 * - boolean:    true -> "是" / false -> "否"
 * - number:     raw number, no suffix
 * - text:       as-is
 * - string_list / currency_list: joined with " / "
 * - object:     JSON string (rare fallback)
 */
export function formatCompareValue(value: unknown, field?: CompareFieldLike): string {
  if (isEmptyCompareValue(value)) return "暂无数据";

  const valueType = field?.valueType;

  if (valueType === "percentage") {
    if (typeof value === "number") return `${value}%`;
    const text = String(value).trim();
    if (!text) return "暂无数据";
    if (text.endsWith("%")) return text;
    const numeric = Number(text);
    if (!Number.isNaN(numeric)) return `${numeric}%`;
    return text;
  }

  if (valueType === "boolean") {
    if (value === true) return "是";
    if (value === false) return "否";
    return "暂无数据";
  }

  if (valueType === "number") {
    if (typeof value === "number") return Number.isFinite(value) ? String(value) : "暂无数据";
    const n = Number(String(value).replace("%", "").trim());
    return Number.isNaN(n) ? "暂无数据" : String(n);
  }

  if (Array.isArray(value)) {
    return value.length ? value.join(" / ") : "暂无数据";
  }

  if (typeof value === "object" && value !== null) {
    try {
      return JSON.stringify(value);
    } catch {
      return "暂无数据";
    }
  }

  if (typeof value === "boolean") return value ? "是" : "否";
  return String(value);
}

/**
 * Decide which side has the advantage, if any. Returns null when both
 * sides are empty (caller hides the row) or when the field type does not
 * support auto-judgement.
 *
 * Rules:
 *   - percentage / number with higher_is_better:
 *       * both numeric -> strict greater wins
 *       * one numeric + one empty -> the numeric side wins (has_data)
 *   - percentage / number with lower_is_better: same as above but with <
 *   - boolean with true_is_better:
 *       * true vs false -> true side wins
 *       * true vs empty -> true side wins (has_data)
 *   - more_options (arrays): longer wins; ties no advantage
 *   - everything else (text etc.) -> no auto judgement
 */
export function getCompareAdvantage(
  leftRaw: unknown,
  rightRaw: unknown,
  field: CompareFieldLike | undefined
): CompareAdvantage {
  const leftEmpty = isEmptyCompareValue(leftRaw);
  const rightEmpty = isEmptyCompareValue(rightRaw);

  if (leftEmpty && rightEmpty) return null;

  const valueType = field?.valueType;
  const rule = field?.advantageRule;

  // Numeric / percentage comparison
  if (
    valueType === "percentage" ||
    valueType === "number" ||
    rule === "higher_is_better" ||
    rule === "lower_is_better"
  ) {
    const leftNum = toNumberCompareValue(leftRaw);
    const rightNum = toNumberCompareValue(rightRaw);

    if (rule === "lower_is_better") {
      if (leftNum !== null && rightNum !== null) {
        if (leftNum < rightNum && leftNum > 0) return "left_better";
        if (rightNum < leftNum && rightNum > 0) return "right_better";
        if (leftNum === rightNum) return "same";
      }
      if (leftNum !== null && rightEmpty) return "left_has_data";
      if (rightNum !== null && leftEmpty) return "right_has_data";
      return null;
    }

    // higher_is_better (default for numeric / percentage)
    if (rule === "higher_is_better" || valueType === "number" || valueType === "percentage") {
      if (leftNum !== null && rightNum !== null) {
        if (leftNum > rightNum) return "left_better";
        if (rightNum > leftNum) return "right_better";
        return "same";
      }
      if (leftNum !== null && rightEmpty) return "left_has_data";
      if (rightNum !== null && leftEmpty) return "right_has_data";
      return null;
    }
  }

  // Boolean comparison
  if (valueType === "boolean" && rule === "true_is_better") {
    if (leftRaw === true && rightRaw === false) return "left_better";
    if (rightRaw === true && leftRaw === false) return "right_better";
    if (leftRaw === true && rightEmpty) return "left_has_data";
    if (rightRaw === true && leftEmpty) return "right_has_data";
    return null;
  }

  // more_options: arrays with longer wins (no has_data semantic)
  if (rule === "more_options") {
    if (Array.isArray(leftRaw) && Array.isArray(rightRaw)) {
      if (leftRaw.length > rightRaw.length) return "left_better";
      if (rightRaw.length > leftRaw.length) return "right_better";
      if (leftRaw.length === rightRaw.length) return "same";
    }
    return null;
  }

  // Text / unknown: never auto-judge
  return null;
}

export function getAdvantageLabel(result: CompareAdvantage): string | null {
  if (
    result === "left_better" ||
    result === "right_better" ||
    result === "left_has_data" ||
    result === "right_has_data"
  ) {
    return "优势";
  }
  return null;
}

export function getAdvantageTooltip(result: CompareAdvantage): string | null {
  if (result === "left_better" || result === "right_better") {
    return "该项数值更高或保障更明确。";
  }
  if (result === "left_has_data" || result === "right_has_data") {
    return "该产品有明确数据，对比产品暂无明确数据。";
  }
  return null;
}
