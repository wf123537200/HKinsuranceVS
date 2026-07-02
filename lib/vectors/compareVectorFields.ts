import type { ProductVector, ComparisonFlags } from './schemas/product-vector-v2.schema';

/**
 * Compare two ProductVector objects field by field.
 * Returns a structured comparison result for display.
 */
export interface FieldComparison {
  field: string;
  label: string;
  productA: string | number | boolean | null;
  productB: string | number | boolean | null;
  same: boolean;
}

export interface ModuleComparison {
  module: string;
  label: string;
  fields: FieldComparison[];
}

export interface VectorComparisonResult {
  productA: { name: string; company: string; category: string };
  productB: { name: string; company: string; category: string };
  base: FieldComparison[];
  modules: ModuleComparison[];
  flags: FieldComparison[];
}

function val(v: any): string | number | boolean | null {
  if (v === undefined || v === '') return null;
  return v;
}

export function compareVectorFields(
  a: ProductVector,
  b: ProductVector
): VectorComparisonResult {
  const base: FieldComparison[] = [
    { field: 'company', label: 'Company', productA: val(a.base.company), productB: val(b.base.company), same: a.base.company === b.base.company },
    { field: 'category', label: 'Category', productA: val(a.base.category), productB: val(b.base.category), same: a.base.category === b.base.category },
    { field: 'policy_currency', label: 'Currency', productA: val(a.base.policy_currency?.join(', ')), productB: val(b.base.policy_currency?.join(', ')), same: JSON.stringify(a.base.policy_currency) === JSON.stringify(b.base.policy_currency) },
    { field: 'policy_term', label: 'Policy Term', productA: val(a.base.policy_term), productB: val(b.base.policy_term), same: a.base.policy_term === b.base.policy_term },
    { field: 'premium_term', label: 'Premium Term', productA: val(a.base.premium_term?.join(', ')), productB: val(b.base.premium_term?.join(', ')), same: JSON.stringify(a.base.premium_term) === JSON.stringify(b.base.premium_term) },
  ];

  const modules: ModuleComparison[] = [];

  // CI Core comparison
  if (a.core.critical_illness_core && b.core.critical_illness_core) {
    const ciA = a.core.critical_illness_core;
    const ciB = b.core.critical_illness_core;
    modules.push({
      module: 'critical_illness_core',
      label: 'Critical Illness Coverage',
      fields: [
        { field: 'major_illness_count', label: 'Major Illnesses', productA: val(ciA.major_illness_count), productB: val(ciB.major_illness_count), same: ciA.major_illness_count === ciB.major_illness_count },
        { field: 'early_stage_illness_count', label: 'Early Stage', productA: val(ciA.early_stage_illness_count), productB: val(ciB.early_stage_illness_count), same: ciA.early_stage_illness_count === ciB.early_stage_illness_count },
        { field: 'child_illness_count', label: 'Child Illnesses', productA: val(ciA.child_illness_count), productB: val(ciB.child_illness_count), same: ciA.child_illness_count === ciB.child_illness_count },
        { field: 'waiting_period_days', label: 'Waiting Period', productA: val(ciA.waiting_period_days), productB: val(ciB.waiting_period_days), same: ciA.waiting_period_days === ciB.waiting_period_days },
        { field: 'multiple_claims', label: 'Multiple Claims', productA: val(ciA.multiple_claims), productB: val(ciB.multiple_claims), same: ciA.multiple_claims === ciB.multiple_claims },
        { field: 'cancer_multiple_claims', label: 'Cancer Claims', productA: val(ciA.cancer_multiple_claims), productB: val(ciB.cancer_multiple_claims), same: ciA.cancer_multiple_claims === ciB.cancer_multiple_claims },
        { field: 'premium_waiver_after_claim', label: 'Premium Waiver', productA: val(ciA.premium_waiver_after_claim), productB: val(ciB.premium_waiver_after_claim), same: ciA.premium_waiver_after_claim === ciB.premium_waiver_after_claim },
      ],
    });
  }

  // Savings Core comparison
  if (a.core.savings_core && b.core.savings_core) {
    const sA = a.core.savings_core;
    const sB = b.core.savings_core;
    modules.push({
      module: 'savings_core',
      label: 'Savings & Returns',
      fields: [
        { field: 'participating', label: 'Participating', productA: val(sA.participating), productB: val(sB.participating), same: sA.participating === sB.participating },
        { field: 'terminal_bonus', label: 'Terminal Bonus', productA: val(sA.terminal_bonus), productB: val(sB.terminal_bonus), same: sA.terminal_bonus === sB.terminal_bonus },
        { field: 'reversionary_bonus', label: 'Reversionary Bonus', productA: val(sA.reversionary_bonus), productB: val(sB.reversionary_bonus), same: sA.reversionary_bonus === sB.reversionary_bonus },
        { field: 'illustrated_irr', label: 'Illustrated IRR', productA: val(sA.illustrated_irr), productB: val(sB.illustrated_irr), same: sA.illustrated_irr === sB.illustrated_irr },
        { field: 'guaranteed_irr', label: 'Guaranteed IRR', productA: val(sA.guaranteed_irr), productB: val(sB.guaranteed_irr), same: sA.guaranteed_irr === sB.guaranteed_irr },
      ],
    });
  }

  // Comparison flags
  const allFlagKeys = new Set([
    ...Object.keys(a.comparison_flags),
    ...Object.keys(b.comparison_flags),
  ]);
  const flags: FieldComparison[] = [];
  for (const key of allFlagKeys) {
    const vA = (a.comparison_flags as any)[key];
    const vB = (b.comparison_flags as any)[key];
    flags.push({
      field: key,
      label: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      productA: val(vA),
      productB: val(vB),
      same: vA === vB,
    });
  }

  return {
    productA: { name: a.base.product_name, company: a.base.company, category: a.base.category },
    productB: { name: b.base.product_name, company: b.base.company, category: b.base.category },
    base,
    modules,
    flags,
  };
}
