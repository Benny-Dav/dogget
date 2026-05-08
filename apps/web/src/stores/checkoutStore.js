import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const DEFAULT_ADDRESS = {
  recipient: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  region: "Greater Accra",
  countryCode: "GH",
  country: "Ghana",
};

export const useCheckoutStore = create(
  persist(
    (set) => ({
      address: DEFAULT_ADDRESS,
      shippingMethod: "STANDARD",
      paymentMethod: "PAYSTACK",
      coupon: null,
      lastConfirmation: null,
      orders: [],

      setAddress: (address) => set({ address }),
      setShippingMethod: (shippingMethod) => set({ shippingMethod }),
      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
      setCoupon: (coupon) => set({ coupon }),
      clearCoupon: () => set({ coupon: null }),
      setLastConfirmation: (lastConfirmation) => set({ lastConfirmation }),
      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
          lastConfirmation: order,
        })),
      clearLastConfirmation: () => set({ lastConfirmation: null }),
    }),
    {
      name: "dogget.checkout.v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        address: state.address,
        shippingMethod: state.shippingMethod,
        paymentMethod: state.paymentMethod,
        coupon: state.coupon,
        lastConfirmation: state.lastConfirmation,
        orders: state.orders,
      }),
    }
  )
);
