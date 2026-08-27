import { create } from "zustand";

interface UIState {
  isSidebarOpen: boolean;
  activeTheme: "light" | "dark" | "system";
  notificationDrawerOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setNotificationDrawerOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  activeTheme: "light",
  notificationDrawerOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  setTheme: (theme) => set({ activeTheme: theme }),
  setNotificationDrawerOpen: (open) => set({ notificationDrawerOpen: open }),
}));
