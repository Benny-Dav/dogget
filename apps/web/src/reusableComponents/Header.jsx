import { Search, PawPrint } from "lucide-react";
import { NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useDeferredValue, useEffect, useState } from "react";
import { useProducts } from "../lib/api/hooks";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [focused, setFocused] = useState(false);
  const deferredSearch = useDeferredValue(search.trim());
  const showSuggestions = focused && deferredSearch.length >= 2;
  const { data: suggestionsData } = useProducts({
    q: showSuggestions ? deferredSearch : undefined,
    pageSize: 5,
    sort: "featured",
  });
  const suggestions = showSuggestions ? suggestionsData?.items ?? [] : [];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (location.pathname === "/shop") {
      setSearch(searchParams.get("q") ?? "");
      return;
    }
    setSearch("");
  }, [location.pathname, searchParams]);

  const submitSearch = () => {
    const trimmed = search.trim();
    const next = location.pathname === "/shop" ? new URLSearchParams(searchParams) : new URLSearchParams();
    next.delete("page");
    if (trimmed) {
      next.set("q", trimmed);
    } else {
      next.delete("q");
    }
    setFocused(false);
    navigate(`/shop${next.toString() ? `?${next.toString()}` : ""}`);
  };

  const goToProduct = (slug) => {
    setFocused(false);
    navigate(`/products/${slug}`);
  };

  return (
    <nav
      className={`sticky top-0 z-40 py-3 px-4 flex w-full items-center gap-3 bg-white transition-shadow duration-200 ${
        scrolled ? "shadow-md" : "border-b border-gray-100"
      }`}
    >
      {/* compact logo */}
      <NavLink to="/home" className="flex items-center gap-1 shrink-0">
        <PawPrint className="text-[#f4a52c] h-6 w-6" strokeWidth={2.5} />
        <span
          className="text-[#f4a52c] text-xl leading-none"
          style={{ fontFamily: '"Caveat Brush", cursive' }}
        >
          dogget
        </span>
      </NavLink>

      {/* search */}
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            window.setTimeout(() => setFocused(false), 120);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") submitSearch();
          }}
          className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 caret-[#f4a52c] transition-colors focus:border-[#f4a52c] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f4a52c]/20"
        />
        <button
          type="button"
          onClick={submitSearch}
          aria-label="Search catalog"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#f4a52c]"
        >
          <Search className="h-4 w-4" />
        </button>

        {showSuggestions && (
          <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl">
            {suggestions.length > 0 ? (
              <>
                {suggestions.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => goToProduct(product.slug)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[#fff8ef]"
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-[#fff3e1]">
                      <img
                        src={product.images[0]?.url}
                        alt={product.images[0]?.alt ?? product.title}
                        className="h-full w-full object-contain p-1.5"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">{product.title}</p>
                      <p className="truncate text-xs text-gray-500">{product.category.name}</p>
                    </div>
                  </button>
                ))}
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={submitSearch}
                  className="w-full border-t border-gray-100 px-4 py-3 text-sm font-semibold text-[#f4a52c] transition hover:bg-[#fff8ef]"
                >
                  View all results for "{deferredSearch}"
                </button>
              </>
            ) : (
              <div className="px-4 py-4 text-sm text-gray-500">
                No matching products yet.
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
