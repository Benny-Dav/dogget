import { create } from "zustand";

// Ephemeral UI state — drawers, sheets, toasts. Not persisted.

let toastSeq = 0;

export const useUIStore = create((set, get) => ({
  filterDrawerOpen: false,
  checkoutSheetOpen: false,
  confirmDialog: null,
  /** @type {{id: number, kind: "info"|"success"|"error", message: string}[]} */
  toasts: [],

  openFilters: () => set({ filterDrawerOpen: true }),
  closeFilters: () => set({ filterDrawerOpen: false }),
  toggleFilters: () => set({ filterDrawerOpen: !get().filterDrawerOpen }),

  openCheckout: () => set({ checkoutSheetOpen: true }),
  closeCheckout: () => set({ checkoutSheetOpen: false }),

  /**
   * @param {{title: string, message: string, confirmLabel?: string, cancelLabel?: string, kind?: "danger"|"default", onConfirm: () => void}} config
   */
  confirm: (config) => set({ confirmDialog: config }),
  cancelConfirm: () => set({ confirmDialog: null }),
  runConfirm: () => {
    const dialog = get().confirmDialog;
    if (!dialog) return;
    dialog.onConfirm?.();
    set({ confirmDialog: null });
  },

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
