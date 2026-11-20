const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    REFRESH_TOKEN: "/api/auth/refresh-token",
    PROFILE: "/api/auth/profile",
    CHANGE_PASSWORD: "/api/auth/change-password",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: (token) => `/api/auth/reset-password/${token}`,
    UPLOAD_IMAGE: "/api/auth/upload-image",
  },
  USERS: {
    LIST: "/api/users",
    CREATE: "/api/users",
    BY_ID: (id) => `/api/users/${id}`,
    DELETE: (id) => `/api/users/${id}`,
  },
  TASKS: {
    LIST: "/api/tasks",
    BY_ID: (id) => `/api/tasks/${id}`,
    CREATE: "/api/tasks",
    STATUS: (id) => `/api/tasks/${id}/status`,
    CHECKLIST: (id) => `/api/tasks/${id}/todo`,
    DASHBOARD: "/api/tasks/dashboard-data",
    USER_DASHBOARD: "/api/tasks/user-dashboard-data",
  },
  REPORTS: {
    TASKS: "/api/reports/export/tasks",
    USERS: "/api/reports/export/users",
  },
};

export default API_PATHS;
