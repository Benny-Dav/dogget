import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../lib/api/hooks";
import { useUIStore } from "../stores/uiStore";

const regions = [
  "Greater Accra",
  "Ashanti",
  "Central",
  "Eastern",
  "Western",
  "Western North",
  "Volta",
  "Oti",
  "Northern",
  "Savannah",
  "North East",
  "Upper East",
  "Upper West",
  "Bono",
  "Bono East",
  "Ahafo",
];

const steps = [
  { title: "Store", label: "Store and owner" },
  { title: "Proof", label: "Business verification" },
  { title: "Contact", label: "Contact and fulfillment" },
  { title: "Payout", label: "Products and payout" },
  { title: "Review", label: "Final consent" },
];

const VendorApplyPage = () => {
  const toast = useUIStore((s) => s.toast);
  const navigate = useNavigate();
  const { data: productCategories = [], isLoading: categoriesLoading } = useCategories();
  const formRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    storeName: "",
    legalBusinessName: "",
    ownerName: "",
    ownerIdType: "Ghana Card",
    ownerIdFile: null,
    ownerIdFileName: "",
    businessCertificateNumber: "",
    certificateFile: null,
    certificateFileName: "",
    email: "",
    phone: "",
    whatsapp: "",
    region: "Greater Accra",
    operatingAddress: "",
    categories: [],
    payoutType: "Mobile Money",
    payoutAccountName: "",
    payoutAccountNumber: "",
    consent: false,
  });

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const toggleCategory = (categorySlug) =>
    setForm((current) => ({
      ...current,
      categories: current.categories.includes(categorySlug)
        ? current.categories.filter((item) => item !== categorySlug)
        : [...current.categories, categorySlug],
    }));

  const inputClass =
    "w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#f4a52c] focus:ring-2 focus:ring-[#f4a52c]/15";
  const labelClass = "mb-2 block text-sm font-semibold text-gray-800";
  const helperClass = "mt-1 text-xs leading-5 text-gray-500";
  const isLastStep = activeStep === steps.length - 1;
  const stepProgress = `${activeStep + 1} of ${steps.length}`;
  const canSubmit = form.categories.length > 0 && form.consent;
  const selectedCategoryNames = form.categories
    .map((slug) => productCategories.find((category) => category.slug === slug)?.name ?? slug)
    .join(", ");

  useEffect(() => {
    if (!submitted) return undefined;

    const timer = window.setTimeout(() => navigate("/home"), 2500);
    return () => window.clearTimeout(timer);
  }, [navigate, submitted]);

  const goNext = () => {
    if (!formRef.current?.reportValidity()) return;

    if (activeStep === 3 && form.categories.length === 0) {
      toast("Select at least one product category", "error");
      return;
    }

    setActiveStep((current) => Math.min(current + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setActiveStep((current) => Math.max(current - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) {
    return (
      <div className="flex min-h-svh flex-col justify-center bg-[#fcfcfb] px-5 py-8 pb-28">
        <section className="rounded-[2rem] border border-gray-100 bg-white p-6 text-center shadow-lg shadow-black/10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff7e8] text-[#f4a52c]">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[#8a560b]">Application received</p>
          <h1 className="mt-2 text-2xl font-bold text-[#2f2f2f]">Your vendor application is under review</h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Dogget will verify your identity, business proof, and payout details before activating your store.
          </p>
          <div className="mt-5 rounded-2xl bg-[#fcfcfb] p-4 text-left text-sm text-gray-600">
            <p className="font-bold text-[#2f2f2f]">{form.storeName}</p>
            <p className="mt-1">Expected next step: approval review and vendor dashboard access.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="mt-6 w-full rounded-2xl bg-[#f4a52c] px-4 py-4 text-sm font-bold text-white shadow-lg shadow-[#f4a52c]/25"
          >
            Go to homepage
          </button>
          <p className="mt-3 text-xs font-semibold text-gray-400">Redirecting to homepage...</p>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfb] px-5 py-5 pb-28">
      <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white text-[#2f2f2f] shadow-lg shadow-black/10">
        <div className="border-b border-gray-100 bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff7e8] text-[#f4a52c]">
              <Store className="h-6 w-6" />
            </div>
            <span className="rounded-full bg-[#fff7e8] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#8a560b]">
              Vendor review
            </span>
          </div>
          <h1 className="mt-5 text-2xl font-bold">Apply to sell on Dogget</h1>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Complete verification so Dogget can confirm ownership, business legitimacy, and payout details before approving a store.
          </p>
        </div>
        <div className="bg-white p-3 text-[#2f2f2f]">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a560b]">Step {stepProgress}</p>
            <p className="text-xs font-semibold text-gray-500">{steps[activeStep].label}</p>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {steps.map((step, index) => (
              <button
                key={step.title}
                type="button"
                onClick={() => {
                  if (index <= activeStep) setActiveStep(index);
                }}
                className={`rounded-2xl px-2 py-3 text-center transition ${
                  index <= activeStep ? "bg-[#fff7e8] text-[#8a560b]" : "bg-gray-50 text-gray-400"
                }`}
                aria-current={index === activeStep ? "step" : undefined}
              >
                <span
                  className={`mx-auto flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    index <= activeStep ? "bg-[#f4a52c] text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {index + 1}
                </span>
                <p className="mt-1 text-[10px] font-bold">{step.title}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <form
        ref={formRef}
        onSubmit={(event) => {
          event.preventDefault();
          if (!canSubmit) {
            toast("Complete the final review before submitting", "error");
            return;
          }
          setSubmitted(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="mt-6 space-y-5"
      >
        {activeStep === 0 && <section className="rounded-[1.75rem] border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#2f2f2f]">Store and owner</h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            The store name can be customer-facing. Owner details are used internally for verification.
          </p>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className={labelClass}>Store name</span>
              <input
                value={form.storeName}
                onChange={(event) => update("storeName", event.target.value)}
                className={inputClass}
                autoComplete="organization"
                required
              />
            </label>

            <label className="block">
              <span className={labelClass}>Registered business name</span>
              <input
                value={form.legalBusinessName}
                onChange={(event) => update("legalBusinessName", event.target.value)}
                className={inputClass}
                autoComplete="organization"
                required
              />
            </label>

            <label className="block">
              <span className={labelClass}>Business owner full name</span>
              <input
                value={form.ownerName}
                onChange={(event) => update("ownerName", event.target.value)}
                className={inputClass}
                autoComplete="name"
                required
              />
            </label>

            <div className="grid grid-cols-[1fr_1.25fr] gap-3">
              <label className="block">
                <span className={labelClass}>ID type</span>
                <select
                  value={form.ownerIdType}
                  onChange={(event) => update("ownerIdType", event.target.value)}
                  className={inputClass}
                  required
                >
                  <option>Ghana Card</option>
                  <option>Passport</option>
                  <option>Driver's License</option>
                  <option>Voter ID</option>
                </select>
              </label>
              <label className="block">
                <span className={labelClass}>Owner ID document</span>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null;
                    setForm((current) => ({
                      ...current,
                      ownerIdFile: file,
                      ownerIdFileName: file?.name || current.ownerIdFileName,
                    }));
                  }}
                  className="w-full rounded-2xl border border-dashed border-gray-300 bg-white px-3 py-3 text-xs text-gray-700 file:mr-2 file:rounded-full file:border-0 file:bg-[#2f2f2f] file:px-3 file:py-2 file:text-[11px] file:font-bold file:text-white"
                  required={!form.ownerIdFileName}
                />
                {form.ownerIdFileName && (
                  <span className={helperClass}>Selected: {form.ownerIdFileName}</span>
                )}
              </label>
            </div>
          </div>
        </section>}

        {activeStep === 1 && <section className="rounded-[1.75rem] border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#2f2f2f]">Business verification</h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Upload official proof such as a business registration certificate, license, certification, or permit.
          </p>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className={labelClass}>Certificate, license, or registration number</span>
              <input
                value={form.businessCertificateNumber}
                onChange={(event) => update("businessCertificateNumber", event.target.value)}
                className={inputClass}
                required
              />
            </label>

            <label className="block">
              <span className={labelClass}>Business certificate, proof, or license</span>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(event) => {
                  const file = event.target.files?.[0] || null;
                  setForm((current) => ({
                    ...current,
                    certificateFile: file,
                    certificateFileName: file?.name || current.certificateFileName,
                  }));
                }}
                className="w-full rounded-2xl border border-dashed border-[#f4a52c]/50 bg-[#fff9ef] px-4 py-4 text-sm text-gray-700 file:mr-3 file:rounded-full file:border-0 file:bg-[#f4a52c] file:px-4 file:py-2 file:text-xs file:font-bold file:text-white"
                required={!form.certificateFileName}
              />
              <span className={helperClass}>
                {form.certificateFileName
                  ? `Selected: ${form.certificateFileName}`
                  : "Accepted formats: PDF, JPG, or PNG. This is required before a vendor account can be approved."}
              </span>
            </label>
          </div>
        </section>}

        {activeStep === 2 && <section className="rounded-[1.75rem] border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#2f2f2f]">Contact and fulfillment</h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            These details help Dogget contact the vendor and verify pickup or delivery coverage.
          </p>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className={labelClass}>Business email</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
                className={inputClass}
                autoComplete="email"
                required
              />
            </label>

            <label className="block">
              <span className={labelClass}>Business phone</span>
              <input
                type="tel"
                value={form.phone}
                onChange={(event) => update("phone", event.target.value)}
                className={inputClass}
                autoComplete="tel"
                required
              />
            </label>

            <label className="block">
              <span className={labelClass}>WhatsApp number</span>
              <input
                type="tel"
                value={form.whatsapp}
                onChange={(event) => update("whatsapp", event.target.value)}
                className={inputClass}
                autoComplete="tel"
              />
              <span className={helperClass}>Internal operations contact only. Customer contact stays inside Dogget.</span>
            </label>

            <label className="block">
              <span className={labelClass}>Operating region</span>
              <select
                value={form.region}
                onChange={(event) => update("region", event.target.value)}
                className={inputClass}
                required
              >
                {regions.map((region) => (
                  <option key={region}>{region}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className={labelClass}>Pickup or business operating address</span>
              <textarea
                value={form.operatingAddress}
                onChange={(event) => update("operatingAddress", event.target.value)}
                rows={3}
                className={inputClass}
                autoComplete="street-address"
                required
              />
            </label>
          </div>
        </section>}

        {activeStep === 3 && <section className="rounded-[1.75rem] border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#2f2f2f]">Products and payout</h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Select planned categories and the payout account Dogget should verify before activation.
          </p>

          <div className="mt-5 space-y-4">
            <fieldset>
              <legend className={labelClass}>Product categories</legend>
              <div className="flex flex-wrap gap-2">
                {categoriesLoading && (
                  <p className="w-full rounded-2xl bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-500">
                    Loading categories...
                  </p>
                )}
                {productCategories.map((category) => (
                  <label
                    key={category.id}
                    className={`inline-flex cursor-pointer select-none items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold shadow-sm transition active:scale-[0.98] ${
                      form.categories.includes(category.slug)
                        ? "border-[#f4a52c] bg-[#f4a52c] text-white shadow-[#f4a52c]/25"
                        : "border-gray-200 bg-white text-gray-600 hover:border-[#f4a52c]/60 hover:bg-[#fff9ef]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={form.categories.includes(category.slug)}
                      onChange={() => toggleCategory(category.slug)}
                    />
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border text-[11px] ${
                        form.categories.includes(category.slug)
                          ? "border-white bg-white text-[#f4a52c]"
                          : "border-gray-300 bg-gray-50 text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                    {category.name}
                  </label>
                ))}
              </div>
              <span className={helperClass}>At least one category is required for review.</span>
            </fieldset>

            <label className="block">
              <span className={labelClass}>Payout account type</span>
              <select
                value={form.payoutType}
                onChange={(event) => update("payoutType", event.target.value)}
                className={inputClass}
                required
              >
                <option>Mobile Money</option>
                <option>Bank Account</option>
              </select>
            </label>

            <label className="block">
              <span className={labelClass}>Payout account name</span>
              <input
                value={form.payoutAccountName}
                onChange={(event) => update("payoutAccountName", event.target.value)}
                className={inputClass}
                required
              />
              <span className={helperClass}>This should match the business owner or registered business name.</span>
            </label>

            <label className="block">
              <span className={labelClass}>Payout account or wallet number</span>
              <input
                value={form.payoutAccountNumber}
                onChange={(event) => update("payoutAccountNumber", event.target.value)}
                className={inputClass}
                required
              />
            </label>
          </div>
        </section>}

        {activeStep === 4 && (
          <section className="rounded-[1.75rem] border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-[#2f2f2f]">Review and submit</h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              Dogget will review the business proof, owner identity, contact details, and payout account before activation.
            </p>

            <div className="mt-5 space-y-3 rounded-2xl bg-[#fcfcfb] p-4 text-sm text-gray-700">
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Store</span>
                <span className="text-right font-bold text-[#2f2f2f]">{form.storeName || "Not provided"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Owner</span>
                <span className="text-right font-bold text-[#2f2f2f]">{form.ownerName || "Not provided"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Owner ID</span>
                <span className="text-right font-bold text-[#2f2f2f]">{form.ownerIdFileName || "Not uploaded"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Proof</span>
                <span className="text-right font-bold text-[#2f2f2f]">{form.certificateFileName || "Not uploaded"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Categories</span>
                <span className="text-right font-bold text-[#2f2f2f]">
                  {selectedCategoryNames || "Not selected"}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Payout</span>
                <span className="text-right font-bold text-[#2f2f2f]">{form.payoutType}</span>
              </div>
            </div>

            <label className="mt-5 flex gap-3 rounded-[1.25rem] border border-gray-200 bg-white p-4 text-sm leading-6 text-gray-700">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(event) => update("consent", event.target.checked)}
                className="peer sr-only"
                required
              />
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-gray-300 bg-white text-xs font-black text-white transition peer-checked:border-[#f4a52c] peer-checked:bg-[#f4a52c] peer-focus-visible:ring-2 peer-focus-visible:ring-[#f4a52c]/30">
                ✓
              </span>
              <span>
                I confirm the information is accurate and authorize Dogget to verify the identity, business proof, and
                payout details before approving this vendor account.
              </span>
            </label>
          </section>
        )}

        <div className="grid grid-cols-[0.8fr_1.2fr] gap-3">
          <button
            type="button"
            onClick={goBack}
            disabled={activeStep === 0}
            className="rounded-2xl border border-gray-200 bg-white px-4 py-4 text-sm font-bold text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Back
          </button>
          {isLastStep ? (
            <button
              className="rounded-2xl bg-[#f4a52c] px-4 py-4 text-sm font-bold text-white shadow-lg shadow-[#f4a52c]/25 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!canSubmit}
            >
              Submit application
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              className="rounded-2xl bg-[#f4a52c] px-4 py-4 text-sm font-bold text-white shadow-lg shadow-[#f4a52c]/25"
            >
              Continue
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default VendorApplyPage;
