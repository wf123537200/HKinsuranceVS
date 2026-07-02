import fs from 'fs';
import path from 'path';
import { extractPdfText } from '@/lib/pdf/extractPdfText';
import { PRODUCT_VECTOR_V2_SYSTEM_PROMPT, buildExtractionPrompt } from '@/lib/vectors/prompts/extract-product-vector-v2.prompt';
import { validateProductVector } from '@/lib/vectors/validateProductVector';
import { saveProductVector, vectorExists } from '@/lib/vectors/saveProductVector';
import type { ProductVector } from '@/lib/vectors/schemas/product-vector-v2.schema';

export interface ExtractProductVectorInput {
  pdfPath: string;
  productId?: string;
  companySlug?: string;
  productSlug?: string;
  productName?: string;
  category?: string;
  force?: boolean;
}

export interface ExtractProductVectorResult {
  status: 'success' | 'skipped_existing' | 'failed_pdf_text_extraction' | 'failed_ai_extraction' | 'failed_schema_validation';
  vectorPath?: string;
  confidence?: string;
  missingFields?: string[];
  error?: string;
}

/**
 * Extract a ProductVector v2.0 from a single PDF file.
 */
export async function extractProductVector(
  input: ExtractProductVectorInput
): Promise<ExtractProductVectorResult> {
  const { pdfPath, companySlug = 'unknown', productSlug, force = false } = input;

  // Derive slugs from path if not provided
  const derivedCompanySlug = companySlug || path.basename(path.dirname(pdfPath));
  const derivedProductSlug = productSlug || path.basename(pdfPath, '.pdf');

  // Check if already exists
  if (!force && vectorExists(derivedCompanySlug, derivedProductSlug)) {
    return { status: 'skipped_existing', vectorPath: `${derivedCompanySlug}/${derivedProductSlug}.vector.json` };
  }

  // Extract PDF text
  let pdfText: string;
  try {
    const extracted = await extractPdfText(pdfPath);
    pdfText = extracted.fullText;
  } catch (err: any) {
    return { status: 'failed_pdf_text_extraction', error: err.message };
  }

  // Truncate if too long (AI context limits)
  if (pdfText.length > 80000) {
    pdfText = pdfText.substring(0, 80000) + '\n\n[TEXT TRUNCATED - PDF EXCEEDS 80K CHARACTERS]';
  }

  // Build prompt
  const prompt = buildExtractionPrompt(pdfText, {
    productName: input.productName,
    productSlug: derivedProductSlug,
    companySlug: derivedCompanySlug,
    category: input.category,
  });

  // Call AI
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { status: 'failed_ai_extraction', error: 'OPENAI_API_KEY not set' };
  }

  let aiResponse: string;
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
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
    aiResponse = data.choices?.[0]?.message?.content ?? '';

    if (!aiResponse) {
      return { status: 'failed_ai_extraction', error: 'Empty AI response' };
    }
  } catch (err: any) {
    return { status: 'failed_ai_extraction', error: `AI API error: ${err.message}` };
  }

  // Parse JSON
  let vector: any;
  try {
    // Strip markdown fences if present
    const cleaned = aiResponse.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    vector = JSON.parse(cleaned);
  } catch (err: any) {
    return { status: 'failed_ai_extraction', error: `JSON parse error: ${err.message}` };
  }

  // Validate
  const validation = validateProductVector(vector);
  if (!validation.valid) {
    return {
      status: 'failed_schema_validation',
      error: `Validation failed: ${validation.errors.join('; ')}`,
    };
  }

  // Save
  const vectorPath = saveProductVector(derivedCompanySlug, derivedProductSlug, vector as ProductVector);

  return {
    status: 'success',
    vectorPath,
    confidence: vector.source_trace?.confidence,
    missingFields: vector.source_trace?.missing_fields,
  };
}
