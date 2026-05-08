import { useDeferredValue } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../reusableComponents/ProductCard";
import ShopFilters from "../features/shop/ShopFilters";
import { useProducts } from "../lib/api/hooks";

const toMinorUnits = (value) => {
  if (value == null || value === "") return undefined;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return undefined;
  return Math.round(parsed * 100);
};

const fromMinorUnits = (value) => {
  if (value == null || value === "") return "";
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return "";
  return String(parsed / 100);
};

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categorySlug = searchParams.get("category");
  const sortBy = searchParams.get("sort") ?? "featured";
  const q = searchParams.get("q")?.trim() ?? "";
  const brandSlugs = searchParams.get("brands")?.split(",").filter(Boolean) ?? [];
  const inStockOnly = searchParams.get("stock") === "1";
  const minRatingParam = searchParams.get("rating");
  const minRating = minRatingParam ? Number(minRatingParam) : undefined;
  const priceMin = toMinorUnits(searchParams.get("priceMin"));
  const priceMax = toMinorUnits(searchParams.get("priceMax"));
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const deferredQuery = useDeferredValue(q);

  const updateParams = (patch) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      if (
        value == null ||
        value === "" ||
        value === "featured" ||
        (Array.isArray(value) && value.length === 0) ||
        value === false
      ) {
        next.delete(key);
        return;
      }
      next.set(key, Array.isArray(value) ? value.join(",") : value);
    });
    setSearchParams(next);
  };

  const { data, isLoading, isError } = useProducts({
    categorySlug: categorySlug ?? undefined,
    sort: sortBy,
    q: deferredQuery || undefined,
    brandSlugs: brandSlugs.length ? brandSlugs : undefined,
    inStockOnly,
    minRating,
    priceMin,
    priceMax,
    page,
    pageSize: 6,
  });

  const products = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  const goToPage = (nextPage) => {
    updateParams({ page: nextPage > 1 ? String(nextPage) : null });
  };

  return (
    <div className="pb-[12vh]">
      <ShopFilters
        selectedCategorySlug={categorySlug}
        onCategoryChange={(value) => updateParams({ category: value, page: null })}
        sortBy={sortBy}
        onSortChange={(value) => updateParams({ sort: value, page: null })}
        brandSlugs={brandSlugs}
        minRating={minRating}
        inStockOnly={inStockOnly}
        priceMin={fromMinorUnits(searchParams.get("priceMin"))}
        priceMax={fromMinorUnits(searchParams.get("priceMax"))}
        onApplyFilters={({ nextBrandSlugs, nextMinRating, nextInStockOnly, nextPriceMin, nextPriceMax }) =>
          updateParams({
            brands: nextBrandSlugs,
            rating: nextMinRating,
            stock: nextInStockOnly ? "1" : null,
            priceMin: nextPriceMin,
            priceMax: nextPriceMax,
            page: null,
          })
        }
      />

      <section className="px-6 py-4">
        {(q ||
          categorySlug ||
          sortBy !== "featured" ||
          brandSlugs.length ||
          inStockOnly ||
          minRating ||
          priceMin != null ||
          priceMax != null) && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {q && (
              <span className="rounded-full bg-[#fff5e6] px-3 py-1 text-sm font-medium text-[#8a5a08]">
                Search: {q}
              </span>
            )}
            {categorySlug && (
              <span className="rounded-full bg-[#fff5e6] px-3 py-1 text-sm font-medium text-[#8a5a08]">
                Category: {categorySlug}
              </span>
            )}
            {sortBy !== "featured" && (
              <span className="rounded-full bg-[#fff5e6] px-3 py-1 text-sm font-medium text-[#8a5a08]">
                Sort: {sortBy}
              </span>
            )}
            {brandSlugs.map((brand) => (
              <span key={brand} className="rounded-full bg-[#fff5e6] px-3 py-1 text-sm font-medium text-[#8a5a08]">
                Brand: {brand}
              </span>
            ))}
            {inStockOnly && (
              <span className="rounded-full bg-[#fff5e6] px-3 py-1 text-sm font-medium text-[#8a5a08]">
                In stock only
              </span>
            )}
            {minRating && (
              <span className="rounded-full bg-[#fff5e6] px-3 py-1 text-sm font-medium text-[#8a5a08]">
                Rating: {minRating}+
              </span>
            )}
            {priceMin != null && (
              <span className="rounded-full bg-[#fff5e6] px-3 py-1 text-sm font-medium text-[#8a5a08]">
                Min price: {fromMinorUnits(searchParams.get("priceMin"))}
              </span>
            )}
            {priceMax != null && (
              <span className="rounded-full bg-[#fff5e6] px-3 py-1 text-sm font-medium text-[#8a5a08]">
                Max price: {fromMinorUnits(searchParams.get("priceMax"))}
              </span>
            )}
            <button
              type="button"
              onClick={() => setSearchParams(new URLSearchParams())}
              className="text-sm font-semibold text-[#f4a52c] transition hover:underline"
            >
              Reset
            </button>
          </div>
        )}

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
          <>
            <div className="grid grid-cols-2 gap-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-gray-100">
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => goToPage(page - 1)}
                    disabled={!canGoPrev}
                    className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }).map((_, index) => {
                      const pageNumber = index + 1;
                      const active = pageNumber === page;
                      return (
                        <button
                          key={pageNumber}
                          type="button"
                          onClick={() => goToPage(pageNumber)}
                          className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition ${
                            active
                              ? "bg-[#f4a52c] text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => goToPage(page + 1)}
                    disabled={!canGoNext}
                    className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
                <p className="mt-3 text-center text-xs text-gray-500">
                  Page {page} of {totalPages}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-gray-500 mb-2">
              No products found
              {q && ` for "${q}"`}
              {categorySlug && " in this category"}.
            </p>
            <button
              type="button"
              onClick={() => setSearchParams(new URLSearchParams())}
              className="text-sm text-[#f4a52c] font-semibold hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default ShopPage;
