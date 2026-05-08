import { Link, NavLink, Outlet } from "react-router-dom";
import { Clock3, ShieldAlert } from "lucide-react";
import { useAuthStore } from "../stores/authStore";

const vendorTabs = [
  { to: "/vendor", label: "Overview", end: true },
  { to: "/vendor/products", label: "Products" },
  { to: "/vendor/orders", label: "Orders" },
  { to: "/vendor/coupons", label: "Coupons" },
  { to: "/vendor/payouts", label: "Payouts" },
  { to: "/vendor/settings", label: "Settings" },
];

const getMockVendorAccess = () => {
  if (!import.meta.env.DEV) return null;
  return localStorage.getItem("dogget.mockVendorAccess") || "APPROVED";
};

const VendorAccessState = ({ type }) => {
  const pending = type === "PENDING";
  const Icon = pending ? Clock3 : ShieldAlert;

  return (
    <div className="flex min-h-[70svh] items-center justify-center bg-[#fcfcfb] px-5 py-10">
      <section className="rounded-[2rem] bg-white p-6 text-center shadow-sm ring-1 ring-gray-100">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff5e6] text-[#f4a52c]">
          <Icon className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-[#2f2f2f]">
          {pending ? "Vendor application under review" : "Vendor access required"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-500">
          {pending
            ? "Dogget is still reviewing your business verification, payout account, and product compliance before enabling the seller workspace."
            : "This workspace is only available to approved vendors. Customers can apply to become a vendor first."}
        </p>
        <Link to="/vendor/apply" className="button mt-6 inline-flex px-5 py-3">
          {pending ? "Review application" : "Apply to sell"}
        </Link>
      </section>
    </div>
  );
};

const VendorLayout = () => {
  const me = useAuthStore((s) => s.me);
  const initializing = useAuthStore((s) => s.initializing);
  const sessionLoading = useAuthStore((s) => s.sessionLoading);
  const mockVendorAccess = getMockVendorAccess();
  const role = me?.role;
  const vendorStatus = me?.vendorStatus || mockVendorAccess;
  const hasVendorRole =
    role === "VENDOR" ||
    role === "ADMIN" ||
    mockVendorAccess === "APPROVED" ||
    mockVendorAccess === "PENDING";

  if (initializing || sessionLoading) {
    return (
      <div className="flex min-h-[70svh] items-center justify-center bg-[#fcfcfb] px-5 text-sm font-semibold text-gray-500">
        Checking vendor access...
      </div>
    );
  }

  if (!hasVendorRole) {
    return <VendorAccessState type="BLOCKED" />;
  }

  if (vendorStatus === "PENDING") {
    return <VendorAccessState type="PENDING" />;
  }

  return (
  <div className="bg-[#fcfcfb] pb-28">
    <div className="sticky top-0 z-20 border-b border-gray-100 bg-white/95 px-5 py-4 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f4a52c]">Vendor</p>
          <h1 className="text-2xl font-bold text-[#2f2f2f]">Seller workspace</h1>
        </div>
        <NavLink to="/vendors/dogget-official" className="rounded-full bg-[#fff5e6] px-3 py-2 text-xs font-bold text-[#8a5a08]">
          Storefront
        </NavLink>
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {vendorTabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                isActive ? "bg-[#f4a52c] text-white" : "bg-gray-100 text-gray-500"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </div>
    <Outlet />
  </div>
  );
};

export default VendorLayout;
