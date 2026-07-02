#!/usr/bin/env tsx
/**
 * Add a new product to Policy Vector from a PDF file.
 * 
 * Usage:
 *   npm run product:add -- --pdf=public/pdfs-by-company/fwd-hk/new-product.pdf
 *   npm run product:add -- --pdf=public/pdfs-by-company/fwd-hk/new-product.pdf --company=fwd-hk --category=savings
 *   npm run product:add -- --pdf=public/pdfs-by-company/fwd-hk/new-product.pdf --dry-run
 * 
 * Flow:
 *   1. Extract PDF text
 *   2. Call AI to generate ProductVector v2.0 + product metadata
 *   3. Save vector to /data/vectors/
 *   4. Insert product into database via Prisma
 *   5. Update translation files
 *   6. Generate comparisons with same-category products
 *   7. Report
 */

import fs from 'fs';
import path from 'path';
import { extractPdfText } from '../lib/pdf/extractPdfText';
import { PRODUCT_VECTOR_V2_SYSTEM_PROMPT, buildExtractionPrompt } from '../lib/vectors/prompts/extract-product-vector-v2.prompt';
import { validateProductVector } from '../lib/vectors/validateProductVector';
import { saveProductVector } from '../lib/vectors/saveProductVector';

// ==================== ARGUMENTS ====================
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed: Record<string, string | boolean> = {};
  for (const arg of args) {
    if (arg.startsWith('--')) {
      const [key, val] = arg.slice(2).split('=');
      parsed[key] = val ?? true;
    }
  }
  return {
    pdf: parsed.pdf as string,
    company: parsed.company as string | undefined,
    category: parsed.category as string | undefined,
    dryRun: !!parsed['dry-run'],
    force: !!parsed.force,
  };
}

// ==================== COMPANY SLUG DETECTION ====================
function detectCompanySlug(pdfPath: string): string {
  // Extract from path: public/pdfs-by-company/{company}/file.pdf
  const parts = pdfPath.replace(/\\/g, '/').split('/');
  const idx = parts.indexOf('pdfs-by-company');
  if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
  return path.basename(path.dirname(pdfPath));
}

function detectProductSlug(pdfPath: string): string {
  return path.basename(pdfPath, '.pdf');
}

// ==================== AI METADATA EXTRACTION ====================
interface ProductMetadata {
  product_name_zh: string;
  product_name_en: string;
  category: 'critical_illness' | 'savings';
  subcategory: string | null;
  summary_zh: string;
  summary_en: string;
  tags: string[];
  insurer_entity: string | null;
  region: string;
  policy_currency: string[];
}

const METADATA_PROMPT = `You are extracting product metadata from an insurance product brochure for a database entry.

Rules:
1. Extract the official Chinese product name (产品名称).
2. Extract the official English product name if available.
3. Determine category: "critical_illness" or "savings".
4. Determine subcategory if applicable (e.g., "participating_critical_illness", "universal_life", "whole_life").
5. Write a 1-2 sentence summary in Chinese and English.
6. Extract 3-5 relevant tags in English (lowercase, hyphenated).
7. Extract the insurer entity name (承保公司全称).
8. Extract region (e.g., "Hong Kong", "Mainland China").
9. Extract policy currencies.
10. Output valid JSON only. No markdown fences.

Output format:
{
  "product_name_zh": "...",
  "product_name_en": "...",
  "category": "critical_illness" | "savings",
  "subcategory": "..." | null,
  "summary_zh": "...",
  "summary_en": "...",
  "tags": ["tag1", "tag2"],
  "insurer_entity": "..." | null,
  "region": "Hong Kong",
  "policy_currency": ["HKD", "USD"]
}`;

async function extractMetadata(pdfText: string, companySlug: string): Promise<ProductMetadata> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not set');

  const truncated = pdfText.length > 30000 ? pdfText.substring(0, 30000) : pdfText;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: METADATA_PROMPT },
        { role: 'user', content: `Company slug: ${companySlug}\n\nPDF text:\n${truncated}` },
      ],
      temperature: 0.1,
      max_tokens: 2000,
    }),
  });

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? '';
  const cleaned = text.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
}

async function extractVector(pdfText: string, productInfo: any): Promise<any> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not set');

  const truncated = pdfText.length > 80000 ? pdfText.substring(0, 80000) : pdfText;
  const prompt = buildExtractionPrompt(truncated, productInfo);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: PRODUCT_VECTOR_V2_SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.1,
      max_tokens: 16000,
    }),
  });

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? '';
  const cleaned = text.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
}

// ==================== TRANSLATION UPDATE ====================
function updateTranslations(productSlug: string, meta: ProductMetadata) {
  const translationsPath = path.join(process.cwd(), 'lib', 'translations.ts');
  let content = fs.readFileSync(translationsPath, 'utf-8');

  // Add product name translation
  const nameEntry = `  "${productSlug}": { en: "${meta.product_name_en || meta.product_name_zh}", "zh-CN": "${meta.product_name_zh}", "zh-TW": "${meta.product_name_zh}" },`;
  if (!content.includes(`"${productSlug}"`)) {
    // Insert before the closing of productNames
    const marker = '// Stroke count for Chinese characters';
    content = content.replace(marker, nameEntry + '\n' + marker);
  }

  // Add product summary translation
  const summaryEntry = `  "${productSlug}": { en: "${meta.summary_en}", "zh-CN": "${meta.summary_zh}", "zh-TW": "${meta.summary_zh}" },`;
  // Find the productSummaries section closing
  const summaryMarker = 'export function translateProductSummary';
  if (content.includes(summaryMarker) && !content.includes(`"${productSlug}": { en: "${meta.summary_en}"`)) {
    content = content.replace(summaryMarker, summaryEntry + '\n\n' + summaryMarker);
  }

  fs.writeFileSync(translationsPath, content, 'utf-8');
  console.log(`  ✅ Updated translations for ${productSlug}`);
}

// ==================== DATABASE INSERT ====================
async function insertProduct(companySlug: string, productSlug: string, meta: ProductMetadata, brochureUrl: string) {
  // Use Prisma directly via dynamic import
  const { PrismaClient } = await import('../app/generated/prisma/client');
  const { PrismaBetterSqlite3 } = await import('@prisma/adapter-better-sqlite3');
  const dbPath = path.join(process.cwd(), 'dev.db');
  const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
  const prisma = new PrismaClient({ adapter });

  try {
    const company = await prisma.company.findUnique({ where: { slug: companySlug } });
    if (!company) throw new Error(`Company not found: ${companySlug}`);

    const product = await prisma.product.create({
      data: {
        companyId: company.id,
        name: meta.product_name_zh,
        slug: productSlug,
        displayName: meta.product_name_zh,
        region: meta.region || 'Hong Kong',
        country: meta.region === 'Mainland China' ? 'China' : 'Hong Kong',
        category: meta.category.toUpperCase() as any,
        subcategory: meta.subcategory,
        currency: meta.policy_currency?.[0] || 'HKD',
        supportedCurrencies: JSON.stringify(meta.policy_currency || []),
        tags: JSON.stringify(meta.tags || []),
        summary: meta.summary_en,
        brochureUrl,
        productStatus: 'active',
        dataStatus: 'manual_verified',
        isPublished: true,
        manualDownloadVerified: true,
        manualDownloadNote: `Added via add-product script on ${new Date().toISOString().split('T')[0]}`,
        localPdfPath: brochureUrl,
      },
    });

    // Create CI or Savings detail
    if (meta.category === 'critical_illness') {
      await prisma.criticalIllnessDetail.create({
        data: { productId: product.id, notes: 'Auto-generated placeholder. Update with extracted data.' },
      });
    } else {
      await prisma.savingsDetail.create({
        data: { productId: product.id, notes: 'Auto-generated placeholder. Update with extracted data.' },
      });
    }

    // Generate comparisons with same-category products
    const sameCategory = await prisma.product.findMany({
      where: { category: meta.category.toUpperCase() as any, id: { not: product.id }, dataStatus: { in: ['published', 'manual_verified'] } },
    });

    let compCount = 0;
    for (const other of sameCategory) {
      try {
        const [aId, bId] = [product.id, other.id].sort();
        await prisma.comparison.create({
          data: {
            productAId: aId,
            productBId: bId,
            slug: `${[productSlug, other.slug].sort().join('-vs-')}`,
            basicSummary: `Compare ${meta.product_name_zh} and ${other.displayName}.`,
          },
        });
        compCount++;
      } catch { /* duplicate comparison, skip */ }
    }

    console.log(`  ✅ Inserted product: ${meta.product_name_zh} (${product.id})`);
    console.log(`  ✅ Generated ${compCount} comparisons`);
    return product.id;
  } finally {
    await prisma.$disconnect();
  }
}

// ==================== REPORT ====================
interface StepResult {
  step: string;
  status: 'success' | 'failed' | 'skipped';
  detail?: string;
}

function printReport(steps: StepResult[]) {
  console.log('\n=== Add Product Report ===\n');
  for (const s of steps) {
    const icon = s.status === 'success' ? '✅' : s.status === 'skipped' ? '⏭️' : '❌';
    console.log(`  ${icon} ${s.step}${s.detail ? ` — ${s.detail}` : ''}`);
  }
  const failed = steps.filter(s => s.status === 'failed');
  if (failed.length > 0) {
    console.log(`\n❌ ${failed.length} step(s) failed.`);
  } else {
    console.log(`\n✅ All steps completed successfully!`);
  }
}

// ==================== MAIN ====================
async function main() {
  const args = parseArgs();
  if (!args.pdf) {
    console.log('Usage: npm run product:add -- --pdf=path/to/file.pdf [--company=slug] [--category=savings|critical_illness] [--dry-run]');
    process.exit(1);
  }

  const pdfPath = path.resolve(args.pdf);
  const companySlug = args.company || detectCompanySlug(pdfPath);
  const productSlug = detectProductSlug(pdfPath);
  const brochureUrl = `/pdfs/${companySlug}/${path.basename(pdfPath)}`;

  console.log(`\nAdding product: ${productSlug}`);
  console.log(`  Company: ${companySlug}`);
  console.log(`  PDF: ${pdfPath}`);
  console.log(`  Brochure URL: ${brochureUrl}\n`);

  const steps: StepResult[] = [];

  // Step 1: Extract PDF text
  let pdfText: string;
  try {
    const extracted = await extractPdfText(pdfPath);
    pdfText = extracted.fullText;
    steps.push({ step: 'Extract PDF text', status: 'success', detail: `${extracted.pageCount} pages, ${extracted.charCount} chars` });
  } catch (err: any) {
    steps.push({ step: 'Extract PDF text', status: 'failed', detail: err.message });
    printReport(steps);
    process.exit(1);
  }

  // Step 2: Extract metadata
  let meta: ProductMetadata;
  try {
    meta = await extractMetadata(pdfText, companySlug);
    if (args.category) meta.category = args.category as any;
    steps.push({ step: 'Extract metadata', status: 'success', detail: `${meta.product_name_zh} (${meta.category})` });
  } catch (err: any) {
    steps.push({ step: 'Extract metadata', status: 'failed', detail: err.message });
    printReport(steps);
    process.exit(1);
  }

  // Step 3: Generate vector
  let vector: any;
  try {
    vector = await extractVector(pdfText, {
      productName: meta.product_name_zh,
      productSlug,
      companySlug,
      category: meta.category,
    });
    const validation = validateProductVector(vector);
    if (!validation.valid) {
      steps.push({ step: 'Generate vector', status: 'failed', detail: `Validation: ${validation.errors.join('; ')}` });
    } else {
      steps.push({ step: 'Generate vector', status: 'success', detail: `confidence: ${vector.source_trace?.confidence}` });
    }
  } catch (err: any) {
    steps.push({ step: 'Generate vector', status: 'failed', detail: err.message });
    vector = null;
  }

  // Step 4: Save vector
  if (vector) {
    try {
      const vectorPath = saveProductVector(companySlug, productSlug, vector);
      steps.push({ step: 'Save vector', status: 'success', detail: vectorPath });
    } catch (err: any) {
      steps.push({ step: 'Save vector', status: 'failed', detail: err.message });
    }
  } else {
    steps.push({ step: 'Save vector', status: 'skipped', detail: 'No vector generated' });
  }

  if (args.dryRun) {
    console.log('\n--- DRY RUN — No database or file changes ---');
    console.log(`  Product: ${meta.product_name_zh}`);
    console.log(`  Category: ${meta.category}`);
    console.log(`  Tags: ${meta.tags?.join(', ')}`);
    console.log(`  Summary: ${meta.summary_zh}`);
    printReport(steps);
    return;
  }

  // Step 5: Insert into database
  try {
    await insertProduct(companySlug, productSlug, meta, brochureUrl);
    steps.push({ step: 'Insert into database', status: 'success' });
  } catch (err: any) {
    steps.push({ step: 'Insert into database', status: 'failed', detail: err.message });
  }

  // Step 6: Update translations
  try {
    updateTranslations(productSlug, meta);
    steps.push({ step: 'Update translations', status: 'success' });
  } catch (err: any) {
    steps.push({ step: 'Update translations', status: 'failed', detail: err.message });
  }

  printReport(steps);

  // Log to registry
  const registryPath = path.join(process.cwd(), 'data', 'product-registry.json');
  const registry = fs.existsSync(registryPath) ? JSON.parse(fs.readFileSync(registryPath, 'utf-8')) : { version: '1.0', products: [] };
  registry.products.push({
    productSlug,
    companySlug,
    productNameZh: meta.product_name_zh,
    productNameEn: meta.product_name_en,
    category: meta.category,
    pdfPath: brochureUrl,
    vectorPath: `data/vectors/${companySlug}/${productSlug}.vector.json`,
    addedAt: new Date().toISOString(),
  });
  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));
  console.log(`\nRegistry updated: ${registryPath}`);
}

main().catch(console.error);
