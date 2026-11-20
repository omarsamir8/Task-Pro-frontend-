import {
  ArrowLeft,
  Image,
  LockKeyhole,
  Mail,
  Shield,
  UserRound,
} from "lucide-react";

const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15";

export default function UserForm({
  mode,
  name,
  email,
  role,
  password,
  profileImageUrl,
  error,
  saving,
  allowSuperAdminRole,
  onChange,
  onSubmit,
  onCancel,
}) {
  const isEditing = mode === "edit";

  return (
    <section className="mx-auto w-full">
      <button
        type="button"
        onClick={onCancel}
        disabled={saving}
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-teal-700 disabled:opacity-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to users
      </button>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
        <header className="border-b border-slate-100 bg-gradient-to-r from-teal-50/80 to-white px-6 py-6 sm:px-8">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500 text-white shadow-lg shadow-teal-500/20">
              <UserRound className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-teal-700">
                User management
              </p>
              <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {isEditing ? "Update user" : "Create a user"}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {isEditing
                  ? "Edit this user's account details and access."
                  : "Set up an account and choose its workspace access."}
              </p>
            </div>
          </div>
        </header>

        <form onSubmit={onSubmit} className="space-y-7 p-6 sm:p-8">
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <UserRound className="h-4 w-4 text-teal-600" />
                Full name
              </span>
              <input
                type="text"
                required
                autoFocus
                value={name}
                onChange={(event) => onChange("name", event.target.value)}
                placeholder="e.g. Layla Hassan"
                className={fieldClass}
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Mail className="h-4 w-4 text-teal-600" />
                Email address
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => onChange("email", event.target.value)}
                placeholder="layla@example.com"
                className={fieldClass}
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <LockKeyhole className="h-4 w-4 text-teal-600" />
                Password
              </span>
              <input
                type="password"
                required={!isEditing}
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(event) => onChange("password", event.target.value)}
                placeholder={
                  isEditing
                    ? "Leave blank to keep current password"
                    : "At least 8 characters"
                }
                className={fieldClass}
              />
              {isEditing && (
                <span className="mt-1.5 block text-xs text-slate-400">
                  Enter a new password only if you want to change it.
                </span>
              )}
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Shield className="h-4 w-4 text-teal-600" />
                Role
              </span>
              <select
                value={role}
                onChange={(event) => onChange("role", event.target.value)}
                className={fieldClass}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
                {allowSuperAdminRole && (
                  <option value="superadmin">Super Admin</option>
                )}
              </select>
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Image className="h-4 w-4 text-teal-600" />
                Profile image URL
              </span>
              <input
                type="url"
                value={profileImageUrl}
                onChange={(event) =>
                  onChange("profileImageUrl", event.target.value)
                }
                placeholder="https://example.com/avatar.jpg"
                className={fieldClass}
              />
            </label>
          </div>

          <footer className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim() || !email.trim()}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/20 transition hover:from-teal-600 hover:to-teal-700 disabled:cursor-wait disabled:opacity-60"
            >
              {saving
                ? "Saving user..."
                : isEditing
                  ? "Save changes"
                  : "Create user"}
            </button>
          </footer>
        </form>
      </div>
    </section>
  );
}
