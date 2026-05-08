import { useState } from "react";
import { Pause, Percent, Plus, Tag, X } from "lucide-react";
import { formatMoney, money } from "../lib/api";
import { vendorCoupons } from "../features/vendor/vendorMock";
import { useUIStore } from "../stores/uiStore";

const emptyCoupon = {
  code: "",
  name: "",
  type: "PERCENT",
  value: "",
  minSubtotal: "",
  usageLimit: "",
  startsAt: "",
  endsAt: "",
  status: "ACTIVE",
};

const VendorCouponsPage = () => {
  const toast = useUIStore((s) => s.toast);
  const [coupons, setCoupons] = useState(vendorCoupons);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState(emptyCoupon);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const saveCoupon = (event) => {
    event.preventDefault();
    const code = form.code.trim().toUpperCase();
    const value = Number(form.value);
    const minSubtotal = Number(form.minSubtotal || 0);
    const usageLimit = form.usageLimit ? Number(form.usageLimit) : null;

    if (coupons.some((coupon) => coupon.code === code)) {
      toast("Coupon code already exists", "error");
      return;
    }

    if (!code || !form.name.trim() || Number.isNaN(value) || value <= 0) {
      toast("Complete the coupon details", "error");
      return;
    }

    if (form.type === "PERCENT" && value > 100) {
      toast("Percentage discounts cannot exceed 100%", "error");
      return;
    }

    if (form.endsAt && form.startsAt && form.endsAt < form.startsAt) {
      toast("End date must be after the start date", "error");
      return;
    }

    const nextCoupon = {
      id: `coupon_${Date.now()}`,
      code,
      name: form.name.trim(),
      type: form.type,
      value,
      minSubtotal: money(minSubtotal, "GHS"),
      usageLimit,
      usedCount: 0,
      status: form.status,
      startsAt: form.startsAt,
      endsAt: form.endsAt,
    };

    setCoupons((current) => [nextCoupon, ...current]);
    setForm(emptyCoupon);
    setDrawerOpen(false);
    toast("Discount code created in mock mode", "success");
  };

  const toggleStatus = (couponId) => {
    const coupon = coupons.find((item) => item.id === couponId);
    setCoupons((current) =>
      current.map((coupon) =>
        coupon.id === couponId
          ? { ...coupon, status: coupon.status === "ACTIVE" ? "PAUSED" : "ACTIVE" }
        : coupon
      )
    );
    toast(`${coupon?.code ?? "Coupon"} ${coupon?.status === "ACTIVE" ? "paused" : "resumed"}`, "success");
  };

  return (
    <div className="px-5 py-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#2f2f2f]">Coupons</h2>
          <p className="mt-1 text-sm text-gray-500">Create vendor-funded discounts for checkout.</p>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f4a52c] text-white shadow-lg shadow-[#f4a52c]/25"
          aria-label="Add coupon"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {coupons.length > 0 ? coupons.map((coupon) => (
          <article key={coupon.id} className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff5e6] text-[#f4a52c]">
                    {coupon.type === "PERCENT" ? <Percent className="h-4 w-4" /> : <Tag className="h-4 w-4" />}
                  </span>
                  <div>
                    <h3 className="font-bold text-[#2f2f2f]">{coupon.code}</h3>
                    <p className="text-xs text-gray-500">{coupon.name}</p>
                  </div>
                </div>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  coupon.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                }`}
              >
                {coupon.status}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl bg-[#fcfcfb] px-2 py-3 ring-1 ring-gray-100">
                <p className="text-sm font-bold text-[#2f2f2f]">
                  {coupon.type === "PERCENT" ? `${coupon.value}%` : formatMoney(money(coupon.value, "GHS"))}
                </p>
                <p className="text-[11px] font-semibold text-gray-400">Discount</p>
              </div>
              <div className="rounded-2xl bg-[#fcfcfb] px-2 py-3 ring-1 ring-gray-100">
                <p className="text-sm font-bold text-[#2f2f2f]">{formatMoney(coupon.minSubtotal)}</p>
                <p className="text-[11px] font-semibold text-gray-400">Min order</p>
              </div>
              <div className="rounded-2xl bg-[#fcfcfb] px-2 py-3 ring-1 ring-gray-100">
                <p className="text-sm font-bold text-[#2f2f2f]">
                  {coupon.usageLimit == null ? coupon.usedCount : `${coupon.usedCount}/${coupon.usageLimit}`}
                </p>
                <p className="text-[11px] font-semibold text-gray-400">Uses</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
              <span>{coupon.startsAt || "No start"} - {coupon.endsAt || "No end"}</span>
              <button
                onClick={() => toggleStatus(coupon.id)}
                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-2 font-bold text-gray-600"
              >
                <Pause className="h-3.5 w-3.5" />
                {coupon.status === "ACTIVE" ? "Pause" : "Resume"}
              </button>
            </div>
          </article>
        )) : (
          <div className="rounded-[1.5rem] bg-white p-6 text-center shadow-sm ring-1 ring-gray-100">
            <p className="font-bold text-[#2f2f2f]">No vendor coupons yet</p>
            <p className="mt-2 text-sm leading-6 text-gray-500">Create a code to test vendor-funded checkout discounts.</p>
          </div>
        )}
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-[70] flex items-end bg-black/35">
          <button className="absolute inset-0 cursor-default" type="button" onClick={() => setDrawerOpen(false)} aria-label="Close coupon editor" />
          <section className="relative max-h-[88dvh] w-full overflow-y-auto rounded-t-[2rem] bg-white px-5 pb-8 pt-5 shadow-2xl">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-200" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f4a52c]">New coupon</p>
                <h3 className="mt-1 text-xl font-bold text-[#2f2f2f]">Create discount code</h3>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="rounded-full bg-gray-100 p-2 text-gray-500" type="button">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={saveCoupon} className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">Code</span>
                <input
                  value={form.code}
                  onChange={(event) => update("code", event.target.value)}
                  placeholder="NEWPUP10"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm uppercase text-gray-800 outline-none focus:border-[#f4a52c]"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">Campaign name</span>
                <input
                  value={form.name}
                  onChange={(event) => update("name", event.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#f4a52c]"
                  required
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-gray-700">Discount type</span>
                  <select
                    value={form.type}
                    onChange={(event) => update("type", event.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#f4a52c]"
                  >
                    <option value="PERCENT">Percentage</option>
                    <option value="FIXED">Fixed amount</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-gray-700">Value</span>
                  <input
                    type="number"
                    min="1"
                    step={form.type === "PERCENT" ? "1" : "0.01"}
                    value={form.value}
                    onChange={(event) => update("value", event.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#f4a52c]"
                    required
                  />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-gray-700">Min order (GHS)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.minSubtotal}
                    onChange={(event) => update("minSubtotal", event.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#f4a52c]"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-gray-700">Usage limit</span>
                  <input
                    type="number"
                    min="1"
                    value={form.usageLimit}
                    onChange={(event) => update("usageLimit", event.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#f4a52c]"
                  />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-gray-700">Starts</span>
                  <input
                    type="date"
                    value={form.startsAt}
                    onChange={(event) => update("startsAt", event.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#f4a52c]"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-gray-700">Ends</span>
                  <input
                    type="date"
                    value={form.endsAt}
                    onChange={(event) => update("endsAt", event.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#f4a52c]"
                  />
                </label>
              </div>
              <button className="w-full rounded-2xl bg-[#f4a52c] px-4 py-4 text-sm font-bold text-white shadow-lg shadow-[#f4a52c]/25">
                Create coupon
              </button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};

export default VendorCouponsPage;
