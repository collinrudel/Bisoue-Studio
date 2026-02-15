"use client";

import { useWishlistStore } from "@/stores/wishlist-store";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-3xl font-serif mb-8">Your Wishlist</h1>
        <p className="text-text-muted">Loading...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-serif mb-4">Your Wishlist is Empty</h1>
        <p className="text-text-muted mb-8">Save items you love for later.</p>
        <Link
          href="/products"
          className="inline-block bg-foreground text-background px-8 py-3 text-sm font-medium hover:bg-foreground/90 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl font-serif mb-8">Your Wishlist</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex gap-4 p-4 border border-border rounded-sm"
          >
            <Link href={`/products/${item.slug}`} className="relative w-20 h-24 bg-muted rounded-sm overflow-hidden shrink-0">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </Link>
            <div className="flex-1">
              <Link href={`/products/${item.slug}`}>
                <h3 className="font-medium text-sm hover:text-accent-dark transition-colors">{item.name}</h3>
              </Link>
              <p className="text-sm font-medium mt-1">{formatPrice(item.price)}</p>
              <div className="flex gap-3 mt-3">
                <Link
                  href={`/products/${item.slug}`}
                  className="text-xs font-medium text-accent-dark hover:text-accent"
                >
                  Select Size & Add to Cart
                </Link>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-xs text-text-muted hover:text-red-500 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
