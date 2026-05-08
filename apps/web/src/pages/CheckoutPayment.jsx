import { useEffect, useMemo, useState } from "react";
import { ShieldCheck, WalletCards } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CheckoutStepHeader from "../features/checkout/CheckoutStepHeader";
import { normalizePaymentMethod } from "../features/checkout/paymentOptions";
import atLogo from "../assets/icons/at.jpeg";
import mastercardLogo from "../assets/icons/mastercard.png";
import mtnLogo from "../assets/icons/mtn.png";
import telecelLogo from "../assets/icons/telecel.png";
import visaLogo from "../assets/icons/visa.png";
import { api, formatMoney } from "../lib/api";
import { calculateCouponDiscount, findActiveCoupon } from "../features/vendor/vendorMock";
import { useCartStore } from "../stores/cartStore";
import { useCheckoutStore } from "../stores/checkoutStore";
import { useUIStore } from "../stores/uiStore";

const PAYMENT_OPTIONS = [
  {
    value: "PAYSTACK",
    label: "Pay online with Paystack",
    detail: "Paystack Checkout will let you choose Mobile Money or Card.",
    icon: WalletCards,
    marks: [
      { label: "Visa", src: visaLogo, className: "h-3.5 w-9" },
      { label: "Mastercard", src: mastercardLogo, className: "h-4 w-7" },
      { label: "MTN", src: mtnLogo, className: "h-4 w-8" },
      { label: "Telecel", src: telecelLogo, className: "h-4 w-9" },
      { label: "AT", src: atLogo, className: "h-4 w-7" },
    ],
  },
];

const SHIPPING_LABELS = {
  STANDARD: "Standard delivery",
  EXPRESS: "Express delivery",
};

const SHIPPING_FEES = {
  STANDARD: 1200,
  EXPRESS: 2200,
};

const CheckoutPaymentPage = () => {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);
  const address = useCheckoutStore((s) => s.address);
  const shippingMethod = useCheckoutStore((s) => s.shippingMethod);
  const paymentMethod = useCheckoutStore((s) => s.paymentMethod);
  const coupon = useCheckoutStore((s) => s.coupon);
  const setPaymentMethod = useCheckoutStore((s) => s.setPaymentMethod);
  const setCoupon = useCheckoutStore((s) => s.setCoupon);
  const clearCoupon = useCheckoutStore((s) => s.clearCoupon);
  const addOrder = useCheckoutStore((s) => s.addOrder);
  const toast = useUIStore((s) => s.toast);
  const [placing, setPlacing] = useState(false);
  const [couponCode, setCouponCode] = useState(coupon?.code ?? "");

  const normalizedPaymentMethod = normalizePaymentMethod(paymentMethod);
  const vendorCount = useMemo(() => new Set(items.map((item) => item.vendorId)).size, [items]);
  const subtotalAmount = items.reduce((sum, item) => sum + item.unitPrice.amount * item.quantity, 0);
  const currency = items[0]?.unitPrice.currency ?? "GHS";
  const shippingFeePerVendor = SHIPPING_FEES[shippingMethod] ?? SHIPPING_FEES.STANDARD;
  const shippingAmount = vendorCount * shippingFeePerVendor;
  const discountAmount = calculateCouponDiscount(coupon, subtotalAmount);
  const taxableAmount = Math.max(0, subtotalAmount - discountAmount);
  const vatAmount = Math.round(taxableAmount * 0.15);
  const totalAmount = taxableAmount + shippingAmount + vatAmount;

  useEffect(() => {
    if (normalizedPaymentMethod !== paymentMethod) {
      setPaymentMethod(normalizedPaymentMethod);
    }
  }, [normalizedPaymentMethod, paymentMethod, setPaymentMethod]);

  if (items.length === 0) {
    return (
      <div className="px-6 py-12 pb-28 text-center">
        <h1 className="text-2xl font-bold text-[#2f2f2f]">Nothing to pay for</h1>
        <p className="mt-2 text-sm text-gray-500">Start from the cart once you have items ready.</p>
        <Link to="/cart" className="button mt-6 inline-flex px-5 py-3">
          Go to cart
        </Link>
      </div>
    );
  }

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const confirmation = await api.checkout.session({
        items,
        address,
        shippingMethod,
        paymentMethod: normalizedPaymentMethod,
        couponCode: coupon?.code,
      });
      addOrder(confirmation);
      clearCart();
      navigate(`/checkout/confirmation/${confirmation.id}`);
    } catch (error) {
      toast(error?.message ?? "Could not create checkout session", "error");
    } finally {
      setPlacing(false);
    }
  };

  const applyCoupon = (event) => {
    event.preventDefault();
    const match = findActiveCoupon(couponCode);
    const nextDiscountAmount = calculateCouponDiscount(match, subtotalAmount);

    if (!match) {
      clearCoupon();
      toast("Discount code not found", "error");
      return;
    }

    if (nextDiscountAmount <= 0) {
      clearCoupon();
      toast("Discount code is not eligible for this order", "error");
      return;
    }

    setCoupon(match);
    setCouponCode(match.code);
    toast(`${match.code} applied`, "success");
  };

  return (
    <div className="bg-[#fcfcfb] px-5 py-5 pb-28">
      <CheckoutStepHeader
        currentStep={3}
        title="Payment"
        description="Choose how you want to pay for this order."
      />

      <section className="mt-6 rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#2f2f2f]">Delivery</h2>
            <div className="mt-3 text-sm leading-6 text-gray-600">
              <p className="font-semibold text-gray-900">{address.recipient}</p>
              <p>{address.phone}</p>
              <p>{address.line1}</p>
              <p>
                {address.city}, {address.region}
              </p>
            </div>
          </div>
          <Link to="/checkout/address" className="text-sm font-semibold text-[#f4a52c]">
            Edit
          </Link>
        </div>
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#fcfcfb] px-4 py-3 text-sm ring-1 ring-gray-100">
          <span className="font-semibold text-gray-700">{SHIPPING_LABELS[shippingMethod] ?? "Standard delivery"}</span>
          <Link to="/checkout/shipping" className="font-semibold text-[#f4a52c]">
            Change
          </Link>
        </div>
      </section>

      <section className="mt-6 rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-[#2f2f2f]">Items in this order</h2>
          <span className="text-sm font-semibold text-gray-400">{items.length} item(s)</span>
        </div>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {items.map((item) => (
            <div key={item.productId} className="w-20 shrink-0">
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-[#fcfcfb] ring-1 ring-gray-100">
                <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
                <span className="absolute right-1 top-1 rounded-full bg-[#f4a52c] px-1.5 py-0.5 text-[0.65rem] font-bold text-white">
                  {item.quantity}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-xs font-semibold leading-4 text-gray-600">{item.title}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <h2 className="text-lg font-bold text-[#2f2f2f]">Payment method</h2>
        <div className="mt-4 rounded-2xl border border-gray-100 bg-white px-4 py-4">
          {PAYMENT_OPTIONS.map((option) => {
            const Icon = option.icon;

            return (
              <div key={option.value} className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff5e6] text-[#f4a52c]">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900">{option.label}</p>
                  <div className="mt-3 flex items-center gap-1.5 overflow-hidden" aria-label={`Supported ${option.label} options`}>
                    {option.marks.map((mark) => (
                      <span
                        key={mark.label}
                        className="flex h-6 shrink-0 items-center justify-center rounded-md border border-gray-100 bg-white px-1 shadow-sm"
                      >
                        <img
                          src={mark.src}
                          alt={mark.label}
                          className={`${mark.className} object-contain`}
                          loading="lazy"
                        />
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-xs font-medium leading-5 text-gray-400">{option.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-6 rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <h2 className="text-lg font-bold text-[#2f2f2f]">Discount code</h2>
        <form onSubmit={applyCoupon} className="mt-4 flex gap-2">
          <input
            value={couponCode}
            onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
            placeholder="NEWPUP10"
            className="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold uppercase text-gray-800 outline-none focus:border-[#f4a52c]"
          />
          <button className="rounded-2xl bg-[#2f2f2f] px-4 py-3 text-sm font-bold text-white">
            Apply
          </button>
        </form>
        {coupon && discountAmount > 0 && (
          <div className="mt-3 flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3 text-sm">
            <span className="font-semibold text-emerald-800">{coupon.code} applied</span>
            <button
              type="button"
              onClick={() => {
                clearCoupon();
                setCouponCode("");
              }}
              className="font-bold text-emerald-700"
            >
              Remove
            </button>
          </div>
        )}
      </section>

      <section className="mt-6 rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
          <ShieldCheck className="h-4 w-4" />
          <span>Secure checkout</span>
        </div>
        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span>{formatMoney({ amount: subtotalAmount, currency })}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Shipping</span>
            <span>{formatMoney({ amount: shippingAmount, currency })}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex items-center justify-between text-emerald-700">
              <span>Discount{coupon?.code ? ` (${coupon.code})` : ""}</span>
              <span>-{formatMoney({ amount: discountAmount, currency })}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span>VAT (15%)</span>
            <span>{formatMoney({ amount: vatAmount, currency })}</span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-sm font-semibold text-gray-600">Total</span>
          <span className="text-2xl font-extrabold text-[#2f2f2f]">{formatMoney({ amount: totalAmount, currency })}</span>
        </div>
        <button
          type="button"
          onClick={placeOrder}
          disabled={placing}
          className="mt-5 w-full rounded-2xl bg-[#f4a52c] px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
        >
          {placing
            ? "Placing order..."
            : `Pay with Paystack ${formatMoney({ amount: totalAmount, currency })}`}
        </button>
        <p className="mt-3 text-center text-xs leading-5 text-gray-400">
          Card and Mobile Money details are entered in Paystack Checkout, not in Dogget.
        </p>
      </section>
    </div>
  );
};

export default CheckoutPaymentPage;
