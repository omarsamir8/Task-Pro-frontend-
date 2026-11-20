import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CheckSquare2,
  Clock3,
  FileText,
  Paperclip,
  Users,
} from "lucide-react";
import api from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import PreparationCard from "../../components/common/PreparationCard";
import {
  notifyError,
  notifySuccess,
} from "../../components/common/notifications";

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
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Not set";

export default function ViewTaskDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminTask = location.pathname.startsWith("/admin/");
  const backPath = isAdminTask ? "/admin/tasks" : "/user/tasks";
  const backLabel = isAdminTask ? "all tasks" : "my tasks";
  const [taskState, setTaskState] = useState({
    id: null,
    task: null,
    loading: true,
    error: "",
  });
  const [savingItem, setSavingItem] = useState(null);
  const loading = taskState.id !== id || taskState.loading;
  const task = taskState.id === id ? taskState.task : null;
  const error = taskState.id === id ? taskState.error : "";

  useEffect(() => {
    let active = true;
    api
      .get(API_PATHS.TASKS.BY_ID(id))
      .then(({ data }) => {
        if (active) setTaskState({ id, task: data, loading: false, error: "" });
      })
      .catch((requestError) => {
        if (active) {
          setTaskState({
            id,
            task: null,
            loading: false,
            error:
              requestError.response?.data?.message ||
              "Unable to load this task.",
          });
        }
      });
    return () => {
      active = false;
    };
  }, [id]);

  const checklist = task?.todoChecklist || [];
  const completedCount = checklist.filter((item) => item.completed).length;
  const progress = useMemo(
    () =>
      task?.progress ??
      (checklist.length
        ? Math.round((completedCount / checklist.length) * 100)
        : 0),
    [task?.progress, checklist.length, completedCount],
  );

  const toggleChecklistItem = async (index) => {
    if (!task || savingItem !== null) return;
    setTaskState((current) => ({ ...current, error: "" }));
    setSavingItem(index);
    const todoChecklist = checklist.map((item, itemIndex) =>
      itemIndex === index ? { ...item, completed: !item.completed } : item,
    );
    try {
      const { data } = await api.put(API_PATHS.TASKS.CHECKLIST(id), {
        todoChecklist,
      });
      setTaskState((current) => ({ ...current, task: data.task }));
      notifySuccess("Checklist progress saved.");
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        "Unable to update this checklist item. Please try again.";
      setTaskState((current) => ({
        ...current,
        error: message,
      }));
      notifyError(message);
    } finally {
      setSavingItem(null);
    }
  };

  if (loading) {
    return (
      <PreparationCard
        statusLabel="Preparing task details"
        title="Preparing task details"
        description="We're fetching the task information and checklist. The details will appear as soon as the task API responds."
        waitMessage="Waiting for the task details API…"
        items={[
          {
            icon: FileText,
            title: "Task overview",
            description: "Loading task information",
          },
          {
            icon: CheckSquare2,
            title: "Task checklist",
            description: "Loading checklist items",
          },
        ]}
      />
    );
  }

  if (!task) {
    return (
      <section className="mx-auto w-full max-w-4xl">
        <button
          type="button"
          onClick={() => navigate(backPath)}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to {backLabel}
        </button>
        <div
          role="alert"
          className="rounded-2xl border border-rose-100 bg-white p-6 text-sm text-rose-700 shadow-sm"
        >
          {error || "This task could not be found."}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full min-w-0 pb-0 [overflow-anchor:none]">
      <Link
        to={backPath}
        className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-teal-700"
      >
        <ArrowLeft className="h-4 w-4" /> Back to {backLabel}
      </Link>

      <article className="min-w-0 rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
        <header className="border-b border-slate-100 bg-gradient-to-br from-teal-50/80 via-white to-white p-3 sm:p-4">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-500 text-white shadow-lg shadow-teal-500/20">
                <CheckSquare2 className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-teal-700">
                  Task details
                </p>
                <h1 className="break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {task.title}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[task.status] || statusStyles.Pending}`}
                  >
                    {task.status}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${priorityStyles[task.priority] || priorityStyles.low}`}
                  >
                    {task.priority || "low"} priority
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full rounded-xl border border-slate-200/80 bg-white/80 p-4 sm:w-48 sm:shrink-0">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-500">Progress</span>
                <span className="font-bold text-slate-900">{progress}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-teal-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-400">
                {completedCount} of {checklist.length} steps complete
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-4 p-3 sm:p-4">
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700"
            >
              {error}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-[1fr_220px]">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <FileText className="h-4 w-4 text-teal-600" /> Description
              </h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                {task.description ||
                  "No description was provided for this task."}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-1">
              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-2.5">
                <p className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  <CalendarDays className="h-4 w-4" /> Due date
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-800">
                  {formatDate(task.dueDate)}
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-2.5">
                <p className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  {task.status === "Completed" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Clock3 className="h-4 w-4" />
                  )}
                  Current status
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-800">
                  {task.status}
                </p>
              </div>
            </div>
          </div>

          <section aria-labelledby="checklist-heading">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2
                  id="checklist-heading"
                  className="text-base font-bold text-slate-900"
                >
                  Task checklist
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Check off each step as you complete it.
                </p>
              </div>
              <span className="mt-2 text-xs font-semibold text-slate-500 sm:mt-0">
                {completedCount}/{checklist.length} completed
              </span>
            </div>
            {checklist.length ? (
              <div className="mt-3 space-y-2">
                {checklist.map((item, index) => {
                  const checked = Boolean(item.completed);
                  return (
                    <div
                      key={item._id || `${item.text}-${index}`}
                      className={`group flex items-center gap-3 rounded-xl border p-2.5 transition ${
                        checked
                          ? "border-teal-100 bg-teal-50/60"
                          : "border-slate-200 bg-white hover:border-teal-200 hover:bg-slate-50/70"
                      } ${savingItem !== null ? "cursor-wait" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={savingItem !== null}
                        onChange={() => toggleChecklistItem(index)}
                        className="peer h-5 w-5 shrink-0 cursor-pointer accent-teal-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/20 disabled:cursor-wait"
                        aria-label={`Mark ${item.text} ${checked ? "incomplete" : "complete"}`}
                      />
                      <span
                        className={`min-w-0 flex-1 text-sm font-medium ${
                          checked
                            ? "text-slate-500 line-through decoration-slate-400"
                            : "text-slate-700"
                        }`}
                      >
                        {item.text}
                      </span>
                      {savingItem === index && (
                        <span className="text-xs font-medium text-teal-700">
                          Saving...
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-5 py-8 text-center">
                <CheckSquare2 className="mx-auto h-6 w-6 text-slate-300" />
                <p className="mt-2 text-sm font-medium text-slate-600">
                  No checklist items for this task
                </p>
              </div>
            )}
          </section>

          {(task.assignedTo?.length > 0 || task.attachments?.length > 0) && (
            <div className="grid gap-6 border-t border-slate-100 pt-6 sm:grid-cols-2">
              {task.assignedTo?.length > 0 && (
                <section>
                  <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Users className="h-4 w-4 text-teal-600" /> Assigned to
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {task.assignedTo.map((user) => (
                      <span
                        key={user._id || user}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600"
                      >
                        {user.name || "Team member"}
                      </span>
                    ))}
                  </div>
                </section>
              )}
              {task.attachments?.length > 0 && (
                <section>
                  <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Paperclip className="h-4 w-4 text-teal-600" /> Attachments
                  </h2>
                  <div className="mt-3 space-y-2">
                    {task.attachments.map((attachment, index) => (
                      <a
                        key={`${attachment}-${index}`}
                        href={attachment}
                        target="_blank"
                        rel="noreferrer"
                        className="block truncate rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-teal-700 transition hover:border-teal-200 hover:bg-teal-50"
                      >
                        {attachment}
                      </a>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </article>
    </section>
  );
}
