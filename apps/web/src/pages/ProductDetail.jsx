import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronDown, ChevronLeft, Heart, Minus, Plus, ShieldCheck, ShoppingBasket, Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { getMockReviews } from "../features/shop/mockReviews";
import ProductCard from "../reusableComponents/ProductCard";
import { formatMoney } from "../lib/api";
import { useProduct, useRelatedProducts } from "../lib/api/hooks";
import { useCartStore } from "../stores/cartStore";
import { useUIStore } from "../stores/uiStore";
import { useWishlistStore } from "../stores/wishlistStore";

const LABELS = {
  PUPPY: "Puppy",
  ADULT: "Adult",
  SENIOR: "Senior",
  SMALL: "Small breed",
  MEDIUM: "Medium breed",
  LARGE: "Large breed",
  GRAIN_FREE: "Grain free",
  HIGH_PROTEIN: "High protein",
  LIMITED_INGREDIENT: "Limited ingredient",
  ORGANIC: "Organic",
  HYPOALLERGENIC: "Hypoallergenic",
};

const formatTag = (value) => LABELS[value] ?? value;
const REVIEWS_PER_PAGE = 2;

const renderDescriptionBlocks = (description) => {
  if (!description) return null;

  return description
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => {
      if (block.startsWith("- ")) {
        const items = block
          .split("\n")
          .map((line) => line.replace(/^- /, "").trim())
          .filter(Boolean);

        return (
          <ul key={`desc_list_${index}`} className="space-y-2 pl-5 text-sm leading-7 text-gray-600 list-disc">
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        );
      }

      return (
        <p key={`desc_paragraph_${index}`} className="text-sm leading-7 text-gray-600">
          {block}
        </p>
      );
    });
};

const ProductDetailPage = () => {
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [shippingOpen, setShippingOpen] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);
  const addToCart = useCartStore((s) => s.add);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const wishlisted = useWishlistStore((s) => s.productIds);
  const toast = useUIStore((s) => s.toast);

  const { data: product, isLoading, isError } = useProduct(slug);
  const { data: related = [] } = useRelatedProducts(slug, 4);

  const activeWishlisted = product ? wishlisted.includes(product.id) : false;
  const attributeChips = useMemo(() => {
    if (!product) return [];
    return [...product.lifeStage, ...product.breedSize, ...product.dietaryTags].map(formatTag);
  }, [product]);
  const reviews = useMemo(() => getMockReviews(slug ?? "", product?.reviewCount ?? 2), [product?.reviewCount, slug]);
  const paginatedReviews = useMemo(
    () => reviews.slice((reviewPage - 1) * REVIEWS_PER_PAGE, reviewPage * REVIEWS_PER_PAGE),
    [reviewPage, reviews]
  );
  const totalReviewPages = Math.max(1, Math.ceil(reviews.length / REVIEWS_PER_PAGE));

  const handleQuantity = (delta) => {
    if (!product) return;
    setQuantity((current) => Math.max(1, Math.min(current + delta, product.stockCount || 1)));
  };

  const handleWishlist = () => {
    if (!product) return;
    toggleWishlist(product.id);
  };

  const handleAddToCart = () => {
    if (!product || !product.inStock) return;
    addToCart(product, quantity);
    toast(`Added ${quantity} ${product.title} to cart`, "success");
  };

  if (isLoading) {
    return (
      <div className="px-5 py-6 pb-28">
        <div className="mb-4 h-6 w-28 animate-pulse rounded-full bg-gray-100" />
        <div className="aspect-square animate-pulse rounded-[2rem] bg-[#fff3e1]" />
        <div className="mt-6 space-y-3">
          <div className="h-8 w-3/4 animate-pulse rounded bg-gray-100" />
          <div className="h-5 w-1/2 animate-pulse rounded bg-gray-100" />
          <div className="h-24 animate-pulse rounded-3xl bg-gray-100" />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="px-6 py-12 text-center">
        <p className="text-lg font-semibold text-gray-900">Product not found.</p>
        <p className="mt-2 text-sm text-gray-500">The product may have been removed from the mock catalog.</p>
        <Link to="/shop" className="button inline-flex mt-5 px-5 py-2.5">
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfb] pb-28">
      <section className="px-5 pt-5">
        <Link
          to="/shop"
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-[#f4a52c]"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to shop
        </Link>

        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#fff7ea] via-[#fffaf3] to-[#fff2db]">
          <Swiper modules={[Pagination]} pagination={{ clickable: true }} className="product-detail-swiper">
            {product.images.map((image) => (
              <SwiperSlide key={image.id}>
                <div className="aspect-square p-6">
                  <img
                    src={image.url}
                    alt={image.alt ?? product.title}
                    className="h-full w-full object-contain"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="mt-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f4a52c]">
              {product.category.name}
            </p>
            <h1 className="mt-2 text-3xl font-bold leading-tight text-[#2f2f2f]">
              {product.title}
            </h1>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#fff5e6] px-3 py-1.5 text-sm text-[#8a5a08]">
              <span className="font-semibold">{product.vendor.name}</span>
              {product.vendor.verified && (
                <>
                  <span className="h-1 w-1 rounded-full bg-[#d48910]" />
                  <span className="font-medium">Verified vendor</span>
                </>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Vendor identity is shown for trust. Orders and communication stay within Dogget.
            </p>
          </div>

          <button
            type="button"
            onClick={handleWishlist}
            aria-label={activeWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#f4a52c]/20 bg-white text-[#f4a52c] shadow-sm"
          >
            <Heart className={`h-5 w-5 ${activeWishlisted ? "fill-[#f4a52c]" : ""}`} />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-gray-100">
            <Star className="h-4 w-4 fill-[#f4a52c] text-[#f4a52c]" />
            <span className="font-semibold text-gray-900">{product.averageRating.toFixed(1)}</span>
            <span>({product.reviewCount})</span>
          </div>
          {product.vendor.verified && (
            <div className="flex items-center gap-1 rounded-full bg-[#f4a52c]/10 px-3 py-1.5 text-[#a66607]">
              <ShieldCheck className="h-4 w-4" />
              <span className="font-semibold">Verified vendor</span>
            </div>
          )}
        </div>

        <div className="mt-6 rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-3xl font-extrabold text-[#f4a52c]">{formatMoney(product.price)}</p>
              <p className="mt-1 text-sm text-gray-500">
                {product.sizeLabel ?? "Single item"} {product.inStock ? `• ${product.stockCount} in stock` : "• Currently unavailable"}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                product.inStock ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
              }`}
            >
              {product.inStock ? "In stock" : "Out of stock"}
            </span>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#f8f8f8] px-3 py-3">
            <span className="text-sm font-semibold text-gray-700">Quantity</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleQuantity(-1)}
                disabled={quantity <= 1}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm disabled:opacity-40"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-base font-bold text-gray-900">{quantity}</span>
              <button
                type="button"
                onClick={() => handleQuantity(1)}
                disabled={!product.inStock || quantity >= product.stockCount}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#f4a52c] px-4 py-3 text-sm font-bold text-white disabled:bg-gray-300"
            >
              <ShoppingBasket className="h-4 w-4" />
              Add to cart
            </button>
            <Link
              to="/cart"
              className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700"
            >
              View cart
            </Link>
          </div>
        </div>

        {attributeChips.length > 0 && (
          <section className="mt-6">
            <h2 className="text-lg font-bold text-[#2f2f2f]">Good fit for</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {attributeChips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full bg-[#fff5e6] px-3 py-1.5 text-sm font-medium text-[#8a5a08]"
                >
                  {chip}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="mt-6 rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <h2 className="text-lg font-bold text-[#2f2f2f]">About this product</h2>
          <div className="mt-3 space-y-4">
            {renderDescriptionBlocks(product.description ?? product.brief)}
          </div>
        </section>

        <section className="mt-6 rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#2f2f2f]">Customer reviews</h2>
              <p className="mt-1 text-sm text-gray-500">
                Snapshot from current mock fixtures. Verified-purchase gating lands later.
              </p>
            </div>
            <p className="text-3xl font-extrabold text-[#2f2f2f]">{product.averageRating.toFixed(1)}</p>
          </div>

          <div className="mt-5 space-y-4">
            {paginatedReviews.map((review) => (
              <article key={review.id} className="rounded-2xl bg-[#fcfcfb] p-4 ring-1 ring-gray-100">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{review.title}</h3>
                    <p className="mt-1 text-xs text-gray-500">
                      {review.author} • {review.date}
                    </p>
                  </div>
                  <div className="shrink-0 rounded-full bg-[#fff5e6] px-2.5 py-1 text-xs font-bold text-[#8a5a08]">
                    {review.rating}.0
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={`${review.id}_${index}`}
                      className={`h-4 w-4 ${
                        index < review.rating ? "fill-[#f4a52c] text-[#f4a52c]" : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>

                <p className="mt-3 text-sm leading-6 text-gray-600">{review.body}</p>
                {review.verified && (
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    Verified purchase
                  </p>
                )}
              </article>
            ))}
          </div>

          {totalReviewPages > 1 && (
            <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-[#fcfcfb] px-4 py-3 ring-1 ring-gray-100">
              <button
                type="button"
                onClick={() => setReviewPage((current) => Math.max(1, current - 1))}
                disabled={reviewPage === 1}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-40"
              >
                Previous
              </button>
              <p className="text-xs font-medium text-gray-500">
                Review page {reviewPage} of {totalReviewPages}
              </p>
              <button
                type="button"
                onClick={() => setReviewPage((current) => Math.min(totalReviewPages, current + 1))}
                disabled={reviewPage === totalReviewPages}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </section>

        <section className="mt-6 rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <button
            type="button"
            onClick={() => setShippingOpen((current) => !current)}
            className="flex w-full items-center justify-between gap-4 text-left"
            aria-expanded={shippingOpen}
          >
            <div>
              <h2 className="text-lg font-bold text-[#2f2f2f]">Shipping</h2>
              <p className="mt-1 text-sm text-gray-500">Estimated dispatch and delivery guidance</p>
            </div>
            <ChevronDown
              className={`h-5 w-5 shrink-0 text-gray-500 transition-transform ${
                shippingOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {shippingOpen && (
            <div className="mt-4 space-y-4 text-sm leading-6 text-gray-600">
              <div className="rounded-2xl bg-[#fcfcfb] p-4 ring-1 ring-gray-100">
                <p className="font-semibold text-gray-900">Delivery window</p>
                <p className="mt-1">
                  Accra orders usually move within 24 hours. Regional delivery typically takes 2 to 4 business days once dispatched.
                </p>
              </div>
              <div className="rounded-2xl bg-[#fcfcfb] p-4 ring-1 ring-gray-100">
                <p className="font-semibold text-gray-900">Fulfilment note</p>
                <p className="mt-1">
                  Orders from verified vendors are packed separately when needed. Final shipping cost is confirmed in Phase 3 checkout.
                </p>
              </div>
              <div className="rounded-2xl bg-[#fcfcfb] p-4 ring-1 ring-gray-100">
                <p className="font-semibold text-gray-900">Returns</p>
                <p className="mt-1">
                  Unopened items can be reviewed for return eligibility after delivery. Policy text will be finalized with operational flows.
                </p>
              </div>
            </div>
          )}
        </section>
      </section>

      {related.length > 0 && (
        <section className="mt-8 px-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#2f2f2f]">Related products</h2>
            <Link to="/shop" className="text-sm font-semibold text-[#f4a52c]">
              Browse more
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
