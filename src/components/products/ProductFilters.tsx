"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/types";

export default function ProductFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "";

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => updateParams("category", "")}
          className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
            !currentCategory
              ? "bg-foreground text-background"
              : "bg-muted text-foreground hover:bg-border"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => updateParams("category", cat.slug)}
            className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
              currentCategory === cat.slug
                ? "bg-foreground text-background"
                : "bg-muted text-foreground hover:bg-border"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
      <select
        value={currentSort}
        onChange={(e) => updateParams("sort", e.target.value)}
        className="px-4 py-2 rounded-sm text-sm border border-border bg-background focus:outline-none focus:ring-1 focus:ring-accent"
      >
        <option value="">Newest</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>
  );
}
