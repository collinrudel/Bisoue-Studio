import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import ProductGrid from "@/components/products/ProductGrid";
import ProductFilters from "@/components/products/ProductFilters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All | Bisoue Studio",
  description: "Browse our full collection of curated clothing.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; search?: string }>;
}) {
  const params = await searchParams;
  const categories = await db.query.categories.findMany({
    orderBy: (categories, { asc }) => [asc(categories.sortOrder)],
  });

  let allProducts = await db.query.products.findMany({
    where: eq(products.isActive, true),
    with: { category: true, images: true, variants: true },
  });

  // Filter by category
  if (params.category) {
    allProducts = allProducts.filter(
      (p) => p.category?.slug === params.category
    );
  }

  // Search
  if (params.search) {
    const q = params.search.toLowerCase();
    allProducts = allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  // Sort
  switch (params.sort) {
    case "price-asc":
      allProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      allProducts.sort((a, b) => b.price - a.price);
      break;
    default:
      allProducts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  const activeCategory = categories.find((c) => c.slug === params.category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif mb-2">
          {activeCategory ? activeCategory.name : "All Products"}
        </h1>
        <p className="text-text-muted">
          {activeCategory?.description || `${allProducts.length} products`}
        </p>
      </div>

      <ProductFilters categories={categories} />
      <ProductGrid products={allProducts} />
    </div>
  );
}
