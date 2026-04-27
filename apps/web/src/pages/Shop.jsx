import { useState } from "react";
import ProductCard from "../reusableComponents/ProductCard";
import ShopFilters from "../features/shop/ShopFilters";
import { useProducts } from "../lib/api/hooks";

const ShopPage = () => {
  const [categorySlug, setCategorySlug] = useState(null);
  const [sortBy, setSortBy] = useState("featured");

  const { data, isLoading, isError } = useProducts({
    categorySlug: categorySlug ?? undefined,
    sort: sortBy,
  });

  const products = data?.items ?? [];

  return (
    <div className="pb-[12vh]">
      <ShopFilters
        selectedCategorySlug={categorySlug}
        onCategoryChange={setCategorySlug}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <section className="px-6 py-4">
        {isError ? (
          <div className="py-12 text-center text-sm text-red-500">
            Couldn't load products. Try again.
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-2xl bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-gray-500 mb-2">
              No products found{categorySlug && ` in this category`}.
            </p>
            <button
              onClick={() => setCategorySlug(null)}
              className="text-sm text-[#f4a52c] font-semibold hover:underline"
            >
              Show all products
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default ShopPage;
