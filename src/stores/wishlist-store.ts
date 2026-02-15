import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WishlistItem } from "@/types";

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  getItemCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          if (state.items.some((i) => i.productId === item.productId)) {
            return state;
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      isInWishlist: (productId) =>
        get().items.some((i) => i.productId === productId),
      getItemCount: () => get().items.length,
    }),
    { name: "bisoue-wishlist" }
  )
);
