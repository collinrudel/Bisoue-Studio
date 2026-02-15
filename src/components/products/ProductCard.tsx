"use client";

import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { useWishlistStore } from "@/stores/wishlist-store";
import type { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const wishlisted = isInWishlist(product.id);
  const primaryImage = product.images?.find((i) => i.isPrimary) || product.images?.[0];
  const imageUrl = primaryImage?.url || "/placeholder.svg";
  const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) ?? 0;

  return (
    <div className="group">
      <Link href={`/products/${product.slug}`} className="block relative aspect-[3/4] bg-muted rounded-sm overflow-hidden mb-3">
        <Image
          src={imageUrl}
          alt={primaryImage?.altText || product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {product.compareAtPrice && (
          <span className="absolute top-3 left-3 bg-accent text-white text-xs px-2 py-1 rounded-sm font-medium">
            Sale
          </span>
        )}
        {totalStock === 0 && (
          <span className="absolute top-3 right-3 bg-foreground text-background text-xs px-2 py-1 rounded-sm font-medium">
            Sold Out
          </span>
        )}
      </Link>
      <div className="flex items-start justify-between gap-2">
        <div>
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-sm font-medium leading-tight hover:text-accent-dark transition-colors">
              {product.name}
            </h3>
          </Link>
          {product.category && (
            <p className="text-xs text-text-muted mt-0.5">{product.category.name}</p>
          )}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-medium">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-xs text-text-muted line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => {
            if (wishlisted) {
              removeItem(product.id);
            } else {
              addItem({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: imageUrl,
              });
            }
          }}
          className="p-1.5 mt-0.5 hover:text-accent-dark transition-colors shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill={wishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
