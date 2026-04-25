import { ShoppingBasket, Heart } from 'lucide-react'

const ProductCard = ({ image, title, brief, price, quantity, onAddToCart }) => {
  return (
    <div className='group relative bg-white rounded-2xl ring-1 ring-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden'>
      {/* image */}
      <div className='relative aspect-square bg-[#fff3e1]'>
        <img
          src={image}
          alt={title}
          className='absolute inset-0 w-full h-full object-contain p-3'
        />
        <button
          aria-label='Add to wishlist'
          className='absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition'
        >
          <Heart className='h-4 w-4 text-gray-500' />
        </button>
        {quantity && (
          <span className='absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-xs px-2 py-0.5 rounded-full text-gray-700 font-medium'>
            {quantity}
          </span>
        )}
      </div>

      {/* body */}
      <div className='p-3 flex flex-col gap-1 flex-1'>
        <h4 className='font-semibold text-sm text-gray-900 line-clamp-1'>{title}</h4>
        <p className='text-xs text-gray-500 line-clamp-2 flex-1'>{brief}</p>
        <div className='flex items-center justify-between mt-2'>
          <p className='font-extrabold text-[#f4a52c] text-lg'>{price}</p>
          <button
            onClick={onAddToCart}
            aria-label='Add to cart'
            className='h-8 w-8 rounded-full bg-[#f4a52c] text-white flex items-center justify-center hover:bg-[#fa7a3d] transition'
          >
            <ShoppingBasket className='h-4 w-4' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
