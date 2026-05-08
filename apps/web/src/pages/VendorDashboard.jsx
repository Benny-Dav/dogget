import { Link } from "react-router-dom";
import { formatMoney } from "../lib/api";
import { useVendorProducts } from "../lib/api/hooks";
import { vendorOrders } from "../features/vendor/vendorMock";

const addMoney = (items) => ({
  amount: items.reduce((sum, item) => sum + item.amount, 0),
  currency: items[0]?.currency ?? "GHS",
});

const daysBetween = (date, baseline) => {
  const dayMs = 24 * 60 * 60 * 1000;
  return Math.floor((baseline - date) / dayMs);
};

const VendorDashboardPage = () => {
  const { data: products = [] } = useVendorProducts("dogget-official");
  const lowStock = products.filter((product) => product.stockCount > 0 && product.stockCount <= 12).length;
  const pendingOrders = vendorOrders.filter((order) => order.status === "PROCESSING").length;
  const latestOrderDate = new Date(
    Math.max(...vendorOrders.map((order) => new Date(order.placedAt).getTime()))
  );
  const ordersToday = vendorOrders.filter((order) => daysBetween(new Date(order.placedAt), latestOrderDate) === 0).length;
  const ordersSevenDays = vendorOrders.filter((order) => daysBetween(new Date(order.placedAt), latestOrderDate) <= 7).length;
  const gmvThirtyDays = addMoney(
    vendorOrders
      .filter((order) => order.status !== "CANCELLED" && daysBetween(new Date(order.placedAt), latestOrderDate) <= 30)
      .map((order) => order.total)
  );

  const metrics = [
    { label: "Today orders", value: ordersToday },
    { label: "7d orders", value: ordersSevenDays },
    { label: "30d GMV", value: formatMoney(gmvThirtyDays) },
    { label: "Pending orders", value: pendingOrders },
    { label: "Low stock", value: lowStock },
  ];

  return (
    <div className="px-5 py-5">
      <section className="rounded-[1.75rem] bg-[#2f2f2f] p-5 text-white">
        <p className="text-sm font-semibold text-white/60">Dogget Official</p>
        <h2 className="mt-2 text-2xl font-bold">Vendor overview</h2>
        <p className="mt-2 text-sm leading-6 text-white/70">
          Mock operating view for orders, inventory, and payout readiness.
        </p>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{metric.label}</p>
            <p className="mt-2 text-[1.45rem] font-extrabold leading-tight text-[#2f2f2f]">{metric.value}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-[#2f2f2f]">Recent orders</h2>
          <Link to="/vendor/orders" className="text-sm font-bold text-[#f4a52c]">View all</Link>
        </div>
        <div className="mt-4 space-y-3">
          {vendorOrders.slice(0, 2).map((order) => (
            <div key={order.id} className="rounded-2xl bg-[#fcfcfb] p-4 ring-1 ring-gray-100">
              <div className="flex items-center justify-between">
                <p className="font-bold text-gray-900">{order.id}</p>
                <span className="rounded-full bg-[#fff5e6] px-3 py-1 text-xs font-bold text-[#8a5a08]">{order.status}</span>
              </div>
              <p className="mt-1 text-sm text-gray-500">{order.buyer} · {formatMoney(order.total)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default VendorDashboardPage;
