import { NavLink } from "react-router-dom";
import { navItems } from "./navItems";
import { useCartStore } from "../stores/cartStore";
import { useUIStore } from "../stores/uiStore";

const BottomMenu = () => {
  const toast = useUIStore((s) => s.toast);
  const items = useCartStore((s) => s.items);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-md h-[10vh] bg-white flex justify-around items-center px-2 border-t border-gray-100 shadow-[0_-2px_8px_rgba(0,0,0,0.04)]">
      <div className="flex w-full items-center justify-between gap-1">
        {navItems.map((navItem) => {
          const IconComponent = navItem.icon;
          if (navItem.disabled) {
            return (
              <button
                key={navItem.label}
                type="button"
                onClick={() => toast(`${navItem.label} arrives in ${navItem.phaseLabel}.`, "info")}
                className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl px-2 py-1 transition-all duration-200 cursor-pointer opacity-70 hover:bg-[#f4a52c]/10"
              >
                <IconComponent strokeWidth={1.5} className="h-8 w-7 text-slate-400" />
                <p className="text-center text-sm text-gray-500">{navItem.label}</p>
              </button>
            );
          }

          return (
            <NavLink
              key={navItem.label}
              to={navItem.to}
              className="flex min-w-0 flex-1"
            >
              {({ isActive }) => (
                <div className="flex w-full flex-col items-center justify-center rounded-xl px-2 py-1 transition-all duration-200 cursor-pointer hover:bg-[#f4a52c]/20">
                  <div className="relative">
                    <IconComponent
                      strokeWidth={1.5}
                      className={`h-8 w-7 ${isActive ? "text-[#f4a52c]" : "text-slate-500"}`}
                    />
                    {navItem.to === "/cart" && cartCount > 0 && (
                      <span className="absolute -right-2 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#f4a52c] px-1 text-[10px] font-bold text-white">
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </div>
                  <p className={`text-center text-sm ${isActive ? "text-[#f4a52c]" : "text-gray-700"}`}>
                    {navItem.label}
                  </p>
                </div>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomMenu;
