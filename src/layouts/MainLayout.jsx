
import { Outlet } from "react-router-dom";
import BottomMenu from "../reusableComponents/BottomMenu";
import Header from "../reusableComponents/Header";
const MainLayout = () => {
    return (
        <main className="h-screen">
            <div className="">
               <Header/>
               <Outlet />
            </div>

            <div className="">
                <BottomMenu />
            </div>
        </main>
    );
}

export default MainLayout;