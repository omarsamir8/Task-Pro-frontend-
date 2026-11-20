import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  CheckSquare2,
  ListTodo,
  LogOut,
  Menu,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import api from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import { notifyError, notifySuccess } from "../common/notifications";

export default function UserLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(Cookies.get("user") || "{}");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .get(API_PATHS.AUTH.PROFILE)
      .then(({ data }) => {
        if (active) setProfile(data);
      })
      .catch((error) => {
        if (active) {
          notifyError(error.response?.data?.message || "Unable to load your profile.");
        }
      })
      .finally(() => {
        if (active) setProfileLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isSidebarOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsSidebarOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isSidebarOpen]);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("refreshToken");
    Cookies.remove("user");
    notifySuccess("You have been signed out.");
    navigate("/", { replace: true });
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-[#F8FAFC] font-sans text-slate-800">
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        id="member-sidebar"
        className={`fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 select-none flex-col justify-between overflow-hidden bg-[#0B192C] text-slate-300 shadow-2xl transition-transform duration-300 ease-out sm:w-80 lg:sticky lg:top-0 lg:h-screen lg:z-auto lg:w-64 lg:translate-x-0 lg:shadow-none ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center space-x-3 p-5 sm:p-6">
            <Link
              to="/user/tasks"
              onClick={() => setIsSidebarOpen(false)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-400 text-slate-900 shadow-lg shadow-teal-500/30"
            >
              <CheckSquare2 className="h-6 w-6" />
            </Link>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold tracking-wide text-white">TaskPro</h1>
              <p className="text-[10px] font-medium uppercase tracking-wider text-teal-400">
                Manage · Track · Achieve
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close navigation menu"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav aria-label="Member navigation" className="mt-4 space-y-1.5 px-3">
            <NavLink
              to="/user/tasks"
              className={({ isActive }) =>
                `flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-teal-500 text-white shadow-md shadow-teal-500/20"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`
              }
              onClick={() => setIsSidebarOpen(false)}
            >
              <span className="flex items-center gap-3">
                <ListTodo className="h-5 w-5" />
                <span>My Tasks</span>
              </span>
            </NavLink>
          </nav>
        </div>

        <div className="relative z-10 m-3 rounded-2xl border border-slate-800/80 bg-[#0A1424] p-4">
          <div className="mb-3 flex items-center gap-3">
            {profileLoading ? (
              <div className="h-10 w-10 animate-pulse rounded-full bg-slate-700" />
            ) : profile?.profileImageUrl ? (
              <img
                src={profile.profileImageUrl}
                alt={profile.name || "Member profile"}
                className="h-10 w-10 rounded-full border-2 border-teal-500/40 object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-500/15 text-sm font-bold text-teal-300">
                {(profile?.name || user.name)?.trim()?.[0]?.toUpperCase() || "M"}
              </div>
            )}
            <div className="min-w-0">
              {profileLoading ? (
                <div className="h-4 w-24 animate-pulse rounded bg-slate-700" />
              ) : (
                <p className="truncate text-sm font-semibold text-white">
                  {profile?.name || user.name || "Member"}
                </p>
              )}
              <p className="flex items-center gap-1 text-xs text-teal-400">
                <ShieldCheck className="h-3 w-3" />
                {profile?.role || user.role || "member"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700/50 bg-slate-800/50 px-3 py-2 text-xs font-medium text-slate-400 transition-colors hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Logout</span>
          </button>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 opacity-20">
          <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="h-24 w-full">
            <path
              d="M0.00,49.98 C149.99,150.00 349.20,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"
              className="fill-teal-500"
            />
          </svg>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-100 bg-white px-3 sm:h-20 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={isSidebarOpen}
            aria-controls="member-sidebar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-400">Workspace</p>
            <p className="truncate text-sm font-semibold text-slate-800">
              {location.pathname.includes("task-details") ? "Task Details" : "My Tasks"}
            </p>
          </div>
          <span className="hidden rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 sm:inline-flex">
            Member workspace
          </span>
        </header>

        <main className="min-h-[calc(100vh-4rem)] min-w-0 flex-1 px-4 pt-4 pb-0 sm:min-h-[calc(100vh-5rem)] sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
