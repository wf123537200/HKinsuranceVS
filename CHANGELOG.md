# Changelog

## 2026-06-15 — V2 Data Status Machine

### Schema Changes
- Added `dataStatus` (String, default "needs_verification") — Product lifecycle status
- Added `manualDownloadVerified` (Boolean, default false) — PDF manual verification flag
- Added `manualDownloadNote` (String?) — Note about manual download source
- `dataStatus` values: published, manual_verified, candidate, needs_verification, mismatch, out_of_scope

### Product Status Changes
- 27 products → `manual_verified` (PDFs manually downloaded from official websites)
- 8 products → `candidate` (AXA, New China Life, AIA On Your Side series, Genesis Centurion)
- 9 products → `needs_verification` / `mismatch` (unpublished)
- 3 products → `out_of_scope` (cancer/endowment, unpublished)

### Restored Products
- Prudential Enlight Savings, Prime Ace, Prime Eternity, CI Extended Care III → manual_verified
- Manulife Prestige Achiever, FWD Noble Fortune → manual_verified
- AIA Essence On Your Side, On Your Side 2 → candidate
- New China Life products → candidate
- AXA products → candidate (new)
- Genesis Centurion (separate from ManuCentury) → candidate (new)

### Product Name Fixes
- Mainland products now use official Chinese names as primary
- ManuCentury vs Genesis Centurion properly separated

### Frontend Changes
- All product queries now filter by `dataStatus in ["published", "manual_verified", "candidate"]`
- AI compare API validates `dataStatus in ["published", "manual_verified"]`

---

## 2026-06-15 — V1 Product Database Cleanup

### Schema Changes
- Added `isPublished` (Boolean, default true) to Product model — controls site visibility
- Added `sourceStatus` (String?) to Product model — tracks data quality status
- Added `sourceAccessedDate` (String?) to Product model
- Added `localPdfPath` (String?) to Product model
- Added `notes` (String?) to Product model
- Added `CompanyRating` table with structured rating data (agency, value, type, entity, outlook, date, source URL, status)

### Published Products (21 total)
**Prudential**: Evergreen Growth Saver Plus II, Entrust Multi-Currency Plan
**AIA**: GlobalFlexi Savings Insurance Plan
**Manulife**: ManuCentury (renamed from Genesis Centurion), ManuBright Care Pro, IncomeShield CI
**FWD**: MaxFocus Legacy II, WealthICON Supreme III, WealthICON Horizon, Crisis One Master, Crisis U Supporter, EasyCover CI
**Ping An**: Shengshi Jinyue (Premium), Ruyi Quanneng CI 2025
**Taikang**: Zunxiang Shijia (Increasing), Zunxiang Shijia (Flagship), Lexiang Jiankang 2026, Lexiang Jiankang (Kids B) (NEW)
**CPIC**: Xiangban Zhizun 2024S, Jinsheng Wuyou Kids, Wenying Jinsheng CI

### Unpublished Products (23 total, kept in seed but hidden)
- Prudential: CI Plan, Enlight Savings, Prime Ace, Prime Eternity, Guardian CI Series, CI Extended Care III
- AIA: CI Elite, Savings Leader, Cancer Care Essence, Executive Care Pro 2, Essence On Your Side, On Your Side 2, Cancer Guardian 3, Wealth Flexi Savings
- Manulife: IncomeGuard CI, Prestige Achiever
- FWD: Noble Fortune
- Ping An: Ruyi Quanneng Endowment (category_needs_review)
- Taikang: Zengduoduo (needs_verification)
- CPIC: Evergreen Whole Life (mismatch)
- New China Life: Rongyao Xinxiang, Rongyao Shijia, Jiankang Wuyou (all needs_verification)

### Deferred Companies
- **AXA**: No products published — requires official product page/PDF verification
- **China Life**: No products published — requires official brochure PDF confirmation

### New Products Added
- `taikang-lexiangjiankang-kids` — Taikang Lexiang Jiankang (Kids B) — critical_illness
- `new-china-life-rongyao-xinxiang` — New China Life Rongyao Xinxiang — savings (unpublished)
- `new-china-life-rongyao-shijia` — New China Life Rongyao Shijia — savings (unpublished)
- `new-china-life-jiankang-wuyou` — New China Life Jiankang Wuyou — critical_illness (unpublished)

### Renamed Products
- `manulife-genesis-centurion` → `manulife-manucentury` (ManuCentury / 世紀傳承保障計劃)

### Translation Updates
- Added translations for all new products (EN, zh-CN, zh-TW)
- Updated product name and summary translations for renamed product

### Rating Data
- Added 23 structured rating entries across all 10 companies
- 11 ratings marked as `confirmed`, 12 marked as `needs_entity_verification`
- Rating entities clearly specified (group vs subsidiary vs life vs P&C)

### Page Updates
- All product queries now filter by `isPublished: true`
- Products page, rankings, search, sitemap, company detail, homepage all updated

### Files Modified
- `prisma/schema.prisma` — Added Product fields + CompanyRating model
- `prisma/seed.ts` — Cleaned product data, added ratings, added new products
- `lib/translations.ts` — Added/updated translations for new and renamed products
- `app/[locale]/page.tsx` — Added isPublished filter
- `app/[locale]/products/page.tsx` — Added isPublished filter
- `app/[locale]/products/critical-illness/page.tsx` — Added isPublished filter
- `app/[locale]/products/savings/page.tsx` — Added isPublished filter
- `app/[locale]/rankings/page.tsx` — Added isPublished filter
- `app/[locale]/rankings/savings/page.tsx` — Added isPublished filter
- `app/[locale]/rankings/critical-illness/page.tsx` — Added isPublished filter
- `app/[locale]/company/[slug]/page.tsx` — Added isPublished filter
- `app/[locale]/sitemap/page.tsx` — Added isPublished filter
- `app/[locale]/search/page.tsx` — Added isPublished filter
- `docs/data-cleanup-report.md` — Generated cleanup report
