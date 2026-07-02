import type { ProductVector } from './schemas/product-vector-v2.schema';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate a ProductVector v2.0 object against the schema requirements.
 */
export function validateProductVector(vector: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Top-level structure
  if (!vector.product_vector_version || vector.product_vector_version !== 'v2.0') {
    errors.push('Missing or invalid product_vector_version (must be "v2.0")');
  }
  if (!vector.base) errors.push('Missing "base" section');
  if (!vector.core) errors.push('Missing "core" section');
  if (!vector.modules) errors.push('Missing "modules" section');
  if (!vector.comparison_flags) errors.push('Missing "comparison_flags" section');
  if (!vector.source_trace) errors.push('Missing "source_trace" section');
  if (!vector.extraction_meta) errors.push('Missing "extraction_meta" section');

  // Base validation
  if (vector.base) {
    if (!vector.base.product_name) errors.push('Missing base.product_name');
    if (!vector.base.category) errors.push('Missing base.category');
    if (!['critical_illness', 'savings'].includes(vector.base.category)) {
      errors.push(`Invalid base.category: ${vector.base.category}`);
    }
    if (!vector.base.company) warnings.push('Missing base.company');
  }

  // Core validation
  if (vector.core && vector.base) {
    if (vector.base.category === 'critical_illness') {
      if (!vector.core.critical_illness_core) {
        errors.push('Category is critical_illness but critical_illness_core is null');
      }
      if (vector.core.savings_core !== null) {
        warnings.push('Category is critical_illness but savings_core is not null');
      }
    }
    if (vector.base.category === 'savings') {
      if (!vector.core.savings_core) {
        errors.push('Category is savings but savings_core is null');
      }
      if (vector.core.critical_illness_core !== null) {
        warnings.push('Category is savings but critical_illness_core is not null');
      }
    }
  }

  // Source trace validation
  if (vector.source_trace) {
    if (!vector.source_trace.source_pdf) errors.push('Missing source_trace.source_pdf');
    if (!vector.source_trace.confidence) errors.push('Missing source_trace.confidence');
    if (!['high', 'medium', 'low'].includes(vector.source_trace.confidence)) {
      errors.push(`Invalid source_trace.confidence: ${vector.source_trace.confidence}`);
    }
    if (!Array.isArray(vector.source_trace.missing_fields)) {
      errors.push('Missing source_trace.missing_fields (must be array)');
    }
    if (!vector.source_trace.evidence || typeof vector.source_trace.evidence !== 'object') {
      errors.push('Missing source_trace.evidence');
    }
  }

  // Extraction meta validation
  if (vector.extraction_meta) {
    if (!vector.extraction_meta.extraction_type) warnings.push('Missing extraction_meta.extraction_type');
    if (!vector.extraction_meta.review_status) warnings.push('Missing extraction_meta.review_status');
    if (!vector.extraction_meta.extracted_at) warnings.push('Missing extraction_meta.extracted_at');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
