/**
 * Determine which product has the advantage for a given field.
 */

export type AdvantageResult = 'a' | 'b' | 'none';

export function getAdvantage(
  valueA: unknown,
  valueB: unknown,
  compareType: string
): AdvantageResult {
  if (compareType === 'text' || compareType === 'none') return 'none';

  if (compareType === 'higher_better' || compareType === 'lower_better') {
    const numA = toNumber(valueA);
    const numB = toNumber(valueB);
    if (numA === null || numB === null) return 'none';
    if (numA === numB) return 'none';
    if (compareType === 'higher_better') return numA > numB ? 'a' : 'b';
    return numA < numB ? 'a' : 'b';
  }

  if (compareType === 'boolean_true_better') {
    const boolA = toBool(valueA);
    const boolB = toBool(valueB);
    if (boolA === boolB) return 'none';
    if (boolA === true && boolB !== true) return 'a';
    if (boolB === true && boolA !== true) return 'b';
    return 'none';
  }

  return 'none';
}

function toNumber(val: unknown): number | null {
  if (val === null || val === undefined) return null;
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const n = parseFloat(val.replace(/[%,]/g, ''));
    return isNaN(n) ? null : n;
  }
  return null;
}

function toBool(val: unknown): boolean | null {
  if (val === true || val === false) return val;
  if (val === null || val === undefined) return null;
  return null;
}
