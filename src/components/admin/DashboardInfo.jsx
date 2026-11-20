import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import { SkeletonBlock } from "../common/LoadingSkeleton";
import {
  CheckSquare,
  ListTodo,
  BarChart3,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Clock,
  CheckCircle2,
  TrendingUp,
  Calendar,
} from "lucide-react";

const DONUT_CIRCUMFERENCE = 2 * Math.PI * 40;

function AnimatedNumber({ value }) {
  const target = Number.isFinite(Number(value))
    ? Math.max(0, Math.round(Number(value)))
    : 0;
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 900;
    const startTime = performance.now();
    let frameId;

    const animate = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = 1 - (1 - progress) ** 3;
      setCount(Math.round(target * easedProgress));
      if (progress < 1) frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [target]);

  return <>{count.toLocaleString()}</>;
}

function DashboardInfo() {
  const navigate = useNavigate();
  const dateRange = "Last 7 Days";
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartProgress, setChartProgress] = useState(0);
  const [loadError, setLoadError] = useState("");
  const [user] = useState(() => {
    const value = document.cookie.split("; ").find((item) => item.startsWith("user="))?.slice(5);
    try { return value ? JSON.parse(decodeURIComponent(value)) : null; } catch { return null; }
  });
  useEffect(() => {
    let active = true;
    api
      .get(API_PATHS.TASKS.DASHBOARD)
      .then(({ data }) => {
        if (active) setDashboard(data);
      })
      .catch((error) => {
        if (active) {
          setLoadError(
            error.response?.data?.message || "Unable to load dashboard data.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (loading || !dashboard) return undefined;

    const duration = 1000;
    const startTime = performance.now();
    let frameId;
    const animate = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setChartProgress(1 - (1 - progress) ** 3);
      if (progress < 1) frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [dashboard, loading]);

  if (loadError) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-rose-100 bg-white p-5 text-sm text-rose-700"
      >
        {loadError}
      </div>
    );
  }
  const recentTasks = dashboard?.recentTasks?.slice(0, 5).map((task) => ({
    id: task._id,
    title: task.title,
    priority: task.priority?.[0]?.toUpperCase() + task.priority?.slice(1),
    status: task.status,
    date: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—",
    avatar: task.assignedTo?.[0]?.profileImageUrl || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
  })) || [];
  const taskDistribution = dashboard?.charts?.taskDistribution || {};
  const statusTotal = Number(
    taskDistribution.All ?? dashboard?.statistics?.totalTasks ?? 0,
  );
  const statusSegments = [
    {
      label: "Completed",
      count: Number(taskDistribution.completed ?? dashboard?.statistics?.completedTasks ?? 0),
      color: "#10B981",
      legendColor: "bg-emerald-500",
    },
    {
      label: "In Progress",
      count: Number(taskDistribution.in_progress ?? 0),
      color: "#3B82F6",
      legendColor: "bg-blue-500",
    },
    {
      label: "Pending",
      count: Number(taskDistribution.pending ?? dashboard?.statistics?.pendingTasks ?? 0),
      color: "#F59E0B",
      legendColor: "bg-amber-500",
    },
  ];
  let accumulatedStatusLength = 0;
  const animatedStatusSegments = statusSegments.map((segment) => {
    const targetLength =
      statusTotal > 0
        ? (segment.count / statusTotal) * DONUT_CIRCUMFERENCE
        : 0;
    const animatedSegment = {
      ...segment,
      dashLength: targetLength * chartProgress,
      dashOffset: -accumulatedStatusLength * chartProgress,
      percentage:
        statusTotal > 0
          ? Math.round((segment.count / statusTotal) * 100)
          : 0,
    };
    accumulatedStatusLength += targetLength;
    return animatedSegment;
  });
  const priorityDistribution = dashboard?.charts?.taskPriorityLevel || {};
  const prioritySegments = [
    {
      label: "Low",
      count: Number(priorityDistribution.low ?? 0),
      color: "bg-emerald-500",
      hoverColor: "group-hover:bg-emerald-600",
    },
    {
      label: "Medium",
      count: Number(priorityDistribution.medium ?? 0),
      color: "bg-blue-500",
      hoverColor: "group-hover:bg-blue-600",
    },
    {
      label: "High",
      count: Number(priorityDistribution.high ?? 0),
      color: "bg-amber-500",
      hoverColor: "group-hover:bg-amber-600",
    },
  ];
  const maxPriorityCount = Math.max(
    1,
    ...prioritySegments.map((segment) => segment.count),
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden">
        <div className="z-10 max-w-xl">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Welcome back, {user?.name || ""}!{" "}
            <span className="inline-block animate-bounce">👋</span>
          </h2>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            Here's what's happening with your tasks today.
          </p>
        </div>

        {/* Right side banner elements: Date filter & SVG Clipboard illustration */}
        <div className="flex items-center space-x-6 z-10">
          <div className="relative">
            <button className="flex items-center space-x-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 transition-colors shadow-sm">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{dateRange}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Clipboard Illustration */}
          <div className="hidden md:flex items-center justify-center relative w-28 h-28 bg-teal-50/60 rounded-2xl border border-teal-100/60">
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-teal-400/20 rounded-full blur-md"></div>
            <div className="relative text-teal-600">
              <svg
                className="w-16 h-16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect
                  x="5"
                  y="4"
                  width="14"
                  height="18"
                  rx="2"
                  className="fill-teal-500/10 stroke-teal-600"
                />
                <path d="M9 9h6M9 13h6M9 17h4" strokeLinecap="round" />
                <circle
                  cx="16"
                  cy="16"
                  r="5"
                  className="fill-white stroke-teal-600"
                />
                <path d="M16 13v3l2 1" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Decorative background gradient blobs */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-teal-50/50 to-transparent pointer-events-none"></div>
      </div>

      {/* ================= 4 STAT CARDS ROW ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Tasks */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div className="flex items-center space-x-1 text-emerald-600 text-xs font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12%</span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
              <AnimatedNumber value={dashboard?.statistics?.totalTasks ?? 0} />
            </h3>
            <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">
              Total Tasks
            </p>
          </div>
          {/* Subtle background wave accent */}
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-teal-50 rounded-full blur-xl group-hover:scale-125 transition-transform pointer-events-none"></div>
        </div>

        {/* Card 2: Pending */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <Clock className="w-6 h-6" />
            </div>
            <div className="flex items-center space-x-1 text-emerald-600 text-xs font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+5%</span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
              <AnimatedNumber value={dashboard?.statistics?.pendingTasks ?? 0} />
            </h3>
            <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">
              Pending
            </p>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-50 rounded-full blur-xl group-hover:scale-125 transition-transform pointer-events-none"></div>
        </div>

        {/* Card 3: In Progress */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <div className="w-0 h-0 border-t-6 border-t-transparent border-l-10 border-l-white border-b-6 border-b-transparent ml-0.5"></div>
            </div>
            <div className="flex items-center space-x-1 text-emerald-600 text-xs font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+8%</span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
              <AnimatedNumber value={taskDistribution.in_progress ?? 0} />
            </h3>
            <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">
              In Progress
            </p>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-50 rounded-full blur-xl group-hover:scale-125 transition-transform pointer-events-none"></div>
        </div>

        {/* Card 4: Completed */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="flex items-center space-x-1 text-emerald-600 text-xs font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+15%</span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
              <AnimatedNumber value={dashboard?.statistics?.completedTasks ?? 0} />
            </h3>
            <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">
              Completed
            </p>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-50 rounded-full blur-xl group-hover:scale-125 transition-transform pointer-events-none"></div>
        </div>
      </div>

      {/* ================= BOTTOM 3 CARDS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Task Status Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="mb-6 flex items-center">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-teal-500" />
                <h3 className="font-bold text-slate-900 text-base">
                  Task Status Distribution
                </h3>
              </div>
            </div>

            {/* Donut Chart Visual */}
            <div className="flex items-center justify-center my-4">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  {animatedStatusSegments.map((segment) => (
                    <circle
                      key={segment.label}
                      cx="50"
                      cy="50"
                      r="40"
                      stroke={segment.color}
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${segment.dashLength} ${DONUT_CIRCUMFERENCE}`}
                      strokeDashoffset={segment.dashOffset}
                      strokeLinecap="round"
                    />
                  ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-extrabold text-slate-900">
                    <AnimatedNumber
                      value={dashboard?.statistics?.totalTasks ?? 0}
                    />
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Total
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3 mt-6 pt-4 border-t border-slate-100">
            {animatedStatusSegments.map((segment) => (
              <div
                key={segment.label}
                className="flex items-center justify-between text-xs font-medium"
              >
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-3 h-3 rounded-full ${segment.legendColor}`}
                  />
                  <span className="text-slate-600">{segment.label}</span>
                </div>
                <span className="font-bold text-slate-800">
                  <AnimatedNumber value={segment.count} /> (
                  {segment.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Priority Levels Bar Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="mb-6 flex items-center">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-teal-500" />
                <h3 className="font-bold text-slate-900 text-base">
                  Priority Levels
                </h3>
              </div>
            </div>

            {/* Bar Chart Visual */}
            <div className="mt-6 pt-2">
              <div className="relative h-48 border-l border-b border-slate-200 flex items-end justify-around px-4 pb-2">
                {/* Y-axis labels */}
                <div className="absolute -left-6 top-0 text-[10px] text-slate-400">
                  {maxPriorityCount}
                </div>
                <div className="absolute -left-6 top-1/2 text-[10px] text-slate-400">
                  {Math.ceil(maxPriorityCount / 2)}
                </div>
                <div className="absolute -left-6 bottom-2 text-[10px] text-slate-400">
                  0
                </div>

                {/* Grid lines */}
                <div className="absolute left-0 right-0 top-1/2 border-t border-slate-100 border-dashed pointer-events-none"></div>

                {prioritySegments.map((segment) => (
                  <div
                    key={segment.label}
                    className="flex flex-col items-center gap-2 group cursor-pointer z-10"
                  >
                    <span className="text-xs font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      <AnimatedNumber value={segment.count} />
                    </span>
                    <div
                      className={`w-12 ${segment.color} ${segment.hoverColor} rounded-t-xl shadow-md transition-colors`}
                      style={{
                        height: `${(segment.count / maxPriorityCount) * 128 * chartProgress}px`,
                      }}
                    />
                    <span className="text-xs font-semibold text-slate-500 mt-1">
                      {segment.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Recent Tasks Table */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <ListTodo className="w-5 h-5 text-teal-500" />
                <h3 className="font-bold text-slate-900 text-base">
                  Recent Tasks
                </h3>
              </div>
              <button
                type="button"
                onClick={() => navigate("/admin/tasks")}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 group"
              >
                View All{" "}
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Tasks List */}
            <div className="divide-y divide-slate-50">
              {loading ? (
                <div
                  role="status"
                  aria-label="Loading recent tasks"
                  aria-busy="true"
                  className="space-y-3 py-2"
                >
                  {Array.from({ length: 4 }, (_, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 px-2 py-3"
                    >
                      <SkeletonBlock className="h-8 w-8 shrink-0 rounded-full" />
                      <div className="min-w-0 flex-1 space-y-2">
                        <SkeletonBlock className="h-3 w-3/4" />
                        <div className="flex gap-2">
                          <SkeletonBlock className="h-4 w-12 rounded-full" />
                          <SkeletonBlock className="h-4 w-16 rounded-full" />
                        </div>
                      </div>
                      <SkeletonBlock className="h-3 w-12" />
                    </div>
                  ))}
                </div>
              ) : recentTasks.map((task) => {
                const priorityColor =
                  task.priority === "High"
                    ? "bg-red-50 text-red-600 border-red-100"
                    : task.priority === "Medium"
                      ? "bg-amber-50 text-amber-600 border-amber-100"
                      : "bg-emerald-50 text-emerald-600 border-emerald-100";

                const statusColor =
                  task.status === "Completed"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : task.status === "In Progress"
                      ? "bg-blue-50 text-blue-600 border-blue-100"
                      : "bg-amber-50 text-amber-600 border-amber-100";

                return (
                  <div
                    key={task.id}
                    className="py-3 flex items-center justify-between hover:bg-slate-50/60 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={task.avatar}
                        alt="Assignee"
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">
                          {task.title}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityColor}`}
                          >
                            {task.priority}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor}`}
                          >
                            {task.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 text-right">
                      <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                        {task.date}
                      </span>
                      <button className="text-slate-400 hover:text-slate-600 p-1">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
              {!loading && recentTasks.length === 0 && (
                <p className="py-6 text-center text-xs text-slate-400">
                  No tasks available
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardInfo;
