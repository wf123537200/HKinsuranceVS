/**
 * ProductVector v2.0 Extraction Prompt
 * 
 * Used to instruct the AI to extract structured product data from PDF text.
 */

export const PRODUCT_VECTOR_V2_SYSTEM_PROMPT = `You are extracting a structured insurance product vector from an official insurance product brochure.

Rules:
1. Only extract information from the provided PDF text.
2. Do not infer or invent missing information.
3. If a field is not found, return null.
4. Do not provide insurance advice.
5. Do not recommend buying any product.
6. Do not rank products.
7. Distinguish guaranteed and non-guaranteed benefits.
8. Distinguish protection, savings, life cover, liquidity, flexibility, and risk modules.
9. If the product is a critical illness product with savings/participating features, fill participating_savings_module.
10. If the product is a savings product with death benefit or life cover, fill life_protection_module.
11. For each important field, return evidence with page number and a short quote.
12. Output valid JSON only.
13. Follow ProductVector v2.0 exactly.
14. Do not include markdown fences in the output.
15. Do not guess IRR, break-even year, or return rates unless explicitly stated in the PDF.
16. If the PDF is in Chinese, extract field values in Chinese. Product name should include both Chinese and English if available.`;

export function buildExtractionPrompt(
  pdfText: string,
  productInfo: {
    productName?: string;
    productSlug?: string;
    companySlug?: string;
    category?: string;
  } | null
): string {
  const productContext = productInfo
    ? `\n\nKnown product information:
- Product: ${productInfo.productName || 'Unknown'}
- Slug: ${productInfo.productSlug || 'Unknown'}
- Company: ${productInfo.companySlug || 'Unknown'}
- Category: ${productInfo.category || 'Unknown'}`
    : '\n\nNo pre-existing product information available. Extract everything from the PDF.';

  return `Extract a ProductVector v2.0 JSON from the following insurance product brochure text.${productContext}

ProductVector v2.0 structure:
{
  "product_vector_version": "v2.0",
  "base": { ... },
  "core": { "critical_illness_core": null or {...}, "savings_core": null or {...} },
  "modules": {
    "participating_savings_module": null or {...},
    "life_protection_module": null or {...},
    "policy_liquidity_module": null or {...},
    "policy_flexibility_module": null or {...},
    "use_case_module": null or {...},
    "risk_module": null or {...}
  },
  "comparison_flags": { ... },
  "source_trace": { "source_pdf": "...", "source_file_name": "...", "source_pages": [...], "confidence": "high|medium|low", "missing_fields": [...], "evidence": {...} },
  "extraction_meta": { "extraction_type": "ai_assisted", "review_status": "ai_generated_needs_human_review", "extracted_at": "${new Date().toISOString().split('T')[0]}", "extractor": "ProductVector v2.0", "matched_product_id": null, "match_status": "matched|unmatched_pdf", "notes": null }
}

PDF TEXT:
${pdfText}`;
}
