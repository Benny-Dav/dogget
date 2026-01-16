import { categories } from '../../content/categories';

const CategoriesSection = () => {
  return (
    <div className='w-full '>
      {/* category buttons */}
      <h3 className="text-xl font-semibold text-black mb-4">Categories</h3>
      <div className="w-full h-auto flex whitespace-nowrap gap-4 overflow-x-auto scrollbar-hide ">
        {categories.map((category) => (
          <div key={category.id} className="flex flex-col items-center flex-shrink-0 cursor-pointer">
            <div className="w-14 h-16 overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                className="rounded-full object-cover w-full h-full"
              />
            </div>
            <p className="text-base text-black text-center">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesSection;
