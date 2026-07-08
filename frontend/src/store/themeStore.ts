import { create } from "zustand";

type ThemeMode = "light" | "dark";

const STORAGE_KEY = "demo_theme_mode";

function loadTheme(): ThemeMode {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === "dark" ? "dark" : "light";
}

type ThemeState = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: loadTheme(),
  setMode: (mode) => {
    localStorage.setItem(STORAGE_KEY, mode);
    set({ mode });
  },
  toggle: () => {
    const next = get().mode === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    set({ mode: next });
  },
}));
