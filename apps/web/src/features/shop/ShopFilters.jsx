import { useEffect, useRef, useState } from "react";
import { ArrowUpDown, Check, ChevronDown, SlidersHorizontal, Star, X } from "lucide-react";
import { useBrands, useCategories } from "../../lib/api/hooks";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
];

const ratingOptions = [4, 3, 2];

const ShopFilters = ({
  selectedCategorySlug,
  onCategoryChange,
  sortBy,
  onSortChange,
  brandSlugs,
  minRating,
  inStockOnly,
  priceMin,
  priceMax,
  onApplyFilters,
}) => {
  const [sortOpen, setSortOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [brandMenuOpen, setBrandMenuOpen] = useState(false);
  const [draftBrandSlugs, setDraftBrandSlugs] = useState(brandSlugs);
  const [draftMinRating, setDraftMinRating] = useState(minRating ?? "");
  const [draftInStockOnly, setDraftInStockOnly] = useState(inStockOnly);
  const [draftPriceMin, setDraftPriceMin] = useState(priceMin);
  const [draftPriceMax, setDraftPriceMax] = useState(priceMax);
  const sortRef = useRef(null);
  const brandMenuRef = useRef(null);
  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();

  useEffect(() => {
    setDraftBrandSlugs(brandSlugs);
    setDraftMinRating(minRating ?? "");
    setDraftInStockOnly(inStockOnly);
    setDraftPriceMin(priceMin);
    setDraftPriceMax(priceMax);
  }, [brandSlugs, minRating, inStockOnly, priceMin, priceMax]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
      if (brandMenuRef.current && !brandMenuRef.current.contains(e.target)) {
        setBrandMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!drawerOpen) return undefined;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [drawerOpen]);

  const activeSort = sortOptions.find((o) => o.value === sortBy) || sortOptions[0];
  const activeAdvancedCount =
    draftBrandSlugs.length +
    (draftMinRating ? 1 : 0) +
    (draftInStockOnly ? 1 : 0) +
    (draftPriceMin ? 1 : 0) +
    (draftPriceMax ? 1 : 0);

  const toggleBrand = (slug) => {
    setDraftBrandSlugs((current) =>
      current.includes(slug) ? current.filter((value) => value !== slug) : [...current, slug]
    );
  };

  const selectedBrandNames = brands
    .filter((brand) => draftBrandSlugs.includes(brand.slug))
    .map((brand) => brand.name);

  const resetAdvanced = () => {
    setDraftBrandSlugs([]);
    setDraftMinRating("");
    setDraftInStockOnly(false);
    setDraftPriceMin("");
    setDraftPriceMax("");
  };

  const applyAdvanced = () => {
    onApplyFilters({
      nextBrandSlugs: draftBrandSlugs,
      nextMinRating: draftMinRating || null,
      nextInStockOnly: draftInStockOnly,
      nextPriceMin: draftPriceMin,
      nextPriceMax: draftPriceMax,
    });
    setDrawerOpen(false);
  };

  return (
    <>
      <div className="border-b border-gray-100 bg-white">
        <div className="flex whitespace-nowrap gap-2 overflow-x-auto scrollbar-hide px-6 py-3">
          <button
            type="button"
            onClick={() => onCategoryChange(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium flex-shrink-0 transition cursor-pointer ${
              selectedCategorySlug === null
                ? "bg-[#f4a52c] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {categories.map((cat) => {
            const active = selectedCategorySlug === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onCategoryChange(cat.slug)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium flex-shrink-0 transition cursor-pointer ${
                  active
                    ? "bg-[#f4a52c] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between px-6 pb-3">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-[#f4a52c] hover:text-[#f4a52c]"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeAdvancedCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f4a52c] px-1.5 text-[11px] font-bold text-white">
                {activeAdvancedCount}
              </span>
            )}
          </button>

          <div className="relative" ref={sortRef}>
            <button
              type="button"
              onClick={() => setSortOpen((v) => !v)}
              className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-[#f4a52c] transition"
              aria-haspopup="menu"
              aria-expanded={sortOpen}
            >
              <ArrowUpDown className="h-4 w-4" />
              <span>{activeSort.label}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  sortOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {sortOpen && (
              <div
                role="menu"
                className="absolute top-full right-0 mt-1 min-w-[180px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg z-40"
              >
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onSortChange(opt.value);
                      setSortOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition ${
                      sortBy === opt.value
                        ? "text-[#f4a52c] font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-y-0 left-1/2 z-[70] flex w-full max-w-[430px] -translate-x-1/2 items-end bg-black/35">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0"
            onClick={() => setDrawerOpen(false)}
          />

          <div className="relative max-h-[80vh] w-full overflow-y-auto rounded-t-[2rem] bg-white px-6 pb-8 pt-5 shadow-2xl">
            <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-gray-200" />

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#2f2f2f]">Refine products</h2>
                <p className="mt-1 text-sm text-gray-500">Brand, price, stock, and rating are now wired into the mock catalog.</p>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-6 pr-1 pb-2">
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500">Brands</h3>
                <div className="relative mt-3" ref={brandMenuRef}>
                  <button
                    type="button"
                    onClick={() => setBrandMenuOpen((value) => !value)}
                    className="flex w-full items-center justify-between rounded-2xl bg-gray-50 px-4 py-3 text-left text-sm text-gray-800"
                    aria-haspopup="menu"
                    aria-expanded={brandMenuOpen}
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">Choose brands</p>
                      <p className="mt-1 truncate text-xs text-gray-500">
                        {selectedBrandNames.length > 0
                          ? selectedBrandNames.join(", ")
                          : "All brands"}
                      </p>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-gray-500 transition-transform ${
                        brandMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {brandMenuOpen && (
                    <div
                      role="menu"
                      className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 max-h-64 overflow-y-auto rounded-2xl border border-gray-200 bg-white py-2 shadow-xl"
                    >
                      {brands.map((brand) => {
                        const active = draftBrandSlugs.includes(brand.slug);
                        return (
                          <button
                            key={brand.id}
                            type="button"
                            role="menuitemcheckbox"
                            aria-checked={active}
                            onClick={() => toggleBrand(brand.slug)}
                            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-gray-700 transition hover:bg-[#fff8ef]"
                          >
                            <span>{brand.name}</span>
                            {active && <Check className="h-4 w-4 text-[#f4a52c]" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500">Price range</h3>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <label className="rounded-2xl bg-gray-50 px-3 py-3">
                    <span className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Min</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      value={draftPriceMin}
                      onChange={(e) => setDraftPriceMin(e.target.value)}
                      placeholder="0.00"
                      className="mt-2 w-full bg-transparent text-base text-gray-800 outline-none placeholder:text-gray-400"
                    />
                  </label>
                  <label className="rounded-2xl bg-gray-50 px-3 py-3">
                    <span className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Max</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      value={draftPriceMax}
                      onChange={(e) => setDraftPriceMax(e.target.value)}
                      placeholder="40.00"
                      className="mt-2 w-full bg-transparent text-base text-gray-800 outline-none placeholder:text-gray-400"
                    />
                  </label>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500">Minimum rating</h3>
                <div className="mt-3 flex gap-2">
                  {ratingOptions.map((rating) => {
                    const active = Number(draftMinRating) === rating;
                    return (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setDraftMinRating(active ? "" : rating)}
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition ${
                          active
                            ? "bg-[#f4a52c] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <Star className={`h-4 w-4 ${active ? "fill-white" : "fill-[#f4a52c] text-[#f4a52c]"}`} />
                        {rating}+
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-2xl bg-gray-50 px-4 py-4">
                <label className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Only show in-stock items</p>
                    <p className="mt-1 text-xs text-gray-500">Hide products that are currently unavailable.</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={draftInStockOnly}
                    onClick={() => setDraftInStockOnly((value) => !value)}
                    className={`relative h-7 w-12 rounded-full transition ${
                      draftInStockOnly ? "bg-[#f4a52c]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                        draftInStockOnly ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </label>
              </section>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={resetAdvanced}
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-700"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={applyAdvanced}
                className="rounded-2xl bg-[#f4a52c] px-4 py-3 text-sm font-bold text-white"
              >
                Apply filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShopFilters;
