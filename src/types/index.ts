export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  categoryId: number | null;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  category?: Category | null;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface ProductImage {
  id: number;
  productId: number;
  url: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: number;
  productId: number;
  size: string;
  stock: number;
  sku: string | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  createdAt: string;
}

export interface CartItem {
  productId: number;
  slug: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
}

export interface WishlistItem {
  productId: number;
  slug: string;
  name: string;
  price: number;
  image: string;
}
