import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { api } from "../lib/api";

// Cart items are kept locally and persisted to dogget.cart.v1.
// On login, `sync()` reconciles with the server (mock no-op until Phase 7).

/**
 * @typedef {Object} LocalCartItem
 * @property {string} productId
 * @property {string} slug
 * @property {string} title
 * @property {string} imageUrl
 * @property {string|null} sizeLabel
 * @property {string} vendorId
 * @property {string} vendorName
 * @property {boolean} vendorCodEnabled
 * @property {import("../lib/api/types.js").Money} unitPrice
 * @property {number} quantity
 * @property {number} stockCount
 */

/** @param {import("../lib/api/types.js").Product} product @returns {LocalCartItem} */
const fromProduct = (product) => ({
  productId: product.id,
  slug: product.slug,
  title: product.title,
  imageUrl: product.images[0]?.url ?? "",
  sizeLabel: product.sizeLabel,
  vendorId: product.vendor.id,
  vendorName: product.vendor.name,
  vendorCodEnabled: product.vendor.codEnabled,
  unitPrice: product.price,
  quantity: 1,
  stockCount: product.stockCount,
});

const clamp = (qty, max) => Math.max(0, Math.min(qty, max ?? Infinity));

export const useCartStore = create(
  persist(
    (set, get) => ({
      /** @type {LocalCartItem[]} */
      items: [],

      /** @param {import("../lib/api/types.js").Product} product @param {number} [qty] */
      add: (product, qty = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.productId === product.id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.productId === product.id
                ? { ...i, quantity: clamp(i.quantity + qty, product.stockCount) }
                : i
            ),
          });
          return;
        }
        set({
          items: [...items, { ...fromProduct(product), quantity: clamp(qty, product.stockCount) }],
        });
      },

      /** @param {string} productId @param {number} qty */
      setQuantity: (productId, qty) => {
        if (qty <= 0) return get().remove(productId);
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity: clamp(qty, i.stockCount) } : i
          ),
        });
      },

      /** @param {string} productId */
      remove: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      clear: () => set({ items: [] }),

      // --- selectors ---

      itemCount: () => get().items.reduce((n, i) => n + i.quantity, 0),

      /** @returns {import("../lib/api/types.js").Money} */
      subtotal: () => {
        const items = get().items;
        if (items.length === 0) return { amount: 0, currency: "GHS" };
        const currency = items[0].unitPrice.currency;
        const amount = items.reduce((n, i) => n + i.unitPrice.amount * i.quantity, 0);
        return { amount, currency };
      },

      /** Group items by vendor for the cart screen. */
      groupByVendor: () => {
        const groups = new Map();
        for (const i of get().items) {
          const g = groups.get(i.vendorId) ?? {
            vendorId: i.vendorId,
            vendorName: i.vendorName,
            vendorCodEnabled: i.vendorCodEnabled,
            items: [],
          };
          g.items.push(i);
          groups.set(i.vendorId, g);
        }
        return Array.from(groups.values());
      },

      sync: async () => {
        const synced = await api.cart.sync(get().items);
        const nextItems = synced.items.map((item) => ({
          productId: item.productId,
          slug: item.product.slug,
          title: item.product.title,
          imageUrl: item.product.images[0]?.url ?? "",
          sizeLabel: item.product.sizeLabel,
          vendorId: item.product.vendor.id,
          vendorName: item.product.vendor.name,
          vendorCodEnabled: item.product.vendor.codEnabled,
          unitPrice: item.unitPriceSnapshot,
          quantity: item.quantity,
          stockCount: item.product.stockCount,
        }));
        set({ items: nextItems });
        return synced;
      },
    }),
    {
      name: "dogget.cart.v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
