#!/usr/bin/env tsx
/**
 * Validate all ProductVector v2.0 files.
 * 
 * Usage: npm run vectors:validate
 */

import fs from 'fs';
import path from 'path';
import { validateProductVector } from '../lib/vectors/validateProductVector';

const VECTORS_DIR = path.join(process.cwd(), 'data', 'vectors');

interface ValidationResult {
  file: string;
  company: string;
  product: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
}

function main() {
  if (!fs.existsSync(VECTORS_DIR)) {
    console.log('No vectors directory found. Run vectors:extract first.');
    process.exit(0);
  }

  const results: ValidationResult[] = [];
  const companies = fs.readdirSync(VECTORS_DIR);

  for (const company of companies) {
    const companyDir = path.join(VECTORS_DIR, company);
    if (!fs.statSync(companyDir).isDirectory()) continue;

    const files = fs.readdirSync(companyDir).filter(f => f.endsWith('.vector.json'));
    for (const file of files) {
      const filePath = path.join(companyDir, file);
      const relPath = `${company}/${file}`;
      const product = file.replace('.vector.json', '');

      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const vector = JSON.parse(content);
        const validation = validateProductVector(vector);

        results.push({
          file: relPath,
          company,
          product,
          valid: validation.valid,
          errors: validation.errors,
          warnings: validation.warnings,
        });
      } catch (err: any) {
        results.push({
          file: relPath,
          company,
          product,
          valid: false,
          errors: [`Failed to parse: ${err.message}`],
          warnings: [],
        });
      }
    }
  }

  // Print results
  const valid = results.filter(r => r.valid);
  const invalid = results.filter(r => !r.valid);

  console.log(`\n=== ProductVector v2.0 Validation ===\n`);
  console.log(`Total: ${results.length} | Valid: ${valid.length} | Invalid: ${invalid.length}\n`);

  if (invalid.length > 0) {
    console.log('--- Invalid Vectors ---\n');
    for (const r of invalid) {
      console.log(`  ❌ ${r.file}`);
      for (const e of r.errors) {
        console.log(`     Error: ${e}`);
      }
    }
    console.log('');
  }

  if (valid.length > 0) {
    console.log('--- Valid Vectors ---\n');
    for (const r of valid) {
      const warnStr = r.warnings.length > 0 ? ` (${r.warnings.length} warnings)` : '';
      console.log(`  ✅ ${r.file}${warnStr}`);
    }
  }

  // Summary by company
  console.log('\n--- By Company ---\n');
  const byCompany: Record<string, { valid: number; invalid: number }> = {};
  for (const r of results) {
    if (!byCompany[r.company]) byCompany[r.company] = { valid: 0, invalid: 0 };
    if (r.valid) byCompany[r.company].valid++;
    else byCompany[r.company].invalid++;
  }
  for (const [company, counts] of Object.entries(byCompany)) {
    console.log(`  ${company}: ${counts.valid} valid, ${counts.invalid} invalid`);
  }

  if (invalid.length > 0) process.exit(1);
}

main();
