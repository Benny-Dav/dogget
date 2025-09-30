import { NavLink } from "react-router-dom";
import { Home, HeartPlus, ShoppingCart, Dog } from "lucide-react";
import { motion } from "framer-motion";

const BottomMenu = () => {
  const navItems = [
    { to: "/home", icon: Home, label: "Home" },
    { to: "/favorites", icon: HeartPlus, label: "Wishlist" },
    { to: "/cart", icon: ShoppingCart, label: "Cart" },
    { to: "/pets", icon: Dog, label: "Pawfile" },
  ];

  return (
    <menu
      className="fixed bottom-0 left-0 z-50 w-full h-[10vh] bg-white shadow-lg flex justify-around items-center px-6 py-3 rounded-t-3xl "
      role="navigation"
      aria-label="Main navigation"
    >
      {navItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center p-2 rounded-full transition-all duration-300 ${
              isActive ? "bg-amber-200/50" : "hover:bg-amber-100"
            }`
          }
          aria-label={item.label}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-12 h-12 rounded-full"
          >
            <item.icon
              className="text-amber-600 w-8 h-8"
              strokeWidth={2}
              aria-hidden="true"
            />
          </motion.div>
          <span className="text-xs font-medium text-amber-800 mt-1">
            {item.label}
          </span>
        </NavLink>
      ))}
    </menu>
  );
};

export default BottomMenu;