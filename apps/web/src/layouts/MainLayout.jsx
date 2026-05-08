import { Outlet, useLocation } from "react-router-dom";
import BottomMenu from "../reusableComponents/BottomMenu";
import Header from "../reusableComponents/Header";

const MainLayout = () => {
    const { pathname } = useLocation();
    const showBottomMenu =
        pathname === "/home" ||
        pathname === "/shop" ||
        pathname.startsWith("/products/") ||
        pathname === "/cart" ||
        pathname === "/wishlist" ||
        pathname.startsWith("/checkout/") ||
        pathname === "/orders" ||
        pathname.startsWith("/orders/") ||
        pathname.startsWith("/vendors/");

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="flex flex-col max-w-md mx-auto bg-white min-h-screen">
               <Header/>
               <Outlet />
            </div>

            {showBottomMenu && <BottomMenu />}
        </main>
    );
}

export default MainLayout;
