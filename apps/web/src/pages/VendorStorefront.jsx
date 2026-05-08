import { useMemo, useState } from "react";
import { ShieldCheck, Star } from "lucide-react";
import { useParams } from "react-router-dom";
import ProductCard from "../reusableComponents/ProductCard";
import { useCartStore } from "../stores/cartStore";
import { useWishlistStore } from "../stores/wishlistStore";
import { useUIStore } from "../stores/uiStore";
import { useVendor, useVendorProducts } from "../lib/api/hooks";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low" },
  { value: "price-desc", label: "Price: high" },
  { value: "name-asc", label: "Name" },
  { value: "rating", label: "Rating" },
];

const sortProducts = (products, sortBy) => {
  const next = [...products];
  if (sortBy === "price-asc") return next.sort((a, b) => a.price.amount - b.price.amount);
  if (sortBy === "price-desc") return next.sort((a, b) => b.price.amount - a.price.amount);
  if (sortBy === "name-asc") return next.sort((a, b) => a.title.localeCompare(b.title));
  if (sortBy === "rating") return next.sort((a, b) => b.averageRating - a.averageRating);
  return next.sort((a, b) => Number(b.featured) - Number(a.featured));
};

const VendorStorefrontPage = () => {
  const { slug } = useParams();
  const { data: vendor, isLoading, isError } = useVendor(slug);
  const { data: products = [], isLoading: productsLoading } = useVendorProducts(slug);
  const addToCart = useCartStore((s) => s.add);
  const wishlistIds = useWishlistStore((s) => s.productIds);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const toast = useUIStore((s) => s.toast);
  const [categorySlug, setCategorySlug] = useState("ALL");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");

  const categories = useMemo(() => {
    const map = new Map();
    products.forEach((product) => {
      map.set(product.category.slug, product.category);
    });
    return Array.from(map.values());
  }, [products]);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      if (categorySlug !== "ALL" && product.category.slug !== categorySlug) return false;
      if (inStockOnly && !product.inStock) return false;
      return true;
    });
    return sortProducts(filtered, sortBy);
  }, [categorySlug, inStockOnly, products, sortBy]);

  if (isLoading) {
    return <div className="px-6 py-12 pb-28 text-center text-sm text-gray-500">Loading storefront...</div>;
  }

  if (isError || !vendor) {
    return <div className="px-6 py-12 pb-28 text-center text-sm text-gray-500">Vendor storefront not found.</div>;
  }

  return (
    <div className="bg-[#fcfcfb] px-5 py-5 pb-28">
      <section className="overflow-hidden rounded-[2rem] bg-[#2f2f2f] text-white shadow-sm">
        <div className="h-24 bg-[#f4a52c]" />
        <div className="p-5">
          <div className="-mt-14 flex h-20 w-20 items-center justify-center rounded-3xl border-4 border-[#2f2f2f] bg-white text-2xl font-black text-[#f4a52c]">
            {vendor.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="mt-4">
            <h1 className="text-2xl font-bold">{vendor.name}</h1>
            <p className="mt-2 text-sm leading-6 text-white/70">{vendor.description}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
            {vendor.verified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-100">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified seller
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-white/80">
              <Star className="h-3.5 w-3.5 fill-current" />
              {vendor.averageRating} · {vendor.reviewCount} reviews
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-white/80">{vendor.region}</span>
          </div>
          <div className="mt-5 rounded-2xl bg-white/8 p-4 text-xs leading-5 text-white/70">
            Purchases, checkout, and customer support stay inside Dogget for buyer protection.
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[1.75rem] bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#2f2f2f]">Browse products</h2>
            <p className="mt-1 text-xs text-gray-500">{filteredProducts.length} of {products.length} item(s)</p>
          </div>
          <label className="flex items-center gap-2 rounded-full bg-[#fff5e6] px-3 py-2 text-xs font-bold text-[#8a5a08]">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(event) => setInStockOnly(event.target.checked)}
              className="h-4 w-4 rounded border-[#f4a52c] text-[#f4a52c] focus:ring-[#f4a52c]"
            />
            In stock
          </label>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setCategorySlug("ALL")}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${
              categorySlug === "ALL" ? "bg-[#f4a52c] text-white" : "bg-gray-100 text-gray-500"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setCategorySlug(category.slug)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${
                categorySlug === category.slug ? "bg-[#f4a52c] text-white" : "bg-gray-100 text-gray-500"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <label className="mt-4 block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-400">Sort</span>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-[#f4a52c]"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="mt-6">
        {productsLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="aspect-[3/4] animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                wishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={() => toggleWishlist(product.id)}
                onAddToCart={() => {
                  addToCart(product);
                  toast(`${product.title} added to cart`, "success");
                }}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.75rem] bg-white p-8 text-center shadow-sm ring-1 ring-gray-100">
            <p className="font-bold text-[#2f2f2f]">No products match these filters</p>
            <button
              type="button"
              onClick={() => {
                setCategorySlug("ALL");
                setInStockOnly(false);
                setSortBy("featured");
              }}
              className="mt-3 text-sm font-bold text-[#f4a52c]"
            >
              Reset storefront filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default VendorStorefrontPage;
