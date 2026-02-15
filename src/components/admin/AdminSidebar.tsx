"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/products/new", label: "Add Product" },
  { href: "/admin/categories", label: "Categories" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  return (
    <aside className="w-64 bg-foreground text-background min-h-screen p-6 flex flex-col">
      <Link href="/admin" className="font-serif text-xl mb-8 block">
        Bisoue Admin
      </Link>
      <nav className="flex flex-col gap-1 flex-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "px-4 py-2.5 rounded-sm text-sm transition-colors",
              pathname === link.href
                ? "bg-background/20 text-background"
                : "text-background/60 hover:text-background hover:bg-background/10"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-background/20 pt-4 mt-4 space-y-2">
        <Link
          href="/"
          className="block px-4 py-2 text-sm text-background/60 hover:text-background transition-colors"
        >
          View Store
        </Link>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-sm text-background/60 hover:text-background transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
