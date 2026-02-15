"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";
import type { Product, Category } from "@/types";

interface ProductFormProps {
  product?: Product;
  categories: Category[];
}

interface ImageData {
  url: string;
  altText: string;
  isPrimary: boolean;
  sortOrder: number;
}

interface VariantData {
  size: string;
  stock: number;
  sku: string;
}

const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL"];

export default function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [compareAtPrice, setCompareAtPrice] = useState(
    product?.compareAtPrice?.toString() || ""
  );
  const [categoryId, setCategoryId] = useState(
    product?.categoryId?.toString() || ""
  );
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [images, setImages] = useState<ImageData[]>(
    product?.images?.map((img) => ({
      url: img.url,
      altText: img.altText || "",
      isPrimary: img.isPrimary,
      sortOrder: img.sortOrder,
    })) || []
  );
  const [variants, setVariants] = useState<VariantData[]>(
    product?.variants?.map((v) => ({
      size: v.size,
      stock: v.stock,
      sku: v.sku || "",
    })) || DEFAULT_SIZES.map((s) => ({ size: s, stock: 0, sku: "" }))
  );

  function updateVariant(index: number, field: keyof VariantData, value: string | number) {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  }

  function addVariant() {
    setVariants((prev) => [...prev, { size: "", stock: 0, sku: "" }]);
  }

  function removeVariant(index: number) {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const body = {
      name,
      description,
      price: parseFloat(price),
      compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
      categoryId: categoryId ? parseInt(categoryId) : null,
      isActive,
      isFeatured,
      images,
      variants: variants.filter((v) => v.size),
    };

    try {
      const url = product
        ? `/api/products/${product.id}`
        : "/api/products";
      const method = product ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-sm text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Product Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2.5 rounded-sm border border-border bg-background focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="e.g., Silk Camisole"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="w-full px-4 py-2.5 rounded-sm border border-border bg-background focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="Describe the product..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price ($)</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-sm border border-border bg-background focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Compare at Price ($)</label>
          <input
            type="number"
            step="0.01"
            value={compareAtPrice}
            onChange={(e) => setCompareAtPrice(e.target.value)}
            className="w-full px-4 py-2.5 rounded-sm border border-border bg-background focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Optional sale price"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full px-4 py-2.5 rounded-sm border border-border bg-background focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="">No category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="rounded border-border accent-accent"
          />
          <span className="text-sm">Active</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="rounded border-border accent-accent"
          />
          <span className="text-sm">Featured</span>
        </label>
      </div>

      <ImageUploader images={images} onChange={setImages} />

      <div>
        <label className="block text-sm font-medium mb-2">Sizes & Stock</label>
        <div className="space-y-2">
          {variants.map((variant, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                type="text"
                value={variant.size}
                onChange={(e) => updateVariant(i, "size", e.target.value)}
                placeholder="Size"
                className="w-24 px-3 py-2 rounded-sm border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <input
                type="number"
                value={variant.stock}
                onChange={(e) => updateVariant(i, "stock", parseInt(e.target.value) || 0)}
                placeholder="Stock"
                className="w-24 px-3 py-2 rounded-sm border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <input
                type="text"
                value={variant.sku}
                onChange={(e) => updateVariant(i, "sku", e.target.value)}
                placeholder="SKU (optional)"
                className="flex-1 px-3 py-2 rounded-sm border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <button
                type="button"
                onClick={() => removeVariant(i)}
                className="text-red-500 text-sm hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addVariant}
          className="mt-2 text-sm text-accent-dark hover:text-accent font-medium"
        >
          + Add Size
        </button>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-foreground text-background rounded-sm text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : product ? "Update Product" : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 border border-border rounded-sm text-sm font-medium hover:bg-muted transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
