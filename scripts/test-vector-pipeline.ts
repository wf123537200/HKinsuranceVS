#!/usr/bin/env tsx
/**
 * Test the ProductVector v2.0 pipeline without calling OpenAI.
 * Tests: PDF extraction → vector validation → save → load → compare
 */

import path from 'path';
import { extractPdfText } from '../lib/pdf/extractPdfText';
import { validateProductVector } from '../lib/vectors/validateProductVector';
import { saveProductVector, loadProductVector, vectorExists } from '../lib/vectors/saveProductVector';
import { compareVectorFields } from '../lib/vectors/compareVectorFields';
import type { ProductVector } from '../lib/vectors/schemas/product-vector-v2.schema';

const TEST_PDFS = [
  'public/pdfs-by-company/prudential-hk/evergreen-growth-saver-plus-ii-en.pdf',
  'public/pdfs-by-company/fwd-hk/fwd-maxfocus-legacy-ii.pdf',
];

async function testPdfExtraction() {
  console.log('=== Test 1: PDF Text Extraction ===\n');
  for (const pdf of TEST_PDFS) {
    try {
      const result = await extractPdfText(pdf);
      console.log(`  ✅ ${path.basename(pdf)}: ${result.pageCount} pages, ${result.charCount} chars`);
    } catch (e: any) {
      console.log(`  ❌ ${path.basename(pdf)}: ${e.message}`);
    }
  }
  console.log('');
}

function testValidation() {
  console.log('=== Test 2: Vector Validation ===\n');

  // Valid vector
  const validVector: ProductVector = {
    product_vector_version: 'v2.0',
    base: {
      product_name: 'Test Product',
      product_name_en: 'Test Product EN',
      company: 'Test Company',
      insurer_entity: null,
      region: 'Hong Kong',
      category: 'savings',
      subcategory: null,
      policy_currency: ['HKD'],
      supported_currencies: [],
      policy_term: 'Lifetime',
      premium_term: ['5 years'],
      entry_age: null,
      payment_mode: null,
      minimum_sum_assured_or_notional_amount: null,
      brochure_version: null,
      distribution_region: null,
      product_status: null,
    },
    core: {
      critical_illness_core: null,
      savings_core: {
        premium_term: ['5 years'],
        coverage_term: 'Lifetime',
        entry_age: null,
        currency: ['HKD'],
        participating: true,
        guaranteed_cash_value: true,
        non_guaranteed_bonus: true,
        dividend_type: 'Terminal Bonus',
        terminal_bonus: true,
        terminal_bonus_description: null,
        reversionary_bonus: false,
        reversionary_bonus_description: null,
        illustrated_irr: 4.5,
        guaranteed_irr: 0.5,
        illustrated_break_even_year: 8,
        guaranteed_break_even_year: 18,
        policy_loan: true,
        change_policyholder: true,
        change_insured: true,
        education_planning: true,
        retirement_planning: true,
        legacy_planning: true,
        premium_holiday: null,
        wealth_split_option: null,
        bonus_lock_in_option: null,
        currency_switch: null,
        notes: null,
      },
    },
    modules: {
      participating_savings_module: null,
      life_protection_module: null,
      policy_liquidity_module: null,
      policy_flexibility_module: null,
      use_case_module: null,
      risk_module: null,
    },
    comparison_flags: {
      has_critical_illness_cover: false,
      has_multiple_claims: false,
      has_cancer_multiple_claims: false,
      has_heart_stroke_multiple_claims: false,
      has_early_stage_cover: false,
      has_child_illness_cover: false,
      has_icu_benefit: false,
      has_adl_disability_benefit: false,
      has_savings_component: true,
      participating: true,
      has_guaranteed_cash_value: true,
      has_non_guaranteed_bonus: true,
      has_maturity_benefit: false,
      has_policy_loan: true,
      has_death_benefit: false,
      has_life_cover_component: false,
      supports_hkd: true,
      supports_usd: false,
      supports_multi_currency: false,
      suitable_for_family_protection: false,
      suitable_for_legacy_planning: true,
      suitable_for_retirement_planning: true,
      suitable_for_education_planning: true,
    },
    source_trace: {
      source_pdf: 'test.pdf',
      source_file_name: 'test.pdf',
      source_pages: [1, 2],
      confidence: 'high',
      missing_fields: [],
      evidence: {},
    },
    extraction_meta: {
      extraction_type: 'ai_assisted',
      review_status: 'ai_generated_needs_human_review',
      extracted_at: new Date().toISOString().split('T')[0],
      extractor: 'ProductVector v2.0',
      matched_product_id: null,
      match_status: 'unmatched_pdf',
      notes: 'Test vector',
    },
  };

  const result = validateProductVector(validVector);
  console.log(`  Valid vector: ${result.valid ? '✅' : '❌'} (${result.errors.length} errors, ${result.warnings.length} warnings)`);

  // Invalid vector (missing category)
  const invalidVector = { ...validVector, base: { ...validVector.base, category: 'invalid' } };
  const result2 = validateProductVector(invalidVector);
  console.log(`  Invalid category: ${result2.valid ? '❌ should fail' : '✅ correctly rejected'} (${result2.errors.join('; ')})`);

  // Invalid vector (CI category with no CI core)
  const invalidCI = { ...validVector, base: { ...validVector.base, category: 'critical_illness' as const } };
  const result3 = validateProductVector(invalidCI);
  console.log(`  CI without core: ${result3.valid ? '❌ should fail' : '✅ correctly rejected'} (${result3.errors.join('; ')})`);
  console.log('');
}

function testSaveLoad() {
  console.log('=== Test 3: Save & Load ===\n');

  const vector: ProductVector = {
    product_vector_version: 'v2.0',
    base: {
      product_name: 'Test Save Product',
      product_name_en: null,
      company: 'test-company',
      insurer_entity: null,
      region: 'Hong Kong',
      category: 'savings',
      subcategory: null,
      policy_currency: ['HKD'],
      supported_currencies: [],
      policy_term: null,
      premium_term: null,
      entry_age: null,
      payment_mode: null,
      minimum_sum_assured_or_notional_amount: null,
      brochure_version: null,
      distribution_region: null,
      product_status: null,
    },
    core: { critical_illness_core: null, savings_core: null },
    modules: {
      participating_savings_module: null,
      life_protection_module: null,
      policy_liquidity_module: null,
      policy_flexibility_module: null,
      use_case_module: null,
      risk_module: null,
    },
    comparison_flags: {} as any,
    source_trace: {
      source_pdf: 'test.pdf',
      source_file_name: 'test.pdf',
      source_pages: [],
      confidence: 'low',
      missing_fields: [],
      evidence: {},
    },
    extraction_meta: {
      extraction_type: 'ai_assisted',
      review_status: 'ai_generated_needs_human_review',
      extracted_at: new Date().toISOString().split('T')[0],
      extractor: 'test',
      matched_product_id: null,
      match_status: 'unmatched_pdf',
      notes: null,
    },
  };

  const savedPath = saveProductVector('test-company', 'test-product', vector);
  console.log(`  ✅ Saved to: ${savedPath}`);

  const exists = vectorExists('test-company', 'test-product');
  console.log(`  ✅ Exists check: ${exists}`);

  const loaded = loadProductVector('test-company', 'test-product');
  console.log(`  ✅ Loaded: ${loaded?.base.product_name}`);

  // Cleanup
  const fs = require('fs');
  fs.rmSync(path.dirname(savedPath), { recursive: true });
  console.log(`  ✅ Cleaned up test files`);
  console.log('');
}

function testComparison() {
  console.log('=== Test 4: Vector Comparison ===\n');

  const vectorA: ProductVector = {
    product_vector_version: 'v2.0',
    base: {
      product_name: 'Product A',
      product_name_en: null,
      company: 'Company A',
      insurer_entity: null,
      region: 'Hong Kong',
      category: 'savings',
      subcategory: null,
      policy_currency: ['HKD', 'USD'],
      supported_currencies: [],
      policy_term: 'Lifetime',
      premium_term: ['5 years'],
      entry_age: null,
      payment_mode: null,
      minimum_sum_assured_or_notional_amount: null,
      brochure_version: null,
      distribution_region: null,
      product_status: null,
    },
    core: {
      critical_illness_core: null,
      savings_core: {
        premium_term: null, coverage_term: null, entry_age: null, currency: null,
        participating: true, guaranteed_cash_value: true, non_guaranteed_bonus: true,
        dividend_type: null, terminal_bonus: true, terminal_bonus_description: null,
        reversionary_bonus: false, reversionary_bonus_description: null,
        illustrated_irr: 4.5, guaranteed_irr: 0.5,
        illustrated_break_even_year: 8, guaranteed_break_even_year: 18,
        policy_loan: true, change_policyholder: true, change_insured: true,
        education_planning: true, retirement_planning: true, legacy_planning: true,
        premium_holiday: null, wealth_split_option: null, bonus_lock_in_option: null,
        currency_switch: null, notes: null,
      },
    },
    modules: { participating_savings_module: null, life_protection_module: null, policy_liquidity_module: null, policy_flexibility_module: null, use_case_module: null, risk_module: null },
    comparison_flags: { supports_hkd: true, supports_usd: true, supports_multi_currency: false } as any,
    source_trace: { source_pdf: 'a.pdf', source_file_name: 'a.pdf', source_pages: [], confidence: 'high', missing_fields: [], evidence: {} },
    extraction_meta: { extraction_type: 'ai_assisted', review_status: 'ai_generated_needs_human_review', extracted_at: '2026-06-15', extractor: 'test', matched_product_id: null, match_status: 'unmatched_pdf', notes: null },
  };

  const vectorB = JSON.parse(JSON.stringify(vectorA));
  vectorB.base.product_name = 'Product B';
  vectorB.base.company = 'Company B';
  vectorB.core.savings_core!.illustrated_irr = 5.0;
  vectorB.core.savings_core!.participating = false;

  const comparison = compareVectorFields(vectorA, vectorB);
  console.log(`  Comparing: ${comparison.productA.name} vs ${comparison.productB.name}`);
  console.log(`  Base fields: ${comparison.base.length}`);
  console.log(`  Modules: ${comparison.modules.length}`);
  console.log(`  Flags: ${comparison.flags.length}`);

  const diffs = [...comparison.base, ...(comparison.modules?.flatMap(m => m.fields) || [])].filter(f => !f.same);
  console.log(`  Differences found: ${diffs.length}`);
  for (const d of diffs) {
    console.log(`    - ${d.label}: ${d.productA} vs ${d.productB}`);
  }
  console.log('');
}

async function main() {
  console.log('ProductVector v2.0 Pipeline Test\n');
  await testPdfExtraction();
  testValidation();
  testSaveLoad();
  testComparison();
  console.log('All tests completed! ✅');
}

main().catch(console.error);
