import { LoaderCircle } from "lucide-react";
import { LoadingSpinner } from "./LoadingSkeleton";

export default function PreparationCard({
  statusLabel,
  title,
  description,
  waitMessage,
  items,
}) {
  return (
    <section
      role="status"
      aria-label={title}
      aria-live="polite"
      aria-busy="true"
      className="relative isolate flex min-h-[440px] w-full items-center justify-center overflow-hidden rounded-3xl border border-slate-200/80 bg-white px-5 py-10 shadow-[0_8px_30px_rgba(15,23,42,0.05)] sm:px-8"
    >
      <div
        aria-hidden="true"
        className="absolute -right-20 -top-24 -z-10 h-64 w-64 rounded-full bg-teal-100/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-28 -left-20 -z-10 h-64 w-64 rounded-full bg-cyan-100/50 blur-3xl"
      />

      <div className="w-full max-w-lg text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 ring-1 ring-inset ring-teal-100">
          <LoaderCircle className="h-8 w-8 animate-spin" />
        </div>

        <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50/80 px-3 py-1 text-xs font-semibold text-teal-700">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500" />
          {statusLabel}
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          {description}
        </p>

        <div className="mt-7 grid gap-3 text-left sm:grid-cols-2">
          {items.map(({ icon: Icon, title: itemTitle, description: itemDescription }) => (
            <div
              key={itemTitle}
              className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white/80 p-3.5 shadow-sm"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold text-slate-800">
                  {itemTitle}
                </span>
                <span className="mt-0.5 block text-[11px] text-slate-500">
                  {itemDescription}
                </span>
              </span>
              <LoadingSpinner className="h-4 w-4 shrink-0 text-teal-600" />
            </div>
          ))}
        </div>

        <div className="mx-auto mt-7 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-2/5 animate-pulse rounded-full bg-gradient-to-r from-teal-500 to-cyan-400" />
        </div>
        <p className="mt-3 text-xs font-medium text-slate-400">{waitMessage}</p>
      </div>
    </section>
  );
}
