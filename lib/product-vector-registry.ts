// ProductVector v2.4 registry — single entry point for reading vector JSON files.
//
// File layout:
//   /data/vectors/{companySlug}/{productSlug}.vector.json      (full pool, 45 products)
//   /data/vectors-selected/{companySlug}/{productSlug}.vector.json (curated hot set, optional)
//   /data/compare-field-registry-v2.18.json                   (field registry, v2.11)
//
// All readers are fault-tolerant: a single bad JSON logs a warning but never throws.

import { promises as fs } from "node:fs";
import path from "node:path";
import { getByPath, isEmptyValue } from "./product-vector-formatters";

const DATA_DIR = path.join(process.cwd(), "data");
const VECTORS_DIR = path.join(DATA_DIR, "vectors");
const VECTORS_SELECTED_DIR = path.join(DATA_DIR, "vectors-selected");
const REGISTRY_PATH = path.join(DATA_DIR, "compare-field-registry-v2.18.json");

export type ProductVectorV24 = {
  product_vector_version: string;
  base: {
    product_id: string;
    slug: string;
    product_name: string;
    product_name_en?: string | null;
    company_slug: string;
    company_name: string;
    region?: string;
    category: "savings" | "critical_illness" | string;
    category_zh?: string;
    subcategory?: string;
    policy_currency?: string[];
    policy_term?: string;
    premium_term?: string[];
    entry_age?: string;
    payment_mode?: string | null;
    local_pdf_path?: string;
    source_pdf_filename?: string;
    is_hot_discussed?: boolean;
    market_attention?: string;
  };
  core?: Record<string, any>;
  modules?: Record<string, any>;
  compare_profile?: Record<string, any>;
  product_features?: ProductFeature[];
  feature_tags?: string[];
  /** Frontend-facing feature cards. Title + summary only. */
  display_features?: DisplayFeature[];
  comparison_flags?: Record<string, any>;
  source_trace?: Record<string, any>;
  extraction_meta?: Record<string, any>;
};

export type ProductFeature = {
  feature_id?: string;
  feature_name?: string;
  category?: string;
  feature_type?: string;
  availability?: boolean;
  short_description?: string | null;
  detail_description?: string | null;
  display_priority?: number;
  compare_key?: string;
  source_pages?: number[];
  evidence_quote?: string;
};

/**
 * Frontend-facing feature card. Sourced from the vector's `display_features`
 * array — only `title` and `summary` are rendered. Underlying evidence lives
 * in `product_features[]` and `feature_tags[]` and is NOT shown to visitors.
 */
export type DisplayFeature = {
  title: string;
  summary: string;
  category?: string;
  priority?: number;
  source_feature_ids?: string[];
  source_tags?: string[];
};

export type CompareFieldRegistry = {
  version?: string;
  savings_fields?: CompareField[];
  critical_illness_fields?: CompareField[];
  [key: string]: any;
};

export type CompareField = {
  section: string;
  label: string;
  /** Primary path tried first. */
  path: string;
  /** Optional fallback paths tried in order when primary is empty. */
  fallbackPaths?: string[];
  advantageRule?:
    | "higher_is_better"
    | "lower_is_better"
    | "more_options"
    | "true_is_better"
    | "no_auto_judgement";
  format?: string;
  /** Display type. Drives percent/boolean/number formatting at render time. */
  valueType?:
    | "percentage"
    | "number"
    | "boolean"
    | "text"
    | "string_list"
    | "currency_list"
    | string;
  /** Display truncation hint (chars). */
  maxLength?: number;
};

/**
 * Read a value from a vector by trying primary path first, then each
 * fallback path. Returns the first non-empty value (per isEmptyValue).
 * Always returns undefined if the value is empty everywhere.
 */
export function getCompareValue(
  vector: ProductVectorV24 | null | undefined,
  field: CompareField | { path: string; fallbackPaths?: string[] }
): unknown {
  if (!vector) return undefined;
  const paths = [field.path, ...(field.fallbackPaths || [])].filter(Boolean) as string[];
  for (const p of paths) {
    const v = getByPath(vector, p);
    if (!isEmptyValue(v)) return v;
  }
  return undefined;
}

// ---------- internal cache ----------

let _allCache: { ts: number; data: ProductVectorV24[] } | null = null;
let _hotCache: { ts: number; data: ProductVectorV24[] } | null = null;
let _registryCache: { ts: number; data: CompareFieldRegistry | null } | null = null;
const CACHE_TTL_MS = 5_000;

// ---------- internal readers ----------

async function listVectorFiles(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files: string[] = [];
    for (const e of entries) {
      if (e.isDirectory()) {
        const sub = path.join(dir, e.name);
        const subEntries = await fs.readdir(sub);
        for (const f of subEntries) {
          if (f.endsWith(".vector.json")) {
            files.push(path.join(sub, f));
          }
        }
      } else if (e.isFile() && e.name.endsWith(".vector.json")) {
        files.push(path.join(dir, e.name));
      }
    }
    return files;
  } catch (err) {
    // directory missing -> empty list, never throw
    return [];
  }
}

async function readVectorFile(file: string): Promise<ProductVectorV24 | null> {
  try {
    const raw = await fs.readFile(file, "utf8");
    const data = JSON.parse(raw) as ProductVectorV24;
    if (!data?.base?.slug) {
      console.warn(`[vector-registry] skip ${file}: missing base.slug`);
      return null;
    }
    return data;
  } catch (err: any) {
    console.warn(`[vector-registry] failed to read ${file}: ${err.message ?? err}`);
    return null;
  }
}

async function loadAllFromDir(dir: string): Promise<ProductVectorV24[]> {
  const files = await listVectorFiles(dir);
  const out: ProductVectorV24[] = [];
  for (const f of files) {
    const v = await readVectorFile(f);
    if (v) out.push(v);
  }
  return out;
}

// ---------- public API ----------

/** All 45 site products. Cached for 5s. */
export async function getAllProductVectors(): Promise<ProductVectorV24[]> {
  if (_allCache && Date.now() - _allCache.ts < CACHE_TTL_MS) return _allCache.data;
  const data = await loadAllFromDir(VECTORS_DIR);
  // deterministic sort: company then product_name
  data.sort((a, b) => {
    const c = (a.base.company_name || "").localeCompare(b.base.company_name || "", "zh");
    if (c !== 0) return c;
    return (a.base.product_name || "").localeCompare(b.base.product_name || "", "zh");
  });
  _allCache = { ts: Date.now(), data };
  return data;
}

/** Single product by company + slug. Returns null if not found. */
export async function getProductVector(
  companySlug: string,
  productSlug: string
): Promise<ProductVectorV24 | null> {
  const all = await getAllProductVectors();
  return all.find((v) => v.base.company_slug === companySlug && v.base.slug === productSlug) ?? null;
}

/** Hot products: tries vectors-selected first, falls back to is_hot_discussed / market_attention. */
export async function getHotProductVectors(): Promise<ProductVectorV24[]> {
  if (_hotCache && Date.now() - _hotCache.ts < CACHE_TTL_MS) return _hotCache.data;
  const selected = await loadAllFromDir(VECTORS_SELECTED_DIR);
  let data: ProductVectorV24[];
  if (selected.length > 0) {
    data = selected;
  } else {
    const all = await getAllProductVectors();
    data = all.filter(
      (v) =>
        v.base.is_hot_discussed === true ||
        v.base.market_attention === "hot_discussed"
    );
  }
  data.sort((a, b) => (a.base.product_name || "").localeCompare(b.base.product_name || "", "zh"));
  _hotCache = { ts: Date.now(), data };
  return data;
}

/** All products in a category. */
export async function getProductVectorsByCategory(
  category: "savings" | "critical_illness"
): Promise<ProductVectorV24[]> {
  const all = await getAllProductVectors();
  return all.filter((v) => v.base.category === category);
}

/** All products for a company. */
export async function getProductVectorsByCompany(companySlug: string): Promise<ProductVectorV24[]> {
  const all = await getAllProductVectors();
  return all.filter((v) => v.base.company_slug === companySlug);
}

/** Same-category products excluding the given one — used by compare UI. */
export async function getComparableProducts(productSlug: string): Promise<ProductVectorV24[]> {
  const all = await getAllProductVectors();
  const me = all.find((v) => v.base.slug === productSlug);
  if (!me) return [];
  return all.filter(
    (v) => v.base.slug !== productSlug && v.base.category === me.base.category
  );
}

// ---------- registry (compare field registry v2.4) ----------

export async function loadCompareFieldRegistry(): Promise<CompareFieldRegistry | null> {
  if (_registryCache && Date.now() - _registryCache.ts < CACHE_TTL_MS) return _registryCache.data;
  try {
    const raw = await fs.readFile(REGISTRY_PATH, "utf8");
    const data = JSON.parse(raw) as CompareFieldRegistry;
    _registryCache = { ts: Date.now(), data };
    return data;
  } catch (err: any) {
    console.warn(`[vector-registry] compare field registry not loaded: ${err.message ?? err}`);
    _registryCache = { ts: Date.now(), data: null };
    return null;
  }
}

// ---------- advantage rule ----------

export type Advantage = "a" | "b" | "none";

export function getAdvantage(
  aValue: unknown,
  bValue: unknown,
  rule: CompareField["advantageRule"] | undefined
): Advantage {
  if (!rule || rule === "no_auto_judgement") return "none";
  if (rule === "higher_is_better") {
    if (typeof aValue === "number" && typeof bValue === "number") {
      if (aValue > bValue) return "a";
      if (bValue > aValue) return "b";
    }
  }
  if (rule === "more_options") {
    if (Array.isArray(aValue) && Array.isArray(bValue)) {
      if (aValue.length > bValue.length) return "a";
      if (bValue.length > aValue.length) return "b";
    }
  }
  if (rule === "true_is_better") {
    if (aValue === true && bValue !== true) return "a";
    if (bValue === true && aValue !== true) return "b";
  }
  return "none";
}

// ---------- aggregates ----------

export type CompanyStats = {
  companySlug: string;
  companyName: string;
  total: number;
  savings: number;
  critical_illness: number;
  hot: number;
};

export async function getCompanyStats(): Promise<CompanyStats[]> {
  const all = await getAllProductVectors();
  const map = new Map<string, CompanyStats>();
  for (const v of all) {
    const key = v.base.company_slug;
    const cur =
      map.get(key) ??
      {
        companySlug: key,
        companyName: v.base.company_name,
        total: 0,
        savings: 0,
        critical_illness: 0,
        hot: 0,
      };
    cur.total++;
    if (v.base.category === "savings") cur.savings++;
    else if (v.base.category === "critical_illness") cur.critical_illness++;
    if (v.base.is_hot_discussed || v.base.market_attention === "hot_discussed") cur.hot++;
    map.set(key, cur);
  }
  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

export { getByPath };

// ---------- boolean fallback (feature_tags / display_features) ----------

/**
 * When a compare_profile boolean field is empty, look for a match in
 * `feature_tags` or in display_features title+summary text.
 * Used ONLY for boolean "是否类" fields. Never for numeric / IRR / counts.
 */
export const BOOLEAN_FIELD_FALLBACKS: Record<string, string[]> = {
  "compare_profile.has_multiple_claims": [
    "multiple_claims",
    "10x_multiple_claims",
    "多次赔付",
    "多次危疾",
  ],
  "compare_profile.has_cancer_multiple_claims": [
    "cancer_multiple_claims",
    "persistent_cancer_cash",
    "cancer_cash",
    "癌症持续",
    "癌症多次",
  ],
  "compare_profile.has_heart_stroke_multiple_claims": [
    "heart_stroke_multiple_claims",
    "heart_attack",
    "stroke",
    "心脏病",
    "中风",
  ],
  "compare_profile.has_icu_benefit": [
    "icu_benefit",
    "icu",
    "ICU",
    "深切治疗",
  ],
  "compare_profile.has_guaranteed_cash_value": [
    "guaranteed_cash_value",
    "保证现金价值",
    "保證現金價值",
  ],
  "compare_profile.has_non_guaranteed_bonus": [
    "non_guaranteed_bonus",
    "bonus",
    "dividend",
    "红利",
    "分红",
    "分紅",
  ],
  "compare_profile.has_policy_loan": [
    "policy_loan",
    "保单贷款",
    "保單貸款",
  ],
  "compare_profile.supports_policy_split": [
    "policy_split",
    "保单分拆",
    "保單分拆",
  ],
  "compare_profile.supports_change_insured": [
    "change_insured",
    "更改受保人",
    "更换受保人",
  ],
};

export function getBooleanFallback(
  vector: ProductVectorV24 | null | undefined,
  fieldPath: string
): boolean | null {
  if (!vector) return null;
  const keys = BOOLEAN_FIELD_FALLBACKS[fieldPath];
  if (!keys) return null;
  const tags = vector.feature_tags || [];
  const loweredTags = tags.map((t) => String(t).toLowerCase());
  if (keys.some((k) => loweredTags.some((t) => t.includes(k.toLowerCase())))) {
    return true;
  }
  const text = (vector.display_features || [])
    .map((f) => `${f.title || ""} ${f.summary || ""}`)
    .join(" ");
  if (text && keys.some((k) => text.includes(k))) {
    return true;
  }
  return null;
}
