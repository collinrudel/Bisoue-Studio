"use client";

import Link from "next/link";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.getItemCount());

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-serif text-2xl font-semibold tracking-wide">
            Bisoue Studio
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-sm font-medium hover:text-accent-dark transition-colors">Shop All</Link>
            <Link href="/products?category=tops" className="text-sm font-medium hover:text-accent-dark transition-colors">Tops</Link>
            <Link href="/products?category=bottoms" className="text-sm font-medium hover:text-accent-dark transition-colors">Bottoms</Link>
            <Link href="/products?category=dresses" className="text-sm font-medium hover:text-accent-dark transition-colors">Dresses</Link>
            <Link href="/products?category=outerwear" className="text-sm font-medium hover:text-accent-dark transition-colors">Outerwear</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/wishlist" className="relative p-2 hover:text-accent-dark transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">{wishlistCount}</span>
              )}
            </Link>
            <Link href="/cart" className="relative p-2 hover:text-accent-dark transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              {mounted && cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>
              )}
            </Link>
            <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-border pt-4 space-y-3">
            <Link href="/products" className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>Shop All</Link>
            <Link href="/products?category=tops" className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>Tops</Link>
            <Link href="/products?category=bottoms" className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>Bottoms</Link>
            <Link href="/products?category=dresses" className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>Dresses</Link>
            <Link href="/products?category=outerwear" className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>Outerwear</Link>
            <Link href="/products?category=accessories" className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>Accessories</Link>
          </div>
        )}
      </nav>
    </header>
  );
}
