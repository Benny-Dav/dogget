import { CheckCircle2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getPaymentLabel } from "../features/checkout/paymentOptions";
import { formatMoney } from "../lib/api";
import { useCheckoutStore } from "../stores/checkoutStore";

const CheckoutConfirmationPage = () => {
  const { id } = useParams();
  const confirmation = useCheckoutStore((s) => s.lastConfirmation);

  if (!confirmation || confirmation.id !== id) {
    return (
      <div className="px-6 py-12 pb-28 text-center">
        <h1 className="text-2xl font-bold text-[#2f2f2f]">Confirmation unavailable</h1>
        <p className="mt-2 text-sm text-gray-500">The mock confirmation has expired from local state.</p>
        <Link to="/shop" className="button mt-6 inline-flex px-5 py-3">
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfb] px-6 py-12 pb-28 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <CheckCircle2 className="h-10 w-10" />
      </div>
      <h1 className="mt-5 text-3xl font-bold text-[#2f2f2f]">Order placed</h1>
      <p className="mt-2 text-sm leading-6 text-gray-500">
        This is a mock confirmation, but the flow now behaves like a real staged checkout.
      </p>

      <section className="mt-8 rounded-[1.75rem] bg-white p-5 text-left shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Reference</span>
          <span className="font-bold text-gray-900">{confirmation.orderGroupId}</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-gray-500">Payment</span>
          <span className="font-semibold text-gray-900">{getPaymentLabel(confirmation.paymentMethod)}</span>
        </div>
        {confirmation.discount?.amount > 0 && (
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-gray-500">Discount</span>
            <span className="font-semibold text-emerald-700">
              -{formatMoney(confirmation.discount)}
              {confirmation.coupon?.code ? ` (${confirmation.coupon.code})` : ""}
            </span>
          </div>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-gray-500">Total</span>
          <span className="font-bold text-[#f4a52c]">{formatMoney(confirmation.total)}</span>
        </div>
        <div className="mt-5 rounded-2xl bg-[#fcfcfb] p-4 text-sm leading-6 text-gray-600 ring-1 ring-gray-100">
          <p className="font-semibold text-gray-900">{confirmation.address.recipient}</p>
          <p>{confirmation.address.phone}</p>
          <p>{confirmation.address.line1}</p>
          {confirmation.address.line2 ? <p>{confirmation.address.line2}</p> : null}
          <p>
            {confirmation.address.city}, {confirmation.address.region}, {confirmation.address.country}
          </p>
        </div>
      </section>

      <div className="mt-8 flex flex-col gap-3">
        <Link to="/orders" className="button inline-flex justify-center px-5 py-3">
          View orders
        </Link>
        <Link to="/shop" className="button inline-flex justify-center px-5 py-3">
          Continue shopping
        </Link>
        <Link to={`/orders/${confirmation.id}`} className="text-sm font-semibold text-[#f4a52c]">
          Open order detail
        </Link>
      </div>
    </div>
  );
};

export default CheckoutConfirmationPage;
