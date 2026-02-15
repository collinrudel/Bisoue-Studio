"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import type { Product } from "@/types";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);

  const addToCart = useCartStore((s) => s.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    fetch(`/api/products?search=${slug}`)
      .then((r) => r.json())
      .then((data: Product[]) => {
        const found = data.find((p) => p.slug === slug);
        if (found) {
          setProduct(found);
          const availableVariant = found.variants?.find((v) => v.stock > 0);
          if (availableVariant) setSelectedSize(availableVariant.size);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-text-muted">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-serif mb-4">Product Not Found</h1>
        <Link href="/products" className="text-accent-dark hover:text-accent">Back to shop</Link>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [{ id: 0, productId: product.id, url: "/placeholder.svg", altText: product.name, sortOrder: 0, isPrimary: true }];
  const wishlisted = isInWishlist(product.id);
  const selectedVariant = product.variants?.find((v) => v.size === selectedSize);
  const inStock = selectedVariant ? selectedVariant.stock > 0 : false;

  function handleAddToCart() {
    if (!selectedSize || !inStock) return;
    const primaryImage = images.find((i) => i.isPrimary) || images[0];
    addToCart({
      productId: product!.id,
      slug: product!.slug,
      name: product!.name,
      price: product!.price,
      size: selectedSize,
      quantity: 1,
      image: primaryImage.url,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleWishlist() {
    if (wishlisted) {
      removeFromWishlist(product!.id);
    } else {
      const primaryImage = images.find((i) => i.isPrimary) || images[0];
      addToWishlist({
        productId: product!.id,
        slug: product!.slug,
        name: product!.name,
        price: product!.price,
        image: primaryImage.url,
      });
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <nav className="text-sm text-text-muted mb-6">
        <Link href="/products" className="hover:text-foreground">Products</Link>
        {product.category && (
          <>
            <span className="mx-2">/</span>
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-foreground">
              {product.category.name}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div>
          <div className="relative aspect-[3/4] bg-muted rounded-sm overflow-hidden mb-3">
            <Image
              src={images[selectedImage]?.url || "/placeholder.svg"}
              alt={images[selectedImage]?.altText || product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={`relative aspect-square bg-muted rounded-sm overflow-hidden ${
                    i === selectedImage ? "ring-2 ring-foreground" : ""
                  }`}
                >
                  <Image src={img.url} alt={img.altText || ""} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.category && (
            <p className="text-sm text-text-muted uppercase tracking-wider mb-2">
              {product.category.name}
            </p>
          )}
          <h1 className="text-3xl sm:text-4xl font-serif mb-4">{product.name}</h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-medium">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-lg text-text-muted line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            {product.compareAtPrice && (
              <span className="bg-accent text-white text-xs px-2 py-1 rounded-sm font-medium">
                Sale
              </span>
            )}
          </div>

          <p className="text-text-muted leading-relaxed mb-8">{product.description}</p>

          {/* Size Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Size</label>
            <div className="flex flex-wrap gap-2">
              {product.variants?.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedSize(v.size)}
                  disabled={v.stock === 0}
                  className={`px-4 py-2.5 text-sm font-medium rounded-sm border transition-colors ${
                    selectedSize === v.size
                      ? "bg-foreground text-background border-foreground"
                      : v.stock === 0
                      ? "border-border text-text-muted opacity-50 cursor-not-allowed line-through"
                      : "border-border hover:border-foreground"
                  }`}
                >
                  {v.size}
                </button>
              ))}
            </div>
            {selectedVariant && selectedVariant.stock <= 3 && selectedVariant.stock > 0 && (
              <p className="text-sm text-accent-dark mt-2">Only {selectedVariant.stock} left!</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || !inStock}
              className="flex-1 bg-foreground text-background py-3.5 text-sm font-medium tracking-wide hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {added ? "Added to Cart!" : !inStock ? "Out of Stock" : "Add to Cart"}
            </button>
            <button
              onClick={handleWishlist}
              className="px-4 border border-border hover:border-foreground transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill={wishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
