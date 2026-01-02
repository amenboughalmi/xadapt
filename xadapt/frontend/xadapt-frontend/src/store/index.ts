import { create } from 'zustand';
import type { User, ContextUpdateEvent } from '../types';

// ============= Auth Store =============
interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token });
  },
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));

// ============= Context Store =============
interface ContextStore {
  state: Record<string, any> | null;
  overrides: Record<string, boolean>;
  isSimulating: boolean;
  setState: (state: Record<string, any>) => void;
  updateContext: (event: ContextUpdateEvent) => void;
  setOverrides: (overrides: Record<string, boolean>) => void;
  toggleOverride: (context: string, value: boolean) => void;
  setSimulating: (simulating: boolean) => void;
}

export const useContextStore = create<ContextStore>((set) => ({
  state: null,
  overrides: {},
  isSimulating: false,
  setState: (state) => set({ state }),
  updateContext: (event) =>
    set((prev) => ({
      state: prev.state ? {
        ...prev.state,
        [event.type]: event.payload,
      } : { [event.type]: event.payload },
    })),
  setOverrides: (overrides) => set({ overrides }),
  toggleOverride: (context, value) =>
    set((prev) => ({
      overrides: {
        ...prev.overrides,
        [context]: value,
      },
    })),
  setSimulating: (isSimulating) => set({ isSimulating }),
}));

// ============= UI Store =============
interface UIStore {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  activeTab: string;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setActiveTab: (tab: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'dark',
  activeTab: 'dashboard',
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
  },
  setActiveTab: (activeTab) => set({ activeTab }),
}));
