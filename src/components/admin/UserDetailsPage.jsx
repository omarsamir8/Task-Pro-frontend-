import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  FileText,
  ListTodo,
  Mail,
  Pencil,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import api from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import PreparationCard from "../common/PreparationCard";

const taskStatusStyles = {
  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  "In Progress": "bg-blue-50 text-blue-700 ring-blue-200",
  Completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const taskPriorityStyles = {
  high: "bg-rose-50 text-rose-700",
  medium: "bg-orange-50 text-orange-700",
  low: "bg-slate-100 text-slate-600",
};

const formatDate = (date, fallback = "Not available") => {
  if (!date) return fallback;
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? fallback
    : parsedDate.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
};

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase();
}

export default function UserDetailsPage() {
  const { id } = useParams();
  const [userState, setUserState] = useState({
    id: null,
    user: null,
    loading: true,
    error: "",
  });
  const loading = userState.id !== id || userState.loading;
  const user = userState.id === id ? userState.user : null;
  const error = userState.id === id ? userState.error : "";
  const tasks = useMemo(() => user?.tasks || [], [user]);

  useEffect(() => {
    let active = true;
    api
      .get(API_PATHS.USERS.BY_ID(id))
      .then(({ data }) => {
        if (active) {
          setUserState({ id, user: data, loading: false, error: "" });
        }
      })
      .catch((requestError) => {
        if (active) {
          setUserState({
            id,
            user: null,
            loading: false,
            error:
              requestError.response?.data?.message ||
              "Unable to load this user's details.",
          });
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

  const taskCounts = useMemo(
    () => ({
      total: tasks.length,
      pending: tasks.filter((task) => task.status === "Pending").length,
      inProgress: tasks.filter((task) => task.status === "In Progress").length,
      completed: tasks.filter((task) => task.status === "Completed").length,
    }),
    [tasks],
  );

  if (loading) {
    return (
      <PreparationCard
        statusLabel="Preparing user profile"
        title="Preparing user details"
        description="We're loading the user's account information and assigned tasks."
        waitMessage="Waiting for user details…"
        items={[
          {
            icon: UserRound,
            title: "User profile",
            description: "Loading account information",
          },
          {
            icon: ListTodo,
            title: "Assigned tasks",
            description: "Loading task memberships",
          },
        ]}
      />
    );
  }

  if (!user) {
    return (
      <section className="mx-auto w-full max-w-4xl">
        <Link
          to="/admin/users"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to users
        </Link>
        <div
          role="alert"
          className="rounded-2xl border border-rose-100 bg-white p-6 text-sm text-rose-700 shadow-sm"
        >
          {error || "This user could not be found."}
        </div>
      </section>
    );
  }

  const memberSince = formatDate(user.createdAt);
  const isAdmin = ["admin", "superadmin"].includes(user.role);
  const roleLabel =
    user.role === "superadmin"
      ? "Super Admin"
      : isAdmin
        ? "Admin"
        : "Member";
  const metrics = [
    {
      label: "Assigned tasks",
      value: taskCounts.total,
      icon: ListTodo,
      color: "text-teal-700",
      background: "bg-teal-50",
    },
    {
      label: "Pending",
      value: taskCounts.pending,
      icon: Circle,
      color: "text-amber-700",
      background: "bg-amber-50",
    },
    {
      label: "In progress",
      value: taskCounts.inProgress,
      icon: Clock3,
      color: "text-blue-700",
      background: "bg-blue-50",
    },
    {
      label: "Completed",
      value: taskCounts.completed,
      icon: CheckCircle2,
      color: "text-emerald-700",
      background: "bg-emerald-50",
    },
  ];

  return (
    <section className="mx-auto w-full space-y-5">
      <Link
        to="/admin/users"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-teal-700"
      >
        <ArrowLeft className="h-4 w-4" /> Back to users
      </Link>

      <header className="flex flex-col gap-5 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-teal-50/60 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div className="flex min-w-0 items-center gap-4">
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={`${user.name}'s profile`}
              className="h-16 w-16 shrink-0 rounded-2xl border border-white object-cover shadow-sm ring-1 ring-slate-200"
            />
          ) : (
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-lg font-bold text-white shadow-sm shadow-teal-600/20">
              {getInitials(user.name) || <UserRound className="h-7 w-7" />}
            </span>
          )}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {user.name}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  isAdmin
                    ? "bg-violet-50 text-violet-700 ring-1 ring-violet-200"
                    : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                {roleLabel}
              </span>
            </div>
            <p className="mt-1.5 flex min-w-0 items-center gap-2 text-sm text-slate-500">
              <Mail className="h-4 w-4 shrink-0 text-teal-600" />
              <span className="truncate">{user.email}</span>
            </p>
          </div>
        </div>

        <Link
          to={`/admin/users/${user._id}/edit`}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800"
        >
          <Pencil className="h-4 w-4" />
          Edit user
        </Link>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon, color, background }) => (
          <article
            key={label}
            className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${background} ${color}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                {value}
              </span>
            </div>
            <p className="mt-3 text-xs font-medium text-slate-500">{label}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <UserRound className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-bold text-slate-900">Account information</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                User profile and membership details
              </p>
            </div>
          </div>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="text-xs font-medium text-slate-400">Full name</dt>
              <dd className="mt-1 text-sm font-semibold text-slate-800">
                {user.name}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-400">
                Email address
              </dt>
              <dd className="mt-1 break-all text-sm font-semibold text-slate-800">
                {user.email}
              </dd>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs font-medium text-slate-400">Role</dt>
                <dd className="mt-1 text-sm font-semibold capitalize text-slate-800">
                  {user.role}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-1 text-xs font-medium text-slate-400">
                  <CalendarDays className="h-3.5 w-3.5" /> Member since
                </dt>
                <dd className="mt-1 text-sm font-semibold text-slate-800">
                  {memberSince}
                </dd>
              </div>
            </div>
            {user.updatedAt && user.updatedAt !== user.createdAt && (
              <div>
                <dt className="text-xs font-medium text-slate-400">
                  Last updated
                </dt>
                <dd className="mt-1 text-sm font-semibold text-slate-800">
                  {formatDate(user.updatedAt)}
                </dd>
              </div>
            )}
          </dl>
        </article>

        <section
          aria-labelledby="user-tasks-heading"
          className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
        >
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-5 sm:px-6">
            <div>
              <h2
                id="user-tasks-heading"
                className="flex items-center gap-2 font-bold text-slate-900"
              >
                <ListTodo className="h-4 w-4 text-teal-600" />
                Tasks they&apos;re involved in
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Every task assigned to this user
              </p>
            </div>
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
              {taskCounts.total}
            </span>
          </div>

          {tasks.length ? (
            <div className="divide-y divide-slate-100">
              {tasks.map((task) => {
                const checklist = task.todoChecklist || [];
                const completedSteps = checklist.filter(
                  (item) => item.completed,
                ).length;
                const progress =
                  task.progress ??
                  (checklist.length
                    ? Math.round((completedSteps / checklist.length) * 100)
                    : 0);
                const assigneeCount = task.assignedTo?.length || 0;

                return (
                  <Link
                    key={task._id}
                    to={`/admin/tasks/${task._id}`}
                    state={{ activeNav: "All Tasks" }}
                    className="group block p-4 transition hover:bg-slate-50/80 sm:px-6"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="break-words text-sm font-semibold text-slate-800 transition group-hover:text-teal-700">
                            {task.title}
                          </h3>
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ${
                              taskStatusStyles[task.status] ||
                              taskStatusStyles.Pending
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>
                        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500">
                          {task.description || "No description provided."}
                        </p>
                      </div>
                      <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-teal-600" />
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Due {formatDate(task.dueDate, "No due date")}
                      </span>
                      <span
                        className={`rounded-md px-2 py-1 font-semibold capitalize ${
                          taskPriorityStyles[task.priority] ||
                          taskPriorityStyles.low
                        }`}
                      >
                        {task.priority || "low"} priority
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" />
                        {checklist.length
                          ? `${completedSteps}/${checklist.length} steps`
                          : "No checklist"}
                      </span>
                      <span>
                        {assigneeCount}{" "}
                        {assigneeCount === 1 ? "assignee" : "assignees"}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-teal-500 transition-all"
                          style={{
                            width: `${Math.min(100, Math.max(0, progress))}%`,
                          }}
                        />
                      </div>
                      <span className="w-9 text-right text-[11px] font-semibold text-slate-500">
                        {progress}%
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <ListTodo className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-sm font-semibold text-slate-800">
                No tasks assigned yet
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Tasks assigned to this user will appear here.
              </p>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
