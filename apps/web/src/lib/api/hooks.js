// TanStack Query hook wrappers around the api facade.
// Components should prefer these to calling api.* directly so loading/error
// states, caching, and refetching are consistent.

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./index.js";

export const queryKeys = {
  products: {
    list: (filters = {}) => ["products", "list", filters],
    detail: (slug) => ["products", "detail", slug],
    related: (slug) => ["products", "related", slug],
    featured: () => ["products", "featured"],
  },
  categories: () => ["categories"],
  brands: () => ["brands"],
  vendor: (slug) => ["vendors", slug],
  vendorProducts: (slug) => ["vendors", slug, "products"],
  me: () => ["users", "me"],
};

/** @param {import("./types.js").ProductFilters} [filters] */
export function useProducts(filters = {}) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => api.products.list(filters),
  });
}

export function useProduct(slug) {
  return useQuery({
    queryKey: queryKeys.products.detail(slug),
    queryFn: () => api.products.get(slug),
    enabled: Boolean(slug),
  });
}

export function useProductsByIds(ids = []) {
  return useQuery({
    queryKey: ["products", "byIds", ids],
    queryFn: () => api.products.byIds(ids),
    enabled: ids.length > 0,
  });
}

export function useRelatedProducts(slug, limit) {
  return useQuery({
    queryKey: queryKeys.products.related(slug),
    queryFn: () => api.products.related(slug, limit),
    enabled: Boolean(slug),
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: queryKeys.products.featured(),
    queryFn: () => api.products.featured(),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories(),
    queryFn: () => api.categories.list(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useBrands() {
  return useQuery({
    queryKey: queryKeys.brands(),
    queryFn: () => api.brands.list(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useVendor(slug) {
  return useQuery({
    queryKey: queryKeys.vendor(slug),
    queryFn: () => api.vendors.get(slug),
    enabled: Boolean(slug),
  });
}

export function useVendorProducts(slug) {
  return useQuery({
    queryKey: queryKeys.vendorProducts(slug),
    queryFn: () => api.vendors.products(slug),
    enabled: Boolean(slug),
  });
}

export function useMe() {
  return useQuery({
    queryKey: queryKeys.me(),
    queryFn: () => api.users.me(),
  });
}

export function useUpdateMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch) => api.users.update(patch),
    onSuccess: (user) => qc.setQueryData(queryKeys.me(), user),
  });
}
