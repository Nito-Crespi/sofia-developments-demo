import { create } from "zustand";
import type { MenuKey, UserRole } from "../data/usersDb";
import { validateCredentials } from "../data/usersDb";

const STORAGE_KEY = "demo_auth_session";
const ONE_HOUR_MS = 60 * 60 * 1000;

export type Session = {
  user: {
    username: string;
    displayName: string;
    role: UserRole;
    menus: MenuKey[];
  };
  expiresAt: number; // epoch ms
};

type AuthState = {
  session: Session | null;
  isAuthenticated: () => boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Session;
    if (!parsed?.expiresAt || Date.now() >= parsed.expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function saveSession(session: Session | null) {
  if (!session) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: loadSession(),

  isAuthenticated: () => {
    const s = get().session;
    if (!s) return false;
    if (Date.now() >= s.expiresAt) {
      get().logout();
      return false;
    }
    return true;
  },

  login: async (username: string, password: string) => {
    await new Promise((r) => setTimeout(r, 300));

    const user = validateCredentials(username, password);
    if (!user) throw new Error("Credenciales inválidas");

    const session: Session = {
      user: {
        username: user.username,
        displayName: user.displayName,
        role: user.role,
        menus: user.menus,
      },
      expiresAt: Date.now() + ONE_HOUR_MS,
    };

    saveSession(session);
    set({ session });
  },

  logout: () => {
    saveSession(null);
    set({ session: null });
  },
}));
