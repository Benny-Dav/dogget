import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { useUIStore } from "../stores/uiStore";

const KIND_STYLES = {
  success: {
    shell: "border-emerald-100 bg-white text-gray-900",
    iconWrap: "bg-emerald-50 text-emerald-600",
    icon: CheckCircle2,
    label: "Success",
  },
  error: {
    shell: "border-red-100 bg-white text-gray-900",
    iconWrap: "bg-red-50 text-red-600",
    icon: AlertTriangle,
    label: "Error",
  },
  info: {
    shell: "border-gray-200 bg-white text-gray-900",
    iconWrap: "bg-gray-100 text-gray-700",
    icon: Info,
    label: "Update",
  },
};

const ToastHost = () => {
  const toasts = useUIStore((s) => s.toasts);
  const dismiss = useUIStore((s) => s.dismissToast);
  const confirmDialog = useUIStore((s) => s.confirmDialog);
  const cancelConfirm = useUIStore((s) => s.cancelConfirm);
  const runConfirm = useUIStore((s) => s.runConfirm);

  const hasToasts = toasts.length > 0;
  const hasConfirm = Boolean(confirmDialog);

  if (!hasToasts && !hasConfirm) return null;

  return (
    <>
      {hasToasts && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[80] flex w-[calc(100%-2rem)] max-w-[400px] flex-col gap-2">
          {toasts.map((t) => {
            const config = KIND_STYLES[t.kind] ?? KIND_STYLES.info;
            const Icon = config.icon;

            return (
              <div
                key={t.id}
                className={`overflow-hidden rounded-2xl border shadow-lg backdrop-blur-sm ${config.shell}`}
              >
                <div className="flex items-start gap-3 px-4 py-3">
                  <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${config.iconWrap}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400">{config.label}</p>
                    <p className="mt-1 text-sm leading-6 text-gray-700">{t.message}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => dismiss(t.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                    aria-label="Dismiss toast"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="h-1 w-full bg-gray-100">
                  <div
                    className={`h-full ${
                      t.kind === "success"
                        ? "bg-emerald-500"
                        : t.kind === "error"
                          ? "bg-red-500"
                          : "bg-gray-500"
                    }`}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {hasConfirm && (
        <div className="fixed inset-0 z-[90] bg-black/35">
          <div className="fixed inset-y-0 left-1/2 flex w-full max-w-[430px] -translate-x-1/2 items-end">
            <button
              type="button"
              className="absolute inset-0"
              aria-label="Close confirmation dialog"
              onClick={cancelConfirm}
            />
            <div className="relative w-full rounded-t-[2rem] bg-white px-6 pb-8 pt-5 shadow-2xl">
              <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-gray-200" />
              <div className="flex items-start gap-3">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                  confirmDialog.kind === "danger" ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-700"
                }`}>
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#2f2f2f]">{confirmDialog.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-gray-500">{confirmDialog.message}</p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={cancelConfirm}
                  className="rounded-2xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-700"
                >
                  {confirmDialog.cancelLabel ?? "Cancel"}
                </button>
                <button
                  type="button"
                  onClick={runConfirm}
                  className={`rounded-2xl px-4 py-3 text-sm font-bold text-white ${
                    confirmDialog.kind === "danger" ? "bg-red-600" : "bg-[#f4a52c]"
                  }`}
                >
                  {confirmDialog.confirmLabel ?? "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ToastHost;
