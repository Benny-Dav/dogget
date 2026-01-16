
import React from 'react'
import ProductCard from '../../reusableComponents/ProductCard'

const shopCategories=[
    {id:1, name:"Kibbles & Treats"},
    {id:2, name:"Toys"},
    {id:3, name:"Accessories"},
    {id:4, name:"Shampoos"}
]

const ShopSection = () => {
  return (
    <section className='min-h-screen py-12 px-4 md:px-8 lg:px-12'>
        <div className='max-w-7xl mx-auto'>
            <h1 className='text-center text-3xl md:text-4xl font-extrabold leading-tight mb-6'>Shop by Category</h1>

            {/* shop category badges */}
            <div className='flex flex-wrap justify-center gap-2 md:gap-4 mb-8'>
            {shopCategories.map((category)=>(
                <div key={category.id} className='bg-[#f6b756]/20 cursor-pointer px-3 py-1.5 md:px-4 md:py-2 rounded-full border-2 border-[#f6b756] hover:border-[#fa7a3d] transition-colors'>
                    <p className='text-sm md:text-base'>{category.name}</p>
                </div>
            ))}
            </div>

            {/* content - mobile first layout */}
            <div className='flex flex-col md:flex-row gap-6 md:gap-8'>
                {/* left featured product - full width on mobile, 35% on desktop */}
                
                {/* right product grid - full width on mobile, 65% on desktop */}
               
            </div>

            {/* See All button */}
            <div className='flex justify-center mt-8'>
                <button className="button w-full md:w-auto px-12 bg-[#f4a52c] text-lg md:text-xl text-white font-bold py-3 rounded-full shadow-lg hover:bg-[#d4881c] transition-colors duration-200">
                  See All Products
                </button>
            </div>
        </div>
    </section>
  )
}

export default ShopSection