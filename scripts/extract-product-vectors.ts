#!/usr/bin/env tsx
/**
 * Batch extract ProductVector v2.0 from PDFs.
 * 
 * Usage:
 *   npm run vectors:extract -- --all
 *   npm run vectors:extract -- --all --force
 *   npm run vectors:extract -- --pdf=public/pdfs-by-company/fwd-hk/fwd-maxfocus-legacy-ii.pdf
 *   npm run vectors:extract -- --productId=xxx
 */

import fs from 'fs';
import path from 'path';
import { extractProductVector, ExtractProductVectorResult } from '../lib/vectors/extractProductVector';

const PDF_BASE = path.join(process.cwd(), 'public', 'pdfs-by-company');
const LOG_DIR = path.join(process.cwd(), 'logs', 'vector-extraction');

interface ExtractionReportItem {
  product: string;
  company: string;
  category: string;
  pdfPath: string;
  vectorPath: string | undefined;
  status: string;
  confidence: string | undefined;
  missingFields: string[];
  error: string | undefined;
}

function parseArgs(): { all: boolean; force: boolean; pdf?: string; productId?: string } {
  const args = process.argv.slice(2);
  return {
    all: args.includes('--all'),
    force: args.includes('--force'),
    pdf: args.find(a => a.startsWith('--pdf='))?.split('=')[1],
    productId: args.find(a => a.startsWith('--productId='))?.split('=')[1],
  };
}

function scanPdfs(baseDir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(baseDir)) return results;

  const companies = fs.readdirSync(baseDir);
  for (const company of companies) {
    const companyDir = path.join(baseDir, company);
    if (!fs.statSync(companyDir).isDirectory()) continue;
    const files = fs.readdirSync(companyDir).filter(f => f.endsWith('.pdf'));
    for (const file of files) {
      results.push(path.join(companyDir, file));
    }
  }
  return results;
}

async function main() {
  const args = parseArgs();
  const report: ExtractionReportItem[] = [];
  const unmatched: string[] = [];

  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

  let pdfs: string[] = [];

  if (args.pdf) {
    pdfs = [path.resolve(args.pdf)];
  } else if (args.all) {
    pdfs = scanPdfs(PDF_BASE);
  } else {
    console.log('Usage: npm run vectors:extract -- --all [--force]');
    console.log('       npm run vectors:extract -- --pdf=path/to/file.pdf');
    process.exit(1);
  }

  console.log(`\nExtracting vectors from ${pdfs.length} PDFs...\n`);

  for (const pdfPath of pdfs) {
    const companySlug = path.basename(path.dirname(pdfPath));
    const productSlug = path.basename(pdfPath, '.pdf');

    console.log(`  Processing: ${companySlug}/${productSlug}...`);

    const result = await extractProductVector({
      pdfPath,
      companySlug,
      productSlug,
      force: args.force,
    });

    const item: ExtractionReportItem = {
      product: productSlug,
      company: companySlug,
      category: 'unknown',
      pdfPath,
      vectorPath: result.vectorPath,
      status: result.status,
      confidence: result.confidence,
      missingFields: result.missingFields || [],
      error: result.error,
    };

    report.push(item);

    const icon = result.status === 'success' ? '✅' : result.status === 'skipped_existing' ? '⏭️' : '❌';
    console.log(`    ${icon} ${result.status}${result.error ? `: ${result.error}` : ''}`);
  }

  // Write reports
  const successCount = report.filter(r => r.status === 'success').length;
  const skipCount = report.filter(r => r.status === 'skipped_existing').length;
  const failCount = report.filter(r => r.status.startsWith('failed')).length;

  // JSON report
  fs.writeFileSync(
    path.join(LOG_DIR, 'extraction-report.json'),
    JSON.stringify({ summary: { total: pdfs.length, success: successCount, skipped: skipCount, failed: failCount }, items: report }, null, 2)
  );

  // Markdown report
  let md = `# Vector Extraction Report\n\n`;
  md += `> Date: ${new Date().toISOString()}\n\n`;
  md += `## Summary\n\n`;
  md += `| Metric | Count |\n|--------|-------|\n`;
  md += `| Total PDFs | ${pdfs.length} |\n`;
  md += `| Success | ${successCount} |\n`;
  md += `| Skipped (existing) | ${skipCount} |\n`;
  md += `| Failed | ${failCount} |\n\n`;
  md += `## Details\n\n`;
  md += `| Company | Product | Status | Confidence | Error |\n`;
  md += `|---------|---------|--------|------------|-------|\n`;
  for (const r of report) {
    md += `| ${r.company} | ${r.product} | ${r.status} | ${r.confidence || '-'} | ${r.error || '-'} |\n`;
  }
  fs.writeFileSync(path.join(LOG_DIR, 'extraction-report.md'), md);

  // Unmatched PDFs
  if (unmatched.length > 0) {
    fs.writeFileSync(path.join(LOG_DIR, 'unmatched-pdfs.md'), `# Unmatched PDFs\n\n${unmatched.join('\n')}\n`);
  }

  console.log(`\n--- Summary ---`);
  console.log(`Total: ${pdfs.length} | Success: ${successCount} | Skipped: ${skipCount} | Failed: ${failCount}`);
  console.log(`Report: ${path.join(LOG_DIR, 'extraction-report.md')}`);
}

main().catch(console.error);
