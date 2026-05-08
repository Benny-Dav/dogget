import { useState } from "react";
import { Building2, CircleAlert, CreditCard, ShieldCheck, Truck } from "lucide-react";
import { useUIStore } from "../stores/uiStore";

const inputClass =
  "w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#f4a52c]";
const labelClass = "mb-2 block text-sm font-semibold text-gray-700";

const verificationItems = [
  {
    label: "Business identity",
    status: "Verified",
    icon: <ShieldCheck className="h-5 w-5 text-emerald-300" />,
  },
  {
    label: "Payout account",
    status: "Pending review",
    icon: <CreditCard className="h-5 w-5 text-[#f4a52c]" />,
  },
  {
    label: "Product compliance",
    status: "No issues",
    icon: <ShieldCheck className="h-5 w-5 text-emerald-300" />,
  },
];

const VendorSettingsPage = () => {
  const toast = useUIStore((s) => s.toast);
  const [settings, setSettings] = useState({
    storeName: "Dogget Official",
    region: "Greater Accra",
    supportEmail: "vendors@dogget.test",
    supportPhone: "+233 24 000 0000",
    displayCurrency: "GHS",
    shippingRule: "FLAT",
    flatRate: "12.00",
    freeOver: "250.00",
    accraRate: "12.00",
    outsideAccraRate: "22.00",
    payoutType: "Mobile Money",
    payoutAccountName: "Dogget Official",
    payoutAccountNumber: "+233 24 000 0000",
    returnPolicy: "No returns after delivery unless the item arrives damaged or does not match the listing.",
  });

  const update = (key, value) => setSettings((current) => ({ ...current, [key]: value }));
  const shippingByRegion = settings.shippingRule === "BY_REGION";
  const freeOverThreshold = settings.shippingRule === "FREE_OVER_THRESHOLD";

  return (
    <div className="px-5 py-5">
      <h2 className="text-2xl font-bold text-[#2f2f2f]">Settings</h2>
      <p className="mt-1 text-sm text-gray-500">Store profile, verification, shipping, payouts, and policies.</p>

      <section className="mt-6 rounded-[1.75rem] bg-[#2f2f2f] p-5 text-white shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">Account status</p>
            <h3 className="mt-1 text-xl font-bold">Vendor under review</h3>
          </div>
          <span className="rounded-full bg-[#fff5e6] px-3 py-1 text-xs font-bold text-[#8a5a08]">
            Pending payout check
          </span>
        </div>
        <div className="mt-5 space-y-3">
          {verificationItems.map(({ label, status, icon }) => (
            <div key={label} className="flex items-center justify-between rounded-2xl bg-white/8 px-4 py-3">
              <div className="flex items-center gap-3">
                {icon}
                <span className="text-sm font-semibold">{label}</span>
              </div>
              <span className="text-xs font-bold text-white/70">{status}</span>
            </div>
          ))}
        </div>
      </section>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          toast("Vendor settings saved in mock mode", "success");
        }}
        className="mt-6 space-y-5"
      >
        <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff5e6] text-[#f4a52c]">
              <Building2 className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-bold text-[#2f2f2f]">Store profile</h3>
              <p className="text-xs text-gray-500">Customer-facing name and internal support contact.</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className={labelClass}>Store name</span>
              <input value={settings.storeName} onChange={(event) => update("storeName", event.target.value)} className={inputClass} required />
            </label>
            <label className="block">
              <span className={labelClass}>Operating region</span>
              <select value={settings.region} onChange={(event) => update("region", event.target.value)} className={inputClass}>
                <option>Greater Accra</option>
                <option>Ashanti</option>
                <option>Central</option>
                <option>Eastern</option>
                <option>Western</option>
              </select>
            </label>
            <div className="grid grid-cols-1 gap-4">
              <label className="block">
                <span className={labelClass}>Internal support email</span>
                <input type="email" value={settings.supportEmail} onChange={(event) => update("supportEmail", event.target.value)} className={inputClass} required />
              </label>
              <label className="block">
                <span className={labelClass}>Internal support phone</span>
                <input value={settings.supportPhone} onChange={(event) => update("supportPhone", event.target.value)} className={inputClass} required />
              </label>
            </div>
          </div>
        </section>

        <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff5e6] text-[#f4a52c]">
              <Truck className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-bold text-[#2f2f2f]">Shipping rules</h3>
              <p className="text-xs text-gray-500">Mock rules used by the checkout preview.</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className={labelClass}>Shipping rule</span>
              <select value={settings.shippingRule} onChange={(event) => update("shippingRule", event.target.value)} className={inputClass}>
                <option value="FLAT">Flat rate</option>
                <option value="BY_REGION">By region</option>
                <option value="FREE_OVER_THRESHOLD">Free over threshold</option>
              </select>
            </label>

            {shippingByRegion ? (
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className={labelClass}>Accra rate</span>
                  <input value={settings.accraRate} onChange={(event) => update("accraRate", event.target.value)} className={inputClass} required />
                </label>
                <label className="block">
                  <span className={labelClass}>Other regions</span>
                  <input value={settings.outsideAccraRate} onChange={(event) => update("outsideAccraRate", event.target.value)} className={inputClass} required />
                </label>
              </div>
            ) : (
              <label className="block">
                <span className={labelClass}>Flat shipping rate</span>
                <input value={settings.flatRate} onChange={(event) => update("flatRate", event.target.value)} className={inputClass} required />
              </label>
            )}

            {freeOverThreshold && (
              <label className="block">
                <span className={labelClass}>Free shipping threshold</span>
                <input value={settings.freeOver} onChange={(event) => update("freeOver", event.target.value)} className={inputClass} required />
              </label>
            )}
          </div>
        </section>

        <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff5e6] text-[#f4a52c]">
              <CreditCard className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-bold text-[#2f2f2f]">Payout account</h3>
              <p className="text-xs text-gray-500">Payout changes stay pending until Dogget verifies them.</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className={labelClass}>Payout type</span>
              <select value={settings.payoutType} onChange={(event) => update("payoutType", event.target.value)} className={inputClass}>
                <option>Mobile Money</option>
                <option>Bank Account</option>
              </select>
            </label>
            <label className="block">
              <span className={labelClass}>Account name</span>
              <input value={settings.payoutAccountName} onChange={(event) => update("payoutAccountName", event.target.value)} className={inputClass} required />
            </label>
            <label className="block">
              <span className={labelClass}>Account or wallet number</span>
              <input value={settings.payoutAccountNumber} onChange={(event) => update("payoutAccountNumber", event.target.value)} className={inputClass} required />
            </label>
          </div>
        </section>

        <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff5e6] text-[#f4a52c]">
              <CircleAlert className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-bold text-[#2f2f2f]">Returns policy</h3>
              <p className="text-xs text-gray-500">Shown to Dogget operations during disputes.</p>
            </div>
          </div>
          <label className="block">
            <span className={labelClass}>Policy text</span>
            <textarea
              rows={5}
              value={settings.returnPolicy}
              onChange={(event) => update("returnPolicy", event.target.value)}
              className={inputClass}
              required
            />
          </label>
        </section>

        <button className="w-full rounded-2xl bg-[#f4a52c] px-4 py-4 text-sm font-bold text-white shadow-lg shadow-[#f4a52c]/25">
          Save settings
        </button>
      </form>
    </div>
  );
};

export default VendorSettingsPage;
