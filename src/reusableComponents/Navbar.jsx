import { Dog, PawPrint, PawPrintIcon, ShoppingCart } from "lucide-react";

const Navbar=()=>{

  return(
    <nav className=" py-4 px-6 flex justify-between items-center">
      {/* mobile menu button */}
      <div className="w-12 h-12 shadow-gray-300 shadow-lg rounded-full flex justify-center items-center">
      <PawPrint className="text-[#f4a52c] font-extrabold h-8 w-8"/>
      </div>

      {/* logo */}
      <p className="logo text-center mr-12">dogget</p>

      {/* header buttons */}
      <div className=" flex justify-between items-center ">

        {/* cart button */}
        {/* <ShoppingCart className="hidden text-[#f4a52c] font-extrabold h-8 w-8"/> */}
        {/* profile button */}
        {/* <Dog className="hidden text-[#f4a52c] font-extrabold h-8 w-8"/> */}

        
      </div>
    </nav>
  )
}

export default Navbar;