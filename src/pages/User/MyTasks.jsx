import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  CheckSquare2,
  Circle,
  Clock3,
  Search,
} from "lucide-react";
import api from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import PreparationCard from "../../components/common/PreparationCard";

const statusStyles = {
  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  "In Progress": "bg-blue-50 text-blue-700 ring-blue-200",
  Completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const priorityStyles = {
  high: "bg-rose-50 text-rose-700",
  medium: "bg-orange-50 text-orange-700",
  low: "bg-slate-100 text-slate-600",
};

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "No due date";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All tasks");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api
      .get(API_PATHS.TASKS.LIST, { params: { mine: true } })
      .then(({ data }) => {
        if (active) setTasks(data.tasks || []);
      })
      .catch((requestError) => {
        if (active) {
          setError(
            requestError.response?.data?.message ||
              "Unable to load your tasks.",
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

  const counts = useMemo(
    () => ({
      all: tasks.length,
      pending: tasks.filter((task) => task.status === "Pending").length,
      inProgress: tasks.filter((task) => task.status === "In Progress").length,
      completed: tasks.filter((task) => task.status === "Completed").length,
    }),
    [tasks],
  );

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesStatus =
        statusFilter === "All tasks" || task.status === statusFilter;
      const matchesSearch =
        !query ||
        task.title?.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [tasks, statusFilter, search]);

  if (loading) {
    return (
      <PreparationCard
        statusLabel="Preparing your workspace"
        title="Preparing your tasks"
        description="We're gathering the tasks assigned to your account, including their progress and checklist details."
        waitMessage="Waiting for your task data…"
        items={[
          {
            icon: CheckSquare2,
            title: "Task assignments",
            description: "Loading your assigned tasks",
          },
          {
            icon: CheckCircle2,
            title: "Progress & checklists",
            description: "Preparing your task progress",
          },
        ]}
      />
    );
  }

  return (
    <section className="mx-auto w-full">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-teal-700">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
            Your workspace
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            My Tasks
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Stay on top of your work and keep each task moving forward.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-500 shadow-sm">
          <CheckSquare2 className="h-4 w-4 text-teal-600" />
          <span>
            <strong className="text-slate-800">{counts.all}</strong> assigned
            tasks
          </span>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: "All tasks",
            count: counts.all,
            icon: CheckSquare2,
            color: "text-slate-600",
            iconBg: "bg-slate-100",
          },
          {
            label: "Pending",
            count: counts.pending,
            icon: Circle,
            color: "text-amber-600",
            iconBg: "bg-amber-50",
          },
          {
            label: "In progress",
            count: counts.inProgress,
            icon: Clock3,
            color: "text-blue-600",
            iconBg: "bg-blue-50",
          },
          {
            label: "Completed",
            count: counts.completed,
            icon: CheckCircle2,
            color: "text-emerald-600",
            iconBg: "bg-emerald-50",
          },
        ].map(({ label, count, icon: Icon, color, iconBg }) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="flex items-center justify-between">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg} ${color}`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                {count}
              </span>
            </div>
            <p className="mt-3 text-xs font-medium text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="font-semibold text-slate-900">Assigned to me</h2>
            <p className="mt-1 text-xs text-slate-500">
              Open a task to review its details and checklist.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tasks"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 sm:w-52"
              />
            </label>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter tasks by status"
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-teal-500"
            >
              <option>All tasks</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="m-5 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            {error}
          </div>
        )}
        {filteredTasks.length ? (
          <div className="divide-y divide-slate-100">
            {filteredTasks.map((task) => {
              const checklist = task.todoChecklist || [];
              const doneCount = checklist.filter(
                (item) => item.completed,
              ).length;
              const progress =
                task.progress ??
                (checklist.length
                  ? Math.round((doneCount / checklist.length) * 100)
                  : 0);
              return (
                <Link
                  key={task._id}
                  to={`/user/task-details/${task._id}`}
                  className="group flex flex-col gap-4 px-4 py-4 transition hover:bg-slate-50/80 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-semibold text-slate-800 group-hover:text-teal-700">
                        {task.title}
                      </h3>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${statusStyles[task.status] || statusStyles.Pending}`}
                      >
                        {task.status}
                      </span>
                    </div>
                    <p className="mt-1.5 line-clamp-1 text-sm text-slate-500">
                      {task.description || "No description provided."}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(task.dueDate)}
                      </span>
                      <span
                        className={`rounded-md px-2 py-1 font-semibold capitalize ${priorityStyles[task.priority] || priorityStyles.low}`}
                      >
                        {task.priority || "low"} priority
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:w-44 sm:shrink-0">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1.5 flex justify-between text-[11px] font-medium text-slate-500">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-teal-500 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="mt-1.5 text-[11px] text-slate-400">
                        {checklist.length
                          ? `${doneCount} of ${checklist.length} steps`
                          : "No checklist"}
                      </p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-teal-600" />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <CheckSquare2 className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-semibold text-slate-800">
              {tasks.length ? "No matching tasks" : "No tasks assigned yet"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {tasks.length
                ? "Try changing the search or status filter."
                : "Tasks assigned to you will appear here."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
