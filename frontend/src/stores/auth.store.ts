import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login as apiLogin, register as apiRegister, logout as apiLogout, getCurrentUser, isAuthenticated } from "../services/auth.service";

type User = { id: string; email: string; name: string; role: string } | null;

type AuthState = {
  user: User;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string }) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  checkAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      async login(email, password) {
        set({ isLoading: true });
        const res = await apiLogin({ email, password });
        set({ user: res.user ?? getCurrentUser(), token: res.tokens?.accessToken ?? localStorage.getItem("accessToken"), isAuthenticated: true, isLoading: false });
      },
      async register(data) {
        set({ isLoading: true });
        await apiRegister(data);
        set({ isLoading: false });
      },
      logout() {
        apiLogout();
        set({ user: null, token: null, isAuthenticated: false });
      },
      setUser(user) {
        set({ user });
      },
      checkAuth() {
        set({ isLoading: true });
        const authed = isAuthenticated();
        const user = getCurrentUser();
        const token = localStorage.getItem("accessToken");
        set({ isAuthenticated: authed, user, token, isLoading: false });
      },
    }),
    { name: "reqnexa-auth" }
  )
);
