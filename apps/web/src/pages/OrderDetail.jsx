import { Link, useParams } from "react-router-dom";
import { getPaymentLabel } from "../features/checkout/paymentOptions";
import { formatMoney } from "../lib/api";
import { useCheckoutStore } from "../stores/checkoutStore";

const OrderDetailPage = () => {
  const { id } = useParams();
  const order = useCheckoutStore((s) => s.orders.find((entry) => entry.id === id));

  if (!order) {
    return (
      <div className="px-6 py-12 pb-28 text-center">
        <h1 className="text-2xl font-bold text-[#2f2f2f]">Order not found</h1>
        <p className="mt-2 text-sm text-gray-500">This mock order is not in local history.</p>
        <Link to="/orders" className="button mt-6 inline-flex px-5 py-3">
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfb] px-5 py-5 pb-28">
      <Link to="/orders" className="text-sm font-semibold text-[#f4a52c]">
        Back to orders
      </Link>

      <section className="mt-4 rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400">Reference</p>
            <h1 className="mt-1 text-2xl font-bold text-[#2f2f2f]">{order.orderGroupId}</h1>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Confirmed
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
          <div className="rounded-2xl bg-[#fcfcfb] p-4 ring-1 ring-gray-100">
            <p className="text-gray-500">Payment</p>
            <p className="mt-1 font-semibold text-gray-900">{getPaymentLabel(order.paymentMethod)}</p>
          </div>
          <div className="rounded-2xl bg-[#fcfcfb] p-4 ring-1 ring-gray-100">
            <p className="text-gray-500">Placed on</p>
            <p className="mt-1 font-semibold text-gray-900">{order.createdAt.slice(0, 10)}</p>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <h2 className="text-lg font-bold text-[#2f2f2f]">Delivery address</h2>
        <div className="mt-3 text-sm leading-6 text-gray-600">
          <p className="font-semibold text-gray-900">{order.address.recipient}</p>
          <p>{order.address.phone}</p>
          <p>{order.address.line1}</p>
          {order.address.line2 ? <p>{order.address.line2}</p> : null}
          <p>
            {order.address.city}, {order.address.region}, {order.address.country}
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-[1.75rem] bg-[#2f2f2f] p-5 text-white shadow-sm">
        <h2 className="text-lg font-bold">Order totals</h2>
        <div className="mt-4 space-y-2 text-sm text-white/80">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span>{formatMoney(order.subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Shipping</span>
            <span>{formatMoney(order.shipping)}</span>
          </div>
          {order.discount?.amount > 0 && (
            <div className="flex items-center justify-between text-emerald-300">
              <span>Discount{order.coupon?.code ? ` (${order.coupon.code})` : ""}</span>
              <span>-{formatMoney(order.discount)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span>VAT</span>
            <span>{formatMoney(order.vat)}</span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-sm font-semibold text-white/80">Total</span>
          <span className="text-2xl font-extrabold">{formatMoney(order.total)}</span>
        </div>
      </section>
    </div>
  );
};

export default OrderDetailPage;
