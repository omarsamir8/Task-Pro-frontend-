import { CheckCircle2, X, XCircle } from "lucide-react";
import toast from "react-hot-toast";

const showNotification = (type, message) =>
  toast.custom(
    (toastItem) => {
      const isSuccess = type === "success";
      const Icon = isSuccess ? CheckCircle2 : XCircle;

      return (
        <div
          role={isSuccess ? "status" : "alert"}
          className={`flex w-[min(92vw,380px)] items-start gap-3 rounded-2xl border bg-white p-4 shadow-[0_12px_36px_rgba(15,23,42,0.16)] transition-all ${
            toastItem.visible
              ? "translate-y-0 opacity-100"
              : "-translate-y-2 opacity-0"
          } ${isSuccess ? "border-teal-100" : "border-rose-100"}`}
        >
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
              isSuccess ? "bg-teal-50 text-teal-600" : "bg-rose-50 text-rose-600"
            }`}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-sm font-bold text-slate-900">
              {isSuccess ? "Done successfully" : "Action failed"}
            </p>
            <p className="mt-1 break-words text-sm leading-5 text-slate-500">
              {message}
            </p>
          </div>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => toast.dismiss(toastItem.id)}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      );
    },
    { duration: 4500, position: "top-right" },
  );

export const notifySuccess = (message) =>
  showNotification("success", message);

export const notifyError = (message) => showNotification("error", message);
