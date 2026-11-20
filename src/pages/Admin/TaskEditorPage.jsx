import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckSquare2,
  FileText,
  Paperclip,
  Save,
  Users,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import { FormSkeleton } from "../../components/common/LoadingSkeleton";
import PreparationCard from "../../components/common/PreparationCard";
import {
  notifyError,
  notifySuccess,
} from "../../components/common/notifications";

const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15";

export default function TaskEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const returnToTasks = () => navigate("/admin/tasks");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [originalChecklist, setOriginalChecklist] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "Pending",
    dueDate: "",
    assignedTo: [],
    attachments: "",
    checklist: "",
  });

  useEffect(() => {
    let active = true;
    Promise.all([
      api.get(API_PATHS.USERS.LIST),
      isEdit
        ? api.get(API_PATHS.TASKS.BY_ID(id))
        : Promise.resolve({ data: null }),
    ])
      .then(([usersResponse, taskResponse]) => {
        if (!active) return;
        setUsers(usersResponse.data || []);
        const task = taskResponse.data;
        if (task) {
          const checklist = task.todoChecklist || [];
          setOriginalChecklist(checklist);
          setForm({
            title: task.title || "",
            description: task.description || "",
            priority: task.priority || "medium",
            status: task.status || "Pending",
            dueDate: task.dueDate
              ? new Date(task.dueDate).toISOString().slice(0, 10)
              : "",
            assignedTo: (task.assignedTo || []).map((user) => user._id || user),
            attachments: (task.attachments || []).join("\n"),
            checklist: checklist.map((item) => item.text).join("\n"),
          });
        }
      })
      .catch((requestError) => {
        if (active)
          setError(
            requestError.response?.data?.message ||
              "Unable to load task form data.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id, isEdit]);

  const update = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const checklist = form.checklist
      .split("\n")
      .map((text) => text.trim())
      .filter(Boolean)
      .map((text, index) => ({
        text,
        completed: Boolean(originalChecklist[index]?.completed),
      }));
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      dueDate: form.dueDate || null,
      assignedTo: form.assignedTo,
      attachments: form.attachments
        .split("\n")
        .map((value) => value.trim())
        .filter(Boolean),
      todoChecklist: checklist,
    };
    try {
      setSaving(true);
      if (isEdit) {
        await api.put(API_PATHS.TASKS.BY_ID(id), payload);
        if (
          form.status !== (await api.get(API_PATHS.TASKS.BY_ID(id))).data.status
        ) {
          await api.put(API_PATHS.TASKS.STATUS(id), { status: form.status });
        }
      } else {
        await api.post(API_PATHS.TASKS.CREATE, {
          ...payload,
          status: form.status,
        });
      }
      notifySuccess(
        isEdit ? "Task updated successfully." : "Task created successfully.",
      );
      returnToTasks();
    } catch (requestError) {
      const message =
        requestError.response?.data?.message || "Unable to save this task.";
      setError(message);
      notifyError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    if (isEdit) {
      return (
        <PreparationCard
          statusLabel="Preparing task editor"
          title="Preparing task details"
          description="We're loading the task and its assigned team members so the editor is ready."
          waitMessage="Waiting for task and team data…"
          items={[
            {
              icon: CheckSquare2,
              title: "Task information",
              description: "Loading task details",
            },
            {
              icon: Users,
              title: "Assigned team",
              description: "Loading available users",
            },
          ]}
        />
      );
    }

    return <FormSkeleton fields={6} />;
  }

  return (
    <section className="mx-auto w-full">
      <button
        type="button"
        onClick={returnToTasks}
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-teal-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to all tasks
      </button>
      <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
        <header className="border-b border-slate-100 bg-gradient-to-r from-teal-50/80 to-white px-6 py-6 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500 text-white shadow-lg shadow-teal-500/20">
              <CheckSquare2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                {isEdit ? "Update task" : "Create a task"}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Add all the details your team needs to get started.
              </p>
            </div>
          </div>
        </header>
        <form onSubmit={handleSubmit} className="space-y-7 p-6 sm:p-8">
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}
          <div className="grid gap-6 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Task title <span className="text-red-500">*</span>
              </span>
              <input
                required
                autoFocus
                value={form.title}
                onChange={(event) => update("title", event.target.value)}
                placeholder="e.g. Prepare product launch plan"
                className={fieldClass}
              />
            </label>
            <label className="block md:col-span-2">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <FileText className="h-4 w-4 text-teal-600" />
                Description
              </span>
              <textarea
                rows={4}
                value={form.description}
                onChange={(event) => update("description", event.target.value)}
                placeholder="Describe the task, expected outcome, and any useful context..."
                className={`${fieldClass} resize-y`}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Priority
              </span>
              <select
                value={form.priority}
                onChange={(event) => update("priority", event.target.value)}
                className={fieldClass}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Status
              </span>
              <select
                value={form.status}
                onChange={(event) => update("status", event.target.value)}
                className={fieldClass}
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <CalendarDays className="h-4 w-4 text-teal-600" />
                Due date
              </span>
              <input
                type="date"
                value={form.dueDate}
                onChange={(event) => update("dueDate", event.target.value)}
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Users className="h-4 w-4 text-teal-600" />
                Assign to
              </span>
              <select
                multiple
                value={form.assignedTo}
                onChange={(event) =>
                  update(
                    "assignedTo",
                    Array.from(
                      event.target.selectedOptions,
                      (option) => option.value,
                    ),
                  )
                }
                className={`${fieldClass} min-h-32 py-2`}
                aria-label="Assigned users"
              >
                {users.map((user) => (
                  <option
                    key={user._id}
                    value={user._id}
                    className="rounded-md px-2 py-1"
                  >
                    {user.name} · {user.email}{" "}
                    {user.role === "superadmin"
                      ? "· Super Admin"
                      : user.role === "admin"
                        ? "· Admin"
                        : ""}
                  </option>
                ))}
              </select>
              <span className="mt-1.5 block text-xs text-slate-400">
                Select multiple people with Ctrl or Command.
              </span>
            </label>
            <label className="block md:col-span-2">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Paperclip className="h-4 w-4 text-teal-600" />
                Attachments
              </span>
              <textarea
                rows={3}
                value={form.attachments}
                onChange={(event) => update("attachments", event.target.value)}
                placeholder="Paste one attachment URL per line"
                className={`${fieldClass} resize-y`}
              />
              <span className="mt-1.5 block text-xs text-slate-400">
                Enter one URL per line.
              </span>
            </label>
            <label className="block md:col-span-2">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <CheckSquare2 className="h-4 w-4 text-teal-600" />
                Checklist
              </span>
              <textarea
                rows={4}
                value={form.checklist}
                onChange={(event) => update("checklist", event.target.value)}
                placeholder={"Gather requirements\nReview the final result"}
                className={`${fieldClass} resize-y`}
              />
              <span className="mt-1.5 block text-xs text-slate-400">
                Enter one checklist item per line.
              </span>
            </label>
          </div>
          <footer className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={returnToTasks}
              disabled={saving}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !form.title.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/20 transition hover:from-teal-600 hover:to-teal-700 disabled:cursor-wait disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving
                ? "Saving task..."
                : isEdit
                  ? "Save changes"
                  : "Create task"}
            </button>
          </footer>
        </form>
      </div>
    </section>
  );
}
