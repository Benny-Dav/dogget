import { Link } from "react-router-dom";
import { getPaymentLabel } from "../features/checkout/paymentOptions";
import { formatMoney } from "../lib/api";
import { useCheckoutStore } from "../stores/checkoutStore";

const OrdersPage = () => {
  const orders = useCheckoutStore((s) => s.orders);

  if (orders.length === 0) {
    return (
      <div className="px-6 py-12 pb-28 text-center">
        <h1 className="text-2xl font-bold text-[#2f2f2f]">No orders yet</h1>
        <p className="mt-2 text-sm text-gray-500">
          Complete a mock checkout and your order history will appear here.
        </p>
        <Link to="/shop" className="button mt-6 inline-flex px-5 py-3">
          Browse catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfb] px-5 py-5 pb-28">
      <h1 className="text-2xl font-bold text-[#2f2f2f]">Orders</h1>
      <p className="mt-1 text-sm text-gray-500">
        Mock order history from the staged checkout flow.
      </p>

      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="block rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">Order reference</p>
                <h2 className="mt-1 text-lg font-bold text-[#2f2f2f]">{order.orderGroupId}</h2>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Confirmed
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <span>{getPaymentLabel(order.paymentMethod)}</span>
              <span>{order.createdAt.slice(0, 10)}</span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="text-sm font-medium text-gray-500">Total</span>
              <span className="text-xl font-extrabold text-[#f4a52c]">{formatMoney(order.total)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
