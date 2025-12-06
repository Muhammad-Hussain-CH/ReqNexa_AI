import { api } from "./api";

type LoginBody = { email: string; password: string };
type RegisterBody = { email: string; password: string; name: string };

export async function login(data: LoginBody) {
  const res = await api.post("/api/auth/login", data);
  const { user, tokens } = res.data;
  if (tokens?.accessToken) localStorage.setItem("accessToken", tokens.accessToken);
  if (tokens?.refreshToken) localStorage.setItem("refreshToken", tokens.refreshToken);
  if (user) localStorage.setItem("user", JSON.stringify(user));
  return res.data;
}

export async function register(data: RegisterBody) {
  const res = await api.post("/api/auth/register", { ...data, role: "client" });
  return res.data;
}

export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}

export function getCurrentUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated() {
  return !!localStorage.getItem("accessToken");
}
