import { money } from "../../lib/api/format";

export const vendorOrderStatus = {
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const vendorOrders = [
  {
    id: "DOG-2401-A",
    buyer: "Ama Mensah",
    phone: "+233 24 555 0198",
    status: "PROCESSING",
    itemCount: 3,
    total: money(148.5, "GHS"),
    placedAt: "2026-04-29",
    address: "East Legon, Greater Accra",
    trackingNumber: "",
    courier: "",
    items: [
      { name: "Foster Oatmeal Treats", quantity: 2, price: money(16, "GHS") },
      { name: "Royal Canin Digestive", quantity: 1, price: money(35.5, "GHS") },
      { name: "Grooming Brush", quantity: 1, price: money(81, "GHS") },
    ],
    timeline: [
      { label: "Order paid", at: "2026-04-29 09:20" },
      { label: "Awaiting vendor acknowledgement", at: "Now" },
    ],
  },
  {
    id: "DOG-2388-B",
    buyer: "Kojo Appiah",
    phone: "+233 55 232 7781",
    status: "SHIPPED",
    itemCount: 1,
    total: money(72, "GHS"),
    placedAt: "2026-04-28",
    address: "Adenta, Greater Accra",
    trackingNumber: "DGT-AD-2388",
    courier: "Dogget Dispatch",
    items: [{ name: "Adjustable Harness", quantity: 1, price: money(72, "GHS") }],
    timeline: [
      { label: "Order paid", at: "2026-04-28 13:10" },
      { label: "Marked ready to ship", at: "2026-04-28 16:45" },
      { label: "Tracking added", at: "2026-04-28 17:05" },
    ],
  },
  {
    id: "DOG-2372-A",
    buyer: "Nadia Cole",
    phone: "+233 20 440 1192",
    status: "DELIVERED",
    itemCount: 2,
    total: money(96, "GHS"),
    placedAt: "2026-04-25",
    address: "Osu, Greater Accra",
    trackingNumber: "DGT-OS-2372",
    courier: "Dogget Dispatch",
    items: [
      { name: "Furminator Slicker Brush", quantity: 1, price: money(54, "GHS") },
      { name: "Dental Chew Pack", quantity: 1, price: money(42, "GHS") },
    ],
    timeline: [
      { label: "Order paid", at: "2026-04-25 10:00" },
      { label: "Shipped", at: "2026-04-25 15:20" },
      { label: "Delivered", at: "2026-04-26 11:40" },
    ],
  },
];

export const payoutRuns = [
  {
    id: "PO-APR-04",
    period: "Apr 22 - Apr 28",
    gross: money(642, "GHS"),
    commission: money(64.2, "GHS"),
    net: money(577.8, "GHS"),
    status: "Pending",
    orderCount: 12,
    method: "Mobile Money",
    accountName: "Dogget Official",
    accountRef: "+233 24 000 0000",
    reference: "MOMO-PENDING",
    scheduledFor: "2026-05-03",
    timeline: [
      { label: "Payout window closed", at: "2026-04-28 23:59" },
      { label: "Awaiting payout review", at: "Now" },
    ],
  },
  {
    id: "PO-APR-03",
    period: "Apr 15 - Apr 21",
    gross: money(518, "GHS"),
    commission: money(51.8, "GHS"),
    net: money(466.2, "GHS"),
    status: "Paid",
    orderCount: 9,
    method: "Mobile Money",
    accountName: "Dogget Official",
    accountRef: "+233 24 000 0000",
    reference: "MOMO-889201",
    scheduledFor: "2026-04-26",
    paidAt: "2026-04-26",
    timeline: [
      { label: "Payout window closed", at: "2026-04-21 23:59" },
      { label: "Approved by Dogget finance", at: "2026-04-25 09:30" },
      { label: "Paid to vendor wallet", at: "2026-04-26 10:15" },
    ],
  },
  {
    id: "PO-APR-02",
    period: "Apr 08 - Apr 14",
    gross: money(302, "GHS"),
    commission: money(30.2, "GHS"),
    net: money(271.8, "GHS"),
    status: "Failed",
    orderCount: 5,
    method: "Mobile Money",
    accountName: "Dogget Official",
    accountRef: "+233 24 000 0000",
    reference: "MOMO-FAILED",
    scheduledFor: "2026-04-19",
    timeline: [
      { label: "Payout window closed", at: "2026-04-14 23:59" },
      { label: "Wallet verification failed", at: "2026-04-19 08:20" },
    ],
  },
];

export const vendorCoupons = [
  {
    id: "coupon_newpup10",
    code: "NEWPUP10",
    name: "New puppy starter discount",
    type: "PERCENT",
    value: 10,
    minSubtotal: money(50, "GHS"),
    usageLimit: 200,
    usedCount: 37,
    status: "ACTIVE",
    startsAt: "2026-04-01",
    endsAt: "2026-05-31",
  },
  {
    id: "coupon_groom15",
    code: "GROOM15",
    name: "Grooming essentials",
    type: "FIXED",
    value: 15,
    minSubtotal: money(100, "GHS"),
    usageLimit: 80,
    usedCount: 12,
    status: "ACTIVE",
    startsAt: "2026-04-15",
    endsAt: "2026-05-15",
  },
  {
    id: "coupon_vip20",
    code: "VIP20",
    name: "VIP customer thank-you",
    type: "PERCENT",
    value: 20,
    minSubtotal: money(150, "GHS"),
    usageLimit: 50,
    usedCount: 50,
    status: "PAUSED",
    startsAt: "2026-03-01",
    endsAt: "2026-04-30",
  },
];

export const calculateCouponDiscount = (coupon, subtotalAmount) => {
  if (!coupon || coupon.status !== "ACTIVE") return 0;
  if (subtotalAmount < coupon.minSubtotal.amount) return 0;
  if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) return 0;

  if (coupon.type === "PERCENT") {
    return Math.min(subtotalAmount, Math.round(subtotalAmount * (coupon.value / 100)));
  }

  return Math.min(subtotalAmount, Math.round(coupon.value * 100));
};

export const findActiveCoupon = (code) =>
  vendorCoupons.find((coupon) => coupon.code.toLowerCase() === code.trim().toLowerCase());
