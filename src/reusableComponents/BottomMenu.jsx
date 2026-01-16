import { NavLink } from "react-router-dom";
import { Home, HeartPlus, ShoppingCart, Dog, Store } from "lucide-react";

const BottomMenu = () => {
  const navItems = [
    { to: "/home", icon: Home, label: "Home" },
    { to: "/wishlist", icon: HeartPlus, label: "Wishlist" },
    { to: "/shop", icon: Store, label: "Shop" },
    { to: "/cart", icon: ShoppingCart, label: "Cart" },
    { to: "/profile", icon: Dog, label: "Pawfile" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full h-[10vh] bg-white shadow-lg flex justify-around items-center px-2 shadow-gray-400 border-t-1 border-gray-100 shadow-t-lg">
      <div className="flex justify-center items-center gap-1">
        {navItems.map((navItem) => (
          <NavLink to={navItem.to} key={navItem.label}>
            {
            ({ isActive }) => {
              const IconComponent = navItem.icon;
              return (
                <div
                  className="h-auto w-17 rounded-xl px-2 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer hover:bg-[#f4a52c]/20"
                >
                  <IconComponent strokeWidth={1.5}
                    className={` h-8 w-7 ${
                      isActive ? "text-[#f4a52c]" : "text-slate-500"
                    }`}
                  />
                  <p className={`text-center text-sm ${isActive? "text-[#f4a52c]": "text-gray-700 "}`}>
                    {navItem.label}
                  </p>
                </div>
              );
            }}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomMenu;
