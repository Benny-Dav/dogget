import { PawPrint } from "lucide-react";

const Foot = () => {
    return (
        <footer className="h-[35vh] w-full bg-white border-t-1 border-gray-300 px-6 py-4 mb-8">
            <header className="flex flex-col w-full mb-4 ">
                
                <div className="bg-white w-[50%] mx-auto rounded-xl flex justify-center items-center ">
                    <PawPrint className="text-[#f4a52c] bg-white font-extrabold h-8 w-8 mr-2" />
                    <p className="logo text-center">dogget</p>
                </div>

            </header>

            <div className="flex flex-col gap-2 justify-center items-center text-gray-400 text-sm mb-4">
                <p>Privacy Policy</p>
                <p>Shipping and Returns</p>
                <p>Data Protection</p>
                <p></p>
                
                </div>

                <p className="text-gray-400 text-center"> Dogget @2025</p>

        </footer>
    );
}

export default Foot;