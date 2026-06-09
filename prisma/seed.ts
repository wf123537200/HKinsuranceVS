import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // ==================== COMPANIES ====================
  const companies = await Promise.all([
    // Hong Kong Companies
    prisma.company.create({
      data: {
        name: "prudential-hk",
        slug: "prudential-hk",
        displayName: "Prudential Hong Kong",
        region: "Hong Kong",
        country: "Hong Kong",
        website: "https://www.prudential.com.hk",
        logoUrl: "/logos/prudential.png",
        foundedYear: 1964,
        headquarters: "Hong Kong",
        description: "Prudential Hong Kong is a leading life insurance company that has been serving customers in Hong Kong for over 60 years, offering a comprehensive range of protection, savings, and investment-linked products.",
        regulator: "Insurance Authority (IA)",
        amBestRating: "A+",
        moodysRating: "A2",
        spRating: "A+",
      },
    }),
    prisma.company.create({
      data: {
        name: "aia-hk",
        slug: "aia-hk",
        displayName: "AIA Hong Kong",
        region: "Hong Kong",
        country: "Hong Kong",
        website: "https://www.aia.com.hk",
        logoUrl: "/logos/aia.png",
        foundedYear: 1919,
        headquarters: "Hong Kong",
        description: "AIA is the largest independent publicly listed pan-Asian life insurance group, serving over 700,000 customers in Hong Kong and Macau. With a history spanning over a century since 1919, AIA is ranked No.1 in Hong Kong's insurance market and leads globally in MDRT membership.",
        regulator: "Insurance Authority (IA)",
        amBestRating: "A+",
        moodysRating: "A2",
        spRating: "AA-",
      },
    }),
    prisma.company.create({
      data: {
        name: "manulife-hk",
        slug: "manulife-hk",
        displayName: "Manulife Hong Kong",
        region: "Hong Kong",
        country: "Hong Kong",
        website: "https://www.manulife.com.hk",
        logoUrl: "/logos/manulife.png",
        foundedYear: 1897,
        headquarters: "Hong Kong",
        description: "Manulife Hong Kong, part of the global Manulife Financial Corporation founded in 1897, provides financial protection and wealth management solutions to individuals and businesses in Hong Kong, with a strong focus on retirement and investment products.",
        regulator: "Insurance Authority (IA)",
        amBestRating: "A+",
        moodysRating: "A1",
        spRating: "AA-",
      },
    }),
    prisma.company.create({
      data: {
        name: "axa-hk",
        slug: "axa-hk",
        displayName: "AXA Hong Kong",
        region: "Hong Kong",
        country: "Hong Kong",
        website: "https://www.axa.com.hk",
        logoUrl: "/logos/axa.png",
        foundedYear: 1986,
        headquarters: "Hong Kong",
        description: "AXA Hong Kong offers a comprehensive range of life, health, savings, and general insurance products. With the Emma by AXA digital platform, AXA provides innovative self-servicing solutions and a holistic wellness programme called BetterMe.",
        regulator: "Insurance Authority (IA)",
        amBestRating: "A+",
        moodysRating: "A1",
        spRating: "A+",
      },
    }),
    prisma.company.create({
      data: {
        name: "fwd-hk",
        slug: "fwd-hk",
        displayName: "FWD Hong Kong",
        region: "Hong Kong",
        country: "Hong Kong",
        website: "https://www.fwd.com.hk",
        logoUrl: "/logos/fwd.png",
        foundedYear: 2013,
        headquarters: "Hong Kong",
        description: "FWD is a pan-Asian life insurance business headquartered in Hong Kong, offering life insurance, medical and critical illness protection, savings plans, retirement solutions, and investment-linked insurance with a focus on digital-first customer experience.",
        regulator: "Insurance Authority (IA)",
        moodysRating: "A3",
      },
    }),
    // Mainland China Companies
    prisma.company.create({
      data: {
        name: "ping-an",
        slug: "ping-an",
        displayName: "Ping An Insurance",
        region: "Mainland China",
        country: "China",
        website: "https://www.pingan.com",
        logoUrl: "/logos/pingan.png",
        foundedYear: 1988,
        headquarters: "Shenzhen, China",
        description: "Ping An Insurance (Group) Company of China is one of the world's largest financial services companies, offering insurance, banking, securities, and investment services. Ping An's healthcare ecosystem covers 100% of China's top 100 hospitals and tertiary hospitals.",
        regulator: "National Financial Regulatory Administration (NFRA)",
        spRating: "A",
        fitchRating: "A",
      },
    }),
    prisma.company.create({
      data: {
        name: "china-life",
        slug: "china-life",
        displayName: "China Life Insurance",
        region: "Mainland China",
        country: "China",
        website: "https://www.chinalife.com.cn",
        logoUrl: "/logos/chinalife.png",
        foundedYear: 1949,
        headquarters: "Beijing, China",
        description: "China Life Insurance (Group) Company is the largest life insurance company in China and a Fortune Global 500 company, offering life insurance, overseas business, asset management, health investment, and property insurance across its extensive nationwide network.",
        regulator: "National Financial Regulatory Administration (NFRA)",
        spRating: "A",
        fitchRating: "A+",
      },
    }),
    prisma.company.create({
      data: {
        name: "taikang-life",
        slug: "taikang-life",
        displayName: "Taikang Insurance Group",
        region: "Mainland China",
        country: "China",
        website: "https://www.taikang.com",
        logoUrl: "/logos/taikang.png",
        foundedYear: 1996,
        headquarters: "Beijing, China",
        description: "Taikang Insurance Group operates across three core businesses: insurance, asset management, and healthcare (medical & elderly care). Managing over ¥359.5 billion in pension assets and ¥774.2 billion in third-party assets, Taikang has opened 30 Taikang Home elderly care communities nationwide.",
        regulator: "National Financial Regulatory Administration (NFRA)",
      },
    }),
    prisma.company.create({
      data: {
        name: "cpic-life",
        slug: "cpic-life",
        displayName: "China Pacific Insurance (CPIC)",
        region: "Mainland China",
        country: "China",
        website: "https://www.cpic.com.cn",
        logoUrl: "/logos/cpic.png",
        foundedYear: 1991,
        headquarters: "Shanghai, China",
        description: "China Pacific Insurance (Group) Co., Ltd. is one of China's largest insurance groups, offering property insurance, life insurance, asset management, health insurance, and pension services through its subsidiaries. CPIC serves customers nationwide with its 24/7 hotline 95500.",
        regulator: "National Financial Regulatory Administration (NFRA)",
        spRating: "A",
      },
    }),
    prisma.company.create({
      data: {
        name: "new-china-life",
        slug: "new-china-life",
        displayName: "New China Life Insurance",
        region: "Mainland China",
        country: "China",
        website: "https://www.newchinalife.com",
        logoUrl: "/logos/newchinalife.png",
        foundedYear: 1996,
        headquarters: "Beijing, China",
        description: "New China Life Insurance Co., Ltd. (NCI) is a leading life insurance company in China listed on the Shanghai, Hong Kong, and New York stock exchanges. NCI extends into elderly care, health management, and asset management, operating 19 health checkup centres and a rehabilitation hospital in Beijing.",
        regulator: "National Financial Regulatory Administration (NFRA)",
        fitchRating: "A",
      },
    }),
  ]);

  console.log(`Created ${companies.length} companies`);

  // ==================== PRODUCTS ====================
  const products = [];

  // Hong Kong Products
  const hkProducts = [
    // Prudential
    {
      companyId: companies[0].id,
      name: "Prudential Critical Illness Plan",
      slug: "prudential-ci-plan",
      displayName: "Prudential Critical Illness Plan",
      region: "Hong Kong",
      country: "Hong Kong",
      category: "CRITICAL_ILLNESS" as const,
      currency: "HKD",
      tags: ["critical-illness", "multiple-claims", "cancer-coverage"],
      summary: "A comprehensive critical illness plan offering coverage for multiple conditions with flexible premium terms.",
    },
    {
      companyId: companies[0].id,
      name: "Prudential Savings Plan",
      slug: "prudential-savings-plan",
      displayName: "Prudential Savings Plan",
      region: "Hong Kong",
      country: "Hong Kong",
      category: "SAVINGS" as const,
      currency: "HKD",
      supportedCurrencies: ["HKD", "USD", "CNY"],
      tags: ["savings", "multi-currency", "participating", "legacy"],
      summary: "A participating savings plan with multi-currency options designed for long-term wealth accumulation.",
    },
    // AIA
    {
      companyId: companies[1].id,
      name: "AIA Critical Illness Elite",
      slug: "aia-ci-elite",
      displayName: "AIA Critical Illness Elite",
      region: "Hong Kong",
      country: "Hong Kong",
      category: "CRITICAL_ILLNESS" as const,
      currency: "HKD",
      tags: ["critical-illness", "elite", "cancer-multiple-claims"],
      summary: "Premium critical illness coverage with extensive condition definitions and multiple claim benefits.",
    },
    {
      companyId: companies[1].id,
      name: "AIA Savings Leader",
      slug: "aia-savings-leader",
      displayName: "AIA Savings Leader",
      region: "Hong Kong",
      country: "Hong Kong",
      category: "SAVINGS" as const,
      currency: "HKD",
      supportedCurrencies: ["HKD", "USD"],
      tags: ["savings", "participating", "education", "retirement"],
      summary: "A leading savings product with guaranteed and non-guaranteed benefits for education and retirement planning.",
    },
    // Manulife
    {
      companyId: companies[2].id,
      name: "Manulife Critical Care Plus",
      slug: "manulife-critical-care-plus",
      displayName: "Manulife Critical Care Plus",
      region: "Hong Kong",
      country: "Hong Kong",
      category: "CRITICAL_ILLNESS" as const,
      currency: "HKD",
      tags: ["critical-illness", "heart-stroke", "premium-waiver"],
      summary: "Comprehensive critical illness protection with heart and stroke coverage and premium waiver benefit.",
    },
    {
      companyId: companies[2].id,
      name: "Manulife Global Currency Savings",
      slug: "manulife-global-currency-savings",
      displayName: "Manulife Global Currency Savings",
      region: "Hong Kong",
      country: "Hong Kong",
      category: "SAVINGS" as const,
      currency: "USD",
      supportedCurrencies: ["HKD", "USD", "CNY", "GBP", "EUR"],
      tags: ["savings", "multi-currency", "global", "legacy"],
      summary: "A multi-currency savings plan with global currency options for international wealth management.",
    },
    // AXA
    {
      companyId: companies[3].id,
      name: "AXA Health Shield",
      slug: "axa-health-shield",
      displayName: "AXA Health Shield",
      region: "Hong Kong",
      country: "Hong Kong",
      category: "CRITICAL_ILLNESS" as const,
      currency: "HKD",
      tags: ["critical-illness", "health", "early-stage"],
      summary: "A health-focused critical illness plan with early-stage condition coverage and flexible benefits.",
    },
    {
      companyId: companies[3].id,
      name: "AXA Wealth Builder",
      slug: "axa-wealth-builder",
      displayName: "AXA Wealth Builder",
      region: "Hong Kong",
      country: "Hong Kong",
      category: "SAVINGS" as const,
      currency: "HKD",
      supportedCurrencies: ["HKD", "USD"],
      tags: ["savings", "wealth-building", "retirement"],
      summary: "A wealth accumulation plan designed for long-term growth with guaranteed cash value.",
    },
    // FWD
    {
      companyId: companies[4].id,
      name: "FWD Critical Illness Defender",
      slug: "fwd-ci-defender",
      displayName: "FWD Critical Illness Defender",
      region: "Hong Kong",
      country: "Hong Kong",
      category: "CRITICAL_ILLNESS" as const,
      currency: "HKD",
      tags: ["critical-illness", "defender", "multiple-claims"],
      summary: "An affordable critical illness plan with comprehensive coverage and multiple claim options.",
    },
    {
      companyId: companies[4].id,
      name: "FWD Evergreen Savings",
      slug: "fwd-evergreen-savings",
      displayName: "FWD Evergreen Savings",
      region: "Hong Kong",
      country: "Hong Kong",
      category: "SAVINGS" as const,
      currency: "HKD",
      supportedCurrencies: ["HKD", "USD"],
      tags: ["savings", "evergreen", "long-term"],
      summary: "A long-term savings plan with competitive returns and flexible premium payment options.",
    },
  ];

  // Mainland Products
  const mainlandProducts = [
    // Ping An
    {
      companyId: companies[5].id,
      name: "Ping An Critical Illness Insurance",
      slug: "ping-an-ci-insurance",
      displayName: "Ping An Critical Illness Insurance",
      region: "Mainland China",
      country: "China",
      category: "CRITICAL_ILLNESS" as const,
      currency: "CNY",
      tags: ["critical-illness", "mainland", "comprehensive"],
      summary: "A comprehensive critical illness product covering major and minor conditions with competitive premiums.",
    },
    {
      companyId: companies[5].id,
      name: "Ping An Shengshi Jinyue",
      slug: "ping-an-shengshi-jinyue",
      displayName: "Ping An Shengshi Jinyue (增额终身寿)",
      region: "Mainland China",
      country: "China",
      category: "SAVINGS" as const,
      currency: "CNY",
      tags: ["savings", "increasing-sum", "whole-life", "guaranteed"],
      summary: "An increasing sum insured whole life product with guaranteed cash value growth for long-term savings.",
    },
    // China Life
    {
      companyId: companies[6].id,
      name: "China Life Critical Illness Coverage",
      slug: "china-life-ci-coverage",
      displayName: "China Life Critical Illness Coverage",
      region: "Mainland China",
      country: "China",
      category: "CRITICAL_ILLNESS" as const,
      currency: "CNY",
      tags: ["critical-illness", "mainland", "state-owned"],
      summary: "A reliable critical illness product from China's largest life insurance company.",
    },
    {
      companyId: companies[6].id,
      name: "China Life Fortune Growth",
      slug: "china-life-fortune-growth",
      displayName: "China Life Fortune Growth (增额终身寿)",
      region: "Mainland China",
      country: "China",
      category: "SAVINGS" as const,
      currency: "CNY",
      tags: ["savings", "increasing-sum", "whole-life", "fortune"],
      summary: "A whole life savings product with increasing sum insured and guaranteed returns.",
    },
    // Taikang
    {
      companyId: companies[7].id,
      name: "Taikang Critical Illness Plus",
      slug: "taikang-ci-plus",
      displayName: "Taikang Critical Illness Plus",
      region: "Mainland China",
      country: "China",
      category: "CRITICAL_ILLNESS" as const,
      currency: "CNY",
      tags: ["critical-illness", "mainland", "plus"],
      summary: "An enhanced critical illness product with additional minor condition coverage.",
    },
    {
      companyId: companies[7].id,
      name: "Taikang Zengduoduo",
      slug: "taikang-zengduoduo",
      displayName: "Taikang Zengduoduo (增多多)",
      region: "Mainland China",
      country: "China",
      category: "SAVINGS" as const,
      currency: "CNY",
      tags: ["savings", "increasing-sum", "popular", "guaranteed"],
      summary: "A popular increasing sum insured product known for competitive guaranteed returns.",
    },
    // CPIC
    {
      companyId: companies[8].id,
      name: "CPIC Critical Illness Guardian",
      slug: "cpic-ci-guardian",
      displayName: "CPIC Critical Illness Guardian",
      region: "Mainland China",
      country: "China",
      category: "CRITICAL_ILLNESS" as const,
      currency: "CNY",
      tags: ["critical-illness", "mainland", "guardian"],
      summary: "A guardian-style critical illness product with comprehensive protection features.",
    },
    {
      companyId: companies[8].id,
      name: "CPIC Evergreen Whole Life",
      slug: "cpic-evergreen-whole-life",
      displayName: "CPIC Evergreen Whole Life (增额终身寿)",
      region: "Mainland China",
      country: "China",
      category: "SAVINGS" as const,
      currency: "CNY",
      tags: ["savings", "increasing-sum", "whole-life", "evergreen"],
      summary: "A whole life savings product with steady cash value growth and flexible withdrawal options.",
    },
    // New China Life
    {
      companyId: companies[9].id,
      name: "New China Life Critical Illness",
      slug: "new-china-life-ci",
      displayName: "New China Life Critical Illness",
      region: "Mainland China",
      country: "China",
      category: "CRITICAL_ILLNESS" as const,
      currency: "CNY",
      tags: ["critical-illness", "mainland", "comprehensive"],
      summary: "A comprehensive critical illness product with extensive condition coverage.",
    },
    {
      companyId: companies[9].id,
      name: "New China Life Fortune Plus",
      slug: "new-china-life-fortune-plus",
      displayName: "New China Life Fortune Plus (增额终身寿)",
      region: "Mainland China",
      country: "China",
      category: "SAVINGS" as const,
      currency: "CNY",
      tags: ["savings", "increasing-sum", "fortune", "guaranteed"],
      summary: "A fortune-focused savings product with increasing sum insured and long-term value growth.",
    },
  ];

  const allProducts = [...hkProducts, ...mainlandProducts];

  for (const productData of allProducts) {
    const product = await prisma.product.create({
      data: {
        ...productData,
        tags: JSON.stringify(productData.tags),
        supportedCurrencies: (productData as Record<string, unknown>).supportedCurrencies
          ? JSON.stringify((productData as Record<string, unknown>).supportedCurrencies)
          : "[]",
        productStatus: "active",
      },
    });
    products.push(product);
  }

  console.log(`Created ${products.length} products`);

  // ==================== PRODUCT DETAILS ====================
  const ciProducts = products.filter((p) => p.category === "CRITICAL_ILLNESS");
  const savingsProducts = products.filter((p) => p.category === "SAVINGS");

  for (const product of ciProducts) {
    await prisma.criticalIllnessDetail.create({
      data: {
        productId: product.id,
        coverageTerm: "Lifetime",
        premiumTerm: "20 years",
        entryAgeMin: 0,
        entryAgeMax: 65,
        waitingPeriodDays: 90,
        majorIllnessCount: 120,
        minorIllnessCount: 40,
        moderateIllnessCount: 20,
        majorIllnessPayout: "100% of sum insured",
        minorIllnessPayout: "20% of sum insured",
        moderateIllnessPayout: "50% of sum insured",
        multipleClaims: true,
        cancerMultipleClaims: true,
        heartStrokeMultipleClaims: true,
        deathBenefit: "100% of sum insured",
        premiumWaiver: true,
        earlyStageCoverage: true,
        cashValue: true,
        participating: false,
        notes: "Placeholder data - to be updated with actual product details from official brochures.",
      },
    });
  }

  for (const product of savingsProducts) {
    const isHK = product.region === "Hong Kong";
    await prisma.savingsDetail.create({
      data: {
        productId: product.id,
        premiumTerm: isHK ? "5 years" : "3 years",
        coverageTerm: isHK ? "Lifetime" : "Lifetime",
        entryAgeMin: 0,
        entryAgeMax: isHK ? 75 : 70,
        currency: product.currency,
        supportedCurrencies: JSON.stringify(product.supportedCurrencies ?? []),
        participating: isHK,
        guaranteedCashValue: true,
        nonGuaranteedBonus: isHK,
        dividendType: isHK ? "Reversionary + Terminal" : undefined,
        terminalBonus: isHK,
        reversionaryBonus: isHK,
        illustratedIrr: isHK ? 4.5 : 3.0,
        guaranteedIrr: isHK ? 1.0 : 2.5,
        illustratedBreakEvenYear: isHK ? 8 : 6,
        guaranteedBreakEvenYear: isHK ? 15 : 8,
        policyLoan: true,
        changePolicyholder: true,
        changeInsured: isHK,
        educationPlanning: true,
        retirementPlanning: true,
        legacyPlanning: true,
        notes: "Placeholder data - to be updated with actual product details from official brochures.",
      },
    });
  }

  console.log("Created product details");

  // ==================== GLOSSARY TERMS ====================
  const glossaryTerms = [
    { term: "IRR", slug: "irr", definition: "Internal Rate of Return (IRR) is a metric used to estimate the annualized return of an insurance product over a specific period, taking into account the timing and amount of cash flows.", category: "Financial" },
    { term: "Guaranteed Cash Value", slug: "guaranteed-cash-value", definition: "The minimum cash value that the insurance company guarantees to pay if the policy is surrendered. This amount is specified in the policy contract.", category: "Policy Value" },
    { term: "Non-guaranteed Bonus", slug: "non-guaranteed-bonus", definition: "Additional returns that may be paid by the insurance company based on the performance of its investment portfolio. These are not guaranteed and may vary.", category: "Policy Value" },
    { term: "Surrender Value", slug: "surrender-value", definition: "The amount paid to the policyholder when a life insurance policy is cancelled before it matures or before the insured event occurs.", category: "Policy Value" },
    { term: "Participating Policy", slug: "participating-policy", definition: "A life insurance policy that participates in the profits of the insurance company, typically through dividends or bonuses.", category: "Policy Type" },
    { term: "Whole Life Insurance", slug: "whole-life-insurance", definition: "A type of life insurance that provides coverage for the entire lifetime of the insured, as long as premiums are paid.", category: "Policy Type" },
    { term: "Critical Illness Insurance", slug: "critical-illness-insurance", definition: "A type of insurance that pays a lump sum benefit upon diagnosis of a specified critical illness or medical condition.", category: "Insurance Type" },
    { term: "Savings Insurance", slug: "savings-insurance", definition: "A type of life insurance product that combines insurance protection with savings or investment features.", category: "Insurance Type" },
    { term: "Annuity", slug: "annuity", definition: "A financial product that pays out a fixed stream of income to an individual, typically used as an income stream for retirees.", category: "Insurance Type" },
    { term: "Premium Term", slug: "premium-term", definition: "The period during which the policyholder is required to pay premiums for the insurance policy.", category: "Policy Terms" },
    { term: "Coverage Term", slug: "coverage-term", definition: "The period during which the insurance policy provides coverage or protection.", category: "Policy Terms" },
    { term: "Policy Loan", slug: "policy-loan", definition: "A loan that a policyholder can take against the cash value of their life insurance policy.", category: "Policy Features" },
    { term: "Break-even Year", slug: "break-even-year", definition: "The year in which the total cash value of a policy equals the total premiums paid, meaning the policyholder has recovered their investment.", category: "Financial" },
    { term: "Dividend", slug: "dividend", definition: "A portion of the insurance company's profits distributed to policyholders of participating policies.", category: "Policy Value" },
    { term: "Terminal Bonus", slug: "terminal-bonus", definition: "A one-time bonus paid when a policy matures, is surrendered, or upon the death of the insured. It is typically non-guaranteed.", category: "Policy Value" },
    { term: "Reversionary Bonus", slug: "reversionary-bonus", definition: "A bonus declared annually by the insurance company that is added to the guaranteed sum assured of a participating policy.", category: "Policy Value" },
    { term: "Multi-Currency Policy", slug: "multi-currency-policy", definition: "An insurance policy that allows the policyholder to choose from multiple currencies for premium payment and benefit payout.", category: "Policy Features" },
    { term: "Legacy Planning", slug: "legacy-planning", definition: "The process of organizing and managing assets to be passed on to beneficiaries, often using insurance products as tools for wealth transfer.", category: "Planning" },
    { term: "Retirement Planning", slug: "retirement-planning", definition: "The process of determining retirement income goals and the actions necessary to achieve those goals, often involving insurance and investment products.", category: "Planning" },
    { term: "Education Planning", slug: "education-planning", definition: "The process of saving and investing for future education expenses, sometimes using insurance products with savings features.", category: "Planning" },
    { term: "Cancer Multiple Claims", slug: "cancer-multiple-claims", definition: "A feature in critical illness insurance that allows multiple claims for cancer-related conditions, subject to specified conditions and waiting periods.", category: "Policy Features" },
    { term: "Premium Waiver", slug: "premium-waiver", definition: "A benefit that waives future premium payments if the policyholder becomes totally disabled or is diagnosed with a specified condition.", category: "Policy Features" },
  ];

  for (const term of glossaryTerms) {
    await prisma.glossaryTerm.create({ data: term });
  }

  console.log(`Created ${glossaryTerms.length} glossary terms`);

  // ==================== COMPARISONS ====================
  // Generate comparisons for same-category products
  const comparisons = [];
  
  // HK CI comparisons
  for (let i = 0; i < ciProducts.length; i++) {
    for (let j = i + 1; j < ciProducts.length; j++) {
      const a = ciProducts[i];
      const b = ciProducts[j];
      const slug = `${a.slug}-vs-${b.slug}`;
      const comparison = await prisma.comparison.create({
        data: {
          productAId: a.id,
          productBId: b.id,
          slug,
          basicSummary: `Compare ${a.displayName} and ${b.displayName} across coverage, features, and benefits.`,
        },
      });
      comparisons.push(comparison);
    }
  }

  // Savings comparisons (HK vs HK, Mainland vs Mainland)
  const hkSavings = savingsProducts.filter((p) => p.region === "Hong Kong");
  const mainlandSavings = savingsProducts.filter((p) => p.region === "Mainland China");

  for (const group of [hkSavings, mainlandSavings]) {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const a = group[i];
        const b = group[j];
        const slug = `${a.slug}-vs-${b.slug}`;
        const comparison = await prisma.comparison.create({
          data: {
            productAId: a.id,
            productBId: b.id,
            slug,
            basicSummary: `Compare ${a.displayName} and ${b.displayName} across returns, features, and benefits.`,
          },
        });
        comparisons.push(comparison);
      }
    }
  }

  console.log(`Created ${comparisons.length} comparisons`);

  console.log("Seed completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
