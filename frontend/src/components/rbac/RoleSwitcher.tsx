"use client";

import React from "react";
import { useAuthStore, type SystemRole } from "@/store/use-auth-store";
import { ShieldCheck } from "lucide-react";

const ROLES_SELECT: { role: SystemRole; label: string }[] = [
  { role: "SUPER_ADMIN", label: "👑 Super Admin" },
  { role: "ADMIN", label: "🏛️ Campus Admin" },
  { role: "TEACHER", label: "👨‍🏫 Faculty / Teacher" },
  { role: "STUDENT", label: "🎓 Student" },
  { role: "EXAM_CONTROLLER", label: "📝 Exam Controller" },
  { role: "ACCOUNTANT", label: "💳 Accountant" },
  { role: "HR_MANAGER", label: "👔 HR Manager" },
  { role: "ADMISSIONS_OFFICER", label: "📋 Admissions Officer" },
  { role: "LIBRARIAN", label: "📚 Librarian" },
  { role: "WARDEN", label: "🏢 Hostel Warden" },
  { role: "DRIVER", label: "🚌 Driver" },
  { role: "STAFF", label: "💼 Staff" },
];

export function RoleSwitcher() {
  const { user, switchRole } = useAuthStore();

  return (
    <div className="flex items-center gap-2 rounded-xl border border-indigo-200/80 bg-indigo-50/60 p-1.5 shadow-sm">
      <div className="flex items-center gap-1.5 pl-2 text-xs font-semibold text-indigo-900">
        <ShieldCheck className="h-4 w-4 text-indigo-600" />
        <span className="hidden sm:inline">Active Persona:</span>
      </div>
      <select
        value={user?.role || "STUDENT"}
        onChange={(e) => switchRole(e.target.value as SystemRole)}
        className="rounded-lg border border-indigo-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
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
