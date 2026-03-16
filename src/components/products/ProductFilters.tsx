"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
    <div className="flex justify-end mb-8">
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
