import { useState, useRef, useEffect } from "react";
import { ChevronDown, ArrowUpDown } from "lucide-react";
import { categories } from "../../content/categories";

export const sortOptions = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
];

const ShopFilters = ({ selectedCategory, onCategoryChange, sortBy, onSortChange }) => {
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeSort =
    sortOptions.find((o) => o.value === sortBy) || sortOptions[0];

  return (
    <div className="border-b border-gray-100 bg-white">
      {/* category pills */}
      <div className="flex whitespace-nowrap gap-2 overflow-x-auto scrollbar-hide px-6 py-3">
        <button
          onClick={() => onCategoryChange(null)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium flex-shrink-0 transition ${
            selectedCategory === null
              ? "bg-[#f4a52c] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {categories.map((cat) => {
          const active = selectedCategory === cat.name;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.name)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium flex-shrink-0 transition ${
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

      {/* sort row */}
      <div className="flex justify-end items-center px-6 pb-2">
        <div className="relative" ref={sortRef}>
          <button
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
              className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-40 min-w-[180px]"
            >
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
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
  );
};

export default ShopFilters;
