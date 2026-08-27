import { create } from "zustand";

export type SystemRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "TEACHER"
  | "STUDENT"
  | "ACCOUNTANT"
  | "LIBRARIAN"
  | "HR_MANAGER"
  | "WARDEN"
  | "DRIVER"
  | "ADMISSIONS_OFFICER"
  | "EXAM_CONTROLLER"
  | "STAFF";

export interface UserSession {
  id: string;
  email: string;
  role: SystemRole;
  name: string;
  studentId?: string;
  employeeId?: string;
  avatarUrl?: string;
  departmentName?: string;
}

interface AuthState {
  user: UserSession | null;
  isAuthenticated: boolean;
  token: string | null;
  setUser: (user: UserSession, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: "usr_student_01",
    email: "student@university.edu",
    role: "STUDENT",
    name: "Alex Morgan",
    studentId: "std_2026_042",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    departmentName: "Computer Science",
  },
  isAuthenticated: true,
  token: "mock-jwt-token-for-preview",
  setUser: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));
