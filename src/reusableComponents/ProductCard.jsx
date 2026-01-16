
import { ShoppingBasket, ShoppingCart } from 'lucide-react'
import React from 'react'

const ProductCard = ({ image, title, brief, price, quantity, onAddToCart, discount }) => {
  return (


    //     <main className='h-auto w-auto rounded-2xl shadow-lg flex flex-col justify-center items-center'>
    //       {/* productimage */}
    //       <div className=''>
    //         <img src={image} alt="" className=' bg-[#fff3e1] object-cover object-center h-full w-full rounded-t-2xl py-2'/>

    //       </div>

    //       {/* text area */}
    //       <div className=' rounded-t-2xl flex flex-col justify-between items-center px-6 py-2 rounded-b-2xl gap-3'>
    //         <h4 className='text-base font-bold text-gray-800 line-clamp-2'>{title}</h4>
    //         <span className=''>
    //         <p className='text-sm text-gray-600 line-clamp-3'>{brief} <span className='ml-2 inline-flex border border-gray-400 rounded-xl w-12 h-6 px-1 flex justify-center items-center'>{quantity}</span></p>

    //         </span>


    // {/* price and add to cart */}
    //         <div className='w-full flex justify-between items-center pt-2'>
    //           <div className='flex justify-center items-center '>
    //             <p className='font-extrabold text-[#f4a52c] text-lg '>{price}</p>
    //           </div>
    //           <div className='flex justify-center items-center'>
    //             <button className='cursor-pointer px-2 md:px-4 py-1 md:py-2 bg-[#f4a52c] text-white text-base font-semibold md:font-bold rounded-4xl '><ShoppingBasket/></button>
    //           </div>
    //         </div>

    //       </div>
    //     </main>

    <div className='card card-xs shadow-sm h-[300px] flex flex-col w-full'>
      <figure className=' h-[200px] '>
        <img src={image} alt="" className=' image-full object-cover object-center h-full rounded-t-2xl py-2' />
      </figure>

      <div className='card-body'>
        <h4 className=' card-title text-black'>{title}</h4>
        <p className=' text-sm text-gray-600 line-clamp-3'>{brief} <span className='ml-2 inline-flex border border-gray-400 rounded-xl w-12 h-6 px-1 flex justify-center items-center'>{quantity}</span></p>

        <div className='card-actions gap-0'>

          <div className=' badge badge-outline'>{quantity}</div>

          <div className='flex justify-between items-center gap-2'>
          <div className='flex justify-start'><p className='font-extrabold text-[#f4a52c] text-lg '>{price}</p></div>
          <div className='flex justify-end'><button className='btn outline-none border-none shadow-none bg-[#f4a52c]'>Buy <ShoppingBasket /></button></div>
          </div>




        </div>
      </div>
    </div>
  )
}

export default ProductCard