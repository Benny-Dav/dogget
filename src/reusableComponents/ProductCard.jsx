
import { ShoppingBasket, ShoppingCart } from 'lucide-react'
import React from 'react'

const ProductCard = ({image, title, brief, price, quantity,onAddToCart, discount}) => {
  return (
    // <div className='flex flex-col justify-between items-center '>
    //     <div className='w-full bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 p-3 md:p-4 flex flex-col gap-2'>
    //         <img src={image} alt="" className='h-24 w-24 md:h-32 md:w-32 mx-auto object-contain'/>
    //         <p className='text-sm md:text-base font-bold text-center line-clamp-2'>{title}</p>

    //         <div className='flex justify-between items-center mb-2'>
    //             <p className="text-base md:text-lg text-[#fa7a3d] font-extrabold">{price}</p>
    //             <p className="text-xs md:text-sm text-gray-600 bg-gray-200 rounded-full px-2 py-0.5">{quantity}</p>
    //         </div>

    //         <button className='bg-[#f4a52c] hover:bg-[#fa7a3d] cursor-pointer w-full flex justify-center items-center gap-2 rounded-md py-2 text-white text-sm md:text-base font-semibold transition-colors'>
    //             Add to Cart
    //             <ShoppingCart strokeWidth={3} color="#fff" size={16} />
    //         </button>
    //     </div>
    // </div>

    <main className='h-auto w-auto rounded-2xl shadow-lg flex flex-col'>
      {/* productimage */}
      <div className='h-full'>
        <img src={image} alt="" className=' object-cover object-center h-full w-full rounded-t-2xl py-2'/>

      </div>

      {/* text area */}
      <div className='bg-white rounded-t-2xl flex flex-col justify-between items-center px-6 py-2 rounded-b-2xl gap-3'>
        <h4 className='text-base font-bold text-gray-800 line-clamp-2'>{title}</h4>
        <span className=''>
        <p className='text-sm text-gray-600 line-clamp-3'>{brief} <span className='ml-2 inline-flex border border-gray-400 rounded-xl w-12 h-6 px-1 flex justify-center items-center'>{quantity}</span></p>
       
        </span>
        

{/* price and add to cart */}
        <div className='w-full flex justify-between items-center pt-2'>
          <div className='flex justify-center items-center '>
            <p className='font-extrabold text-[#f4a52c] text-lg '>{price}</p>
          </div>
          <div className='flex justify-center items-center'>
            <button className='cursor-pointer px-2 md:px-4 py-1 md:py-2 bg-[#f4a52c] text-white text-base font-semibold md:font-bold rounded-4xl '><ShoppingBasket/></button>
          </div>
        </div>

      </div>
    </main>

  )
}

export default ProductCard