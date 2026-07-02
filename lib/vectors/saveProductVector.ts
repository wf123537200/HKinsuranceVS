import fs from 'fs';
import path from 'path';
import type { ProductVector } from './schemas/product-vector-v2.schema';

const VECTORS_DIR = path.join(process.cwd(), 'data', 'vectors');

/**
 * Save a ProductVector to disk.
 * Creates directory structure: /data/vectors/{company_slug}/{product_slug}.vector.json
 */
export function saveProductVector(
  companySlug: string,
  productSlug: string,
  vector: ProductVector
): string {
  const dir = path.join(VECTORS_DIR, companySlug);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(dir, `${productSlug}.vector.json`);
  fs.writeFileSync(filePath, JSON.stringify(vector, null, 2), 'utf-8');
  return filePath;
}

/**
 * Load a ProductVector from disk.
 */
export function loadProductVector(
  companySlug: string,
  productSlug: string
): ProductVector | null {
  const filePath = path.join(VECTORS_DIR, companySlug, `${productSlug}.vector.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

/**
 * Check if a vector file already exists.
 */
export function vectorExists(companySlug: string, productSlug: string): boolean {
  const filePath = path.join(VECTORS_DIR, companySlug, `${productSlug}.vector.json`);
  return fs.existsSync(filePath);
}

/**
 * List all vector files.
 */
export function listAllVectors(): string[] {
  const results: string[] = [];
  if (!fs.existsSync(VECTORS_DIR)) return results;

  const companies = fs.readdirSync(VECTORS_DIR);
  for (const company of companies) {
    const companyDir = path.join(VECTORS_DIR, company);
    if (!fs.statSync(companyDir).isDirectory()) continue;
    const files = fs.readdirSync(companyDir).filter(f => f.endsWith('.vector.json'));
    for (const file of files) {
      results.push(path.join(company, file));
    }
  }
  return results;
}
