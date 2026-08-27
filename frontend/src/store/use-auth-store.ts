import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthAPI } from "@/lib/auth-client";

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
  permissions?: string[];
  studentId?: string;
  employeeId?: string;
  avatarUrl?: string;
  departmentName?: string;
}

export const DEMO_ROLE_ACCOUNTS: Record<SystemRole, { email: string; name: string; id: string; studentId?: string; employeeId?: string }> = {
  SUPER_ADMIN: { email: "superadmin@university.edu", name: "Super Administrator", id: "usr_superadmin" },
  ADMIN: { email: "admin@university.edu", name: "Campus Administrator", id: "usr_admin" },
  TEACHER: { email: "teacher@university.edu", name: "Dr. Sarah Jenkins", id: "usr_teacher", employeeId: "EMP-FAC-01" },
  STUDENT: { email: "student@university.edu", name: "Alex Morgan", id: "usr_student", studentId: "FA23-BCS-042" },
  ACCOUNTANT: { email: "accountant@university.edu", name: "Robert Sterling", id: "usr_accountant", employeeId: "EMP-FIN-01" },
  LIBRARIAN: { email: "librarian@university.edu", name: "Emily Blunt", id: "usr_librarian", employeeId: "EMP-LIB-01" },
  HR_MANAGER: { email: "hrmanager@university.edu", name: "David Hassel", id: "usr_hrmanager", employeeId: "EMP-HR-01" },
  WARDEN: { email: "warden@university.edu", name: "Marcus Vance", id: "usr_warden", employeeId: "EMP-HST-01" },
  DRIVER: { email: "driver@university.edu", name: "James Miller", id: "usr_driver", employeeId: "EMP-DRV-01" },
  ADMISSIONS_OFFICER: { email: "admissions@university.edu", name: "Clara Oswald", id: "usr_admissions", employeeId: "EMP-ADM-01" },
  EXAM_CONTROLLER: { email: "examcontroller@university.edu", name: "Arthur Pendleton", id: "usr_examcontroller", employeeId: "EMP-EXM-01" },
  STAFF: { email: "staff@university.edu", name: "Hannah Abbott", id: "usr_staff", employeeId: "EMP-STF-01" },
};

interface AuthState {
  user: UserSession | null;
  isAuthenticated: boolean;
  token: string | null;
  loginWithCredentials: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  setUser: (user: UserSession, token: string) => void;
  switchRole: (role: SystemRole) => Promise<void>;
  hasRole: (roles: SystemRole | SystemRole[]) => boolean;
  hasPermission: (permission: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: {
        id: "usr_student",
        email: "student@university.edu",
        role: "STUDENT",
        name: "Alex Morgan",
        studentId: "FA23-BCS-042",
        permissions: ["LMS.COURSEWORK.SUBMIT"],
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
      isAuthenticated: true,
      token: "live-demo-token",

      loginWithCredentials: async (email: string, password = "Password123!") => {
        try {
          const res = await AuthAPI.login(email, password);
          if (res.success && res.data) {
            const u = res.data.user;
            set({
              user: {
                id: u.id,
                email: u.email,
                role: u.role as SystemRole,
                name: `${u.firstName} ${u.lastName}`,
                permissions: u.permissions || [],
                studentId: u.studentId,
                employeeId: u.employeeId,
                avatarUrl: u.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
              },
              token: res.data.accessToken,
              isAuthenticated: true,
            });
            return { success: true };
          }
          return { success: false, error: res.error?.message || "Authentication failed" };
        } catch {
          // Fallback demo session
          const matched = Object.entries(DEMO_ROLE_ACCOUNTS).find(([, acc]) => acc.email === email);
          if (matched) {
            const [r, acc] = matched;
            set({
              user: {
                id: acc.id,
                email: acc.email,
                role: r as SystemRole,
                name: acc.name,
                studentId: acc.studentId,
                employeeId: acc.employeeId,
                permissions: ["*"],
              },
              token: "live-demo-token",
              isAuthenticated: true,
            });
            return { success: true };
          }
          return { success: false, error: "Invalid credentials" };
        }
      },

      setUser: (user, token) => set({ user, token, isAuthenticated: true }),

      switchRole: async (role: SystemRole) => {
        const demo = DEMO_ROLE_ACCOUNTS[role];
        try {
          const res = await AuthAPI.login(demo.email, "Password123!");
          if (res.success && res.data) {
            const u = res.data.user;
            set({
              user: {
                id: u.id,
                email: u.email,
                role: u.role as SystemRole,
                name: `${u.firstName} ${u.lastName}`,
                permissions: u.permissions || [],
                studentId: u.studentId,
                employeeId: u.employeeId,
                avatarUrl: u.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
              },
              token: res.data.accessToken,
              isAuthenticated: true,
            });
            return;
          }
        } catch {
          // fallback
        }

        set({
          user: {
            id: demo.id,
            email: demo.email,
            role,
            name: demo.name,
            studentId: demo.studentId,
            employeeId: demo.employeeId,
            permissions: ["*"],
            avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          },
          token: "live-demo-token",
          isAuthenticated: true,
        });
      },

      hasRole: (roles: SystemRole | SystemRole[]) => {
        const { user } = get();
        if (!user) return false;
        if (user.role === "SUPER_ADMIN") return true;
        const allowed = Array.isArray(roles) ? roles : [roles];
        return allowed.includes(user.role);
      },

      hasPermission: (permission: string) => {
        const { user } = get();
        if (!user) return false;
        if (user.role === "SUPER_ADMIN") return true;
        if (!user.permissions) return false;
        return user.permissions.includes(permission) || user.permissions.includes("*");
      },

      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "apex_university_auth_session",
    }
  )
);
