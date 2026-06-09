import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-semibold mb-4">Products</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products/critical-illness" className="hover:text-white transition-colors">Critical Illness</Link></li>
              <li><Link href="/products/savings" className="hover:text-white transition-colors">Savings Insurance</Link></li>
              <li><Link href="/compare" className="hover:text-white transition-colors">Product Comparison</Link></li>
              <li><Link href="/rankings" className="hover:text-white transition-colors">Rankings</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Companies</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/companies" className="hover:text-white transition-colors">All Companies</Link></li>
              <li><Link href="/companies?region=hong-kong" className="hover:text-white transition-colors">Hong Kong</Link></li>
              <li><Link href="/companies?region=mainland-china" className="hover:text-white transition-colors">Mainland China</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/glossary" className="hover:text-white transition-colors">Glossary</Link></li>
              <li><Link href="/discussions" className="hover:text-white transition-colors">Discussions</Link></li>
              <li><Link href="/search" className="hover:text-white transition-colors">Search</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-gray-800 pt-8">
          <p className="text-xs text-gray-500 leading-relaxed">
            InsuranceAtlas does not sell insurance products and does not provide personalized insurance, financial, or investment advice. All information is provided for research and educational purposes only. Product details should be verified against official brochures, policy documents, and licensed professionals.
          </p>
          <p className="text-xs text-gray-500 leading-relaxed mt-2">
            InsuranceAtlas 不销售保险产品，也不提供个性化保险、财务或投资建议。所有内容仅用于资料研究和教育目的。具体产品保障、利益、费用和限制，请以保险公司官方产品手册、正式合同条款及合资格专业人士意见为准。
          </p>
        </div>

        <div className="mt-8 text-center text-xs text-gray-600">
          &copy; {new Date().getFullYear()} InsuranceAtlas. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
