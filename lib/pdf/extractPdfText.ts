import fs from 'fs';
import path from 'path';

export interface ExtractedPdfPage {
  pageNumber: number;
  text: string;
}

export interface ExtractedPdfText {
  fullText: string;
  pages: ExtractedPdfPage[];
  pageCount: number;
  charCount: number;
}

/**
 * Extract text from a PDF file using pdfjs-dist.
 * Returns full text and per-page text.
 */
export async function extractPdfText(pdfPath: string): Promise<ExtractedPdfText> {
  if (!fs.existsSync(pdfPath)) {
    throw new Error(`PDF file not found: ${pdfPath}`);
  }

  const buffer = fs.readFileSync(pdfPath);
  if (buffer.length === 0) {
    throw new Error(`PDF file is empty: ${pdfPath}`);
  }

  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const data = new Uint8Array(buffer);
  const doc = await pdfjsLib.getDocument({ data }).promise;
  const pageCount = doc.numPages;

  const pages: ExtractedPdfPage[] = [];
  let fullText = '';

  for (let i = 1; i <= pageCount; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: any) => item.str).join(' ').trim();
    if (pageText.length > 0) {
      pages.push({ pageNumber: i, text: pageText });
      fullText += pageText + '\n\n';
    }
  }

  fullText = fullText.trim();

  if (fullText.length < 50) {
    throw new Error(
      `PDF text is too short (${fullText.length} chars). The PDF may be image-based or corrupted: ${pdfPath}`
    );
  }

  return {
    fullText,
    pages,
    pageCount,
    charCount: fullText.length,
  };
}

/**
 * Extract text from a specific page range of a PDF.
 */
export async function extractPdfPageRange(
  pdfPath: string,
  startPage: number,
  endPage: number
): Promise<string> {
  const result = await extractPdfText(pdfPath);
  return result.pages
    .filter(p => p.pageNumber >= startPage && p.pageNumber <= endPage)
    .map(p => p.text)
    .join('\n\n');
}
