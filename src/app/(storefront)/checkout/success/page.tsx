"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCartStore } from "@/stores/cart-store";

export default function CheckoutSuccessPage() {
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-green-600 mx-auto">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>
      <h1 className="text-3xl font-serif mb-4">Thank You!</h1>
      <p className="text-text-muted mb-2">Your order has been placed successfully.</p>
      <p className="text-text-muted mb-8 text-sm">
        You will receive a confirmation email with your order details.
      </p>
      <Link
        href="/products"
        className="inline-block bg-foreground text-background px-8 py-3 text-sm font-medium hover:bg-foreground/90 transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
