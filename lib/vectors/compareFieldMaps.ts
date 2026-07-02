/**
 * Field mapping configuration for the compare table.
 * Each field defines where to read data from the ProductVector and how to compare it.
 */

export type CompareField = {
  key: string;
  label: string;
  path: string;
  fallbackPath?: string;
  section: string;
  importance?: 'high' | 'medium' | 'low';
  compareType?: 'higher_better' | 'lower_better' | 'boolean_true_better' | 'text' | 'none';
};

export const baseCompareFields: CompareField[] = [
  { key: 'product_name', label: '产品名称', path: 'base.product_name', section: '基础信息', compareType: 'none' },
  { key: 'company', label: '保险公司', path: 'base.company', section: '基础信息', compareType: 'none' },
  { key: 'region', label: '地区', path: 'base.region', section: '基础信息', compareType: 'none' },
  { key: 'category', label: '产品类型', path: 'base.category', section: '基础信息', compareType: 'none' },
  { key: 'subcategory', label: '产品子类', path: 'base.subcategory', section: '基础信息', compareType: 'none', importance: 'low' },
  { key: 'policy_currency', label: '保单货币', path: 'base.policy_currency', section: '基础信息', compareType: 'none' },
  { key: 'policy_term', label: '保障/保单年期', path: 'base.policy_term', section: '基础信息', compareType: 'none' },
  { key: 'premium_term', label: '缴费期', path: 'base.premium_term', section: '基础信息', compareType: 'none' },
  { key: 'entry_age', label: '投保年龄', path: 'base.entry_age', section: '基础信息', compareType: 'none' },
];

export const criticalIllnessCompareFields: CompareField[] = [
  { key: 'major_illness_count', label: '严重危疾数量', path: 'core.critical_illness_core.major_illness_count', section: '重疾保障', compareType: 'higher_better', importance: 'high' },
  { key: 'early_stage_illness_count', label: '早期危疾数量', path: 'core.critical_illness_core.early_stage_illness_count', section: '重疾保障', compareType: 'higher_better', importance: 'high' },
  { key: 'child_illness_count', label: '儿童疾病数量', path: 'core.critical_illness_core.child_illness_count', section: '重疾保障', compareType: 'higher_better', importance: 'medium' },
  { key: 'covered_illness_total', label: '合计疾病数量', path: 'core.critical_illness_core.covered_illness_total', section: '重疾保障', compareType: 'higher_better', importance: 'high' },
  { key: 'multiple_claims', label: '是否支持多次赔付', path: 'core.critical_illness_core.multiple_claims', section: '重疾保障', compareType: 'boolean_true_better', importance: 'high' },
  { key: 'max_claim_times', label: '最高赔付次数', path: 'core.critical_illness_core.max_claim_times', section: '重疾保障', compareType: 'higher_better', importance: 'high' },
  { key: 'cancer_multiple_claims', label: '癌症多次赔', path: 'core.critical_illness_core.cancer_multiple_claims', section: '重疾保障', compareType: 'text', importance: 'high' },
  { key: 'heart_attack_multiple_claims', label: '心脏病多次赔', path: 'core.critical_illness_core.heart_attack_multiple_claims', section: '重疾保障', compareType: 'text', importance: 'high' },
  { key: 'stroke_multiple_claims', label: '中风多次赔', path: 'core.critical_illness_core.stroke_multiple_claims', section: '重疾保障', compareType: 'text', importance: 'high' },
  { key: 'premium_waiver_after_claim', label: '重疾后保费豁免', path: 'core.critical_illness_core.premium_waiver_after_claim', section: '重疾保障', compareType: 'boolean_true_better', importance: 'high' },
  { key: 'waiting_period_days', label: '等待期/缓接期', path: 'core.critical_illness_core.waiting_period_days', section: '重疾保障', compareType: 'lower_better', importance: 'medium' },
];

export const savingsFeatureCompareFields: CompareField[] = [
  { key: 'has_savings_component', label: '是否有储蓄成分', path: 'modules.participating_savings_module.has_savings_component', section: '储蓄/分红/现金价值', compareType: 'boolean_true_better', importance: 'high' },
  { key: 'participating', label: '是否分红保单', path: 'modules.participating_savings_module.participating', section: '储蓄/分红/现金价值', compareType: 'boolean_true_better', importance: 'high' },
  { key: 'has_guaranteed_cash_value', label: '是否有保证现金价值', path: 'modules.participating_savings_module.has_guaranteed_cash_value', section: '储蓄/分红/现金价值', compareType: 'boolean_true_better', importance: 'high' },
  { key: 'has_non_guaranteed_bonus', label: '是否有非保证红利', path: 'modules.participating_savings_module.has_non_guaranteed_bonus', section: '储蓄/分红/现金价值', compareType: 'boolean_true_better', importance: 'medium' },
  { key: 'bonus_type', label: '红利类型', path: 'modules.participating_savings_module.bonus_type', section: '储蓄/分红/现金价值', compareType: 'text' },
  { key: 'has_maturity_benefit', label: '是否有期满利益', path: 'modules.participating_savings_module.has_maturity_benefit', section: '储蓄/分红/现金价值', compareType: 'boolean_true_better', importance: 'medium' },
  { key: 'illustrated_irr', label: '演示IRR', path: 'core.savings_core.illustrated_irr', section: '储蓄/分红/现金价值', compareType: 'higher_better', importance: 'high' },
  { key: 'guaranteed_irr', label: '保证IRR', path: 'core.savings_core.guaranteed_irr', section: '储蓄/分红/现金价值', compareType: 'higher_better', importance: 'high' },
  { key: 'illustrated_break_even_year', label: '演示回本时间', path: 'core.savings_core.illustrated_break_even_year', section: '储蓄/分红/现金价值', compareType: 'lower_better', importance: 'high' },
  { key: 'guaranteed_break_even_year', label: '保证回本时间', path: 'core.savings_core.guaranteed_break_even_year', section: '储蓄/分红/现金价值', compareType: 'lower_better', importance: 'high' },
];

export const lifeProtectionCompareFields: CompareField[] = [
  { key: 'has_death_benefit', label: '是否有身故赔偿', path: 'modules.life_protection_module.has_death_benefit', section: '人寿保障', compareType: 'boolean_true_better', importance: 'high' },
  { key: 'death_benefit_description', label: '身故赔偿说明', path: 'modules.life_protection_module.death_benefit_description', section: '人寿保障', compareType: 'text', importance: 'high' },
  { key: 'death_benefit_deducts_prior_claims', label: '身故赔偿是否扣减已赔金额', path: 'modules.life_protection_module.death_benefit_deducts_prior_claims', section: '人寿保障', compareType: 'text', importance: 'medium' },
  { key: 'has_life_cover_component', label: '是否有人寿保障成分', path: 'modules.life_protection_module.has_life_cover_component', section: '人寿保障', compareType: 'boolean_true_better', importance: 'high' },
];

export const liquidityCompareFields: CompareField[] = [
  { key: 'policy_loan_available', label: '是否支持保单贷款', path: 'modules.policy_liquidity_module.policy_loan_available', section: '流动性', compareType: 'boolean_true_better', importance: 'medium' },
  { key: 'policy_loan_limit', label: '保单贷款额度', path: 'modules.policy_liquidity_module.policy_loan_limit', section: '流动性', compareType: 'text' },
  { key: 'partial_withdrawal_available', label: '是否支持部分提取', path: 'modules.policy_liquidity_module.partial_withdrawal_available', section: '流动性', compareType: 'boolean_true_better' },
  { key: 'surrender_available', label: '是否支持退保', path: 'modules.policy_liquidity_module.surrender_available', section: '流动性', compareType: 'boolean_true_better' },
  { key: 'early_surrender_risk', label: '早期退保风险', path: 'modules.policy_liquidity_module.early_surrender_risk', section: '流动性', compareType: 'text' },
];

export const riskCompareFields: CompareField[] = [
  { key: 'non_guaranteed_benefit_risk', label: '非保证利益风险', path: 'modules.risk_module.non_guaranteed_benefit_risk', section: '风险提示', compareType: 'text' },
  { key: 'early_surrender_risk', label: '提早退保风险', path: 'modules.risk_module.early_surrender_risk', section: '风险提示', compareType: 'text' },
  { key: 'currency_risk', label: '货币风险', path: 'modules.risk_module.currency_risk', section: '风险提示', compareType: 'text' },
  { key: 'claim_limitation_risk', label: '理赔限制风险', path: 'modules.risk_module.claim_limitation_risk', section: '风险提示', compareType: 'text' },
  { key: 'main_exclusions', label: '主要除外责任', path: 'modules.risk_module.main_exclusions', section: '风险提示', compareType: 'text' },
];

/** Tags to show from comparison_flags when a vector is available */
export const comparisonFlagLabels: Record<string, string> = {
  has_critical_illness_cover: '重疾保障',
  has_multiple_claims: '多次赔付',
  has_cancer_multiple_claims: '癌症多次赔',
  participating: '分红保单',
  has_guaranteed_cash_value: '保证现金价值',
  has_death_benefit: '身故赔偿',
  has_policy_loan: '保单贷款',
  supports_usd: '美元可选',
};
