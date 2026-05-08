import { Link } from "react-router-dom";
import ProductCard from "../../reusableComponents/ProductCard";
import { useFeaturedProducts } from "../../lib/api/hooks";

const RecommendedSection = () => {
  const { data: products = [], isLoading } = useFeaturedProducts();

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
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-2xl bg-gray-100 animate-pulse"
              />
            ))
          : products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
};

export default RecommendedSection;
