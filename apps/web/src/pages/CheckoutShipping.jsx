import { Link, useNavigate } from "react-router-dom";
import CheckoutStepHeader from "../features/checkout/CheckoutStepHeader";
import { formatMoney } from "../lib/api";
import { useCartStore } from "../stores/cartStore";
import { useCheckoutStore } from "../stores/checkoutStore";

const SHIPPING_OPTIONS = [
  {
    value: "STANDARD",
    label: "Standard delivery",
    note: "Dispatch within 24 hours, delivery in 2 to 4 business days.",
    feePerVendor: 1200,
  },
  {
    value: "EXPRESS",
    label: "Express delivery",
    note: "Priority dispatch with faster handoff in major regions.",
    feePerVendor: 2200,
  },
];

const CheckoutShippingPage = () => {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const shippingMethod = useCheckoutStore((s) => s.shippingMethod);
  const setShippingMethod = useCheckoutStore((s) => s.setShippingMethod);

  if (items.length === 0) {
    return (
      <div className="px-6 py-12 pb-28 text-center">
        <h1 className="text-2xl font-bold text-[#2f2f2f]">No items to ship</h1>
        <p className="mt-2 text-sm text-gray-500">Return to the cart before choosing shipping.</p>
        <Link to="/cart" className="button mt-6 inline-flex px-5 py-3">
          Go to cart
        </Link>
      </div>
    );
  }

  const groups = Array.from(
    items.reduce((map, item) => {
      const current = map.get(item.vendorId) ?? {
        vendorId: item.vendorId,
        vendorName: item.vendorName,
        items: [],
      };
      current.items.push(item);
      map.set(item.vendorId, current);
      return map;
    }, new Map())
  ).map(([, value]) => value);

  const selectedOption =
    SHIPPING_OPTIONS.find((option) => option.value === shippingMethod) ?? SHIPPING_OPTIONS[0];

  return (
    <div className="bg-[#fcfcfb] px-5 py-5 pb-28">
      <CheckoutStepHeader
        currentStep={2}
        title="Shipping method"
        description="Choose the delivery speed for this order."
      />

      <section className="mt-6 rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <h2 className="text-lg font-bold text-[#2f2f2f]">Choose delivery speed</h2>
        <div className="mt-4 space-y-3">
          {SHIPPING_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setShippingMethod(option.value)}
              className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                shippingMethod === option.value
                  ? "border-[#f4a52c] bg-[#fff8ef]"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">{option.label}</p>
                  <p className="mt-1 text-sm text-gray-500">{option.note}</p>
                </div>
                <span className="text-sm font-bold text-[#f4a52c]">
                  {formatMoney({
                    amount: option.feePerVendor * groups.length,
                    currency: items[0]?.unitPrice.currency ?? "GHS",
                  })}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <h2 className="text-lg font-bold text-[#2f2f2f]">Shipping by vendor</h2>
        <p className="mt-1 text-sm text-gray-500">
          Because Dogget supports split orders, each vendor contributes a separate shipping line.
        </p>
        <div className="mt-4 space-y-3">
          {groups.map((group) => (
            <div key={group.vendorId} className="rounded-2xl bg-[#fcfcfb] p-4 ring-1 ring-gray-100">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">{group.vendorName}</p>
                  <p className="mt-1 text-xs text-gray-500">{group.items.length} item(s)</p>
                </div>
                <span className="text-sm font-bold text-[#f4a52c]">
                  {formatMoney({
                    amount: selectedOption.feePerVendor,
                    currency: items[0]?.unitPrice.currency ?? "GHS",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => navigate("/checkout/address")}
          className="rounded-2xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-700"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => navigate("/checkout/payment")}
          className="rounded-2xl bg-[#f4a52c] px-4 py-3 text-sm font-bold text-white"
        >
          Continue to payment
        </button>
      </div>
    </div>
  );
};

export default CheckoutShippingPage;
