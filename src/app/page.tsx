export const dynamic = 'force-dynamic';

import Link from "next/link";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import ProductGrid from "@/components/products/ProductGrid";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default async function HomePage() {
  const featuredProducts = await db.query.products.findMany({
    where: eq(products.isFeatured, true),
    with: { category: true, images: true, variants: true },
    limit: 8,
  });

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-widest text-text-muted mb-4">
                New Collection
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-semibold leading-tight mb-6">
                Timeless Elegance, Modern Design
              </h1>
              <p className="text-lg text-text-muted leading-relaxed mb-8">
                Discover our collection of clothing crafted for the modern woman.
                Every piece tells a story of quality and sophistication.
              </p>
              <Link
                href="/products"
                className="inline-block bg-foreground text-background px-8 py-3.5 text-sm font-medium tracking-wide hover:bg-foreground/90 transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-serif">Featured Pieces</h2>
            <Link
              href="/products"
              className="text-sm font-medium text-text-muted hover:text-foreground transition-colors"
            >
              View All
            </Link>
          </div>
          <ProductGrid products={featuredProducts} />
        </section>

        {/* Categories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-2xl sm:text-3xl font-serif mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Tops", slug: "tops" },
              { name: "Bottoms", slug: "bottoms" },
              { name: "Dresses", slug: "dresses" },
              { name: "Outerwear", slug: "outerwear" },
            ].map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="group relative aspect-[4/3] bg-muted rounded-sm overflow-hidden flex items-center justify-center"
              >
                <span className="text-lg font-serif font-medium group-hover:text-accent-dark transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
