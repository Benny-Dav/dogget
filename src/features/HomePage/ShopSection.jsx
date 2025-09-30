
import React from 'react'
import ProductCard from '../../reusableComponents/ProductCard'

const shopCategories=[
    {id:1, name:"Kibbles & Treats"},
    {id:2, name:"Toys"},
    {id:3, name:"Accessories"},
    {id:4, name:"Shampoos"}
]
const shopProducts=[
    {id:1,
        image:"https://res.cloudinary.com/dfb2hl46r/image/upload/v1751567835/pngwing.com_30_rc5lzt.png", 
         title:"Foster Oatmeal Treats",
         quantity:"8lb",
        price:"$16.00",
        },
        {id:2,
            image:"https://res.cloudinary.com/dfb2hl46r/image/upload/v1751567584/pngwing.com_27_sd9l7x.png",
            title:"Pedigree Chicken & Rice",
            quantity:"12lb",
            price:"$14.85",
        },
        {
            id:3,
            image:"https://res.cloudinary.com/dfb2hl46r/image/upload/v1751567834/pngwing.com_28_sjnpkd.png",
            title:"Royal Canin Digestive ",
            quantity:"20kg",
            price:"$35.50"
        },
        {
            id:4,
            image:"https://res.cloudinary.com/dfb2hl46r/image/upload/v1751567838/pngwing.com_31_bn6uws.png",
            title:"Brit Premium Kibble",
            quantity:"8lb",
            price:"$20.00"
        },
        {id:5,
            image:"https://res.cloudinary.com/dfb2hl46r/image/upload/v1751567584/pngwing.com_27_sd9l7x.png",
            title:"Pedigree Chicken & Rice",
            quantity:"12lb",
            price:"$14.85",
        },
        {
            id:6,
            image:"https://res.cloudinary.com/dfb2hl46r/image/upload/v1751567838/pngwing.com_31_bn6uws.png",
            title:"Brit Premium Kibble",
            quantity:"8lb",
            price:"$20.00"
        }
        
]
const ShopSection = () => {
  return (
    <section className='min-h-screen bg-gradient-to-br from-[#f2f2f2] to-[#fffbe6] py-12 px-4 md:px-8 lg:px-12'>
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