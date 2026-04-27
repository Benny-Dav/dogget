import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Wishlist holds product IDs only — Product details are fetched on demand
// via api.products.get(slug) inside the wishlist screen, so the store stays small.

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      /** @type {string[]} */
      productIds: [],

      /** @param {string} productId */
      has: (productId) => get().productIds.includes(productId),

      /** @param {string} productId */
      toggle: (productId) => {
        const ids = get().productIds;
        set({
          productIds: ids.includes(productId)
            ? ids.filter((id) => id !== productId)
            : [...ids, productId],
        });
      },

      /** @param {string} productId */
      add: (productId) => {
        if (get().productIds.includes(productId)) return;
        set({ productIds: [...get().productIds, productId] });
      },

      /** @param {string} productId */
      remove: (productId) => {
        set({ productIds: get().productIds.filter((id) => id !== productId) });
      },

      clear: () => set({ productIds: [] }),

      // Stub for Phase 7 — server reconciles wishlist on login.
      sync: async () => {
        // Real impl: api.wishlist.sync(get().productIds).
      },
    }),
    {
      name: "dogget.wishlist.v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
