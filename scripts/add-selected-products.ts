// scripts/add-selected-products.ts
// Add 7 selected products (not yet in DB) to database.
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { selectedHotDiscussedInsuranceProducts } from "../data/hot-discussed-products";
import path from "path";

const root = process.cwd();
const adapter = new PrismaBetterSqlite3({ url: `file:${path.join(root, "dev.db")}` });
const prisma = new PrismaClient({ adapter });

const productTemplates: Record<string, {
  name: string;
  displayName: string;
  productStatus: string;
  subcategory?: string;
  summary: string;
  dataStatus: string;
  manualDownloadNote: string;
  localPdfPath: string;
  currency: string;
  region: string;
  country: string;
  criticalIllness?: object;
  savings?: object;
}> = {
  "pingan-fuli-20-ci": {
    name: "Ping An Fu Li 20 Critical Illness Insurance",
    displayName: "平安福禄20重大疾病保险",
    productStatus: "discontinued",
    summary: "Ping An's historical flagship critical illness product, 2020 version. Historical product, currently in discontinued status. PDF is a historical mirror.",
    dataStatus: "manual_verified",
    manualDownloadNote: "PDF from historical mirror (https://file.shenlanbao.com/2020/03/26/120032616035448801.pdf), not from official Ping An website.",
    localPdfPath: "/pdfs-by-company/ping-an/pingan-fuli-20-ci-\u5e73\u5b89\u798f\u798420\u91cd\u5927\u75be\u75c5\u4fdd\u9669.pdf",
    currency: "CNY",
    region: "Mainland China",
    country: "China",
    criticalIllness: {
      coverageTerm: "终身",
      premiumTerm: "20年",
      waitingPeriodDays: 90,
      majorIllnessCount: 80,
      minorIllnessCount: 30,
    },
  },
  "pingan-ruyi-quanneng-2025-ci": {
    name: "Ping An Ruyi Quanneng 2025 Critical Illness Insurance",
    displayName: "平安附加如意全能（2025）提前给付重大疾病保险",
    productStatus: "active",
    summary: "Ping An's current 2025 critical illness product, structured as an add-on to main life insurance policy with early payment benefit.",
    dataStatus: "manual_verified",
    manualDownloadNote: "Official PDF from Ping An Life Insurance product disclosure page.",
    localPdfPath: "/pdfs-by-company/ping-an/pingan-ruyi-quanneng-2025-ci-\u5e73\u5b89\u5982\u610f\u5168\u80fd2025.pdf",
    currency: "CNY",
    region: "Mainland China",
    country: "China",
    criticalIllness: {
      coverageTerm: "终身",
      premiumTerm: "20年/30年",
      waitingPeriodDays: 90,
      majorIllnessCount: 120,
      minorIllnessCount: 30,
    },
  },
  "pingan-shengshi-jinyue-zunxiang-26II": {
    name: "Ping An Shengshi Jinyue (Zunxiang Ban 26 II) Whole Life Insurance (Dividend)",
    displayName: "平安盛世金越（尊享版26Ⅱ）终身寿险（分红型）",
    productStatus: "active",
    summary: "Ping An's flagship participating whole life insurance product, 2026 premium version, suitable for wealth inheritance and growth.",
    dataStatus: "manual_verified",
    manualDownloadNote: "Official PDF from Ping An Life Insurance product disclosure page.",
    localPdfPath: "/pdfs-by-company/ping-an/pingan-shengshi-jinyue-zunxiang-26II-\u5e73\u5b89\u76db\u4e16\u91d1\u8d8a\u7cfb\u5217.pdf",
    currency: "CNY",
    region: "Mainland China",
    country: "China",
    savings: {
      coverageTerm: "终身",
      premiumTerm: "3年/5年/10年",
      participating: true,
    },
  },
  "pingan-yuxiang-jinyue-2025": {
    name: "Ping An Yuxiang Jinyue 2025 Whole Life Insurance (Dividend)",
    displayName: "平安御享金越（2025）终身寿险（分红型）",
    productStatus: "active",
    summary: "Ping An's 2025 participating whole life insurance, complements the Shengshi Jinyue series.",
    dataStatus: "manual_verified",
    manualDownloadNote: "Official PDF from Ping An Life Insurance product disclosure page.",
    localPdfPath: "/pdfs-by-company/ping-an/pingan-yuxiang-jinyue-2025-\u5e73\u5b89\u5fa1\u4eab\u91d1\u8d8a2025.pdf",
    currency: "CNY",
    region: "Mainland China",
    country: "China",
    savings: {
      coverageTerm: "终身",
      premiumTerm: "3年/5年/10年/20年",
      participating: true,
    },
  },
  "cpic-jinshengwuyou-2024-kids": {
    name: "CPIC Jinsheng Wuyou 2024 (Kids) Critical Illness Insurance",
    displayName: "太保金生无忧2024（少儿版）重大疾病保险",
    productStatus: "active",
    summary: "CPIC's flagship Jinsheng Wuyou series kids version, 2024 edition. Adults version PDF is not yet available.",
    dataStatus: "manual_verified",
    manualDownloadNote: "Official PDF from CPIC product disclosure page.",
    localPdfPath: "/pdfs-by-company/cpic-life/cpic-jinshengwuyou-2024-kids-\u91d1\u751f\u65e0\u5fe7\u7cfb\u5217.pdf",
    currency: "CNY",
    region: "Mainland China",
    country: "China",
    criticalIllness: {
      coverageTerm: "终身",
      premiumTerm: "10年/15年/20年",
      waitingPeriodDays: 90,
      majorIllnessCount: 100,
      minorIllnessCount: 50,
    },
  },
  "taikang-xinxingshijia-2026-qingdianban": {
    name: "Taikang Xinxing Shijia 2026 (Qingdian Ban) Whole Life Insurance (Dividend)",
    displayName: "鑫享世家2026（庆典版）终身寿险（分红型）",
    productStatus: "active",
    summary: "Taikang's 2026 Xinxing Shijia Qingdian Ban participating whole life insurance, suitable for wealth inheritance.",
    dataStatus: "manual_verified",
    manualDownloadNote: "User-supplied PDF, official disclosure page link TBD.",
    localPdfPath: "/pdfs-by-company/taikang-life/\u6cf0\u5eb7\u946b\u4eab\u4e16\u5bb6 2026\uff08\u5e86\u5178\u7248\uff09\u7ec8\u8eab\u5bff\u9669\uff08\u5206\u7ea2\u578b\uff09.pdf",
    currency: "CNY",
    region: "Mainland China",
    country: "China",
    savings: {
      coverageTerm: "终身",
      premiumTerm: "趸交/3年/5年/10年",
      participating: true,
    },
  },
  "taikang-xinxingshijia-2026-zunxiangban-b": {
    name: "Taikang Xinxing Shijia 2026 (Zunxiang Ban B) Whole Life Insurance (Dividend)",
    displayName: "鑫享世家2026（尊享版 B 款）终身寿险（分红型）",
    productStatus: "active",
    summary: "Taikang's 2026 Xinxing Shijia Zunxiang Ban B premium version, higher benefit tier.",
    dataStatus: "manual_verified",
    manualDownloadNote: "User-supplied PDF, official disclosure page link TBD.",
    localPdfPath: "/pdfs-by-company/taikang-life/\u6cf0\u5eb7\u946b\u4eab\u4e16\u5bb6 2026\uff08\u5c0a\u4eab\u7248 B \u6b3e\uff09\u7ec8\u8eab\u5bff\u9669\uff08\u5206\u7ea2\u578b\uff09.pdf",
    currency: "CNY",
    region: "Mainland China",
    country: "China",
    savings: {
      coverageTerm: "终身",
      premiumTerm: "趸交/3年/5年/10年",
      participating: true,
    },
  },
};

async function main() {
  const companies = await prisma.company.findMany({
    select: { id: true, slug: true },
  });
  const companyIdBySlug = new Map(companies.map((c) => [c.slug, c.id]));

  const missingSelected = selectedHotDiscussedInsuranceProducts
    .filter((s) => s.db_slug && !s.db_slug.startsWith("pending-") && productTemplates[s.db_slug])
    .filter((s) => s.company_slug);

  console.log(`将创建 ${missingSelected.length} 个产品\n`);

  for (const sel of missingSelected) {
    const tpl = productTemplates[sel.db_slug];
    const companyId = companyIdBySlug.get(sel.company_slug);
    if (!companyId) {
      console.log(`❌ 公司不存在: ${sel.company_slug}`);
      continue;
    }

    const existing = await prisma.product.findUnique({ where: { slug: sel.db_slug } });
    if (existing) {
      console.log(`⏭️  跳过（已存在）: ${sel.db_slug}`);
      continue;
    }

    const createData: any = {
      slug: sel.db_slug,
      name: tpl.name,
      displayName: tpl.displayName,
      companyId: companyId,
      region: tpl.region,
      country: tpl.country,
      category: sel.category === "critical_illness" ? "CRITICAL_ILLNESS" : "SAVINGS",
      subcategory: tpl.subcategory ?? null,
      currency: tpl.currency,
      supportedCurrencies: "[]",
      productStatus: tpl.productStatus,
      officialUrl: null,
      brochureUrl: null,
      summary: tpl.summary,
      description: null,
      tags: "[]",
      viewCount: 0,
      compareCount: 0,
      dataStatus: tpl.dataStatus,
      isPublished: false,
      sourceStatus: "selected_v1",
      localPdfPath: tpl.localPdfPath,
      manualDownloadNote: tpl.manualDownloadNote,
      manualDownloadVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const product = await prisma.product.create({
      data: createData,
    });
    console.log(`✅ ${sel.db_slug} → ${product.id}`);

    if (tpl.criticalIllness) {
      await prisma.criticalIllnessDetail.create({
        data: { productId: product.id, ...tpl.criticalIllness },
      });
    }
    if (tpl.savings) {
      await prisma.savingsDetail.create({
        data: { productId: product.id, ...tpl.savings },
      });
    }
  }

  await prisma.$disconnect();
  console.log("\n完成");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
