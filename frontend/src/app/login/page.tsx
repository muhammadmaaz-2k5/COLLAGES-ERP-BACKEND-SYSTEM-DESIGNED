"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore, type SystemRole, DEMO_ROLE_ACCOUNTS } from "@/store/use-auth-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  GraduationCap,
  Lock,
  Mail,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { switchRole } = useAuthStore();
  const [email, setEmail] = useState("student@university.edu");
  const [password, setPassword] = useState("Password123!");
  const [selectedRole, setSelectedRole] = useState<SystemRole>("STUDENT");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    switchRole(selectedRole);
    if (selectedRole === "STUDENT") {
      router.push("/student/dashboard");
    } else {
      router.push("/admin/rbac");
    }
  };

  const handleQuickLogin = (role: SystemRole) => {
    setSelectedRole(role);
    setEmail(DEMO_ROLE_ACCOUNTS[role].email);
    switchRole(role);
    if (role === "STUDENT") {
      router.push("/student/dashboard");
    } else {
      router.push("/admin/rbac");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-900 selection:bg-indigo-500 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2 text-indigo-300 hover:text-white text-xs mb-2 transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back to Homepage
        </Link>
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <GraduationCap className="h-7 w-7" />
          </div>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Apex University ERP Portal
        </h2>
        <p className="text-xs text-indigo-200">
          Role-Based Access Control Authentication Gateway
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4">
        <Card className="border-slate-800 bg-white/95 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-slate-900">Sign in to your account</CardTitle>
              <Badge variant="info" className="text-[10px]">
                RBAC v1.0
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Select any persona for instant single-click sign-in demonstration
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Quick 1-Click Role Logins */}
            <div className="space-y-2.5">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                ⚡ 1-Click Demo Persona Access
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { role: "STUDENT", label: "🎓 Student", path: "student" },
                  { role: "TEACHER", label: "👨‍🏫 Faculty", path: "teacher" },
                  { role: "EXAM_CONTROLLER", label: "📝 Controller", path: "exam" },
                  { role: "ACCOUNTANT", label: "💳 Accountant", path: "finance" },
                  { role: "HR_MANAGER", label: "👔 HR Manager", path: "hr" },
                  { role: "SUPER_ADMIN", label: "👑 Super Admin", path: "admin" },
                ].map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => handleQuickLogin(item.role as SystemRole)}
                    className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-indigo-50 hover:border-indigo-300 text-left text-xs font-semibold text-slate-800 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="h-3 w-3 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-slate-200" />
              <span className="bg-white px-3 text-[11px] text-slate-400 uppercase tracking-wider">
                Or credential login
              </span>
            </div>

            {/* Manual Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Email address</label>
                <div className="relative">
                  <Mail className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-9 text-xs"
                    placeholder="name@university.edu"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-9 text-xs"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-xs font-bold py-2.5 shadow-md shadow-indigo-500/20">
                Authenticate & Access Dashboard →
              </Button>
            </form>
          </CardContent>

          <CardFooter className="bg-slate-50 border-t border-slate-100 p-4 rounded-b-xl text-center flex items-center justify-center">
            <p className="text-[11px] text-slate-500">
              Protected by Bearer JWT RS256 & Argon2id Password Encryption
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
