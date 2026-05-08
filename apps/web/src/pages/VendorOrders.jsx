import { useMemo, useState } from "react";
import { CheckCircle2, ClipboardList, PackageCheck, Truck, X } from "lucide-react";
import { formatMoney } from "../lib/api";
import { vendorOrders, vendorOrderStatus } from "../features/vendor/vendorMock";
import { useUIStore } from "../stores/uiStore";

const statusFilters = [
  { value: "ALL", label: "All" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

const statusClass = {
  PROCESSING: "bg-[#fff5e6] text-[#8a5a08]",
  SHIPPED: "bg-blue-50 text-blue-700",
  DELIVERED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-rose-50 text-rose-600",
};

const nextStatus = {
  PROCESSING: "SHIPPED",
  SHIPPED: "DELIVERED",
};

const VendorOrdersPage = () => {
  const toast = useUIStore((s) => s.toast);
  const [orders, setOrders] = useState(vendorOrders);
  const [filter, setFilter] = useState("ALL");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [trackingForm, setTrackingForm] = useState({ courier: "", trackingNumber: "" });

  const filteredOrders = useMemo(
    () => (filter === "ALL" ? orders : orders.filter((order) => order.status === filter)),
    [filter, orders]
  );
  const selectedOrder = orders.find((order) => order.id === selectedOrderId);

  const openOrder = (order) => {
    setSelectedOrderId(order.id);
    setTrackingForm({
      courier: order.courier || "Dogget Dispatch",
      trackingNumber: order.trackingNumber || "",
    });
  };

  const updateOrder = (orderId, patch) => {
    setOrders((current) => current.map((order) => (order.id === orderId ? { ...order, ...patch } : order)));
  };

  const addTimeline = (order, label) => [
    ...order.timeline,
    { label, at: new Date().toISOString().slice(0, 16).replace("T", " ") },
  ];

  const acknowledgeOrder = (order) => {
    updateOrder(order.id, {
      timeline: addTimeline(order, "Vendor acknowledged order"),
    });
    toast(`${order.id} acknowledged`, "success");
  };

  const shipOrder = (event) => {
    event.preventDefault();
    if (!selectedOrder) return;

    updateOrder(selectedOrder.id, {
      status: "SHIPPED",
      courier: trackingForm.courier.trim(),
      trackingNumber: trackingForm.trackingNumber.trim(),
      timeline: addTimeline(selectedOrder, `Shipped via ${trackingForm.courier.trim()}`),
    });
    toast(`${selectedOrder.id} marked shipped`, "success");
  };

  const markDelivered = (order) => {
    updateOrder(order.id, {
      status: "DELIVERED",
      timeline: addTimeline(order, "Marked delivered"),
    });
    toast(`${order.id} marked delivered`, "success");
  };

  const cancelOrder = (order) => {
    updateOrder(order.id, {
      status: "CANCELLED",
      timeline: addTimeline(order, "Cancellation requested"),
    });
    toast("Cancellation recorded as a mock admin review item", "info");
  };

  return (
    <div className="px-5 py-5">
      <h2 className="text-2xl font-bold text-[#2f2f2f]">Orders</h2>
      <p className="mt-1 text-sm text-gray-500">Manage fulfillment, tracking, and status updates.</p>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {statusFilters.map((item) => {
          const count = item.value === "ALL" ? orders.length : orders.filter((order) => order.status === item.value).length;
          const isActive = filter === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                isActive ? "bg-[#f4a52c] text-white" : "bg-white text-gray-500 ring-1 ring-gray-100"
              }`}
            >
              {item.label} ({count})
            </button>
          );
        })}
      </div>

      <div className="mt-6 space-y-4">
        {filteredOrders.length > 0 ? filteredOrders.map((order) => (
          <article key={order.id} className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <button type="button" onClick={() => openOrder(order)} className="w-full text-left">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Order</p>
                  <h3 className="mt-1 text-lg font-bold text-[#2f2f2f]">{order.id}</h3>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass[order.status]}`}>
                  {vendorOrderStatus[order.status]}
                </span>
              </div>
              <div className="mt-4 space-y-1 text-sm text-gray-500">
                <p className="font-semibold text-gray-900">{order.buyer}</p>
                <p>{order.address}</p>
                <p>{order.itemCount} item(s) · {formatMoney(order.total)} · {order.placedAt}</p>
              </div>
            </button>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={() => acknowledgeOrder(order)}
                disabled={order.status !== "PROCESSING"}
                className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 px-3 py-3 text-sm font-bold text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <PackageCheck className="h-4 w-4" />
                Acknowledge
              </button>
              <button
                onClick={() => openOrder(order)}
                disabled={!nextStatus[order.status]}
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#f4a52c] px-3 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {order.status === "SHIPPED" ? <CheckCircle2 className="h-4 w-4" /> : <Truck className="h-4 w-4" />}
                {order.status === "SHIPPED" ? "Deliver" : "Ship"}
              </button>
            </div>
          </article>
        )) : (
          <div className="rounded-[1.5rem] bg-white p-6 text-center shadow-sm ring-1 ring-gray-100">
            <p className="font-bold text-[#2f2f2f]">No orders in this status</p>
            <p className="mt-2 text-sm text-gray-500">Change the filter to review another fulfillment queue.</p>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-[70] flex items-end bg-black/35">
          <button className="absolute inset-0 cursor-default" type="button" onClick={() => setSelectedOrderId(null)} aria-label="Close order detail" />
          <section className="relative max-h-[88dvh] w-full overflow-y-auto rounded-t-[2rem] bg-white px-5 pb-8 pt-5 shadow-2xl">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-200" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f4a52c]">Order detail</p>
                <h3 className="mt-1 text-xl font-bold text-[#2f2f2f]">{selectedOrder.id}</h3>
              </div>
              <button onClick={() => setSelectedOrderId(null)} className="rounded-full bg-gray-100 p-2 text-gray-500" type="button">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 rounded-2xl bg-[#fcfcfb] p-4 text-sm leading-6 text-gray-600 ring-1 ring-gray-100">
              <p className="font-bold text-gray-900">{selectedOrder.buyer}</p>
              <p>{selectedOrder.phone}</p>
              <p>{selectedOrder.address}</p>
            </div>

            <section className="mt-5">
              <h4 className="font-bold text-[#2f2f2f]">Items</h4>
              <div className="mt-3 space-y-3">
                {selectedOrder.items.map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-2xl bg-white p-3 ring-1 ring-gray-100">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-[#f4a52c]">{formatMoney(item.price)}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-5">
              <h4 className="font-bold text-[#2f2f2f]">Tracking</h4>
              {selectedOrder.status === "PROCESSING" ? (
                <form onSubmit={shipOrder} className="mt-3 space-y-3">
                  <input
                    value={trackingForm.courier}
                    onChange={(event) => setTrackingForm((current) => ({ ...current, courier: event.target.value }))}
                    placeholder="Courier"
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#f4a52c]"
                    required
                  />
                  <input
                    value={trackingForm.trackingNumber}
                    onChange={(event) => setTrackingForm((current) => ({ ...current, trackingNumber: event.target.value }))}
                    placeholder="Tracking number"
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#f4a52c]"
                    required
                  />
                  <button className="w-full rounded-2xl bg-[#f4a52c] px-4 py-3 text-sm font-bold text-white">
                    Mark as shipped
                  </button>
                </form>
              ) : (
                <div className="mt-3 rounded-2xl bg-[#fcfcfb] p-4 text-sm text-gray-600 ring-1 ring-gray-100">
                  <p><span className="font-semibold text-gray-900">Courier:</span> {selectedOrder.courier || "Not assigned"}</p>
                  <p><span className="font-semibold text-gray-900">Tracking:</span> {selectedOrder.trackingNumber || "Not available"}</p>
                </div>
              )}
            </section>

            <section className="mt-5">
              <h4 className="font-bold text-[#2f2f2f]">Timeline</h4>
              <div className="mt-3 space-y-3">
                {selectedOrder.timeline.map((event) => (
                  <div key={`${event.label}-${event.at}`} className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#f4a52c]" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{event.label}</p>
                      <p className="text-xs text-gray-400">{event.at}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {selectedOrder.status === "SHIPPED" ? (
                <button
                  onClick={() => markDelivered(selectedOrder)}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#f4a52c] px-3 py-3 text-sm font-bold text-white"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Mark delivered
                </button>
              ) : (
                <button
                  onClick={() => acknowledgeOrder(selectedOrder)}
                  disabled={selectedOrder.status !== "PROCESSING"}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#f4a52c] px-3 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ClipboardList className="h-4 w-4" />
                  Acknowledge
                </button>
              )}
              <button
                onClick={() => cancelOrder(selectedOrder)}
                disabled={selectedOrder.status === "DELIVERED" || selectedOrder.status === "CANCELLED"}
                className="rounded-2xl border border-rose-100 bg-rose-50 px-3 py-3 text-sm font-bold text-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Cancel / refund
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default VendorOrdersPage;
