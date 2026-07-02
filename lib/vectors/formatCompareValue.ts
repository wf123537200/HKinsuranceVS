/**
 * Format a value for display in the comparison table.
 * Returns a human-readable string, never null/undefined/[object Object].
 */

export function formatCompareValue(value: unknown): string {
  if (value === null || value === undefined) return '暂无数据';
  if (typeof value === 'boolean') return value ? '是' : '否';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') {
    if (value.trim() === '') return '暂无数据';
    return value;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '暂无数据';
    return value.map(v => formatCompareValue(v)).join(' / ');
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value).filter(([, v]) => v !== null && v !== undefined);
    if (entries.length === 0) return '暂无数据';
    return entries.map(([k, v]) => {
      const label = k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      return `${label}：${formatCompareValue(v)}`;
    }).join('；');
  }
  return String(value);
}
