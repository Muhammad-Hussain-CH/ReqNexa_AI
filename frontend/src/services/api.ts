import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { toast } from "react-hot-toast";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const api = axios.create({ baseURL });
const authApi = axios.create({ baseURL });

let isRefreshing = false;
let pendingQueue: Array<{ resolve: (token: string) => void; reject: (e: any) => void }> = [];

function getAccessToken() {
  return localStorage.getItem("accessToken");
}

function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

function setAccessToken(token: string) {
  localStorage.setItem("accessToken", token);
}

function processQueue(error: any, token: string | null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else if (token) resolve(token);
  });
  pendingQueue = [];
}

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    const h = config.headers as any;
    if (h && typeof h.set === "function") h.set("Authorization", `Bearer ${token}`);
    else config.headers = { ...(config.headers as any), Authorization: `Bearer ${token}` } as any;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) (originalRequest.headers as any)["Authorization"] = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }
      isRefreshing = true;
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        processQueue(error, null);
        isRefreshing = false;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        location.assign("/login");
        return Promise.reject(error);
      }
      try {
        const resp = await authApi.post("/api/auth/refresh", { refreshToken });
        const newAccess = resp.data?.accessToken || resp.data?.tokens?.accessToken;
        const newRefresh = resp.data?.refreshToken || resp.data?.tokens?.refreshToken;
        if (newAccess) setAccessToken(newAccess);
        if (newRefresh) localStorage.setItem("refreshToken", newRefresh);
        processQueue(null, newAccess);
        if (originalRequest.headers) (originalRequest.headers as any)["Authorization"] = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (e) {
        processQueue(e, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        location.assign("/login");
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }
    if (!error.response) toast.error("Network error");
    return Promise.reject(error);
  }
);

export { api };
