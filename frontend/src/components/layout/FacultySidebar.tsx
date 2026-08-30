"use client";

import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  LayoutDashboard,
  CalendarCheck2,
  FileCheck,
  HelpCircle,
  Award,
  BookOpen,
  PlayCircle,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/use-auth-store";

export type FacultyTabKey =
  | "overview"
  | "attendance"
  | "assignments"
  | "quizzes"
  | "gradebook"
  | "materials"
  | "videos";

interface FacultySidebarProps {
  activeTab: FacultyTabKey;
  onSelectTab: (tab: FacultyTabKey) => void;
  pendingGradingCount?: number;
}

export function FacultySidebar({ activeTab, onSelectTab, pendingGradingCount = 0 }: FacultySidebarProps) {
  const { user, logout } = useAuthStore();

  const navItems: { id: FacultyTabKey; label: string; icon: any; badge?: string | number; badgeVariant?: any }[] = [
    { id: "overview", label: "Workload & Schedule", icon: LayoutDashboard },
    { id: "attendance", label: "Class Attendance", icon: CalendarCheck2, badge: "Daily Marking", badgeVariant: "success" },
    { id: "assignments", label: "Assignment Desk", icon: FileCheck, badge: pendingGradingCount > 0 ? pendingGradingCount : undefined, badgeVariant: "warning" },
    { id: "quizzes", label: "Quiz & MCQ Builder", icon: HelpCircle },
    { id: "gradebook", label: "Sessional Gradebook", icon: Award, badge: "Fall 2026", badgeVariant: "info" },
    { id: "materials", label: "Course Materials (S3)", icon: BookOpen },
    { id: "videos", label: "Video Lectures (CDN)", icon: PlayCircle },
  ];

  return (
    <aside className="w-full lg:w-64 bg-slate-950 text-slate-100 flex flex-col justify-between border-r border-slate-800 shrink-0 min-h-[calc(100vh-4rem)] p-4">
      <div className="space-y-6">
        {/* Faculty Profile Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-500/30 flex items-center gap-3">
          <Avatar className="h-11 w-11 rounded-xl ring-2 ring-indigo-500/40">
            <AvatarImage src={user?.avatarUrl} alt="Dr. Sarah Jenkins" />
            <AvatarFallback className="bg-indigo-600 font-bold text-white">SJ</AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <h3 className="font-extrabold text-xs text-white truncate leading-snug">{user?.name || "Dr. Sarah Jenkins"}</h3>
            <p className="text-[11px] text-indigo-300 font-medium truncate">Faculty / Associate Prof</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-slate-400 font-mono">EMP-FAC-2021-089</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">Teaching & Workstation</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <Badge
                    variant={item.badgeVariant || "secondary"}
                    className="text-[9px] px-1.5 py-0 h-4 border-none"
                  >
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer System Status & Logout */}
      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Role: TEACHER (Level 60)</span>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => logout()}
          className="w-full justify-start text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 gap-2 h-8"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </Button>
      </div>
    </aside>
  );
}
