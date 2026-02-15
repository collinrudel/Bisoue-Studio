import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import bcrypt from "bcryptjs";
import path from "path";

const dbPath = path.join(process.cwd(), "sqlite.db");
const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
const db = drizzle(sqlite, { schema });

async function seed() {
  console.log("Seeding database...");

  // Create admin user
  const passwordHash = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "changeme123",
    12
  );
  db.insert(schema.adminUsers)
    .values({
      email: process.env.ADMIN_EMAIL || "admin@bisouestudio.com",
      passwordHash,
      name: "Admin",
    })
    .onConflictDoNothing()
    .run();
  console.log("Admin user created");

  // Create categories
  const categoryData = [
    { name: "Tops", slug: "tops", description: "Blouses, shirts, and tops", sortOrder: 1 },
    { name: "Bottoms", slug: "bottoms", description: "Pants, skirts, and shorts", sortOrder: 2 },
    { name: "Dresses", slug: "dresses", description: "Dresses and jumpsuits", sortOrder: 3 },
    { name: "Outerwear", slug: "outerwear", description: "Jackets, coats, and blazers", sortOrder: 4 },
    { name: "Accessories", slug: "accessories", description: "Bags, scarves, and jewelry", sortOrder: 5 },
  ];

  for (const cat of categoryData) {
    db.insert(schema.categories).values(cat).onConflictDoNothing().run();
  }
  console.log("Categories created");

  // Create sample products
  const productData = [
    {
      name: "Silk Camisole",
      slug: "silk-camisole",
      description: "A luxurious silk camisole with delicate lace trim. Perfect for layering or wearing on its own for an elegant evening look.",
      price: 89.0,
      compareAtPrice: 120.0,
      categoryId: 1,
      isActive: true,
      isFeatured: true,
    },
    {
      name: "Linen Wide-Leg Trousers",
      slug: "linen-wide-leg-trousers",
      description: "Breezy linen trousers with a wide-leg silhouette. Features a high waist and side pockets for effortless style.",
      price: 145.0,
      categoryId: 2,
      isActive: true,
      isFeatured: true,
    },
    {
      name: "Wrap Midi Dress",
      slug: "wrap-midi-dress",
      description: "A flattering wrap dress in a beautiful midi length. The perfect desk-to-dinner piece that transitions seamlessly.",
      price: 195.0,
      categoryId: 3,
      isActive: true,
      isFeatured: true,
    },
    {
      name: "Oversized Wool Blazer",
      slug: "oversized-wool-blazer",
      description: "A timeless oversized blazer crafted from premium wool blend. Features structured shoulders and a relaxed fit.",
      price: 285.0,
      compareAtPrice: 340.0,
      categoryId: 4,
      isActive: true,
      isFeatured: true,
    },
    {
      name: "Cashmere Scarf",
      slug: "cashmere-scarf",
      description: "Ultra-soft cashmere scarf in a generous size. Adds warmth and sophistication to any outfit.",
      price: 125.0,
      categoryId: 5,
      isActive: true,
      isFeatured: false,
    },
    {
      name: "Ribbed Knit Top",
      slug: "ribbed-knit-top",
      description: "A fitted ribbed knit top with a modern square neckline. A wardrobe essential that pairs with everything.",
      price: 65.0,
      categoryId: 1,
      isActive: true,
      isFeatured: false,
    },
    {
      name: "Tailored Pencil Skirt",
      slug: "tailored-pencil-skirt",
      description: "A classic pencil skirt with modern tailoring. Features a back slit and hidden zipper closure.",
      price: 110.0,
      categoryId: 2,
      isActive: true,
      isFeatured: false,
    },
    {
      name: "Satin Slip Dress",
      slug: "satin-slip-dress",
      description: "An elegant satin slip dress with adjustable straps. Minimalist design that lets the fabric speak for itself.",
      price: 165.0,
      categoryId: 3,
      isActive: true,
      isFeatured: true,
    },
  ];

  for (const prod of productData) {
    db.insert(schema.products).values(prod).onConflictDoNothing().run();
  }
  console.log("Products created");

  // Create product images (placeholder paths)
  const imageData = [
    { productId: 1, url: "/placeholder.svg", altText: "Silk Camisole", sortOrder: 0, isPrimary: true },
    { productId: 2, url: "/placeholder.svg", altText: "Linen Wide-Leg Trousers", sortOrder: 0, isPrimary: true },
    { productId: 3, url: "/placeholder.svg", altText: "Wrap Midi Dress", sortOrder: 0, isPrimary: true },
    { productId: 4, url: "/placeholder.svg", altText: "Oversized Wool Blazer", sortOrder: 0, isPrimary: true },
    { productId: 5, url: "/placeholder.svg", altText: "Cashmere Scarf", sortOrder: 0, isPrimary: true },
    { productId: 6, url: "/placeholder.svg", altText: "Ribbed Knit Top", sortOrder: 0, isPrimary: true },
    { productId: 7, url: "/placeholder.svg", altText: "Tailored Pencil Skirt", sortOrder: 0, isPrimary: true },
    { productId: 8, url: "/placeholder.svg", altText: "Satin Slip Dress", sortOrder: 0, isPrimary: true },
  ];

  for (const img of imageData) {
    db.insert(schema.productImages).values(img).onConflictDoNothing().run();
  }
  console.log("Product images created");

  // Create product variants (sizes with stock)
  const sizes = ["XS", "S", "M", "L", "XL"];
  for (let productId = 1; productId <= 8; productId++) {
    const productSizes = productId === 5 ? ["One Size"] : sizes;
    for (const size of productSizes) {
      db.insert(schema.productVariants)
        .values({
          productId,
          size,
          stock: Math.floor(Math.random() * 15) + 2,
          sku: `BST-${String(productId).padStart(3, "0")}-${size}`,
        })
        .onConflictDoNothing()
        .run();
    }
  }
  console.log("Product variants created");

  console.log("Seed complete!");
  sqlite.close();
}

seed().catch(console.error);
