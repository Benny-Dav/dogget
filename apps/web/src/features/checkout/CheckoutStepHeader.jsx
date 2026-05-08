const STEPS = ["Address", "Shipping", "Payment"];

const CheckoutStepHeader = ({ currentStep, title, description }) => (
  <>
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-[#2f2f2f]">{title}</h1>
        <p className="mt-1 text-sm leading-6 text-gray-500">{description}</p>
      </div>
      <span className="shrink-0 rounded-full bg-[#fff5e6] px-4 py-2 text-xs font-bold leading-5 text-[#8a5a08]">
        Step {currentStep} of 3
      </span>
    </div>

    <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs font-semibold text-gray-400">
      {STEPS.map((step, index) => {
        const stepNumber = index + 1;
        const complete = stepNumber < currentStep;
        const active = stepNumber === currentStep;

        return (
          <span
            key={step}
            className={`rounded-full px-2 py-2 ${
              complete
                ? "bg-emerald-50 text-emerald-700"
                : active
                  ? "bg-[#fff5e6] text-[#8a5a08]"
                  : "bg-gray-50 text-gray-400"
            }`}
          >
            {step}
          </span>
        );
      })}
    </div>
  </>
);

export default CheckoutStepHeader;

