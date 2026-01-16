import { Search } from "lucide-react";

const Header = () => {

  return (
    <nav className=" py-4 px-6 flex w-full justify-between items-center shadow-gray-400 border-b-1 border-gray-100 shadow-b-lg ">
      
      

        {/* search bar */}
        <div className='flex w-full justify-center items-center'>
          <input type="text" placeholder='Search for products' className='bg-white py-3 px-12 rounded-xl w-full' />
          <span className='relative fixed right-76'><Search className='text-gray-400 h-6 w-6 font-semibold' /></span>
        </div>

    </nav>
  )
}

export default Header;