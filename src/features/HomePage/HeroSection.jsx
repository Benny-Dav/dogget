
import { Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { categories } from './categories'
import ProductCard from '../../reusableComponents/ProductCard'
import { div } from 'framer-motion/client'


const recomProducts = [
  {
    id: 1,
    image: "https://res.cloudinary.com/dfb2hl46r/image/upload/v1751567835/pngwing.com_30_rc5lzt.png",
    title: "Foster Oatmeal Treats",
    brief:"Easy-to-digest grain-free carbs and prebiotics",
    quantity: "8lb",
    price: "$16.00",
  },
  {
    id: 2,
    image: "https://res.cloudinary.com/dfb2hl46r/image/upload/v1751567584/pngwing.com_27_sd9l7x.png",
    title: "Pedigree Chicken & Rice",
    brief:"Easy-to-digest grain-free carbs and prebiotics",
    quantity: "12lb",
    price: "$14.85",
  },]

const HeroSection = () => {


  return (
    <section className='h-auto py-4 px-6 flex flex-col gap-6 bg-[#F7F4ED]'>
      {/* search bar */}
      <div className='flex justify-center items-center'>
        <input type="text" placeholder='Search for products' className='bg-white py-3 px-12 rounded-xl w-full' />
        <span className='absolute left-8'><Search className='text-gray-400 h-6 w-6 font-semibold' /></span>
      </div>

      <main className='h-auto flex flex-col gap-6'>
        {/* hero ad */}
        <div className='h-50 rounded-2xl'>
          <img src="https://res.cloudinary.com/dfb2hl46r/image/upload/v1759078352/Crunchy_Coconut_Treats_ivfsff.jpg" alt="" className='object-cover object-center h-full w-full rounded-2xl' />
        </div>

        {/* cateogory buttons */}
        <h3 className='text-xl font-semibold '>Categories</h3>
        <div className=' w-full h-auto py-2 flex whitespace-nowrap gap-6 overflow-x-auto overflow-y-none scrollbar-hide'>
          
          {categories.map((category) => (
            <div>
              <div key={category.id} className='w-16 h-16 overflow-hidden object-cover cursor-pointer flex-shrink-0 flex flex-col items-center py-1' >
              <img src={category.image} alt="" className='rounded-full object-cover w-full h-full' />
              
            </div>
            <p className='text-base text-black text-center'>{category.name}</p>
            </div>
            
          ))}
        </div>

        {/*recommended for you  */}
        <div className=''>
          <h3 className='text-xl font-semibold mb-4'>Recommended for you</h3>

          {/* top recommeded product */}
          <div className='w-full md:w-[35%] py-2'>
            <ProductCard 
            image="https://res.cloudinary.com/dfb2hl46r/image/upload/v1751567834/pngwing.com_29_zeasos.png"
            title="Evolve Dietary Kibble"
            brief="Made with easy-to-digest grain-free carbs along with prebiotics "
            quantity="12lb"
            price="$20.00"/>
          </div>

          {/* recommended grid */}
          <div className='w-full md:w-[65%] grid grid-cols-2 lg:grid-cols-3 gap-4'>
            {recomProducts.map((product) => (
              <ProductCard
                key={product.id}
                image={product.image}
                title={product.title} 
                brief={product.brief}
                quantity={product.quantity}
                price={product.price}
              />
            ))}
          </div>

          <div className='flex justify-center'>
          <button className='cursor-pointer mt-6 w-[50%] md:w-[50%] px-6 md:px-4 py-2 md:py-2 bg-[#f4a52c] text-white text-xl md:text-sm font-semibold md:font-bold rounded-4xl relative bottom-0'>See All</button>
          </div>
        </div>
      </main>
    </section>
  )
}

export default HeroSection