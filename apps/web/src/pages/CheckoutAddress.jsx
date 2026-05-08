import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import countryList from "react-select-country-list";
import PhoneInput from "react-phone-number-input/input";
import { getCountryCallingCode, isSupportedCountry } from "react-phone-number-input";
import CheckoutStepHeader from "../features/checkout/CheckoutStepHeader";
import { useCartStore } from "../stores/cartStore";
import { useCheckoutStore } from "../stores/checkoutStore";

const REGIONS = [
  "Greater Accra",
  "Ashanti",
  "Central",
  "Eastern",
  "Northern",
  "Western",
];

const toFlag = (countryCode) =>
  countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt()));

const CheckoutAddressPage = () => {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const address = useCheckoutStore((s) => s.address);
  const setAddress = useCheckoutStore((s) => s.setAddress);
  const [form, setForm] = useState(address);
  const countryOptions = useMemo(
    () =>
      countryList()
        .getData()
        .filter((option) => isSupportedCountry(option.value))
        .map((option) => ({
          ...option,
          flag: toFlag(option.value),
          dialCode: `+${getCountryCallingCode(option.value)}`,
        })),
    []
  );
  if (items.length === 0) {
    return (
      <div className="px-6 py-12 pb-28 text-center">
        <h1 className="text-2xl font-bold text-[#2f2f2f]">No items to check out</h1>
        <p className="mt-2 text-sm text-gray-500">Build a cart first, then continue to address and payment.</p>
        <Link to="/shop" className="button mt-6 inline-flex px-5 py-3">
          Back to shop
        </Link>
      </div>
    );
  }

  const updateField = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const updateCountry = (countryCode) => {
    const selected = countryOptions.find((option) => option.value === countryCode);
    setForm((current) => ({
      ...current,
      countryCode,
      country: selected?.label ?? current.country,
    }));
  };

  const submit = (e) => {
    e.preventDefault();
    setAddress(form);
    navigate("/checkout/shipping");
  };

  return (
    <div className="bg-[#fcfcfb] px-5 py-5 pb-28">
      <CheckoutStepHeader
        currentStep={1}
        title="Shipping address"
        description="Tell us where to send your order."
      />

      <form onSubmit={submit} className="mt-6 space-y-4">
        {[
          ["recipient", "Recipient name"],
          ["line1", "Street address"],
          ["line2", "Apartment, landmark (optional)"],
          ["city", "City / town"],
        ].map(([field, label]) => (
          <label key={field} className="block">
            <span className="mb-2 block text-sm font-semibold text-gray-700">{label}</span>
            <input
              required={field !== "line2"}
              value={form[field]}
              onChange={(e) => updateField(field, e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#f4a52c]"
            />
          </label>
        ))}

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-gray-700">Phone number</span>
          <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 focus-within:border-[#f4a52c]">
            <div className="relative shrink-0">
              <select
                value={form.countryCode || "GH"}
                onChange={(e) => updateCountry(e.target.value)}
                className="appearance-none rounded-full bg-[#fff5e6] py-1 pl-3 pr-8 text-sm font-semibold text-[#8a5a08] outline-none"
              >
                {countryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.flag} {option.dialCode}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a5a08]" />
            </div>
            <PhoneInput
              country={form.countryCode || "GH"}
              international={false}
              value={form.phone}
              onChange={(value) => updateField("phone", value ?? "")}
              className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-gray-700">Region</span>
          <select
            value={form.region}
            onChange={(e) => updateField("region", e.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#f4a52c]"
          >
            {REGIONS.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-gray-700">Country</span>
          <div className="relative">
            <select
              value={form.countryCode || "GH"}
              onChange={(e) => updateCountry(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm text-gray-800 outline-none focus:border-[#f4a52c]"
            >
              {countryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.flag} {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </label>

        <button className="w-full rounded-2xl bg-[#f4a52c] px-4 py-3 text-sm font-bold text-white">
          Continue to shipping
        </button>
      </form>
    </div>
  );
};

export default CheckoutAddressPage;
