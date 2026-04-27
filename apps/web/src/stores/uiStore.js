import { create } from "zustand";

// Ephemeral UI state — drawers, sheets, toasts. Not persisted.

let toastSeq = 0;

export const useUIStore = create((set, get) => ({
  filterDrawerOpen: false,
  cartSheetOpen: false,
  /** @type {{id: number, kind: "info"|"success"|"error", message: string}[]} */
  toasts: [],

  openFilters: () => set({ filterDrawerOpen: true }),
  closeFilters: () => set({ filterDrawerOpen: false }),
  toggleFilters: () => set({ filterDrawerOpen: !get().filterDrawerOpen }),

  openCart: () => set({ cartSheetOpen: true }),
  closeCart: () => set({ cartSheetOpen: false }),

  /** @param {string} message @param {"info"|"success"|"error"} [kind] */
  toast: (message, kind = "info") => {
    const id = ++toastSeq;
    set({ toasts: [...get().toasts, { id, kind, message }] });
    setTimeout(() => {
      set({ toasts: get().toasts.filter((t) => t.id !== id) });
    }, 3000);
  },

  /** @param {number} id */
  dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));
