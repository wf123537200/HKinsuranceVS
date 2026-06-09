import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { comparisonId, productAId, productBId } = body;

    if (!comparisonId || !productAId || !productBId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check quota
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let quota = await prisma.compareQuota.findUnique({
      where: {
        userId_date: {
          userId: session.user.id,
          date: today,
        },
      },
    });

    if (!quota) {
      quota = await prisma.compareQuota.create({
        data: {
          userId: session.user.id,
          date: today,
          freeQuotaUsed: 0,
          adRewardQuota: 0,
          adRewardUsed: 0,
          totalUsed: 0,
        },
      });
    }

    const freeRemaining = 3 - quota.freeQuotaUsed;
    const adRemaining = quota.adRewardQuota - quota.adRewardUsed;

    if (freeRemaining <= 0 && adRemaining <= 0) {
      return NextResponse.json(
        { error: "Daily comparison limit reached. Try again tomorrow or watch an ad for more." },
        { status: 429 }
      );
    }

    // Fetch products with details
    const [productA, productB] = await Promise.all([
      prisma.product.findUnique({
        where: { id: productAId },
        include: {
          company: true,
          criticalIllnessDetail: true,
          savingsDetail: true,
        },
      }),
      prisma.product.findUnique({
        where: { id: productBId },
        include: {
          company: true,
          criticalIllnessDetail: true,
          savingsDetail: true,
        },
      }),
    ]);

    if (!productA || !productB) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Build AI prompt
    const isCI = productA.category === "CRITICAL_ILLNESS";
    const prompt = buildComparisonPrompt(productA, productB, isCI);

    // Call OpenAI (or generate placeholder if no API key)
    let aiResult;
    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey) {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are a neutral insurance product research assistant. You must never recommend purchasing any product. You must never say one product is better than another. Only compare features neutrally based on provided data. Always include a disclaimer. If data is missing, state 'Data not available'.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      });

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content ?? "";
      aiResult = parseAIResult(text);
    } else {
      // Placeholder AI result when no API key
      aiResult = generatePlaceholderResult(productA, productB, isCI);
    }

    // Update comparison
    const comparison = await prisma.comparison.update({
      where: { id: comparisonId },
      data: {
        aiSummary: aiResult.summary,
        aiKeyDifferences: aiResult.keyDifferences,
        aiCommonPoints: aiResult.commonPoints,
        aiRiskNotes: aiResult.riskNotes,
        aiQuestionsToCheck: aiResult.questions,
        aiGeneratedAt: new Date(),
        aiReviewStatus: "AI_GENERATED",
        aiGenerateCount: { increment: 1 },
      },
    });

    // Update quota
    if (freeRemaining > 0) {
      await prisma.compareQuota.update({
        where: { id: quota.id },
        data: {
          freeQuotaUsed: { increment: 1 },
          totalUsed: { increment: 1 },
        },
      });
    } else {
      await prisma.compareQuota.update({
        where: { id: quota.id },
        data: {
          adRewardUsed: { increment: 1 },
          totalUsed: { increment: 1 },
        },
      });
    }

    return NextResponse.json({
      success: true,
      aiSummary: comparison.aiSummary,
      aiKeyDifferences: comparison.aiKeyDifferences,
      aiCommonPoints: comparison.aiCommonPoints,
      aiRiskNotes: comparison.aiRiskNotes,
    });
  } catch (error) {
    console.error("Compare generation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildComparisonPrompt(productA: any, productB: any, isCI: boolean): string {
  const baseInfo = `
Compare the following two insurance products NEUTRALLY. Do NOT recommend one over the other. Do NOT use language like "better", "recommended", "should buy". Only present factual differences.

Product A: ${productA.displayName}
Company: ${productA.company.displayName}
Region: ${productA.region}
Currency: ${productA.currency}
Summary: ${productA.summary}

Product B: ${productB.displayName}
Company: ${productB.company.displayName}
Region: ${productB.region}
Currency: ${productB.currency}
Summary: ${productB.summary}
`;

  if (isCI) {
    const a = productA.criticalIllnessDetail;
    const b = productB.criticalIllnessDetail;
    return `${baseInfo}

Critical Illness Details:
Product A - Coverage: ${a?.coverageTerm}, Premium Term: ${a?.premiumTerm}, Waiting Period: ${a?.waitingPeriodDays} days, Major Illnesses: ${a?.majorIllnessCount}, Cancer Multiple Claims: ${a?.cancerMultipleClaims}, Premium Waiver: ${a?.premiumWaiver}
Product B - Coverage: ${b?.coverageTerm}, Premium Term: ${b?.premiumTerm}, Waiting Period: ${b?.waitingPeriodDays} days, Major Illnesses: ${b?.majorIllnessCount}, Cancer Multiple Claims: ${b?.cancerMultipleClaims}, Premium Waiver: ${b?.premiumWaiver}

Provide a JSON response with these fields: summary, commonPoints, keyDifferences, riskNotes, questions`;
  } else {
    const a = productA.savingsDetail;
    const b = productB.savingsDetail;
    return `${baseInfo}

Savings Details:
Product A - Premium Term: ${a?.premiumTerm}, Participating: ${a?.participating}, Illustrated IRR: ${a?.illustratedIrr}%, Guaranteed IRR: ${a?.guaranteedIrr}%, Break-even: ${a?.illustratedBreakEvenYear} years, Terminal Bonus: ${a?.terminalBonus}
Product B - Premium Term: ${b?.premiumTerm}, Participating: ${b?.participating}, Illustrated IRR: ${b?.illustratedIrr}%, Guaranteed IRR: ${b?.guaranteedIrr}%, Break-even: ${b?.illustratedBreakEvenYear} years, Terminal Bonus: ${b?.terminalBonus}

Provide a JSON response with these fields: summary, commonPoints, keyDifferences, riskNotes, questions`;
  }
}

function parseAIResult(text: string) {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // fallback
  }
  return {
    summary: text.slice(0, 500),
    commonPoints: "Data parsing failed. Please refer to the raw AI output.",
    keyDifferences: text.slice(500, 1000),
    riskNotes: "Always verify product details against official brochures.",
    questions: "Consult a licensed professional before making any decisions.",
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generatePlaceholderResult(productA: any, productB: any, isCI: boolean) {
  return {
    summary: `This comparison examines ${productA.displayName} from ${productA.company.displayName} (${productA.region}) and ${productB.displayName} from ${productB.company.displayName} (${productB.region}). Both are ${isCI ? "critical illness" : "savings"} insurance products with different structural features.`,
    commonPoints: `Both products offer ${isCI ? "critical illness protection" : "long-term savings features"}. Both are issued by established insurance companies regulated in their respective markets.`,
    keyDifferences: `The products differ in their ${isCI ? "coverage structure, illness definitions, and payout mechanisms" : "return structure, currency options, and bonus types"}. Refer to the comparison table above for specific differences.`,
    riskNotes: `本对比内容基于官方产品手册和结构化产品资料生成，仅用于资料研究和理解，不构成保险建议、财务建议或购买推荐。具体保障、利益、费用和限制请以保险公司官方文件及正式合同条款为准。\n\nThis comparison is based on official product brochures and structured product data, generated for research and understanding purposes only. It does not constitute insurance, financial, or investment advice. Specific coverage, benefits, costs, and limitations should be verified against official insurer documents and formal policy terms.`,
    questions: "What are the specific exclusions? How do the guaranteed vs non-guaranteed components compare? What are the surrender charges in the early years?",
  };
}
