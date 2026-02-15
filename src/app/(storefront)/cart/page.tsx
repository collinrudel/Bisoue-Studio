"use client";

import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-3xl font-serif mb-8">Your Cart</h1>
        <p className="text-text-muted">Loading...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-serif mb-4">Your Cart is Empty</h1>
        <p className="text-text-muted mb-8">Add some items to get started.</p>
        <Link
          href="/products"
          className="inline-block bg-foreground text-background px-8 py-3 text-sm font-medium hover:bg-foreground/90 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const total = getTotal();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl font-serif mb-8">Your Cart</h1>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.size}`}
            className="flex gap-4 p-4 border border-border rounded-sm"
          >
            <Link href={`/products/${item.slug}`} className="relative w-20 h-24 bg-muted rounded-sm overflow-hidden shrink-0">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link href={`/products/${item.slug}`}>
                    <h3 className="font-medium text-sm">{item.name}</h3>
                  </Link>
                  <p className="text-xs text-text-muted mt-0.5">Size: {item.size}</p>
                </div>
                <p className="text-sm font-medium shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center border border-border rounded-sm">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.size, item.quantity - 1)
                    }
                    className="px-3 py-1 text-sm hover:bg-muted transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-sm border-x border-border">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.size, item.quantity + 1)
                    }
                    className="px-3 py-1 text-sm hover:bg-muted transition-colors"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.productId, item.size)}
                  className="text-xs text-text-muted hover:text-red-500 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-6">
        <div className="flex items-center justify-between mb-6">
          <span className="text-lg font-medium">Total</span>
          <span className="text-xl font-serif font-semibold">{formatPrice(total)}</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/checkout"
            className="flex-1 bg-foreground text-background text-center py-3.5 text-sm font-medium tracking-wide hover:bg-foreground/90 transition-colors"
          >
            Proceed to Checkout
          </Link>
          <Link
            href="/products"
            className="flex-1 border border-border text-center py-3.5 text-sm font-medium hover:bg-muted transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
