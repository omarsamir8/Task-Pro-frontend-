import { useState, useMemo, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import { TableSkeleton } from "../common/LoadingSkeleton";
import { notifyError, notifySuccess } from "../common/notifications";
import {
  Plus,
  ChevronDown,
  Search,
  Calendar,
  MoreVertical,
  Pencil,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  AlertTriangle,
  Trash2,
  Eye,
} from "lucide-react";

const PRIORITY_STYLES = {
  High: "bg-[#FEE2E2] text-[#EF4444]",
  Medium: "bg-[#FEF3C7] text-[#D97706]",
  Low: "bg-[#DCFCE7] text-[#16A34A]",
};

const STATUS_STYLES = {
  "In Progress": "bg-[#DBEAFE] text-[#3B82F6]",
  Completed: "bg-[#D1FAE5] text-[#10B981]",
  Pending: "bg-[#DBEAFE] text-[#3B82F6]",
};

const normalizeTasks = (tasks) =>
  tasks.map((task) => ({
    ...task,
    id: task._id,
    priority: task.priority?.[0]?.toUpperCase() + task.priority?.slice(1),
    dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—",
  }));

export default function AllTasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [tasksError, setTasksError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Dropdown open states
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);
  const [activeActionRow, setActiveActionRow] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeletingTask, setIsDeletingTask] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Create Task Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("High");
  const [newTaskStatus, setNewTaskStatus] = useState("Pending");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState([]);
  const [newTaskAttachments, setNewTaskAttachments] = useState("");
  const [newTaskChecklist, setNewTaskChecklist] = useState("");
  const users = [];
  const isLoadingUsers = false;
  const isUpdatingTask = false;
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const statusRef = useRef(null);
  const priorityRef = useRef(null);

  const openCreateTaskPage = () => {
    navigate("/admin/create-task", { state: { activeNav: "All Tasks" } });
  };

  const loadTasks = async () => {
    const { data } = await api.get(API_PATHS.TASKS.LIST);
    setTasks(normalizeTasks(data.tasks || []));
    setTasksError("");
  };
  useEffect(() => {
    let active = true;
    api
      .get(API_PATHS.TASKS.LIST)
      .then(({ data }) =>
        active && setTasks(normalizeTasks(data.tasks || [])),
      )
      .catch((error) => {
        if (active) {
          setTasksError(
            error.response?.data?.message || "Unable to load tasks.",
          );
        }
      })
      .finally(() => {
        if (active) setIsLoadingTasks(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // Close custom dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setStatusDropdownOpen(false);
      }
      if (priorityRef.current && !priorityRef.current.contains(event.target)) {
        setPriorityDropdownOpen(false);
      }
      if (!event.target.closest("[data-action-menu]")) {
        setActiveActionRow(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        statusFilter === "All Statuses" || task.status === statusFilter;
      const matchesPriority =
        priorityFilter === "All Priorities" || task.priority === priorityFilter;
      const matchesSearch = task.title
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase());
      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [tasks, statusFilter, priorityFilter, searchQuery]);

  const pageSize = 5;
  const totalTasks = filteredTasks.length;
  const totalPages = Math.max(1, Math.ceil(totalTasks / pageSize));

  // Ensure currentPage stays valid when filters change
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + pageSize);

  const showingStart = totalTasks === 0 ? 0 : startIndex + 1;
  const showingEnd = Math.min(startIndex + pageSize, totalTasks);

  // Handle adding a new task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const todoChecklist = newTaskChecklist
      .split("\n")
      .map((text) => text.trim())
      .filter(Boolean)
      .map((text) => ({ text, completed: false }));
    const attachments = newTaskAttachments
      .split("\n")
      .map((attachment) => attachment.trim())
      .filter(Boolean);
    try {
      setIsCreatingTask(true);
      await api.post(API_PATHS.TASKS.CREATE, {
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim(),
        priority: newTaskPriority.toLowerCase(),
        status: newTaskStatus,
        dueDate: newTaskDueDate || undefined,
        assignedTo: newTaskAssignedTo,
        attachments,
        todoChecklist,
      });
      await loadTasks();
    } catch (error) {
      console.error(error.response?.data || error.message);
      return;
    } finally {
      setIsCreatingTask(false);
    }
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskPriority("High");
    setNewTaskStatus("Pending");
    setNewTaskDueDate("");
    setNewTaskAssignedTo([]);
    setNewTaskAttachments("");
    setNewTaskChecklist("");
    setIsModalOpen(false);
    setCurrentPage(1);
  };

  // Cycle status quickly from row action menu
  const handleUpdateStatus = async (task, status) => {
    if (task.status === status) return;
    try {
      setIsUpdatingStatus(true);
      await api.put(API_PATHS.TASKS.STATUS(task.id), { status });
      await loadTasks();
      notifySuccess("Task status updated.");
    } catch (error) {
      notifyError(
        error.response?.data?.message || "Unable to update task status.",
      );
    } finally {
      setIsUpdatingStatus(false);
    }
    setActiveActionRow(null);
  };

  const openEditTaskPage = (task) => {
    setActiveActionRow(null);
    navigate(`/admin/tasks/${task.id}/edit`, {
      state: { activeNav: "All Tasks" },
    });
  };

  const handleUpdateTask = (event) => {
    event.preventDefault();
    if (taskToEdit) openEditTaskPage(taskToEdit);
  };

  // Delete task from row action menu
  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      setIsDeletingTask(true);
      await api.delete(API_PATHS.TASKS.BY_ID(taskToDelete.id));
      await loadTasks();
      setTaskToDelete(null);
      notifySuccess("Task deleted successfully.");
    } catch (error) {
      notifyError(error.response?.data?.message || "Unable to delete task.");
    } finally {
      setIsDeletingTask(false);
    }
    setActiveActionRow(null);
  };

  // Visible page numbers (1, 2, 3 matching the screenshot when >= 3 pages)
  const visiblePages = useMemo(() => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (safePage <= 2) return [1, 2, 3];
    if (safePage >= totalPages - 1)
      return [totalPages - 2, totalPages - 1, totalPages];
    return [safePage - 1, safePage, safePage + 1];
  }, [totalPages, safePage]);

  return (
    <div className=" w-full bg-[#F6F9FC] text-[#0F172A] antialiased selection:bg-[#00B4A2]/15 selection:text-[#00B4A2] flex flex-col justify-center">
      {/* Main Container matching the generous outer padding & crisp proportions */}
      <div className="w-full max-w-[1120px] mx-auto ">
        {/* 1. Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-[26px] leading-tight font-bold tracking-[-0.02em] text-[#0F172A]">
              All Tasks
            </h1>
            <p className="text-[13.5px] text-[#475569] mt-1 font-normal">
              Manage and track all tasks
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateTaskPage}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#00B8A5] to-[#00A396] hover:from-[#00A896] hover:to-[#009286] active:scale-[0.99] text-white text-[13.5px] font-semibold px-4 py-2.5 rounded-lg shadow-[0_2px_8px_rgba(0,180,162,0.28)] transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Task</span>
          </button>
        </div>

        {/* 2. Filter & Search Bar Row */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Status Dropdown */}
          <div className="relative" ref={statusRef}>
            <button
              type="button"
              onClick={() => {
                setStatusDropdownOpen((prev) => !prev);
                setPriorityDropdownOpen(false);
              }}
              className="w-full sm:w-[164px] h-[40px] px-3.5 bg-white border border-slate-200/90 hover:border-slate-300 rounded-lg text-[13px] font-medium text-[#1E293B] flex items-center justify-between gap-2 shadow-[0_1px_2px_rgba(15,23,42,0.02)] transition-colors cursor-pointer"
            >
              <span className="truncate">{statusFilter}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 transition-transform duration-150 shrink-0 ${
                  statusDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {statusDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-20">
                {["All Statuses", "In Progress", "Completed", "Pending"].map(
                  (status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => {
                        setStatusFilter(status);
                        setStatusDropdownOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full px-3.5 py-2 text-left text-[13px] flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                        statusFilter === status
                          ? "text-[#00B4A2] font-semibold bg-[#00B4A2]/5"
                          : "text-slate-700 font-medium"
                      }`}
                    >
                      <span>{status}</span>
                      {statusFilter === status && (
                        <Check className="w-3.5 h-3.5 text-[#00B4A2]" />
                      )}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>

          {/* Priority Dropdown */}
          <div className="relative" ref={priorityRef}>
            <button
              type="button"
              onClick={() => {
                setPriorityDropdownOpen((prev) => !prev);
                setStatusDropdownOpen(false);
              }}
              className="w-full sm:w-[164px] h-[40px] px-3.5 bg-white border border-slate-200/90 hover:border-slate-300 rounded-lg text-[13px] font-medium text-[#1E293B] flex items-center justify-between gap-2 shadow-[0_1px_2px_rgba(15,23,42,0.02)] transition-colors cursor-pointer"
            >
              <span className="truncate">{priorityFilter}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 transition-transform duration-150 shrink-0 ${
                  priorityDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {priorityDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-20">
                {["All Priorities", "High", "Medium", "Low"].map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => {
                      setPriorityFilter(priority);
                      setPriorityDropdownOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full px-3.5 py-2 text-left text-[13px] flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                      priorityFilter === priority
                        ? "text-[#00B4A2] font-semibold bg-[#00B4A2]/5"
                        : "text-slate-700 font-medium"
                    }`}
                  >
                    <span>{priority}</span>
                    {priorityFilter === priority && (
                      <Check className="w-3.5 h-3.5 text-[#00B4A2]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search tasks..."
              className="w-full h-[40px] pl-10 pr-8 bg-white border border-slate-200/90 hover:border-slate-300 focus:border-[#00B4A2] focus:ring-2 focus:ring-[#00B4A2]/15 rounded-lg text-[13px] text-[#1E293B] placeholder:text-slate-400 shadow-[0_1px_2px_rgba(15,23,42,0.02)] outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 3. Tasks Table Card */}
        <div className="mt-5 bg-white rounded-xl border border-slate-200/70 shadow-[0_2px_10px_rgba(15,23,42,0.03)] overflow-visible">
          <div className="overflow-x-auto rounded-xl">
            <table className="w-full border-collapse text-left min-w-[720px]">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[12.5px] font-semibold text-[#334155]">
                  <th className="py-3.5 pl-6 pr-4 w-[31%]">Task</th>
                  <th className="py-3.5 px-4 w-[13%]">Priority</th>
                  <th className="py-3.5 px-4 w-[16%]">Status</th>
                  <th className="py-3.5 px-4 w-[18%]">Due Date</th>
                  <th className="py-3.5 px-4 w-[12%] text-center">Assignees</th>
                  <th className="py-3.5 pl-4 pr-6 w-[12%] text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-[13.5px]">
                {isLoadingTasks ? (
                  <tr>
                    <td colSpan={6} className="p-0">
                      <TableSkeleton rows={5} columns={4} />
                    </td>
                  </tr>
                ) : tasksError ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-rose-700">
                      {tasksError}
                    </td>
                  </tr>
                ) : paginatedTasks.length > 0 ? (
                  paginatedTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="hover:bg-slate-50/75 transition-colors group"
                    >
                      {/* Task Title */}
                      <td className="py-4 pl-6 pr-4 font-semibold text-[#1E293B]">
                        <Link
                          to={`/admin/tasks/${task.id}`}
                          className="transition-colors hover:text-[#00A396] hover:underline"
                        >
                          {task.title}
                        </Link>
                      </td>

                      {/* Priority Badge */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center justify-center text-[12px] font-semibold px-3 py-1 rounded-full leading-none ${
                            PRIORITY_STYLES[task.priority] ||
                            "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4">
                        <select
                          aria-label={`Update status for ${task.title}`}
                          value={task.status}
                          disabled={isUpdatingStatus}
                          onChange={(event) =>
                            handleUpdateStatus(task, event.target.value)
                          }
                          className={`inline-flex max-w-full items-center justify-center text-[12px] font-semibold px-3 py-1 rounded-full leading-none border-0 outline-none cursor-pointer disabled:cursor-wait disabled:opacity-60 ${
                            STATUS_STYLES[task.status] ||
                            "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>

                      {/* Due Date */}
                      <td className="py-4 px-4 text-[#475569] font-medium text-[13px]">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400 stroke-[1.8] shrink-0" />
                          <span>{task.dueDate}</span>
                        </div>
                      </td>

                      {/* Assigned users */}
                      <td className="py-4 px-4">
                        <div
                          className="flex items-center justify-center -space-x-1.5"
                          title={(task.assignedTo || [])
                            .map((user) => user.name)
                            .join(", ")}
                        >
                          {(task.assignedTo || []).slice(0, 3).map((user) => (
                            <img
                              key={user._id}
                              src={
                                user.profileImageUrl ||
                                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces"
                              }
                              alt={user.name}
                              className="w-7 h-7 rounded-full ring-2 ring-white object-cover bg-[#E2E8F0] shrink-0"
                            />
                          ))}
                          {(task.assignedTo || []).length === 0 && (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                          {(task.assignedTo || []).length > 3 && (
                            <span className="ml-2 text-[11px] text-slate-500">
                              +{task.assignedTo.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions Menu */}
                      <td
                        className="py-4 pl-4 pr-6 text-right relative flex"
                        data-action-menu
                      >
                        <Link
                          to={`/admin/tasks/${task.id}`}
                          aria-label={`View details for ${task.title}`}
                          title="View task details"
                          className="mr-1 inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-teal-50 hover:text-teal-700"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveActionRow(
                              activeActionRow === task.id ? null : task.id,
                            )
                          }
                          aria-label={`Actions for ${task.title}`}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeActionRow === task.id && (
                          <div className="absolute right-6 top-12 w-40 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30 text-left">
                            <button
                              type="button"
                              onClick={() => openEditTaskPage(task)}
                              className="w-full px-3 py-2 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5 text-[#00B4A2]" />
                              <span>Edit Task</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setTaskToDelete(task);
                                setActiveActionRow(null);
                              }}
                              className="w-full px-3 py-2 text-[12.5px] font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Task</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-slate-500 text-sm"
                    >
                      No tasks match your current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Footer / Pagination Row */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-[#475569] font-medium">
            Showing {showingStart}-{showingEnd} of {totalTasks} tasks
          </p>

          <div className="flex items-center gap-1.5">
            {/* Previous Page Button */}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              aria-label="Previous page"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-default"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Number Buttons */}
            {visiblePages.map((pageNum) => {
              const isActive = pageNum === safePage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-[13px] flex items-center justify-center transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#00B4A2] text-white font-semibold shadow-[0_2px_6px_rgba(0,180,162,0.3)]"
                      : "text-[#475569] font-medium hover:bg-white hover:text-[#0F172A]"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next Page Button */}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              aria-label="Next page"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-default"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      {taskToEdit && (
        <div
          className="fixed inset-0 z-[55] bg-slate-900/40 backdrop-blur-[1px] flex items-start justify-center overflow-y-auto p-4 sm:items-center"
          onClick={() => !isUpdatingTask && setTaskToEdit(null)}
        >
          <div
            className="bg-white w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-xl border border-slate-200 shadow-xl p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold text-[#0F172A]">
                Update Task Details
              </h2>
              <button
                type="button"
                onClick={() => setTaskToEdit(null)}
                disabled={isUpdatingTask}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleUpdateTask} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                  Task Title
                </label>
                <input
                  required
                  value={taskToEdit.title}
                  onChange={(event) =>
                    setTaskToEdit((task) => ({
                      ...task,
                      title: event.target.value,
                    }))
                  }
                  className="w-full h-10 px-3.5 bg-white border border-slate-200 focus:border-[#00B4A2] focus:ring-2 focus:ring-[#00B4A2]/15 rounded-lg text-sm text-[#1E293B] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={taskToEdit.description || ""}
                  onChange={(event) =>
                    setTaskToEdit((task) => ({
                      ...task,
                      description: event.target.value,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#00B4A2] focus:ring-2 focus:ring-[#00B4A2]/15 rounded-lg text-sm text-[#1E293B] outline-none resize-y"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                    Priority
                  </label>
                  <select
                    value={taskToEdit.priority}
                    onChange={(event) =>
                      setTaskToEdit((task) => ({
                        ...task,
                        priority: event.target.value,
                      }))
                    }
                    className="w-full h-10 px-3 bg-white border border-slate-200 focus:border-[#00B4A2] rounded-lg text-sm text-[#1E293B] outline-none"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={taskToEdit.dueDate}
                    onChange={(event) =>
                      setTaskToEdit((task) => ({
                        ...task,
                        dueDate: event.target.value,
                      }))
                    }
                    className="w-full h-10 px-3 bg-white border border-slate-200 focus:border-[#00B4A2] focus:ring-2 focus:ring-[#00B4A2]/15 rounded-lg text-sm text-[#1E293B] outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                  Assigned To
                </label>
                <select
                  multiple
                  value={taskToEdit.assignedTo}
                  onChange={(event) =>
                    setTaskToEdit((task) => ({
                      ...task,
                      assignedTo: Array.from(
                        event.target.selectedOptions,
                        (option) => option.value,
                      ),
                    }))
                  }
                  className="w-full min-h-24 px-3 bg-white border border-slate-200 focus:border-[#00B4A2] focus:ring-2 focus:ring-[#00B4A2]/15 rounded-lg text-sm text-[#1E293B] outline-none"
                >
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-slate-400">
                  Hold Ctrl (Windows) or Command (Mac) to select multiple users.
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                  Attachments (one URL per line)
                </label>
                <textarea
                  rows={2}
                  value={taskToEdit.attachments}
                  onChange={(event) =>
                    setTaskToEdit((task) => ({
                      ...task,
                      attachments: event.target.value,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#00B4A2] focus:ring-2 focus:ring-[#00B4A2]/15 rounded-lg text-sm text-[#1E293B] outline-none resize-y"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                  Checklist (one item per line)
                </label>
                <textarea
                  rows={3}
                  value={taskToEdit.todoChecklist}
                  onChange={(event) =>
                    setTaskToEdit((task) => ({
                      ...task,
                      todoChecklist: event.target.value,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#00B4A2] focus:ring-2 focus:ring-[#00B4A2]/15 rounded-lg text-sm text-[#1E293B] outline-none resize-y"
                />
              </div>
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setTaskToEdit(null)}
                  disabled={isUpdatingTask}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingTask}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#00B4A2] hover:bg-[#009E8E] text-white shadow-sm transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isUpdatingTask ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-start justify-center overflow-y-auto p-4 sm:items-center"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-xl border border-slate-200 shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold text-[#0F172A]">
                Create New Task
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g., Implement user analytics widget"
                  className="w-full h-10 px-3.5 bg-white border border-slate-200 focus:border-[#00B4A2] focus:ring-2 focus:ring-[#00B4A2]/15 rounded-lg text-sm text-[#1E293B] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                  Description
                </label>
                <textarea
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder="Describe the task"
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#00B4A2] focus:ring-2 focus:ring-[#00B4A2]/15 rounded-lg text-sm text-[#1E293B] outline-none resize-y"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                    Priority
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-slate-200 focus:border-[#00B4A2] rounded-lg text-sm text-[#1E293B] outline-none"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                    Status
                  </label>
                  <select
                    value={newTaskStatus}
                    onChange={(e) => setNewTaskStatus(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-slate-200 focus:border-[#00B4A2] focus:ring-2 focus:ring-[#00B4A2]/15 rounded-lg text-sm text-[#1E293B] outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-slate-200 focus:border-[#00B4A2] focus:ring-2 focus:ring-[#00B4A2]/15 rounded-lg text-sm text-[#1E293B] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                  Assigned To
                </label>
                <select
                  multiple
                  value={newTaskAssignedTo}
                  onChange={(e) =>
                    setNewTaskAssignedTo(
                      Array.from(
                        e.target.selectedOptions,
                        (option) => option.value,
                      ),
                    )
                  }
                  disabled={isLoadingUsers}
                  className="w-full min-h-24 px-3 bg-white border border-slate-200 focus:border-[#00B4A2] focus:ring-2 focus:ring-[#00B4A2]/15 rounded-lg text-sm text-[#1E293B] outline-none disabled:bg-slate-50"
                >
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-slate-400">
                  {isLoadingUsers
                    ? "Loading users..."
                    : "Hold Ctrl (Windows) or Command (Mac) to select multiple users."}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                  Attachments (one URL per line)
                </label>
                <textarea
                  value={newTaskAttachments}
                  onChange={(e) => setNewTaskAttachments(e.target.value)}
                  placeholder="https://example.com/file.pdf"
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#00B4A2] focus:ring-2 focus:ring-[#00B4A2]/15 rounded-lg text-sm text-[#1E293B] outline-none resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                  Checklist (one item per line)
                </label>
                <textarea
                  value={newTaskChecklist}
                  onChange={(e) => setNewTaskChecklist(e.target.value)}
                  placeholder={"Review requirements\nComplete implementation"}
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#00B4A2] focus:ring-2 focus:ring-[#00B4A2]/15 rounded-lg text-sm text-[#1E293B] outline-none resize-y"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingTask}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#00B4A2] hover:bg-[#009E8E] text-white shadow-sm transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isCreatingTask ? "Creating..." : "Add Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {taskToDelete && (
        <div
          className="fixed inset-0 z-[60] bg-slate-950/55 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !isDeletingTask && setTaskToDelete(null)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-task-title"
            aria-describedby="delete-task-description"
            className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-1 ring-red-100">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div className="min-w-0 pt-0.5">
                  <h2
                    id="delete-task-title"
                    className="text-lg font-bold tracking-tight text-slate-900"
                  >
                    Delete this task?
                  </h2>
                  <p
                    id="delete-task-description"
                    className="mt-2 text-sm leading-6 text-slate-500"
                  >
                    This will permanently delete{" "}
                    <span className="font-semibold text-slate-700">
                      “{taskToDelete.title}”
                    </span>
                    . This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/80 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setTaskToDelete(null)}
                disabled={isDeletingTask}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteTask}
                disabled={isDeletingTask}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/30 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Trash2 className="h-4 w-4" />
                {isDeletingTask ? "Deleting..." : "Delete Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
