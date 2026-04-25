import { Search, PawPrint } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          className="w-full py-2.5 pl-9 pr-3 rounded-full bg-gray-50 border border-gray-200 focus:border-[#f4a52c] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f4a52c]/20 text-sm transition-colors"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
      </div>
    </nav>
  );
};

export default Header;
