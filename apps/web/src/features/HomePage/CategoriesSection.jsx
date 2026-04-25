import { categories } from '../../content/categories';
import { LayoutGrid } from 'lucide-react';

const CategoriesSection = ({ selected = null, onSelect }) => {
  const selectable = typeof onSelect === 'function';

  return (
    <section className='w-full px-6 py-3'>
      <h3 className='text-xl font-bold text-gray-900 mb-4'>Categories</h3>
      <div className='w-full flex whitespace-nowrap gap-4 overflow-x-auto scrollbar-hide pb-1'>
        {selectable && (
          <button
            onClick={() => onSelect(null)}
            className='flex flex-col items-center flex-shrink-0 gap-2 group cursor-pointer'
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center transition ${
                selected === null
                  ? 'bg-[#f4a52c] text-white ring-2 ring-[#f4a52c]'
                  : 'bg-gray-100 text-gray-600 ring-1 ring-transparent group-hover:ring-[#f4a52c]/40'
              }`}
            >
              <LayoutGrid className='h-5 w-5' />
            </div>
            <p
              className={`text-xs text-center transition ${
                selected === null
                  ? 'text-[#f4a52c] font-semibold'
                  : 'text-gray-700 group-hover:text-[#f4a52c]'
              }`}
            >
              All
            </p>
          </button>
        )}
        {categories.map((category) => {
          const isSelected = selectable && selected === category.name;
          return (
            <button
              key={category.id}
              onClick={selectable ? () => onSelect(category.name) : undefined}
              className='flex flex-col items-center flex-shrink-0 gap-2 group cursor-pointer'
            >
              <div
                className={`w-16 h-16 rounded-full bg-[#f4a52c]/10 p-1.5 transition ${
                  isSelected
                    ? 'ring-2 ring-[#f4a52c]'
                    : 'ring-1 ring-transparent group-hover:ring-[#f4a52c]/40'
                }`}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className='rounded-full object-cover w-full h-full'
                />
              </div>
              <p
                className={`text-xs text-center transition ${
                  isSelected
                    ? 'text-[#f4a52c] font-semibold'
                    : 'text-gray-700 group-hover:text-[#f4a52c]'
                }`}
              >
                {category.name}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default CategoriesSection;
