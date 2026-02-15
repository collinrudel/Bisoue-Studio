"use client";

import { useRouter } from "next/navigation";

export default function DeleteProductButton({ productId }: { productId: number }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const res = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.refresh();
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 hover:text-red-700 text-sm"
    >
      Delete
    </button>
  );
}
