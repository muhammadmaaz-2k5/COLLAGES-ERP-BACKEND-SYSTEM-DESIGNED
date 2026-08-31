"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, type SystemRole } from "@/store/use-auth-store";
import { ShieldCheck } from "lucide-react";

const ROLES_SELECT: { role: SystemRole; label: string; defaultRoute: string }[] = [
  { role: "SUPER_ADMIN", label: "👑 Super Admin", defaultRoute: "/admin/rbac" },
  { role: "ADMIN", label: "🏛️ Campus Admin", defaultRoute: "/admin/academics" },
  { role: "TEACHER", label: "👨‍🏫 Faculty / Teacher", defaultRoute: "/faculty/dashboard" },
  { role: "STUDENT", label: "🎓 Student", defaultRoute: "/student/dashboard" },
  { role: "EXAM_CONTROLLER", label: "📝 Exam Controller", defaultRoute: "/exam-controller/dashboard" },
  { role: "ACCOUNTANT", label: "💳 Accountant", defaultRoute: "/accountant/dashboard" },
  { role: "HR_MANAGER", label: "👔 HR Manager", defaultRoute: "/hr/dashboard" },
  { role: "ADMISSIONS_OFFICER", label: "📋 Admissions Officer", defaultRoute: "/admin/admissions" },
  { role: "LIBRARIAN", label: "📚 Librarian", defaultRoute: "/librarian/dashboard" },
  { role: "WARDEN", label: "🏢 Hostel Warden", defaultRoute: "/warden/dashboard" },
  { role: "DRIVER", label: "🚌 Driver", defaultRoute: "/transport/dashboard" },
  { role: "STAFF", label: "💼 Staff", defaultRoute: "/admin/rbac" },
];

export function RoleSwitcher() {
  const router = useRouter();
  const { user, switchRole } = useAuthStore();

  const handleRoleChange = (newRole: SystemRole) => {
    switchRole(newRole);
    const target = ROLES_SELECT.find((r) => r.role === newRole);
    if (target?.defaultRoute) {
      router.push(target.defaultRoute);
    }
  };

  return (
    <div className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-slate-900/80 p-1.5 shadow-sm">
      <div className="flex items-center gap-1.5 pl-2 text-xs font-semibold text-indigo-300">
        <ShieldCheck className="h-4 w-4 text-indigo-400" />
        <span className="hidden sm:inline">Active Persona:</span>
      </div>
      <select
        value={user?.role || "STUDENT"}
        onChange={(e) => handleRoleChange(e.target.value as SystemRole)}
        className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs font-bold text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
      >
        {ROLES_SELECT.map((r) => (
          <option key={r.role} value={r.role}>
            {r.label}
          </option>
        ))}
      </select>
    </div>
  );
}
