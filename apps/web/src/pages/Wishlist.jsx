import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../reusableComponents/ProductCard";
import { useProductsByIds } from "../lib/api/hooks";
import { useCartStore } from "../stores/cartStore";
import { useUIStore } from "../stores/uiStore";
import { useWishlistStore } from "../stores/wishlistStore";

const WishlistPage = () => {
  const productIds = useWishlistStore((s) => s.productIds);
  const remove = useWishlistStore((s) => s.remove);
  const addToCart = useCartStore((s) => s.add);
  const toast = useUIStore((s) => s.toast);
  const { data: products = [], isLoading } = useProductsByIds(productIds);

  const moveToCart = (product) => {
    addToCart(product);
    remove(product.id);
    toast(`${product.title} moved to cart`, "success");
  };

  if (productIds.length === 0) {
    return (
      <div className="px-6 py-12 pb-28 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fff5e6] text-[#f4a52c]">
          <ShoppingBag className="h-9 w-9" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-[#2f2f2f]">Wishlist is empty</h1>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          Save products you want to revisit later, then move them into the cart when you are ready.
        </p>
        <Link to="/shop" className="button mt-6 inline-flex px-5 py-3">
          Explore catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfb] px-5 py-5 pb-28">
      <h1 className="text-2xl font-bold text-[#2f2f2f]">Wishlist</h1>
      <p className="mt-1 text-sm text-gray-500">
        Your saved products stay here until you remove them or move them into the cart.
      </p>

      {isLoading ? (
        <div className="mt-6 grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="aspect-[3/4] animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onToggleWishlist={() => remove(product.id)}
              onAddToCart={() => moveToCart(product)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
