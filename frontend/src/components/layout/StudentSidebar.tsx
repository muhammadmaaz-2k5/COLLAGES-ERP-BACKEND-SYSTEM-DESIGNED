"use client";

import React from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/use-auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  BookOpen,
  FileText,
  Clock,
  CheckSquare,
  Award,
  CreditCard,
  Calendar,
  ShieldCheck,
  Building2,
  ChevronRight,
  LogOut,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";

export type StudentTabKey =
  | "overview"
  | "curriculum"
  | "transcript"
  | "attendance"
  | "lms"
  | "exams"
  | "finance"
  | "timetable"
  | "idcard";

interface StudentSidebarProps {
  activeTab: StudentTabKey;
  onSelectTab: (tab: StudentTabKey) => void;
  assignedCoursesCount: number;
  attendancePercentage: number;
  assignmentsCount: number;
  examsCount: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function StudentSidebar({
  activeTab,
  onSelectTab,
  assignedCoursesCount,
  attendancePercentage,
  assignmentsCount,
  examsCount,
  isOpenMobile,
  onCloseMobile,
}: StudentSidebarProps) {
  const { user, logout } = useAuthStore();

  const navItems: {
    key: StudentTabKey;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
    badgeVariant?: "default" | "success" | "warning" | "info" | "secondary" | "outline";
  }[] = [
    {
      key: "overview",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      key: "curriculum",
      label: "Curriculum & Courses",
      icon: BookOpen,
      badge: assignedCoursesCount,
      badgeVariant: "default",
    },
    {
      key: "transcript",
      label: "Transcript & CGPA",
      icon: FileText,
    },
    {
      key: "attendance",
      label: "Attendance Tracker",
      icon: Clock,
      badge: `${attendancePercentage}%`,
      badgeVariant: attendancePercentage >= 85 ? "success" : "warning",
    },
    {
      key: "lms",
      label: "LMS & Sessional Marks",
      icon: CheckSquare,
      badge: `${assignmentsCount} Tasks`,
      badgeVariant: "info",
    },
    {
      key: "exams",
      label: "Exams & Datesheet",
      icon: Award,
      badge: examsCount,
      badgeVariant: "secondary",
    },
    {
      key: "finance",
      label: "Fees & Billing",
      icon: CreditCard,
    },
    {
      key: "timetable",
      label: "Class Timetable",
      icon: Calendar,
    },
    {
      key: "idcard",
      label: "Verified Student ID",
      icon: ShieldCheck,
    },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-xl lg:shadow-none transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
        isOpenMobile ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 text-sm tracking-tight flex items-center gap-1.5">
              APEX UNIVERSITY
            </span>
            <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider block">
              Enterprise ERP System
            </span>
          </div>
        </Link>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
          >
            ✕
          </button>
        )}
      </div>

      {/* User Profile Card */}
      <div className="p-4 mx-3 mt-4 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white shadow-lg space-y-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11 rounded-xl border-2 border-indigo-400/30">
            <AvatarImage src={user?.avatarUrl} alt={user?.name || "Student"} />
            <AvatarFallback className="bg-indigo-600 text-white text-xs font-bold">
              {user?.name?.slice(0, 2).toUpperCase() || "ST"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white truncate">{user?.name || "Alex Morgan"}</h4>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            </div>
            <p className="text-[10px] font-mono text-indigo-200 truncate">
              {user?.studentId || "FA23-BCS-042"}
            </p>
            <div className="mt-1 flex items-center gap-1.5">
              <Badge variant="info" className="text-[9px] py-0 px-1.5 h-4 bg-indigo-500/30 border-indigo-400/30 text-indigo-200">
                🎓 {user?.role || "STUDENT"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Student Portal Navigation
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                onSelectTab(item.key);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-bold"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-600"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.badge !== undefined && (
                  <Badge
                    variant={isActive ? "secondary" : item.badgeVariant || "outline"}
                    className={`text-[10px] px-1.5 py-0 h-4.5 font-bold ${
                      isActive ? "bg-white/20 text-white border-transparent" : ""
                    }`}
                  >
                    {item.badge}
                  </Badge>
                )}
                {isActive && <ChevronRight className="h-3.5 w-3.5 text-indigo-200 shrink-0" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Navigation */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2">
        <Link href="/admin/academics" className="block">
          <div className="p-2.5 rounded-xl border border-indigo-100 bg-indigo-50/60 hover:bg-indigo-100/60 transition-colors flex items-center justify-between text-indigo-950">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-indigo-600" />
              <span className="text-[11px] font-bold">Academic Schemes</span>
            </div>
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
          </div>
        </Link>

        <div className="flex items-center justify-between pt-1">
          <Link href="/login" className="w-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="w-full justify-start gap-2 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-8"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out Session
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  );
}
