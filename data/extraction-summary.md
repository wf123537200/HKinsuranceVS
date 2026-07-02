# ProductVector v2.4 Catalog-Guided Extraction (pdfs1)

- Catalog products: 45
- PDFs in pdfs1.zip: 45
- Vectors generated: 45
- Missing PDFs: 0
- Selected hot products: 23
- Selected hot vectors: 23
- Schema: ProductVector v2.4 with compare_profile + product_features[] + feature_tags[]

## Validation

This run uses PRODUCT-CATALOG.md as the authoritative product baseline and exact `pdfs/<DB slug>.pdf` filenames from pdfs1.zip. No cross-product fuzzy substitution is used. The hot product TS file is used to enrich product_name_en, market_attention, priority and selected metadata where available.

## Known Issue Policy

IRR is only filled when the PDF explicitly contains IRR / internal rate of return wording. If a PDF only contains "X times premium" demonstrations, the value is stored in `highest_illustrated_return_multiple` and is not converted to IRR.

## Outputs

- data/vectors/
- data/vectors-selected/
- reports/catalog-pdf-alignment.csv
- reports/selected-hot-validation.csv
- reports/vector-field-coverage.csv
- reports/irr-extraction-report.csv
- reports/product-feature-coverage.csv
- reports/known-issues.csv
- reports/compare-field-registry-v2.4-catalog-guided-pdfs1-final.json
