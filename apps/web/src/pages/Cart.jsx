import { useMemo } from "react";
import { Heart, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { formatMoney } from "../lib/api";
import { useCartStore } from "../stores/cartStore";
import { useUIStore } from "../stores/uiStore";
import { useWishlistStore } from "../stores/wishlistStore";

const SHIPPING_PLACEHOLDER = 1200;

const CartPage = () => {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  const addWishlist = useWishlistStore((s) => s.add);
  const toast = useUIStore((s) => s.toast);
  const checkoutSheetOpen = useUIStore((s) => s.checkoutSheetOpen);
  const openCheckout = useUIStore((s) => s.openCheckout);
  const closeCheckout = useUIStore((s) => s.closeCheckout);
  const confirm = useUIStore((s) => s.confirm);

  const subtotal = useMemo(() => {
    if (items.length === 0) return { amount: 0, currency: "GHS" };
    return {
      amount: items.reduce((sum, item) => sum + item.unitPrice.amount * item.quantity, 0),
      currency: items[0].unitPrice.currency,
    };
  }, [items]);

  const groups = useMemo(() => {
    const grouped = new Map();
    for (const item of items) {
      const current = grouped.get(item.vendorId) ?? {
        vendorId: item.vendorId,
        vendorName: item.vendorName,
        vendorCodEnabled: item.vendorCodEnabled,
        items: [],
      };
      current.items.push(item);
      grouped.set(item.vendorId, current);
    }
    return Array.from(grouped.values());
  }, [items]);

  const shippingTotal = groups.length * SHIPPING_PLACEHOLDER;
  const vatAmount = Math.round(subtotal.amount * 0.15);
  const totalAmount = subtotal.amount + shippingTotal + vatAmount;

  const moveToWishlist = (item) => {
    addWishlist(item.productId);
    remove(item.productId);
    toast(`${item.title} moved to wishlist`, "success");
  };

  const requestRemove = (item) => {
    confirm({
      title: "Remove item?",
      message: `${item.title} will be removed from your cart.`,
      confirmLabel: "Delete",
      cancelLabel: "Keep item",
      kind: "danger",
      onConfirm: () => {
        remove(item.productId);
        toast(`${item.title} removed from cart`, "info");
      },
    });
  };

  if (items.length === 0) {
    return (
      <div className="px-6 py-12 pb-28 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fff5e6] text-[#f4a52c]">
          <ShoppingBag className="h-9 w-9" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-[#2f2f2f]">Your cart is empty</h1>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          Save products from the catalog and they will appear here for grouped checkout by vendor.
        </p>
        <Link to="/shop" className="button mt-6 inline-flex px-5 py-3">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfb] px-5 py-5 pb-28">
      <h1 className="text-2xl font-bold text-[#2f2f2f]">Cart</h1>
      <p className="mt-1 text-sm text-gray-500">
        Items are grouped by vendor so split-order shipping is clear before checkout.
      </p>

      <div className="mt-6 space-y-5">
        {groups.map((group) => {
          const vendorSubtotal = group.items.reduce(
            (sum, item) => sum + item.unitPrice.amount * item.quantity,
            0
          );

          return (
            <section key={group.vendorId} className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-[#2f2f2f]">{group.vendorName}</h2>
                  <p className="mt-1 text-xs uppercase tracking-wide text-gray-400">
                    Vendor group
                  </p>
                </div>
                <span className="rounded-full bg-[#fff5e6] px-3 py-1 text-xs font-semibold text-[#8a5a08]">
                  Shipping placeholder
                </span>
              </div>

              <div className="mt-5 space-y-4">
                {group.items.map((item) => (
                  <article key={item.productId} className="rounded-2xl bg-[#fcfcfb] p-4 ring-1 ring-gray-100">
                    <div className="flex gap-4">
                      <Link
                        to={`/products/${item.slug}`}
                        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#fff3e1] p-2"
                      >
                        <img src={item.imageUrl} alt={item.title} className="h-full w-full object-contain" />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <Link to={`/products/${item.slug}`} className="font-semibold text-gray-900">
                              {item.title}
                            </Link>
                            <p className="mt-1 text-xs text-gray-500">{item.sizeLabel ?? "Single item"}</p>
                          </div>
                          <p className="text-sm font-bold text-[#f4a52c]">{formatMoney(item.unitPrice)}</p>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 rounded-full bg-white px-2 py-1 shadow-sm ring-1 ring-gray-100">
                            <button
                              type="button"
                              onClick={() => setQuantity(item.productId, item.quantity - 1)}
                              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-700"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-6 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => setQuantity(item.productId, item.quantity + 1)}
                              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-700"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => moveToWishlist(item)}
                              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff5e6] text-[#8a5a08]"
                              aria-label="Move to wishlist"
                            >
                              <Heart className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => requestRemove(item)}
                              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500"
                              aria-label="Remove from cart"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-5 rounded-2xl bg-[#fcfcfb] p-4 ring-1 ring-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Vendor subtotal</span>
                  <span className="font-semibold text-gray-900">
                    {formatMoney({ amount: vendorSubtotal, currency: subtotal.currency })}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                  <span>Estimated shipping</span>
                  <span className="font-semibold text-gray-900">
                    {formatMoney({ amount: SHIPPING_PLACEHOLDER, currency: subtotal.currency })}
                  </span>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <button
        type="button"
        onClick={openCheckout}
        className="mt-6 w-full rounded-[1.75rem] bg-[#2f2f2f] px-5 py-4 text-sm font-bold text-white shadow-sm"
      >
        Checkout
      </button>

      {checkoutSheetOpen && (
        <div className="fixed inset-0 z-[70] bg-black/35">
          <div className="fixed inset-y-0 left-1/2 flex w-full max-w-[430px] -translate-x-1/2 items-end">
            <button
              type="button"
              className="absolute inset-0"
              aria-label="Close checkout drawer"
              onClick={closeCheckout}
            />
            <div className="relative w-full rounded-t-[2rem] bg-white px-6 pb-8 pt-5 shadow-2xl">
              <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-gray-200" />
              <h2 className="text-xl font-bold text-[#2f2f2f]">Checkout</h2>
              <p className="mt-1 text-sm text-gray-500">
                Review the mock totals, then continue into the staged checkout flow.
              </p>

              <div className="mt-6 rounded-[1.75rem] bg-[#2f2f2f] p-5 text-white shadow-sm">
                <div className="space-y-2 text-sm text-white/80">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span>{formatMoney(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shipping</span>
                    <span>{formatMoney({ amount: shippingTotal, currency: subtotal.currency })}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>VAT (15%)</span>
                    <span>{formatMoney({ amount: vatAmount, currency: subtotal.currency })}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-sm font-semibold text-white/80">Total</span>
                  <span className="text-2xl font-extrabold">
                    {formatMoney({ amount: totalAmount, currency: subtotal.currency })}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={closeCheckout}
                  className="rounded-2xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    closeCheckout();
                    navigate("/checkout/address");
                  }}
                  className="rounded-2xl bg-[#f4a52c] px-4 py-3 text-sm font-bold text-white"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
