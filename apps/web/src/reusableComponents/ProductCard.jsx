import { Heart, ShoppingBasket } from "lucide-react";
import { Link } from "react-router-dom";
import { formatMoney } from "../lib/api";
import { useCartStore } from "../stores/cartStore";
import { useWishlistStore } from "../stores/wishlistStore";
import { useUIStore } from "../stores/uiStore";

/**
 * @param {{
 *   product: import("../lib/api/types.js").Product,
 *   onAddToCart?: () => void,
 *   onToggleWishlist?: () => void,
 * }} props
 */
const ProductCard = ({ product, onAddToCart, onToggleWishlist }) => {
  const image = product.images[0]?.url;
  const addToCart = useCartStore((s) => s.add);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const wishlisted = useWishlistStore((s) => s.productIds.includes(product.id));
  const toast = useUIStore((s) => s.toast);

  const handleAddToCart = () => {
    if (onAddToCart) return onAddToCart();
    addToCart(product);
    toast(`Added ${product.title} to cart`, "success");
  };

  const handleToggleWishlist = () => {
    if (onToggleWishlist) return onToggleWishlist();
    toggleWishlist(product.id);
  };

  return (
    <div className="group relative bg-white rounded-2xl ring-1 ring-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
      <Link to={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square bg-[#fff3e1]">
          <img
            src={image}
            alt={product.images[0]?.alt ?? product.title}
            className="absolute inset-0 w-full h-full object-contain p-3"
            loading="lazy"
          />
          {product.sizeLabel && (
            <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-xs px-2 py-0.5 rounded-full text-gray-700 font-medium">
              {product.sizeLabel}
            </span>
          )}
          {!product.inStock && (
            <span className="absolute top-2 left-2 bg-gray-900/80 text-white text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full">
              Out of stock
            </span>
          )}
        </div>
      </Link>

      <button
        type="button"
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        onClick={handleToggleWishlist}
        className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition"
      >
        <Heart
          className={`h-4 w-4 transition ${
            wishlisted ? "fill-[#f4a52c] text-[#f4a52c]" : "text-gray-500"
          }`}
        />
      </button>

      <div className="p-3 flex flex-col gap-1 flex-1">
        <Link to={`/products/${product.slug}`} className="flex flex-1 flex-col gap-1">
          <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">{product.title}</h4>
          <p className="text-xs text-gray-500 line-clamp-2 flex-1">{product.brief}</p>
        </Link>

        <div className="flex items-center justify-between mt-2">
          <p className="font-extrabold text-[#f4a52c] text-lg">{formatMoney(product.price)}</p>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            aria-label="Add to cart"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f4a52c] text-white transition hover:bg-[#fa7a3d] disabled:bg-gray-300"
          >
            <ShoppingBasket className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
