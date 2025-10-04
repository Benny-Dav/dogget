import { NavLink } from "react-router-dom";
import { Home, HeartPlus, ShoppingCart, Dog, Store } from "lucide-react";
import { motion } from "framer-motion";

const BottomMenu = () => {
  const navItems = [
    { to: "/home", icon: Home, label: "Home" },
    { to: "/wishlist", icon: HeartPlus, label: "Wishlist" },
    {to:"/shop", icon:Store, label:"Shop"},
    { to: "/cart", icon: ShoppingCart, label: "Cart" },
    { to: "/profile", icon: Dog, label: "Pawfile" }
  ];

  return (
    <menu
      className="fixed bottom-0 left-0 z-50 w-full h-[13vh] bg-white shadow-lg flex justify-around items-center gap-2 px-6 py-3 rounded-t-3xl "
      role="navigation"
      aria-label="Main navigation"
    >
      
    </menu>
  );
};

export default BottomMenu;