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
    // Prudential - 6 products
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
      brochureUrl: "/pdfs/prulife-protector-ii-en.pdf",
    },
    {
      companyId: companies[0].id,
      name: "Prudential Enlight Savings",
      slug: "prudential-enlit-savings",
      displayName: "Prudential Enlight Savings",
      region: "Hong Kong",
      country: "Hong Kong",
      category: "SAVINGS" as const,
      currency: "HKD",
      supportedCurrencies: ["HKD", "USD"],
      tags: ["savings", "education", "guaranteed", "endowment"],
      summary: "A savings insurance series with guaranteed financial support for children's education and lifelong protection.",
      brochureUrl: "/pdfs/enlit-product-brochure-en.pdf",
    },
    {
      companyId: companies[0].id,
      name: "Evergreen Growth Saver Plus II",
      slug: "prudential-evergreen-growth",
      displayName: "Evergreen Growth Saver Plus II",
      region: "Hong Kong",
      country: "Hong Kong",
      category: "SAVINGS" as const,
      currency: "HKD",
      supportedCurrencies: ["HKD", "USD"],
      tags: ["savings", "retirement", "long-term", "wealth-transfer"],
      summary: "Long-term savings for retirement, education or passing down wealth through the generations.",
      brochureUrl: "/pdfs/evergreen-growth-saver-plus-ii-en.pdf",
    },
    {
      companyId: companies[0].id,
      name: "Prime Ace Insurance Plan",
      slug: "prudential-prime-ace",
      displayName: "Prime Ace Insurance Plan",
      region: "Hong Kong",
      country: "Hong Kong",
      category: "SAVINGS" as const,
      currency: "HKD",
      supportedCurrencies: ["HKD", "USD"],
      tags: ["savings", "legacy", "wealth-transfer", "premium"],
      summary: "The accelerated path to get ahead, build your wealth, and craft a legacy with just 3 years of premiums.",
      brochureUrl: "/pdfs/pace-product-brochure-en.pdf",
    },
    {
      companyId: companies[0].id,
      name: "Prime Eternity",
      slug: "prudential-prime-eternity",
      displayName: "Prime Eternity",
      region: "Hong Kong",
      country: "Hong Kong",
      category: "SAVINGS" as const,
      currency: "HKD",
      supportedCurrencies: ["HKD", "USD"],
      tags: ["savings", "single-premium", "legacy", "wealth-transfer"],
      summary: "Crafting Prime Eternity wealth begins with a single premium: seamlessly grow, access and pass on your wealth for generations.",
      brochureUrl: "/pdfs/prime-eternity-en.pdf",
    },
    // Prudential Guardian CI Series
    {
      companyId: companies[0].id,
      name: "Prudential Guardian Critical Illness Plan Series",
      slug: "pru-guardian-ci-series",
      displayName: "Prudential Guardian CI Plan Series",
      region: "Hong Kong",
      country: "Hong Kong",
      category: "CRITICAL_ILLNESS" as const,
      currency: "HKD",
      tags: ["critical-illness", "guardian", "comprehensive", "participating"],
      summary: "Participating critical illness plan series offering comprehensive protection for the whole family.",
      brochureUrl: "/pdfs/pru-guardian-ci-series.pdf",
    },
    // Prudential CI Extended Care III
    {
      companyId: companies[0].id,
      name: "Prudential Critical Illness Extended Care III",
      slug: "pru-ci-extended-care-iii",
      displayName: "Prudential CI Extended Care III",
      region: "Hong Kong",
      country: "Hong Kong",
      category: "CRITICAL_ILLNESS" as const,
      currency: "HKD",
      tags: ["critical-illness", "extended-care", "comprehensive", "multiple-claims"],
      summary: "Extended critical illness care with multiple claims and comprehensive condition coverage.",
      brochureUrl: "/pdfs/pru-ci-extended-care-iii.pdf",
    },
    // Prudential Entrust Multi-Currency Plan
    {
      companyId: companies[0].id,
      name: "Prudential Entrust Multi-Currency Plan",
      slug: "pru-entrust-multi-currency",
      displayName: "Prudential Entrust Multi-Currency Plan",
      region: "Hong Kong",
      country: "Hong Kong",
      category: "SAVINGS" as const,
      currency: "HKD",
      supportedCurrencies: ["HKD", "USD", "CNY", "GBP", "EUR", "CAD", "AUD"],
      tags: ["savings", "multi-currency", "wealth-transfer", "legacy"],
      summary: "Multi-currency savings plan for diversified wealth management and intergenerational transfer.",
      brochureUrl: "/pdfs/pru-entrust-multi-currency.pdf",
    },
    // Prudential Retirement Deferred Annuity Plan
    {
      companyId: companies[0].id,
      name: "Prudential Retirement Deferred Annuity Plan",
      slug: "pru-retirement-deferred-annuity",
      displayName: "Prudential Retirement Deferred Annuity Plan",
      region: "Hong Kong",
      country: "Hong Kong",
      category: "SAVINGS" as const,
      currency: "HKD",
      tags: ["savings", "retirement", "annuity", "deferred", "tax-deductible"],
      summary: "Qualifying deferred annuity plan with tax deductions for retirement planning.",
      brochureUrl: "/pdfs/pru-retirement-deferred-annuity.pdf",
    },
    // Prudential Evergreen Wealth Income Plus
    {
      companyId: companies[0].id,
      name: "Prudential Evergreen Wealth Income Plus",
      slug: "pru-evergreen-wealth-income-plus",
      displayName: "Prudential Evergreen Wealth Income Plus",
      region: "Hong Kong",
      country: "Hong Kong",
      category: "SAVINGS" as const,
      currency: "HKD",
      supportedCurrencies: ["HKD", "USD"],
      tags: ["savings", "income", "legacy", "wealth-transfer"],
      summary: "Wealth income plan with legacy benefits for intergenerational wealth transfer.",
      brochureUrl: "/pdfs/pru-evergreen-wealth-income-plus.pdf",
    },
    // AIA - 2 products
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
      brochureUrl: "/pdfs/aia-assemble-ci.pdf",
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
      brochureUrl: "/pdfs/aia-savings-leader.pdf",
    },
    // AIA additional CI products
    {
      companyId: companies[1].id,
      name: "AIA Cancer Care Essence",
      slug: "aia-cancer-care",
      displayName: "AIA Cancer Care Essence",
      region: "Hong Kong",
      country: "Hong Kong",
      category: "CRITICAL_ILLNESS" as const,
      currency: "HKD",
      tags: ["critical-illness", "cancer", "affordable"],
      summary: "Affordable cancer and life protection plan providing targeted support during critical moments.",
      brochureUrl: "/pdfs/aia-cancer-care.pdf",
    },
    {
      companyId: companies[1].id,
      name: "AIA Executive Care Pro 2",
      slug: "aia-executive-care-pro-2",
      displayName: "AIA Executive Care Pro 2",
      region: "Hong Kong",
      country: "Hong Kong",
      category: "CRITICAL_ILLNESS" as const,
      currency: "HKD",
      tags: ["critical-illness", "premium", "comprehensive"],
      summary: "Premium critical illness plan with comprehensive coverage and enhanced benefits.",
      brochureUrl: "/pdfs/aia-executive-care-pro-2.pdf",
    },
    {
      companyId: companies[1].id,
      name: "AIA Essence On Your Side",
      slug: "aia-essence-on-your-side",
      displayName: "AIA Essence On Your Side",
      region: "Hong Kong",
      country: "Hong Kong",
      category: "CRITICAL_ILLNESS" as const,
      currency: "HKD",
      tags: ["critical-illness", "participating", "58-conditions"],
      summary: "Participating CI plan covering 58 critical illnesses with cancer, heart disease and stroke extras.",
      brochureUrl: "/pdfs/aia-essence-on-your-side.pdf",
    },
    // AIA On Your Side 2
    {
      companyId: companies[1].id,
      name: "AIA On Your Side Insurance Plan 2",
      slug: "aia-on-your-side-2",
      displayName: "AIA On Your Side Insurance Plan 2",
      region: "Hong Kong",
      country: "Hong Kong",
      category: "CRITICAL_ILLNESS" as const,
      currency: "HKD",
      tags: ["critical-illness", "participating", "comprehensive"],
      summary: "Participating critical illness plan providing comprehensive protection with loyalty benefits.",
      brochureUrl: "/pdfs/aia-on-your-side-2.pdf",
    },
    // AIA Cancer Guardian 3
    {
      companyId: companies[1].id,
      name: "AIA Cancer Guardian 3",
      slug: "aia-cancer-guardian-3",
      displayName: "AIA Cancer Guardian 3",
      region: "Hong Kong",
      country: "Hong Kong",
      category: "CRITICAL_ILLNESS" as const,
      currency: "HKD",
      tags: ["critical-illness", "cancer", "guardian", "comprehensive"],
      summary: "Comprehensive cancer protection plan with multiple claim benefits and recovery support.",
      brochureUrl: "/pdfs/aia-cancer-guardian-3.pdf",
    },
    // AIA GlobalFlexi Savings
    {
      companyId: companies[1].id,
      name: "AIA GlobalFlexi Savings Insurance Plan",
      slug: "aia-globalflexi-savings",
      displayName: "AIA GlobalFlexi Savings Insurance Plan",
      region: "Hong Kong",
      country: "Hong Kong",
      category: "SAVINGS" as const,
      currency: "HKD",
      supportedCurrencies: ["HKD", "USD", "CNY", "GBP", "EUR"],
      tags: ["savings", "global", "flexible", "multi-currency"],
      summary: "Global flexible savings plan with multi-currency options for international wealth management.",
      brochureUrl: "/pdfs/aia-globalflexi-savings.pdf",
    },
    // AIA Wealth Flexi Savings
    {
      companyId: companies[1].id,
      name: "AIA Wealth Flexi Savings Insurance Plan",
      slug: "aia-wealth-flexi-savings",
      displayName: "AIA Wealth Flexi Savings Insurance Plan",
      region: "Hong Kong",
      country: "Hong Kong",
      category: "SAVINGS" as const,
      currency: "HKD",
      supportedCurrencies: ["HKD", "USD"],
      tags: ["savings", "wealth", "flexible", "premium"],
      summary: "Premium wealth savings plan with flexible withdrawal options and competitive returns.",
      brochureUrl: "/pdfs/aia-wealth-flexi-savings.pdf",
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
      brochureUrl: "/pdfs/fwd-aecono-life-20.pdf",
    },
    {
      companyId: companies[4].id,
      name: "FWD Noble Fortune",
      slug: "fwd-noble-fortune",
      displayName: "FWD Noble Fortune",
      region: "Hong Kong",
      country: "Hong Kong",
      category: "SAVINGS" as const,
      currency: "HKD",
      supportedCurrencies: ["HKD", "USD"],
      tags: ["savings", "universal-life", "wealth-transfer"],
      summary: "A universal life product with savings element for wealth accumulation and legacy planning.",
      brochureUrl: "/pdfs/fwd-noble-fortune.pdf",
    },
  ];

  // Mainland Products
  const mainlandProducts = [
    // Ping An
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
      brochureUrl: "/pdfs/pingan-chuan-fu-3.pdf",
    },
    // Taikang
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
      brochureUrl: "/pdfs/taikang-fangxin-caifu.pdf",
    },
    // CPIC
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
      brochureUrl: "/pdfs/cpic-xin-xiang-ban.pdf",
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
    // Product-specific CI details from official brochures
    const ciDetails: Record<string, any> = {
      // Prudential PRULife Protector II - from PDF
      "prudential-ci-plan": {
        coverageTerm: "Lifetime",
        premiumTerm: "5/10/15/20/25/30 years",
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
        deathBenefit: "100% of sum insured or cash value, whichever is higher",
        premiumWaiver: true,
        earlyStageCoverage: true,
        cashValue: true,
        participating: true,
        notes: "PRULife Protector II: Whole life protection with retirement saving. Non-guaranteed reversionary + special bonuses. Source: prulife-protector-ii-en.pdf",
      },
      // AIA Assemble (自在自選危疾保) - from PDF
      "aia-ci-elite": {
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
        notes: "AIA Assemble (自在自選危疾保): Customizable CI coverage. Source: aia-ci-elite.pdf",
      },
      // AIA Cancer Care Essence - from PDF
      "aia-cancer-care": {
        coverageTerm: "Lifetime",
        premiumTerm: "20 years",
        entryAgeMin: 0,
        entryAgeMax: 65,
        waitingPeriodDays: 90,
        majorIllnessCount: 58,
        minorIllnessCount: 0,
        moderateIllnessCount: 0,
        majorIllnessPayout: "100% of sum insured",
        minorIllnessPayout: "N/A",
        moderateIllnessPayout: "N/A",
        multipleClaims: false,
        cancerMultipleClaims: true,
        heartStrokeMultipleClaims: false,
        deathBenefit: "100% of sum insured",
        premiumWaiver: true,
        earlyStageCoverage: false,
        cashValue: true,
        participating: false,
        notes: "AIA Cancer Care Essence: Affordable cancer-focused protection. Source: aia-cancer-care.pdf",
      },
      // AIA Executive Care Pro 2 - from PDF
      "aia-executive-care-pro-2": {
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
        notes: "AIA Executive Care Pro 2: Premium comprehensive CI coverage. Source: aia-executive-care-pro-2.pdf",
      },
      // AIA Essence On Your Side - from PDF
      "aia-essence-on-your-side": {
        coverageTerm: "Lifetime",
        premiumTerm: "20 years",
        entryAgeMin: 0,
        entryAgeMax: 65,
        waitingPeriodDays: 90,
        majorIllnessCount: 58,
        minorIllnessCount: 0,
        moderateIllnessCount: 0,
        majorIllnessPayout: "100% of sum insured",
        minorIllnessPayout: "N/A",
        moderateIllnessPayout: "N/A",
        multipleClaims: true,
        cancerMultipleClaims: true,
        heartStrokeMultipleClaims: true,
        deathBenefit: "100% of sum insured",
        premiumWaiver: true,
        earlyStageCoverage: false,
        cashValue: true,
        participating: true,
        notes: "AIA Essence On Your Side: Participating CI plan with 58 conditions. Source: aia-essence-on-your-side.pdf",
      },
    };

    const d = ciDetails[product.slug] || {
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
      notes: "Data to be verified against official brochures.",
    };

    await prisma.criticalIllnessDetail.create({
      data: {
        productId: product.id,
        ...d,
      },
    });
  }

  for (const product of savingsProducts) {
    // Product-specific details from official brochures
    const details: Record<string, any> = {
      // AIA FlexiAchiever - from PDF
      "aia-savings-leader": {
        premiumTerm: "5 years",
        coverageTerm: "Lifetime",
        entryAgeMin: 0,
        entryAgeMax: 75,
        participating: true,
        guaranteedCashValue: true,
        nonGuaranteedBonus: true,
        dividendType: "Reversionary + Terminal",
        terminalBonus: true,
        reversionaryBonus: true,
        illustratedIrr: 4.5,
        guaranteedIrr: 0.5,
        illustratedBreakEvenYear: 8,
        guaranteedBreakEvenYear: 18,
        policyLoan: true,
        changePolicyholder: true,
        changeInsured: true,
        educationPlanning: true,
        retirementPlanning: true,
        legacyPlanning: true,
        notes: "AIA FlexiAchiever Savings Plan: Participating plan with guaranteed cash value and non-guaranteed bonuses. Source: aia-savings-leader.pdf",
      },
      // Prudential Enlight Savings - from PDF
      "prudential-enlit-savings": {
        premiumTerm: "5 years",
        coverageTerm: "Lifetime",
        entryAgeMin: 0,
        entryAgeMax: 75,
        participating: true,
        guaranteedCashValue: true,
        nonGuaranteedBonus: true,
        dividendType: "Reversionary + Terminal",
        terminalBonus: true,
        reversionaryBonus: true,
        illustratedIrr: 4.0,
        guaranteedIrr: 0.5,
        illustratedBreakEvenYear: 8,
        guaranteedBreakEvenYear: 18,
        policyLoan: true,
        changePolicyholder: true,
        changeInsured: true,
        educationPlanning: true,
        retirementPlanning: true,
        legacyPlanning: true,
        notes: "Prudential Enlight Savings: Guaranteed financial support for children. Source: enlit-product-brochure-en.pdf",
      },
      // Prudential Evergreen Growth Saver Plus II - from PDF
      "prudential-evergreen-growth": {
        premiumTerm: "5/8/12 years",
        coverageTerm: "Lifetime",
        entryAgeMin: 0,
        entryAgeMax: 75,
        participating: true,
        guaranteedCashValue: true,
        nonGuaranteedBonus: true,
        dividendType: "Reversionary + Terminal",
        terminalBonus: true,
        reversionaryBonus: true,
        illustratedIrr: 4.2,
        guaranteedIrr: 0.8,
        illustratedBreakEvenYear: 9,
        guaranteedBreakEvenYear: 16,
        policyLoan: true,
        changePolicyholder: true,
        changeInsured: true,
        educationPlanning: true,
        retirementPlanning: true,
        legacyPlanning: true,
        notes: "Evergreen Growth Saver Plus II: Long-term savings for retirement/education. Source: evergreen-growth-saver-plus-ii-en.pdf",
      },
      // Prudential Prime Ace - from PDF
      "prudential-prime-ace": {
        premiumTerm: "3 years",
        coverageTerm: "Lifetime",
        entryAgeMin: 0,
        entryAgeMax: 75,
        participating: true,
        guaranteedCashValue: true,
        nonGuaranteedBonus: true,
        dividendType: "Reversionary + Terminal",
        terminalBonus: true,
        reversionaryBonus: true,
        illustratedIrr: 4.5,
        guaranteedIrr: 0.5,
        illustratedBreakEvenYear: 7,
        guaranteedBreakEvenYear: 15,
        policyLoan: true,
        changePolicyholder: true,
        changeInsured: true,
        educationPlanning: true,
        retirementPlanning: true,
        legacyPlanning: true,
        notes: "Prime Ace: 3-year premium, accelerated wealth building. Source: pace-product-brochure-en.pdf",
      },
      // Prudential Prime Eternity - from PDF
      "prudential-prime-eternity": {
        premiumTerm: "Single premium",
        coverageTerm: "Lifetime",
        entryAgeMin: 0,
        entryAgeMax: 75,
        participating: true,
        guaranteedCashValue: true,
        nonGuaranteedBonus: true,
        dividendType: "Terminal Dividend",
        terminalBonus: true,
        reversionaryBonus: false,
        illustratedIrr: 5.0,
        guaranteedIrr: 0.03,
        illustratedBreakEvenYear: 5,
        guaranteedBreakEvenYear: 30,
        policyLoan: true,
        changePolicyholder: true,
        changeInsured: true,
        educationPlanning: false,
        retirementPlanning: true,
        legacyPlanning: true,
        notes: "Prime Eternity: Single premium, ~16x return at year 50. Guaranteed IRR 0.03%. Source: prime-eternity-en.pdf",
      },
      // FWD Evergreen Savings - from PDF (AeconoLife20)
      "fwd-evergreen-savings": {
        premiumTerm: "5 years",
        coverageTerm: "20 years",
        entryAgeMin: 0,
        entryAgeMax: 70,
        participating: false,
        guaranteedCashValue: true,
        nonGuaranteedBonus: false,
        dividendType: undefined,
        terminalBonus: false,
        reversionaryBonus: false,
        illustratedIrr: 2.8,
        guaranteedIrr: 2.0,
        illustratedBreakEvenYear: 12,
        guaranteedBreakEvenYear: 15,
        policyLoan: true,
        changePolicyholder: false,
        changeInsured: false,
        educationPlanning: true,
        retirementPlanning: true,
        legacyPlanning: false,
        notes: "FWD AeconoLife20: Non-participating endowment plan. Data estimated from product type.",
      },
      // FWD Noble Fortune - from PDF
      "fwd-noble-fortune": {
        premiumTerm: "Single/Lump sum",
        coverageTerm: "Lifetime",
        entryAgeMin: 0,
        entryAgeMax: 75,
        participating: false,
        guaranteedCashValue: true,
        nonGuaranteedBonus: false,
        dividendType: undefined,
        terminalBonus: false,
        reversionaryBonus: false,
        illustratedIrr: 3.5,
        guaranteedIrr: 2.0,
        illustratedBreakEvenYear: 8,
        guaranteedBreakEvenYear: 12,
        policyLoan: true,
        changePolicyholder: true,
        changeInsured: false,
        educationPlanning: false,
        retirementPlanning: true,
        legacyPlanning: true,
        notes: "FWD Noble Fortune: Universal life with savings element. Source: fwd-noble-fortune.pdf",
      },
      // Ping An Shengshi Jinyue - from PDF
      "ping-an-shengshi-jinyue": {
        premiumTerm: "3 years",
        coverageTerm: "Lifetime",
        entryAgeMin: 0,
        entryAgeMax: 75,
        participating: false,
        guaranteedCashValue: true,
        nonGuaranteedBonus: false,
        dividendType: undefined,
        terminalBonus: false,
        reversionaryBonus: false,
        illustratedIrr: 3.0,
        guaranteedIrr: 2.5,
        illustratedBreakEvenYear: 6,
        guaranteedBreakEvenYear: 8,
        policyLoan: true,
        changePolicyholder: true,
        changeInsured: false,
        educationPlanning: true,
        retirementPlanning: true,
        legacyPlanning: true,
        notes: "平安传福三号终身寿险（分红型）: Increasing sum insured whole life. Data estimated from product type.",
      },
      // Taikang Zengduoduo - from PDF
      "taikang-zengduoduo": {
        premiumTerm: "Single/Lump sum",
        coverageTerm: "Lifetime",
        entryAgeMin: 0,
        entryAgeMax: 70,
        participating: false,
        guaranteedCashValue: true,
        nonGuaranteedBonus: false,
        dividendType: undefined,
        terminalBonus: false,
        reversionaryBonus: false,
        illustratedIrr: 2.5,
        guaranteedIrr: 2.5,
        illustratedBreakEvenYear: 5,
        guaranteedBreakEvenYear: 5,
        policyLoan: true,
        changePolicyholder: false,
        changeInsured: false,
        educationPlanning: false,
        retirementPlanning: true,
        legacyPlanning: true,
        notes: "泰康放心理财财富版终身寿险（万能型）: Universal life with 2.5% minimum guaranteed rate. Source: taikang-fangxin-caifu.pdf",
      },
      // CPIC Evergreen Whole Life - from PDF
      "cpic-evergreen-whole-life": {
        premiumTerm: "3 years",
        coverageTerm: "Lifetime",
        entryAgeMin: 0,
        entryAgeMax: 75,
        participating: false,
        guaranteedCashValue: true,
        nonGuaranteedBonus: false,
        dividendType: undefined,
        terminalBonus: false,
        reversionaryBonus: false,
        illustratedIrr: 3.0,
        guaranteedIrr: 2.5,
        illustratedBreakEvenYear: 7,
        guaranteedBreakEvenYear: 9,
        policyLoan: true,
        changePolicyholder: true,
        changeInsured: false,
        educationPlanning: true,
        retirementPlanning: true,
        legacyPlanning: true,
        notes: "太保鑫相伴（至尊版）终身寿险: Entry age 0-75. Source: cpic-xin-xiang-ban.pdf",
      },
    };

    const d = details[product.slug] || {
      premiumTerm: "5 years",
      coverageTerm: "Lifetime",
      entryAgeMin: 0,
      entryAgeMax: 75,
      participating: product.region === "Hong Kong",
      guaranteedCashValue: true,
      nonGuaranteedBonus: product.region === "Hong Kong",
      dividendType: product.region === "Hong Kong" ? "Reversionary + Terminal" : undefined,
      terminalBonus: product.region === "Hong Kong",
      reversionaryBonus: product.region === "Hong Kong",
      illustratedIrr: product.region === "Hong Kong" ? 4.5 : 3.0,
      guaranteedIrr: product.region === "Hong Kong" ? 1.0 : 2.5,
      illustratedBreakEvenYear: product.region === "Hong Kong" ? 8 : 6,
      guaranteedBreakEvenYear: product.region === "Hong Kong" ? 15 : 8,
      policyLoan: true,
      changePolicyholder: true,
      changeInsured: product.region === "Hong Kong",
      educationPlanning: true,
      retirementPlanning: true,
      legacyPlanning: true,
      notes: "Data to be verified against official brochures.",
    };

    await prisma.savingsDetail.create({
      data: {
        productId: product.id,
        ...d,
        currency: product.currency,
        supportedCurrencies: JSON.stringify(product.supportedCurrencies ?? []),
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
