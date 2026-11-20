import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: (import.meta.env.VITE_DATABASE_URL || "http://localhost:5000").replace(/\/$/, ""),
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshRequest;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isRefreshRequest = originalRequest?.url?.includes("/api/auth/refresh-token");
    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry || isRefreshRequest) {
      return Promise.reject(error);
    }

    const refreshToken = Cookies.get("refreshToken");
    if (!refreshToken) return Promise.reject(error);

    originalRequest._retry = true;
    let newToken;
    try {
      refreshRequest ||= api
        .post("/api/auth/refresh-token", { refreshToken }, { skipAuthRefresh: true })
        .then(({ data }) => {
          Cookies.set("token", data.token, { expires: 7 });
          return data.token;
        })
        .finally(() => { refreshRequest = null; });

      newToken = await refreshRequest;
    } catch (refreshError) {
      Cookies.remove("token");
      Cookies.remove("refreshToken");
      Cookies.remove("user");
      if (!window.location.pathname.startsWith("/reset-password") && window.location.pathname !== "/signup" && window.location.pathname !== "/forget-password") {
        window.location.assign("/");
      }
      return Promise.reject(refreshError);
    }
    originalRequest.headers.Authorization = `Bearer ${newToken}`;
    return api(originalRequest);
  },
);

export default api;
