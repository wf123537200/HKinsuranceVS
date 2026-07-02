import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id as string },
  });

  if (user?.role !== "ADMIN") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600">You do not have admin access.</p>
      </div>
    );
  }

  const [companyCount, productCount, comparisonCount, discussionCount, userCount, verificationCount] =
    await Promise.all([
      prisma.company.count(),
      prisma.product.count(),
      prisma.comparison.count(),
      prisma.discussion.count(),
      prisma.user.count(),
      prisma.professionalVerification.count({ where: { status: "PENDING" } }),
    ]);

  const stats = [
    { label: "Companies", value: companyCount, href: "/companies" },
    { label: "Products", value: productCount, href: "/products" },
    { label: "Comparisons", value: comparisonCount, href: "/compare" },
    { label: "Discussions", value: discussionCount, href: "/discussions" },
    { label: "Users", value: userCount },
    { label: "Pending Verifications", value: verificationCount },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/companies" className="p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
          <h2 className="font-semibold text-gray-900 mb-1">Manage Companies</h2>
          <p className="text-sm text-gray-500">View and edit company information.</p>
        </Link>
        <Link href="/products" className="p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
          <h2 className="font-semibold text-gray-900 mb-1">Manage Products</h2>
          <p className="text-sm text-gray-500">View and edit product details.</p>
        </Link>
        <Link href="/compare" className="p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
          <h2 className="font-semibold text-gray-900 mb-1">Manage Comparisons</h2>
          <p className="text-sm text-gray-500">View and manage product comparisons.</p>
        </Link>
      </div>
    </div>
  );
}
