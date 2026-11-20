import Cookies from "js-cookie";
import { CheckSquare2, LogOut } from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { notifySuccess } from "../common/notifications";

export default function UserLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(Cookies.get("user") || "{}");

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("refreshToken");
    Cookies.remove("user");
    notifySuccess("You have been signed out.");
    navigate("/", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-[#F6F9FC] text-slate-800">
      <aside className="flex w-[76px] shrink-0 flex-col justify-between bg-[#0B192C] px-2 py-5 text-slate-300 sm:w-64 sm:px-4">
        <div>
          <Link to="/user/tasks" className="flex items-center justify-center gap-3 px-1 sm:justify-start sm:px-2">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-400 text-slate-900 shadow-lg shadow-teal-500/20">
              <CheckSquare2 className="h-6 w-6" />
            </span>
            <span className="hidden sm:block">
              <span className="block text-lg font-bold tracking-wide text-white">TaskPro</span>
              <span className="block text-[9px] font-medium uppercase tracking-wider text-teal-400">Manage · Track · Achieve</span>
            </span>
          </Link>

          <nav aria-label="Member navigation" className="mt-9">
            <NavLink
              to="/user/tasks"
              className={({ isActive }) =>
                `flex items-center justify-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition sm:justify-start ${
                  isActive
                    ? "bg-teal-500 text-white shadow-md shadow-teal-500/20"
                    : "text-slate-400 hover:bg-slate-800/70 hover:text-white"
                }`
              }
            >
              <CheckSquare2 className="h-5 w-5 shrink-0" />
              <span className="hidden sm:block">My Tasks</span>
            </NavLink>
          </nav>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-[#0A1424] p-2 sm:p-3">
          <div className="mb-3 hidden min-w-0 items-center gap-3 sm:flex">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-500/15 text-sm font-bold text-teal-300">
              {user.name?.trim()?.[0]?.toUpperCase() || "M"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{user.name || "Member"}</p>
              <p className="truncate text-xs text-slate-400">{user.email || "Team member"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-2 py-2 text-xs font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-300 sm:justify-start sm:px-3"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className="hidden sm:block">Sign out</span>
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 flex h-[68px] items-center justify-between border-b border-slate-100 bg-white/95 px-4 backdrop-blur sm:px-8">
          <div>
            <p className="text-xs font-medium text-slate-400">Workspace</p>
            <p className="text-sm font-semibold text-slate-800">My Tasks</p>
          </div>
          <span className="hidden rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 sm:inline-flex">
            Member workspace
          </span>
        </header>
        <main className="w-full p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
