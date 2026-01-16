
import { Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import ProductCard from '../../reusableComponents/ProductCard'
import CategoriesSection from './CategoriesSection'
import { recomProducts } from '../../content/products'





const HeroSection = () => {


  return (
    <section className='h-auto py-4 flex flex-col gap-6 '>
      

      <main className='h-auto flex flex-col gap-6'>
        {/* hero ad */}
        <div className='h-50 rounded-2xl'>
          <img src="https://res.cloudinary.com/dfb2hl46r/image/upload/v1759078352/Crunchy_Coconut_Treats_ivfsff.jpg" alt="" className='object-cover object-center h-full w-full rounded-2xl' />
        </div>

        <CategoriesSection/>

        {/*recommended for you  */}
        <div className=''>
          <h3 className='text-xl font-semibold mb-4'>Recommended for you</h3>

          {/* top recommeded product */}
          <div className='w-full md:w-[35%] py-2 mb-4'>
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