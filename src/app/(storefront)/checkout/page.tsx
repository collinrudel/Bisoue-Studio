"use client";

import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { items, getTotal } = useCartStore();

  useEffect(() => setMounted(true), []);

  async function handleCheckout() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            size: i.size,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  if (!mounted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-text-muted">Loading...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-serif mb-4">Nothing to Checkout</h1>
        <Link href="/products" className="text-accent-dark hover:text-accent">Continue shopping</Link>
      </div>
    );
  }

  const total = getTotal();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl font-serif mb-8">Checkout</h1>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-sm text-sm mb-6">
          {error}
        </div>
      )}

      <div className="space-y-3 mb-8">
        {items.map((item) => (
          <div key={`${item.productId}-${item.size}`} className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-14 bg-muted rounded-sm overflow-hidden">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-text-muted">Size: {item.size} &middot; Qty: {item.quantity}</p>
              </div>
            </div>
            <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-4 mb-8">
        <div className="flex justify-between text-lg font-medium">
          <span>Total</span>
          <span className="font-serif font-semibold">{formatPrice(total)}</span>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-foreground text-background py-4 text-sm font-medium tracking-wide hover:bg-foreground/90 transition-colors disabled:opacity-50"
      >
        {loading ? "Redirecting to Stripe..." : `Pay ${formatPrice(total)}`}
      </button>

      <p className="text-xs text-text-muted text-center mt-4">
        You will be redirected to Stripe for secure payment processing.
      </p>
    </div>
  );
}
