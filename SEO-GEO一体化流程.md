# Policy Vector 整站 SEO + GEO 执行方案

## 0. 项目定位

项目名称暂定：

Policy Vector

网站定位：

跨境保险产品数据库。

覆盖：

* 香港保险公司
* 中国大陆保险公司
* 储蓄险
* 重疾险
* 年金
* 寿险

核心页面：

* 首页
* 公司页
* 产品页
* 产品比较页
* 排行榜页
* 搜索页

核心目标：

* 让用户可以查公司
* 让用户可以查产品
* 让用户可以比较产品
* 让搜索引擎可以抓取和理解
* 让 AI 搜索 / LLM 可以抽取、引用、总结

---

# 1. 总原则

## 1.1 SEO 优先，GEO 叠加

执行顺序必须是：

```text
先 SEO
再 GEO
```

不要把 GEO 当成替代 SEO 的技巧。

页面必须先满足：

* 可抓取
* 可索引
* 有唯一 title
* 有 meta description
* 有唯一 H1
* 有清晰 H2/H3
* 有 canonical
* 有 sitemap
* 有内部链接
* 有真实内容
* 不是薄页面

然后再叠加 GEO/AEO 模块。

---

## 1.2 不允许编造事实

禁止编造：

* 产品收益率
* IRR
* 回本时间
* 评级
* 用户评论
* 咨询人数
* 销量
* 保费规模
* 官方认证
* 产品排名依据

不确定的信息必须写：

```text
TODO verify
```

---

## 1.3 GEO 内容尽量低干扰

用户要求：

GEO 内容最好页面不可见。

实际执行规则：

不能做 cloaking。

也就是：

```text
给机器看的事实
用户也必须能在页面中找到
```

但可以采用低干扰形式：

* JSON-LD structured data
* meta description
* Open Graph
* FAQ 折叠区
* Sources 折叠区
* Methodology 折叠区
* 页面底部小字号更新时间
* 原生 HTML table
* aria-label
* semantic HTML
* internal links

不要在首屏堆大段 GEO 文案。

---

# 2. 整站 URL 结构

## 首页

```text
/
```

## 公司页

```text
/company/{company-slug}
```

示例：

```text
/company/prudential
/company/manulife
/company/aia
/company/pingan
/company/china-life
/company/taikang
```

## 产品页

```text
/product/{product-slug}
```

示例：

```text
/product/prudential-jun-fu
/product/manulife-global-currency
/product/pingan-shengshi-jinyue
```

## 产品比较页

```text
/compare/{product-a}-vs-{product-b}
```

示例：

```text
/compare/prudential-jun-fu-vs-manulife-global-currency
/compare/prudential-jun-fu-vs-pingan-shengshi-jinyue
```

## 排行榜页

```text
/rankings
/rankings/top-hk-savings-products
/rankings/top-mainland-whole-life-products
/rankings/most-viewed-products
/rankings/most-compared-products
```

## 搜索页

```text
/search
```

---

# 3. 页面模板要求

## 3.1 首页 SEO + GEO 模板

页面目标：

说明 Policy Vector 是什么，并引导用户搜索、查看公司、查看产品、进入比较。

SEO 要求：

Title：

```text
Policy Vector - Compare Insurance Products Across Hong Kong and Mainland China
```

Meta description：

```text
Compare insurance products from Hong Kong and Mainland China. Search companies, products, savings plans, critical illness plans, and policy features in one insurance product database.
```

H1：

```text
Compare Insurance Products Across Hong Kong and Mainland China
```

首页模块顺序：

1. Hero + 搜索框
2. Popular Companies
3. Popular Products
4. Most Compared Products
5. Rankings
6. Recently Added Products
7. FAQ
8. Sources / Methodology 折叠区

GEO Quick Answer：

```text
Policy Vector is an insurance product database for comparing products from Hong Kong and Mainland China. It helps users search insurers, review product facts, compare policy features, and explore rankings such as most viewed products, most compared products, and savings insurance categories.
```

首页必须有内链：

* /company
* /product
* /compare
* /rankings
* /search

---

## 3.2 公司页 SEO + GEO 模板

URL：

```text
/company/{slug}
```

Title 模板：

```text
{Company Name} Insurance Products, Ratings and Company Profile | Policy Vector
```

Meta description 模板：

```text
View {Company Name} insurance products, company profile, region, ratings, product categories, and popular policies on Policy Vector.
```

H1 模板：

```text
{Company Name} Insurance Products and Company Profile
```

页面模块：

1. Company overview
2. Company facts table
3. Ratings
4. Product categories
5. Products from this company
6. Popular comparisons
7. Related companies
8. FAQ
9. Sources and verification

Company facts table：

```text
Company name
Region
Country
Official website
Founded
Headquarters
S&P rating
Moody's rating
AM Best rating
Last updated
```

GEO Quick Answer 模板：

```text
{Company Name} is an insurance company listed on Policy Vector. This page summarizes its company profile, region, official website, available product categories, ratings when verified, and related insurance products for comparison.
```

结构化数据：

* Organization
* BreadcrumbList
* ItemList for products

注意：

评级必须来自官方或评级机构公开资料。

没有核实的评级必须显示：

```text
TODO verify
```

---

## 3.3 产品页 SEO + GEO 模板

URL：

```text
/product/{slug}
```

Title 模板：

```text
{Product Name} by {Company Name}: Features, Currency, Premium Term and Comparison | Policy Vector
```

Meta description 模板：

```text
Review {Product Name} by {Company Name}. See product type, region, currency, premium term, participating status, guaranteed value, projected value, break-even year, and comparable insurance products.
```

H1 模板：

```text
{Product Name} Insurance Product Review
```

页面模块：

1. Product overview
2. Product facts table
3. Key features
4. Premium and currency
5. Guaranteed / projected value
6. IRR / break-even year
7. Similar products
8. Compare this product
9. FAQ
10. Sources and verification

Product facts table：

```text
Product name
Company
Region
Product category
Currency
Premium term
Coverage term
Participating / Non-participating
Guaranteed value
Projected value
IRR
Break-even year
Source
Last updated
```

GEO Quick Answer 模板：

```text
{Product Name} is a {category} product from {Company Name}. Policy Vector summarizes its region, currency, premium term, participating status, guaranteed value, projected value, break-even year, and comparable products based on available verified product information.
```

结构化数据：

* Product
* BreadcrumbList
* FAQPage if FAQ is visible
* Dataset only if the page clearly behaves like a database record

注意：

Product schema 中不要放不可见或未核实的评分、review、aggregateRating。

---

## 3.4 Compare 页面 SEO + GEO 模板

URL：

```text
/compare/{a}-vs-{b}
```

Title 模板：

```text
{Product A} vs {Product B}: Insurance Product Comparison | Policy Vector
```

Meta description 模板：

```text
Compare {Product A} and {Product B} by company, region, product type, currency, premium term, guaranteed value, projected value, IRR, break-even year, and key policy features.
```

H1 模板：

```text
{Product A} vs {Product B}
```

页面模块：

1. Short verdict
2. Side-by-side comparison table
3. Product A overview
4. Product B overview
5. Key differences
6. Similar comparisons
7. FAQ
8. Sources and verification

Comparison table 字段：

```text
Company
Region
Product category
Currency
Premium term
Coverage term
Participating
Guaranteed value
Projected value
IRR
Break-even year
Tags
Last updated
```

GEO Quick Answer 模板：

```text
{Product A} and {Product B} can be compared by company, region, product category, currency, premium term, guaranteed value, projected value, IRR, and break-even year. Policy Vector provides a side-by-side comparison using verified product data where available.
```

选择建议区：

不要写强销售导向。

使用中性表达：

```text
May be more suitable for users comparing:
- currency options
- premium term
- guaranteed value
- projected value
- regional product differences
```

结构化数据：

* BreadcrumbList
* FAQPage if FAQ is visible
* ItemList or Product pair references

注意：

比较页必须避免薄页面。

如果两个产品数据字段过少，页面应该 noindex 或暂不生成。

---

## 3.5 排行榜页 SEO + GEO 模板

URL：

```text
/rankings/{slug}
```

Title 模板：

```text
{Ranking Name} | Policy Vector
```

Meta description 模板：

```text
Explore {Ranking Name} based on Policy Vector product data, including region, product category, currency, premium term, IRR, break-even year, and user activity metrics where available.
```

H1 模板：

```text
{Ranking Name}
```

第一版排行榜只允许使用真实可计算字段：

允许：

* Most Viewed Products
* Most Compared Products
* Recently Added Products
* Top HK Savings Products
* Top Mainland Whole Life Products
* Fastest Break-even Products
* Highest IRR Products

不允许：

* Best Products
* Most Trusted Products
* Most Recommended Products
* Highest Sales Products
* Most Consulted Products

除非有真实数据来源。

排行榜必须展示排名依据：

```text
Ranking methodology
```

示例：

```text
This ranking is based on product views recorded by Policy Vector during the selected period.
```

或者：

```text
This ranking is based on available product data. Products with missing IRR or break-even data are excluded.
```

GEO Quick Answer 模板：

```text
This ranking lists insurance products based on {ranking_method}. Policy Vector uses available product data and clearly marks missing or unverified fields to avoid unsupported claims.
```

---

# 4. 数据字段设计

## Company

```yaml
id:
name:
slug:
region:
country:
website:
founded:
headquarters:
sp_rating:
moodys_rating:
am_best_rating:
source_urls:
last_updated:
verification_status:
```

## Product

```yaml
id:
company_id:
name:
slug:
region:
category:
currency:
premium_term:
coverage_term:
participating:
guaranteed_value:
projected_value:
irr:
break_even_year:
tags:
source_urls:
last_updated:
verification_status:
```

## User Activity

```yaml
product_id:
views:
compare_count:
last_viewed_at:
```

## Ranking

```yaml
id:
name:
slug:
ranking_type:
methodology:
included_categories:
included_regions:
sort_field:
last_updated:
```

---

# 5. 内链规则

每个公司页必须链接：

* 旗下产品页
* 同地区公司页
* 热门比较页
* 相关排行榜页

每个产品页必须链接：

* 所属公司页
* 同类产品页
* 3-5 个比较页
* 相关排行榜页

每个比较页必须链接：

* 产品 A 页面
* 产品 B 页面
* 所属公司页
* 相关比较页
* 相关排行榜页

每个排行榜页必须链接：

* 榜单内产品页
* 榜单内公司页
* 相关比较页

---

# 6. Schema / Structured Data 规则

允许使用：

* Organization
* Product
* BreadcrumbList
* FAQPage
* ItemList
* Dataset

禁止：

* 不真实的 aggregateRating
* 不真实的 review
* 不真实的 offer price
* 不可见内容对应的 schema
* 未核实字段写入 schema

Schema 必须和页面可见内容一致。

GEO 可以通过 JSON-LD 增强机器理解，但不能把用户看不到的重要事实只写进 JSON-LD。

---

# 7. Sitemap 和索引规则

必须生成：

```text
/sitemap.xml
```

包含：

* 首页
* 公司页
* 产品页
* 有足够数据的比较页
* 排行榜页

以下页面默认 noindex：

* 搜索结果页
* 参数筛选页
* 数据不足的比较页
* 空公司页
* 空产品页
* 重复排序页

比较页生成规则：

只有当两个产品至少满足以下字段时才允许 index：

```text
company
region
category
currency
premium_term
at least 3 comparable fields
```

否则：

```text
noindex
```

---

# 8. GEO 低可见实现方式

用户不希望 GEO 大面积显示。

实现方式：

## 可见但低干扰

* 顶部 40-80 词 Quick Answer，可以做成小卡片
* Facts table 使用紧凑表格
* FAQ 默认折叠
* Sources 默认折叠
* Methodology 默认折叠
* Last updated 小字号显示

## 机器友好

* JSON-LD
* semantic HTML
* table
* caption
* aria-label
* descriptive headings
* canonical
* internal links

禁止：

* display:none 塞关键词
* 只给 bot 看内容
* 用户不可见但 schema 写入重要事实
* hidden text
* keyword stuffing

---

# 9. Copilot / Codex 执行 Prompt

请把下面这段直接给 Codex：

```text
@workspace

You are implementing full-site SEO + GEO/AEO for Policy Vector.

Project positioning:
Policy Vector is a cross-border insurance product database covering Hong Kong and Mainland China insurance companies and products.

Core page types:
- Home
- Company page
- Product page
- Compare page
- Rankings page
- Search page

Primary goal:
Make the site crawlable, indexable, structured, and friendly to both traditional search engines and AI answer engines.

Important rules:
1. SEO comes first, GEO/AEO second.
2. Do not invent product returns, IRR, break-even years, ratings, reviews, consultation counts, sales numbers, or official certifications.
3. Mark uncertain fields as TODO verify.
4. Do not create thin pages.
5. Do not make structured data inconsistent with visible content.
6. Do not use cloaking.
7. GEO content should be low-visual-friction:
   - compact quick answer
   - facts tables
   - collapsible FAQ
   - collapsible sources
   - collapsible methodology
   - JSON-LD
   - semantic HTML
   - internal links
8. Important facts written for machines must also be findable by users on the page.

Implement the following:

A. Global SEO
- Add unique title and meta description templates for all page types.
- Add canonical URLs.
- Add Open Graph and Twitter metadata.
- Add robots rules.
- Add sitemap.xml.
- Add clean URL structure.
- Add BreadcrumbList schema where appropriate.

B. Home page
- H1: Compare Insurance Products Across Hong Kong and Mainland China
- Add search entry.
- Add popular companies.
- Add popular products.
- Add most compared products.
- Add rankings entry.
- Add recently added products.
- Add FAQ.
- Add collapsible methodology / sources section.
- Add Organization / WebSite schema.

C. Company page
URL: /company/{slug}
Must include:
- H1
- company overview
- company facts table
- ratings
- products from this company
- related companies
- FAQ
- sources and verification
- Organization schema
- BreadcrumbList schema

D. Product page
URL: /product/{slug}
Must include:
- H1
- product overview
- product facts table
- key features
- premium and currency
- guaranteed / projected value
- IRR / break-even year if verified
- similar products
- compare links
- FAQ
- sources and verification
- Product schema only with verified visible fields
- BreadcrumbList schema

E. Compare page
URL: /compare/{product-a}-vs-{product-b}
Must include:
- H1
- short verdict
- side-by-side comparison table
- key differences
- product A overview
- product B overview
- related comparisons
- FAQ
- sources and verification
- BreadcrumbList schema
- noindex if comparable data is too thin

F. Rankings page
URL: /rankings/{slug}
Must include:
- H1
- ranking methodology
- ranking table
- product links
- company links
- related rankings
- FAQ
- sources and verification
- ItemList schema

Allowed ranking types:
- Most Viewed Products
- Most Compared Products
- Recently Added Products
- Top HK Savings Products
- Top Mainland Whole Life Products
- Fastest Break-even Products
- Highest IRR Products

Do not create:
- Best Products
- Most Trusted Products
- Most Recommended Products
- Most Consulted Products

unless the project has verified data to support those claims.

G. Internal links
Implement internal links:
- company → products
- product → company
- product → compare pages
- compare → both products
- compare → both companies
- rankings → product pages
- rankings → company pages

H. Data model
Ensure the data model supports:

Company:
id, name, slug, region, country, website, founded, headquarters, sp_rating, moodys_rating, am_best_rating, source_urls, last_updated, verification_status

Product:
id, company_id, name, slug, region, category, currency, premium_term, coverage_term, participating, guaranteed_value, projected_value, irr, break_even_year, tags, source_urls, last_updated, verification_status

UserActivity:
product_id, views, compare_count, last_viewed_at

Ranking:
id, name, slug, ranking_type, methodology, included_categories, included_regions, sort_field, last_updated

I. Indexing rules
- Index home, company pages, product pages, valid compare pages, rankings.
- Noindex search result pages.
- Noindex filter parameter pages.
- Noindex thin compare pages.
- Noindex empty product/company pages.

J. Output requirement
Before making changes, inspect the existing project structure.
Then implement file-level changes.
Return:
1. changed files
2. what was added
3. SEO/GEO modules added
4. schema added
5. noindex/canonical/sitemap changes
6. TODO verify fields
```

---

# 10. 每次页面审查输出格式

Codex 每次检查单个页面时，必须输出：

```md
# SEO + GEO Review

## 1. Page Classification

Page type:
Primary SEO intent:
Primary GEO/AEO question:
Target entity:
Target user:

## 2. SEO Issues

| Issue | Severity | Evidence | Fix |
|---|---|---|---|

## 3. GEO / AEO Readiness

| Module | Status | Fix |
|---|---|---|

## 4. Recommended Metadata

Title:
Meta description:
H1:

## 5. Recommended Content Structure

## 6. Quick Answer Draft

## 7. Entity / Fact Table

## 8. Comparison Table Draft

## 9. Internal Links

| Source | Anchor | Target | Reason |
|---|---|---|---|

## 10. Schema / Structured Data

## 11. Exact File Changes

## 12. TODO Verify
```

---

# 11. 最终验收清单

上线前检查：

* 每个页面有唯一 title
* 每个页面有唯一 H1
* meta description 不重复
* canonical 正确
* sitemap 可访问
* robots 不阻止核心页面
* 公司页可索引
* 产品页可索引
* 有效比较页可索引
* 搜索页 noindex
* 参数筛选页 noindex
* schema 与可见内容一致
* FAQ 可见或可展开
* Sources 可见或可展开
* Methodology 可见或可展开
* 不存在隐藏关键词堆砌
* 不存在编造评级、收益、IRR、评论、销量
* 所有不确定字段标记 TODO verify
