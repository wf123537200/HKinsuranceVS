"""scripts/generate-extraction-templates.py
Generate 38 empty markdown templates for ChatGPT extraction.
Reads DB via prisma, writes docs/product-vectors/extractions/{slug}.md.
"""
import sqlite3
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DB = ROOT / "dev.db"
OUT_DIR = ROOT / "docs" / "product-vectors" / "extractions"

TEMPLATE = """# {NAME_ZH} ({NAME_EN})

> **slug**: `{SLUG}`
> **company**: {COMPANY_NAME}
> **category**: {CATEGORY}
> **source_pdf**: `docs/product-vectors/pdfs/{SLUG}.pdf`
> **language_original**: {LANG}

## TL;DR
<!-- One sentence (<= 50 chars) describing what this product is and who it is for. -->

## Core Features
<!-- 3-5 bullets, each <= 30 chars. Focus on differentiators, not generic terms. -->
- <!-- feature 1 -->
- <!-- feature 2 -->
- <!-- feature 3 -->
- <!-- feature 4 (optional) -->
- <!-- feature 5 (optional) -->

## Key Parameters
<!-- Use a markdown table. Copy from the PDF brochure. Convert all currency to original unit. -->
| Field (字段) | Value (值) |
| --- | --- |
| <!-- field --> | <!-- value --> |

## Target Audience
<!-- 1-2 sentences describing the ideal buyer. Include age range, life stage, financial profile. -->

## Pros / Strengths
<!-- 3-5 bullets. Be specific to this product, not generic insurance platitudes. -->
- <!-- pro 1 -->
- <!-- pro 2 -->
- <!-- pro 3 -->

## Cons / Caveats
<!-- 3-5 bullets. What the salesperson will NOT tell you. -->
- <!-- con 1 -->
- <!-- con 2 -->
- <!-- con 3 -->

## Competitor Comparison
<!-- Pick 2-3 directly competing products. Use a table. If unsure, omit this section. -->
| Dimension (对比维度) | {NAME_ZH} | Competitor A | Competitor B |
| --- | --- | --- | --- |
| <!-- dimension --> | <!-- this --> | <!-- theirs --> | <!-- theirs --> |

## Common Misconceptions
<!-- 2-4 bullets. The things buyers often get wrong about this product. -->
- <!-- misconception 1 -->
- <!-- misconception 2 -->

## Sales Pitch / Tagline
<!-- One marketing-style line, in original language. Useful for product hero text. -->

## Keywords (for embedding search)
<!-- Comma-separated. Include: product type, key benefit words, company slug, region. -->
"""

def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    con = sqlite3.connect(str(DB))
    rows = con.execute("""
        SELECT p.slug, p.displayName, p.name, p.category, p.region, c.displayName AS companyName
        FROM products p JOIN companies c ON p.companyId = c.id
        WHERE p.dataStatus IN ('manual_verified', 'candidate') AND p.localPdfPath IS NOT NULL
        ORDER BY p.slug
    """).fetchall()
    con.close()

    for slug, display_name, name, category, region, company_name in rows:
        cat_label = "critical_illness" if category == "CRITICAL_ILLNESS" else "savings"
        lang = "zh-HK" if region == "Hong Kong" else "zh-CN"
        md = (TEMPLATE
              .replace("{NAME_ZH}", display_name)
              .replace("{NAME_EN}", name)
              .replace("{SLUG}", slug)
              .replace("{COMPANY_NAME}", company_name)
              .replace("{CATEGORY}", cat_label)
              .replace("{LANG}", lang))
        out = OUT_DIR / f"{slug}.md"
        out.write_text(md, encoding="utf-8")
        print(f"  {slug}.md")

    print(f"\nGenerated {len(rows)} templates in {OUT_DIR}")

if __name__ == "__main__":
    main()