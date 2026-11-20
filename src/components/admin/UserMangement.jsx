import { useState, useMemo, useRef, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import api from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import {
  Plus,
  Pencil,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Eye,
  Shield,
  UserCheck,
  Trash2,
} from "lucide-react";
import UserForm from "./UserForm";
import { TableSkeleton } from "../common/LoadingSkeleton";
import PreparationCard from "../common/PreparationCard";
import {
  notifyError,
  notifySuccess,
} from "../common/notifications";

// Crisp, realistic portrait SVG avatars tailored to each user in the reference image
const UserAvatar = ({ variant, name }) => {
  const configs = {
    ahmed: {
      bgStart: "#E2E8F0",
      bgEnd: "#CBD5E1",
      skin: "#DFA584",
      hair: "#1C1917",
      shirt: "#0F172A",
      hasBeard: true,
      isFemale: false,
    },
    sarah: {
      bgStart: "#E2E8F0",
      bgEnd: "#CBD5E1",
      skin: "#EBC0A6",
      hair: "#291D18",
      shirt: "#1E293B",
      hasBeard: false,
      isFemale: true,
    },
    ali: {
      bgStart: "#E2E8F0",
      bgEnd: "#CBD5E1",
      skin: "#D69B79",
      hair: "#18181B",
      shirt: "#1E293B",
      hasBeard: true,
      isFemale: false,
    },
    fatma: {
      bgStart: "#E2E8F0",
      bgEnd: "#CBD5E1",
      skin: "#E6B698",
      hair: "#1F1613",
      shirt: "#0F172A",
      hasBeard: false,
      isFemale: true,
    },
    omar: {
      bgStart: "#E2E8F0",
      bgEnd: "#CBD5E1",
      skin: "#D89E7C",
      hair: "#1C1917",
      shirt: "#18181B",
      hasBeard: true,
      isFemale: false,
    },
  };

  const c = configs[variant] || configs.ahmed;
  const gradId = `avatar-grad-${variant}`;

  return (
    <svg
      viewBox="0 0 44 44"
      className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200/90 shrink-0 bg-slate-100"
      aria-label={name}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c.bgStart} />
          <stop offset="100%" stopColor={c.bgEnd} />
        </linearGradient>
      </defs>
      <rect width="44" height="44" fill={`url(#${gradId})`} />

      {/* Back Hair for Female Portraits */}
      {c.isFemale && (
        <path
          d="M11 20 C10 10, 15 7, 22 7 C29 7, 34 10, 33 20 L34 38 L10 38 Z"
          fill={c.hair}
        />
      )}

      {/* Shoulders / Top */}
      <path
        d="M6 44 C6 33.5, 13.5 30.5, 22 30.5 C30.5 30.5, 38 33.5, 38 44 Z"
        fill={c.shirt}
      />

      {/* Neckline */}
      {c.isFemale ? (
        <path d="M17.5 30.5 Q22 35.5 26.5 30.5 Z" fill={c.skin} />
      ) : (
        <path d="M18 30.5 L22 34.5 L26 30.5 Z" fill="#F8FAFC" opacity="0.9" />
      )}

      {/* Neck */}
      <rect x="19" y="25" width="6" height="6.5" rx="2.5" fill={c.skin} />

      {/* Face */}
      <ellipse cx="22" cy="19" rx="7" ry="8.2" fill={c.skin} />

      {/* Front Hair */}
      {c.isFemale ? (
        <path
          d="M14.8 18.5 C14.8 11.5, 18 9.2, 22 9.2 C26 9.2, 29.2 11.5, 29.2 18.5 C28 14.5, 25.5 12.8, 22 12.8 C18.5 12.8, 16 14.5, 14.8 18.5 Z"
          fill={c.hair}
        />
      ) : (
        <path
          d="M14.8 17.5 C14.5 11.2, 17.5 8.8, 22.2 8.8 C26.8 8.8, 29.5 11.5, 29.2 17.5 C28.2 14, 25.8 12.6, 22 12.6 C18.2 12.6, 15.8 14, 14.8 17.5 Z"
          fill={c.hair}
        />
      )}

      {/* Subtle Beard / Stubble for Male Portraits */}
      {c.hasBeard && (
        <path
          d="M15.3 20 C15.3 24.8, 18.2 27.2, 22 27.2 C25.8 27.2, 28.7 24.8, 28.7 20 C27.6 22.2, 25.4 23.4, 22 23.4 C18.6 23.4, 16.4 22.2, 15.3 20 Z"
          fill={c.hair}
          opacity="0.72"
        />
      )}

      {/* Eyes & Eyebrows */}
      <circle cx="19.4" cy="18.2" r="0.95" fill="#1E293B" />
      <circle cx="24.6" cy="18.2" r="0.95" fill="#1E293B" />
      <path
        d="M17.8 16.5 Q19.4 15.9 20.8 16.5"
        stroke={c.hair}
        strokeWidth="0.95"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M23.2 16.5 Q24.6 15.9 26.2 16.5"
        stroke={c.hair}
        strokeWidth="0.95"
        fill="none"
        strokeLinecap="round"
      />

      {/* Warm Smile */}
      <path
        d="M20.1 22.3 Q22 23.4 23.9 22.3"
        stroke="#8C4A32"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};

const ROLE_BADGE_STYLES = {
  "Super Admin": "bg-rose-100 text-rose-700",
  Admin: "bg-[#EDE9FE] text-[#6D28D9]",
  Member: "bg-[#DCFCE7] text-[#15803D]",
};

export default function UserMangement() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUserRole] = useState(() => {
    try {
      return JSON.parse(Cookies.get("user") || "{}").role;
    } catch {
      return null;
    }
  });
  const { id: editingUserId } = useParams();
  const formMode =
    location.pathname === "/admin/users/new"
      ? "add"
      : location.pathname.endsWith("/edit")
        ? "edit"
        : null;
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuUserId, setOpenMenuUserId] = useState(null);

  // Add / Edit Modal state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState("member");
  const [formPassword, setFormPassword] = useState("");
  const [formProfileImageUrl, setFormProfileImageUrl] = useState("");
  const [formError, setFormError] = useState("");
  const [actionError, setActionError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingEditUser, setIsLoadingEditUser] = useState(
    formMode === "edit",
  );
  const menuContainerRef = useRef(null);

  useEffect(() => {
    api
      .get(API_PATHS.USERS.LIST)
      .then(({ data }) =>
        setUsers(
          data.map((user) => ({
            ...user,
            id: user._id,
            role: user.role,
            tasks:
              (user.pendingTasks || 0) +
              (user.inProgressTasks || 0) +
              (user.completedTasks || 0),
            avatarUrl: user.profileImageUrl,
          })),
        ),
      )
      .catch((error) =>
        setActionError(
          error.response?.data?.message || "Unable to load users.",
        ),
      )
      .finally(() => setIsLoadingUsers(false));
  }, []);

  useEffect(() => {
    if (formMode !== "edit" || !editingUserId) return;
    let active = true;
    api
      .get(API_PATHS.USERS.BY_ID(editingUserId))
      .then(({ data }) => {
        if (!active) return;
        setFormName(data.name);
        setFormEmail(data.email);
        setFormRole(data.role);
        setFormProfileImageUrl(data.profileImageUrl || "");
        setIsLoadingEditUser(false);
      })
      .catch((error) => {
        if (!active) return;
        setFormError(error.response?.data?.message || "Unable to load this user.");
        setIsLoadingEditUser(false);
      });
    return () => {
      active = false;
    };
  }, [formMode, editingUserId]);

  // Close contextual 3-dots menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest("[data-user-menu]")) {
        setOpenMenuUserId(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const pageSize = 5;
  const totalUsers = users.length;
  const totalPages = Math.max(1, Math.ceil(totalUsers / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const startIndex = (safePage - 1) * pageSize;
  const paginatedUsers = users.slice(startIndex, startIndex + pageSize);

  const showingStart = totalUsers === 0 ? 0 : startIndex + 1;
  const showingEnd = Math.min(startIndex + pageSize, totalUsers);

  const visiblePages = useMemo(() => {
    return Array.from({ length: totalPages }, (_, idx) => idx + 1);
  }, [totalPages]);

  const openAddForm = () => {
    setFormName("");
    setFormEmail("");
    setFormRole("member");
    setFormPassword("");
    setFormProfileImageUrl("");
    setFormError("");
    navigate("/admin/users/new");
  };

  const openEditForm = (user) => {
    setOpenMenuUserId(null);
    navigate(`/admin/users/${user.id}/edit`);
  };

  const closeForm = () => {
    if (isSaving) return;
    setFormError("");
    navigate("/admin/users");
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!formName.trim() || !formEmail.trim()) {
      setFormError("Name and email are required.");
      return;
    }
    if (formMode === "add" && formPassword.length < 8) {
      setFormError("Password must be at least 8 characters long.");
      return;
    }

    const userData = {
      name: formName.trim(),
      email: formEmail.trim(),
      role: formRole,
      profileImageUrl: formProfileImageUrl.trim() || null,
    };
    if (formPassword) userData.password = formPassword;

    try {
      setIsSaving(true);
      if (formMode === "add") {
        const { data } = await api.post(API_PATHS.USERS.CREATE, {
          ...userData,
          password: formPassword,
        });
        setUsers((currentUsers) => [
          {
            ...data.user,
            id: data.user._id,
            tasks: 0,
            avatarUrl: data.user.profileImageUrl,
          },
          ...currentUsers,
        ]);
        setCurrentPage(1);
        notifySuccess("User created successfully.");
      } else if (editingUserId) {
        const { data } = await api.put(
          API_PATHS.USERS.BY_ID(editingUserId),
          userData,
        );
        setUsers((currentUsers) =>
          currentUsers.map((user) =>
            user.id === editingUserId
              ? {
                  ...user,
                  ...data.user,
                  id: data.user._id,
                  avatarUrl: data.user.profileImageUrl,
                }
              : user,
          ),
        );
        notifySuccess("User details updated successfully.");
      }
      navigate("/admin/users");
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to save this user.";
      setFormError(message);
      notifyError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await api.delete(API_PATHS.USERS.DELETE(id));
      setUsers((currentUsers) => currentUsers.filter((user) => user.id !== id));
      setActionError("");
      notifySuccess("User deleted successfully.");
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to delete this user.";
      setActionError(message);
      notifyError(message);
    }
  };

  const updateUserRole = async (id, role) => {
    try {
      const { data } = await api.put(API_PATHS.USERS.BY_ID(id), { role });
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === id ? { ...user, ...data.user, id: data.user._id } : user,
        ),
      );
      setOpenMenuUserId(null);
      setActionError("");
      notifySuccess("User role updated.");
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to update this user's role.";
      setActionError(message);
      notifyError(message);
    }
  };

  const handleFormChange = (field, value) => {
    if (field === "name") setFormName(value);
    if (field === "email") setFormEmail(value);
    if (field === "role") setFormRole(value);
    if (field === "password") setFormPassword(value);
    if (field === "profileImageUrl") setFormProfileImageUrl(value);
  };

  if (formMode) {
    if (isLoadingEditUser) {
      return (
        <PreparationCard
          statusLabel="Preparing user profile"
          title="Preparing user details"
          description="We're loading the user's account information before opening the editor."
          waitMessage="Waiting for user data…"
          items={[
            {
              icon: UserCheck,
              title: "User profile",
              description: "Loading account information",
            },
            {
              icon: Shield,
              title: "Role & access",
              description: "Preparing user settings",
            },
          ]}
        />
      );
    }

    return (
      <UserForm
        mode={formMode}
        name={formName}
        email={formEmail}
        role={formRole}
        password={formPassword}
        profileImageUrl={formProfileImageUrl}
        error={formError}
        saving={isSaving}
        allowSuperAdminRole={currentUserRole === "superadmin"}
        onChange={handleFormChange}
        onSubmit={handleSaveUser}
        onCancel={closeForm}
      />
    );
  }

  return (
    <div className="w-full bg-[#F5F8FC] text-[#0F172A] antialiased selection:bg-[#0BB5A6]/15 selection:text-[#0BB5A6] flex flex-col justify-center">
      {/* Main Container */}
      <div className="w-full mx-auto ">
        {/* 1. Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-[#0F172A] leading-tight">
              Users Management
            </h1>
            <p className="text-sm text-[#64748B] mt-1 font-normal">
              Manage system users
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#0CC0B0] to-[#089E91] hover:from-[#0BB2A3] hover:to-[#078E82] active:scale-[0.99] text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm shadow-teal-500/20 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add User</span>
          </button>
        </div>

        {actionError && (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {actionError}
          </div>
        )}

        {/* 2. Users Table Card */}
        <div
          ref={menuContainerRef}
          className="mt-6 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(15,23,42,0.03)] overflow-visible"
        >
          <div className="overflow-x-auto rounded-2xl">
            <table className="w-full border-collapse text-left min-w-[660px]">
              <thead>
                <tr className="bg-[#F8FAFC]/80 border-b border-slate-100 text-xs sm:text-[13px] font-semibold text-[#475569]">
                  <th className="py-3.5 pl-6 pr-4 w-[31%]">User</th>
                  <th className="py-3.5 px-4 w-[28%]">Email</th>
                  <th className="py-3.5 px-4 w-[17%]">Role</th>
                  <th className="py-3.5 px-4 w-[12%] text-center">Tasks</th>
                  <th className="py-3.5 pl-4 pr-6 w-[12%] text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {isLoadingUsers ? (
                  <tr>
                    <td colSpan={5} className="p-0">
                      <TableSkeleton rows={5} columns={4} />
                    </td>
                  </tr>
                ) : paginatedUsers.length ? (
                  paginatedUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-slate-100 last:border-none hover:bg-slate-50/60 transition-colors"
                    >
                      {/* User Avatar + Name */}
                      <td className="py-3.5 pl-6 pr-4">
                        <div className="flex items-center gap-3.5">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.name}
                              className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200/90 shrink-0"
                            />
                          ) : (
                            <UserAvatar
                              variant={user.avatar}
                              name={user.name}
                            />
                          )}
                          <span className="font-semibold text-[#0F172A] text-sm">
                            {user.name}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 text-sm text-[#475569]">
                        {user.email}
                      </td>

                      {/* Role Pill Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center justify-center font-semibold text-xs px-3 py-1 rounded-full leading-none ${
                            ROLE_BADGE_STYLES[
                              user.role === "superadmin"
                                ? "Super Admin"
                                : user.role === "admin"
                                  ? "Admin"
                                  : "Member"
                            ]
                          }`}
                        >
                          {user.role === "superadmin"
                            ? "Super Admin"
                            : user.role === "admin"
                              ? "Admin"
                              : "Member"}
                        </span>
                      </td>

                      {/* Tasks Count */}
                      <td className="py-3.5 px-4 text-sm font-medium text-[#1E293B] text-center">
                        {user.tasks}
                      </td>

                      {/* Actions: Edit Pencil + Vertical 3-Dots */}
                      <td
                        className="py-3.5 pl-4 pr-6 text-right relative"
                        data-user-menu
                      >
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuUserId(null);
                              navigate(`/admin/users/${user.id}`);
                            }}
                            aria-label={`View ${user.name}`}
                            title="View user details"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-teal-50 transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4 stroke-[1.9]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditForm(user)}
                            aria-label={`Edit ${user.name}`}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <Pencil className="w-4 h-4 stroke-[1.9]" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenuUserId(
                                openMenuUserId === user.id ? null : user.id,
                              )
                            }
                            aria-label={`More actions for ${user.name}`}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4 stroke-[1.9]" />
                          </button>
                        </div>

                        {openMenuUserId === user.id && (
                          <div className="absolute right-6 top-12 w-44 bg-white border border-slate-200/90 rounded-xl shadow-lg py-1.5 z-30 text-left">
                            <button
                              type="button"
                              onClick={() =>
                                updateUserRole(
                                  user.id,
                                  user.role === "admin" ? "member" : "admin",
                                )
                              }
                              className="w-full px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                            >
                              {user.role === "admin" ? (
                                <>
                                  <UserCheck className="w-3.5 h-3.5 text-[#15803D]" />
                                  <span>Set as Member</span>
                                </>
                              ) : (
                                <>
                                  <Shield className="w-3.5 h-3.5 text-[#6D28D9]" />
                                  <span>Make Admin</span>
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(user.id)}
                              className="w-full px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete User</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center text-sm text-slate-500"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Footer / Pagination Bar */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#475569] font-medium">
            Showing {showingStart}–{showingEnd} of {totalUsers} users
          </p>

          <div className="flex items-center gap-1">
            {/* Previous Chevron */}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              aria-label="Previous page"
              className="text-slate-400 hover:text-slate-700 disabled:opacity-40 disabled:hover:text-slate-400 p-1.5 rounded-lg transition-colors cursor-pointer disabled:cursor-default"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
            {visiblePages.map((page) => {
              const isActive = page === safePage;
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={
                    isActive
                      ? "w-8 h-8 rounded-lg bg-[#0BB5A6] text-white font-semibold text-sm flex items-center justify-center shadow-sm cursor-pointer"
                      : "w-8 h-8 rounded-lg text-[#475569] hover:bg-slate-200/60 font-medium text-sm flex items-center justify-center transition-colors cursor-pointer"
                  }
                >
                  {page}
                </button>
              );
            })}

            {/* Next Chevron */}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              aria-label="Next page"
              className="text-slate-500 hover:text-slate-800 disabled:opacity-40 disabled:hover:text-slate-500 p-1.5 rounded-lg transition-colors cursor-pointer disabled:cursor-default"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
