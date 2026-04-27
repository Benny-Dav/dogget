import { useUIStore } from "../stores/uiStore";

const KIND_STYLES = {
  success: "bg-emerald-600 text-white",
  error: "bg-red-600 text-white",
  info: "bg-gray-900 text-white",
};

const ToastHost = () => {
  const toasts = useUIStore((s) => s.toasts);
  const dismiss = useUIStore((s) => s.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-[calc(100%-2rem)] max-w-[400px]">
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => dismiss(t.id)}
          className={`text-left text-sm px-4 py-2.5 rounded-lg shadow-lg ${
            KIND_STYLES[t.kind] ?? KIND_STYLES.info
          }`}
        >
          {t.message}
        </button>
      ))}
    </div>
  );
};

export default ToastHost;
