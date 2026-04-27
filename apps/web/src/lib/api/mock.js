// Mock implementation of the api facade. Same shape as the future real impl.
// Adds tiny artificial latency so loading states get exercised in dev.

import { products as ALL_PRODUCTS } from "./mocks/products.js";
import { categories as ALL_CATEGORIES } from "./mocks/categories.js";
import { brands as ALL_BRANDS } from "./mocks/brands.js";
import { vendors as ALL_VENDORS } from "./mocks/vendors.js";

const LATENCY_MS = 200;
const delay = (ms = LATENCY_MS) => new Promise((r) => setTimeout(r, ms));

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
     * @param {string} _idToken
     * @returns {Promise<import("./types.js").User>}
     */
    async session(_idToken) {
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
};
