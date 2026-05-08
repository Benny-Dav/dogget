export const PAYMENT_LABELS = {
  PAYSTACK: "Pay online with Paystack",
  MOBILE_MONEY: "Pay online with Paystack",
  CARD: "Pay online with Paystack",
  STRIPE: "Pay online with Paystack",
};

export const normalizePaymentMethod = () => "PAYSTACK";

export const getPaymentLabel = (method) => PAYMENT_LABELS[method] ?? "Pay online with Paystack";
