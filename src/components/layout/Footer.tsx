import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-xl mb-4">Bisoue Studio</h3>
            <p className="text-sm text-background/70 leading-relaxed">
              Curated clothing for the modern woman. Timeless pieces crafted with care and attention to detail.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-sm uppercase tracking-wider mb-4">Shop</h4>
            <div className="space-y-2">
              <Link href="/products" className="block text-sm text-background/70 hover:text-background transition-colors">All Products</Link>
              <Link href="/products?category=tops" className="block text-sm text-background/70 hover:text-background transition-colors">Tops</Link>
              <Link href="/products?category=bottoms" className="block text-sm text-background/70 hover:text-background transition-colors">Bottoms</Link>
              <Link href="/products?category=dresses" className="block text-sm text-background/70 hover:text-background transition-colors">Dresses</Link>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-sm uppercase tracking-wider mb-4">Account</h4>
            <div className="space-y-2">
              <Link href="/cart" className="block text-sm text-background/70 hover:text-background transition-colors">Cart</Link>
              <Link href="/wishlist" className="block text-sm text-background/70 hover:text-background transition-colors">Wishlist</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-background/20 mt-8 pt-8 text-center">
          <p className="text-sm text-background/50">&copy; {new Date().getFullYear()} Bisoue Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
