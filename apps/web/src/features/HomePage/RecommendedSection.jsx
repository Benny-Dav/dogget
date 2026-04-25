import { Link } from "react-router-dom";
import ProductCard from "../../reusableComponents/ProductCard";
import { recomProducts } from "../../content/products";

const featured = {
  image:
    "https://res.cloudinary.com/dfb2hl46r/image/upload/v1751567834/pngwing.com_29_zeasos.png",
  title: "Evolve Dietary Kibble",
  brief: "Made with easy-to-digest grain-free carbs along with prebiotics",
  quantity: "12lb",
  price: "$20.00",
};

const RecommendedSection = () => {
  return (
    <section className="px-6 py-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Recommended for you</h3>
        <Link
          to="/shop"
          className="text-sm text-[#f4a52c] font-semibold hover:underline"
        >
          See all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ProductCard {...featured} />
        {recomProducts.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </section>
  );
};

export default RecommendedSection;
