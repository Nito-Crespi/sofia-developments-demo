import { create } from "zustand";

type SidebarState = {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  toggle: () => void;
};

const STORAGE_KEY = "demo_sidebar_collapsed";

function loadCollapsed(): boolean {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw === "true";
}

export const useSidebarStore = create<SidebarState>((set, get) => ({
  collapsed: loadCollapsed(),
  setCollapsed: (value) => {
    localStorage.setItem(STORAGE_KEY, String(value));
    set({ collapsed: value });
  },
  toggle: () => {
    const next = !get().collapsed;
    localStorage.setItem(STORAGE_KEY, String(next));
    set({ collapsed: next });
  },
}));
