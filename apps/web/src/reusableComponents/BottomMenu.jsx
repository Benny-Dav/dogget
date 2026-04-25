import { NavLink } from "react-router-dom";
import { navItems } from "./navItems";

const BottomMenu = () => {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-md h-[10vh] bg-white flex justify-around items-center px-2 border-t border-gray-100 shadow-[0_-2px_8px_rgba(0,0,0,0.04)]">
      <div className="flex justify-center items-center gap-1">
        {navItems.map((navItem) => (
          <NavLink to={navItem.to} key={navItem.label}>
            {({ isActive }) => {
              const IconComponent = navItem.icon;
              return (
                <div className="h-auto w-17 rounded-xl px-2 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer hover:bg-[#f4a52c]/20">
                  <IconComponent
                    strokeWidth={1.5}
                    className={`h-8 w-7 ${
                      isActive ? "text-[#f4a52c]" : "text-slate-500"
                    }`}
                  />
                  <p
                    className={`text-center text-sm ${
                      isActive ? "text-[#f4a52c]" : "text-gray-700"
                    }`}
                  >
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
