import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Buyer's preferred display currency. Persisted locally; once a server User
// exists, components should mirror this back to User.preferredCurrency via
// api.users.update so the choice follows them across devices.

/** @type {import("../lib/api/types.js").CurrencyCode[]} */
export const SUPPORTED_CURRENCIES = ["GHS", "USD", "EUR", "NGN"];

export const useCurrencyStore = create(
  persist(
    (set) => ({
      /** @type {import("../lib/api/types.js").CurrencyCode} */
      preferred: "GHS",
      /** @param {import("../lib/api/types.js").CurrencyCode} currency */
      setPreferred: (currency) => set({ preferred: currency }),
    }),
    {
      name: "dogget.currency.v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
