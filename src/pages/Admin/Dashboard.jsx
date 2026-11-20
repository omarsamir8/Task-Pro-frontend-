import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  LayoutDashboard,
  CheckSquare,
  ListTodo,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  Menu,
  ShieldCheck,
  X,
} from "lucide-react";
import api from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import DashboardInfo from "../../components/admin/DashboardInfo";
import AllTasks from "../../components/admin/AllTasks";
import UserMangement from "../../components/admin/UserMangement";
import UserDetailsPage from "../../components/admin/UserDetailsPage";
import Reports from "../../components/admin/Reports";
import Setting from "../../components/admin/Setting";
import ViewTaskDetails from "../User/ViewTaskDetails";
import TaskEditorPage from "./TaskEditorPage";
import { SkeletonBlock } from "../../components/common/LoadingSkeleton";
import { notifyError, notifySuccess } from "../../components/common/notifications";

const getTaskNotifications = (tasks) => {
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

  return tasks
    .flatMap((task) => {
      if (!task.dueDate || task.status === "Completed") return [];

      const dueDate = new Date(task.dueDate);
      if (Number.isNaN(dueDate.getTime())) return [];

      const dueDay = Date.UTC(
        dueDate.getUTCFullYear(),
        dueDate.getUTCMonth(),
        dueDate.getUTCDate(),
      );
      const daysUntilDue = Math.round((dueDay - today) / 86400000);
      if (daysUntilDue > 3) return [];

      return [{ ...task, daysUntilDue }];
    })
    .sort((first, second) => first.daysUntilDue - second.daysUntilDue);
};

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeNav = location.pathname.startsWith("/admin/tasks") ||
        location.pathname === "/admin/create-task"
      ? "All Tasks"
      : location.pathname.startsWith("/admin/users")
        ? "Users"
        : location.pathname === "/admin/reports"
          ? "Reports"
          : location.pathname === "/admin/settings"
            ? "Settings"
            : location.state?.activeNav || "Dashboard";
  const [showNotifications, setShowNotifications] = useState(false);
  const [taskNotifications, setTaskNotifications] = useState([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  const [notificationsError, setNotificationsError] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ tasks: [], users: [] });
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [userInfo, setUserinfo] = useState(null);
  const [userInfoLoading, setUserInfoLoading] = useState(true);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query.length < 2) return undefined;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        const [tasksResponse, usersResponse] = await Promise.all([
          api.get(API_PATHS.TASKS.LIST, { signal: controller.signal }),
          api.get(API_PATHS.USERS.LIST, { signal: controller.signal }),
        ]);
        if (controller.signal.aborted) return;

        setSearchResults({
          tasks: (tasksResponse.data.tasks || [])
            .filter((task) => task.title?.toLowerCase().includes(query))
            .slice(0, 5),
          users: (usersResponse.data || [])
            .filter(
              (user) =>
                user.name?.toLowerCase().includes(query) ||
                user.email?.toLowerCase().includes(query),
            )
            .slice(0, 5),
        });
      } catch (error) {
        if (!controller.signal.aborted) {
          setSearchResults({ tasks: [], users: [] });
          notifyError(
            error.response?.data?.message || "Unable to search tasks and users.",
          );
        }
      } finally {
        if (!controller.signal.aborted) setIsSearchLoading(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [searchQuery]);

  useEffect(() => {
    let active = true;
    api
      .get(API_PATHS.AUTH.PROFILE)
      .then(({ data }) => {
        if (active) setUserinfo(data);
      })
      .catch((error) => {
        if (active) {
          notifyError(
            error.response?.data?.message || "Unable to load your profile.",
          );
        }
      })
      .finally(() => {
        if (active) setUserInfoLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    api
      .get(API_PATHS.TASKS.LIST)
      .then(({ data }) => {
        if (active) {
          setTaskNotifications(getTaskNotifications(data.tasks || []));
          setNotificationsError("");
        }
      })
      .catch((error) => {
        if (active) {
          const message =
            error.response?.data?.message || "Unable to load notifications.";
          setNotificationsError(message);
          notifyError(message);
        }
      })
      .finally(() => {
        if (active) setIsLoadingNotifications(false);
      });
    return () => {
      active = false;
    };
  }, []);

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

  const pages = {
    Dashboard: <DashboardInfo />,
    "All Tasks": <AllTasks />,
    Reports: <Reports />,
    Users: <UserMangement key={location.pathname} />,
    Settings: <Setting />,
  };
  const isTaskEditorPage =
    location.pathname === "/admin/create-task" ||
    /^\/admin\/tasks\/[^/]+\/edit$/.test(location.pathname);
  const isTaskDetailsPage =
    /^\/admin\/tasks\/[^/]+$/.test(location.pathname);
  const isUserDetailsPage =
    location.pathname !== "/admin/users/new" &&
    /^\/admin\/users\/[^/]+$/.test(location.pathname);
  const firstSearchResult =
    searchResults.tasks[0] || searchResults.users[0];
  const openSearchResult = (result) => {
    setSearchQuery("");
    setSearchResults({ tasks: [], users: [] });
    setIsSearchLoading(false);
    setIsSearchOpen(false);
    navigate(
      result.type === "task"
        ? `/admin/tasks/${result.item._id}`
        : `/admin/users/${result.item._id}`,
    );
  };
  const openTaskNotification = (taskId) => {
    setShowNotifications(false);
    navigate(`/admin/tasks/${taskId}`);
  };
  return (
    <div className="fixed inset-0 flex min-h-0 bg-[#F8FAFC] font-sans text-slate-800 overflow-hidden">
      {/* ================= SIDEBAR ================= */}
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-[2px] lg:hidden"
        />
      )}
      <aside
        id="admin-sidebar"
        className={`fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 select-none flex-col justify-between overflow-hidden bg-[#0B192C] text-slate-300 shadow-2xl transition-transform duration-300 ease-out sm:w-80 lg:static lg:z-auto lg:w-64 lg:translate-x-0 lg:shadow-none ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo Area */}
          <div className="flex items-center space-x-3 p-5 sm:p-6">
            <div className="w-10 h-10 rounded-xl bg-teal-400 flex items-center justify-center text-slate-900 shadow-lg shadow-teal-500/30">
              <CheckSquare className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold tracking-wide text-white">
                TaskPro
              </h1>
              <p className="text-[10px] uppercase tracking-wider text-teal-400 font-medium">
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

          {/* Navigation Menu */}
          <nav className="mt-4 px-3 space-y-1.5">
            {[
              { name: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
              { name: "All Tasks", to: "/admin/tasks", icon: ListTodo },
              { name: "Reports", to: "/admin/reports", icon: BarChart3, hasArrow: true },
              { name: "Users", to: "/admin/users", icon: Users },
              { name: "Settings", to: "/admin/settings", icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.name;
              return (
                <Link
                  key={item.name}
                  to={item.to}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-teal-500 text-white shadow-md shadow-teal-500/20"
                      : "hover:bg-slate-800/60 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.hasArrow && (
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer / User Profile Card */}
        <div className="p-4 m-3 bg-[#0A1424] rounded-2xl border border-slate-800/80 relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="relative">
                {userInfoLoading ? (
                  <SkeletonBlock className="h-10 w-10 rounded-full" />
                ) : (
                  <img
                    src={userInfo?.profileImageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"}
                    alt={userInfo?.name || "User profile"}
                    className="w-10 h-10 rounded-full object-cover border-2 border-teal-500/40"
                  />
                )}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0A1424] rounded-full"></span>
              </div>
              <div>
                {userInfoLoading ? (
                  <SkeletonBlock className="h-4 w-24" />
                ) : (
                  <h4 className="text-sm font-semibold text-white">
                    {userInfo?.name}
                  </h4>
                )}
                <p className="text-xs text-teal-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> {userInfo?.role}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-slate-800/50 hover:bg-red-500/10 hover:text-red-400 text-slate-400 text-xs font-medium transition-colors border border-slate-700/50 hover:border-red-500/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Decorative Wave Graphics at bottom of sidebar */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none opacity-20">
          <svg
            viewBox="0 0 500 150"
            preserveAspectRatio="none"
            className="w-full h-24"
          >
            <path
              d="M0.00,49.98 C149.99,150.00 349.20,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"
              className="fill-teal-500"
            ></path>
          </svg>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="z-20 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-100 bg-white px-3 sm:h-20 sm:px-6 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={isSidebarOpen}
              aria-controls="admin-sidebar"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Search Input */}
            <div className="relative w-full max-w-sm min-w-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search tasks, users..."
                value={searchQuery}
                role="combobox"
                aria-label="Search tasks and users"
                aria-expanded={isSearchOpen && searchQuery.trim().length >= 2}
                aria-controls="header-search-results"
                onFocus={() => setIsSearchOpen(true)}
                onChange={(event) => {
                  const value = event.target.value;
                  setSearchQuery(value);
                  if (value.trim().length < 2) {
                    setSearchResults({ tasks: [], users: [] });
                    setIsSearchLoading(false);
                  } else {
                    setIsSearchLoading(true);
                  }
                  setIsSearchOpen(true);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setIsSearchOpen(false);
                  if (event.key === "Enter" && firstSearchResult) {
                    openSearchResult(firstSearchResult);
                  }
                }}
                className="w-full min-w-0 rounded-xl border border-slate-200/80 bg-slate-50 py-2.5 pl-10 pr-3 text-xs text-slate-700 transition-all placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 sm:px-4 sm:pl-10 sm:text-sm"
              />
              {isSearchOpen && searchQuery.trim() && (
                <div
                  id="header-search-results"
                  role="listbox"
                  className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
                >
                  {searchQuery.trim().length < 2 ? (
                    <p className="px-3 py-2 text-xs text-slate-500">
                      Type at least 2 characters to search.
                    </p>
                  ) : isSearchLoading ? (
                    <p className="px-3 py-2 text-xs text-slate-500">
                      Searching...
                    </p>
                  ) : searchResults.tasks.length || searchResults.users.length ? (
                    <>
                      {searchResults.tasks.length > 0 && (
                        <div>
                          <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            Tasks
                          </p>
                          {searchResults.tasks.map((task) => (
                            <button
                              key={task._id}
                              type="button"
                              role="option"
                              aria-selected="false"
                              onClick={() =>
                                openSearchResult({ type: "task", item: task })
                              }
                              className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-teal-50"
                            >
                              {task.title}
                            </button>
                          ))}
                        </div>
                      )}
                      {searchResults.users.length > 0 && (
                        <div>
                          <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            Users
                          </p>
                          {searchResults.users.map((user) => (
                            <button
                              key={user._id}
                              type="button"
                              role="option"
                              aria-selected="false"
                              onClick={() =>
                                openSearchResult({ type: "user", item: user })
                              }
                              className="block w-full rounded-lg px-3 py-2 text-left hover:bg-teal-50"
                            >
                              <span className="block truncate text-sm text-slate-700">
                                {user.name}
                              </span>
                              <span className="block truncate text-xs text-slate-400">
                                {user.email}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="px-3 py-2 text-xs text-slate-500">
                      No matching tasks or users.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications((isOpen) => !isOpen)}
                aria-label={`Notifications, ${taskNotifications.length} task alerts`}
                aria-expanded={showNotifications}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100 sm:h-10 sm:w-10"
              >
                <Bell className="w-5 h-5" />
                {taskNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm">
                    {taskNotifications.length > 99
                      ? "99+"
                      : taskNotifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 z-50 mt-2 max-h-[min(28rem,calc(100vh-6rem))] w-72 max-w-[calc(100vw-1rem)] overflow-y-auto rounded-2xl border border-slate-100 bg-white p-4 shadow-xl sm:w-80">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="font-semibold text-sm text-slate-800">
                      Notifications
                    </h3>
                    <span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-600">
                      {taskNotifications.length} alerts
                    </span>
                  </div>
                  <div className="mt-2 divide-y divide-slate-50">
                    {isLoadingNotifications ? (
                      <p className="py-4 text-center text-xs text-slate-500">
                        Loading notifications...
                      </p>
                    ) : notificationsError ? (
                      <p role="alert" className="py-4 text-center text-xs text-red-600">
                        {notificationsError}
                      </p>
                    ) : taskNotifications.length ? (
                      taskNotifications.map((task) => (
                        <button
                          key={task._id}
                          type="button"
                          onClick={() => openTaskNotification(task._id)}
                          className="w-full py-3 text-left transition hover:bg-slate-50"
                        >
                          <span className="block truncate text-xs font-semibold text-slate-700">
                            {task.title}
                          </span>
                          <span
                            className={`mt-1 block text-[11px] ${
                              task.daysUntilDue < 0
                                ? "text-red-600"
                                : "text-amber-600"
                            }`}
                          >
                            {task.daysUntilDue < 0
                              ? `Overdue by ${Math.abs(task.daysUntilDue)} day${Math.abs(task.daysUntilDue) === 1 ? "" : "s"}`
                              : task.daysUntilDue === 0
                                ? "Due today"
                                : `Due in ${task.daysUntilDue} day${task.daysUntilDue === 1 ? "" : "s"}`}
                            {" · "}
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="py-4 text-center text-xs text-slate-500">
                        No overdue or upcoming tasks.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 rounded-xl border border-transparent py-1.5 pl-1.5 pr-2 transition-colors hover:border-slate-200/80 hover:bg-slate-50 sm:gap-3 sm:pl-2 sm:pr-3"
              >
                {userInfoLoading ? (
                  <SkeletonBlock className="h-8 w-8 rounded-full sm:h-9 sm:w-9" />
                ) : (
                  <img
                    src={userInfo?.profileImageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"}
                    alt={userInfo?.name || "User profile"}
                    className="h-8 w-8 rounded-full border border-slate-200 object-cover sm:h-9 sm:w-9"
                  />
                )}
                {!userInfoLoading && (
                  <span className="hidden max-w-28 truncate text-sm font-semibold text-slate-700 md:block">
                    {userInfo?.name}
                  </span>
                )}
                <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50">
                  <Link to="/admin/settings" className="block w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium">
                    Your Profile
                  </Link>
                  <Link to="/admin/settings" className="block w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium">
                    Account Settings
                  </Link>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-medium">
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Body Container */}
        <main
          className={`min-h-0 flex-1 overflow-y-auto overscroll-contain max-w-7xl mx-auto w-full ${
            isTaskDetailsPage ? "p-3 sm:p-4" : "p-4 sm:p-6 lg:p-8"
          }`}
        >
          {isUserDetailsPage ? (
            <UserDetailsPage />
          ) : isTaskEditorPage ? (
            <TaskEditorPage />
          ) : isTaskDetailsPage ? (
            <ViewTaskDetails />
          ) : (
            pages[activeNav] || <DashboardInfo />
          )}
        </main>
      </div>
    </div>
  );
}
