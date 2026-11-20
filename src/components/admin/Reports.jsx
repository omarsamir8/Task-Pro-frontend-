import { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import {
  Download,
  ListTodo,
  UsersRound,
} from "lucide-react";
import { LoadingSpinner } from "../common/LoadingSkeleton";
import PreparationCard from "../common/PreparationCard";
import {
  notifyError,
  notifySuccess,
} from "../common/notifications";

// Custom SVG icons tailored to match the exact visual glyphs in the reference image
const TasksTabIcon = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M19 8v6" />
    <path d="M22 11h-6" />
  </svg>
);

const UsersTabIcon = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <circle cx="12" cy="13" r="2" />
    <path d="M8.5 18c.6-1.5 2-2.2 3.5-2.2s2.9.7 3.5 2.2" />
  </svg>
);

const TasksCardBadgeIcon = () => (
  <svg
    viewBox="0 0 28 28"
    fill="none"
    className="w-7 h-7 text-[#10B981]"
    aria-hidden="true"
  >
    {/* Document outline */}
    <rect
      x="5"
      y="4"
      width="13"
      height="18"
      rx="2.5"
      stroke="#14B8A6"
      strokeWidth="2.2"
    />
    <path
      d="M8.5 9.5h6M8.5 13.5h4"
      stroke="#14B8A6"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    {/* Foreground user silhouette badge */}
    <circle
      cx="19.5"
      cy="14.5"
      r="2.6"
      fill="#E6F7F7"
      stroke="#14B8A6"
      strokeWidth="2.1"
    />
    <path
      d="M15.2 22.2c.5-2.3 2.2-3.5 4.3-3.5s3.8 1.2 4.3 3.5"
      fill="#E6F7F7"
      stroke="#14B8A6"
      strokeWidth="2.1"
      strokeLinecap="round"
    />
  </svg>
);

const UsersCardBadgeIcon = () => (
  <svg viewBox="0 0 28 28" fill="none" className="w-7 h-7" aria-hidden="true">
    {/* Secondary user on right */}
    <circle cx="19" cy="10.5" r="3" fill="#10B981" />
    <path
      d="M15.5 21.5c.3-2.9 2.2-4.7 5-4.7 2.4 0 4.1 1.5 4.5 4.2 0 .3-.2.5-.5.5h-9z"
      fill="#10B981"
    />
    {/* Primary user on left */}
    <circle cx="11.5" cy="10" r="3.5" fill="#10B981" />
    <path
      d="M4.5 21.5c.4-3.5 3.1-5.6 7-5.6s6.6 2.1 7 5.6c0 .3-.2.5-.5.5H5c-.3 0-.5-.2-.5-.5z"
      fill="#10B981"
    />
  </svg>
);

const MiniClipboardIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    className="w-3.5 h-3.5 text-[#0D9488]"
    aria-hidden="true"
  >
    <rect
      x="3"
      y="2.5"
      width="10"
      height="11.5"
      rx="1.8"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M6 2.5V2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v.5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M5.5 7h5M5.5 10h3.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

const MiniGroupIcon = () => (
  <svg
    viewBox="0 0 18 14"
    fill="none"
    className="w-4 h-3.5 text-[#0F766E]"
    aria-hidden="true"
  >
    <circle cx="6" cy="4" r="2.3" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M1.8 11.8c.4-2.1 2-3.3 4.2-3.3s3.8 1.2 4.2 3.3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle
      cx="12.5"
      cy="4.5"
      r="1.9"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <path
      d="M10.8 11.8c.4-1.6 1.5-2.6 3.1-2.6 1.4 0 2.5.9 2.9 2.6"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

const OverdueClockIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="w-6 h-6 text-[#F97316]"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2.2" />
    <path
      d="M12 7.5V12l3 2"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Reports() {
  const [activeTab, setActiveTab] = useState("tasks"); // 'tasks' | 'users'
  const [downloadingType, setDownloadingType] = useState(null);
  const [taskStats, setTaskStats] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([
      api.get(API_PATHS.TASKS.DASHBOARD),
      api.get(API_PATHS.USERS.LIST),
    ])
      .then(([{ data: taskData }, { data: users }]) => {
        if (!active) return;
        setTaskStats(taskData.statistics);
        setUserCount(users.length);
      })
      .catch((error) => {
        if (active) {
          setStatsError(
            error.response?.data?.message || "Unable to load report statistics.",
          );
        }
      })
      .finally(() => {
        if (active) setStatsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Download the generated Excel report
  const handleDownloadReport = async (type) => {
    setDownloadingType(type);
    const isTasks = type === "tasks";
    const fileName = isTasks ? "tasks.xlsx" : "users.xlsx";
    const label = isTasks ? "Tasks Report" : "Users Report";
    try {
      const { data } = await api.get(isTasks ? API_PATHS.REPORTS.TASKS : API_PATHS.REPORTS.USERS, { responseType: "blob" });
      const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      notifySuccess(`${label} downloaded successfully.`);
    } catch (error) {
      notifyError(
        error.response?.data?.message ||
          `Unable to download the ${label.toLowerCase()}. Please try again.`,
      );
    } finally {
      setDownloadingType(null);
    }
  };

  if (statsLoading) {
    return (
      <PreparationCard
        statusLabel="Preparing report data"
        title="Preparing all reports"
        description="We're collecting the latest task and user data. Your reports page will appear as soon as the data is ready."
        waitMessage="Waiting for the reports APIs…"
        items={[
          {
            icon: ListTodo,
            title: "Task reports",
            description: "Loading task statistics",
          },
          {
            icon: UsersRound,
            title: "User reports",
            description: "Loading user statistics",
          },
        ]}
      />
    );
  }

  if (statsError) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-rose-100 bg-white p-6 text-sm text-rose-700 shadow-sm"
      >
        {statsError}
      </div>
    );
  }

  // Dynamic overview stats when switching tabs (defaults to exact 24 / 18 / 6 from screenshot)
  const overviewStats =
    activeTab === "tasks"
      ? {
          firstValue: String(taskStats?.totalTasks ?? 0),
          firstSub: null,
          firstLabel: "Total Tasks",
          secondValue: String(taskStats?.completedTasks ?? 0),
          secondLabel: "Completed",
          thirdValue: String(taskStats?.overdueTasks ?? 0),
          thirdLabel: "Overdue",
        }
      : {
          firstValue: String(userCount),
          firstSub: null,
          firstLabel: "Total Users",
          secondValue: String(userCount),
          secondLabel: "Active",
          thirdValue: "—",
          thirdLabel: "Admins",
        };

  return (
    <div className="w-full bg-[#F6F9FC] text-[#0F172A] antialiased selection:bg-[#14B8A6]/15 selection:text-[#0D9488] flex flex-col justify-center">
      {/* Main Container */}
      <div className="w-full  mx-auto ">
        {/* 1. Header */}
        <header>
          <h1 className="text-[26px] font-bold tracking-[-0.02em] text-[#0F172A] leading-tight">
            Reports
          </h1>
          <p className="text-[14px] text-[#64748B] mt-1 font-normal">
            View and export system reports
          </p>
        </header>

        {/* 2. Tab Navigation Bar */}
        <nav
          aria-label="Report categories"
          className="mt-6 flex items-center gap-7 border-b border-[#E2E8F0]"
        >
          <button
            type="button"
            onClick={() => setActiveTab("tasks")}
            className={`relative pb-3 inline-flex items-center gap-2 text-[14px] font-semibold transition-colors cursor-pointer ${
              activeTab === "tasks"
                ? "text-[#0D9488]"
                : "text-[#64748B] hover:text-[#334155]"
            }`}
          >
            <TasksTabIcon className="w-4 h-4" />
            <span>Tasks Report</span>
            {activeTab === "tasks" && (
              <span className="absolute left-0 right-0 -bottom-[1px] h-[2.5px] bg-[#14B8A6] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`relative pb-3 inline-flex items-center gap-2 text-[14px] font-semibold transition-colors cursor-pointer ${
              activeTab === "users"
                ? "text-[#0D9488]"
                : "text-[#64748B] hover:text-[#334155]"
            }`}
          >
            <UsersTabIcon className="w-4 h-4" />
            <span>Users Report</span>
            {activeTab === "users" && (
              <span className="absolute left-0 right-0 -bottom-[1px] h-[2.5px] bg-[#14B8A6] rounded-full" />
            )}
          </button>
        </nav>

        {/* 3. Two Main Export Cards */}
        <section
          aria-label="Report export options"
          className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5"
        >
          {/* Card 1: Tasks Report */}
          <div
            onClick={() => setActiveTab("tasks")}
            className={`bg-white rounded-2xl border p-6 sm:p-7 flex flex-col items-center text-center transition-all cursor-pointer ${
              activeTab === "tasks"
                ? "border-[#E2E8F0] shadow-[0_4px_18px_rgba(15,23,42,0.04)]"
                : "border-[#EDF2F7] shadow-[0_2px_10px_rgba(15,23,42,0.025)] hover:border-slate-200"
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-[#E6F7F7] flex items-center justify-center">
              <TasksCardBadgeIcon />
            </div>

            <h2 className="mt-4 text-[18px] font-bold text-[#0F172A] tracking-[-0.01em]">
              Tasks Report
            </h2>
            <p className="mt-1.5 text-[13px] text-[#64748B] font-normal">
              Export all tasks data to Excel
            </p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDownloadReport("tasks");
              }}
              disabled={downloadingType === "tasks"}
              className="mt-6 w-full py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#0B6E75] to-[#0E7C86] hover:from-[#095C62] hover:to-[#0B6B74] active:scale-[0.99] text-white text-[13.5px] font-semibold inline-flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(11,110,117,0.22)] transition-all cursor-pointer disabled:opacity-75"
            >
              {downloadingType === "tasks" ? (
                <LoadingSpinner className="h-4 w-4" />
              ) : (
                <Download className="w-4 h-4 stroke-[2.2]" />
              )}
              <span>
                {downloadingType === "tasks"
                  ? "Exporting..."
                  : "Download Report"}
              </span>
            </button>
          </div>

          {/* Card 2: Users Report */}
          <div
            onClick={() => setActiveTab("users")}
            className={`bg-white rounded-2xl border p-6 sm:p-7 flex flex-col items-center text-center transition-all cursor-pointer ${
              activeTab === "users"
                ? "border-[#E2E8F0] shadow-[0_4px_18px_rgba(15,23,42,0.04)]"
                : "border-[#EDF2F7] shadow-[0_2px_10px_rgba(15,23,42,0.025)] hover:border-slate-200"
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-[#E6F9EE] flex items-center justify-center">
              <UsersCardBadgeIcon />
            </div>

            <h2 className="mt-4 text-[18px] font-bold text-[#0F172A] tracking-[-0.01em]">
              Users Report
            </h2>
            <p className="mt-1.5 text-[13px] text-[#64748B] font-normal">
              Export users &amp; tasks summary
            </p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDownloadReport("users");
              }}
              disabled={downloadingType === "users"}
              className="mt-6 w-full py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#0B6E75] to-[#0E7C86] hover:from-[#095C62] hover:to-[#0B6B74] active:scale-[0.99] text-white text-[13.5px] font-semibold inline-flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(11,110,117,0.22)] transition-all cursor-pointer disabled:opacity-75"
            >
              {downloadingType === "users" ? (
                <LoadingSpinner className="h-4 w-4" />
              ) : (
                <Download className="w-4 h-4 stroke-[2.2]" />
              )}
              <span>
                {downloadingType === "users"
                  ? "Exporting..."
                  : "Download Report"}
              </span>
            </button>
          </div>
        </section>

        {/* 4. Bottom Section: Report Overview */}
        <section
          aria-label="Report Overview"
          className="mt-5 bg-white rounded-2xl border border-[#EDF2F7] shadow-[0_2px_10px_rgba(15,23,42,0.025)] px-6 py-5 sm:px-7 sm:py-6"
        >
          <h3 className="text-[16px] font-bold text-[#0F172A] tracking-[-0.01em]">
            Report Overview
          </h3>

          <div className="mt-4 grid grid-cols-3 gap-4 sm:gap-8">
            {/* Stat 1: Total Tasks */}
            <div className="flex flex-col items-start">
              <div className="inline-flex items-center gap-2 h-11 px-3 rounded-full bg-[#E6F7F7]">
                <MiniClipboardIcon />
                <span className="text-[20px] font-bold text-[#0F766E] leading-none">
                  {overviewStats.firstValue}
                </span>
              </div>

              <div className="mt-2.5 pl-1 flex items-center">
                <MiniGroupIcon />
              </div>

              <span className="mt-1 text-[14.5px] font-medium text-[#334155]">
                {overviewStats.firstLabel}
              </span>
            </div>

            {/* Stat 2: Completed */}
            <div className="flex flex-col items-start">
              <div className="w-11 h-11 rounded-full bg-[#E6F9EE] flex items-center justify-center">
                <div className="w-7 h-7 rounded-full bg-[#10B981] flex items-center justify-center text-white">
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    className="w-4 h-4"
                    aria-hidden="true"
                  >
                    <path
                      d="M3.5 8.2L6.5 11.2L12.5 5"
                      stroke="currentColor"
                      strokeWidth="2.1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <span className="mt-2.5 pl-1 text-[13.5px] font-bold text-[#047857] leading-none">
                {overviewStats.secondValue}
              </span>

              <span className="mt-1 text-[14.5px] font-medium text-[#334155]">
                {overviewStats.secondLabel}
              </span>
            </div>

            {/* Stat 3: Overdue */}
            <div className="flex flex-col items-start">
              <div className="w-11 h-11 rounded-full bg-[#FFF3E6] flex items-center justify-center">
                <OverdueClockIcon />
              </div>

              <span className="mt-2.5 pl-1.5 text-[13.5px] font-bold text-[#DC2626] leading-none">
                {overviewStats.thirdValue}
              </span>

              <span className="mt-1 text-[14.5px] font-medium text-[#334155]">
                {overviewStats.thirdLabel}
              </span>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}
