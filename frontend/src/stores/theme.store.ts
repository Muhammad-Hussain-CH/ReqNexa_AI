import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeState = {
  mode: "light" | "dark";
  toggle: () => void;
  set: (mode: "light" | "dark") => void;
  apply: () => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: "light",
      toggle() {
        const next = get().mode === "dark" ? "light" : "dark";
        set({ mode: next });
        get().apply();
      },
      set(mode) {
        set({ mode });
        get().apply();
      },
      apply() {
        const root = document.documentElement;
        if (get().mode === "dark") root.classList.add("dark");
        else root.classList.remove("dark");
      },
    }),
    { name: "reqnexa-theme" }
  )
);

if (typeof window !== "undefined") {
  const unsub = useThemeStore.subscribe(() => {
    try { useThemeStore.getState().apply(); } catch {}
  });
  // Optional: unsubscribe on page unload to avoid leaks
  window.addEventListener("beforeunload", () => { try { unsub(); } catch {} });
}
