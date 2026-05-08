// Placeholder for the real HTTP-backed implementation of the api facade.
// Will be implemented during the backend-integration phase. Until then this
// throws so a misconfigured env flag fails loudly in dev rather than silently.
//
// When ready, mirror the shape of mock.js — same method signatures and return
// types — and route each method to a fetch() call against VITE_API_BASE_URL.

const NOT_IMPLEMENTED = (name) => () => {
  throw new Error(
    `[api.real] ${name} not implemented yet. Backend integration is scheduled in Phase 7. ` +
      `Set VITE_USE_MOCK_API=true (or remove the env var) to use the mock layer.`
  );
};

export const realApi = {
  products: {
    list: NOT_IMPLEMENTED("products.list"),
    get: NOT_IMPLEMENTED("products.get"),
    byIds: NOT_IMPLEMENTED("products.byIds"),
    related: NOT_IMPLEMENTED("products.related"),
    featured: NOT_IMPLEMENTED("products.featured"),
  },
  categories: { list: NOT_IMPLEMENTED("categories.list") },
  brands: { list: NOT_IMPLEMENTED("brands.list") },
  vendors: {
    get: NOT_IMPLEMENTED("vendors.get"),
    products: NOT_IMPLEMENTED("vendors.products"),
  },
  auth: { session: NOT_IMPLEMENTED("auth.session") },
  users: {
    me: NOT_IMPLEMENTED("users.me"),
    update: NOT_IMPLEMENTED("users.update"),
  },
  cart: {
    sync: NOT_IMPLEMENTED("cart.sync"),
  },
  wishlist: {
    sync: NOT_IMPLEMENTED("wishlist.sync"),
  },
  checkout: {
    session: NOT_IMPLEMENTED("checkout.session"),
  },
};
