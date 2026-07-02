/**
 * ProductVector v2.0 Schema
 * 
 * Structured insurance product vector extracted from official brochures.
 * Used for product pages, comparison pages, and AI comparison modules.
 */

// ==================== BASE ====================
export interface ProductVectorBase {
  product_name: string;
  product_name_en: string | null;
  company: string;
  insurer_entity: string | null;
  region: string;
  category: 'critical_illness' | 'savings';
  subcategory: string | null;
  policy_currency: string[];
  supported_currencies: string[];
  policy_term: string | null;
  premium_term: string[] | null;
  entry_age: Record<string, string> | null;
  payment_mode: string[] | null;
  minimum_sum_assured_or_notional_amount: Record<string, string> | null;
  brochure_version: string | null;
  distribution_region: string[] | null;
  product_status: string | null;
}

// ==================== CRITICAL ILLNESS CORE ====================
export interface CriticalIllnessCore {
  coverage_term: string | null;
  waiting_period_days: number | null;
  waiting_period_name: string | null;
  major_illness_count: number | null;
  early_stage_illness_count: number | null;
  minor_illness_count: number | null;
  moderate_illness_count: number | null;
  child_illness_count: number | null;
  covered_illness_total: number | null;
  illness_list_available: boolean | null;
  major_illness_payout: string | null;
  early_stage_payout: string | null;
  minor_illness_payout: string | null;
  moderate_illness_payout: string | null;
  child_illness_payout: string | null;
  early_stage_total_cap: string | null;
  child_illness_total_cap: string | null;
  icu_benefit: string | null;
  icu_benefit_term: string | null;
  multiple_claims: boolean | null;
  max_claim_times: number | null;
  cancer_multiple_claims: string | null;
  heart_attack_multiple_claims: string | null;
  stroke_multiple_claims: string | null;
  waiting_period_between_claims: Record<string, string> | null;
  premium_waiver_after_claim: boolean | null;
  premium_waiver_description: string | null;
  claim_grouping: string | null;
  claim_deduction_rule: string | null;
  mainland_china_diagnosis_rule: string | null;
}

// ==================== SAVINGS CORE ====================
export interface SavingsCore {
  premium_term: string[] | null;
  coverage_term: string | null;
  entry_age: Record<string, string> | null;
  currency: string[] | null;
  participating: boolean | null;
  guaranteed_cash_value: boolean | null;
  non_guaranteed_bonus: boolean | null;
  dividend_type: string | null;
  terminal_bonus: boolean | null;
  terminal_bonus_description: string | null;
  reversionary_bonus: boolean | null;
  reversionary_bonus_description: string | null;
  illustrated_irr: number | null;
  guaranteed_irr: number | null;
  illustrated_break_even_year: number | null;
  guaranteed_break_even_year: number | null;
  policy_loan: boolean | null;
  change_policyholder: boolean | null;
  change_insured: boolean | null;
  education_planning: boolean | null;
  retirement_planning: boolean | null;
  legacy_planning: boolean | null;
  premium_holiday: string | null;
  wealth_split_option: boolean | null;
  bonus_lock_in_option: string | null;
  currency_switch: string | null;
  notes: string | null;
}

// ==================== MODULES ====================
export interface ParticipatingSavingsModule {
  has_savings_component: boolean | null;
  participating: boolean | null;
  has_guaranteed_cash_value: boolean | null;
  has_maturity_benefit: boolean | null;
  has_non_guaranteed_bonus: boolean | null;
  bonus_type: string[] | null;
  terminal_bonus: string | null;
  reversionary_bonus: string | null;
  bonus_lock_in_option: string | null;
  accumulation_interest: string | null;
  cash_value_available: boolean | null;
  cash_value_reduction_after_claim: string | null;
  maturity_benefit_description: string | null;
  surrender_value_description: string | null;
  dividend_philosophy_available: boolean | null;
  dividend_realization_rate_available: boolean | null;
  non_guaranteed_warning: string | null;
  investment_mix: {
    fixed_income_range: string | null;
    non_fixed_income_range: string | null;
    investment_regions: string[] | null;
    currency_hedging_policy: string | null;
  } | null;
}

export interface LifeProtectionModule {
  has_death_benefit: boolean | null;
  death_benefit_description: string | null;
  death_benefit_deducts_prior_claims: boolean | null;
  has_maturity_benefit: boolean | null;
  maturity_benefit_description: string | null;
  has_total_permanent_disability: boolean | null;
  tpd_description: string | null;
  has_life_cover_component: boolean | null;
  life_cover_notes: string | null;
}

export interface PolicyLiquidityModule {
  policy_loan_available: boolean | null;
  policy_loan_limit: string | null;
  automatic_premium_loan: string | null;
  partial_withdrawal_available: boolean | null;
  withdrawal_description: string | null;
  surrender_available: boolean | null;
  surrender_value_description: string | null;
  early_surrender_risk: string | null;
  liquidity_risk: string | null;
}

export interface PolicyFlexibilityModule {
  change_policyholder: string | null;
  change_insured: string | null;
  contingent_policyholder: string | null;
  policy_split: string | null;
  currency_switch: string | null;
  premium_holiday: string | null;
  top_up: string | null;
  partial_withdrawal: string | null;
  regular_withdrawal: string | null;
  policy_assignment: string | null;
  trust_or_legacy_feature: string | null;
}

export interface UseCaseModule {
  family_protection: boolean | null;
  child_protection: boolean | null;
  income_protection: boolean | null;
  cancer_protection_focus: boolean | null;
  multiple_claims_focus: boolean | null;
  life_and_savings_component: boolean | null;
  legacy_planning: boolean | null;
  retirement_planning: boolean | null;
  education_planning: boolean | null;
  wealth_accumulation: boolean | null;
  multi_currency_planning: boolean | null;
  asset_preservation: boolean | null;
  business_succession: boolean | null;
}

export interface RiskModule {
  non_guaranteed_benefit_risk: string | null;
  early_surrender_risk: string | null;
  currency_risk: string | null;
  credit_risk: string | null;
  inflation_risk: string | null;
  claim_limitation_risk: string | null;
  waiting_period_or_grace_period: string | null;
  geographic_restriction: string | null;
  main_exclusions: string[];
  important_notes: string[];
}

// ==================== COMPARISON FLAGS ====================
export interface ComparisonFlags {
  has_critical_illness_cover: boolean | null;
  has_multiple_claims: boolean | null;
  has_cancer_multiple_claims: boolean | null;
  has_heart_stroke_multiple_claims: boolean | null;
  has_early_stage_cover: boolean | null;
  has_child_illness_cover: boolean | null;
  has_icu_benefit: boolean | null;
  has_adl_disability_benefit: boolean | null;
  has_savings_component: boolean | null;
  participating: boolean | null;
  has_guaranteed_cash_value: boolean | null;
  has_non_guaranteed_bonus: boolean | null;
  has_maturity_benefit: boolean | null;
  has_policy_loan: boolean | null;
  has_death_benefit: boolean | null;
  has_life_cover_component: boolean | null;
  supports_hkd: boolean | null;
  supports_usd: boolean | null;
  supports_multi_currency: boolean | null;
  suitable_for_family_protection: boolean | null;
  suitable_for_legacy_planning: boolean | null;
  suitable_for_retirement_planning: boolean | null;
  suitable_for_education_planning: boolean | null;
}

// ==================== SOURCE TRACE ====================
export interface SourceTrace {
  source_pdf: string;
  source_file_name: string;
  source_pages: number[];
  confidence: 'high' | 'medium' | 'low';
  missing_fields: string[];
  evidence: Record<string, { page: number; quote: string }>;
}

// ==================== EXTRACTION META ====================
export interface ExtractionMeta {
  extraction_type: 'ai_assisted' | 'manual';
  review_status: 'ai_generated_needs_human_review' | 'human_reviewed' | 'published';
  extracted_at: string;
  extractor: string;
  matched_product_id: string | null;
  match_status: 'matched' | 'unmatched_pdf' | 'partial_match';
  notes: string | null;
}

// ==================== FULL VECTOR ====================
export interface ProductVector {
  product_vector_version: 'v2.0';
  base: ProductVectorBase;
  core: {
    critical_illness_core: CriticalIllnessCore | null;
    savings_core: SavingsCore | null;
  };
  modules: {
    participating_savings_module: ParticipatingSavingsModule | null;
    life_protection_module: LifeProtectionModule | null;
    policy_liquidity_module: PolicyLiquidityModule | null;
    policy_flexibility_module: PolicyFlexibilityModule | null;
    use_case_module: UseCaseModule | null;
    risk_module: RiskModule | null;
  };
  comparison_flags: ComparisonFlags;
  source_trace: SourceTrace;
  extraction_meta: ExtractionMeta;
}
