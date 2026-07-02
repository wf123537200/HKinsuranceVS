/**
 * Get a nested value from a ProductVector by dot-separated path.
 * Returns null if path doesn't exist or value is undefined.
 */
export function getVectorValue(vector: any, path: string): unknown {
  if (!vector) return null;
  const parts = path.split('.');
  let current: any = vector;
  for (const part of parts) {
    if (current === null || current === undefined) return null;
    current = current[part];
  }
  return current ?? null;
}
