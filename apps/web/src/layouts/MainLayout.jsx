import { Outlet } from "react-router-dom";
import BottomMenu from "../reusableComponents/BottomMenu";
import Header from "../reusableComponents/Header";

const MainLayout = () => {
    return (
        <main className="min-h-screen bg-gray-50">
            <div className="flex flex-col max-w-md mx-auto bg-white min-h-screen">
               <Header/>
               <Outlet />
            </div>

            <BottomMenu />
        </main>
    );
}

export default MainLayout;
