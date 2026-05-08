// Mock implementation of the api facade. Same shape as the future real impl.
// Adds tiny artificial latency so loading states get exercised in dev.

import { products as ALL_PRODUCTS } from "./mocks/products.js";
import { categories as ALL_CATEGORIES } from "./mocks/categories.js";
import { brands as ALL_BRANDS } from "./mocks/brands.js";
import { vendors as ALL_VENDORS } from "./mocks/vendors.js";
import { calculateCouponDiscount, findActiveCoupon } from "../../features/vendor/vendorMock.js";

const LATENCY_MS = 200;
const delay = (ms = LATENCY_MS) => new Promise((r) => setTimeout(r, ms));

const toMoney = (amount, currency = "GHS") => ({ amount, currency });
const SHIPPING_FEES = {
  STANDARD: 1200,
  EXPRESS: 2200,
};
const VAT_RATE = 0.15;

/** @param {import("./types.js").GuestCartItem[]} items */
function toCart(items) {
  const subtotalAmount = items.reduce((sum, item) => sum + item.unitPrice.amount * item.quantity, 0);
  return {
    id: null,
    items: items.map((item, index) => {
      const product = ALL_PRODUCTS.find((candidate) => candidate.id === item.productId);
      if (!product) return null;
      return {
        id: `cart_item_${index + 1}`,
        productId: item.productId,
        product,
        quantity: Math.max(1, Math.min(item.quantity, product.stockCount)),
        unitPriceSnapshot: item.unitPrice,
      };
    }).filter(Boolean),
    subtotal: toMoney(subtotalAmount, items[0]?.unitPrice.currency ?? "GHS"),
  };
}

/** @param {import("./types.js").Product} p @param {import("./types.js").ProductFilters} f */
function matches(p, f) {
  if (f.q) {
    const q = f.q.toLowerCase();
    const haystack = `${p.title} ${p.brief ?? ""} ${p.brand?.name ?? ""}`.toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  if (f.categorySlug && p.category.slug !== f.categorySlug) return false;
  if (f.brandSlugs?.length && !f.brandSlugs.includes(p.brand?.slug ?? "")) return false;
  if (f.vendorSlug && p.vendor.slug !== f.vendorSlug) return false;
  if (f.priceMin != null && p.price.amount < f.priceMin) return false;
  if (f.priceMax != null && p.price.amount > f.priceMax) return false;
  if (f.lifeStage?.length && !f.lifeStage.some((s) => p.lifeStage.includes(s))) return false;
  if (f.breedSize?.length && !f.breedSize.some((s) => p.breedSize.includes(s))) return false;
  if (f.dietaryTags?.length && !f.dietaryTags.some((t) => p.dietaryTags.includes(t)))
    return false;
  if (f.minRating != null && p.averageRating < f.minRating) return false;
  if (f.inStockOnly && !p.inStock) return false;
  return true;
}

const SORTERS = {
  featured: (a, b) => Number(b.featured) - Number(a.featured),
  "price-asc": (a, b) => a.price.amount - b.price.amount,
  "price-desc": (a, b) => b.price.amount - a.price.amount,
  "name-asc": (a, b) => a.title.localeCompare(b.title),
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  rating: (a, b) => b.averageRating - a.averageRating,
};

export const mockApi = {
  products: {
    /** @param {import("./types.js").ProductFilters} [filters] */
    async list(filters = {}) {
      await delay();
      const filtered = ALL_PRODUCTS.filter((p) => matches(p, filters));
      const sorter = SORTERS[filters.sort ?? "featured"];
      const sorted = [...filtered].sort(sorter);
      const page = filters.page ?? 1;
      const pageSize = filters.pageSize ?? 20;
      const total = sorted.length;
      const items = sorted.slice((page - 1) * pageSize, page * pageSize);
      return {
        items,
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      };
    },

    /** @param {string} slug */
    async get(slug) {
      await delay();
      const p = ALL_PRODUCTS.find((x) => x.slug === slug);
      if (!p) throw new Error(`Product not found: ${slug}`);
      return p;
    },

    /** @param {string[]} ids */
    async byIds(ids) {
      await delay();
      return ids
        .map((id) => ALL_PRODUCTS.find((product) => product.id === id))
        .filter(Boolean);
    },

    /** @param {string} slug @param {number} [limit] */
    async related(slug, limit = 4) {
      await delay();
      const p = ALL_PRODUCTS.find((x) => x.slug === slug);
      if (!p) return [];
      return ALL_PRODUCTS.filter(
        (x) => x.id !== p.id && x.category.slug === p.category.slug
      ).slice(0, limit);
    },

    async featured() {
      await delay();
      return ALL_PRODUCTS.filter((p) => p.featured);
    },
  },

  categories: {
    async list() {
      await delay();
      return ALL_CATEGORIES;
    },
  },

  brands: {
    async list() {
      await delay();
      return ALL_BRANDS;
    },
  },

  vendors: {
    /** @param {string} slug */
    async get(slug) {
      await delay();
      const v = ALL_VENDORS.find((x) => x.slug === slug);
      if (!v) throw new Error(`Vendor not found: ${slug}`);
      return v;
    },

    /** @param {string} slug */
    async products(slug) {
      await delay();
      return ALL_PRODUCTS.filter((p) => p.vendor.slug === slug);
    },
  },

  auth: {
    /**
     * Exchanges a Firebase ID token for a server session + User row.
     * Mock returns a fake CUSTOMER user. Real impl will POST /auth/session.
     * @returns {Promise<import("./types.js").User>}
     */
    async session() {
      await delay();
      return {
        id: "user_mock_1",
        firebaseUid: "mock-firebase-uid",
        email: "demo@dogget.test",
        name: "Demo User",
        phone: null,
        avatarUrl: null,
        role: "CUSTOMER",
        preferredCurrency: "GHS",
        emailVerified: true,
        createdAt: "2026-04-01T00:00:00.000Z",
        updatedAt: "2026-04-01T00:00:00.000Z",
      };
    },
  },

  users: {
    /** @returns {Promise<import("./types.js").User>} */
    async me() {
      return mockApi.auth.session("mock");
    },

    /** @param {Partial<import("./types.js").User>} patch */
    async update(patch) {
      await delay();
      const me = await mockApi.users.me();
      return { ...me, ...patch, updatedAt: new Date().toISOString() };
    },
  },

  cart: {
    /** @param {import("./types.js").GuestCartItem[]} items */
    async sync(items) {
      await delay();
      return toCart(items);
    },
  },

  wishlist: {
    /** @param {string[]} productIds */
    async sync(productIds) {
      await delay();
      return productIds.filter((productId, index, all) => {
        if (all.indexOf(productId) !== index) return false;
        return ALL_PRODUCTS.some((product) => product.id === productId);
      });
    },
  },

  checkout: {
    /**
     * @param {{
     *   items: import("./types.js").GuestCartItem[],
     *   address: import("./types.js").CheckoutAddress,
     *   shippingMethod?: import("./types.js").CheckoutShippingMethod,
     *   paymentMethod: import("./types.js").CheckoutPaymentMethod,
     *   couponCode?: string,
     * }} input
     * @returns {Promise<import("./types.js").CheckoutSession>}
     */
    async session(input) {
      await delay(350);
      if (input.paymentMethod !== "PAYSTACK") {
        throw new Error("Paystack is the only checkout payment method enabled for launch.");
      }
      const subtotalAmount = input.items.reduce(
        (sum, item) => sum + item.unitPrice.amount * item.quantity,
        0
      );
      const vendorCount = new Set(input.items.map((item) => item.vendorId)).size;
      const shippingFeePerVendor = SHIPPING_FEES[input.shippingMethod ?? "STANDARD"] ?? SHIPPING_FEES.STANDARD;
      const shippingAmount = vendorCount * shippingFeePerVendor;
      const coupon = input.couponCode ? findActiveCoupon(input.couponCode) : null;
      const discountAmount = calculateCouponDiscount(coupon, subtotalAmount);
      const taxableAmount = Math.max(0, subtotalAmount - discountAmount);
      const vatAmount = Math.round(taxableAmount * VAT_RATE);
      const totalAmount = taxableAmount + shippingAmount + vatAmount;
      const currency = input.items[0]?.unitPrice.currency ?? "GHS";

      return {
        id: `chk_${Date.now()}`,
        orderGroupId: `DOG-${String(Date.now()).slice(-6)}`,
        subtotal: toMoney(subtotalAmount, currency),
        discount: toMoney(discountAmount, currency),
        coupon: coupon
          ? {
              code: coupon.code,
              name: coupon.name,
              type: coupon.type,
              value: coupon.value,
            }
          : null,
        shipping: toMoney(shippingAmount, currency),
        vat: toMoney(vatAmount, currency),
        total: toMoney(totalAmount, currency),
        shippingMethod: input.shippingMethod ?? "STANDARD",
        paymentMethod: input.paymentMethod,
        address: input.address,
        createdAt: new Date().toISOString(),
      };
    },
  },
};
